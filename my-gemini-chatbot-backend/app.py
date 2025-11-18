# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
import logging # Import logging for better error messages

# --- Firebase Admin SDK Imports and Initialization ---
import firebase_admin
from firebase_admin import credentials, firestore, auth # Import auth

# Setup basic logging
logging.basicConfig(level=logging.INFO)

# Determine if running in a deployed environment (like Render)
IS_PROD = os.environ.get('FLASK_ENV') == 'production'

if IS_PROD:
    # For production, get service account key from environment variable
    firebase_config_json = os.environ.get('FIREBASE_CONFIG_JSON')
    if firebase_config_json:
        cred = credentials.Certificate(json.loads(firebase_config_json))
    else:
        logging.warning("FIREBASE_CONFIG_JSON environment variable not found in production. Falling back to file.")
        cred_path = os.path.join(os.path.dirname(__file__), 'firebase_service_account.json')
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            raise Exception("Firebase service account key not found. Please set FIREBASE_CONFIG_JSON or place firebase_service_account.json.")
else:
    # For local development, load from file
    cred_path = os.path.join(os.path.dirname(__file__), 'firebase_service_account.json')
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firebase service account key not found at {cred_path}. Please download it from Firebase console.")
    cred = credentials.Certificate(cred_path)

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()
# --- End Firebase Initialization ---


app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# --- Firebase Authentication Helper Functions (NEW) ---
def create_new_firebase_user(email, password, username=None):
    """Creates a new user in Firebase Authentication."""
    try:
        user_record = auth.create_user(
            email=email,
            password=password,
            display_name=username
        )
        # Optionally, store additional user data in Firestore
        user_ref = db.collection('users').document(user_record.uid)
        user_ref.set({
            'email': email,
            'username': username,
            'created_at': firestore.SERVER_TIMESTAMP
        })
        logging.info(f"Successfully created new user: {user_record.uid}")
        return {"success": True, "uid": user_record.uid, "email": user_record.email, "message": "User created successfully."}
    except Exception as e:
        logging.error(f"Error creating Firebase user: {e}")
        return {"success": False, "error": str(e)}

def authenticate_firebase_user(email, password):
    """
    Simulates user authentication. Firebase Admin SDK does not directly
    support password-based login for security reasons.
    For actual user login, client-side Firebase Auth SDK is used to get ID tokens.
    This function is illustrative for Function Calling context.
    In a real scenario, you'd verify an ID token sent from the client.
    """
    logging.info(f"Attempting to 'authenticate' user: {email}. Note: This is simplified for function calling demo.")
    # For a real login, you'd typically receive a Firebase ID Token from the client
    # and verify it using auth.verify_id_token(id_token).
    # This simplified version just checks if a user with that email exists.
    try:
        user = auth.get_user_by_email(email)
        # In a real app, you would not verify password on backend like this.
        # This is purely for the demo purpose of having a 'login' function.
        # The AI would 'call' this function, and then you'd instruct the user
        # to log in securely on the frontend.
        logging.info(f"User {email} found. Simplified 'authentication' successful.")
        return {"success": True, "uid": user.uid, "email": user.email, "message": "User authenticated successfully (simplified)."}
    except auth.UserNotFoundError:
        logging.warning(f"Authentication failed: User {email} not found.")
        return {"success": False, "error": "User not found."}
    except Exception as e:
        logging.error(f"Error during Firebase user authentication: {e}")
        return {"success": False, "error": f"Authentication error: {e}"}

# --- End Firebase Authentication Helper Functions ---


# --- Define Tools for Gemini (NEW) ---
# These describe the functions Gemini can "call"
tools = genai.GenerativeModel(model_name='gemini-1.5-flash').tools = [
    genai.protos.FunctionDeclaration(
        name='create_new_firebase_user',
        description='Creates a new user account in the system with a given email, password, and optional username.',
        parameters=genai.protos.Schema(
            type=genai.protos.Type.OBJECT,
            properties={
                'email': genai.protos.Schema(type=genai.protos.Type.STRING, description='The email address for the new user account.'),
                'password': genai.protos.Schema(type=genai.protos.Type.STRING, description='The password for the new user account. Must be at least 6 characters long.'),
                'username': genai.protos.Schema(type=genai.protos.Type.STRING, description='An optional username for the new user account.'),
            },
            required=['email', 'password']
        )
    ),
    genai.protos.FunctionDeclaration(
        name='authenticate_firebase_user',
        description='Logs in an existing user with their email and password. (Note: This is a simplified backend authentication for AI to call. Real login involves client-side Firebase Auth SDK).',
        parameters=genai.protos.Schema(
            type=genai.protos.Type.OBJECT,
            properties={
                'email': genai.protos.Schema(type=genai.protos.Type.STRING, description='The email address of the user.'),
                'password': genai.protos.Schema(type=genai.protos.Type.STRING, description='The password of the user.'),
            },
            required=['email', 'password']
        )
    )
]

# Initialize the generative model with the defined tools
# Make sure to pass the tools here
model = genai.GenerativeModel('gemini-1.5-flash', tools=tools)


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    history_from_frontend = data.get('history', [])

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Convert frontend history format to Gemini's expected format
    gemini_history = []
    for msg in history_from_frontend:
        text_content = msg.get('text', '')
        if text_content:
            gemini_history.append({"role": "user" if msg['sender'] == 'user' else "model", "parts": [text_content]})

    try:
        # Start a new chat session with the converted history and the tools
        chat_session = model.start_chat(history=gemini_history)
        response = chat_session.send_message(user_message)

        # --- Handle Function Calls (NEW) ---
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.function_call:
                    function_name = part.function_call.name
                    function_args = {k: v for k, v in part.function_call.args.items()} # Convert protobuf map to Python dict
                    
                    logging.info(f"Gemini requested function call: {function_name} with args: {function_args}")

                    # Execute the function based on the name
                    if function_name == 'create_new_firebase_user':
                        result = create_new_firebase_user(
                            email=function_args.get('email'),
                            password=function_args.get('password'),
                            username=function_args.get('username')
                        )
                        # Send the function result back to Gemini for a natural language response
                        response_with_tool_result = chat_session.send_message(
                            genai.protos.Part(
                                function_response=genai.protos.FunctionResponse(
                                    name=function_name,
                                    response=json.dumps(result) # Send result as JSON string
                                )
                            )
                        )
                        return jsonify({"aiResponse": response_with_tool_result.text})

                    elif function_name == 'authenticate_firebase_user':
                        result = authenticate_firebase_user(
                            email=function_args.get('email'),
                            password=function_args.get('password')
                        )
                        # Send the function result back to Gemini for a natural language response
                        response_with_tool_result = chat_session.send_message(
                            genai.protos.Part(
                                function_response=genai.protos.FunctionResponse(
                                    name=function_name,
                                    response=json.dumps(result) # Send result as JSON string
                                )
                            )
                        )
                        return jsonify({"aiResponse": response_with_tool_result.text})
                    else:
                        logging.warning(f"Unknown function call requested by Gemini: {function_name}")
                        return jsonify({"aiResponse": "I'm sorry, I can't perform that action."})

        # If no function call, return the direct text response from Gemini
        return jsonify({"aiResponse": response.text})

    except Exception as e:
        logging.error(f"Error calling Gemini API or processing response: {e}")
        # Log specific details if possible, e.g., print(traceback.format_exc())
        return jsonify({"error": "Failed to get response from AI or process function call"}), 500

# --- New API Endpoint for Products ---
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products_ref = db.collection('products')
        docs = products_ref.stream()

        products_list = []
        for doc in docs:
            product_data = doc.to_dict()
            product_data['id'] = doc.id
            products_list.append(product_data)

        return jsonify(products_list), 200
    except Exception as e:
        logging.error(f"Error fetching products from Firestore: {e}")
        return jsonify({"error": "Failed to fetch products"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
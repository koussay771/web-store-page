#!/usr/bin/env bash

# 1. Build the Frontend (React App)
# Note: Render needs the build output in a specific place (e.g., /public or /static)
# We will just run the build command, and the Flask app will serve the index.html

echo "--- Building Frontend ---"
cd my-gemini-chatbot-frontend
npm install
npm run build
cd ..

# 2. Install Backend Dependencies
echo "--- Installing Backend ---"
#!/usr/bin/env bash

# 1. Build the Frontend (React App)
echo "--- Building Frontend ---"
cd my-gemini-chatbot-frontend
npm install
npm run build
cd ..

# 2. Install Backend Dependencies (تعديل المسار هنا)
echo "--- Installing Backend ---"
pip install -r my-gemini-chatbot-backend/requirements.txt
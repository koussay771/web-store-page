// src/WelcomeAnimation.jsx
import React, { useState, useEffect } from 'react';

const WelcomeAnimation = ({ onAnimationComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [animationPhase, setAnimationPhase] = useState('entering'); // 'entering', 'active', 'exiting'

    useEffect(() => {
        // Phase 1: Fade In & Float Up
        const enterTimer = setTimeout(() => {
            setAnimationPhase('active');
        }, 100); // Small delay to ensure the 'entering' class applies before 'active' starts

        // Phase 2: Fade Out & Continue Floating Up
        const exitTimer = setTimeout(() => {
            setAnimationPhase('exiting');
        }, 2000); // Stays "active" for 1.9s, then starts exiting

        // Phase 3: Remove Component
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, 3500); // Total animation duration: 100ms (entering) + 1900ms (active) + 1500ms (exiting) = 3.5s

        // Cleanup timers if the component unmounts prematurely
        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, [onAnimationComplete]);

    if (!isVisible) {
        return null; // Don't render anything once animation is complete
    }

    return (
        <div className={`
            fixed inset-0 flex items-center justify-center bg-zinc-900 z-50
            text-white font-bold
            transition-all duration-1500 ease-in-out
            ${animationPhase === 'entering' ? 'opacity-0 translate-y-20' : ''}
            ${animationPhase === 'active' ? 'opacity-100 translate-y-0' : ''}
            ${animationPhase === 'exiting' ? 'opacity-0 -translate-y-20' : ''}
        `}>
            {/* The actual "Welcome" text. You can adjust font size via Tailwind classes */}
            <span className="text-8xl md:text-9xl tracking-tight leading-none text-zinc-200">
                Welcome
            </span>
        </div>
    );
};

export default WelcomeAnimation;
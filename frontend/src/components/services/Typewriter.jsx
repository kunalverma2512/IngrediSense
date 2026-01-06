import { useState, useEffect } from 'react';

const Typewriter = ({ texts, className }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        const currentFullText = texts[currentTextIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentCharIndex < currentFullText.length) {
                    setDisplayText(currentFullText.substring(0, currentCharIndex + 1));
                    setCurrentCharIndex(currentCharIndex + 1);
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (currentCharIndex > 0) {
                    setDisplayText(currentFullText.substring(0, currentCharIndex - 1));
                    setCurrentCharIndex(currentCharIndex - 1);
                } else {
                    setIsDeleting(false);
                    setCurrentTextIndex((currentTextIndex + 1) % texts.length);
                }
            }
        }, isDeleting ? 30 : 80);

        return () => clearTimeout(timeout);
    }, [currentCharIndex, isDeleting, currentTextIndex, texts]);

    return (
        <span className={className}>
            {displayText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

export default Typewriter;

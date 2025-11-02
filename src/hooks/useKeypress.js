import { useEffect, useState } from 'react';

export const useKeypress = (handler, keys) => {
    const [pressed, setPressed] = useState(new Set());

    useEffect(() => {
        const keydownListener = (event) => {
            setPressed((currentPressed) => {
                currentPressed.add(event.key);
                return new Set(currentPressed);
            });
        };
        const keyupListener = (event) => {
            setPressed((currentPressed) => {
                currentPressed.delete(event.key);
                return new Set(currentPressed);
            });
        };

        document.addEventListener('keydown', keydownListener);
        document.addEventListener('keyup', keyupListener);

        return () => {
            document.removeEventListener('keydown', keydownListener);
            document.removeEventListener('keyup', keyupListener);
        };
    }, []);

    useEffect(() => {
        if (keys.every((key) => pressed.has(key))) {
            handler();
        }
    }, [keys, pressed, handler]);
};

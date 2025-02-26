// __mocks__/framer-motion.js (or your Jest setup file)
import React from 'react';

const FakeMotion = React.forwardRef((props, ref) => {
    const { children, dragConstraints, dragElastic, onDragEnd, ...rest } = props;

    console.log("LOOOOOOOOOOOOOOOOADED");

    const handleDragEnd = (e) => {
        // Pass along the detail if available; otherwise provide defaults.
        const detail = e.detail || { offset: { x: 0 }, velocity: { x: 0 } };
        if (onDragEnd) {
            onDragEnd(e, detail);
        }
    };

    return (
        <div ref={ref} {...rest} onDragEnd={handleDragEnd}>
            {children}
        </div>
    );
});

export const motion = {
    div: FakeMotion,
    img: FakeMotion,
};

export const AnimatePresence = ({ children }) => <>{children}</>;

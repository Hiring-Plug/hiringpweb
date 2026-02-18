import React from 'react';

const Skeleton = ({ width, height, borderRadius, circle, className = '', style = {} }) => {
    const baseStyle = {
        width: width || '100%',
        height: height || '1rem',
        borderRadius: circle ? '50%' : (borderRadius || '4px'),
        ...style
    };

    return (
        <div
            className={`skeleton ${circle ? 'skeleton-circle' : ''} ${className}`}
            style={baseStyle}
        />
    );
};

export default Skeleton;

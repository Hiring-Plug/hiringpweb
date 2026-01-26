
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, size = 'md' }) => {
    // Base styles
    const baseStyle = {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontFamily: 'inherit',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        opacity: disabled ? 0.6 : 1,
        gap: '8px',
        textDecoration: 'none',
    };

    // Size variants
    const sizes = {
        sm: { padding: '6px 16px', fontSize: '0.85rem' },
        md: { padding: '10px 24px', fontSize: '1rem' },
        lg: { padding: '14px 32px', fontSize: '1.1rem' },
    };

    // Style variants
    const variants = {
        primary: {
            background: 'var(--primary-orange)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(237, 80, 0, 0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        secondary: {
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        },
        outline: {
            background: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
        },
        ghost: {
            background: 'transparent',
            color: '#aaa',
            padding: '8px', // Minimal padding
        },
        danger: {
            background: 'rgba(231, 76, 60, 0.15)',
            color: '#e74c3c',
            border: '1px solid rgba(231, 76, 60, 0.3)',
        },
        glow: {
            background: 'linear-gradient(135deg, var(--primary-orange) 0%, #ED5000 100%)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(237, 80, 0, 0.6), inset 0 0 10px rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.2)',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }
    };

    const combinedStyle = {
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`premium-btn ${className}`}
            style={combinedStyle}
            disabled={disabled}
            onMouseEnter={(e) => {
                if (disabled) return;
                e.currentTarget.style.transform = 'translateY(-2px)';
                if (variant === 'primary') {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(237, 80, 0, 0.5)';
                } else if (variant === 'glow') {
                    // Match primary on hover: flat orange + same shadow
                    e.currentTarget.style.background = 'var(--primary-orange)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(237, 80, 0, 0.5)';
                } else if (variant === 'secondary') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                } else if (variant === 'outline') {
                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                }
            }}
            onMouseLeave={(e) => {
                if (disabled) return;
                e.currentTarget.style.transform = 'translateY(0)';
                if (variant === 'primary') {
                    e.currentTarget.style.boxShadow = variants.primary.boxShadow;
                } else if (variant === 'glow') {
                    e.currentTarget.style.background = variants.glow.background; // Reset to gradient
                    e.currentTarget.style.boxShadow = variants.glow.boxShadow;
                } else if (variant === 'secondary') {
                    e.currentTarget.style.background = variants.secondary.background;
                    e.currentTarget.style.borderColor = variants.secondary.border.split(' ')[2];
                } else if (variant === 'outline') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = '#fff';
                }
            }}
        >
            {children}
        </button>
    );
};

export default Button;

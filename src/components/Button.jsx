const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    let buttonStyle = {
        padding: '0.8rem 1.5rem',
        borderRadius: '5px',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'inline-block',
    };

    if (variant === 'primary') {
        buttonStyle = {
            ...buttonStyle,
            backgroundColor: 'var(--primary-orange)',
            color: '#fff',
            border: '1px solid transparent', // Reserve space for hover border
        };
    } else if (variant === 'secondary') {
        buttonStyle = {
            ...buttonStyle,
            backgroundColor: 'transparent',
            border: '1px solid var(--primary-orange)',
            color: 'var(--primary-orange)',
        };
    } else if (variant === 'gradient') {
        buttonStyle = {
            ...buttonStyle,
            backgroundColor: 'var(--primary-orange)',
            color: '#fff',
            border: '1px solid transparent',
        };
    }

    return (
        <button
            onClick={onClick}
            className={`btn-${variant} ${className}`}
            style={buttonStyle}
            onMouseOver={(e) => {
                if (variant === 'primary' || variant === 'gradient') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--primary-orange)';
                    e.target.style.borderColor = 'var(--primary-orange)';
                    e.target.style.boxShadow = '0 0 10px rgba(237, 80, 0, 0.5)';
                }
                if (variant === 'secondary') {
                    e.target.style.backgroundColor = 'var(--primary-orange)';
                    e.target.style.color = 'white';
                    e.target.style.boxShadow = '0 0 10px rgba(237, 80, 0, 0.5)';
                }
            }}
            onMouseOut={(e) => {
                if (variant === 'primary' || variant === 'gradient') {
                    e.target.style.backgroundColor = 'var(--primary-orange)';
                    e.target.style.color = '#fff';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.boxShadow = 'none';
                }
                if (variant === 'secondary') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--primary-orange)';
                    e.target.style.boxShadow = 'none';
                }
            }}
        >
            {children}
        </button>
    );
};

export default Button;

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
        };
    } else if (variant === 'secondary') {
        buttonStyle = {
            ...buttonStyle,
            backgroundColor: 'transparent',
            border: '2px solid var(--primary-orange)',
            color: 'var(--primary-orange)',
        };
    } else if (variant === 'gradient') {
        buttonStyle = {
            ...buttonStyle,
            background: 'var(--accent-gradient)',
            color: '#000',
        };
    }

    return (
        <button
            onClick={onClick}
            className={`btn-${variant} ${className}`}
            style={buttonStyle}
            onMouseOver={(e) => {
                if (variant === 'primary') e.target.style.backgroundColor = 'var(--secondary-yellow)';
                if (variant === 'primary') e.target.style.color = 'black';
                if (variant === 'secondary') e.target.style.backgroundColor = 'var(--primary-orange)';
                if (variant === 'secondary') e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
                if (variant === 'primary') e.target.style.backgroundColor = 'var(--primary-orange)';
                if (variant === 'primary') e.target.style.color = 'white';
                if (variant === 'secondary') e.target.style.backgroundColor = 'transparent';
                if (variant === 'secondary') e.target.style.color = 'var(--primary-orange)';
            }}
        >
            {children}
        </button>
    );
};

export default Button;

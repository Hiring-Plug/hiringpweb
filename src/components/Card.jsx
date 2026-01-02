const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {title && <h3>{title}</h3>}
            <div className="card-content">
                {children}
            </div>
            <style>{`
                .card {
                    background-color: var(--bg-card);
                    padding: 2rem;
                    border-radius: 8px;
                    border: 1px solid #333;
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary-orange);
                }
                .card h3 {
                    margin-bottom: 1rem;
                    color: var(--primary-orange);
                }
            `}</style>
        </div>
    );
};

export default Card;

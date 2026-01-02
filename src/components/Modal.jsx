import { FaTimes } from 'react-icons/fa';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }

                .modal-content {
                    background: var(--bg-card);
                    width: 90%;
                    max-width: 500px;
                    border-radius: 12px;
                    border: 1px solid #333;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #222;
                }

                .modal-header h3 {
                    margin: 0;
                    color: var(--primary-orange);
                    font-size: 1.5rem;
                }

                .close-btn {
                    color: #666;
                    font-size: 1.2rem;
                    transition: color 0.3s;
                }
                .close-btn:hover { color: #fff; }

                .modal-body {
                    padding: 1.5rem;
                }

                .modal-form-group {
                    margin-bottom: 1rem;
                }
                .modal-form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #ccc;
                    font-size: 0.9rem;
                }
                .modal-form-group input, .modal-form-group textarea {
                    width: 100%;
                    padding: 0.8rem;
                    background: #000;
                    border: 1px solid #333;
                    border-radius: 4px;
                    color: white;
                    font-family: inherit;
                }
                .modal-form-group input:focus, .modal-form-group textarea:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                }
            `}</style>
        </div>
    );
};

export default Modal;

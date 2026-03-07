import { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast ${toast.type}`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && <FaCheckCircle />}
                            {toast.type === 'error' && <FaExclamationCircle />}
                            {toast.type === 'info' && <FaInfoCircle />}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                .toast-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    z-index: 10000;
                    pointer-events: none;
                }
                .toast {
                    pointer-events: auto;
                    min-width: 300px;
                    max-width: 450px;
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    color: #fff;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .toast.success { border-left: 4px solid #4cd137; }
                .toast.error { border-left: 4px solid #e74c3c; }
                .toast.info { border-left: 4px solid var(--primary-orange); }

                .toast-icon { font-size: 1.2rem; display: flex; align-items: center; }
                .toast.success .toast-icon { color: #4cd137; }
                .toast.error .toast-icon { color: #e74c3c; }
                .toast.info .toast-icon { color: var(--primary-orange); }

                .toast-message { flex: 1; font-size: 0.95rem; font-weight: 500; }
                .toast-close {
                    background: none;
                    border: none;
                    color: #555;
                    cursor: pointer;
                    padding: 4px;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                }
                .toast-close:hover { color: #fff; }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

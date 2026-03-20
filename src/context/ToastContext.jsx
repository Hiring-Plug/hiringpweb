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
                    top: 24px;
                    right: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    z-index: 10000;
                    pointer-events: none;
                }
                .toast {
                    pointer-events: auto;
                    min-width: 220px;
                    max-width: 360px;
                    background: rgba(10, 10, 10, 0.75);
                    backdrop-filter: blur(16px) saturate(180%);
                    -webkit-backdrop-filter: blur(16px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                    padding: 8px 14px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    animation: toastSlideIn 0.4s cubic-bezier(0.2, 1, 0.3, 1);
                    color: #fff;
                    transition: all 0.3s;
                }
                @keyframes toastSlideIn {
                    from { transform: translateX(30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .toast.success { border-left: 3px solid #4cd137; }
                .toast.error { border-left: 3px solid #e74c3c; }
                .toast.info { border-left: 3px solid #ED5000; }

                .toast-icon { 
                    font-size: 1.3rem; 
                    display: flex; 
                    align-items: center;
                    padding: 8px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.05);
                }
                .toast.success .toast-icon { color: #4cd137; background: rgba(76, 209, 55, 0.1); }
                .toast.error .toast-icon { color: #e74c3c; background: rgba(231, 76, 60, 0.1); }
                .toast.info .toast-icon { color: #ED5000; background: rgba(237, 80, 0, 0.1); }

                .toast-message { flex: 1; font-size: 0.95rem; font-weight: 600; letter-spacing: -0.01em; }
                .toast-close {
                    background: rgba(255,255,255,0.05);
                    border: none;
                    color: #666;
                    cursor: pointer;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .toast-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

                @media (max-width: 480px) {
                    .toast-container {
                        top: auto;
                        bottom: 20px;
                        left: 20px;
                        right: 20px;
                    }
                    .toast {
                        min-width: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

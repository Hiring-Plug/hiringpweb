import React, { createContext, useContext, useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast ${toast.type}`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && <FaCheckCircle style={{ color: '#4cd137' }} />}
                            {toast.type === 'error' && <FaExclamationCircle style={{ color: '#e74c3c' }} />}
                            {toast.type === 'info' && <FaInfoCircle style={{ color: '#ED5000' }} />}
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
                    gap: 10px;
                    z-index: 9999;
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
                    gap: 12px;
                    color: white;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .toast.success { border-left: 3px solid #4cd137; }
                .toast.error { border-left: 3px solid #e74c3c; }
                .toast.info { border-left: 3px solid #ED5000; }

                .toast-icon { 
                    font-size: 1.1rem; 
                    display: flex; 
                    align-items: center;
                    padding: 6px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.03);
                }

                .toast-message { 
                    flex: 1; 
                    font-size: 0.9rem; 
                    font-weight: 500; 
                    letter-spacing: -0.01em;
                    line-height: 1.4;
                    opacity: 0.95;
                }

                .toast-close {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.4);
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }

                .toast-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%) scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

import { createContext, useContext, useState, useCallback } from 'react';
import Button from './Button';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState(null);

    const confirm = useCallback((message, options = {}) => {
        return new Promise((resolve) => {
            setConfig({
                message,
                title: options.title || 'Are you sure?',
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                variant: options.variant || 'primary',
                resolve
            });
        });
    }, []);

    const handleCancel = () => {
        if (config) config.resolve(false);
        setConfig(null);
    };

    const handleConfirm = () => {
        if (config) config.resolve(true);
        setConfig(null);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {config && (
                <div className="confirm-overlay" onClick={handleCancel}>
                    <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
                        <div className="confirm-content">
                            <h3>{config.title}</h3>
                            <p>{config.message}</p>
                        </div>
                        <div className="confirm-actions">
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                {config.cancelText}
                            </Button>
                            <Button variant={config.variant} size="sm" onClick={handleConfirm}>
                                {config.confirmText}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .confirm-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(12px) saturate(180%);
                    -webkit-backdrop-filter: blur(12px) saturate(180%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 11000;
                    animation: confirmFadeIn 0.3s ease-out;
                }
                @keyframes confirmFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .confirm-dialog {
                    background: rgba(15, 15, 15, 0.85);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    width: 90%;
                    max-width: 420px;
                    padding: 32px;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.8);
                    animation: confirmScaleUp 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                }
                @keyframes confirmScaleUp {
                    from { transform: scale(0.95) translateY(10px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .confirm-content h3 {
                    margin: 0 0 16px 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #fff;
                }
                .confirm-content p {
                    margin: 0 0 32px 0;
                    color: #aaa;
                    line-height: 1.6;
                    font-size: 1rem;
                }
                .confirm-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                }

                @media (max-width: 480px) {
                    .confirm-dialog {
                        padding: 24px;
                        width: 95%;
                    }
                    .confirm-content h3 { font-size: 1.25rem; }
                }
            `}</style>
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error('useConfirm must be used within a ConfirmProvider');
    return context;
};

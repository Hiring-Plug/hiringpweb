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
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 11000;
                    animation: fadeIn 0.2s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .confirm-dialog {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 400px;
                    padding: 24px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes scaleUp {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .confirm-content h3 {
                    margin: 0 0 12px 0;
                    font-size: 1.25rem;
                    color: #fff;
                }
                .confirm-content p {
                    margin: 0 0 24px 0;
                    color: #888;
                    line-height: 1.5;
                }
                .confirm-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
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


import Modal from './Modal';
import { FaGithub, FaDownload, FaFileAlt } from 'react-icons/fa';

const WhitepaperModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Access Whitepaper" maxWidth="450px">
            <div className="whitepaper-options">
                <div className="option-info">
                    <FaFileAlt className="main-doc-icon" />
                    <p>Hiring Plug Whitepaper v1.0.0.1</p>
                </div>

                <div className="options-grid">
                    <a
                        href="https://github.com/Hiring-Plug/hiringpweb/blob/main/Documents/Hiring%20Plug%20Whitepaper%201.0.0.1.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="wp-option github"
                    >
                        <FaGithub />
                        <span>View on GitHub</span>
                    </a>

                    <a
                        href="/hiring-plug-whitepaper.pdf"
                        download="Hiring-Plug-Whitepaper.pdf"
                        className="wp-option download"
                        onClick={onClose}
                    >
                        <FaDownload />
                        <span>Download PDF</span>
                    </a>
                </div>
            </div>

            <style>{`
                .whitepaper-options {
                    text-align: center;
                    padding: 1rem 0;
                }
                .option-info {
                    margin-bottom: 2rem;
                }
                .main-doc-icon {
                    font-size: 3rem;
                    color: var(--primary-orange);
                    margin-bottom: 1rem;
                    filter: drop-shadow(0 0 10px rgba(237, 80, 0, 0.3));
                }
                .option-info p {
                    color: #aaa;
                    font-size: 0.95rem;
                }
                .options-grid {
                    display: grid;
                    gap: 1rem;
                }
                .wp-option {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 1.2rem;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border: 1px solid #333;
                }
                .wp-option.github {
                    background: #24292e;
                    color: white;
                }
                .wp-option.github:hover {
                    background: #23282d;
                    border-color: #444;
                    transform: translateY(-2px);
                }
                .wp-option.download {
                    background: linear-gradient(135deg, var(--primary-orange) 0%, #ff8c00 100%);
                    color: white;
                    border: none;
                }
                .wp-option.download:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(237, 80, 0, 0.4);
                }
            `}</style>
        </Modal>
    );
};

export default WhitepaperModal;

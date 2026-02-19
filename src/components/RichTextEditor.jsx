import React, { useRef } from 'react';
import { FaBold, FaItalic, FaListUl } from 'react-icons/fa';

const RichTextEditor = ({ value, onChange, placeholder, label, required = false }) => {
    const textareaRef = useRef(null);

    const insertText = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);

        onChange(newText);

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <div className="rich-text-editor">
            {label && <label>{label}{required && <span style={{ color: '#ed5000' }}> *</span>}</label>}
            <div className="editor-controls">
                <button type="button" onClick={() => insertText('**', '**')} title="Bold">
                    <FaBold />
                </button>
                <button type="button" onClick={() => insertText('_', '_')} title="Italic">
                    <FaItalic />
                </button>
                <button type="button" onClick={() => insertText('\n- ')} title="Bullet Points">
                    <FaListUl />
                </button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                rows="5"
            />
            <style>{`
                .rich-text-editor {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .editor-controls {
                    display: flex;
                    gap: 0.5rem;
                    background: #1a1a1a;
                    padding: 0.5rem;
                    border: 1px solid #333;
                    border-bottom: none;
                    border-radius: 8px 8px 0 0;
                }
                .editor-controls button {
                    background: transparent;
                    border: 1px solid #444;
                    color: #fff;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .editor-controls button:hover {
                    background: #333;
                    border-color: var(--primary-orange);
                    color: var(--primary-orange);
                }
                .rich-text-editor textarea {
                    width: 100%;
                    background: #050505;
                    border: 1px solid #333;
                    padding: 0.8rem;
                    border-radius: 0 0 8px 8px;
                    color: white;
                    resize: vertical;
                    min-height: 120px;
                    font-family: inherit;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .rich-text-editor textarea:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                    box-shadow: 0 0 0 1px var(--primary-orange);
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;

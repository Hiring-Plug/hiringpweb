import { useRef } from 'react';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaHeading, FaParagraph } from 'react-icons/fa';

const RichTextEditor = ({ value = '', onChange, placeholder, label, required = false, rows = 6 }) => {
    const textareaRef = useRef(null);

    const insertText = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value || '';
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const text = textarea.value || '';

            // Find the start of the current line
            const lastNewLine = text.lastIndexOf('\n', start - 1);
            const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
            const currentLine = text.substring(lineStart, start);

            // 1. Check for bullet list (- or *)
            const bulletMatch = currentLine.match(/^(\s*[-\*]\s+)/);
            if (bulletMatch) {
                e.preventDefault();
                const bullet = bulletMatch[1];

                // If line is just the bullet symbol, clear it to end list
                if (currentLine.trim() === '-' || currentLine.trim() === '*') {
                    const newText = text.substring(0, lineStart) + text.substring(start);
                    onChange(newText);
                    setTimeout(() => {
                        textarea.setSelectionRange(lineStart, lineStart);
                    }, 0);
                } else {
                    const before = text.substring(0, start);
                    const after = text.substring(start);
                    const newText = before + '\n' + bullet + after;
                    onChange(newText);

                    setTimeout(() => {
                        const newPos = start + 1 + bullet.length;
                        textarea.setSelectionRange(newPos, newPos);
                    }, 0);
                }
                return;
            }

            // 2. Check for numbered list (e.g. 1. )
            const numMatch = currentLine.match(/^(\s*(\d+)\.\s+)/);
            if (numMatch) {
                e.preventDefault();
                const fullPrefix = numMatch[1];
                const currentNum = parseInt(numMatch[2], 10);

                if (currentLine.trim() === `${currentNum}.`) {
                    const newText = text.substring(0, lineStart) + text.substring(start);
                    onChange(newText);
                    setTimeout(() => {
                        textarea.setSelectionRange(lineStart, lineStart);
                    }, 0);
                } else {
                    const nextPrefix = `${currentNum + 1}. `;
                    const before = text.substring(0, start);
                    const after = text.substring(start);
                    const newText = before + '\n' + nextPrefix + after;
                    onChange(newText);

                    setTimeout(() => {
                        const newPos = start + 1 + nextPrefix.length;
                        textarea.setSelectionRange(newPos, newPos);
                    }, 0);
                }
            }
        }
    };

    return (
        <div className="rich-text-editor">
            {label && <label>{label}{required && <span style={{ color: '#ed5000' }}> *</span>}</label>}
            <div className="editor-controls">
                <button type="button" onClick={() => insertText('### ')} title="Heading">
                    <FaHeading /> <span className="btn-label">H3</span>
                </button>
                <button type="button" onClick={() => insertText('**', '**')} title="Bold (**text**)">
                    <FaBold />
                </button>
                <button type="button" onClick={() => insertText('_', '_')} title="Italic (_text_)">
                    <FaItalic />
                </button>
                <button type="button" onClick={() => insertText('<u>', '</u>')} title="Underline">
                    <FaUnderline />
                </button>
                <span className="editor-divider" />
                <button type="button" onClick={() => insertText('\n- ')} title="Bullet List (- item)">
                    <FaListUl />
                </button>
                <button type="button" onClick={() => insertText('\n1. ')} title="Numbered List (1. item)">
                    <FaListOl />
                </button>
                <button type="button" onClick={() => insertText('\n\n')} title="Paragraph Spacing">
                    <FaParagraph />
                </button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                required={required}
                rows={rows}
            />
            <style>{`
                .rich-text-editor {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }
                .editor-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: #141414;
                    padding: 0.4rem 0.6rem;
                    border: 1px solid #2a2a2a;
                    border-bottom: none;
                    border-radius: 8px 8px 0 0;
                }
                .editor-controls button {
                    background: #1c1c1c;
                    border: 1px solid #333;
                    color: #bbb;
                    padding: 5px 9px;
                    border-radius: 5px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.8rem;
                    transition: all 0.15s ease;
                }
                .editor-controls button .btn-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                }
                .editor-controls button:hover {
                    background: #282828;
                    border-color: var(--primary-orange, #ff6b00);
                    color: #fff;
                }
                .editor-divider {
                    width: 1px;
                    height: 18px;
                    background: #333;
                    margin: 0 4px;
                }
                .rich-text-editor textarea {
                    width: 100%;
                    background: #090909;
                    border: 1px solid #2a2a2a;
                    padding: 0.85rem;
                    border-radius: 0 0 8px 8px;
                    color: #fff;
                    resize: vertical;
                    min-height: 120px;
                    font-family: inherit;
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                .rich-text-editor textarea:focus {
                    outline: none;
                    border-color: var(--primary-orange, #ff6b00);
                    box-shadow: 0 0 0 1px var(--primary-orange, #ff6b00);
                    background: #0d0d0d;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;

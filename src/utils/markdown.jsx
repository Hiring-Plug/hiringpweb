import React from 'react';

/**
 * Enhanced markdown parser that converts syntax to rich JSX.
 * Supports:
 * - Headings: #, ##, ###
 * - Bold: **text**
 * - Italic: _text_ or *text*
 * - Underline: <u>text</u> or __text__
 * - Bullet Points: - item or * item
 * - Numbered Lists: 1. item
 * - Paragraph breaks and line spacing
 */
export const parseMarkdown = (text) => {
    if (!text) return null;

    const processedText = String(text).replace(/\r\n/g, '\n');
    const lines = processedText.split('\n');

    let result = [];
    let listItems = [];
    let listType = null; // 'ul' | 'ol'

    const flushList = () => {
        if (listItems.length > 0) {
            if (listType === 'ol') {
                result.push(
                    <ol key={`ol-${result.length}`} className="markdown-ol">
                        {listItems}
                    </ol>
                );
            } else {
                result.push(
                    <ul key={`ul-${result.length}`} className="markdown-ul">
                        {listItems}
                    </ul>
                );
            }
            listItems = [];
            listType = null;
        }
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // 1. Headings
        if (trimmed.startsWith('### ')) {
            flushList();
            result.push(<h4 key={`h3-${index}`} className="markdown-h3">{formatInline(trimmed.substring(4), index)}</h4>);
        } else if (trimmed.startsWith('## ')) {
            flushList();
            result.push(<h3 key={`h2-${index}`} className="markdown-h2">{formatInline(trimmed.substring(3), index)}</h3>);
        } else if (trimmed.startsWith('# ')) {
            flushList();
            result.push(<h2 key={`h1-${index}`} className="markdown-h1">{formatInline(trimmed.substring(2), index)}</h2>);
        }
        // 2. Numbered list (e.g. "1. ")
        else if (/^\d+\.\s+/.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s+/, '');
            if (listType && listType !== 'ol') flushList();
            listType = 'ol';
            listItems.push(<li key={`oli-${index}`}>{formatInline(content, index)}</li>);
        }
        // 3. Bullet list (e.g. "- " or "* ")
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            if (listType && listType !== 'ul') flushList();
            listType = 'ul';
            listItems.push(<li key={`uli-${index}`}>{formatInline(content, index)}</li>);
        }
        // 4. Empty line (Paragraph separation)
        else if (trimmed === '') {
            flushList();
        }
        // 5. Standard paragraph
        else {
            flushList();
            result.push(<p key={`p-${index}`} className="markdown-p">{formatInline(line, index)}</p>);
        }
    });

    flushList();

    return (
        <div className="rich-content-render">
            {result}
            <style>{`
                .rich-content-render {
                    color: #ddd;
                    line-height: 1.7;
                    font-size: 0.95rem;
                }
                .rich-content-render p.markdown-p {
                    margin: 0 0 1rem 0;
                    color: #ddd;
                    white-space: pre-line;
                }
                .rich-content-render .markdown-ul,
                .rich-content-render .markdown-ol {
                    margin: 0.5rem 0 1.25rem 1.25rem;
                    padding-left: 0.75rem;
                }
                .rich-content-render .markdown-ul {
                    list-style-type: disc;
                }
                .rich-content-render .markdown-ol {
                    list-style-type: decimal;
                }
                .rich-content-render li {
                    margin-bottom: 0.4rem;
                    line-height: 1.6;
                    color: #eee;
                }
                .rich-content-render h1,
                .rich-content-render h2,
                .rich-content-render h3,
                .rich-content-render h4 {
                    color: #fff;
                    margin: 1.25rem 0 0.5rem 0;
                    font-weight: 700;
                }
                .rich-content-render h4 { font-size: 1.1rem; }
                .rich-content-render h3 { font-size: 1.2rem; }
                .rich-content-render h2 { font-size: 1.35rem; }
                .rich-content-render strong {
                    color: #fff;
                    font-weight: 700;
                }
                .rich-content-render em {
                    color: #ccc;
                    font-style: italic;
                }
                .rich-content-render u {
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
            `}</style>
        </div>
    );
};

const formatInline = (text, lineKey) => {
    if (typeof text !== 'string') return text;

    // Splits text by <u>...</u>, **...**, __...__, *...*, _..._
    const regex = /(<u>.*?<\/u>|\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('<u>') && part.endsWith('</u>')) {
            return <u key={`${lineKey}-u-${i}`}>{part.slice(3, -4)}</u>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`${lineKey}-b-${i}`}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('__') && part.endsWith('__')) {
            return <u key={`${lineKey}-u2-${i}`}>{part.slice(2, -2)}</u>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={`${lineKey}-i-${i}`}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={`${lineKey}-i2-${i}`}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
};

export default parseMarkdown;

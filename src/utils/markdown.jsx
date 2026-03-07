import React from 'react';

/**
 * A simple markdown parser that converts basic syntax to JSX.
 * Supports:
 * - Bold: **text**
 * - Italic: _text_
 * - Bullet Points: - item or * item
 * - Paragraphs: separated by lines
 */
export const parseMarkdown = (text) => {
    if (!text) return null;

    // Normalize line endings
    const processedText = text.replace(/\r\n/g, '\n');
    const lines = processedText.split('\n');

    let result = [];
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            result.push(
                <ul key={`list-${result.length}`} className="markdown-list">
                    {listItems}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Handle Headings
        if (trimmedLine.startsWith('### ')) {
            flushList();
            result.push(<h3 key={`h3-${index}`}>{formatInline(trimmedLine.substring(4), index)}</h3>);
        } else if (trimmedLine.startsWith('## ')) {
            flushList();
            result.push(<h2 key={`h2-${index}`}>{formatInline(trimmedLine.substring(3), index)}</h2>);
        } else if (trimmedLine.startsWith('# ')) {
            flushList();
            result.push(<h1 key={`h1-${index}`}>{formatInline(trimmedLine.substring(2), index)}</h1>);
        }
        // Handle Bullet Points
        else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            const content = trimmedLine.substring(2);
            listItems.push(<li key={`li-${index}`}>{formatInline(content, index)}</li>);
        } else if (trimmedLine === '') {
            flushList();
            // result.push(<div key={`spacer-${index}`} className="markdown-spacer" />);
        } else {
            flushList();
            result.push(<p key={`p-${index}`} className="markdown-para">{formatInline(line, index)}</p>);
        }
    });

    flushList();
    return <div className="rich-content-render">{result}</div>;
};

const formatInline = (text, lineKey) => {
    if (typeof text !== 'string') return text;

    // Recursive function to handle nested bold/italic
    const parseNested = (input, keyPrefix) => {
        if (typeof input !== 'string') return [input];

        // Try Bold first
        const boldParts = input.split(/(\*\*.*?\*\*)/g);
        if (boldParts.length > 1) {
            return boldParts.flatMap((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return <strong key={`${keyPrefix}-b-${i}`}>{parseNested(content, `${keyPrefix}-b-${i}`)}</strong>;
                }
                return parseNested(part, `${keyPrefix}-p-${i}`);
            });
        }

        // Try Italic next
        const italicParts = input.split(/(_.*?_)/g);
        if (italicParts.length > 1) {
            return italicParts.flatMap((part, i) => {
                if (part.startsWith('_') && part.endsWith('_')) {
                    const content = part.slice(1, -1);
                    return <em key={`${keyPrefix}-i-${i}`}>{parseNested(content, `${keyPrefix}-i-${i}`)}</em>;
                }
                return part;
            });
        }

        return [input];
    };

    return parseNested(text, `inline-${lineKey}`);
};

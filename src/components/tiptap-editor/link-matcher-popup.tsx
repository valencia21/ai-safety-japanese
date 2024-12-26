import React, { useState } from 'react';
import { Editor } from '@tiptap/react';

interface LinkMatcherPopupProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

interface TextNode {
  type: 'text';
  text: string;
  marks?: Array<{
    type: string;
    attrs: Record<string, string>;
  }>;
}

export const LinkMatcherPopup: React.FC<LinkMatcherPopupProps> = ({ editor, isOpen, onClose }) => {
  const [htmlInput, setHtmlInput] = useState('');

  const processHtml = () => {
    const div = document.createElement('div');
    div.innerHTML = htmlInput;

    // Helper function to clean text for comparison
    const cleanText = (text: string) => {
      return text
        .trim()
        .normalize('NFKC')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove special characters that might interfere with matching
        .replace(/[\u200B-\u200D\uFEFF]/g, '');
    };

    // Get all links and their exact text content
    const linkData = Array.from(div.getElementsByTagName('a')).map(link => {
      // Get the exact text content, removing any nested formatting
      const textContent = link.textContent || '';
      const parentText = link.parentNode?.textContent || '';
      
      return {
        text: cleanText(textContent),
        href: link.getAttribute('href') || '',
        parent: cleanText(parentText),
        originalText: textContent // Keep original for length calculation
      };
    }).filter(({ text, href, originalText }) => {
      return text && 
             href && 
             href.startsWith('http') && 
             originalText.length > 1;
    });

    // Get the current editor content
    const content = editor.getJSON();
    
    const processNode = (node: any): any => {
      if (node.type === 'text' && node.text) {
        let resultNode = node;
        const normalizedNodeText = cleanText(node.text);
        
        for (const { text, href, parent } of linkData) {
          // Use more flexible matching
          if (!cleanText(parent).includes(normalizedNodeText)) continue;

          let index = normalizedNodeText.indexOf(text);
          if (index !== -1) {
            const parts: TextNode[] = [];
            
            // Add text before the match
            if (index > 0) {
              parts.push({ 
                type: 'text',
                text: node.text.slice(0, index)
              });
            }

            // Add the linked text
            parts.push({
              type: 'text',
              text: node.text.slice(index, index + text.length),
              marks: [{
                type: 'link',
                attrs: {
                  href,
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow'
                }
              }]
            });

            // Add text after the match
            if (index + text.length < node.text.length) {
              parts.push({
                type: 'text',
                text: node.text.slice(index + text.length)
              });
            }

            if (parts.length > 0) {
              resultNode = parts;
            }
          }
        }
        return resultNode;
      }
      
      if (node.content) {
        return {
          ...node,
          content: node.content.flatMap(processNode)
        };
      }
      
      return node;
    };

    const newContent = processNode(content);
    editor.commands.setContent(newContent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-lg font-bold mb-4">Paste HTML with Links</h2>
        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          className="w-full h-48 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="Paste HTML content here..."
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={processHtml}
            className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Process Links
          </button>
        </div>
      </div>
    </div>
  );
};
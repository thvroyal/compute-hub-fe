import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewerProps {
  markdownContent: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdownContent }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;

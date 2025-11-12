import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
    const baseStyles = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none";
    const classes = `${baseStyles} ${className || ''}`;

    return <textarea className={classes} {...props} />;
};
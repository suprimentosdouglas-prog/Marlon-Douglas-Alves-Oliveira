import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
    const baseStyles = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white";
    const classes = `${baseStyles} ${className || ''}`;

    return (
        <select className={classes} {...props}>
            {children}
        </select>
    );
};
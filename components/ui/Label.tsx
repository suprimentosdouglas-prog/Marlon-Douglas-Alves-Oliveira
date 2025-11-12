import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ children, className, ...props }) => {
    const baseStyles = "block text-sm font-medium text-slate-700";
    const classes = `${baseStyles} ${className || ''}`;

    return (
        <label className={classes} {...props}>
            {children}
        </label>
    );
};
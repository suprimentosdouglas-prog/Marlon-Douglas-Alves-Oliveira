import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    // FIX: Add `style` prop to allow for inline styling.
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className, style }) => {
    const classes = `bg-white rounded-xl shadow-sm border border-slate-200 ${className || ''}`;
    return (
        <div className={classes} style={style}>
            {children}
        </div>
    );
};

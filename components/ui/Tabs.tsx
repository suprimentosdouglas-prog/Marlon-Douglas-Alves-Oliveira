import React, { createContext, useContext, useState } from 'react';

interface TabsContextProps {
    activeValue: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

export const Tabs: React.FC<{ children: React.ReactNode, value: string, onValueChange: (value: string) => void }> = ({ children, value, onValueChange }) => {
    return (
        <TabsContext.Provider value={{ activeValue: value, onValueChange }}>
            <div>{children}</div>
        </TabsContext.Provider>
    );
};

export const TabsList: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const baseStyles = "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500";
    return <div className={`${baseStyles} ${className || ''}`}>{children}</div>;
};

export const TabsTrigger: React.FC<{ children: React.ReactNode, value: string, className?: string }> = ({ children, value, className }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within a Tabs component");

    const isActive = context.activeValue === value;
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const activeStyles = "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm";

    return (
        <button
            data-state={isActive ? 'active' : 'inactive'}
            onClick={() => context.onValueChange(value)}
            className={`${baseStyles} ${activeStyles} ${className || ''}`}
        >
            {children}
        </button>
    );
};
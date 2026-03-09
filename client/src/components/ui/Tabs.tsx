import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface TabsContextType {
    active: string;
    setActive: (id: string) => void;
}
const TabsContext = createContext<TabsContextType>({ active: '', setActive: () => { } });

interface TabsProps {
    defaultTab: string;
    children: React.ReactNode;
    className?: string;
    onChange?: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ defaultTab, children, className, onChange }) => {
    const [active, setActive] = useState(defaultTab);
    const handleSet = (id: string) => { setActive(id); onChange?.(id); };
    return (
        <TabsContext.Provider value={{ active, setActive: handleSet }}>
            <div className={cn('w-full', className)}>{children}</div>
        </TabsContext.Provider>
    );
};

interface TabListProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'line' | 'pill' | 'card';
}
export const TabList: React.FC<TabListProps> = ({ children, className, variant = 'line' }) => {
    return (
        <div
            className={cn(
                'flex items-center gap-1',
                variant === 'line' && 'border-b border-border',
                variant === 'pill' && 'bg-muted p-1 rounded-xl',
                variant === 'card' && 'bg-card border border-border rounded-xl p-1',
                className
            )}
        >
            {children}
        </div>
    );
};

interface TabProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    badge?: number;
}
export const Tab: React.FC<TabProps> = ({ id, children, className, icon, badge }) => {
    const { active, setActive } = useContext(TabsContext);
    const isActive = active === id;
    return (
        <button
            onClick={() => setActive(id)}
            className={cn(
                'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                className
            )}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
            {badge !== undefined && badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary">
                    {badge}
                </span>
            )}
            {isActive && (
                <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
        </button>
    );
};

interface TabPanelProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}
export const TabPanel: React.FC<TabPanelProps> = ({ id, children, className }) => {
    const { active } = useContext(TabsContext);
    if (active !== id) return null;
    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn('pt-4', className)}
        >
            {children}
        </motion.div>
    );
};

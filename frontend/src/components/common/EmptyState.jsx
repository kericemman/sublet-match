import React from 'react';

const EmptyState = ({ 
    icon, 
    title, 
    description, 
    action, 
    actionLabel 
}) => {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h2 className="empty-state-title">{title}</h2>
            {description && (
                <p className="empty-state-description">{description}</p>
            )}
            {action && actionLabel && (
                <button 
                    className="empty-state-button" 
                    onClick={action}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
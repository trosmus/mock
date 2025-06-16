import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  size?: 'small' | 'medium' | 'large';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: IconComponent,
  color,
  onClick,
  disabled = false,
  tooltip,
  size = 'medium'
}) => {
  console.log(`🔘 [${tooltip}] ActionButton render - color: ${color}, disabled: ${disabled}, size: ${size}`);
  
  const sizeConfig = {
    small: { width: 20, height: 20, iconSize: 10 },
    medium: { width: 24, height: 24, iconSize: 12 },
    large: { width: 28, height: 28, iconSize: 14 }
  };

  const config = sizeConfig[size];

  const handleClick = () => {
    console.log(`🖱️ [${tooltip}] ActionButton clicked`);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={tooltip}
      style={{
        width: `${config.width}px`,
        height: `${config.height}px`,
        border: `2px solid ${disabled ? '#e2e8f0' : color}`,
        borderRadius: '50%',
        padding: 0,
        background: 'white',
        color: disabled ? '#94a3b8' : color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: disabled ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1)',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        console.log(`🐭 [${tooltip}] ActionButton mouse enter`);
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.background = color;
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        console.log(`🐭 [${tooltip}] ActionButton mouse leave`);
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = color;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.95)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          // Check if mouse is still over the button
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          const isMouseOver = mouseX >= rect.left && mouseX <= rect.right && 
                             mouseY >= rect.top && mouseY <= rect.bottom;
          
          if (isMouseOver) {
            // Mouse is still over button, maintain hover state
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = color;
            e.currentTarget.style.color = 'white';
          } else {
            // Mouse is not over button, reset to normal state
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = color;
          }
        }
      }}
      onBlur={(e) => {
        // Reset to normal state when button loses focus
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = color;
        }
      }}
    >
      <IconComponent
        size={config.iconSize}
        strokeWidth={2.5}
      />
    </button>
  );
};

export default ActionButton;

// import React from 'react';

// interface ButtonProps {
//   children: React.ReactNode;
//   type?: 'button' | 'submit' | 'reset';
//   className?: string;
//   onClick?: () => void;
//   disabled?: boolean;
// }

// const Button: React.FC<ButtonProps> = ({ children, type = 'button', className = '', onClick, disabled }) => {
//   return (
//     <button
//       type={type}
//       className={`button ${className} ${disabled ? 'button-disabled' : ''}`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;

// frontend/src/components/common/button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, type = 'button', className = '', onClick, disabled }) => {
  return (
    <button
      type={type}
      className={`button ${className} ${disabled ? 'button-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

// import React from 'react';
// import '../../styles/input.css';

// interface InputProps {
//   type: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   label?: string;
//   required?: boolean;
// }

// const Input: React.FC<InputProps> = ({ type, name, value, onChange, placeholder, label, required }) => {
//   return (
//     <div className="input-container">
//       {label && <label htmlFor={name}>{label}</label>}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         className="input-field"
//       />
//     </div>
//   );
// };

// export default Input;

// frontend/src/components/common/Input.tsx
import React, { InputHTMLAttributes } from 'react';
import '../../styles/input.css';


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {

  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="input-container">
      {label && <label htmlFor={props.id || props.name}>{label}</label>} 
      <input
  
        {...props}
        className={`input-field ${className}`}
      />
    </div>
  );
};

export default Input;
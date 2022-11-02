import React from "react";
import styles from "../styles";

// all chars and all numbers -- name validation
const regex = /^[A-Za-z0-9]+$/;

const CustomInput = ({ label, placeholder, value, onChange }) => {
  return (
    <div>
      <label htmlFor="name" className={styles.label}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value === "" || regex.test(e.target.value))
            onChange(e.target.value);
        }}
        className={`${styles.input} ml-4`}
      />
    </div>
  );
};

export default CustomInput;

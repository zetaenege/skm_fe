import styles from "./Button.module.css";

function Button({
                  children,
                  onClick,
                  type = "button",
                  disabled = false,
                  variant = "primary",
                  className = "",
                }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
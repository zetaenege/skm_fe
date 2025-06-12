

import styles from "./Button.module.css";




function Button({
                    children,
                    onClick,
                    type = 'button',
                    disabled = false,
                    variant = 'primary',

                }) {


    return (

        <button
            className={styles.button}
            type={type}
            onClick={onClick}
            disabled={disabled}
            variant={variant}
        >
            {children}
        </button>


    )
}

export default Button;


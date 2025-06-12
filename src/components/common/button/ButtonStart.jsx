

import styles from "./Button.module.css";




function ButtonStart({
                    children,
                    onClick,
                    type = 'button',
                    disabled = false,
                    variant = 'primary',

                }) {


    return (

        <button
            className={styles.button__start}
            type={type}
            onClick={onClick}
            disabled={disabled}
            variant={variant}
        >
            {children}
        </button>


    )
}

export default ButtonStart;


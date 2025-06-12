import styles from "./ProfileArea.module.css";


function ProfileArea() {

    return (


            <div className={styles.profile_wrapper}>
                <div className={styles.img__profile}>
                    <img/>
                </div>
                <div className={styles.profile__info}>
                    <p className="name__text">Nombre</p>
                    <p className="info__text">posicion y ciudad</p>
                </div>
            </div>

    )
}

export default ProfileArea;
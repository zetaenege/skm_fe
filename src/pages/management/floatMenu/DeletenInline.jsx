import Button from "../../../components/common/button/Button.jsx";
import style from "./floatMenu.module.css";

function DeleteInline({ itemName, onConfirm, onCancel }) {
  return (
    <div className={`${style.dropdown__form_inline} animate__dropdown_enter`}>
      <div>
        <p className={style.form__text}>
          Are you sure you want to delete <strong>{itemName}</strong>? This
          action cannot be undone.
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <Button type="button" onClick={onConfirm} variant="requestaccept">
          Yes, Delete
        </Button>

        <Button type="button" onClick={onCancel} variant="requestdecline">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default DeleteInline;

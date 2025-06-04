import React from "react";
import styles from "./ConfirmModal.module.scss";

interface Props {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({
  visible,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onConfirm}>
            Tak
          </button>
          <button className={styles.cancel} onClick={onCancel}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

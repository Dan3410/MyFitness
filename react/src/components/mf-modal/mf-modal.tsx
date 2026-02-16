import { FC, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./mf-modal.module.scss"


interface MFModalProp {
   children: ReactNode,
   isOpen: boolean,
   onClose: (...args: never[]) => void;
}

const MFModal: FC<MFModalProp> = ({ isOpen , onClose, children }) => {
   const modalRoot = document.getElementById("modal-root"); // add <div id="modal-root"></div> in index.html


  useEffect(() => {
    function onKey(e: any) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={styles.modalOverlay}
      onMouseDown={onClose} // close when clicking overlay
    >
      <div
        className={styles.modalContent}
        onMouseDown={(e) => e.stopPropagation()} // prevent overlay click when clicking content
      >
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
         X
        </button>
        {children}
      </div>
    </div>,
    modalRoot!
  );
}

export default MFModal


// ExpandablePanel.jsx
import React, { useRef, useState, useLayoutEffect, useId, FC } from "react";
import styles from "./mf-expandable-panel.module.scss";
import type { ColorVariant } from "../../models/colorVariant";

interface MFExpandablePanelProps {
   id?: string;
   title: React.ReactNode;
   children: React.ReactNode;
   isOpen?: boolean;
   defaultOpen?: boolean;
   onToggle?: (isOpen: boolean) => void;
   theme?: ColorVariant,
};

const MFExpandablePanel: FC<MFExpandablePanelProps> = ({
   id,
   title,
   children,
   isOpen: controlledIsOpen,
   defaultOpen = false,
   onToggle,
   theme,
}) => {
   const generatedId = useId();
   const panelId = `${id ?? generatedId}-panel`;
   const headerId = `${id ?? generatedId}-header`;

   const isControlled = controlledIsOpen !== undefined;
   const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
   const isOpen = isControlled ? controlledIsOpen : uncontrolledOpen;

   const contentRef = useRef(null);
   const [height, setHeight] = useState(isOpen ? "auto" : "0px");
   const [isAnimating, setIsAnimating] = useState(false);

   useLayoutEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      if (isOpen) {
         const measured = `${el.scrollHeight}px`;
         setIsAnimating(true);
         setHeight(measured);

         const t = setTimeout(() => {
            setHeight("auto");
            setIsAnimating(false);
         }, 300);
         return () => clearTimeout(t);
      } else {
         if (height === "auto") {
            const measured = `${el.scrollHeight}px`;
            requestAnimationFrame(() => {
               setIsAnimating(true);
               setHeight(measured);
               requestAnimationFrame(() => {
                  setHeight("0px");
                  const t = setTimeout(() => {
                     setIsAnimating(false);
                  }, 300);
                  return () => clearTimeout(t);
               });
            });
         } else {
            setIsAnimating(true);
            setHeight("0px");
            const t = setTimeout(() => {
               setIsAnimating(false);
            }, 300);
            return () => clearTimeout(t);
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isOpen]);

   const toggle = () => {
      if (isControlled) {
         onToggle && onToggle(!controlledIsOpen);
      } else {
         setUncontrolledOpen((v) => !v);
      }
   };

   return (
      <div className={`${styles.MFExpandablePanel} ${styles[`MFExpandablePanel--${(theme || 'primary').charAt(0).toUpperCase()}${(theme || 'primary').slice(1)}`]}`}>
         <div className={styles.MFExpandablePanel__Header}>
            <button
               id={headerId}
               type="button"
               aria-expanded={isOpen}
               aria-controls={panelId}
               className={styles.MFExpandablePanel__Trigger}
               onClick={toggle}
               onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                     e.preventDefault();
                     toggle();
                  }
               }}
            >
               <span className={styles.MFExpandablePanel__Title}>{title}</span>
               <span
                  className={`${styles.MFExpandablePanel__Icon} ${isOpen ? styles['MFExpandablePanel__Icon--Open'] : ''}`}
                  aria-hidden="true"
               >
                  <svg
                     width="14"
                     height="14"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     className={styles.MFExpandablePanel__IconSvg}
                  >
                     <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               </span>
            </button>
         </div>

         <div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            className={styles.MFExpandablePanel__Content}
            style={{
               height,
               overflow: "hidden",
               transition: "height 300ms ease",
            }}
         >
            <div ref={contentRef} className={styles.MFExpandablePanel__Inner}>
               {children}
            </div>
         </div>
      </div>
   );
};

export default MFExpandablePanel;

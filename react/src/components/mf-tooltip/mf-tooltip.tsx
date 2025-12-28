import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import styles from "./mf-tooltip.module.scss"
import type { ButtonTheme } from '../../themes/interfaces';
import { ComponentTheme } from '../../themes/enums';
import { profileAndHealthButtonTheme } from '../../themes/profileHealth';
import { workoutButtonTheme } from '../../themes/workout';
import { dietButtonTheme } from '../../themes/diet';
import { cancelButtonTheme } from '../../themes/generic';
import { tooltipPlacement } from '../../models/tooltipPlacement';
import { createPortal } from 'react-dom';

interface MFTooltipProps {
   children: ReactNode,
   placement?: tooltipPlacement,
   delay?: number
}

const MFTooltip: FC<MFTooltipProps> = ({
   children,
   placement = tooltipPlacement.TOP,
   delay = 100,
}) => {

   const [visible, setVisible] = useState(false);
   const [coords, setCoords] = useState({ left: 0, top: 0 });
   const targetRef = useRef<HTMLElement | null>(null);
   const tipRef = useRef<HTMLDivElement | null>(null)
   const timeoutRef = useRef<number>(undefined);

   useEffect(() => {
      return () => clearTimeout(timeoutRef.current);
   }, []);

   const getPosition = (targetRect: DOMRect, tipRect: DOMRect, placement: tooltipPlacement) => {
      const spacing = 8;
      switch (placement) {
         case tooltipPlacement.BOTTOM:
            return {
               left: targetRect.left + (targetRect.width - tipRect.width) / 2,
               top: targetRect.bottom + spacing
            };
         case tooltipPlacement.LEFT:
            return {
               left: targetRect.left - tipRect.width - spacing,
               top: targetRect.top + (targetRect.height - tipRect.height) / 2
            };
         case tooltipPlacement.RIGHT:
            return {
               left: targetRect.right + spacing,
               top: targetRect.top + (targetRect.height - tipRect.height) / 2
            };
         case tooltipPlacement.TOP:
         default:
            return {
               left: targetRect.left + (targetRect.width - tipRect.width) / 2,
               top: targetRect.top - tipRect.height - spacing
            };
      }


   }

   const show = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
         if (!targetRef.current || !tipRef.current) return;
         const tRect = targetRef.current.getBoundingClientRect();
         const tipRect = tipRef.current.getBoundingClientRect();
         const pos = getPosition(tRect, tipRect, placement);
         setCoords({ left: Math.max(8, pos.left), top: Math.max(8, pos.top) });
         setVisible(true);
      }, delay);
   }

   const hide = () => {
      clearTimeout(timeoutRef.current);
      setVisible(false);
   }

   const tooltipNode = (
      <div
         ref={tipRef}
         role="tooltip"
         className={styles.mfTooltip && visible ? styles.mfTooltipVisible : undefined}
         style={{
            position: "fixed",
            left: coords.left,
            top: coords.top,
            zIndex: 9999,
            pointerEvents: "none",
            transition: "opacity 120ms ease, transform 120ms ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-4px)",
            background: "black"
         }}
      >
         {children}
      </div>
   );

   const portalRoot = document.body;


   return (<>
      <span
         ref={targetRef}
         onMouseEnter={show}
         onMouseLeave={hide}
         onFocus={show}
         onBlur={hide}
         tabIndex={0}
         aria-describedby={"tooltip"}
         style={{ display: "inline-block" }}
      >
         ?
      </span>
      {portalRoot ? createPortal(tooltipNode, portalRoot) : tooltipNode}
   </>

   )
};

export default MFTooltip;

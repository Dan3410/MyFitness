import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import styles from "./mf-tooltip.module.scss"
import { ComponentTheme } from '../../themes/enums';
import { tooltipPlacement } from '../../models/tooltipPlacement';
import { createPortal } from 'react-dom';
import { TooltipTheme } from '../../themes/interfaces';
import { profileAndHealthTooltipTheme } from '../../themes/profileHealth';
import { workoutTooltipTheme } from '../../themes/workout';
import { dietTooltipTheme } from '../../themes/diet';

interface MFTooltipProps {
   theme: ComponentTheme,
   children: ReactNode,
   placement?: tooltipPlacement,
   delay?: number
}

const MFTooltip: FC<MFTooltipProps> = ({
   theme,
   children,
   placement = tooltipPlacement.TOP,
   delay = 100,
}) => {

   const [visible, setVisible] = useState(false);
   const [coords, setCoords] = useState({ left: 0, top: 0 });
   const targetRef = useRef<HTMLElement | null>(null);
   const tipRef = useRef<HTMLDivElement | null>(null)
   const timeoutRef = useRef<number>(undefined);

   const tooltipTheme: TooltipTheme = theme == ComponentTheme.profileAndHeath ? profileAndHealthTooltipTheme :
      theme == ComponentTheme.diet ? dietTooltipTheme : workoutTooltipTheme

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
         className={[styles.mfTooltip, visible ? styles.mfTooltipVisible : undefined].join(' ')}
         style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-4px)",
            left: coords.left,
            top: coords.top,
            background: tooltipTheme.backgroundColor,
            color: tooltipTheme.textColor
         }}
      >
         {children}
      </div>
   );

   const portalRoot = document.body;


   return (<>
      <span className={styles.mfTooltipIcon}
         ref={targetRef}
         onMouseEnter={show}
         onMouseLeave={hide}
         onFocus={show}
         onBlur={hide}
         tabIndex={0}
         aria-describedby={"tooltip"}
         style={{ color: tooltipTheme.iconColor, borderColor: tooltipTheme.iconColor }}
      >
         ?
      </span>
      {portalRoot ? createPortal(tooltipNode, portalRoot) : tooltipNode}
   </>

   )
};

export default MFTooltip;

import React, {
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  // ReactDOM old import for createPortal
  createPortal,
} from "react-dom";
import "./modal-app.styles.scss";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
}

export const ModalApp: React.FC<Props> = ({
  showModal,
  setShowModal,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showModal) return;

    // 🕵️‍♂️ Store the active item on the parent page to restore it when modal closes
    const originalFocusedElement = document.activeElement as HTMLElement;

    // 🎯 1. Auto-focus the inner close button or first input when modal mounts
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>;

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // 🔒 2. THE FOCUS TRAP & KEYBOARD INTERACTION HANDLER
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modal gracefully on Escape key
      if (e.key === "Escape") {
        setShowModal(false);
        return;
      }

      // Intercept Tab presses
      if (e.key === "Tab" && focusableElements) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // If holding Shift + Tab and on the first element, wrap around to the last element
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // If pressing Tab and on the last element, wrap around to the first element
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (originalFocusedElement) {
        originalFocusedElement.focus();
      }
    };
  }, [showModal, setShowModal]);

  if (!showModal) return null;

  // Still with 'createPortal' the component has Event Bubbling effect with father component
  return createPortal(
    <div className="rootModalApp" onClick={() => setShowModal(false)}>
      <div
        ref={modalRef}
        className="containerModalApp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <header>
          <h2>{title}</h2>
          <button
            className="btnCloseModal"
            onClick={() => setShowModal(false)}
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root") ?? document.body,
  );
};

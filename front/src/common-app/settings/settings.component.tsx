import React, {
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import "./settings.styles.scss";

interface Props {
  showSettings: boolean | null;
  setShowSettings: Dispatch<SetStateAction<boolean | null>>;
}

export const Settings: React.FC<Props> = ({
  showSettings,
  setShowSettings,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSettings) return;

    // 1. Stores the active element on the page to restore it when closed
    const originalFocusedElement = document.activeElement as HTMLElement;

    const focusableElements = panelRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>;

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSettings(false);
        return;
      }

      if (e.key === "Tab" && focusableElements) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
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
        originalFocusedElement.focus(); // 2. Restore focus on old element
      }
    };
  }, [showSettings, setShowSettings]);

  if (!showSettings) return null;

  //
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings(false);
  };

  return createPortal(
    <div className="rootSettingsPanel" onClick={handleClose} id="settingsPanel">
      <div
        ref={panelRef}
        className="containerSettingsPanel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Web Settings Panel"
      >
        <header className="settingsHeader">
          <button
            className="btnCloseSettings"
            onClick={handleClose}
            aria-label="Close settings"
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <h2>Impostazioni</h2>
        </header>

        <div className="settingsContent">
          <section className="settingSection">
            <h3>Lingua / Language</h3>
          </section>

          <section className="settingSection">
            <h3>Tema Grafico</h3>
          </section>

          <section className="settingSection">
            <h3>Abbonamento</h3>
          </section>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") ?? document.body,
  );
};

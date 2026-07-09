import type React from "react";
import { useMediaQuery } from "react-responsive";
import { ImageComponent } from "../image";
import "./aside.styles.scss";

const asideValue: boolean = true;

export const Aside: React.FC = () => {
  const isMobile: boolean = useMediaQuery({ maxWidth: "724px" });

  const aside: string = asideValue ? "open" : "close";
  return (
    <aside className={`rootAsideComponent aside_${aside}`}>
      <div className="containerAside">
        <div className="boxTitle">
          <h3>Aside Component</h3>
        </div>

        <div className="publicityContainer">
          <ImageComponent
            vertical={isMobile}
            src={`/images/.png`}
            lazy={"lazy"}
            alt="Advertising 1"
            customStyle="boxImage"
          />
          <ImageComponent
            vertical={isMobile}
            src="/uy"
            lazy={"lazy"}
            alt="Advertising 2"
            customStyle="boxImage"
          />
        </div>
      </div>
    </aside>
  );
};

import { useMediaQuery } from "react-responsive";
import { ImageComponent } from "../image";
import "./aside.styles.scss";

export const Aside = () => {
  const isMobile: boolean = useMediaQuery({ maxWidth: "724px" });

  const aside: boolean = true;
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

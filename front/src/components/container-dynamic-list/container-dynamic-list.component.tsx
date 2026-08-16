import React, { useState, type ReactElement } from "react";
import "./container-dynamic-list.styles.scss";

interface ChildProps {
  setPxHeight: React.Dispatch<React.SetStateAction<number>>;
  pxHeight?: number;
}

interface Props {
  title?: string;
  height?: number;
  children: ReactElement<ChildProps> | null;
  customStyles?: string;
  alt?: string | undefined;
  tabIndex?: number | undefined;
}

export const ContainerDynamicList: React.FC<Props> = (props) => {
  const {
    customStyles,
    height = 0,
    title,
    children,
    alt,
    tabIndex = 0,
  } = props;

  const [pxHeight, setPxHeight] = useState<number>(7);

  // Inject props into the child
  const clonedChildren = React.isValidElement(children)
    ? React.cloneElement(children, {
        setPxHeight,
        pxHeight,
      })
    : children;

  return (
    <div className="ContainerDynamicList">
      {title && <h4>{title}</h4>}

      <div
        style={
          {
            "--pxHeight": `${height}px`,
          } as React.CSSProperties
        }
        className={`containerChildren ${customStyles ?? ""}`}
      >
        {clonedChildren}
      </div>
    </div>
  );
};

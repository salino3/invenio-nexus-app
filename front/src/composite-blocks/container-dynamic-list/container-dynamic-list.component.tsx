import React, { type ReactElement } from "react";
import type { MyCompaniesProps } from "@/store/interface";
import "./container-dynamic-list.styles.scss";

interface ChildProps {
  // setPxHeight: React.Dispatch<React.SetStateAction<number>>;
  height?: number;
  arrayData: MyCompaniesProps[];
}

interface Props {
  title?: string;
  height?: number;
  arrayData: MyCompaniesProps[];
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
    arrayData,
  } = props;

  // Inject props into the child
  const clonedChildren = React.isValidElement(children)
    ? React.cloneElement(children, {
        // setPxHeight,
        height,
        arrayData,
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

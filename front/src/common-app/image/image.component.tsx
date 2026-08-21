import React, { type CSSProperties, type ReactEventHandler } from "react";
import { utilitiesApp } from "@/utils";

type LazyProps = "lazy" | "eager" | undefined;

interface Props {
  customStyle?: string;
  src: string | undefined;
  alt: string | undefined;
  lazy?: LazyProps;
  isVertical: boolean;
  onLoad?: ReactEventHandler<HTMLImageElement> | undefined;
  style?: CSSProperties | undefined;
}

export const ImageComponent: React.FC<Props> = (props) => {
  const {
    customStyle,
    src,
    alt,
    lazy = "lazy",
    isVertical = true,
    onLoad,
    style,
  } = props;

  const { handleImgError } = utilitiesApp();

  return (
    <div style={style} className={`boxImageImageComponent ${customStyle}`}>
      <img
        src={src}
        onLoad={onLoad}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
          handleImgError(e, isVertical)
        }
        loading={lazy}
        alt={alt}
      />
    </div>
  );
};

import type React from "react";

interface Props {
  width?: number;
  height?: number;
  fill?: string;
  customStyles?: string | undefined;
  transform?: string;
}

export const TriangleIcon: React.FC<Props> = ({
  width = 15,
  height = 15,
  fill = "#d4af37",
  customStyles,
  transform = "0",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    width={width}
    height={height}
    className={customStyles}
    style={{
      transform: `rotate(${transform}deg)`,
    }}
  >
    <polygon points="1,0 19,9 1,19" fill={fill} />
  </svg>
);

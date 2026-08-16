import type React from "react";
import "./list-my-companies.styles.scss";

const mockArray = [
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
  { title: "ListMyCompanies" },
];

interface Props {
  isMounted?: boolean;
  setPxHeight?: React.Dispatch<React.SetStateAction<number>>;
  pxHeight?: number;
  arrayData?: any[]; // TODO: Fix types 'arrayData'
}

export const ListMyCompanies: React.FC<Props> = (props) => {
  const { isMounted = true, setPxHeight, pxHeight, arrayData } = props;
  console.log("clog1", pxHeight);
  return (
    <div className="rootListMyCompanies">
      {isMounted &&
        mockArray.map((item, index: number) => (
          <strong key={index}>{item.title}</strong>
        ))}
    </div>
  );
};

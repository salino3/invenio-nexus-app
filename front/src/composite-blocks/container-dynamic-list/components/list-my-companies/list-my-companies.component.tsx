import type React from "react";
import type { MyCompaniesProps } from "@/store/interface";
import "./list-my-companies.styles.scss";

interface Props {
  isMounted?: boolean;
  // setPxHeight?: React.Dispatch<React.SetStateAction<number>>;
  height?: number;
  arrayData?: MyCompaniesProps[];
}

export const ListMyCompanies: React.FC<Props> = (props) => {
  const { isMounted = true, height, arrayData } = props;
  console.log("clog1", height);
  return (
    <div className="rootListMyCompanies">
      {isMounted &&
        arrayData &&
        arrayData?.length > 0 &&
        arrayData.map((item: MyCompaniesProps) => (
          <strong key={item.uuid}>{item.name}</strong>
        ))}
    </div>
  );
};

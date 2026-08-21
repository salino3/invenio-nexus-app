import type React from "react";
import { CardMyCompany } from "../card-my-company";
import type { MyCompaniesProps } from "@/store/interface";
import "./list-my-companies.styles.scss";

interface Props {
  isMounted?: boolean;
  height?: number;
  arrayData?: MyCompaniesProps[];
}

export const ListMyCompanies: React.FC<Props> = (props) => {
  const { isMounted = true, arrayData } = props;

  return (
    <div className="rootListMyCompanies">
      {isMounted &&
        arrayData &&
        arrayData?.length > 0 &&
        arrayData.map((item: MyCompaniesProps) => (
          <CardMyCompany item={item} key={item.uuid} />
        ))}
    </div>
  );
};

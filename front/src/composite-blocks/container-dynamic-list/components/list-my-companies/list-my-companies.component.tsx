import type React from "react";
import { CardMyCompany } from "../card-my-company";
import type { MyCompaniesProps } from "@/store/interface";
import { routePaths } from "@/router/routes.interface";
import "./list-my-companies.styles.scss";

interface Props {
  isMounted?: boolean;
  height?: number;
  arrayData?: MyCompaniesProps[];
}

const addNewCompany: MyCompaniesProps = {
  name: "Add new company",
  uuid: routePaths.new_company,
  logo: "",
};

export const ListMyCompanies: React.FC<Props> = (props) => {
  const { isMounted = true, arrayData } = props;

  return (
    <div className="rootListMyCompanies">
      <CardMyCompany item={addNewCompany} />
      {isMounted &&
        arrayData &&
        arrayData?.length > 0 &&
        arrayData.map((item: MyCompaniesProps) => (
          <CardMyCompany item={item} key={item.uuid} />
        ))}
    </div>
  );
};

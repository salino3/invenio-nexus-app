import type React from "react";
import type { DataSearchedCompanies } from "@/store/interface";
import { ImageComponent } from "@/common-app";
import { VITE_URL_BACK_FILE } from "@/constants";
import "./card-company-list.styles.scss";

interface Props {
  company: DataSearchedCompanies;
}

export const CardCompanyList: React.FC<Props> = ({ company }) => {
  return (
    <li className="rootCardCompanyList cleanList">
      <div className="containerCardUp">
        <h4>{company.name}</h4>
        <ImageComponent
          vertical={false}
          src={`${VITE_URL_BACK_FILE}${company.logo ?? ""}`}
          lazy={"lazy"}
          alt={company.name}
          customStyle="boxImage"
        />
      </div>
      <div className="containerCardDown">
        {company.hashtags &&
          company.hashtags.length > 0 &&
          company.hashtags.map((h: string) => (
            <span className="hashtag">#{h}</span>
          ))}
      </div>
    </li>
  );
};

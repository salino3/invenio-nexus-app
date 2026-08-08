import type React from "react";
import type { DataSearchedCompanies } from "@/store/interface";
import { utilitiesApp } from "@/utils";
import { ImageComponent } from "@/common-app";
import { VITE_URL_BACK_FILE } from "@/constants";
import "./card-company-list.styles.scss";

interface Props {
  company: DataSearchedCompanies;
}

export const CardCompanyList: React.FC<Props> = ({ company }) => {
  const { getCountryName, getCountryFlag } = utilitiesApp();

  return (
    <li className="rootCardCompanyList cleanList">
      <div className="containerCardUp">
        <div className="boxLeft">
          <h4>{company.name}</h4>
          <span>{company.sector}</span>
        </div>
        <div className="boxCenter">
          <span>{company.location}</span>
          <span>
            {getCountryName(company.country_code ?? "")} &nbsp;
            {getCountryFlag(company.country_code ?? "")}
          </span>
        </div>
        <div className="boxRight">
          <ImageComponent
            vertical={false}
            src={`${VITE_URL_BACK_FILE}${company.logo ?? ""}`}
            lazy={"lazy"}
            alt={company.name}
            customStyle="boxImage"
          />
          <span
            className="redirectionText"
            onClick={() => alert("TODO: redirection page..")}
          >
            More info..
          </span>
        </div>
      </div>
      <div className="containerCardDown">
        {company.hashtags &&
          company.hashtags.length > 0 &&
          company.hashtags.map((h: string, i: number) => (
            <span className="hashtag" key={i}>
              #{h}
            </span>
          ))}
      </div>
    </li>
  );
};

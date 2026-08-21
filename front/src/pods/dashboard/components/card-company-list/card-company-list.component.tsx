import type React from "react";
import type { DataSearchedCompanies } from "@/store/interface";
import { utilitiesApp } from "@/utils";
import { BoxText } from "@/common";
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
          <BoxText
            tag={"h4"}
            title="Name:"
            value={company.name}
            customStyles={"boxTextCardCompany"}
          />
          <BoxText
            tag={"span"}
            title="Sector:"
            value={company.sector}
            customStyles={"boxTextCardCompany"}
          />
        </div>
        <hr className="divider" />
        <div className="boxCenter">
          <BoxText
            tag={"span"}
            title="Location:"
            value={company.location}
            customStyles={"boxTextCardCompany"}
          />
          <BoxText
            tag={"span"}
            title="Country:"
            value={`${getCountryName(company.country_code ?? "")} ${getCountryFlag(company.country_code ?? "")} `}
            customStyles={"boxTextCardCompany"}
          />
        </div>
        <hr className="divider divider_02" />
        <div className="boxRight">
          <ImageComponent
            isVertical={false}
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

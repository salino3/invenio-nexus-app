import type React from "react";
import { ImageComponent } from "@/common-app";
import type { MyCompaniesProps } from "@/store/interface";
import { MoreIcon } from "@/components";
import { VITE_URL_BACK_FILE } from "@/constants";
import "./card-my-company.styles.scss";

export const CardMyCompany: React.FC<{ item: MyCompaniesProps }> = ({
  item,
}) => {
  const { uuid, name, logo } = item;
  return (
    <div className="rootCardMyCompany">
      <strong> {name}</strong>
      {logo === "more-icon" ? (
        <MoreIcon />
      ) : (
        //   <img src={logo} alt="" />

        <ImageComponent
          src={`${VITE_URL_BACK_FILE}${logo ?? ""}`}
          alt="Icon company"
          isVertical={false}
          lazy="lazy"
          customStyle="boxCardImage"
        />
      )}
    </div>
  );
};

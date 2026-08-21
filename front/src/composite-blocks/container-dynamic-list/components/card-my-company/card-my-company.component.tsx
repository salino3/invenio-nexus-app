import type React from "react";
import { useNavigate } from "react-router-dom";
import { ImageComponent } from "@/common-app";
import type { MyCompaniesProps } from "@/store/interface";
import { MoreIcon } from "@/components";
import { VITE_URL_BACK_FILE } from "@/constants";
import "./card-my-company.styles.scss";
import { routePaths } from "@/router/routes.interface";

export const pxSizeImages: number = 35;

export const CardMyCompany: React.FC<{ item: MyCompaniesProps }> = ({
  item,
}) => {
  const { uuid, name, logo } = item;

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(routePaths.company_by_uuid(uuid))}
      className="rootCardMyCompany"
      style={
        {
          "--px-size": `${pxSizeImages}px`,
        } as React.CSSProperties
      }
    >
      <strong> {name}</strong>
      {logo === "more-icon" ? (
        <div className="boxCardImage">
          <MoreIcon height={pxSizeImages} width={pxSizeImages} />
        </div>
      ) : (
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

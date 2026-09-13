import { useEffect, useState } from "react";
import type { CompanyProps } from "@/store/interface";
import { ServicesApp } from "@/store/services";
import { ModalApp } from "../modal-app";
import { ZoomImg } from "@/common/zoom-img";
import { BinIcon, StarIcon } from "@/components";
import { VITE_URL_BACK_FILE } from "@/constants";
import "./first-info-company.styles.scss";

interface Props {
  params: { uuid: string; name: string };
  roleAccount: string;
  myFavorites: number[];
  cId: string | number;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
  logo: string;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyProps>>;
}

export const FirstInfoCompany: React.FC<Props> = (props) => {
  const {
    params,
    roleAccount,
    myFavorites,
    cId,
    setFlag,
    logo,
    setCompanyData,
  } = props;

  const [zoomPhoto, setZoomPhoto] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>("");
  const [newImage, setNewImage] = useState<string>(logo);

  const isFavorited =
    myFavorites &&
    myFavorites?.length > 0 &&
    myFavorites.some((f) => f === Number(params?.uuid));

  useEffect(() => {
    setCompanyData((prev: CompanyProps) => ({
      ...prev,
      logo: logo,
    }));
  }, [zoomPhoto, newImage]);

  return (
    <div className="containerInfoAboutCompany">
      <div className="infoAboutCompany">
        {!roleAccount && (
          <div
            className="boxStar"
            tabIndex={0}
            role="button"
            aria-label={
              isFavorited
                ? `${"aria.startIcon03"}"${params?.name}"${"aria.startIcon04"}`
                : `${"aria.startIcon01"}"${params?.name}"${"aria.startIcon02"}`
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter") {
                // ServicesApp?.[isFavorited ? "deleteFavorite" : "addFavorite"]({
                //   account_id: isFavorited ? String(cId) : Number(cId),
                //   company_id: isFavorited
                //     ? String(params?.id)
                //     : Number(params?.id),
                // }).then(() => setFlag((prev: boolean) => !prev));
              }
            }}
          >
            <StarIcon
              styles={{
                cursor: "pointer",
              }}
              click={
                () => null
                // ServicesApp?.[isFavorited ? "deleteFavorite" : "addFavorite"]({
                //   account_id: isFavorited ? String(cId) : Number(cId),
                //   company_id: isFavorited
                //     ? String(params?.id)
                //     : Number(params?.id),
                // }).then(() => setFlag((prev: boolean) => !prev))
              }
              fill={isFavorited ? "gold" : "currentColor"}
            />
          </div>
        )}
        <h4>* {params?.name} * </h4>
        <div
          tabIndex={0}
          role="button"
          aria-label={"aria.zoomPhoto"}
          onClick={() => setZoomPhoto(true)}
          className="boxLogoCompany"
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter") {
              setZoomPhoto(true);
            }
          }}
        >
          <img
            src={newImage || `${VITE_URL_BACK_FILE}${logo}`}
            alt="Logo"
            onError={(e) => (e.currentTarget.src = "/icons/group_3.svg")}
          />
        </div>
        {roleAccount && (
          <div
            tabIndex={0}
            role="button"
            aria-label={`${"aria.deleteCompany01"} "${params?.name}"`}
            id="handleModalBinCompany"
            onClick={() => setShowDeleteModal(String(cId))}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter") {
                setShowDeleteModal(String(cId));
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="boxDeleteIconCompany"
          >
            <BinIcon
              stroke={isHovered ? "var(--color-error)" : "currentColor"}
              width={30}
              height={30}
            />
          </div>
        )}
        <ZoomImg
          img={logo}
          alt="Logo"
          download
          setShow={setZoomPhoto}
          show={zoomPhoto}
          updatePhoto
          newImage={newImage}
          setNewImage={setNewImage}
        />
      </div>
      <hr
        style={{
          width: "98%",
        }}
      />
      {showDeleteModal && (
        <ModalApp
          title={"confirmDeleteCompany"}
          showModal={!!showDeleteModal}
          setShowModal={setShowDeleteModal}
          // customMaxHeight={"40vh"}
        >
          ""
          {/* <ConfirmingDelete
            data={showDeleteModal}
            setData={setShowDeleteModal}
            endpoint="deleteCompany"
            body={{ id: showDeleteModal, idCompany: params?.id }}
            text1={`${ ("text1DeleteCompany")} "<strong>${
              params?.name
            }</strong>"?`}
            textBtn={"confirm"}
            ariaLabel={"confirmDeleteCompany"}
          /> */}
        </ModalApp>
      )}
    </div>
  );
};

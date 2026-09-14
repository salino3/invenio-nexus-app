import React, { useActionState, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { CompanyErrorProps, PropsTabs } from "@/store/interface-app";
import { BasicInput, ButtonForm } from "@/common";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import type { CompanyProps, MyCompaniesProps } from "@/store/interface";
import { NavigationCompany } from "@/components";
import { FirstInfoCompany } from "@/common-app";
import "./company-page.styles.scss";

// TODO: Moving it to interface file
const initialState: any = {
  success: false,
  error: "",
  fieldErrors: null,
  formData: null,
};

export const CompanyPage: React.FC = () => {
  const params = useParams() as { name: string; uuid: string };

  const { currentUser, myCompanies } = useProviderSelector(
    "currentUser",
    "myCompanies",
  );

  const [tab, setTabs] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(false);
  const [myFavorites, setMyFavorites] = useState<number[]>([]);
  const [roleAccount, setRoleAccount] = useState<string>("");
  const [roleOldAccount, setOldRoleAccount] = useState<string>("");
  const [blobImage, setBlobImage] = useState<File | null>(null);
  const [companyData, setCompanyData] = useState<CompanyProps>({
    name: "",
    logo: "",
    description: "",
    hashtags: [],
    sector: "",
    location: "",
    contacts: [
      {
        type: "",
        value: "",
      },
    ],
    multimedia: [],
    ticket_investor_min: null,
    ticket_investor_max: null,
    connection_objectives: [],
    country_code: "",
    funding_required_max: 0,
    funding_required_min: 0,
    tax_id: "",
    uuid: "",
  });
  const [companyOldData, setCompanyOldData] = useState<CompanyProps>({
    name: "",
    logo: "",
    description: "",
    hashtags: [],
    sector: "",
    location: "",
    contacts: [
      {
        type: "",
        value: "",
      },
    ],
    multimedia: [],
    ticket_investor_min: null,
    ticket_investor_max: null,
    connection_objectives: [],
    country_code: "",
    funding_required_max: 0,
    funding_required_min: 0,
    tax_id: "",
    uuid: "",
  });
  const [companyErrorData, setCompanyErrorData] = useState<CompanyErrorProps>({
    name: "",
    logo: "",
    description: "",
    hashtags: "",
    sector: "",
    location: "",
    contacts: "",
    multimedia: "",
    ticket_investor_min: "",
    ticket_investor_max: "",
    connection_objectives: "",
    country_code: "",
    funding_required_max: "",
    funding_required_min: "",
    tax_id: "",
    uuid: "",
  });

  const [state, formAction, isPending] = useActionState(async function (
    prevState: any,
    formData: FormData,
  ) {
    const name = formData.get("name");
    const logo = formData.get("logo");
    console.log("clog1", name, logo, blobImage);
    return initialState;
  }, initialState);

  const tabs: PropsTabs[] = useMemo(
    () => [
      {
        key: 0,
        title: "about_us",
        component: "AboutUs",
      },
      {
        key: 1,
        title: "investment",
        component: "Investment",
      },
      {
        key: 2,
        title: "portfolio",
        component: "Portfolio",
      },
    ],
    [],
  );

  function clearAllFormSetters() {
    console.log("clog2", companyData.logo);

    // TODO: Complete this function
  }

  //
  const handleChangeForm =
    (key: keyof CompanyProps) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setCompanyData((prev: CompanyProps) => ({
        ...prev,
        [key]: value,
      }));

      setCompanyErrorData((prev: CompanyErrorProps) => ({
        ...prev,
        [key]: "",
      }));
    };

  //
  useEffect(() => {
    const controller = new AbortController();
    if (params?.uuid) {
      ServicesApp?.getCompanyByUUID(params?.uuid || "", controller.signal).then(
        (res) => {
          if (res?.company) {
            setCompanyData(res.company);
            setCompanyOldData(structuredClone(res.company)); // Native JS deep copy
          }
        },
      );
    } else {
      clearAllFormSetters();
    }

    const foundRole: string =
      (myCompanies &&
        myCompanies.length > 0 &&
        myCompanies.find(
          (c: MyCompaniesProps) => String(c?.uuid) === params?.uuid,
        )?.role) ||
      "";

    if (foundRole) {
      setRoleAccount(foundRole);
      setOldRoleAccount(foundRole);
    } else {
      setRoleAccount("");
      setOldRoleAccount("");
    }

    // If endpoint is done, automatically there is not execution for 'controller.abort'
    return () => controller.abort();
  }, [currentUser?.id, params?.uuid, flag]);

  return (
    <div className="rootCompanyPage">
      <NavigationCompany navigation={tab} setNavigation={setTabs} tabs={tabs} />
      {params?.uuid && (
        <FirstInfoCompany
          params={params}
          roleAccount={roleAccount}
          myFavorites={myFavorites}
          cId={currentUser?.id || ""}
          setFlag={setFlag}
          logo={companyData?.logo || ""}
          setCompanyData={setCompanyData}
          setBlobImage={setBlobImage}
        />
      )}
      <form action={formAction} id="formCompanyPage">
        <fieldset disabled={isPending}>
          <legend>Form Company Page</legend>
          {tabs[tab]?.component}
          {(!params?.uuid || roleAccount) && (
            <div className="boxButtonsForm">
              <BasicInput
                name="name"
                type="text"
                change={handleChangeForm("name")}
                // stateValue={state?.formData?.name}
                errorMsg={companyErrorData.name}
                value={companyData.name}
                lbl="Name"
                pl={"Name Company"}
              />
              <ButtonForm
                customStyles="buttonStyle_02"
                al={"aria.resetForm"}
                click={clearAllFormSetters}
                type="reset"
                text={"reset"}
                disabled={isPending}
                pendingForm={isPending}
              />
              <ButtonForm
                customStyles="buttonStyle_01"
                al={"aria.confirmForm"}
                type="submit"
                text={"confirm"}
                disabled={isPending}
                pendingForm={isPending}
              />
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
};

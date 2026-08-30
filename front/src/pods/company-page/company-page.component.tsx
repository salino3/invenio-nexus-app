import React, { useActionState, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { PropsTabs } from "@/store/interface-app";
import "./company-page.styles.scss";
import { ButtonForm } from "@/common";
import { useProviderSelector } from "@/store/provider";
import type { MyCompaniesProps } from "@/store/interface";
import { NavigationCompany } from "@/components";

// TODO: Moving it to interface file
const initialState: any = {
  success: false,
  error: "",
  fieldErrors: null,
  formData: null,
};

export const CompanyPage: React.FC = () => {
  const params = useParams() as { name: string; uuid: string };
  console.log("params", params);

  const { currentUser, myCompanies } = useProviderSelector(
    "currentUser",
    "myCompanies",
  );

  const [tab, setTabs] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(false);
  const [roleAccount, setRoleAccount] = useState<string>("");
  const [roleOldAccount, setOldRoleAccount] = useState<string>("");

  const [state, formAction, isPending] = useActionState(async function () {
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
    // TODO: Complete this function
  }

  useEffect(() => {
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
  }, [currentUser?.id, params?.uuid, flag]);

  return (
    <div className="rootCompanyPage">
      <NavigationCompany navigation={tab} setNavigation={setTabs} tabs={tabs} />
      <form action={formAction} id="formCompanyPage">
        <fieldset disabled={isPending}>
          <legend>Form Company Page</legend>
          {tabs[tab]?.component}
          {(!params?.uuid || roleAccount) && (
            <div className="boxButtonsForm">
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

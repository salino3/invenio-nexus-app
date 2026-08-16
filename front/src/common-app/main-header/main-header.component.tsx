import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import { Settings } from "../settings";
import { ImageComponent } from "../image";
import { ContainerDynamicList, SettingIcon, TriangleIcon } from "@/components";
import { routePaths } from "@/router/routes.interface";
import "./main-header.styles.scss";

interface LinkApp {
  pathName: string;
  title: string;
}

// Links <nav>
const linksApp: LinkApp[] = [
  {
    pathName: routePaths.dashboard,
    title: "Dashboard",
  },
  {
    pathName: routePaths.public_dashboard,
    title: "Books",
  },
  {
    pathName: routePaths.error_page,
    title: "Authors",
  },
];

export const MainHeader: React.FC = () => {
  const { t } = useTranslation("main");
  const { t: tw } = useTranslation("wcag");

  const location = useLocation();

  const { currentUser, setDataUser } = useProviderSelector(
    "currentUser",
    "setDataUser",
  );

  const [showSettings, setShowSettings] = useState<boolean | null>(null);
  const [showMyCompanies, setShowMyCompanies] = useState<boolean | null>(null);

  return (
    <div className="rootMainHeader">
      <div className="containerMainHeader">
        <div className="boxUp">
          <div className="leftBox">
            <div className="boxLogo">
              <ImageComponent
                vertical={false}
                src={`/web-icon.svg`}
                lazy={"lazy"}
                alt="Advertising 1"
                customStyle="boxImage"
              />
            </div>
            {currentUser?.email && (
              <button onClick={() => ServicesApp.closeSession(setDataUser)}>
                Logout
              </button>
            )}
          </div>
          <h3 className="title">Invenio Nexus</h3>
          <nav>
            <ul>
              {linksApp.map((link) => (
                <li key={link.pathName}>
                  <Link
                    style={
                      {
                        "--link-selected":
                          location.pathname === link.pathName
                            ? "underline"
                            : "none",
                      } as React.CSSProperties
                    }
                    to={link.pathName}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/*  */}
        <div className="boxDown">
          <div className="boxLeft">
            {currentUser?.email && (
              <button
                className="btnMyCompanies"
                onClick={() => setShowMyCompanies(!showMyCompanies)}
              >
                My Companies &nbsp; <TriangleIcon />
              </button>
            )}
            {showMyCompanies && (
              <ContainerDynamicList height={100}>
                <strong>ContainerDynamicList</strong>
              </ContainerDynamicList>
            )}
          </div>

          <div
            role="button"
            tabIndex={0}
            // aria-pressed={showSettings || "false"}
            aria-expanded={showSettings === true ? "true" : "false"} // aria-expanded accepts strings
            aria-label={tw("settings_toggle_header")}
            aria-controls="settingsPanel"
            onClick={() => setShowSettings(true)}
            style={{
              cursor: showSettings ? "default" : "pointer",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                setShowSettings(true);
              }
            }}
            id="spanSettingComponent"
            className="boxRight"
          >
            <span>
              {t("settings")} <SettingIcon />
            </span>
          </div>
          {showSettings && (
            <Settings
              showSettings={showSettings}
              setShowSettings={setShowSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

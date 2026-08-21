import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import { ContainerDynamicList, ListMyCompanies } from "@/composite-blocks";
import { Settings } from "../settings";
import { ImageComponent } from "../image";
import { SettingIcon, TriangleIcon } from "@/components";
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

const PX_FOR_COMPANY: number = 40;

export const MainHeader: React.FC = () => {
  const { t } = useTranslation("main");
  const { t: tw } = useTranslation("wcag");

  const location = useLocation();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { currentUser, setDataUser, myCompanies } = useProviderSelector(
    "currentUser",
    "setDataUser",
    "myCompanies",
  );

  const [showSettings, setShowSettings] = useState<boolean | null>(null);
  const [showMyCompanies, setShowMyCompanies] = useState<boolean | null>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  //
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (showMyCompanies) {
      // Mount content immediately when opening
      setIsMounted(true);
    } else {
      // Wait for the 1s CSS transition before unmounting
      timer = setTimeout(() => {
        setIsMounted(false);
      }, 850);
    }

    return () => clearTimeout(timer);
  }, [showMyCompanies]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click occurs outside the wrapper div, close the menu
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMyCompanies(false);
      }
    };

    if (showMyCompanies) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMyCompanies]);

  return (
    <div className="rootMainHeader">
      <div className="containerMainHeader">
        <div className="boxUp">
          <div className="leftBox">
            <div className="boxLogo">
              <ImageComponent
                isVertical={false}
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
          <div className="boxLeft" ref={dropdownRef}>
            {currentUser?.email && (
              <button
                className="btnMyCompanies"
                onClick={() => setShowMyCompanies(!showMyCompanies)}
              >
                My Companies &nbsp;
                <TriangleIcon transform={showMyCompanies ? "90" : "0"} />
              </button>
            )}
            {currentUser?.email && (
              <ContainerDynamicList
                arrayData={
                  myCompanies && myCompanies.length > 0 ? myCompanies : []
                }
                height={
                  showMyCompanies
                    ? myCompanies && (myCompanies.length + 1) * PX_FOR_COMPANY
                    : 0
                }
              >
                {isMounted ? <ListMyCompanies /> : null}
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

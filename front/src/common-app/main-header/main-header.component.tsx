import React, { useState } from "react";
import { ImageComponent } from "../image";
import { routePaths } from "@/router/routes.interface";
import { Link, useLocation } from "react-router-dom";
import "./main-header.styles.scss";
import { ModalApp } from "../modal-app";

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
  const location = useLocation();

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="rootMainHeader">
      <div className="containerMainHeader">
        <div className="boxLogo">
          <h5>Image</h5>
          <ImageComponent
            vertical={false}
            src={`/images/.png`}
            lazy={"lazy"}
            alt="Advertising 1"
            customStyle="boxImage"
          />
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
        <button onClick={() => setShowModal(true)}>Modal</button>
      </div>
      <ModalApp
        title="Payment Subscription"
        setShowModal={setShowModal}
        showModal={showModal}
      >
        X
      </ModalApp>
    </div>
  );
};

import type React from "react";
import { ImageComponent } from "../image";
import { routePaths } from "@/router/routes.interface";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <div className="rootMainHeader">
      <div className="containerMainHeader">
        <div className="boxLogo">
          <h5>Next.js Direct DB Connection Status:</h5>
          <ImageComponent
            vertical={false}
            src={`/images/.png`}
            lazy={"lazy"}
            alt="Advertising 1"
            customStyle="boxImage"
          />
        </div>
        <h3 className="title">Next App Library</h3>
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
    </div>
  );
};

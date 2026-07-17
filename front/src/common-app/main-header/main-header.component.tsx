import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { loadStripe, type StripeElementLocale } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import { ModalApp } from "../modal-app";
import { ImageComponent } from "../image";
import { CheckoutForm } from "@/components";
import { VITE_APP_API_URL_PAYMENT } from "@/constants";
import { routePaths } from "@/router/routes.interface";
import "./main-header.styles.scss";

/**
 * Start Stirpe staff
 */

if (!VITE_APP_API_URL_PAYMENT) {
  console.error("⚠️ Stripe Publishable Key is missing! Check your .env file.");
}

const stripePromise = loadStripe(VITE_APP_API_URL_PAYMENT);

const options = {
  locale: "en" as StripeElementLocale,
  // appearance: {
  //   theme: "stripe", // Options: 'stripe', 'night', 'flat', 'none'
  //   variables: {
  //     colorPrimary: "#4f46e5", // Matches your indigo button
  //     colorBackground: "#f9f9f9",
  //     borderRadius: "4px",
  //   },
  // },
};

/**
 * End Stirpe staff
 */

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

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="rootMainHeader">
      <div className="containerMainHeader">
        <div className="leftBox">
          <div className="boxLogo">
            <ImageComponent
              vertical={false}
              src={`/images/.png`}
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
        {currentUser?.email && (
          <>
            <button onClick={() => setShowModal(true)}>Modal</button>
            <ModalApp
              title="Payment Subscription"
              setShowModal={setShowModal}
              showModal={showModal}
            >
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm />
              </Elements>
            </ModalApp>
          </>
        )}
      </div>
    </div>
  );
};

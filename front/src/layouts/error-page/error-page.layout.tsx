import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ModalApp } from "../../common-app";
import { routePaths } from "../../router/routes.interface";
import "./error-page.styles.scss";

const ErrorPageLayout: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="error-page-layout">
      <div className="error-card">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to={routePaths.public_dashboard} className="back-home-btn">
          Go Back Home
        </Link>

        <button onClick={() => setShowModal(true)} className="modal-btn">
          Show modal
        </button>
      </div>
      <ModalApp
        showModal={showModal}
        setShowModal={setShowModal}
        title="Modal Error Page"
      >
        ¡Hola!
      </ModalApp>
    </div>
  );
};

export default ErrorPageLayout;

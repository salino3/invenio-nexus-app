import type React from "react";
import { useParams } from "react-router-dom";
import "./reset-password.styles.scss";

export const ResetPassword: React.FC = () => {
  const { token } = useParams();
  return (
    <div className="rootResetPassword">
      <form action="">
        <fieldset disabled={false}>
          rootResetPassword
          <h2>{token}</h2>
        </fieldset>
      </form>
    </div>
  );
};

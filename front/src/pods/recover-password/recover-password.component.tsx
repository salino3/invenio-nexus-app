import React, { useState } from "react";
import { ServicesApp } from "@/store/services";
import "./recover-password.styles.scss";

export const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await ServicesApp.recoverPassword(email);

      if (success) {
        setStatusMessage({
          type: "success",
          text: "If an account exists with that email, we have sent a password reset link.",
        });
        setEmail("");
      } else {
        setStatusMessage({
          type: "error",
          text: "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rootRecoverPassword">
      <div className="recover-password-card">
        <h2>Recover Password</h2>
        <p>Enter your email address to receive a password reset link.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isSubmitting}
              required
            />
          </div>

          {statusMessage && (
            <div className={`status-message ${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

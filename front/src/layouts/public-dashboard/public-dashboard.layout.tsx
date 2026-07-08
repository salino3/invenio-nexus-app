import { PublicDashboard } from "@/pods";
import { useEffect, useState } from "react";
import { useProviderSelector } from "@/store/provider";
import { VITE_TOKEN, VITE_URL_BACK } from "@/constants";
import "./public-dashboard.styles.scss";

const PublicDashboardLayout: React.FC = () => {
  const { setDataUser } = useProviderSelector("setDataUser");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkGoogleSession = async () => {
      try {
        const res = await fetch(`${VITE_URL_BACK}/auth/get-me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.token) sessionStorage.setItem(VITE_TOKEN, data.token);
        if (data.user) setDataUser?.(data.user);
      } catch (error) {
        console.log("No hay sesión activa de Google:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkGoogleSession();
  }, [setDataUser]);

  // 👈 3. Si sigue verificando la cookie, NO renderizamos la interfaz de login
  if (isLoading) {
    return (
      <div className="loadingContainer">
        <p>Verificando sesión...</p>{" "}
        {/* Puedes poner aquí un Spinner o pantalla limpia */}
      </div>
    );
  }

  return (
    <div className="rootPublicDashboardLayout">
      <PublicDashboard />
    </div>
  );
};

export default PublicDashboardLayout;

import { jwtDecode } from "jwt-decode";
import type { PropsCurrentAccount } from "@/store/interface";
import { VITE_TOKEN } from "@/constants";

//*
export const regexCorrectEmail: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const utilitiesApp = () => {
  //*
  const getAuthToken = (): PropsCurrentAccount | null => {
    const token = sessionStorage.getItem(VITE_TOKEN);

    if (!token) return null;

    // Verifiying it is divided in 3 parts - header, payload and signature
    if (token && token.split(".").length === 3) {
      try {
        const decoded: any = jwtDecode<PropsCurrentAccount>(token);
        return decoded || null;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    } else {
      console.error("Invalid JWT format.");
      return null;
    }
  };

  //
  const handleImgError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    vertical: boolean = true,
  ) => {
    const target = e.currentTarget;

    // Construct the explicit path matching your public folder file names exactly
    const fileName = vertical
      ? "error-img-default-vertical.png"
      : "error-img-default-horizontal.png";

    const fallbackSrc = `/error-images/${fileName}`;

    // Prevent an infinite rendering loop if the fallback image itself is missing or corrupted
    // If the image current source ALREADY ends with our fallback filename...
    if (target.src.endsWith(fileName)) {
      return; // ...stop executing. Do not try to re-assign it.
    }

    target.src = fallbackSrc;
  };

  return { getAuthToken, handleImgError };
};

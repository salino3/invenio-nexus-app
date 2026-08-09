import { jwtDecode } from "jwt-decode";
import { useProviderSelector } from "@/store/provider";
import { ServicesApp } from "@/store/services";
import type { PropsCurrentAccount } from "@/store/interface";
import { VITE_TOKEN } from "@/constants";

//*
export const regexCorrectEmail: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const utilitiesApp = () => {
  const { setDataUser } = useProviderSelector("setDataUser");

  //*
  const getAuthToken = (): PropsCurrentAccount | null => {
    const token = sessionStorage.getItem(VITE_TOKEN);

    if (!token) return null;

    // Verifiying it is divided in 3 parts - header, payload and signature
    if (token && token.split(".").length === 3) {
      try {
        const decoded: any = jwtDecode<PropsCurrentAccount>(token);

        // JWT 'exp' is in seconds, Date.now() is in milliseconds
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        // If token is already expired, treat it as null
        if (decoded.exp && decoded.exp <= currentTimeInSeconds) {
          console.warn("Token has expired.");
          ServicesApp.closeSession(setDataUser);
          return null;
        }

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

  //
  const getCountryName = (
    countryCode: string,
    locale: string = "en", // TODO: Use language value from 'i18next'
  ): string => {
    if (!countryCode) return "-";

    try {
      const regionNames = new Intl.DisplayNames([locale], { type: "region" });
      return regionNames.of(countryCode.toUpperCase()) || countryCode;
    } catch (error) {
      return countryCode;
    }
  };

  //
  const getCountryFlag = (countryCode: string): string => {
    if (!countryCode) return "-";

    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
  };

  return { getAuthToken, handleImgError, getCountryName, getCountryFlag };
};

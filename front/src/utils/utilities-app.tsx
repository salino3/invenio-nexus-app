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
        const decoded = jwtDecode<PropsCurrentAccount>(token);

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
    isVertical: boolean = true,
  ) => {
    const target = e.currentTarget;

    // Construct the explicit path matching your public folder file names exactly
    const fileName = isVertical
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

  //
  const handleNumericPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Prevent the default paste action immediately to control the input flow
    e.preventDefault();

    const input = e.currentTarget;

    // 1. Get the pasted text from the clipboard data
    const paste = e.clipboardData.getData("text");

    // 2. Clean the pasted text: only allow digits (0-9) and the decimal point (.)
    let cleanedPaste = paste.replace(/[^\d.]/g, "");

    // 3. Handle multiple decimal points in the pasted content itself (e.g., "1.2.3" -> "1.23")
    if (cleanedPaste.includes(".")) {
      const parts = cleanedPaste.split(".");
      // Rebuild the string using the first part, one dot, and the rest of the digits
      cleanedPaste = parts[0] + "." + parts.slice(1).join("");
    }

    // 4. Determine cursor/selection position to calculate the final value
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    // 5. Calculate the combined final value (current value + cleaned paste)
    const currentValue = input.value;
    const finalValue =
      currentValue.substring(0, start) +
      cleanedPaste +
      currentValue.substring(end);

    // 6. Check: Block the paste if the combined value results in more than one decimal point
    if (finalValue.split(".").length > 2) {
      return;
    }

    // 7. Insert the cleaned text using the modern, non-deprecated setRangeText method.
    // This updates the input value property.
    input.setRangeText(cleanedPaste, start, end, "end");

    // 8. Manually dispatch the 'input' event to notify React and trigger the 'onChange' prop.
    // This is crucial because setRangeText does not automatically fire React's change event.
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };

  return {
    getAuthToken,
    handleImgError,
    getCountryName,
    getCountryFlag,
    handleNumericPaste,
  };
};

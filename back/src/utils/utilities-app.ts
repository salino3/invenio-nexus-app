export const utilitiesApp = () => {
  //
  const requiredFields = <T extends Record<string, any>>(data: T) =>
    Object.entries(data).reduce<string[]>((acc, [key, value]) => {
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && !value.trim())
      ) {
        const formattedKey =
          key === "confirmPassword" ? "Confirm password" : key;
        acc.push(formattedKey);
      }
      return acc;
    }, []);

  return {
    requiredFields,
  };
};

export const utilitiesApp = () => {
  const regexCorrectEmail: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return {
    regexCorrectEmail,
  };
};

import fs from "fs";

export const utilitiesApp = () => {
  //
  const checkRequiredFields = <T extends Record<string, any>>(data: T) =>
    Object.entries(data).reduce<string[]>((acc, [key, value]) => {
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && !value.trim())
      ) {
        const formattedKey =
          key === "confirmPassword" ? "confirm password" : key;
        acc.push(formattedKey);
      }
      return acc;
    }, []);

  /**
   * Deletes uploaded files from disk if validation or DB operations fail.
   */
  const cleanupUploadedFiles = (
    files?:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[],
  ) => {
    if (!files) return;

    const fileList: Express.Multer.File[] = Array.isArray(files)
      ? files
      : Object.values(files).flat();

    fileList.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlink(file.path, (err) => {
          if (err)
            console.error(`Failed to delete orphaned file ${file.path}:`, err);
        });
      }
    });
  };

  return {
    checkRequiredFields,
    cleanupUploadedFiles,
  };
};

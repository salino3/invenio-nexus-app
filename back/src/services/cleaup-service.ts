import fs from "fs/promises";
import path from "path";
import { query } from "../db";

const UPLOADS_DIR = path.join(__dirname, "../../public/uploads");

/**
 * Sweeps /public/uploads and deletes files not referenced in PostgreSQL
 */
export async function cleanupOrphanedFiles(): Promise<void> {
  try {
    // 1. Read all files currently sitting on disk
    const diskFiles = await fs.readdir(UPLOADS_DIR);
    if (diskFiles.length === 0) return;

    // 2. Fetch all active logos and multimedia references from DB
    const { rows } = await query(`
      SELECT logo, multimedia 
      FROM companies
    `);

    // 3. Collect active relative file paths into a Set for O(1) lookup
    const activePaths = new Set<string>();

    for (const row of rows) {
      if (row.logo) {
        activePaths.add(row.logo);
      }

      if (Array.isArray(row.multimedia)) {
        for (const item of row.multimedia) {
          if (item?.file_url) {
            activePaths.add(item.file_url);
          }
        }
      }
    }

    // 4. Compare disk files against database entries
    let deletedCount = 0;

    for (const file of diskFiles) {
      const relativePath = `/uploads/${file}`;

      // If the file on disk isn't linked to any database record, remove it
      if (!activePaths.has(relativePath)) {
        const fullPath = path.join(UPLOADS_DIR, file);
        await fs.unlink(fullPath);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(
        `[Cron Cleanup] Successfully removed ${deletedCount} orphaned file(s).`,
      );
    }
  } catch (error) {
    console.error(
      "[Cron Cleanup] Error running orphaned files cleanup:",
      error,
    );
  }
}

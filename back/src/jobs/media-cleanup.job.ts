import cron from "node-cron";
import { cleanupOrphanedFiles } from "../services/cleaup-service";

export function initMediaCleanupJob() {
  // Runs every day at 3:00 AM (Server Time)
  cron.schedule("0 3 * * *", async () => {
    console.log("[Cron Job] Starting daily media cleanup sweep...");
    await cleanupOrphanedFiles();
  });

  console.log("⏰ Media cleanup cron job initialized.");
}

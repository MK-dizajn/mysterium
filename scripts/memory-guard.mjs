// Strážca pamäte: kým beží server Next tohto projektu, každých pár sekúnd zmeria
// pamäť všetkých jeho procesov node (server aj pomocné). Nad limitom alebo pri
// priveľa procesoch server ukončí, aby sa počítač nezasekol.
// Záznam: .next/memory-guard.log
// Použitie: node scripts/memory-guard.mjs [limit MB] [najviac procesov]
import { appendFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { PROJECT_DIR, projectServerProcesses, sleep, stopAll } from "./processes.mjs";

const LIMIT_MB = Number(process.argv[2] ?? 6144);
const MAX_PROCESSES = Number(process.argv[3] ?? 60);
const INTERVAL_MS = 5000;
const START_GRACE_MS = 180000;

mkdirSync(join(PROJECT_DIR, ".next"), { recursive: true });
const logFile = join(PROJECT_DIR, ".next", "memory-guard.log");
const log = (text) => {
  const time = new Date().toLocaleString("sk-SK");
  appendFileSync(logFile, `${time}  ${text}\n`, "utf8");
};

const start = Date.now();
let seen = false;
let peakMb = 0;
let peakCount = 0;
log(`strážca spustený: limit ${LIMIT_MB} MB, najviac ${MAX_PROCESSES} procesov`);

for (;;) {
  const nodes = projectServerProcesses();

  if (nodes.length === 0) {
    if (seen || Date.now() - start > START_GRACE_MS) {
      log(`server skončil; najviac ${peakMb} MB a ${peakCount} procesov`);
      process.exit(0);
    }
  } else {
    seen = true;
    const totalMb = nodes.reduce((sum, p) => sum + p.mb, 0);
    peakMb = Math.max(peakMb, totalMb);
    peakCount = Math.max(peakCount, nodes.length);

    if (totalMb > LIMIT_MB || nodes.length > MAX_PROCESSES) {
      log(`LIMIT PREKROČENÝ: ${totalMb} MB, ${nodes.length} procesov – server sa ukončuje`);
      const report = await stopAll({ log, keepGuard: true });
      log(`server ukončený strážcom pamäte (uvoľnené približne ${report.mb} MB)`);

      // Stovky pomocných procesov spôsobila poškodená vyrovnávacia pamäť Turbopacku
      // (28. 10. 2026); zmaže sa, pri ďalšom spustení sa vytvorí znova.
      if (nodes.length > MAX_PROCESSES) {
        rmSync(join(PROJECT_DIR, ".next", "dev"), { recursive: true, force: true });
        log("vyrovnávacia pamäť .next/dev zmazaná (priveľa procesov)");
      }
      process.exit(2);
    }
  }

  await sleep(INTERVAL_MS);
}

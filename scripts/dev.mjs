// npm run dev – bezpečné spustenie vývojového servera:
// - iba jeden server naraz, vždy na porte 3000 (keď je obsadený, nespustí sa),
// - limit pamäte pre JavaScript v node (NODE_OPTIONS),
// - strážca pamäte na pozadí (scripts/memory-guard.mjs).
// Zastavenie: npm run stop
import { spawn } from "node:child_process";
import { join } from "node:path";
import { PROJECT_DIR, isPortInUse } from "./processes.mjs";

if (await isPortInUse(3000)) {
  console.log("Port 3000 je obsadený – už beží iný server. Najprv ho zastav: npm run stop");
  process.exit(1);
}

const guard = spawn(process.execPath, [join(PROJECT_DIR, "scripts", "memory-guard.mjs")], {
  cwd: PROJECT_DIR,
  detached: true,
  stdio: "ignore",
  windowsHide: true,
});
guard.unref();

const server = spawn(
  process.execPath,
  [join(PROJECT_DIR, "node_modules", "next", "dist", "bin", "next"), "dev", "--port", "3000"],
  {
    cwd: PROJECT_DIR,
    stdio: "inherit",
    env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=4096" },
  }
);

server.on("exit", (code) => process.exit(code ?? 0));

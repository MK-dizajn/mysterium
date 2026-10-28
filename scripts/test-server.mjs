// npm run test:server – hotová verzia hry pre testy v prehliadači:
// upratanie zabudnutých procesov, build a potom „next start“ na porte 3000
// so strážcom pamäte. Server beží na pozadí; zastavenie: npm run stop
import { spawn, spawnSync } from "node:child_process";
import { join } from "node:path";
import { PROJECT_DIR, isPortInUse, sleep, stopAll } from "./processes.mjs";

await stopAll();

if (await isPortInUse(3000)) {
  console.log("Port 3000 je obsadený iným programom – testovací server sa nespustí.");
  process.exit(1);
}

const next = join(PROJECT_DIR, "node_modules", "next", "dist", "bin", "next");
const env = { ...process.env, NODE_OPTIONS: "--max-old-space-size=4096" };

const build = spawnSync(process.execPath, [next, "build"], {
  cwd: PROJECT_DIR,
  stdio: "inherit",
  env,
});

if (build.status !== 0) {
  console.log("Build zlyhal – testovací server sa nespustí.");
  process.exit(1);
}

const guard = spawn(process.execPath, [join(PROJECT_DIR, "scripts", "memory-guard.mjs")], {
  cwd: PROJECT_DIR,
  detached: true,
  stdio: "ignore",
  windowsHide: true,
});
guard.unref();

const server = spawn(process.execPath, [next, "start", "--port", "3000"], {
  cwd: PROJECT_DIR,
  detached: true,
  stdio: "ignore",
  windowsHide: true,
  env,
});
server.unref();

for (let i = 0; i < 120; i++) {
  if (await isPortInUse(3000)) {
    console.log("Testovací server (hotová verzia) beží na http://localhost:3000 – zastavenie: npm run stop");
    process.exit(0);
  }

  await sleep(500);
}

console.log("Testovací server sa nespustil.");
await stopAll();
process.exit(1);

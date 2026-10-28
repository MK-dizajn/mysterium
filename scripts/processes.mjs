// Spoločné funkcie pre bezpečné spúšťanie a zastavenie servera (iba Windows).
// Zoznam procesov sa zisťuje príkazom PowerShellu (nie spúšťaním súboru .ps1),
// takže netreba meniť nastavenia spúšťania skriptov vo Windows.
import { execFileSync } from "node:child_process";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PROJECT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = PROJECT_DIR.toLowerCase();

/** Procesy node a chrome: číslo, rodič, príkaz a pamäť v MB. */
export function listProcesses() {
  const command =
    "Get-CimInstance Win32_Process -Filter \"Name='node.exe' OR Name='chrome.exe'\" | " +
    "Select-Object ProcessId,ParentProcessId,Name,CommandLine,WorkingSetSize | ConvertTo-Json -Compress";
  const output = execFileSync("powershell", ["-NoProfile", "-Command", command], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  }).trim();

  if (!output) {
    return [];
  }

  const parsed = JSON.parse(output);

  return (Array.isArray(parsed) ? parsed : [parsed]).map((p) => ({
    pid: p.ProcessId,
    ppid: p.ParentProcessId,
    name: String(p.Name).toLowerCase(),
    cmd: String(p.CommandLine ?? ""),
    mb: Math.round(Number(p.WorkingSetSize ?? 0) / 1024 / 1024),
  }));
}

/** Procesy node tohto projektu (server Next a jeho pomocné procesy), bez našich skriptov. */
export function projectServerProcesses(processes = listProcesses()) {
  return processes.filter((p) => {
    const cmd = p.cmd.toLowerCase();
    return (
      p.name === "node.exe" &&
      p.pid !== process.pid &&
      cmd.includes(project) &&
      !cmd.includes(`${project}\\scripts\\`)
    );
  });
}

/** Pomocný proces servera (Turbopack ho spúšťa zo súboru v .next). */
export function isHelperProcess(p) {
  return p.cmd.toLowerCase().includes("\\.next\\");
}

/** Strážca pamäte tohto projektu. */
export function memoryGuardProcesses(processes = listProcesses()) {
  return processes.filter(
    (p) =>
      p.name === "node.exe" &&
      p.pid !== process.pid &&
      p.cmd.toLowerCase().includes("memory-guard.mjs") &&
      p.cmd.toLowerCase().includes(project)
  );
}

/** Testovací Chrome: iba neviditeľný s testovacím profilom (bežný Chrome nikdy). */
export function testChromeProcesses(processes = listProcesses()) {
  return processes.filter(
    (p) =>
      p.name === "chrome.exe" &&
      p.cmd.includes("--headless") &&
      p.cmd.includes("chrome-profile-")
  );
}

export function killProcess(pid) {
  try {
    process.kill(pid);
    return true;
  } catch {
    return false;
  }
}

/** Je port obsadený? (napríklad 3000 pre server) */
export function isPortInUse(port) {
  return new Promise((resolvePort) => {
    const server = createServer();
    server.once("error", () => resolvePort(true));
    server.once("listening", () => server.close(() => resolvePort(false)));
    server.listen(port);
  });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Ukončí server Next tohto projektu, jeho pomocné procesy, strážcu pamäte
 * a testovací Chrome. Najprv samotný server, až potom pomocné procesy:
 * keď sa pomocné ukončia skôr, server ich hneď spustí znova
 * (28. 10. 2026 takto vzniklo za minútu vyše 1 000 procesov node).
 */
export async function stopAll({ log = console.log, keepGuard = false } = {}) {
  const report = { server: 0, helpers: 0, guard: 0, chrome: 0, mb: 0 };
  const processes = listProcesses();

  // Strážca ostane do konca: keď server zmizne, sám zapíše najvyššiu pamäť a skončí.
  for (const p of projectServerProcesses(processes).filter((p) => !isHelperProcess(p))) {
    if (killProcess(p.pid)) {
      report.server++;
      report.mb += p.mb;
      log(`Ukončený server Next: Id ${p.pid}, ${p.mb} MB`);
    }
  }

  // Pomocné procesy a siroty: opakovane, kým 3 sekundy po sebe nič nepribudne.
  for (let round = 0, calm = 0; round < 30 && calm < 3; round++) {
    await sleep(1000);
    const left = projectServerProcesses();

    if (left.length === 0) {
      calm++;
      continue;
    }

    calm = 0;

    for (const p of left) {
      if (killProcess(p.pid)) {
        report.helpers++;
        report.mb += p.mb;
      }
    }
  }

  if (report.helpers) log(`Ukončené pomocné procesy servera: ${report.helpers}`);

  for (const p of testChromeProcesses()) {
    if (killProcess(p.pid)) report.chrome++;
  }

  if (report.chrome) log(`Ukončený testovací Chrome: ${report.chrome} procesov`);

  if (!keepGuard) {
    // Strážca kontroluje každých 5 s; chvíľu počká, nech zapíše záznam.
    for (let i = 0; i < 8 && memoryGuardProcesses().length > 0; i++) {
      await sleep(1000);
    }

    for (const p of memoryGuardProcesses()) {
      if (killProcess(p.pid)) report.guard++;
    }

    if (report.guard) log("Ukončený strážca pamäte.");
  }

  return report;
}

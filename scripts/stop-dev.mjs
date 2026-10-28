// npm run stop – ukončí zabudnutý server Next tohto projektu (vývojový aj testovací)
// s jeho pomocnými procesmi, strážcu pamäte a testovací Chrome. Bežný Chrome nechá.
import { isPortInUse, projectServerProcesses, stopAll } from "./processes.mjs";

const report = await stopAll();

if (!report.server && !report.helpers && !report.guard && !report.chrome) {
  console.log("Žiadne zabudnuté procesy.");
} else if (report.mb) {
  console.log(`Uvoľnené približne ${report.mb} MB pamäte.`);
}

const left = projectServerProcesses().length;

if (left > 0) {
  console.log(`POZOR: stále beží ${left} procesov node tohto projektu.`);
  process.exit(1);
}

if (await isPortInUse(3000)) {
  console.log("POZOR: port 3000 je stále obsadený iným programom.");
  process.exit(1);
}

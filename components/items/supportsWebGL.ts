/**
 * Dá sa použiť 3D zobrazenie predmetu? Nie, ak prehliadač nevie WebGL,
 * alebo ak je v adrese skrytý prepínač ?bez3d (na skúšanie 2D zálohy).
 */
export function canUse3D() {
  if (typeof window === "undefined") {
    return false;
  }

  if (new URLSearchParams(window.location.search).has("bez3d")) {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

    if (!gl) {
      return false;
    }

    // Skúšobný kontext hneď uvoľníme, aby nezaberal miesto.
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    return true;
  } catch {
    return false;
  }
}

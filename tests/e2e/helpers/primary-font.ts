// Passed directly to locator.evaluate: keep this function self-contained so it
// runs in the page rather than depending on modules from the test process.
export async function loadPrimaryFont(node: Element) {
  const style = getComputedStyle(node);
  const family = style.fontFamily.split(",")[0].trim();
  const primary = family.replace(/["']/g, "");
  // Loading the whole stack also requests Next's local Arial fallback, which
  // may not exist on Linux even when the intended WOFF2 face works correctly.
  const faces = await document.fonts.load(
    `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${family}`,
  );
  const matching = faces.filter(
    (face) => face.family.replace(/["']/g, "") === primary,
  );
  if (!matching.length)
    throw new Error(`No registered primary web font matched ${family}`);
  return {
    family: primary,
    size: parseFloat(style.fontSize),
    weight: style.fontWeight,
    leading: parseFloat(style.lineHeight),
    spacing: style.letterSpacing,
    transform: style.textTransform,
    synthesis: style.fontSynthesis,
    faces: matching.map((face) => ({
      status: face.status,
      display: face.display,
      style: face.style,
      weight: face.weight,
    })),
  };
}

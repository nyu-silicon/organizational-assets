const glyphs = "abcdefghijklmnopqrstuvwxyz0123456789!<>-_/\\[]{}=+*^?#";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// On hover, cycle each character through random glyphs, settling left to right.
document.querySelectorAll("[data-scramble]").forEach((el) => {
  const text = el.textContent;
  let frame;

  el.addEventListener("mouseenter", () => {
    if (reduceMotion) return;
    cancelAnimationFrame(frame);
    const start = performance.now();
    const tick = (now) => {
      const settled = Math.floor((now - start) / 30);
      el.textContent = [...text]
        .map((ch, i) =>
          i < settled || ch === " " || ch === "[" || ch === "]"
            ? ch
            : glyphs[Math.floor(Math.random() * glyphs.length)],
        )
        .join("");
      if (settled < text.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  });
});

import { useEffect, useRef, useState } from "react";

/**
 * Reveals a transcript line-by-line / char-by-char.
 * lines: [{ kind: "cmd" | "out" | "info", text }]
 * cmd lines type like a human, out/info lines print after a pause.
 */
export function useTypedLines(lines, active) {
  const [progress, setProgress] = useState({ line: 0, chars: 0 });
  const linesRef = useRef(lines);
  linesRef.current = lines;

  useEffect(() => {
    if (!active) {
      setProgress({ line: 0, chars: 0 });
      return;
    }
    if (progress.line >= linesRef.current.length) return;
    const cur = linesRef.current[progress.line];
    const done = progress.chars >= cur.text.length;
    const delay = cur.kind === "cmd" ? (done ? 520 : 26) : done ? 380 : 4;
    const t = setTimeout(() => {
      setProgress((p) =>
        p.chars >= linesRef.current[p.line].text.length
          ? { line: p.line + 1, chars: 0 }
          : { ...p, chars: p.chars + 1 }
      );
    }, delay);
    return () => clearTimeout(t);
  }, [active, progress]);

  return progress;
}

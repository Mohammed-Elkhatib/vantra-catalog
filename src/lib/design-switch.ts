/**
 * Map a path in one design to the equivalent path in the other, so the
 * A/B switcher keeps the visitor on the same page type.
 * current="a": prepend the /v2 prefix. current="b": strip it.
 */
export function counterpartPath(pathname: string, current: "a" | "b"): string {
  if (current === "a") {
    return pathname === "/" ? "/v2" : `/v2${pathname}`;
  }
  const stripped = pathname.replace(/^\/v2/, "");
  return stripped === "" ? "/" : stripped;
}

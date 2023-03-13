/** @type {import("@sveltejs/kit").ParamMatcher} */
export function match(param) {
  return /^c[0-9a-z]{6,}$/.test(param);
}

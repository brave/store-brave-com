/** @type {import("@sveltejs/kit").ParamMatcher} */
export function match(param) {
  return /^[a-zA-Z0-9_-]+$/.test(param);
}

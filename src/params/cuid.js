/** @type {import("@sveltejs/kit").ParamMatcher} */
export function match(param) {
  return /^c\S{6,}$/.test(param);
}

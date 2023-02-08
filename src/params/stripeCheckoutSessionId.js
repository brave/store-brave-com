/** @type {import("@sveltejs/kit").ParamMatcher} */
export function match(param) {
  return /^cs_[a-zA-Z0-9_-]+$/.test(param);
}

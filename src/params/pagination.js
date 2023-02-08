/** @type {import("@sveltejs/kit").ParamMatcher} */
export function match(param) {
  if (param) {
    // Since this is used for a ...rest param, this must account for presence of trailing slash.
    return /^page\/\d+?\/?$/.test(param);
  } else {
    return true;
  }
}

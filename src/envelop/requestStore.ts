// WeakMap lets buildHeaders and useMetadata share the requestId without coupling
// the plugins directly. Request objects are garbage-collected naturally so there
// is no memory leak risk.
export const requestIds = new WeakMap<Request, string>();

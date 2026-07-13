// The page components were originally built as Claude artifacts, which
// provide a built-in `window.storage` API backed by Anthropic's servers.
// That API doesn't exist in a normal browser / local dev environment, so
// this file recreates the same shape using localStorage instead, and
// attaches it to `window.storage` so none of the page code needs to change.
//
// Note: localStorage is per-browser, not shared across visitors like the
// real artifact storage was. For a real multi-user "letters sent" counter
// or shared brainstorm ideas that everyone sees, you'd eventually want a
// small real backend (a database) instead of this. This shim is meant to
// get you running locally today, not as the final production answer.

function keyFor(key, shared) {
  return `${shared ? "shared" : "personal"}:${key}`;
}

window.storage = {
  async get(key, shared = false) {
    const raw = localStorage.getItem(keyFor(key, shared));
    if (raw === null) return null;
    return { key, value: raw, shared };
  },

  async set(key, value, shared = false) {
    localStorage.setItem(keyFor(key, shared), String(value));
    return { key, value: String(value), shared };
  },

  async delete(key, shared = false) {
    const existed = localStorage.getItem(keyFor(key, shared)) !== null;
    localStorage.removeItem(keyFor(key, shared));
    return { key, deleted: existed, shared };
  },

  async list(prefix = "", shared = false) {
    const fullPrefix = keyFor(prefix, shared);
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(fullPrefix)) keys.push(k.replace(`${shared ? "shared" : "personal"}:`, ""));
    }
    return { keys, prefix, shared };
  },
};

const DEVICE_ID_KEY = "uns_anon_device_id";

/**
 * A random, client-only device id. It never identifies a person: the server
 * HMACs it with a pepper (see api/posts, api/bookmarks) before it touches the
 * database, so there is no stored value that maps back here. Call only in the
 * browser.
 */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

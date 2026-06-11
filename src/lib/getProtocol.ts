export default function getProtocol(path: string) {
  try {
    const url = new URL(path);
    return url.protocol;
  } catch (e) {
    if (e instanceof TypeError) {
      return "file:";
    }
    throw e;
  }
}

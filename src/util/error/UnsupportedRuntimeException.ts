export default class UnsupportedRuntimeException extends Error {
  constructor() {
    super("This runtime is unsupported");
  }
}

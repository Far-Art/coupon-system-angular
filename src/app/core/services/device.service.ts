export class DeviceService {

  constructor() { }

  get deviceMemory() {
    try {
      return navigator['deviceMemory']?.();
    } catch (e) {
      console.info('navigator.deviceMemory not supported');
    }
  }

  get language() {
    const lang = navigator.language;
    if (lang.length > 3) {
      return lang.substring(0, 3) + lang.substring(3).toUpperCase();
    }
    return lang;
  }

  get isBrowserOnline() {
    return navigator.onLine;
  }

  get isUserActive() {
    return navigator['userActivation']?.isActive;
  }

}

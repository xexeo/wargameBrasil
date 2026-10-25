export class BrowserStore {
    read(key) { try {
        return globalThis.localStorage.getItem(key);
    }
    catch {
        return null;
    } }
    write(key, value) { try {
        globalThis.localStorage.setItem(key, value);
        return true;
    }
    catch {
        return false;
    } }
    remove(key) { try {
        globalThis.localStorage.removeItem(key);
        return true;
    }
    catch {
        return false;
    } }
}
export const browserStore = new BrowserStore();
//# sourceMappingURL=persistence.js.map
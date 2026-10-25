// Replace this adapter with app-native storage without changing rules or learning.
export interface KeyValueStore {read(key:string):string|null;write(key:string,value:string):boolean;remove(key:string):boolean}
export class BrowserStore implements KeyValueStore {
 read(key:string){try{return globalThis.localStorage.getItem(key);}catch{return null;}}
 write(key:string,value:string){try{globalThis.localStorage.setItem(key,value);return true;}catch{return false;}}
 remove(key:string){try{globalThis.localStorage.removeItem(key);return true;}catch{return false;}}
}
export const browserStore=new BrowserStore();

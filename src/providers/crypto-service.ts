import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js"

/**
 * This class provide authentication service
 */
@Injectable()
export class CryptoService {

  private key: string = "this-is-the-key";
  constructor() { }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value,this.key)
  }

  decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, this.key).toString(CryptoJS.enc.Utf8);
  }
}

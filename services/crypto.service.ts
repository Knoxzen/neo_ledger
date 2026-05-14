// services/crypto.service.ts

export class CryptoService {
  private static ALGO = 'AES-GCM';
  private static KEY_STORE_NAME = 'NEO_KEY';

  async getOrCreateKey(): Promise<CryptoKey> {
    if (typeof window === 'undefined') return {} as CryptoKey;
    const storedKey = localStorage.getItem(CryptoService.KEY_STORE_NAME);
    
    if (storedKey) {
      const keyBuffer = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0));
      return await window.crypto.subtle.importKey(
        'raw', keyBuffer, CryptoService.ALGO, true, ['encrypt', 'decrypt']
      );
    }

    const key = await window.crypto.subtle.generateKey(
      { name: CryptoService.ALGO, length: 256 }, true, ['encrypt', 'decrypt']
    );

    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    localStorage.setItem(
      CryptoService.KEY_STORE_NAME, 
      btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
    );

    return key;
  }

  async encryptData(data: string): Promise<Blob> {
    const key = await this.getOrCreateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: CryptoService.ALGO, iv }, key, new TextEncoder().encode(data)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return new Blob([combined], { type: 'application/octet-stream' });
  }

  async decryptData(blob: Blob): Promise<string> {
    const key = await this.getOrCreateKey();
    const data = new Uint8Array(await blob.arrayBuffer());
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: CryptoService.ALGO, iv }, key, encrypted
    );
    return new TextDecoder().decode(decrypted);
  }
}

export const cryptoService = new CryptoService();

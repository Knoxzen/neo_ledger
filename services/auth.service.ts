// services/auth.service.ts

import { GoogleUser } from '../types/auth';

export class AuthService {
  private clientId: string = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  private tokenClient: any = null;
  private scopes: string = 'profile email https://www.googleapis.com/auth/drive.appdata';

  initTokenClient() {
    if (typeof window !== 'undefined' && (window as any).google) {
      this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scopes,
        callback: (response: any) => {
          if (response.error) return;
          this.handleTokenResponse(response);
        },
      });
    }
  }

  login() {
    if (!this.tokenClient) this.initTokenClient();
    if (this.tokenClient) this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  private handleTokenResponse(response: any) {
    const expiresAt = Date.now() + response.expires_in * 1000;
    localStorage.setItem('NEO_AUTH', JSON.stringify({
      accessToken: response.access_token,
      expiresAt,
    }));
    
    // Set cookie for API routes
    document.cookie = `neo_access_token=${response.access_token}; path=/; max-age=${response.expires_in}; SameSite=Lax`;
    
    window.dispatchEvent(new CustomEvent('NEO_AUTH_SUCCESS', { detail: response }));
  }

  async fetchUserInfo(accessToken: string): Promise<GoogleUser> {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return await res.json();
  }

  logout() {
    localStorage.removeItem('NEO_AUTH');
    document.cookie = "neo_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.reload();
  }

  isTokenValid(): boolean {
    const stored = localStorage.getItem('NEO_AUTH');
    if (!stored) return false;
    const { expiresAt } = JSON.parse(stored);
    return expiresAt > Date.now() + 60000;
  }

  getStoredToken() {
    const stored = localStorage.getItem('NEO_AUTH');
    return stored ? JSON.parse(stored) : null;
  }
}

export const authService = new AuthService();

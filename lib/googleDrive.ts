import { google } from 'googleapis';
import { cookies } from 'next/headers';

export const DRIVE_CONFIG = {
  FOLDER_NAME: '.NEO_LEDGER_DATA',
  LEDGER_FILE: 'ledger_history.json',
  MANIFEST_FILE: 'manifest.json',
  SETTINGS_FILE: 'settings.json',
  SIGNALS_FILE: 'signals.json',
};

export async function getDriveClient(manualToken?: string) {
  let token = manualToken;
  
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('neo_access_token')?.value;
  }

  if (!token) {
    console.error('DRIVE_CLIENT: AUTH_TOKEN_MISSING');
    throw new Error('AUTH_TOKEN_MISSING');
  }

  // Use the client ID and secret to ensure the client is correctly identified
  const auth = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  auth.setCredentials({ 
    access_token: token,
    token_type: 'Bearer'
  });

  console.log('DRIVE_CLIENT: INITIALIZED_WITH_TOKEN_PREFIX:', token.substring(0, 10));

  return google.drive({ 
    version: 'v3', 
    auth
  });
}

export async function getOrCreateAppDataFolder(drive: any) {
  try {
    const res = await drive.files.list({
      q: `name = '${DRIVE_CONFIG.FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder'`,
      spaces: 'appDataFolder',
      fields: 'files(id, name)',
    });

    let folder = res.data.files[0];

    if (!folder) {
      console.log('DRIVE_CLIENT: CREATING_NEW_APP_DATA_FOLDER');
      const newFolder = await drive.files.create({
        requestBody: {
          name: DRIVE_CONFIG.FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
          parents: ['appDataFolder'],
        },
        fields: 'id',
      });
      return newFolder.data.id;
    }

    return folder.id;
  } catch (error: any) {
    console.error('DRIVE_CLIENT: GET_OR_CREATE_FOLDER_ERROR:', error.response?.data || error.message);
    throw error;
  }
}

export async function getFileContent(drive: any, folderId: string, filename: string, defaultValue: any) {
  try {
    const res = await drive.files.list({
      q: `name = '${filename}' and '${folderId}' in parents`,
      spaces: 'appDataFolder',
      fields: 'files(id, name)',
    });

    const file = res.data.files[0];
    if (!file) {
      return { id: null, content: defaultValue };
    }

    const contentRes = await drive.files.get({
      fileId: file.id,
      alt: 'media',
    });

    return { id: file.id, content: contentRes.data };
  } catch (error: any) {
    console.error(`DRIVE_CLIENT: GET_FILE_ERROR (${filename}):`, error.response?.data || error.message);
    return { id: null, content: defaultValue };
  }
}

export async function updateFile(drive: any, folderId: string, filename: string, content: any, fileId?: string) {
  const media = {
    mimeType: 'application/json',
    body: JSON.stringify(content),
  };

  try {
    if (fileId) {
      await drive.files.update({
        fileId: fileId,
        media: media,
      });
    } else {
      await drive.files.create({
        requestBody: {
          name: filename,
          parents: [folderId],
        },
        media: media,
        fields: 'id',
      });
    }
  } catch (error: any) {
    console.error(`DRIVE_CLIENT: UPDATE_FILE_ERROR (${filename}):`, error.response?.data || error.message);
    throw error;
  }
}

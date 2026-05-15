import { google } from 'googleapis';
import { cookies } from 'next/headers';

export const DRIVE_CONFIG = {
  FOLDER_NAME: '.NEO_LEDGER_DATA',
  LEDGER_FILE: 'ledger_history.json',
  MANIFEST_FILE: 'manifest.json',
  SETTINGS_FILE: 'settings.json',
};

export async function getDriveClient(manualToken?: string) {
  let token = manualToken;
  
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('neo_access_token')?.value;
  }

  if (!token) {
    throw new Error('AUTH_TOKEN_MISSING');
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function getOrCreateAppDataFolder(drive: any) {
  const res = await drive.files.list({
    q: `name = '${DRIVE_CONFIG.FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder'`,
    spaces: 'appDataFolder',
    fields: 'files(id, name)',
  });

  let folder = res.data.files[0];

  if (!folder) {
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
}

export async function getFileContent(drive: any, folderId: string, filename: string, defaultValue: any) {
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
}

export async function updateFile(drive: any, folderId: string, filename: string, content: any, fileId?: string) {
  const media = {
    mimeType: 'application/json',
    body: JSON.stringify(content),
  };

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
}

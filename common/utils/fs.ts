import fs from 'fs/promises';

// fileExists returns `true` if the given file exists.
export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

import * as fs from 'fs';

const replaceFileWithUint8Array: any = (content: string): string => {
  return content.replace(/File/g, 'Uint8Array');
};

const processFile: any = (filePath: string): void => {
  try {
    const content: string = fs.readFileSync(filePath, 'utf-8');
    const updatedContent: string = replaceFileWithUint8Array(content);
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.info(`Api post-fetch processing completed for ${filePath}`);
  } catch (error) {
    console.error(`Error occurred during Api post-fetch processing for ${filePath}:`, error);
  }
};

const targetFilePath: string = './src/TrueVote.Api.ts';
processFile(targetFilePath);

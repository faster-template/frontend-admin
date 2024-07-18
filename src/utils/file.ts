import { acceptImages, acceptAudios, acceptDocs, acceptVideos } from '@/constants/file';

export function getFileTypeByMimeType(mimeType: string): string | undefined {
  if (acceptImages.includes(mimeType)) {
    return 'image';
  }
  if (acceptAudios.includes(mimeType)) {
    return 'audio';
  }
  if (acceptVideos.includes(mimeType)) {
    return 'video';
  }
  if (acceptDocs.includes(mimeType)) {
    return 'doc';
  }
  return undefined;
}

export default null;

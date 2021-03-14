import { AbcProject, ManifestName } from '@abc-map/shared-entities';
import { Zipper } from '../zip';
import { BlobReader } from './BlobReader';

export class ProjectHelper {
  public static async extractManifest(blob: Blob): Promise<AbcProject> {
    const files = await Zipper.unzip(blob);
    const manifest = files.find((f) => f.path.endsWith(ManifestName));
    if (!manifest) {
      return Promise.reject(new Error('No manifest found'));
    }
    const content = await BlobReader.asString(manifest.content);
    return JSON.parse(content);
  }
}

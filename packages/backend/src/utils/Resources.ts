import * as path from 'path';

const root = path.resolve(__dirname, '..', '..', 'resources');

export class Resources {
  public getResourcePath(name: string): string {
    return path.resolve(root, name);
  }

  public getSampleProject(): string {
    return this.getResourcePath('test/sample-projects/project.abm2');
  }
}

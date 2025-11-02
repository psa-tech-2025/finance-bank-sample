export class FileMetaData {
  id: string = '';
  name: string = '';
  size: number = 0;
  file?: File;
  url: string = '';

  constructor(file?: File) {
    if (file) {
      this.file = file;
      this.name = file.name;
      this.size = file.size;
    }
  }
}

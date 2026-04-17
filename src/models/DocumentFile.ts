export default interface DocumentFile {
  nameLowerCase: string;
  tags: string[];
  categories: string[];
  fileType: string;
  isCurrent: boolean;
  fullPath: string;
  name: string;
  size: number;
  type: string;
}

export function getHumanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const fileSize = ((size / Math.pow(1024, i)) * 1).toFixed(2);
  const suffix = ["B", "kB", "MB", "GB", "TB"][i];
  return `${fileSize} ${suffix}`;
}

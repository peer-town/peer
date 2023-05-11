export const extractProjectName = (gitUrl: string): string | null => {
  const regex = /(?:.*\/)?(.+?)(?:\.git|$)/;
  const match = gitUrl.match(regex);
  if (match) {
    return match[1];
  }
  return null;
}

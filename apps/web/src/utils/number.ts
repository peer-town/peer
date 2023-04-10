export const formatNumber = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  });
  if (typeof value !== 'number') {
    return formatter.format(convertToNumber(value));
  }
  return formatter.format(value);
}

export const convertToNumber = (value: number | string | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  const converted = parseInt(value.toString());
  return isNaN(converted) ? 0 : converted;
}

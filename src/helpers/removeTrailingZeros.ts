export const removeTrailingZeros = (percent: string): string => {
  const number = percent.split('%')[0];
  const userPercent = Number(number) / 2;
  const cleanNumber = Number(userPercent).toString();
  return `${cleanNumber}%`;
};

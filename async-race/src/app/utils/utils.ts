export function easeInOut(time: number) {
  return 0.5 * (1 - Math.cos(Math.PI * time));
}

export function conversionToSecFromMillisec(milliseconds: number) {
  return milliseconds / 1000;
}

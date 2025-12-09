export function sleet(s: number = 1) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve(void 0);
    }, s * 1000);
  });
}

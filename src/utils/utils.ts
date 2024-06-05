export function dataURItoBlob(dataUrl: string): Blob {
  const byteString: string = atob(dataUrl.split(",")[1]);
  const mimeString: string = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
  const intArray: Uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++)
    intArray[i] = byteString.charCodeAt(i);

  return new Blob([intArray], { type: mimeString });
}

export function arrayIsEqual(arr1: [], arr2: []): boolean {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

export function strHasQuotes(str: string): boolean {
  if (str.length < 2) return false;

  return (
    (str[0] === str[str.length - 1] && str[0] === "'") ||
    (str[0] === str[str.length - 1] && str[0] === '"') ||
    (str[0] === str[str.length - 1] && str[0] === "`")
  );
}

const keywords: string[] = ["CURRENT_TIMESTAMP", "NULL"];

export function isKeyword(str: string): boolean {
  return keywords.includes(str.toUpperCase());
}

export function isFunction(str: string): boolean {
  return /\w+\([^)]*\)$/.test(str);
}

export function enterFullscreen(): void {
  const element: any = document.documentElement;
  if (element.requestFullscreen)
    element.requestFullscreen();
  else if (element.mozRequestFullScreen)
    element.mozRequestFullScreen();
  else if (element.webkitRequestFullscreen)
    element.webkitRequestFullscreen();
  else if (element.msRequestFullscreen)
    element.msRequestFullscreen();
}

export function exitFullscreen(): void {
  if (document.exitFullscreen)
    document.exitFullscreen();
  // @ts-ignore
  else if (document.mozCancelFullScreen)
    // @ts-ignore
    document.mozCancelFullScreen();
  // @ts-ignore
  else if (document.webkitExitFullscreen)
    // @ts-ignore
    document.webkitExitFullscreen();
  // @ts-ignore
  else if (document.msExitFullscreen)
    // @ts-ignore
    document.msExitFullscreen();
}

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

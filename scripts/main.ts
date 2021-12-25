import Screen from './screen';

window.onload = () => {
  // Create screen based on element #cv
  const scr = new Screen('cv');

  // Update at 60 FPS
  setInterval(() => scr.update(), 1/60);
};
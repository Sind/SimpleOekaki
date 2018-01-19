
const DECtoHEX = (c) => {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const HTMLtoRGB = htmlcolor => htmlcolor.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16) / 255);

const RGBtoHTML = rgbcolor => `#${DECtoHEX(rgbcolor[0] * 255)}${DECtoHEX(rgbcolor[1] * 255)}${DECtoHEX(rgbcolor[2] * 255)}`;

const iRGBtoRGB = irgbcolor => [irgbcolor.r / 255, irgbcolor.g / 255, irgbcolor.b / 255];

const RGBtoiRGB = rgbcolor => ({ r: rgbcolor[0] * 255, g: rgbcolor[1] * 255, b: rgbcolor[2] * 250 });

module.exports = {
  DECtoHEX,
  HTMLtoRGB,
  RGBtoHTML,
  iRGBtoRGB,
  RGBtoiRGB,
};

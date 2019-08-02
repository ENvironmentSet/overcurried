class Theme {
  constructor(backgroundColor, textColor, accentColor, hyperLinkColor) {
    this.backgroundColor = backgroundColor;
    this.foregroundColor = textColor;
    this.accentColor = accentColor;
    this.hyperLinkColor = hyperLinkColor;
  }
}

const oceanic = new Theme('#263238','#B0BEC5', '#009688', '#80cbc4');
const darker = new Theme('#212121', '#B0BEC5', '#FF9800', '#80cbc4');
const lighter = new Theme('#FAFAFA', '#546E7A', '#00BCD4', '#39ADB5');
const palenight = new Theme('#292D3E', '#A6ACCD', '#AB47BC', '#80CBC4');
const deepOcean = new Theme('#0F111A', '#8F93A2', '#84FFFF', '#80CBC4');
const monokaiPro = new Theme('#2D2A2E', '#FCFCFA', '#FFD866', '#78DCE8');
const dracula = new Theme('#282A36', '#F8F8F2', '#FF79C5', '#F1FA8C');
const github = new Theme('#F7F8FA', '#5B6168', '#79CB60', '#005CC5');
const arcDark = new Theme('#2F343F', '#D3DAE3', '#42A5F5', '#7587A6');
const oneDark = new Theme('#282C34', '#979FAD', '#2979FF', '#56B6C2');
const oneLight = new Theme('#FAFAFA', '#232324', '#2979FF', '#0184BC');
const solarizedDark = new Theme('#002B36', '#839496', '#D33682', '#268BD2');
const solarizedLight = new Theme('#FDF6E3', '#586E75', '#D33682', '#268BD2');

export default {
  oceanic,
  darker,
  lighter,
  palenight,
  deepOcean,
  monokaiPro,
  dracula,
  github,
  arcDark,
  oneDark,
  oneLight,
  solarizedDark,
  solarizedLight
};

export function pickColor(kind) {
  return ({ theme }) => theme[`${kind}Color`];
};
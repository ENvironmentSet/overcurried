export default class Theme {
  constructor({ background, text, accent, hyperLink }) {
    this.backgroundColor = background;
    this.foregroundColor = text;
    this.accentColor = accent;
    this.hyperLinkColor = hyperLink;
  }

  static pickColor(kind) {
    return ({ theme }) => theme[`${kind}Color`];
  }
}
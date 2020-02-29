export class Theme {
  constructor({ background, text, accent, hyperLink }) {
    this.backgroundColor = background;
    this.foregroundColor = text;
    this.accentColor = accent;
    this.hyperLinkColor = hyperLink;
  }
}

export function pickColor(kind) {
  return ({ theme }) => theme[`${kind}Color`];
};
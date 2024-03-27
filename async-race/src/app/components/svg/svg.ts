import { BaseComponent, TaggedElementProps } from '../base-component';

export type SvgId = 'car' | 'flag' | 'delete' | 'settings' | 'power' | 'stop';

const URL_SPRITE = './assets/sprite.svg';

export class SvgSprite extends BaseComponent {
  private svg: SVGSVGElement;

  constructor(props: TaggedElementProps, svgId: SvgId) {
    super({ tagName: 'div', ...props });

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttributeNS(null, 'class', 'icon');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${URL_SPRITE}#${svgId}`);

    this.svg.append(use);
    this.getElement().append(this.svg);
  }

  setSvgColor(color: string) {
    this.svg.style.fill = color;
  }
}

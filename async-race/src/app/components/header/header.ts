import { BaseComponent } from '../base-component';

export class Header extends BaseComponent {
  constructor() {
    super({ tagName: 'header', classNames: 'header' });
  }
}

import { BaseComponent } from '../../components/base-component';

export class NotFound extends BaseComponent {
  constructor() {
    super({
      tagName: 'div',
      classNames: 'not-found',
    });
  }
}

import { BaseComponent } from '../../components/base-component';
import { IRouter } from '../../interfaces/router';

export class NotFound extends BaseComponent {
  constructor(private router: IRouter) {
    super({
      tagName: 'div',
      classNames: 'not-found',
    });
  }
}

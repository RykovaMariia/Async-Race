import { BaseComponent } from '../../components/base-component';
import { IRouter } from '../../interfaces/router';

export class Winners extends BaseComponent {
  constructor(private router: IRouter) {
    super({
      tagName: 'main',
      classNames: 'winners',
    });
  }
}

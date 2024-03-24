import { AppRoute } from '../../enums/app-route';
import { Router } from '../../router/router';
import { BaseComponent } from '../base-component';
import { Button } from '../button/button';

export class Header extends BaseComponent {
  constructor(router: Router) {
    super({ tagName: 'header', classNames: 'header' });

    const garageButton = new Button({ classNames: 'button', textContent: 'GARAGE' }, () =>
      router.navigate(AppRoute.Garage),
    );
    const winnersButton = new Button({ classNames: 'button', textContent: 'WINNERS' }, () =>
      router.navigate(AppRoute.Winners),
    );

    this.insertChildren([garageButton, winnersButton]);
  }
}

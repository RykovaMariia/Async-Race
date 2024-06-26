import { AppRoute } from 'Enums/app-route';
import { TaggedElementProps } from 'Components/base-component';
import { Button } from 'Components/button/button';
import { router } from 'Router/router';

export class Link extends Button {
  constructor(props: TaggedElementProps, toNavigation: AppRoute) {
    super({ ...props });
    this.navigate(toNavigation);
    this.setClassName('link');
  }

  navigate(toNavigation: AppRoute) {
    this.element.addEventListener('click', () => {
      router.navigate(toNavigation);
    });
  }
}

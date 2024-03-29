import { AppRoute } from '../../enums/app-route';
import { router } from '../../router/router';
import { TaggedElementProps } from '../base-component';
import { Button } from '../button/button';

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

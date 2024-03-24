import { router } from './router/router';

export class App {
  constructor(private container: HTMLElement) {
    this.container = container;
  }

  start() {
    router.init(this.container);
  }
}

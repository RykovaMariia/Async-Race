import { Header } from './components/header/header';
import { router } from './router/router';

export class App {
  constructor(private container: HTMLElement) {
    const header = new Header(router);
    this.container.append(header.getElement());
  }

  start() {
    router.init(this.container);
  }
}

import { Header } from 'Components/header/header';
import { router } from 'Router/router';

export class App {
  constructor(private container: HTMLElement) {
    const header = new Header();
    this.container.append(header.getElement());
  }

  start() {
    router.init(this.container);
  }
}

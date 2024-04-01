import { BaseComponent } from '../../components/base-component';
import { WinnersTable } from './winners- table/winners-table';

export class Winners extends BaseComponent {
  constructor() {
    super({
      tagName: 'main',
      classNames: 'winners',
    });

    const winnersHeading = new BaseComponent({ tagName: 'h2', classNames: 'winners-heading' });
    const pageHeading = new BaseComponent({ tagName: 'h2' });

    const table = new WinnersTable();
    this.insertChildren([winnersHeading, pageHeading, table]);
  }
}

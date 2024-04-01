import './winners-table.scss';
import { BaseComponent } from '../../../components/base-component';
import { SvgContainer } from '../../../components/svg-container/svg-container';
import { Car } from '../../../interfaces/car';
import { apiGarageService } from '../../../services/api-garage-service';
import { apiWinnersService } from '../../../services/api-winners-service';

interface Winner {
  id: number;
  time: number;
  wins: number;
}

export class WinnersTable extends BaseComponent {
  constructor() {
    super({
      tagName: 'table',
      classNames: 'winners-table',
    });

    const headersRow = new BaseComponent({ tagName: 'tr' });
    const number = new BaseComponent({ tagName: 'th', textContent: 'Number' });
    const car = new BaseComponent({ tagName: 'th', textContent: 'Car' });
    const name = new BaseComponent({ tagName: 'th', textContent: 'Name' });
    const wins = new BaseComponent({ tagName: 'th', textContent: 'Wins' });
    const bestTime = new BaseComponent({ tagName: 'th', textContent: 'Best time' });

    headersRow.insertChildren([number, car, name, wins, bestTime]);

    this.insertChild(headersRow);

    this.drawTable();
  }

  async drawTable() {
    const winners: Winner[] = await apiWinnersService.getWinners(1);

    winners.forEach(async (winner) => {
      const carWinner: Car = await apiGarageService.getCar(winner.id);

      const row = new BaseComponent({ tagName: 'tr' });
      const number = new BaseComponent({ tagName: 'td', textContent: `${winner.id}` });
      const carSvg = new SvgContainer('car');
      carSvg.setSvgColor(carWinner.color);
      const car = new BaseComponent({ tagName: 'td', parentNode: carSvg });
      const name = new BaseComponent({ tagName: 'td', textContent: carWinner.name });
      const wins = new BaseComponent({ tagName: 'td', textContent: `${winner.wins}` });
      const bestTime = new BaseComponent({ tagName: 'td', textContent: `${winner.time}` });

      row.insertChildren([number, car, name, wins, bestTime]);
      this.insertChild(row);
    });
  }
}

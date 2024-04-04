import './winners-table.scss';
import { BaseComponent } from 'Components/base-component';
import { SvgContainer } from 'Components/svg-container/svg-container';
import { Car } from 'Interfaces/car';
import { apiGarageService } from 'Services/api-services/api-garage-service';
import { Order, Sort, apiWinnersService } from 'Services/api-services/api-winners-service';
import { winnersService } from 'Services/winners-service';

interface Winner {
  id: number;
  time: number;
  wins: number;
}

export class WinnersTable extends BaseComponent {
  private rows: Promise<BaseComponent<HTMLElement>>[] = [];

  private isWinsSortedAsc: boolean = false;

  private isTimeSortedAsc: boolean = false;

  constructor() {
    super({
      tagName: 'table',
      classNames: 'winners-table',
    });

    const headersRow = new BaseComponent({ tagName: 'tr' });
    const number = new BaseComponent({ tagName: 'th', textContent: 'Number' });
    const car = new BaseComponent({ tagName: 'th', textContent: 'Car', classNames: 'table__car' });
    const name = new BaseComponent({ tagName: 'th', textContent: 'Name' });
    const wins = new BaseComponent({ tagName: 'th', textContent: 'Wins' });
    wins.addEventListener('click', () => {
      this.destroyRows();
      if (this.isWinsSortedAsc) {
        this.drawTable('wins', 'desc');
        this.isWinsSortedAsc = false;
      } else {
        this.drawTable('wins', 'asc');
        this.isWinsSortedAsc = true;
      }
    });
    const bestTime = new BaseComponent({ tagName: 'th', textContent: 'Best time' });
    bestTime.addEventListener('click', () => {
      this.destroyRows();
      if (this.isTimeSortedAsc) {
        this.drawTable('time', 'desc');
        this.isTimeSortedAsc = false;
      } else {
        this.drawTable('time', 'asc');
        this.isTimeSortedAsc = true;
      }
    });

    headersRow.insertChildren([number, car, name, wins, bestTime]);

    this.insertChild(headersRow);

    this.drawTable();
  }

  async drawTable(sort?: Sort, order?: Order) {
    let winners: Winner[] = [];
    const page = winnersService.getCurrentPage();
    if (sort && order) {
      winners = await apiWinnersService.getSortingWinners({ page, sort, order });
    } else {
      winners = await apiWinnersService.getWinners(page);
    }

    this.rows = winners.map(async (winner) => {
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
      return row;
    });
  }

  destroyRows() {
    this.rows.map((row) => row.then((el) => el.destroy()));
  }
}

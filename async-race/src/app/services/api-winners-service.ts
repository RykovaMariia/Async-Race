import { ApiService } from './api-service';

export type Sort = 'id' | 'time' | 'wins';
export type Order = 'desc' | 'asc';

const LIMIT_WINNERS_ON_PAGE = 10;

class ApiWinnersService extends ApiService {
  async getWinners(page: number) {
    return this.request(`?_page=${page}&_limit=${LIMIT_WINNERS_ON_PAGE}`, { method: 'GET' }).then(
      (res) => res.json(),
    );
  }

  async getWinnersCount(page: number) {
    return this.request(`?_page=${page}&_limit=${LIMIT_WINNERS_ON_PAGE}`, { method: 'GET' }).then(
      (res) => res.headers.get('X-Total-Count'),
    );
  }

  async getSortingWinners({ page, sort, order }: { page: number; sort: Sort; order: Order }) {
    return this.request(
      `?_page=${page}&_limit=${LIMIT_WINNERS_ON_PAGE}&_sort=${sort}&_order=${order}`,
      {
        method: 'GET',
      },
    ).then((res) => res.json());
  }

  async getWinner(id: number) {
    return this.request(`${id}`, { method: 'GET' }).then((res) => res.json());
  }

  async createWinner({ id, wins, time }: { id: number; wins: number; time: number }) {
    return this.request('', { method: 'POST', body: { id, wins, time } }).then((res) => res.json());
  }

  async deleteWinner(id: number) {
    return this.request(`${id}`, { method: 'DELETE' }).then((res) => res.json());
  }

  async updateWinner(id: number, update: { wins: number; time: number }) {
    return this.request(`${id}`, { method: 'PUT', body: update }).then((res) => res.json());
  }
}

export const apiWinnersService = new ApiWinnersService('winners');

import { ApiService } from './api-service';

export type Sort = 'id' | 'time' | 'wins';
export type Order = 'desc' | 'asc';

class ApiWinnersService extends ApiService {
  getWinners(page: number) {
    return this.request(`?_page=${page}&limit=10`, { method: 'GET' });
  }

  getSortingWinners({ page, sort, order }: { page: number; sort: Sort; order: Order }) {
    return this.request(`?_page=${page}&limit=10&sort=${sort}&order=${order}`, { method: 'GET' });
  }

  getWinner(id: number) {
    return this.request(`${id}`, { method: 'GET' });
  }

  createWinner({ id, wins, time }: { id: number; wins: number; time: number }) {
    return this.request('', { method: 'POST', body: { id, wins, time } });
  }

  deleteWinner(id: number) {
    return this.request(`${id}`, { method: 'DELETE' });
  }

  updateWinner(id: number, update: { wins: number; time: number }) {
    return this.request(`${id}`, { method: 'PUT', body: update });
  }
}

export const apiWinnersService = new ApiWinnersService('winners');

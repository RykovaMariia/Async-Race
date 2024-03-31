import { ApiService } from './api-service';

class ApiWinnersService extends ApiService {
  getWinners() {
    return this.request('', { method: 'GET' });
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

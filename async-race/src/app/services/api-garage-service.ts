import { ApiService } from './api-service';

const LIMIT_CARS_ON_PAGE = 7;

class ApiGarageService extends ApiService {
  async getCars(page: number) {
    return this.request(`?_page=${page}&_limit=${LIMIT_CARS_ON_PAGE}`, { method: 'GET' }).then(
      (res) => res.json(),
    );
  }

  async getCarsCount(page: number) {
    return this.request(`?_page=${page}&_limit=${LIMIT_CARS_ON_PAGE}`, { method: 'GET' }).then(
      (res) => res.headers.get('X-Total-Count'),
    );
  }

  async getCar(id: number) {
    return this.request(`${id}`, { method: 'GET' }).then((res) => res.json());
  }

  async createCar({ carName: nameCar, carColor: colorCar }: { carName: string; carColor: string }) {
    return this.request('', { method: 'POST', body: { name: nameCar, color: colorCar } }).then(
      (res) => res.json(),
    );
  }

  async deleteCar(id: number) {
    return this.request(`${id}`, { method: 'DELETE' }).then((res) => res.json());
  }

  async updateCar(id: number, update: { name: string; color: string }) {
    return this.request(`${id}`, { method: 'PUT', body: update }).then((res) => res.json());
  }
}

export const apiGarageService = new ApiGarageService('garage');

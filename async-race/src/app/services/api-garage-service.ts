import { ApiService } from './api-service';

class ApiGarageService extends ApiService {
  async getCars() {
    return this.request('', { method: 'GET' }).then((res) => res.json());
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

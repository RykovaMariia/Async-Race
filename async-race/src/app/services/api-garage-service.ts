import { ApiService } from './api-service';

class ApiGarageService extends ApiService {
  getCars() {
    return this.request('', { method: 'GET' });
  }

  getCar(id: number) {
    return this.request(`${id}`, { method: 'GET' });
  }

  createCar({ carName: nameCar, carColor: colorCar }: { carName: string; carColor: string }) {
    return this.request('', { method: 'POST', body: { name: nameCar, color: colorCar } });
  }

  deleteCar(id: number) {
    return this.request(`${id}`, { method: 'DELETE' });
  }

  updateCar(id: number, update: { name: string; color: string }) {
    return this.request(`${id}`, { method: 'PUT', body: update });
  }
}

export const apiGarageService = new ApiGarageService('garage');

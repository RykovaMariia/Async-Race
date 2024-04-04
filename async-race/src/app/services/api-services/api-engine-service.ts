import { ApiService } from 'Services/api-services/api-service';

export type Status = 'started' | 'stopped' | 'drive';

class ApiEngineService extends ApiService {
  private async requestEngine(id: number, status: Status) {
    return this.request(`?id=${id}&status=${status}`, { method: 'PATCH' }).then((res) =>
      res.json(),
    );
  }

  starCarsEngine(id: number) {
    return this.requestEngine(id, 'started');
  }

  stopCarsEngine(id: number) {
    return this.requestEngine(id, 'stopped');
  }

  driveCarsEngine(id: number) {
    return this.requestEngine(id, 'drive');
  }
}

export const apiEngineService = new ApiEngineService('engine');

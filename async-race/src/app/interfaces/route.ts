import { BaseComponent } from 'Components/base-component';

export interface Route {
  path: string;
  component: () => Promise<BaseComponent>;
}

export interface IRouter {
  init(routerOutlet: HTMLElement): void;
  navigate(url: string): void;
}

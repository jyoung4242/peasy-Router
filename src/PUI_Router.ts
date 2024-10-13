export type PuiRoute = {
  component: PuiComponent;
  name: string;
  state: any;
};

export interface PuiComponent {
  name: string;
  create: () => void;
  template: string;
  active: boolean;
}

export class PuiRouter {
  public static updateHandler: number = 0;
  public static default = "";
  public static routes: Array<PuiRoute> = [];
  public static renderedComponents: Array<PuiComponent> = [];
  public static getCurrentRoute() {
    const currentroute = window.location.hash.slice(1);

    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      if (route.name === currentroute) {
        PuiRouter.currentComponent = route.component;
        PuiRouter.currentComponent.active = true;
        return true;
      } else {
        route.component.active = false;
      }
    }
    return true;
  }

  update() {}

  public static currentComponent: any = null;

  public static template = `
  <main>
   \${component <=* renderedComponents }>
  </main>
  `;

  public static create(state: { default: string; routes: Array<PuiRoute> }) {
    PuiRouter.default = state.default;
    PuiRouter.routes = [...state.routes];
    PuiRouter.renderedComponents = PuiRouter.routes.map(route => {
      return route.component;
    });

    for (let i = 0; i < PuiRouter.routes.length; i++) {
      const route = PuiRouter.routes[i];
      if (route.name === PuiRouter.default) {
        window.location.hash = `#${route.component.name}`;
        PuiRouter.currentComponent = route.component;
        PuiRouter.currentComponent.active = true;
        break;
      }
    }

    this.updateHandler = setInterval(() => {
      PuiRouter.getCurrentRoute();
    }, 1000 / 60);
  }
}

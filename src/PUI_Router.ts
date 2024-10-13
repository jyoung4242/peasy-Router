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
  public static default = "";
  public static routes: Array<PuiRoute> = [];
  public static get currentRoute() {
    const currentroute = window.location.hash.slice(1);
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      if (route.name === currentroute) {
        PuiRouter.currentComponent = route.component;
        PuiRouter.currentComponent.active = true;
        return;
      } else {
        route.component.active = false;
      }
    }
    return true;
  }

  public static currentComponent: any = null;

  public static template = `
  <main>
    <\${ route.component === route.state } \${ route <=* routes }>
  </main>
  `;

  public static create(state: { default: string; routes: Array<PuiRoute> }) {
    PuiRouter.default = state.default;
    PuiRouter.routes = [...state.routes];

    //loop through components and find one that matches default
    console.log("setting default path");

    for (let i = 0; i < PuiRouter.routes.length; i++) {
      const route = PuiRouter.routes[i];
      if (route.name === PuiRouter.default) {
        window.location.hash = `#${route.component.name}`;
        PuiRouter.currentComponent = route.component;
        PuiRouter.currentComponent.active = true;
        return;
      }
    }
  }
}

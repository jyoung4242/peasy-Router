import { UI, UIView } from "@peasy-lib/peasy-ui";

export interface PuiRoute {
  component: PuiComponent;
  hash: string;
  props?: Array<any>;
  default?: boolean;
}

export interface PuiComponent {
  name: string;
  create: () => void;
  template: string;
}

class FourOhFour {
  name: string = "404";
  create: () => void = () => {};
  template: string = `
    <div> 404: Page Not Found </div>
  `;
  active: boolean = false;
}

export class PuiRouter {
  private _updateHandler: number;
  defaultComponent: PuiComponent;
  defaultTemplate: string;
  view: UIView | undefined;
  oldPath: string = "";

  constructor(private host: HTMLElement | string, private routes: Array<PuiRoute>, private updateTime: number = 1000 / 16) {
    this._updateHandler = setInterval(() => this._update(), updateTime);
    const tempRoute = routes.find(route => route.default)?.component;
    console.log(tempRoute);
    console.log(this.host);

    if (tempRoute) {
      this.defaultComponent = tempRoute;
      this.defaultTemplate = tempRoute.template;
    } else {
      this.defaultComponent = new FourOhFour();
      this.defaultTemplate = this.defaultComponent.template;
    }

    console.log(this.defaultComponent);
  }

  async initialize() {
    (this.view as UIView) = UI.create(this.host, this.defaultComponent, this.defaultComponent.template);
    await (this.view as UIView).attached;
    console.log("PuiRouter initialized", this.view);
  }

  addRoute(newRoute: PuiRoute) {}

  private async _update() {
    const currentPath = window.location.hash;
    if (currentPath !== this.oldPath) {
      this.oldPath = currentPath;
      const route = this.routes.find(route => route.hash === currentPath.slice(1));
      let nextComponent: PuiComponent | undefined;
      let nextTemplate: string | undefined;

      if (route) {
        nextComponent = route.component;
        nextTemplate = nextComponent!.template;
      } else {
        nextComponent = new FourOhFour();
        nextTemplate = nextComponent!.template;
      }

      this.view?.destroy();
      await this.view?.detached;
      (this.view as UIView) = UI.create(this.host, nextComponent, nextTemplate);
      await (this.view as UIView).attached;

      if (nextComponent instanceof FourOhFour) throw new Error("404 Route not found");
    }
  }
}

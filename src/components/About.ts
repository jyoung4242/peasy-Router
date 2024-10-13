import { PuiComponent } from "../PUI_Router";

export class About {
  public static name = "About";
  public static active: boolean = false;
  public static template = `
      <div \${===active}>
          <h1>About</h1>
      </div>
      `;

  public static create() {}
}

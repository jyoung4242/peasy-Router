export class About {
  public static name = "About";
  public static username = "";

  public static template = `
      <div>
          <h1>About</h1>
          <p>My name is Mookie</p>
       </div>
      `;
  public static loadParams(params: Array<any>) {}

  public static loadProps(props: Array<any>) {
    About.username = props[0].value;
  }

  public static create() {}
}

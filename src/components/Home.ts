export class Home {
  public static name = "Home";
  public static active: boolean = false;
  public static template = `
    <div \${===active}>
          <h1>Home</h1>
    </div>
    `;

  public static create() {
    console.log("Home component created");
  }
}

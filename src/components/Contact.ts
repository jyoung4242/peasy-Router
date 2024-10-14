export class Contact {
  public static name = "Contact";
  public static username = "";

  public static template = `
     <div >
          <h1>Contact</h1>
          <h2>My name is: \${username}</h2>
      </div>
      `;

  public static loadParams(params: Array<any>) {
    Contact.username = params[0].value;
  }
  public static create() {}
}

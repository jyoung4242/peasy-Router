export class Contact {
  public static name = "Contact";
  public static active: boolean = false;
  public static template = `
     <div \${===active}>
          <h1>Contact</h1>
      </div>
      `;

  public static create() {}
}

export class NavLink {
  link: string;

  constructor(
    public ref: string,
    public display = true,
    public highlight = false,
  ) {
    this.link = `/${ref}`.toLowerCase();
  }
}

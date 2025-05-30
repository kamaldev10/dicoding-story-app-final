export class FooterModel {
  constructor() {
    this.appName = "Dicoding Story App";
    this.year = new Date().getFullYear();
    this.tagline = "Share ur stories with 💖.";
    this.socialLinks = [
      { icon: "fab fa-instagram", url: "https://instagram.com/alimusthafa10" },
      {
        icon: "fab fa-linkedin-in",
        url: "https://www.linkedin.com/in/alimusthafakamal/",
      },
    ];
    this.links = [
      { text: "Privacy Policy", url: "#" },
      { text: "Terms of Service", url: "#" },
      { text: "Contact Us", url: "#" },
    ];
  }

  getData() {
    return {
      appName: this.appName,
      year: this.year,
      tagline: this.tagline,
      socialLinks: this.socialLinks,
      links: this.links,
    };
  }
}

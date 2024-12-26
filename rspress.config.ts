import * as path from "node:path";
import { defineConfig } from "rspress/config";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  // lang: "zh",
  title: "FRONTEND STACK",
  icon: "/logo.icon.png",
  logo: "/logo.jpeg",
  logoText: "Frontend Stack",
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/ChrisSong1994/frontend-stack",
      },
    ],
  },
});

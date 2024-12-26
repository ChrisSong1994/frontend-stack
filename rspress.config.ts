import * as path from "node:path";
import { defineConfig } from "rspress/config";
import builderConfig from "./builder.config";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "FRONTEND STACK",
  icon: "/logo.icon.png",
  logo: "/logo.jpeg",
  base: '/frontend-stack/',
  logoText: "Frontend Stack",
  builderConfig: builderConfig,
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

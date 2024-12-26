import * as path from "node:path";
import { defineConfig } from "rspress/config";

const BASE_PATH = "/frontend-stack/";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "FRONTEND STACK",
  icon: "/logo.icon.png",
  logo: "/logo.jpeg",
  base: BASE_PATH,
  logoText: "Frontend Stack",
  builderConfig: {
    output: {
      assetPrefix: BASE_PATH,
    },
  },
  ssg: false,
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

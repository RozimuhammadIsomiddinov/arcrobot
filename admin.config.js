import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { dark, light, noSidebar } from "@adminjs/themes";

import { Database, Resource } from "@adminjs/sequelize";
import Order from "./models/order.js";
import Sites from "./models/sites.js";
AdminJS.registerAdapter({ Database, Resource });

//reason bekitish kerak

const adminJs = new AdminJS({
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  resources: [
    {
      resource: Order,
    },
    { resource: Sites },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "Arcbot Admin",
  },
});

const adminRouter = AdminJSExpress.buildRouter(adminJs);

export { adminJs, adminRouter };

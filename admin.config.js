import path from "path";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { dark, light, noSidebar } from "@adminjs/themes";
import { ComponentLoader } from "adminjs";
import { Database, Resource } from "@adminjs/sequelize";

import Order from "./models/order.js";
import Sites from "./models/sites.js";
import Blog from "./models/blog.js";
import Catalog from "./models/catalog.js";

AdminJS.registerAdapter({ Database, Resource });

const componentLoader = new ComponentLoader();

const Components = {
  multiUpload: componentLoader.add(
    "MultiFileUpload",
    path.resolve("components/MultiFileUpload.jsx")
  ),
  showImages: componentLoader.add(
    "ShowFile",
    path.resolve("components/ShowImages.jsx")
  ),
  multiCatalog: componentLoader.add(
    "MultiFileCatalog",
    path.resolve("components/MultiFileUploadCatalog.jsx")
  ),
  showImagesCatalog: componentLoader.add(
    "ShowFileCatalog",
    path.resolve("components/ShowImagesCatalog.jsx")
  ),
  propertyTable: componentLoader.add(
    "PropertyTable",
    path.resolve("components/PropertyTable.jsx")
  ),
  editCatalog: componentLoader.add(
    "editCatalog",
    path.resolve("components/CatalogEditComponent.jsx")
  ),
};

const adminJs = new AdminJS({
  componentLoader,

  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  resources: [
    {
      resource: Catalog,
      options: {
        properties: {
          images: { components: { show: Components.showImagesCatalog } },
          property: { components: { show: Components.propertyTable } },
        },

        actions: {
          new: {
            component: Components.multiCatalog,
          },
          edit: {
            component: Components.editCatalog,
          },
        },
      },
    },
    { resource: Order },
    { resource: Sites },
    {
      resource: Blog,
      options: {
        properties: {
          images: {
            components: {
              show: Components.showImages,
            },
          },
        },
        actions: {
          new: {
            component: Components.multiUpload,
          },
          edit: {
            component: Components.multiUpload,
          },
        },
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "Arcbot Admin",
  },
  locale: {
    translations: {
      en: {
        resources: {
          Image: {
            properties: {
              file: "File", // **BU YO'QOLGAN TARJIMANI O'RNIGA QO'YADI**
            },
          },
        },
      },
    },
  },
});

adminJs.watch();
const adminRouter = AdminJSExpress.buildRouter(adminJs);

export { adminJs, adminRouter };

import path from "path";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { dark, light, noSidebar } from "@adminjs/themes";
import { ComponentLoader } from "adminjs";
import { Database, Resource } from "@adminjs/sequelize";

import uploadFileFeature from "@adminjs/upload";

import Order from "./models/order.js";
import Sites from "./models/sites.js";
import Blog from "./models/blog.js";

AdminJS.registerAdapter({ Database, Resource });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = "public/images";

const componentLoader = new ComponentLoader();

const uploadOptions = {
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: "images",
    filePath: "imagePath",
    mimeType: "mimeType",
    file: "uploadedFile",
    url: ({ record }) => {
      const filePath = record?.params?.imagePath || record?.params?.image;
      if (!filePath) return null;
      const cleanedPath = filePath.replace(/^public\//, "");
      return `${process.env.BACKEND_URL}/${cleanedPath}`;
    },
  },
  validation: {
    mimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"],
  },
  uploadPath: (record, filename) => `${filename}`,
  options: {
    publicUrl: (filePath) =>
      `${process.env.BACKEND_URL}/${filePath.replace(/^public\//, "")}`,
  },
};

const adminJs = new AdminJS({
  componentLoader,

  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  resources: [
    { resource: Order },
    { resource: Sites },
    {
      resource: Blog,
      options: {
        properties: {
          subtitles: { isArray: true },
          uploadedFile: {
            isVisible: { list: false, show: false, edit: true },
          },
          images: {
            isVisible: { list: true, show: true, edit: true },
          },
        },
      },
      features: [uploadFileFeature({ ...uploadOptions, componentLoader })],
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

//adminJs.watch();
const adminRouter = AdminJSExpress.buildRouter(adminJs);

export { adminJs, adminRouter };

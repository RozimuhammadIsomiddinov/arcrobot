import path from "path";
import AdminJS, { actions } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { dark, light, noSidebar } from "@adminjs/themes";
import { ComponentLoader } from "adminjs";
import { Database, Resource } from "@adminjs/sequelize";
import bcrypt from "bcrypt";
import Order from "./models/order.js";
import Sites from "./models/sites.js";
import Blog from "./models/blog.js";
import Catalog from "./models/catalog.js";
import dotenv from "dotenv";

dotenv.config();
AdminJS.registerAdapter({ Database, Resource });

const componentLoader = new ComponentLoader();

const { EMAIL, PASSWORD } = process.env;

const Components = {
  customDashboard: componentLoader.add(
    "customDashboard",
    path.resolve("components/CustomDashboard.jsx")
  ),
  blogCreate: componentLoader.add(
    "MultiFileUpload",
    path.resolve("components/create/blog.jsx")
  ),
  showImages: componentLoader.add(
    "ShowFile",
    path.resolve("components/ShowImages.jsx")
  ),

  showImagesCatalog: componentLoader.add(
    "ShowFileCatalog",
    path.resolve("components/ShowImagesCatalog.jsx")
  ),
  propertyTable: componentLoader.add(
    "PropertyTable",
    path.resolve("components/PropertyTable.jsx")
  ),

  orderList: componentLoader.add(
    "orderList",
    path.resolve("components/show/order.jsx")
  ),
  siteList: componentLoader.add(
    "siteList",
    path.resolve("components/show/site.jsx")
  ),
  sitesEdit: componentLoader.add(
    "siteEdit",
    path.resolve("components/edit/sites.jsx")
  ),
  orderByID: componentLoader.add(
    "sitesByID",
    path.resolve("components/show/orde.id.jsx")
  ),
  blogList: componentLoader.add(
    "blogList",
    path.resolve("components/show/blog.jsx")
  ),
  blogEdit: componentLoader.add(
    "blogEdit",
    path.resolve("components/edit/blog.jsx")
  ),
  //catalog
  catalogList: componentLoader.add(
    "catalogList",
    path.resolve("components/show/catalog.jsx")
  ),
  catalogDetails: componentLoader.add(
    "catalogDetails",
    path.resolve("components/details/catalog.jsx")
  ),
  catalogCreate: componentLoader.add(
    "MultiFileCatalog",
    path.resolve("components/create/catalog.jsx")
  ),
  catalogEdit: componentLoader.add(
    "editCatalog",
    path.resolve("components/edit/catalog.jsx")
  ),
  aboutPage: componentLoader.add(
    "aboutPage",
    path.resolve("components/About.jsx")
  ),
};

const adminJs = new AdminJS({
  componentLoader,
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  pages: {
    about: {
      label: "About",
      component: Components.aboutPage,
    },
  },
  resources: [
    {
      resource: Catalog,
      options: {
        navigation: { name: "каталог", icon: "CheckCircle" },
        name: "Заказы",
        properties: {
          images: { components: { show: Components.showImagesCatalog } },
          property: { components: { show: Components.propertyTable } },
        },
        actions: {
          list: { component: Components.catalogList },
          show: { component: Components.catalogDetails },
          new: { component: Components.catalogCreate },
          edit: { component: Components.catalogEdit },
        },
      },
    },
    {
      resource: Order,
      options: {
        navigation: { name: "заявка", icon: "ShoppingCart" },

        actions: {
          list: { component: Components.orderList },
          new: { isVisible: false },
          edit: { isVisible: false },
          show: { component: Components.orderByID },
        },
      },
    },
    {
      resource: Sites,
      options: {
        navigation: { name: "Сайты", icon: "Globe" },
        name: "Сайты",
        actions: {
          list: { component: Components.siteList },
          edit: { component: Components.sitesEdit },
          show: { isVisible: false },
        },
      },
    },
    {
      resource: Blog,
      options: {
        navigation: { name: "Блог", icon: "BookOpen" },

        actions: {
          list: { component: Components.blogList },
          new: { component: Components.blogCreate },
          edit: { component: Components.blogEdit },
          show: { isVisible: false },
        },
      },
    },
  ],
  pages: {
    about: {
      label: "О проекте",
      component: Components.aboutPage,
    },
  },
  rootPath: "/admin",
  dashboard: { component: Components.customDashboard },
  branding: { companyName: "Arcbot Admin" },
  softwareBrothers: false,
  withMadeWithLove: false,
});

const ADMIN = {
  email: EMAIL,
  password: await bcrypt.hash(PASSWORD, 10),
};

adminJs.watch();

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (
        email === ADMIN.email &&
        (await bcrypt.compare(password, ADMIN.password))
      ) {
        return ADMIN;
      }

      return false;
    },
    cookiePassword: "some-secret-password",
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

export { adminJs, adminRouter };

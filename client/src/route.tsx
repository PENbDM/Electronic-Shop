import Admin from "./pages/AdminPanel/Admin";
import Auth from "./pages/Auth/User";
import Cart from "./pages/Cart/Cart";
import User from "./pages/Auth/User";
import Home from "./pages/Home/Home";
import Orders from "./pages/Auth/Orders";
import PersonalInfo from "./pages/Auth/PersonalInfo";
import ProductPage from "./pages/ProductPageInfo/ProductPage";
import Laptops from "./pages/productsPageFolder/Laptops/Laptops";
import Processor from "./pages/productsPageFolder/Processor/Processor";
import VideoGraphicsCard from "./pages/productsPageFolder/VideoGraphicsCard/VideoGraphicsCard";
import Ram from "./pages/productsPageFolder/Ram/Ram";
import Ssd from "./pages/productsPageFolder/SSD/SSD";
import Motherboard from "./pages/productsPageFolder/Motherboard/Motherboard";

import {
  ADMIN_ROUTE,
  CART_ROUTE,
  HOME_ROUTE,
  PRODUCT_ROUTE,
  MONITOR_ROUTE,
  Laptop_ROUTE,
  Processor_ROUTE,
  VideoGraphicsCard_ROUTE,
  Ram_ROUTE,
  SSD_ROUTE,
  Motherboard_ROUTE,
  USER_ROUTE,
  PERSONAL_DETAILS,
  ORDERS_ROUTE,
} from "./utils/consts";
import Monitors from "./pages/productsPageFolder/Monitors/Monitors";
export const adminRoute = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
  },
];
export const authRoutes = [
  {
    path: CART_ROUTE,
    Component: Cart,
  },
  {
    path: USER_ROUTE,
    Component: User,
  },
  {
    path: ORDERS_ROUTE,
    Component: Orders,
  },
  {
    path: PERSONAL_DETAILS,
    Component: PersonalInfo,
  },
];

export const publicRoutes = [
  {
    path: HOME_ROUTE,
    Component: Home,
  },
  {
    path: `${PRODUCT_ROUTE}/:id`,
    Component: ProductPage,
  },
  {
    path: MONITOR_ROUTE,
    Component: Monitors,
  },
  {
    path: Laptop_ROUTE,
    Component: Laptops,
  },
  {
    path: Processor_ROUTE,
    Component: Processor,
  },
  {
    path: VideoGraphicsCard_ROUTE,
    Component: VideoGraphicsCard,
  },
  {
    path: Ram_ROUTE,
    Component: Ram,
  },
  {
    path: SSD_ROUTE,
    Component: Ssd,
  },
  {
    path: Motherboard_ROUTE,
    Component: Motherboard,
  },
];

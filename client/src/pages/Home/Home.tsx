import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectIsAuth } from "../../redux/slices/userSlice";
import {
  fetchAllBrands,
  fetchAllProducts,
  fetchAllTypes,
} from "../../redux/slices/promItems";
import { RootState } from "../../redux/store"; // Adjust the import path
import { Link } from "react-router-dom";
import LoginModal from "../../components/ModalCart/LoginModal";
import { addToCart } from "../../redux/slices/cartSlice";
import ModalAddCart from "../../components/ModalAddIntoCart/ModalAddCart";
import { fetchAllItemsCart } from "../../redux/slices/cartSlice";
import { updateCartItemQuantity } from "../../redux/slices/cartSlice";
import MyLoader from "../../components/ReactSkeleton/Skeletom";
import {
  MONITOR_ROUTE,
  Processor_ROUTE,
  VideoGraphicsCard_ROUTE,
  Ram_ROUTE,
  SSD_ROUTE,
  Motherboard_ROUTE,
  Laptop_ROUTE,
  PRODUCT_ROUTE,
} from "../../utils/consts";

import { NavLink } from "react-router-dom";
//categori//ssd
import lap from "../../img/laptop.png";

import desk from "../../img/desktop.png";
import cpu from "../../img/cpu.png";
import dd3 from "../../img/ddr3.png";
import gpu from "../../img/gpu.png";
import mb from "../../img/motherboard.png";
import ssd from "../../img/ssd.png";
//categori//

//social media//
import face from "../../img/facebook.png";
import inst from "../../img/insta.png";
import telega from "../../img/telega.png";
import twiter from "../../img/twiter.png";
import wassap from "../../img/wassap.png";
import youtube from "../../img/youtube.png";
//social media//

//slider//
import sli1 from "../../img/slider1.jpg";
import sli2 from "../../img/slider2.jpg";

import sli1New from "../../img/slider1New.jpg";
import sli2New from "../../img/slider2New.jpg";
//slider//

//IMG
import "./index.scss";
import Slider from "../../components/Slider/Slider";
interface CartItem {
  id: number;
  productId: number;
  quantity: number; // Add this line
  // Add other necessary fields
}

function Home() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const dispatch = useDispatch();
  const promItems = useSelector((state: RootState) => state.promItems.items);
  const type = useSelector(
    (state: RootState) => state.promItems.type_of_products
  );
  const brands = useSelector((state: RootState) => state.promItems.brands);
  const user = useSelector((state: RootState) => state.user);
  const role = user?.user?.userWithoutPassword?.role || null;

  const { cartItems, status } = useSelector((state: RootState) => state.cart);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalAddCartOpen, setIsModalAddCartOpen] = useState(false);
  const fetchData = async () => {
    try {
      await Promise.all([
        dispatch(fetchAllProducts() as any),
        dispatch(fetchAllBrands() as any),
        dispatch(fetchAllTypes() as any),
      ]);
    } catch (error) {
      console.error("Error while getting data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const IMAGES = [sli1, sli2];
  const IMAGES2 = [sli1New, sli2New];
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };
  const toggleAddItemCart = () => {
    setIsModalAddCartOpen(!isModalAddCartOpen);
  };

  const handleCartClick = async (id: number) => {
    if (user.user.token) {
      try {
        const existingCartItem = cartItems.find((item) => item.id === id);
        console.log(existingCartItem);

        if (existingCartItem) {
          await dispatch(
            updateCartItemQuantity({
              id,
              quantityAdjustment: 1,
            }) as any
          );

          console.log(cartItems);
        } else {
          await dispatch(addToCart({ productId: id }) as any);
        }

        // Dispatch fetchAllItemsCart and wait for it to complete
        await dispatch(fetchAllItemsCart() as any);
        // Log the updated cartItems
        console.log(cartItems);
        toggleAddItemCart();
      } catch (error) {
        console.error("Error handling cart click:", error);
      }
    } else {
      toggleLoginModal();
    }
  };

  return (
    <div className="wrapper">
      <div className="LeftHome">
        <nav className="Catalogg">
          <ul className="catalogList">
            <Link
              to={MONITOR_ROUTE}
              className={`custom-link ${
                hoveredLink === "monitors" ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredLink("monitors")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <li>
                <img src={desk} width={30} height={30} />
                <p>Monitor</p>
              </li>
            </Link>
            <Link
              to={Laptop_ROUTE}
              className={`custom-link ${
                hoveredLink === "laptop" ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredLink("laptop")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <li>
                <img src={lap} width={30} height={30} />
                <p>Laptop</p>
              </li>
            </Link>
            <Link
              to={Processor_ROUTE}
              className={`custom-link ${
                hoveredLink === "processor" ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredLink("processor")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <li>
                <img src={cpu} width={30} height={30} />
                <p>Processor</p>
              </li>
            </Link>
            <Link
              to={VideoGraphicsCard_ROUTE}
              className={`custom-link ${
                hoveredLink === "videoGraphicsCard" ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredLink("videoGraphicsCard")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <li>
                <img src={gpu} width={30} height={30} />
                <p>Video graphics card</p>
              </li>
            </Link>
            <Link
              to={Ram_ROUTE}
              className={`custom-link ${
                hoveredLink === "ram" ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredLink("ram")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <li>
                <img src={dd3} width={30} height={30} />
                <p>Ram</p>
              </li>
            </Link>
            <Link
              to={SSD_ROUTE}
              className={`custom-link ${
                hoveredLink === "ssd" ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredLink("ssd")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <li>
                <img src={ssd} width={25} height={25} />
                <p>SSD</p>
              </li>
            </Link>
            <Link
              to={Motherboard_ROUTE}
              className={`custom-link ${
                hoveredLink === "motherboard" ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredLink("motherboard")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <li>
                <img src={mb} width={30} height={33} />
                <p>Motherboard</p>
              </li>
            </Link>
          </ul>
        </nav>

        <div className="SocialMedia">
          <p className="textSocialMe">We are in social media</p>
          <div className="socialMediaDiv">
            <a href="https://en-gb.facebook.com/">
              <img src={face} width={30} height={30} />
            </a>
            <a href="https://twitter.com/?lang=en">
              <img src={twiter} width={30} height={30} />
            </a>
            <a href="https://www.youtube.com/">
              <img src={youtube} width={30} height={30} />
            </a>
            <a href="https://www.instagram.com/">
              <img src={inst} width={30} height={30} />
            </a>
            <a href="https://web.whatsapp.com/">
              <img src={wassap} width={30} height={30} />
            </a>
            <a href="https://web.telegram.org/a/">
              <img src={telega} width={30} height={30} />
            </a>
          </div>
        </div>
        <div className="InfoAboutCompany"></div>
        <div className="Support"></div>
        <div className="Partneram"></div>
        <div className="Right">
          <p>
            {" "}
            The trademark is used under the license of the rights holder,
            RozetkaLTD © 2001–2023.
          </p>
          <p className="onlineStore">
            Online store "Rozetka™" Every time you need it.
          </p>
        </div>
      </div>
      <div className="RightHome">
        <div className="SliderHome">
          <Slider imgUrl={IMAGES} />
        </div>
        <div className="PromotionalItems">
          <p>Hot new products</p>
          {promItems.length === 0 ? (
            <div className="PromotionalItemsBlock">
              {Array.from({ length: 24 }).map((_, index) => (
                <MyLoader />
              ))}
            </div>
          ) : (
            <div className="PromotionalItemsBlock">
              {promItems.map((item) => (
                <div className="PromotionalItem" key={item.id}>
                  <NavLink
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={`${PRODUCT_ROUTE}/${item.id}`}
                  >
                    <div className="block-img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="border"></div>
                    <div className="p_blocks_name">
                      <p>{item.name}</p>
                    </div>
                    <div className="p_blocks_price">
                      <p>£{item.price}</p>
                    </div>
                  </NavLink>
                  {role === "ADMIN" ? null : (
                    <button
                      onClick={() => handleCartClick(item.id)}
                      className="add-to-basket"
                      disabled={isModalAddCartOpen}
                    >
                      Add to Basket
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isLoginModalOpen && <LoginModal onClose={toggleLoginModal} />}
          {isModalAddCartOpen && <ModalAddCart onClose={toggleAddItemCart} />}
        </div>
      </div>
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PRODUCT_ROUTE } from "../../../utils/consts";
import "../productInfo.scss";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import SliderPrice from "../../../components/SliderPrice/SliderPrice";
import { useDispatch } from "react-redux";
import FullScreenLoader from "../../../components/ReactSkeletonFull/SkeletonFull";
import {
  fetchAllItemsCart,
  updateCartItemQuantity,
  addToCart,
} from "../../../redux/slices/cartSlice";
import LoginModal from "../../../components/ModalCart/LoginModal";
import ModalAddCart from "../../../components/ModalAddIntoCart/ModalAddCart";
import { URL_ELEPHANT } from "../../../utils/url";

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  brandId: number;
  brand: { name: string };
}
interface CartItem {
  id: number;
  productId: number;
  quantity: number; // Add this line
  // Add other necessary fields
}
const min = 100;
const max = 2200;
function Processor() {
  const [monitors, setMonitors] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ name: string; selected: boolean }[]>(
    []
  );
  const dispatch = useDispatch();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([min, max]);
  const [sortOption, setSortOption] = useState<string>("0");
  const user = useSelector((state: RootState) => state.user);
  const role = user?.user?.userWithoutPassword?.role || null;
  const { cartItems, status } = useSelector((state: RootState) => state.cart);
  const [isModalAddCartOpen, setIsModalAddCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${URL_ELEPHANT}/api/product?typeOfProductId=7`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const uniqueBrands: string[] = Array.from(
          new Set(data.rows.map((item: Product) => item.brand.name))
        );
        setBrands(uniqueBrands.map((name) => ({ name, selected: false })));
        setMonitors(data.rows);
        setCategory(data.rows[0].typeOfProduct.name);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);
  const handlePriceChange = (newValues: [number, number]) => {
    setSelectedPriceRange(newValues);
  };

  const handleBrandCheckboxChange = (index: number) => {
    setBrands((prevBrands) => {
      const updatedBrands = [...prevBrands];
      updatedBrands[index].selected = !updatedBrands[index].selected;
      return updatedBrands;
    });

    setBrands((prevBrands) => {
      const selectedBrandNames = prevBrands
        .filter((brand) => brand.selected)
        .map((brand) => brand.name);
      setSelectedBrands(selectedBrandNames);
      return prevBrands;
    });
  };

  if (!monitors.length) {
    return (
      <div>
        <FullScreenLoader />
      </div>
    );
  }

  const filteredMonitors = monitors.filter((item) => {
    if (selectedBrands.length === 0) {
      return true;
    }
    return selectedBrands.includes(item.brand.name);
  });

  let sortedMonitors = filteredMonitors.filter(
    (item) =>
      item.price >= selectedPriceRange[0] && item.price <= selectedPriceRange[1]
  );

  if (sortOption === "1") {
    sortedMonitors = sortedMonitors.slice().sort((a, b) => a.price - b.price);
  } else if (sortOption === "2") {
    sortedMonitors = sortedMonitors.slice().sort((a, b) => b.price - a.price);
  } else if (sortOption === "3") {
    // Add logic for sorting by customer rating if needed
    // sortedMonitors = sortedMonitors.slice().sort((a, b) => a.rating - b.rating);
  }
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
    <div className="wraapper">
      <div className="topInfo">
        <div className="categoryName">{category}</div>
        <div className="custom-select">
          <select
            onChange={(e) => setSortOption(e.target.value)}
            value={sortOption}
          >
            <option value="0">Sort by:</option>
            <option value="1">Sort by:Price - low to high</option>
            <option value="2">Sort by:Price - high to low</option>
          </select>
        </div>
      </div>
      <div className="productsBlock">
        <div className="left">
          <div className="brand">
            {brands.map((brand, index) => (
              <li
                key={brand.name}
                onClick={() => handleBrandCheckboxChange(index)}
              >
                <label>
                  <input
                    className="checkboxxx"
                    type="checkbox"
                    checked={brand.selected}
                    onChange={() => {}}
                  />
                  {brand.name}
                </label>
              </li>
            ))}
          </div>
          <div className="price">
            <SliderPrice onChange={handlePriceChange} min={min} max={max} />
          </div>
        </div>
        <div className="right">
          <div className="items">
            {sortedMonitors.map((item) => (
              <div key={item.id} className="item">
                <NavLink
                  to={`${PRODUCT_ROUTE}/${item.id}`}
                  className="item-link"
                >
                  <div className="img">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="border"></div>
                  <div className="nameLaptops">
                    <p>{item.name}</p>
                  </div>
                  <div className="price">
                    <p>£{item.price}</p>
                  </div>
                </NavLink>
                {role === "ADMIN" ? null : (
                  <button
                    onClick={() => handleCartClick(item.id)}
                    className="add-to-basket"
                  >
                    Add to Basket
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isLoginModalOpen && <LoginModal onClose={toggleLoginModal} />}
      {isModalAddCartOpen && <ModalAddCart onClose={toggleAddItemCart} />}
    </div>
  );
}

export default Processor;

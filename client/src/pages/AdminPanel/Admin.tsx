import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { setLogout } from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store";
import "./index.scss";
import { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBrands, createBrand } from "../../redux/slices/adminSlice";
import { fetchAllProducts } from "../../redux/slices/promItems";
import MuiTable from "../../components/MuiTable/MuiTable";
import CreateProduct from "./CreateProduct";
import { PRODUCT_ROUTE } from "../../utils/consts";
import ConfirmationModal from "../../components/ConfirmationModalBrand/ConfirmationModalBrand";
function Admin() {
  const dispatch: AppDispatch = useDispatch();

  const [showCreateBrandMenu, setShowCreateBrandMenu] = useState(false);
  const [showCreateProductMenu, setCreateProductMenu] = useState(false);
  const [showGetProduct, setshowGetProduct] = useState(false);
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]); // Specify Brand[] type
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [toggleBrands, setToggleBrands] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null); // Track the currently open modal
  const [opeModalBrand, setModalBrand] = useState(false);
  interface Brand {
    id: number;
    name: string;
    createdAt: string;
  }
  interface Product {
    id: number;
    name: string;
    price: string;
    rating: number;
    img: string;
    typeOfProductId: number;
    brandId: number;
  }
  const handleLogout = () => {
    dispatch(setLogout());
  };

  const handleCreateBrandClick = () => {
    setShowCreateBrandMenu(true);
    setCreateProductMenu(false); // Close CreateProduct modal if open
    setOpenModal("createBrand");
  };
  const handleCreateProductClick = () => {
    setCreateProductMenu(true);
    setShowCreateBrandMenu(false); // Close CreateBrand modal if open
    setOpenModal("createProduct");
  };
  const handleCreateBrandSubmit = (brandName: string) => {
    console.log("Creating brand:", brandName);
    setShowCreateBrandMenu(false);
  };

  const handleCloseBrandModal = () => {
    setShowCreateBrandMenu(false);
    setBrand("");
    setError("");
    setOpenModal(null); // Close the modal
  };
  const handleCloseProudctModal = () => {
    setOpenModal(null); // Close the modal
    setCreateProductMenu(false);
  };
  const handleInput = (e: any) => {
    setBrand(e.target.value);
  };
  const getBrands = async () => {
    setOpenModal("getBrands");

    const data = await dispatch(fetchAllBrands());
    setToggleBrands(true);
    if (fetchAllBrands.fulfilled.match(data)) {
      setBrands(data.payload as any); // Temporarily cast to any
    }
  };
  const getProducts = async () => {
    setOpenModal("getProducts");

    const data = await dispatch(fetchAllProducts());
    if (fetchAllProducts.fulfilled.match(data)) {
      setProducts(data.payload);
    } else {
    }
  };
  const toggleAddItemCart = () => {
    setModalBrand(!opeModalBrand);
  };

  const createBrandClick = async () => {
    if (brand.length < 3) {
      setError("Brand name are too short");
    } else {
      const data = await dispatch(createBrand(brand));
      if (data.payload.error) {
        setError(data.payload.error);
      } else {
        setError("");
        setModalBrand(true);
        setBrand("");
        setTimeout(function () {
          handleCloseBrandModal();
          setModalBrand(false);
        }, 5000);
      }
      // handleCloseBrandModal();
    }
  };
  console.log(error);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const formattedBrands = brands.map((brand) => ({
    ...brand,
    createdAt: formatDate(brand.createdAt),
  }));
  return (
    <div className="AdminGrid">
      <div className="adminPower">
        <div className="adminTitle">
          <p className="AdmitTitle">Admin Panel</p>
        </div>
        <div className="LogOut">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="blockOfAdmin">
          <button className="btn_Brand" onClick={handleCreateBrandClick}>
            Create Brand
          </button>
          <button className="get_btn_Brand" onClick={getBrands}>
            Get All Brands
          </button>
          <button className="btn_Product" onClick={handleCreateProductClick}>
            Create Product
          </button>
          <button className="get_btn_Product" onClick={getProducts}>
            Get All Products
          </button>
        </div>
      </div>

      <div className="modalAdmin">
        {openModal === "getBrands" && toggleBrands ? (
          <>
            <div className="modal-headerBrands">
              <p>List of Brands</p>
              <button
                className="close-btnn"
                onClick={handleCloseBrandModal}
              ></button>
            </div>
            <MuiTable brands={formattedBrands} />
          </>
        ) : null}
        {openModal === "createBrand" && (
          <div className="createBrandMenu">
            <div className="modal-headerBrand">
              <h3 className="titleBrand">Create Brand</h3>
              <button
                className="close-btn"
                onClick={handleCloseBrandModal}
              ></button>
            </div>
            <input
              className="inputBrandName"
              type="text"
              placeholder="Enter brand name"
              onChange={handleInput}
            />
            {error.length > 1 ? <p className="errorAdmin">{error}</p> : null}
            <button
              className={`add-to-basket ${
                error.length === 0 ? "toggleBtnBrand" : ""
              }`}
              onClick={() => createBrandClick()}
            >
              Create
            </button>
          </div>
        )}
        {openModal === "createProduct" && (
          <CreateProduct handleClose={handleCloseProudctModal} />
        )}
      </div>
      {openModal === "getProducts" && (
        <div className="PromotionalItems">
          <div className="modal-headerProd">
            <button
              className="close-btnn"
              onClick={handleCloseBrandModal}
            ></button>
          </div>
          <div className="PromotionalItemsBlock">
            {products.map((item) => (
              <NavLink
                style={{ textDecoration: "none", color: "inherit" }}
                key={item.id}
                to={`${PRODUCT_ROUTE}/${item.id}`}
              >
                <div className="PromotionalItem">
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
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
      {opeModalBrand && <ConfirmationModal onClose={toggleAddItemCart} />}
    </div>
  );
}

export default Admin;

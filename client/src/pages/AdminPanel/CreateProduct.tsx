import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBrands, fetchAllTypes } from "../../redux/slices/promItems";
import { RootState } from "../../redux/store";
import { createProduct } from "../../redux/slices/adminSlice";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
interface CreateProductProps {
  handleClose: () => void;
}
interface Product {
  name: string;
  price: string;
  rating: number;
  img: string;
  typeOfProductId: number;
  brandId: number;
  description: { title: string; description: string }[];
}
const CreateProduct = ({ handleClose }: CreateProductProps) => {
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [typeOfProductId, setTypeOfProductId] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [descriptionInputs, setDescriptionInputs] = useState([
    { title: "", description: "" },
  ]);
  const [titleErrors, setTitleErrors] = useState<string[]>([]);
  const [descriptionErrors, setDescriptionErrors] = useState<
    { title: string; description: string }[][]
  >([]);
  // Error state variables
  const [nameError, setNameError] = useState("");
  const [brandIdError, setBrandIdError] = useState("");
  const [typeOfProductIdError, setTypeOfProductIdError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [imgError, setImgError] = useState("");
  const [isModalAddCartOpen, setIsModalAddCartOpen] = useState(false);

  const [formErrors, setFormErrors] = useState({
    name: "",
    brandId: "",
    typeOfProductId: "",
    price: "",
    img: "",
    descriptions: Array.from({ length: descriptionInputs.length }, () => ({
      title: "",
      description: "",
    })),
  });

  console.log(formErrors.descriptions[0]);

  const dispatch = useDispatch();
  const types = useSelector(
    (state: RootState) => state.promItems.type_of_products
  );
  const brands = useSelector((state: RootState) => state.promItems.brands);

  const fetchData = async () => {
    try {
      await Promise.all([
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

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBrandId(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeOfProductId(event.target.value);
  };

  const handleDescriptionInputChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedDescriptionInputs = [...descriptionInputs];
    updatedDescriptionInputs[index][field] = value;
    setDescriptionInputs(updatedDescriptionInputs);

    // Clear the errors for the current description input when it's modified
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      descriptions: prevErrors.descriptions.map((descError, i) => {
        if (index === i) {
          return {
            title: "",
            description: "",
          };
        }
        return descError;
      }),
    }));
  };

  const handleAddDescriptionInput = () => {
    setDescriptionInputs([
      ...descriptionInputs,
      { title: "", description: "" },
    ]);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      descriptions: [
        ...prevErrors.descriptions,
        { title: "", description: "" },
      ],
    }));
  };

  const handleRemoveDescriptionInput = (index: number) => {
    const updatedDescriptionInputs = [...descriptionInputs];
    updatedDescriptionInputs.splice(index, 1);
    setDescriptionInputs(updatedDescriptionInputs);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      descriptions: prevErrors.descriptions.filter((_, i) => i !== index),
    }));
  };
  const toggleAddItemCart = () => {
    setIsModalAddCartOpen(!isModalAddCartOpen);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (
        !name ||
        !brandId ||
        !typeOfProductId ||
        !price ||
        !img ||
        !descriptionInputs
      ) {
        console.error("Please fill in all required fields");
        return;
      }

      if (
        descriptionInputs.some((input) => !input.title || !input.description)
      ) {
        console.error("Please fill in all title and description fields");
        return;
      }
      // Create an array of description objects
      const descriptionData = descriptionInputs.map((input) => ({
        title: input.title,
        description: input.description,
      }));

      // Prepare the data for the createProduct thunk
      const productData: Product = {
        name,
        img,
        brandId: brandId ? parseInt(brandId, 10) : 0, // Convert to number if not null
        typeOfProductId: typeOfProductId ? parseInt(typeOfProductId, 10) : 0, // Convert to number if not null
        price,
        rating: 0, // Set a default value or modify as needed
        description: descriptionData,
      };

      // Dispatch the createProduct thunk with the form data
      const actionResult = await dispatch(createProduct(productData) as any);

      if (!actionResult.error) {
        toggleAddItemCart();
        setTimeout(function () {
          handleClose(); // Uncomment this line if you want to execute handleClose() after the delay
        }, 5000);
      }
      console.log(actionResult);

      if (createProduct.rejected.match(actionResult)) {
        if (actionResult.payload) {
          const serverErrors = actionResult.payload as any;
          console.log(serverErrors);

          setNameError(
            serverErrors.find((error: any) => error.path === "name")?.msg || ""
          );
          setImgError(
            serverErrors.find((error: any) => error.path === "img")?.msg || ""
          );
          setPriceError(
            serverErrors.find((error: any) => error.path === "price")?.msg || ""
          );

          setFormErrors((prevErrors) => ({
            ...prevErrors,
            descriptions: prevErrors.descriptions.map((descError, index) => ({
              title:
                serverErrors.find(
                  (error: any) => error.path === `description[${index}].title`
                )?.msg || "",
              description:
                serverErrors.find(
                  (error: any) =>
                    error.path === `description[${index}].description`
                )?.msg || "",
            })),
          }));
          return;
        }
      }
    } catch (error) {
      console.error("Error creating product:", error);
      // Implement error handling logic if needed
    }
  };

  return (
    <div className="createProductMenu">
      <div className="wrapperProductMenu">
        <form onSubmit={handleSubmit}>
          <div className="modal-header-product">
            <button className="close-btn" onClick={handleClose}></button>
          </div>
          <h3 className="createProductTitle">Create Product</h3>
          <div className="blockOfInputSelect">
            <input
              required
              className="inputCreateP"
              type="text"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <div className="error">{nameError}</div>}

            <select
              required
              className="selectBrand"
              value={brandId || ""}
              onChange={handleBrandChange}
            >
              <option value="" disabled>
                Select Brand
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <select
              required
              className="selectType"
              value={typeOfProductId || ""}
              onChange={handleTypeChange}
            >
              <option value="" disabled>
                Select Type
              </option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <input
              required
              className="inputCreateP"
              type="text"
              placeholder="Enter price"
              onChange={(e) => setPrice(e.target.value)}
            />
            {priceError && <div className="error">{priceError}</div>}
            <input
              required
              className="inputCreateP"
              type="text"
              placeholder="Enter url of img"
              onChange={(e) => setImg(e.target.value)}
            />
            {imgError && <div className="error">{imgError}</div>}
            <div className="blockOfDescriptions">
              <div className="singleBlockOfDesc">
                {descriptionInputs.map((input, index) => (
                  <div className="singleBlockOfDescription" key={index}>
                    <div className="blockInputTitleDescAndError">
                      <input
                        required
                        className="inputTitleDesc"
                        type="text"
                        placeholder="Enter title of description"
                        value={input.title}
                        onChange={(e) =>
                          handleDescriptionInputChange(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                      />
                      {formErrors.descriptions.length !== 0 &&
                      formErrors.descriptions[index]?.title ? (
                        <p>{formErrors.descriptions[index].title}</p>
                      ) : null}
                    </div>
                    <div className="blockInputDescAndError">
                      <input
                        required
                        className="inputDescri"
                        type="text"
                        placeholder="Enter description"
                        value={input.description}
                        onChange={(e) =>
                          handleDescriptionInputChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                      {formErrors.descriptions.length !== 0 &&
                      formErrors.descriptions[index]?.description ? (
                        <p className="pErrorDescription">
                          {formErrors.descriptions[index].description}
                        </p>
                      ) : null}
                    </div>
                    <button
                      className="removeDescription"
                      type="button"
                      onClick={() => handleRemoveDescriptionInput(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="btn-add-descr">
              <button
                className="addDescription"
                type="button"
                onClick={handleAddDescriptionInput}
              >
                Add Description
              </button>
            </div>
            <div className="btn-createProduct">
              <button className="add-product" type="submit">
                Create Product
              </button>
            </div>
          </div>
        </form>
        {isModalAddCartOpen && (
          <ConfirmationModal onClose={toggleAddItemCart} />
        )}
      </div>
    </div>
  );
};

export default CreateProduct;

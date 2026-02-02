import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useFetchProductDetailsQuery,
  useFetchSimilarProductsQuery,
} from "../../redux/slices/productApiSlice";
import { useAddToCartMutation } from "../../redux/slices/cartApiSlice";
import { setCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const productIdentifier = productId || slug;

  const {
    data: selectedProduct,
    isLoading: selectedProductLoading,
    error: selectedProductError,
  } = useFetchProductDetailsQuery(productIdentifier, {
    skip: !productIdentifier,
  });

  const {
    data: similarProducts,
    isLoading: similarProductLoading,
    error: similarProductError,
  } = useFetchSimilarProductsQuery(productIdentifier, {
    skip: !productIdentifier,
  });

  const [addToCart, { isLoading }] = useAddToCartMutation();
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color", { duration: 1000 });
      return;
    }

    try {
      setIsButtonDisabled(true);

      const cartData = await addToCart({
        productId: selectedProduct._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      }).unwrap(); // 🔥 IMPORTANT

      dispatch(setCart(cartData));

      toast.success("Product added to the cart", { duration: 1000 });
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "Failed to add to cart");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = async (action) => {
    const newQuantity = action === "plus" ? quantity + 1 : quantity - 1;
    setQuantity(newQuantity);
  };
  if (selectedProductLoading || similarProductLoading) {
    return <p>Loading...</p>;
  }

  if (selectedProductError || similarProductError) {
    return <p>Error loading product</p>;
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => {
                return (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `thumbnail ${index}`}
                    className={`w-20 h-20 object-cover cursor-pointer rounded-lg border ${
                      mainImage === image.url
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                );
              })}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Mobile Thumbnail */}
            <div className="md:hidden flex overscroll-x-auto space-x-4 mb-4">
              {selectedProduct.images.map((image, index) => {
                return (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `thumbnail ${index}`}
                    className={`w-20 h-20 object-cover cursor-pointer rounded-lg border ${
                      mainImage === image.url
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                );
              })}
            </div>
            {/* Right Side */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="texr-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>

              <p className="text-lg text-gray-600 mb-1 line-through">
                {selectedProduct.price && `${selectedProduct.price}`}
              </p>
              <p className="text-lg text-gray-500 mb-2">
                $ {selectedProduct.discountPrice}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                      }}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color
                          ? "border-4 border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLocaleLowerCase(),
                        filter: "brightness(0.5)",
                      }}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      onClick={() => setSelectedSize(size)}
                      key={size}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>

              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid products={similarProducts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

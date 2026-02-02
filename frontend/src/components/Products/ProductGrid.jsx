import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader";
import Error from "../Common/Error";

const ProductGrid = ({ products, loading, error }) => {
  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error)
    return (
      <div>
        <Error error={error} />
      </div>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product.slug}`} className="block">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-96 mb-4">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText}
                className="w-full h-full object-cover riunlg
                    "
              />
            </div>
            <h3 className="text-sm mb-2">{product.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">
              ${product.discountPrice}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;

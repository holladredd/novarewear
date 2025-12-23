import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiHeart,
} from "react-icons/fi";
import { useDebounce } from "@/hooks/useDebounce";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProducts } from "@/contexts/ProductContext";
import { useWishlist } from "@/contexts/WishlistContext";

const ProductCard = ({ product, wishlist, addItem, removeItem }) => {
  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeItem(product._id);
    } else {
      addItem({ productId: product._id });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 relative">
      <Link href={`/shop/${product.slug}`} passHref>
        <div className="cursor-pointer">
          <div className="relative h-64">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Details
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {product.name}
            </h3>
            <p className="text-gray-600 mt-1">₦{product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FiHeart
          className={`w-6 h-6 ${
            isInWishlist ? "text-red-500 fill-current" : "text-gray-400"
          }`}
        />
      </button>
    </div>
  );
};

const FilterControls = ({
  search,
  handleSearch,
  selectedCategory,
  handleCategoryChange,
  selectedSizes,
  handleSizeChange,
  price,
  handlePriceChange,
  isFeatured,
  handleFeaturedChange,
  sort,
  handleSortChange,
}) => {
  const categories = ["All", "Tees", "Hoodies", "Pants", "Accessories"];

  const sizes = ["S", "M", "L", "XL"];
  const sortOptions = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Search */}
      <div className="lg:col-span-1">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="lg:col-span-1">
        <h3 className="text-sm font-medium text-gray-700">Categories</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 border rounded-md text-sm ${
                (selectedCategory === category && category !== "All") ||
                (category === "All" && selectedCategory === "")
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="lg:col-span-1">
        <h3 className="text-sm font-medium text-gray-700">Sizes</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 border rounded-md text-sm ${
                selectedSizes.includes(size)
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price and Featured */}
      <div className="lg:col-span-1 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Price</h3>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="100000"
              value={price}
              onChange={handlePriceChange}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">Up to ₦{price}</div>
          </div>
        </div>
        <div className="flex items-center pt-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={isFeatured}
            onChange={handleFeaturedChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="featured" className="ml-3 text-sm text-gray-600">
            Featured
          </label>
        </div>
      </div>

      {/* Sort */}
      <div className="lg:col-span-1">
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700"
        >
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          value={sort}
          onChange={handleSortChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const { products, pagination, isLoading, error, filters, setFilters } =
    useProducts();
  const { wishlist, addItem, removeItem } = useWishlist();
  const [search, setSearch] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const totalPages = pagination?.totalPages;

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, setFilters]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setFilters((prev) => ({ ...prev, category: "", page: 1 }));
    } else {
      setFilters((prev) => ({
        ...prev,
        category: prev.category === category ? "" : category,
        page: 1,
      }));
    }
  };

  const handleSizeChange = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    setFilters({ ...filters, sizes: newSizes, page: 1 });
  };

  const handlePriceChange = (e) => {
    setFilters({ ...filters, price: e.target.value, page: 1 });
  };

  const handleFeaturedChange = (e) => {
    setFilters({ ...filters, isFeatured: e.target.checked, page: 1 });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Shop - Novare</title>
      </Head>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14 md:mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Shop</h1>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Section */}
        <div className={`mb-8  ${isFilterVisible ? "block" : "hidden"}`}>
          <FilterControls
            search={search}
            handleSearch={handleSearch}
            selectedCategory={filters.category}
            handleCategoryChange={handleCategoryChange}
            selectedSizes={filters.sizes}
            handleSizeChange={handleSizeChange}
            price={filters.price}
            handlePriceChange={handlePriceChange}
            isFeatured={filters.isFeatured}
            handleFeaturedChange={handleFeaturedChange}
            sort={filters.sort}
            handleSortChange={handleSortChange}
          />
        </div>

        {/* Products Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">
              Error loading products. Please try again later.
            </p>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    wishlist={wishlist}
                    addItem={addItem}
                    removeItem={removeItem}
                  />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex rounded-md shadow-sm">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            filters.page === page
                              ? "bg-gray-800 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">
              No products found matching your criteria.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;

import { RiArrowDropDownLine } from "react-icons/ri";
import { BiFilter } from "react-icons/bi";
import { SingleProductBox } from "../../components/singleProductBox";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSearchedProductData } from "../../features/productSlice";
import { ProductsNotFound } from "./productsNotFound";
import FooterSection from "../../components/footerSection";
import { PaginationSection } from "../../components/paginationSection";
import { handlePaginationProductsPage } from "../../utils/handlePaginationProductsPage";
import { FilterBySection } from "../../components/filterSection";
import { handleSorting } from "../../utils/handleSorting";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export const SearchPage = () => {
  // SEE THE SHP INDEX PAGE,THE UTILS AND THE FEATURES SLICE COMMENTS FOR HOW THE APP FUNCTIONALITIES WORKS
  const [isFilterBySectionOpen, setIsFilterBySectionOpen] = useState(false);
  const [sortingCriteria, setSortingCriteria] = useState("Default: Latest");
  const [isFilterFnApplied, setIsFilterFnApplied] = useState(false);

  const dispatch = useDispatch();
  const {
    allProductsData,
    placeholderOfproductsDataCurrentlyRequested,
    productsDataForCurrentPage,
    searchedProductData,
  } = useSelector((state) => state.productsData);
  const { priceRange, selectedSubCategoryForFilter, selectedCategory } = useSelector(
    (state) => state.filterByCategoryAndPrice
  );

  const navigate = useNavigate();
  let location = useLocation();

  const locationArr = location.search.split("=");
  const prevPage = location.state === "/" || location.state === "/search" ? "home" : location.state?.replace("/", "");
  const searchValue = locationArr[1]?.toUpperCase()?.trim();

  let NoOfProductsPerPage = 10;
  const [currentPageNo, setCurrentPageNo] = useState(1);

  // DIRECTLY ACESSING THE SEARCH PAGE TRIGGERS REDIRECTION TO HOMEPAGE
  useEffect(() => {
    !prevPage && navigate("/");
  }, []);

  // HANDLE SORTING WHEN THE APP STARTS AND ALSO WHEN SORTING CRITERIA CHANGES
  useEffect(() => {
    let SearchedProductData = allProductsData.filter((product) => {
      return product.title.toUpperCase().trim().includes(searchValue);
    });
    dispatch(setSearchedProductData(SearchedProductData));
    handleSorting(
      dispatch,
      sortingCriteria,
      SearchedProductData,
      NoOfProductsPerPage,
      currentPageNo,
      location.pathname
    );
  }, [dispatch, sortingCriteria, allProductsData, searchValue]);

  useEffect(() => {
    handlePaginationProductsPage(
      dispatch,
      NoOfProductsPerPage,
      currentPageNo,
      placeholderOfproductsDataCurrentlyRequested
    );
  }, [dispatch, NoOfProductsPerPage, currentPageNo, placeholderOfproductsDataCurrentlyRequested]);

  const handleSortingCriteriaSelection = (e) => {
    if (e.target.dataset.list) {
      setSortingCriteria(e.target.textContent);
      e.currentTarget.classList.remove("active-sorting-lists");
    }
  };

  // FOR THE 'back' BTN NAVIGATION
  const navigateToPrevPage = () => {
    if (prevPage === "home") {
      navigate("/");
    }
    if (prevPage === "shop") {
      navigate("/shop");
    }
  };

  return (
    <section className="lg:grid lg:grid-cols-[250px_1fr_1fr_1fr] lg:grid-rows-[auto_1fr_auto]">
      <div className="mt-12 tablet:px-[6%] w-[100%] h-[54px] bg-neutralColor text-secondaryColor xl:px-[4%] px-[4%] lg:px-[2%] flex items-center justify-between font-bold  font-RobotoCondensed lg:col-span-full lg:row-span-1">
        <div className="flex gap-[4px] items-center text-[15px]">
          <IoIosArrowBack />
          <li onClick={() => navigateToPrevPage()} className="hover:underline capitalize">
            {prevPage}
          </li>
          <IoIosArrowBack />
          <span>Search results</span>
          {selectedSubCategoryForFilter && (
            <>
              {" "}
              <IoIosArrowBack />
              <span>{selectedCategory}</span> <IoIosArrowBack />
              <span>{selectedSubCategoryForFilter}</span>
            </>
          )}
        </div>
      </div>

      <FilterBySection
        {...{
          isFilterBySectionOpen,
          setIsFilterBySectionOpen,
          currentPageNo,
          NoOfProductsPerPage,
          setIsFilterFnApplied,
        }}
      />

      <div className="lg:col-start-2 lg:col-end-5 lg:row-span-1 lg:ml-[8%] xl:ml-[10%] lg:mr-[3%] xl:mr-[5%]">
        <h3 className="text-center font-bold text-[24px] my-20 px-[10%]">
          Showing search results for the term : "{locationArr[1]}"
        </h3>
        {searchedProductData.length < 1 ? (
          <ProductsNotFound searchTerm={searchValue} />
        ) : (
          <>
            <div className="lg:flex lg:justify-between lg:items-start">
              {isFilterFnApplied && (selectedSubCategoryForFilter || priceRange) && (
                <article className="w-[300px] tablet:w-[360px] max-w-[75%] md:w-[400px]  bg-[#ffffff] laptop:w-[17%]  ml-[4%] tablet:ml-[6%]  mb-12 flex-col flex gap-2 lg:ml-0 lg:order-2 lg:min-w-[400px]">
                  <h3 className="text-lg font-bold ml-2"> Active Filters</h3>
                  <div className="flex  justify-between h-14 bg-lightPrimaryColor text-white rounded-md shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)]  items-center px-[5%] font-medium text-base ">
                    {selectedSubCategoryForFilter && <h3>Sub-Category : {selectedSubCategoryForFilter}</h3>}
                    {priceRange && <h3>priceRange : {priceRange}($)</h3>}
                  </div>
                </article>
              )}
              <article className="w-[65%] lg:order-1 tablet:w-[40%] md:w-[30%] bg-[#ffffff] laptop:w-[40%] lg:w-[30%] ml-[4%] tablet:ml-[6%]  mb-12 flex-col flex gap-2 lg:ml-0 lg:max-w-[262px]">
                <h3 className="text-lg font-bold ml-2"> Sort by</h3>
                <div
                  className={`flex justify-between h-14 rounded-md shadow-[0.5px_2px_32px_-2px_rgba(0,0,0,0.1)] items-center px-[10%] cursor-pointer ${
                    sortingCriteria !== "Default: Latest" && "bg-lightPrimaryColor text-white"
                  }`}
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling.classList.toggle("active-sorting-lists");
                  }}
                >
                  <h2>{sortingCriteria}</h2>
                  <RiArrowDropDownLine className="w-8 h-8 " />
                </div>
                <div
                  className={`hidden flex-col bg-[#ffffff] rounded-md shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)]   py-4  gap-4 z-[200] px-[10%] sticky top-0 left-0 right-0 -mb-64  sorting-lists ${
                    sortingCriteria !== "Default: Latest" && "bg-lightPrimaryColor text-white"
                  }`}
                  onClick={(e) => handleSortingCriteriaSelection(e)}
                >
                  <li data-list="sorting-criteria">Default: Latest</li>
                  <li data-list="sorting-criteria">Name: A-Z</li>
                  <li data-list="sorting-criteria">Name: Z-A</li>
                  <li data-list="sorting-criteria">Price: low to high</li>
                  <li data-list="sorting-criteria">Price: high to low</li>
                  <li data-list="sorting-criteria">Oldest</li>
                </div>
              </article>
            </div>

            {placeholderOfproductsDataCurrentlyRequested.length > 0 ? (
              <>
                <section className="grid grid-cols-1 tablet:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  lg:w-[100%] w-[92%] mx-auto items-center justify-center gap-[4rem]  mt-20 tablet:justify-between tablet:w-[88%] md:justify-between tablet:gap-y-12 md:gap-y-12 md:gap-[5%]  tablet:gap-[4%]">
                  {productsDataForCurrentPage.map((productsData, index) => {
                    return <SingleProductBox key={index} productsData={productsData} />;
                  })}
                </section>
                <PaginationSection {...{ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }} />
                <BiFilter
                  className="w-16 lg:hidden h-16 bg-darkPrimaryColor shadow-lg fill-secondaryColor fixed right-[7%] bottom-[7%] z-[1000] cursor-pointer"
                  onClick={() => setIsFilterBySectionOpen(true)}
                />
              </>
            ) : (
              <h1 className="text-center text-[28px] md-[32px] lg:text-[36px]">product match not found</h1>
            )}
          </>
        )}
      </div>
      <FooterSection />
    </section>
  );
};

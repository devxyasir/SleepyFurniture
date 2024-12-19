import { setProductsDataForCurrentPage } from "../features/productSlice";

export const handlePaginationProductsPage = (dispatch, NoOfProductsPerPageNo, currentPageNo, productsData) => {
  const indexOfLastPage = NoOfProductsPerPageNo * currentPageNo;
  const indexOfPrevPage = indexOfLastPage - NoOfProductsPerPageNo;
  let currentPageProductsData = productsData.slice(indexOfPrevPage, indexOfLastPage);
  dispatch(setProductsDataForCurrentPage(currentPageProductsData));
};

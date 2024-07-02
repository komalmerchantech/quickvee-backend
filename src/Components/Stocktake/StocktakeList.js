import { capitalize, CircularProgress, Grid, Paper } from "@mui/material";
import InputTextSearch from "../../reuseableComponents/InputTextSearch";
import AddIcon from "../../Assests/Category/addIcon.svg";
import Pagination from "../../AllUserComponents/Users/UnverifeDetails/Pagination";

//       table imports ----------------------------------------------------
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// end table imports ----------------------------------------------------
import { useEffect, useState } from "react";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleStocktakeData,
  fetchStocktakeList,
  getStocktakeListCount,
} from "../../Redux/features/Stocktake/StocktakeListSlice";
import { SkeletonTable } from "../../reuseableComponents/SkeletonTable";
import useDebounce from "../../hooks/useDebouncs";
import { useNavigate } from "react-router-dom";
import { SortTableItemsHelperFun } from "../../helperFunctions/SortTableItemsHelperFun";
import sortIcon from "../../Assests/Category/SortingW.svg";
const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDMedium",
  },
  [`&.${tableCellClasses.table}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDMedium",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    // backgroundColor: "#F5F5F5",
  },
}));
const StocktakeList = ({
  setVisible,
  // singleStocktakeState,
  // getSingleStocktakeData,
  // setSingleStocktakeState,
  // setStocktakeId
}) => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(""); // State to track search ID
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const StocktakeListReducerState = useSelector((state) => state.stocktakeList);
  const [loader, setLoader] = useState(false);
  const [stocltakeId, setStocltakeId] = useState();
  const { LoginGetDashBoardRecordJson, userTypeData } = useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  // console.log("StocktakeList", StocktakeListReducerState);
  const [StocktakeList, setStocktakeList] = useState([]);
  const dispatch = useDispatch();

  const debouncedValue = useDebounce(searchId);
  useEffect(() => {
    const data = {
      ...userTypeData,
      perpage: rowsPerPage,
      merchant_id: merchant_id,
      page: currentPage,
      search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
    };

    dispatch(fetchStocktakeList(data));
  }, [currentPage, debouncedValue, rowsPerPage]);

  useEffect(() => {
    dispatch(
      getStocktakeListCount({
        ...userTypeData,
        merchant_id: merchant_id,
        search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
      })
    );
  }, [debouncedValue]);

  useEffect(() => {
    if(!StocktakeListReducerState.loading && StocktakeListReducerState?.stocktakeListCount){
      setTotalCount(StocktakeListReducerState.stocktakeListCount);
    }
  
  }, [StocktakeListReducerState.stocktakeListCount]);

  useEffect(() => {
    if(!StocktakeListReducerState.loading && StocktakeListReducerState?.StocktakeList){
      setStocktakeList(StocktakeListReducerState?.StocktakeList);
    }
    
  }, [StocktakeListReducerState?.StocktakeList]);

  const handleSearchInputChange = (value) => {
    setSearchId(value);
    setCurrentPage(1);
  };
  const tableRow = [
    { type: "num", name: "id", label: "Stocktake" },
    { type: "str", name: "status", label: "Status" },
    { type: "num", name: "total_qty", label: "Total Qty" },
    {
      type: "num",
      name: "total_discrepancy_cost",
      label: "Total Discrepancy Cost",
    },
    { type: "date", name: "created_at", label: "Date" },
  ];
  const stocktalkStatus = [
    {
      status: "0",
      title: "completed",
    },
    {
      status: "1",
      title: "draft",
    },
    {
      status: "2",
      title: "void",
    },
  ];

  const handleStocktakeIdClick = async (id) => {
    setStocltakeId(id);
    setLoader(true);
    // const result = await getSingleStocktakeData(id);
    const result = await dispatch(
      fetchSingleStocktakeData({ merchant_id, id, userTypeData })
    );
    console.log(result);

    console.log(loader);
    if (result) {
      if (result?.payload?.result?.status === "0") {
        // setVisible("StocktakeReoport");
        navigate(`/stocktake/completed/${id}`);
        setLoader(false);
      }
      if (result?.payload?.result?.status === "1") {
        // setVisible("AddNewStocktake");
        navigate(`/stocktake/UpdateStocktake/${id}`);
        setLoader(false);
      }
      if (result?.payload?.result?.status === "2") {
        // setVisible("StocktakeReoport");
        navigate(`/stocktake/void/${id}`);
        setLoader(false);
      }
    }
  };
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };
  console.log("StocktakeListReducerState", StocktakeListReducerState);
  const [sortOrder, setSortOrder] = useState("asc");
  const sortByItemName = (type, name) => {
    const updatedList = StocktakeList?.map((item) => {
      const matchingStatus = stocktalkStatus?.find(
        (itemStatus) => itemStatus?.status === item?.status
      );
      return {
        ...item,
        status: matchingStatus ? matchingStatus.title : "",
      };
    });
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      updatedList,
      type,
      name,
      sortOrder
    );
    const updatedListWithDigit = sortedItems?.map((item) => {
      const matchingStatus = stocktalkStatus?.find(
        (itemStatus) => itemStatus?.title === item?.status
      );
      return {
        ...item,
        status: matchingStatus ? matchingStatus.status : "",
      };
    });
    setStocktakeList(updatedListWithDigit);
    setSortOrder(newOrder);
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <Grid container sx={{ p: 2.5 }} className="box_shadow_div">
        <Grid item xs={12}>
          <InputTextSearch
            type="text"
            placeholder="Search Stocktake Order"
            value={searchId}
            handleChange={handleSearchInputChange}
            autoComplete="off"
          />
        </Grid>
      </Grid>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <div className="q-category-bottom-header">
                <span>Stocktake List</span>
              </div>
            </Grid>
            <Grid item>
              <div className="q-category-bottom-header">
                <p
                  onClick={() => {
                    // setVisible("AddNewStocktake");
                    navigate("/stocktake/AddStocktake");
                    // setSingleStocktakeState();
                  }}
                >
                  Add New Stocktake <img src={AddIcon} alt="add-icon" />{" "}
                </p>
              </div>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={rowsPerPage}
                onPageChange={paginate}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                setCurrentPage={setCurrentPage}
              />
            </Grid>
          </Grid>
          <Grid container>
            {StocktakeListReducerState.loading ? (
              <SkeletonTable columns={tableRow.map((item) => item.label)} />
            ) : (
              <>
                {StocktakeListReducerState?.StocktakeList &&
                Array.isArray(StocktakeListReducerState?.StocktakeList) &&
                StocktakeListReducerState?.StocktakeList?.length >= 1 ? (
                  <>
                    <TableContainer component={Paper}>
                      <StyledTable aria-label="customized table">
                        <TableHead>
                          {tableRow.map((item, index) => (
                            <StyledTableCell key={item}>
                              <button
                                className="flex items-center"
                                onClick={() =>
                                  sortByItemName(item.type, item.name)
                                }
                              >
                                <p>{item.label}</p>
                                <img src={sortIcon} alt="" className="pl-1" />
                              </button>
                              {}
                            </StyledTableCell>
                          ))}
                        </TableHead>
                        <TableBody>
                          {StocktakeList &&
                            StocktakeList?.map((item, index) => {
                              const statusObj = stocktalkStatus?.find(
                                (itemStatus) =>
                                  itemStatus.status === item.status
                              );
                              const formatCurrency = (amount) => {
                                const formattedAmount = Math.abs(
                                  amount
                                ).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                });
                                return amount < 0
                                  ? `-${formattedAmount}`
                                  : formattedAmount;
                              };
                              return (
                                <StyledTableRow key={index}>
                                  <StyledTableCell>
                                    <button
                                      className="attributeUpdateBTN"
                                      onClick={() => {
                                        handleStocktakeIdClick(item.id);
                                      }}
                                    >
                                      {loader && stocltakeId === item.id ? (
                                        <CircularProgress
                                          color={"inherit"}
                                          className=""
                                          width={15}
                                          size={15}
                                        />
                                      ) : (
                                        <p className="text-[#0A64F9] cursor-pointer">
                                          {item.st_id}
                                        </p>
                                      )}
                                    </button>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <p>
                                      {statusObj
                                        ? capitalize(statusObj.title)
                                        : ""}
                                    </p>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <p>{item.total_qty}</p>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {formatCurrency(
                                      item?.total_discrepancy_cost
                                    )}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <p>{formatDate(item.created_at)}</p>
                                  </StyledTableCell>
                                </StyledTableRow>
                              );
                            })}
                        </TableBody>
                      </StyledTable>
                    </TableContainer>
                  </>
                ) : (
                  <>
                    <div className="p-4">
                      <p>No results found</p>
                    </div>
                  </>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default StocktakeList;

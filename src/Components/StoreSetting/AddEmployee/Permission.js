import React, { useState, useEffect } from "react";
import "../../../Styles/StoreSetting.css";
import "../../../Styles/Settings/SystemAccess.css";
import "../../../Styles/Common.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  clearPermission,
  fetchEmployeeData,
  fetchPermissionData,
} from "../../../Redux/features/StoreSettings/AddEmployee/AddEmployeeSlice";
import EditPermissionLogic from "../AddEmployee/EditPermissionLogic";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import AddNewCategory from "../../../Assests/Taxes/Left.svg";
import Loader from "../../../CommonComponents/Loader";

const Permission = ({ EmployeeId, setVisible }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employeedata, setemployeedata] = useState([]);
  const [permissionList, setpermissionList] = useState([]);
  const employee_id = EmployeeId;
  const employeeListDataState = useSelector((state) => state.employeelistData);

  const [permissionArray, setPermissionArray] = useState([]);

  const {
    handleEditEmpPermissionInput,
    values,
    handleEditEmpPermission,
    submitmessage,
    showModal,
    setShowModal,
    scrollRef,
    setsubmitmessage,
  } = EditPermissionLogic({ employeedata, setVisible });

  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;

  useEffect(() => {
    let data = {
      merchant_id: merchant_id,
      employee_id: employee_id,
      ...userTypeData,
    };
    if (data && employee_id != "undefined") {
      dispatch(fetchEmployeeData(data));
      dispatch(fetchPermissionData(data));
    }
    return () => {
      dispatch(clearPermission());
    };
  }, []);

  useEffect(() => {
    if (
      !employeeListDataState.loading &&
      employeeListDataState.employeeData &&
      employeeListDataState.permissionData
    ) {
      setemployeedata(employeeListDataState.employeeData);
      setpermissionList(employeeListDataState.permissionData);
    }
  }, [
    employeeListDataState,
    employeeListDataState.loading,
    employeeListDataState.employeeData,
    employeeListDataState.permissionData,
  ]);

  const permissionList_arr = [];
  function MyComponent(permissionList) {
    let index = 0;

    for (const key in permissionList) {
      if (permissionList.hasOwnProperty(key)) {
        // Create an object with a single key-value pair and push it to the array
        const obj = {};
        obj[key] = permissionList[key];
        permissionList_arr[index] = obj;
        index++;
      }
    }
    setPermissionArray(permissionList_arr);

    return (
      <div className="box">
        <div>
          <h1>{JSON.stringify(permissionList_arr)} </h1>{" "}
          {JSON.stringify(permissionList_arr)} {/* Just for demonstration */}
        </div>
        \
      </div>
    );
  }

  useEffect(() => {
    MyComponent(permissionList);
  }, [permissionList, employeedata]);

  const RedirectCancelButton = () => {
    setVisible("EmployeeList");
    navigate(`/store-settings/addemployee`);
  };

  return (
    // fro laoder Start
    <div className="box">
      {/* edit modal */}
      {employeeListDataState.loading ? (
        <div class="loading-box">
          <Loader />
        </div>
      ) : (
        <>
          <div className="q-attributes-main-page">
            <div className="box_shadow_div_heading">
              <div className="page_heading_area ">
                <span
                  onClick={() => {
                    setVisible("EmployeeList");
                  }}
                  className="cursor-pointer"
                  // to="/store-settings/addemployee"
                >
                  <div className="employeePromiss">
                    <img src={AddNewCategory} alt="Add-New-Category" />
                    <h1>
                      {employeedata.f_name} {employeedata.l_name}'s Permissions
                    </h1>
                  </div>
                </span>
              </div>
              <div className="box_shadow_innerdiv">
                <h2 className="heading_black">Preset Permissions</h2>
                <div className="">
                  <div className="input_rediobutton_area">
                    <input
                      className="inputredio"
                      type="radio"
                      id="manager"
                      name="role"
                      value="manager"
                      onChange={handleEditEmpPermissionInput}
                      checked={
                        values.role === "manager" || values.role === null
                      }
                      // defaultChecked={values.role == 'manager' || values.role == 'null'}
                      // defaultChecked={values.role === 'manager'}
                    />
                    <label htmlFor="manager">Manager</label>
                  </div>
                  <div className="input_rediobutton_area">
                    <input
                      className="inputredio"
                      type="radio"
                      id="cashier"
                      name="role"
                      value="cashier"
                      onChange={handleEditEmpPermissionInput}
                      checked={
                        values.role === "cashier" && values.role !== null
                      }
                      // defaultChecked={values.role !=='' && values.role === 'cashier'}
                    />
                    <label htmlFor="cashier">Cashier</label>
                  </div>
                  <div className="input_rediobutton_area">
                    <input
                      className="inputredio"
                      type="radio"
                      id="driver"
                      name="role"
                      value="driver"
                      onChange={handleEditEmpPermissionInput}
                      checked={values.role === "driver" && values.role !== null}
                      // defaultChecked={values.role !=='' && values.role === 'driver'}
                    />
                    <label htmlFor="driver">Driver</label>
                  </div>
                  <div className="input_rediobutton_area">
                    <input
                      className="inputredio"
                      type="radio"
                      id="time_clock_only"
                      name="role"
                      value="time_clock_only"
                      onChange={handleEditEmpPermissionInput}
                      checked={
                        values.role === "time_clock_only" &&
                        values.role !== null
                      }
                      // defaultChecked={values.role !=='' && values.role === 'time_clock_only'}
                    />
                    <label htmlFor="time_clock_only">Time Clock Only</label>
                  </div>
                </div>
                <span className="input-error">
                  {values.errors.role !== "" ? values.errors.role : ""}
                </span>
              </div>
            </div>

            <div className="box_shadow_div_heading">
              <div className="page_heading_area">
                <h1>Permissions</h1>
              </div>
              {permissionArray.map((item, index) => {
                const key = Object.keys(item)[0]; // Gets the first key in the object
                const idArray = values.permissions.split(",");

                return (
                  <div key={key} className="box_shadow_innerdiv">
                    <h2 className="heading_black">{key}</h2>

                    <div className="qvrow">
                      {item[key].map((subItem, subIndex) => (
                        <div key={subIndex} className="col-qv-3">
                          <div className="checkbox_space">
                            <div className="qv_checkbox">
                              <label className="qv_checkbox_add_checkmark_label">
                                {subItem.sub_permission}
                                <input
                                  type="checkbox"
                                  name="permission[]"
                                  onChange={handleEditEmpPermissionInput}
                                  value={subItem.id}
                                  // defaultChecked={idArray?.includes(
                                  //   String(subItem.id)
                                  // )}
                                  checked={idArray?.includes(
                                    String(subItem.id)
                                  )}
                                />
                                <span className="qv_add_checkmark"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="box_shadow_div_heading">
              <div className="box_shadow_innerdiv">
                <h2 className="heading_black">Time Clock Settings</h2>
                <div className="mt10">
                  <div className="qvrow">
                    <div className="col-qv-4">
                      <div className="input_area">
                        <label>Number of Breaks Allowed</label>
                        <input
                          type="text"
                          name="break_allowed"
                          onChange={(e) => {
                            if (e.target.value.length < 5) {
                              handleEditEmpPermissionInput(e);
                            }
                          }}
                          value={values.break_allowed}
                          placeholder="0"
                        />
                        <span className="input-error">
                          {values.errors.break_allowed !== ""
                            ? values.errors.break_allowed
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="col-qv-4">
                      <div className="input_area">
                        <label>Minutes Per Break</label>
                        <input
                          type="text"
                          name="break_time"
                          onChange={(e) => {
                            if (e.target.value.length < 4) {
                              handleEditEmpPermissionInput(e);
                            }
                          }}
                          value={values.break_time}
                          placeholder="0"
                        />
                        <span className="input-error">
                          {values.errors.break_time !== ""
                            ? values.errors.break_time
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="col-qv-4">
                      <div className="input_area">
                        <label>Number of Paid Breaks</label>
                        <input
                          type="text"
                          name="paid_breaks"
                          // onChange={handleEditEmpPermissionInput}
                          onChange={(e) => {
                            if (e.target.value.length < 5) {
                              handleEditEmpPermissionInput(e);
                            }
                          }}
                          value={values.paid_breaks}
                          placeholder="0"
                        />
                        <span className="input-error">
                          {values.errors.paid_breaks !== ""
                            ? values.errors.paid_breaks
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="qvrow">
              <div className="col-qv-12">
                <div className="q-add-categories-section-middle-footer">
                  <button
                    className="quic-btn quic-btn-save"
                    onClick={handleEditEmpPermission}
                  >
                    Update
                  </button>

                  <Link
                    onClick={() => RedirectCancelButton()}
                    // to={`/store-settings/addemployee`}
                  >
                    <button className="quic-btn quic-btn-cancle">Cancel</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    // fro laoder End
  );
};

export default Permission;

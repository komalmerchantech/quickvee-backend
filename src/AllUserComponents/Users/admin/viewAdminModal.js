import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ViewAdmin(props) {
  return (
    <>
      {/* <Modal 
        show={props.showAdmin} 
        onHide={props.handleCloseAdminModel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
                Array.isArray(props.showMerchantData) ? 
                props.showMerchantData.map((result,index)=>{
                    return(
                        <p key={index}>{result.name}</p>
                    )
                })
                :<p>{props.showMerchantData}</p>
            }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" 
          onClick={props.handleCloseAdminModel}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
       {
        props.showAdmin ?
          <div className="q-custom-modal-container" id="addtributes_">
          {/* Your modal JSX */}
          <div className="q-custom-modal-content">
            {/* Your modal content */}
            <div className="">
              <p className="q-custom-modal-header ">
                {props.adminName}
              </p>
            </div>
            {/* ... other modal content ... */}
            {
                Array.isArray(props.showMerchantData) ? 
                props.showMerchantData.map((result,index)=>{
                    return(
                        <p key={index}>{result.name}</p>
                    )
                })
                :<p>{props.showMerchantData}</p>
            }
            {/* <input
              type="text"
              placeholder="Enter attribute title"
              className="q-custom-input-field"
              value={newAttribute}
              onChange={changeTittleHandler}
            /> */}
            <span className="input-error">
              {/* {errorMessage !== "" ? errorMessage : ""} */}
            </span>
            <div className="q-add-categories-section-middle-footer">
              {/* <button
                // onClick={handleAddAttribute}
                className="quic-btn quic-btn-save"
              >
                Add
              </button> */}
              <button
                onClick={props.handleCloseAdminModel}
                className="quic-btn quic-btn-cancle"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
        :''

      }
    </>
  );
}

export default ViewAdmin;
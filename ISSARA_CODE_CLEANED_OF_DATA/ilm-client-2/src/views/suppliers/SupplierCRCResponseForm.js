import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";


import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import QualityOfResponseForm from "./crc/QualityOfResponseForm.js";
import TimelinessOfResponseForm from "./crc/TimelinessOfResponseForm.js";
import OpennessToReformForm from "./crc/OpennessToReformForm.js";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { createBhrCRCResponse, updateBhrCRCResponse } from "../../redux/actions/BhrResponseActions";


import { fetchSupplierCRCs } from "../../redux/actions/SupplierActions";
import Utils from "services/utils";

const customStyles = {
  ...sweetAlertStyles,
};

const useStyles = makeStyles(customStyles);


export default function SupplierCRCResponseForm(props) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const supplierCRCList = useSelector(state => state.supplierCRCReducer.items);
  const fetchingSupplierCRCS = useSelector(state => state.suppliersReducer.fetchingSupplierCRCS)

  const id = (props.location) ? new URLSearchParams(props.location.search).get('id') : null; // id from query string of edited strategic partner


  const [supplier, setSupplier] = useState(null);
  const [alert, setAlert] = useState(null)

  const [preLoadedItem, setPreloadedItem] = useState(null);

  const handleConfirmSuccessAlert = () => {

    props.history.push('/admin/suppliercrclist')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id ? 'Supplier CRC was updated' : 'Supplier CRC has been successfully created'}
      </SweetAlert>
    );

  };

  const errorAlert = (error) => {
    setAlert(
      <SweetAlert
        danger
        onConfirm={() => setAlert(null)}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Error"
      >
        {error.message}
      </SweetAlert>
    );
  };

  const handleSubmit = (allData) => {


    const payload = {
      ...allData.qualityofresponse,
      ...allData.timelinessofresponse,
      ...allData.opennesstoreform,
      supplier: supplier
    }

    if( preLoadedItem !== null && preLoadedItem.id ) {
      payload.id = preLoadedItem.id;
      dispatch(updateBhrCRCResponse(preLoadedItem.id, payload, successAlert, errorAlert));
      
    } else {
      dispatch(createBhrCRCResponse(payload, successAlert, errorAlert));
    }
    
  }


  useEffect(() => {
    // Fetch strategic partners
    dispatch(fetchSupplierCRCs())
  }, []);

  useEffect(() => {

    if (supplierCRCList && supplierCRCList.length > 0 && id) {
      const supplierCRC = supplierCRCList.filter(item => { return item.id == id })[0]

      if (supplierCRC) {
        setPreloadedItem(supplierCRC);
        setSupplier(supplierCRC.supplier);
      }
    }
  }, [supplierCRCList]);

  return (
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>{"Edit/Add CRC: " + ((preLoadedItem && preLoadedItem.id) ? preLoadedItem.id : "")}</h4>
          </CardHeader>
          <CardBody>
            <GridItem>
              <SuppliersDropdown value={supplier} onSelect={(supplier) => setSupplier(supplier)} />
            </GridItem>
            <GridItem>
              <Wizard
                key={Utils.giveMeGuid()}
                validate
                steps={[
                  { stepName: "Quality Of Response", stepComponent: QualityOfResponseForm, stepId: "qualityofresponse", globalEditData: (preLoadedItem) ? Object.assign({}, preLoadedItem) : null},
                  { stepName: "Timeliness Of Response", stepComponent: TimelinessOfResponseForm, stepId: "timelinessofresponse", globalEditData: (preLoadedItem) ? Object.assign({}, preLoadedItem) : null },
                  { stepName: "Openness To Reform", stepComponent: OpennessToReformForm, stepId: "opennesstoreform", globalEditData: (preLoadedItem) ? Object.assign({}, preLoadedItem) : null }

                ]}
                title=""
                subtitle=""
                //style={{width: "100%"}}
                finishButtonEnabled={true}
                finishButtonClick={allData => handleSubmit(allData)}
              />
            </GridItem>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

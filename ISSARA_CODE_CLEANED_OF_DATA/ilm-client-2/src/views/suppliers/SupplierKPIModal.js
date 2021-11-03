import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";


import ReactTable from "react-table-6";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';
import SweetAlert from "react-bootstrap-sweetalert";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";


import SupplierKpiDetailsSubPanel from "./SupplierKpiDetailsSubPanel.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import moment from 'moment';
import { batchRemoveSupplierKpis } from "../../redux/actions/SupplierActions";

import Utils from "../../services/utils.js";

const customStyles = {
  ...customCheckboxRadioSwitch,
  ...sweetAlertStyles,

  paper: {
    backgroundColor: 'white',
    padding: 30,
    webkitBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    mozBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    boxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
  },
  preBlock: {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    scroll: "none",
    width: "100%"
  },
  modal: {
    display: 'block',
    maxWidth: '70%',
    height: '100%',
    overflowWrap: "break-word",
    overflowY: "auto;",
    overflowX: "none;",
    paddingBottom: "20px"
  },
  spanLabel: {
    fontWeight: 500,
  },
  customButton: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    top: '40px',
    right: '40px',
    scrollbars: "none"
  },
  updateContainer: {
    display: 'inline-block',
    margin: '10px',
    textAlign: 'center'
  },
  updateCircle: {
    border: '2px dotted',
    borderRadius: '100%',
    margin: 'auto',
    width: 40,
    height: 40,
  },
  updateCircleArrow: {
    position: 'absolute',
    fontSize: '20px',
    fontWeight: 500,
    top: '35px',
    marginLeft: '35px',
  },
  updateCircleCurrent: {
    color: 'green',
    position: 'absolute',
    marginLeft: '-4px',
    marginTop: '-20px'
  },
  updateHeaderSpan: {
    display: 'inline',
    marginRight: '10px',
    fontWeight: 400
  }
};

const useStyles = makeStyles(customStyles);

export default function SupplierKPIModal(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const supplier_kpi_update_status_closed = 3;
  const supplierKPIId = props.value;

  const supplierKPIs = useSelector(state => state.suppliersReducer.supplierKPIs);
  const supplierKpiUpdates = useSelector(state => state.suppliersReducer.supplierKpiUpdates);
  const recruitersMap = useSelector(state => state.recruitersReducer.recruitersMap);
  const callsMap = useSelector(state => state.workerVoiceCaseCallsReducer.callsMap);
  const [alertBox, setAlertBox] = useState(null);

 
  useEffect(() => {
    // Works out better to just do this in the parent.
    // Then reducers have data.

    // Fetch supplier KPIs
    //if (supplierKPIs === undefined) {
    //  dispatch(fetchSupplierKPIs())
    //}
    // Fetch supplier KPI updates
    //if (supplierKpiUpdates === undefined) {
    //  dispatch(fetchSupplierKpiUpdates())
    //}

  });


  const showDeleteConfirmation = () => {
    setAlertBox(
      <SweetAlert
        success
        showConfirm
        showCancel
        onConfirm={() => {

          dispatch(batchRemoveSupplierKpis([supplierKPIId], () => {
            setTimeout(() => {
              setAlertBox(<SweetAlert
                success
                title="Supplier KPI Deleted"
                onConfirm={() => {
                  setAlertBox(null);
                  props.onClose();
                }}
                confirmBtnCssClass={classes.button + " " + classes.info}

              >
                {"You have successfully deleted the supplier kpi and it's child updates"}
              </SweetAlert>);
            }, -1);

          }, () => {
            setAlertBox(<SweetAlert
              error
              title="Error Supplier KPI was not deleted"
              onConfirm={() => {
                setAlertBox(null)
              }}
              confirmBtnCssClass={classes.button + " " + classes.info}

            >
              {'Error occured trying to delete those supplier kpi updates'}
            </SweetAlert>);
          }));

        }}
        onCancel={() => setAlertBox(null)}
        confirmBtnCssClass={classes.button + " " + classes.info}
        cancelBtnCssClass={classes.button + " " + classes.default}
        confirmBtnText="Confirm"
        title={"Confirm Delete ?"}
      >
        {'About to delete supplier kpi id: ' + supplierKPIId}
      </SweetAlert>);
  }

  const kpi = supplierKPIs[supplierKPIId]
  const updates = [];
  let calls = [];
  let map = new Map();

  if (kpi !== undefined) {
    updates.push(kpi);

    let key = ":" + kpi.closed_at + ":" + kpi.opened_at + ":" + kpi.status;
    map.set(key, key);


    // Ill always show the first one...  !!  The actual status of the Supplier KPI record
    // Ill always show the first one...
    // The rest of the history.. Ill only show the closed updates... Which should be the full period that kpi was open in that period.  Should always just be...   closed - opened.
    if (kpi.updates !== undefined && kpi.updates.length !== undefined && kpi.updates.length > 0) {
      let sortedUpdates = kpi.updates;
      sortedUpdates = sortedUpdates.sort((a, b) => {
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        return 0;
      });

      sortedUpdates.forEach((kpiUpdateId) => {
        // let key = ":" + supplierKpiUpdates[kpiUpdateId].closed_at + ":" + supplierKpiUpdates[kpiUpdateId].opened_at + ":" + supplierKpiUpdates[kpiUpdateId].status;
        // if (!map.has(key)) {
        //   map.set(key, key);
        // } else {
        //   return;
        // }

        if (supplierKpiUpdates[kpiUpdateId] !== undefined &&
          supplierKpiUpdates[kpiUpdateId] !== null &&
          supplierKpiUpdates[kpiUpdateId].status === supplier_kpi_update_status_closed) {
          updates.push(supplierKpiUpdates[kpiUpdateId]);
        }
      });
    }

    if (kpi) {
      calls = (kpi.calls !== undefined && kpi.calls !== null) ? kpi.calls : [];
    }
    calls.sort();
  }


  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        {alertBox}

        {(calls && calls.length < 1) ? (<div>
          <h4>*This Supplier KPI has 0 cases and is ok to remove.</h4>
          <Button
            color="rose"
            onClick={() => {
              showDeleteConfirmation();
            }}>Delete</Button>
        </div>) : (null)}

        <h3 style={{ marginTop: 0 }}> {`Supplier KPI #${supplierKPIId}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.customButton}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </Button>
        <Divider />
        <h5> Overview: </h5>

        <p> <span className={classes.spanLabel}> Update Source: </span> {kpi && (kpi.kpi_update_source !== null && kpi.kpi_update_source !== undefined && kpi.kpi_update_source !== "") ? kpi.kpi_update_source : "N/A"}  </p>
        <p> <span className={classes.spanLabel}> Supplier: </span> {kpi && kpi.supplier_name}  </p>
        <p> <span className={classes.spanLabel}> Category: </span> {kpi && kpi.category || '-'} </p>
        <p className={classes.preBlock}> <span className={classes.spanLabel}> Description: </span> {kpi && kpi.description || '-'} </p>
        <p> <span className={classes.spanLabel}> Level: </span> {kpi && kpi.level || '-'} </p>
        <p> <span className={classes.spanLabel}> Laws Violated: </span> {kpi && kpi.law || '-'} </p>
        <p> <span className={classes.spanLabel}> # Workers Impacted: </span> {kpi && kpi.affected_workers || '-'} </p>
        <p> <span className={classes.spanLabel}> Status: </span> {kpi && Utils.getSupplierKpiStatusFromId(kpi.status)} </p>
        <p> <span className={classes.spanLabel}> Open Since: </span> {kpi && kpi.opened_at && kpi.opened_at || '-'} </p>
        <p> <span className={classes.spanLabel}> Updated: </span> {kpi && kpi.overview_date && kpi.overview_date || '-'} </p>
        {kpi && !kpi.open &&
          <div>
            <p> <span className={classes.spanLabel}> Closed: </span> {kpi && kpi.closed_at && kpi.closed_at || '-'} </p>
            <p> <span className={classes.spanLabel}> Closed Quality: </span> {kpi && kpi.closed_quality || '-'} </p>
            <div> <span className={classes.spanLabel}> Rationale: </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.closed_notes || '-'}</p></div>
          </div>
        }
        <Divider />
        <h5> Remediation: </h5>
        <div> <span className={classes.spanLabel}> Issara Recommendations: </span>
          <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.remediation_issara_recommendation || '-'}</p></div>
        <p className={classes.preBlock}> <span className={classes.spanLabel}> Progress on remediation: </span> {kpi && kpi.remediation_progress || '-'} </p>
        <p> <span className={classes.spanLabel}> How aligned are the business's responses: </span> {kpi && kpi.remediation_aligned || '-'} </p>
        <div> <span className={classes.spanLabel}> Business Steps Taken: </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.remediation_business_steps_taken || '-'}</p></div>
        <div> <span className={classes.spanLabel}> Business Steps Remaining: </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.remediation_business_steps_remaining || '-'}</p></div>
        <div> <span className={classes.spanLabel}> Notes (Talking Points): </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.remediation_notes || '-'}</p></div>
        <div> <span className={classes.spanLabel}> Action (Talking Points): </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.remediation_action || '-'}</p></div>
        <div> <span className={classes.spanLabel}> Validation (Talking Points): </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.remediation_validation || '-'}</p></div>
        <div> <span className={classes.spanLabel}> Results (Talking Points): </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.remediation_results || '-'}</p></div>
        <Divider />
        <h5> Payments: </h5>
        <p> <span className={classes.spanLabel}> Owed: </span> {`${kpi && kpi.remediation_owed_baht} Baht, ${kpi && kpi.remediation_owed_kyat} Kyat, ${kpi && kpi.remediation_owed_ringitt} Ringitt, ${kpi && kpi.remediation_owed_usd} USD`} </p>
        <p> <span className={classes.spanLabel}> Paid: </span> {`${kpi && kpi.remediation_paid_baht} Baht, ${kpi && kpi.remediation_paid_kyat} Kyat, ${kpi && kpi.remediation_paid_ringitt} Ringitt, ${kpi && kpi.remediation_paid_usd} USD`} </p>
        <p> <span className={classes.spanLabel}> Payment Deadline: </span> {kpi && kpi.remediation_payment_deadline && kpi.remediation_payment_deadline || '-'} </p>
        <Divider />
        <h5> Documents: </h5>
        <p> <span className={classes.spanLabel}> Owed: </span> {kpi && kpi.remediation_documents_owed || '-'} </p>
        <p> <span className={classes.spanLabel}> Provided: </span>{kpi && kpi.remediation_documents_provided || '-'} </p>
        <p> <span className={classes.spanLabel}> Documents Deadline: </span> {kpi && kpi.remediation_documents_deadline && kpi.remediation_documents_deadline || '-'} </p>
        <Divider />
        <h5> Systems Change: </h5>
        <div> <span className={classes.spanLabel}> Issara Recommendations: </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.systems_change_issara_recommendation || '-'}</p></div>
        <p> <span className={classes.spanLabel}> Progress on remediation: </span> {kpi && kpi.systems_change_progress || '-'} </p>
        <p> <span className={classes.spanLabel}> How aligned are the business's responses: </span> {kpi && kpi.systems_change_aligned || '-'} </p>
        <div> <span className={classes.spanLabel}> Business Steps Taken: </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.systems_change_business_steps_taken || '-'}</p></div>
        <div> <span className={classes.spanLabel}> Business Steps Remaining: </span><p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>{kpi && kpi.systems_change_business_steps_remaining || '-'}</p></div>
        <p> <span className={classes.spanLabel}> System Change Deadline: </span> {kpi && kpi.systems_change_deadline && kpi.systems_change_deadline || '-'} </p>
        <Divider />

        <Divider />

        <GridContainer>
          <div>
            <br />
          </div>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} lg={12}>
            {(kpi !== undefined && kpi !== null) ? (<SupplierKpiDetailsSubPanel showDataCorrectionUI={true} supplierKPI={kpi}
              recruitersMap={recruitersMap}
              callsMap={callsMap}
              supplierKpiUpdates={supplierKpiUpdates} />) : (null)}
          </GridItem>

        </GridContainer>


      </div>

    </Modal>
  );
}

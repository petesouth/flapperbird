import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import Datetime from "react-datetime";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";
import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import ButtonBar from "components/ButtonBar/ButtonBar.js";
import Table from "components/Table/Table.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";

import Checkbox from "@material-ui/core/Checkbox"

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import SupplierKpiUpdateStatusesDropdown from "components/ilmdb/SupplierKpiUpdateStatusesDropdown.js";
import { fetchSuppliers, fetchSupplierKPIs, updateSupplierKPI } from "redux/actions/SupplierActions.js";


// style
import { makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import Utils from "services/utils.js";


const customStyle = {
  ...customCheckboxRadioSwitch,
  ...sweetAlertStyles,
  label: {
    color: 'black',
    fontSize: '14px',
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.42857,
  },
  buttonLabel: {
    marginBottom: '-10px',
  },
  spanLabel: {
    fontWeight: 500,
  },
  customCard: {
    marginTop: 0,
  },
  customGridItem: {
    marginTop: '-20px',
  },
}
const useStyles = makeStyles(customStyle);


export default function SupplierKpiUpdateForm(props) {
  const valueEmpty = " ";
  const SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID = 3;  //  It's 3 in the database
  const SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID = 4;  //  It's 4 in the database
  const classes = useStyles();
  const dispatch = useDispatch();

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)
  const supplierKPIs = useSelector(state => state.suppliersReducer.supplierKPIs)
  const fetchingSupplierKPIs = useSelector(state => state.suppliersReducer.fetchingSupplierKPIs)
  
  const [saving, setSaving] = useState(false);

  const supplierKpiCopy = props.supplierKpiCopy;
  let supplierKPI = (supplierKPIs && Object.keys(supplierKPIs).length > 0 ) ? supplierKPIs[props.id] : null;
  
  if( supplierKPI === null ) {
    supplierKPI = {};
  }
  
  if(supplierKpiCopy && supplierKpiCopy.supplier_kpi) {
    supplierKPI = { ...supplierKpiCopy, kpi: supplierKPI.kpi};
    delete supplierKPI["supplier_kpi"];
    delete supplierKPI["id"];
  }


  /*********************************************/
  /***************** START STATE ***************/
  /*********************************************/
  const [kpi, setKpi] = useState(null)
  const [supplier, setSupplier] = useState(null)
  const [openedAt, setOpenedAt] = useState(new Date())
  const [closedAt, setClosedAt] = useState(new Date())

  const [status, setStatus] = useState(undefined);
  const [closedQuality, setClosedQuality] = useState(null)
  const [closedNotes, setClosedNotes] = useState('')
  const [affectedWorkers, setAffectedWorkers] = useState(0)
  const [retaliation, setRetaliation] = useState('No')

  // REMEDIATION
  const [remediationIssaraRecommendations, setRemediationIssaraRecommendations] = useState('')
  const [remediationProgress, setRemediationProgress] = useState('None')
  const [remediationAligned, setRemediationAligned] = useState('None')
  const [remediationBusinessStepsTaken, setRemediationBusinessStepsTaken] = useState('')
  const [remediationBusinessStepsRemaining, setRemediationBusinessStepsRemaining] = useState('')
  const [remediationNotes, setRemediationNotes] = useState('')
  const [remediationAction, setRemediationAction] = useState('')
  const [remediationValidation, setRemediationValidation] = useState('')
  const [remediationResults, setRemediationResults] = useState('')
  const [remediationPaymentDeadline, setRemediationPaymentDeadline] = useState(null)

  const [remediationOwedBaht, setRemediationOwedBaht] = useState(0)
  const [remediationOwedKyat, setRemediationOwedKyat] = useState(0)
  const [remediationOwedRingitt, setRemediationOwedRingitt] = useState(0)
  const [remediationOwedUsd, setRemediationOwedUsd] = useState(0)

  const [remediationPaidBaht, setRemediationPaidBaht] = useState(0)
  const [remediationPaidKyat, setRemediationPaidKyat] = useState(0)
  const [remediationPaidRingitt, setRemediationPaidRingitt] = useState(0)
  const [remediationPaidUsd, setRemediationPaidUsd] = useState(0)

  const [remediationWorkersPaid, setRemediationWorkersPaid] = useState(0)
  const [remediationDocumentsOwed, setRemediationDocumentsOwed] = useState(0)
  const [remediationDocumentsProvided, setRemediationDocumentsProvided] = useState(0)
  const [remediationDocumentsDeadline, setRemediationDocumentsDeadline] = useState(null)

  // SYSTEMS CHANGE
  const [systemsChangeIssaraRecommendations, setSystemsChangeIssaraRecommendations] = useState('')
  const [systemsChangeProgress, setSystemsChangeProgress] = useState('None')
  const [systemsChangeAligned, setSystemsChangeAligned] = useState('None')


  const [systemsChangeBusinessStepsTaken, setSystemsChangeBusinessStepsTaken] = useState('')
  const [systemsChangeBusinessStepsRemaining, setSystemsChangeBusinessStepsRemaining] = useState('')
  const [systemsChangeDeadline, setSystemsChangeDeadline] = useState(null)

  // NOT PAYLOAD
  const [finished, setFinished] = useState(false)
  const [alert, setAlert] = useState(null)

  /*********************************************/
  /****************** END STATE ****************/
  /*********************************************/


  const loadSupplierKpiFromItem = (item) => {
      setKpi(item.kpi);
      setSupplier(item.supplier);
      setOpenedAt(item.opened_at);
      setClosedAt(item.closed_at);

      setAffectedWorkers(item.affected_workers);
      item.status && setStatus(item.status);
      setClosedQuality(item.closed_quality);
      setClosedNotes(item.closed_notes);
      setRetaliation(Boolean(item.retaliation) ? 'Yes' : 'No');

      item.remediation_progress && setRemediationProgress(item.remediation_progress);
      item.remediation_aligned && setRemediationAligned(item.remediation_aligned);
      item.remediation_issara_recommendation && setRemediationIssaraRecommendations(item.remediation_issara_recommendation);
      item.remediation_business_steps_taken && setRemediationBusinessStepsTaken(item.remediation_business_steps_taken);
      item.remediation_business_steps_remaining && setRemediationBusinessStepsRemaining(item.remediation_business_steps_remaining);
      item.remediation_notes && setRemediationNotes(item.remediation_notes);
      item.remediation_action && setRemediationAction(item.remediation_action);
      item.remediation_validation && setRemediationValidation(item.remediation_validation);
      item.remediation_results && setRemediationResults(item.remediation_results);


      setRemediationPaymentDeadline(item.remediation_payment_deadline && new Date(item.remediation_payment_deadline));

      setRemediationOwedBaht(item.remediation_owed_baht);
      setRemediationOwedKyat(item.remediation_owed_kyat);
      setRemediationOwedRingitt(item.remediation_owed_ringitt);
      setRemediationOwedUsd(item.remediation_owed_usd);

      setRemediationPaidBaht(item.remediation_paid_baht);
      setRemediationPaidKyat(item.remediation_paid_kyat);
      setRemediationPaidRingitt(item.remediation_paid_ringitt);
      setRemediationPaidUsd(item.remediation_paid_usd);

      setRemediationWorkersPaid(item.remediation_workers_paid);

      setRemediationDocumentsOwed(item.remediation_documents_owed);
      setRemediationDocumentsProvided(item.remediation_documents_provided);
      setRemediationDocumentsDeadline(item.remediation_documents_deadline && new Date(item.remediation_documents_deadline));

      item.systems_change_progress && setSystemsChangeProgress(item.systems_change_progress);
      item.systems_change_aligned && setSystemsChangeAligned(item.systems_change_aligned);
      item.systems_change_issara_recommendation && setSystemsChangeIssaraRecommendations(item.systems_change_issara_recommendation);
      item.systems_change_business_steps_taken && setSystemsChangeBusinessStepsTaken(item.systems_change_business_steps_taken);
      item.systems_change_business_steps_remaining && setSystemsChangeBusinessStepsRemaining(item.systems_change_business_steps_remaining);
      setSystemsChangeDeadline(item.systems_change_deadline && new Date(item.systems_change_deadline));
  }

  const loadExistingSupplierKPI = () => {
    loadSupplierKpiFromItem(supplierKPI);
  }

  useEffect(() => {
    let ranUpdate = false;

    // Fetch Supplier KPIs
    if (Object.keys(supplierKPIs).length === 0 && !fetchingSupplierKPIs) {
      dispatch(fetchSupplierKPIs());
      ranUpdate = true;
    }
    // Fetch suppliers
    if (suppliers.length === 0 && !fetchingSuppliers) {
      dispatch(fetchSuppliers())
      ranUpdate = true;
    }

    if(ranUpdate === false) {
      loadExistingSupplierKPI();
    }

  }, []);

  useEffect(() => {
    loadExistingSupplierKPI();
  }, [props.id, suppliers]);

  const successAlert = () => {
    props.onUpdateKPI()
    setFinished(true);
    setSaving(false);
  };

  const errorAlert = (error) => {
    setAlert(
      <SweetAlert
        danger
        onConfirm={() => {
          setAlert(null);
          setSaving(false);
        }}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Error"
      >
        {error.message}
      </SweetAlert>
    );
  };

  const onSubmit = () => {
    setSaving(true);

    if ((status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID) && (closedAt === null || closedAt === undefined)) {
      errorAlert({ message: "Must set closed At Date when closing" });
      return;
    }

    if (openedAt === null || openedAt === undefined) {
      errorAlert({ message: "Must set openedAt, this field can't be blank" });
      return;
    }


    const payload = {
      kpi: kpi,
      supplier: supplier,

      overview_date: new Date().toLocaleDateString(),
      status: status,
      kpi_update_source: "supplierkpiupdateform",
      closed_quality: status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID ? (closedQuality || 'Poor') : null,
      closed_notes: status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID  || status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID? closedNotes : null,
      affected_workers: affectedWorkers || 0,
      retaliation: retaliation == 'Yes' ? true : false,

      remediation_issara_recommendation: remediationIssaraRecommendations,
      remediation_progress: remediationProgress,
      remediation_aligned: remediationAligned,
      remediation_business_steps_taken: remediationBusinessStepsTaken,
      remediation_business_steps_remaining: remediationBusinessStepsRemaining,

      remediation_payment_deadline: remediationPaymentDeadline instanceof Date ? remediationPaymentDeadline.toLocaleDateString() : null,
      remediation_owed_baht: remediationOwedBaht || 0,
      remediation_owed_kyat: remediationOwedKyat || 0,
      remediation_owed_ringitt: remediationOwedRingitt || 0,
      remediation_owed_usd: remediationOwedUsd || 0,

      remediation_paid_baht: remediationPaidBaht || 0,
      remediation_paid_kyat: remediationPaidKyat || 0,
      remediation_paid_ringitt: remediationPaidRingitt || 0,
      remediation_paid_usd: remediationPaidUsd || 0,
      remediation_workers_paid: remediationWorkersPaid || 0,

      remediation_documents_owed: remediationDocumentsOwed || 0,
      remediation_documents_provided: remediationDocumentsProvided || 0,
      remediation_documents_deadline: remediationDocumentsDeadline instanceof Date ? remediationDocumentsDeadline.toLocaleDateString() : null,
      remediation_notes: remediationNotes,
      remediation_action: remediationAction,
      remediation_validation: remediationValidation,
      remediation_results: remediationResults,

      systems_change_issara_recommendation: systemsChangeIssaraRecommendations,
      systems_change_progress: systemsChangeProgress,
      systems_change_aligned: systemsChangeAligned,
      systems_change_business_steps_taken: systemsChangeBusinessStepsTaken,
      systems_change_business_steps_remaining: systemsChangeBusinessStepsRemaining,
      systems_change_deadline: systemsChangeDeadline instanceof Date ? systemsChangeDeadline.toLocaleDateString() : null,

      open: status !== SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || status !== SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID,
      opened_at: openedAt,
      closed_at: (status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID) ? closedAt : null,
    }

    dispatch(updateSupplierKPI(props.id, payload, successAlert, errorAlert))
  }

  const supplierName = () => {
    let supplier = suppliers.find(element => {
      return element.id === supplierKPI.supplier
    })
    return (supplier) ? supplier.name : "";
  }
  console.log(affectedWorkers)
  return (
    <Card className={classes.customCard} style={{ display: finished && 'none' }}>
      {alert}
      <CardBody>
        <GridContainer>
          <GridItem xs={12} lg={4}>
            <Card className={classes.customCard} style={{ position: 'sticky', top: '20px' }}>
              <CardBody>
               <div>
                    <p><span className={classes.spanLabel}>Update Source: </span>{(supplierKPI.kpi_update_source != undefined && supplierKPI.kpi_update_source != null && supplierKPI.kpi_update_source != "") ? supplierKPI.kpi_update_source : "N/A"}</p>
                    <p> <span className={classes.spanLabel}>Supplier:</span> {supplierName()}  </p>
                    <p> <span className={classes.spanLabel}>Category:</span> {supplierKPI.category} </p>
                    <p> <span className={classes.spanLabel}>Description:</span> {supplierKPI.description} </p>
                    <p> <span className={classes.spanLabel}>Level:</span> {supplierKPI.level} </p>
                    <p> <span className={classes.spanLabel}>Open Since:</span> {supplierKPI.opened_at} </p>
                    <p> <span className={classes.spanLabel}>Remediation:</span> {supplierKPI.remediation} </p>
                    <p> <span className={classes.spanLabel}>Remediation Deadline:</span> Not implemented </p>
                    <p> <span className={classes.spanLabel}>Systems Change:</span> {supplierKPI.systems_change} </p>
                    <p> <span className={classes.spanLabel}>Systems Change Deadline:</span> {supplierKPI.systems_change_deadline} </p>
                    <p> <span className={classes.spanLabel}># Impacted:</span> {supplierKPI.affected_workers} </p>
                    <p> <span className={classes.spanLabel}>Laws Violated:</span> {supplierKPI.law} </p>
                  </div>
                
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xs={12} lg={8} style={{ marginTop: '-30px' }}>
            <CustomTabs
              headerColor="rose"
              tabs={[
                {
                  tabName: "KPI Status Overview",
                  tabContent: (
                    <GridContainer>
                      <GridItem lg={12}>
                        <SupplierKpiUpdateStatusesDropdown key={Utils.giveMeGuid()} value={status} onSelect={(e) => {
                          let value = (e.target.value === undefined || e.target.value === valueEmpty) ? undefined : Number.parseInt(e.target.value);
                          setStatus(value);

                          if (value === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || value === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID) {
                            setClosedAt((new Date()).toLocaleDateString());
                          } else {
                            setClosedAt(null);
                          }
                        }} />
                      </GridItem>


                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: 0 }}>
                          Opened At:
                        </p>
                        <Datetime
                          timeFormat={false}
                          inputProps={{ placeholder: "Click here to open calendar" }}
                          onChange={newDate => setOpenedAt((newDate && newDate.format !== undefined) ? newDate.format("YYYY-MM-DD") : newDate)}
                          value={openedAt}
                        />
                      </GridItem>



                      {(status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_UNRESOLVED_ID) &&
                        <GridContainer>
                          <GridItem lg={12}>
                            <p className={classes.label} style={{ marginBottom: 0 }}>
                              Closed At:
                            </p>
                            <Datetime
                              timeFormat={false}
                              inputProps={{ placeholder: "Click here to open calendar" }}
                              onChange={newDate => setClosedAt((newDate && newDate.format !== undefined) ? newDate.format("YYYY-MM-DD") : newDate)}
                              value={closedAt}
                            />
                          </GridItem>
                          <GridItem lg={12}>
                            <p className={classes.label + ' ' + classes.buttonLabel}> Please assess quality of remediation </p>
                            <ButtonBar
                              value={closedQuality}
                              labelWidth={12}
                              buttons={[
                                { name: "Poor", value: "Poor" },
                                { name: "Fair", value: "Fair" },
                                { name: "Good", value: "Good" },
                                { name: "Excellent", value: "Excellent" }
                              ]}
                              onClick={(name, value) => {
                                setClosedQuality(value)
                              }}
                            />
                          </GridItem>
                          <GridItem lg={12}>
                            <p className={classes.label} style={{ marginBottom: '-16px' }}>
                              Please explain the rationale for this remediation outcome assessment.
                            </p>
                            <CustomInput
                              isTextArea={true}
                              formControlProps={{ fullWidth: true }}
                              inputProps={{ onChange: (e) => { setClosedNotes(e.target.value) } }}
                              value={closedNotes}
                            />
                          </GridItem>
                        </GridContainer>
                      }

                      <GridItem xs={12} lg={12}>
                        <CustomInput
                          labelText="Number of affected workers related to this KPI"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: 'number',
                            onChange: (e) => { setAffectedWorkers(e.target.value > 0 ? e.target.value : 0) }
                          }}
                          value={`${parseInt(affectedWorkers)}`}
                        />
                      </GridItem>

                      <GridItem lg={12}>
                        <p className={classes.label + ' ' + classes.buttonLabel}>
                          Have there been any retaliation or threats to workers?
                        </p>
                        <ButtonBar
                          value={retaliation}
                          labelWidth={12}
                          buttons={[
                            { name: "Yes", value: 'Yes' },
                            { name: "No", value: 'No' },
                          ]}
                          onClick={(name, value) => setRetaliation(value)}
                        />
                      </GridItem>
                    </GridContainer>
                  )
                },
                {
                  tabName: "Assessment: remediation",
                  tabContent: (
                    <GridContainer>

                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          Please summarize Issara's recommendations for remediation
                          to address this KPI, including timeframe
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{ onChange: (e) => { setRemediationIssaraRecommendations(e.target.value) } }}
                          value={remediationIssaraRecommendations}
                        />
                      </GridItem>

                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: 0 }}>
                          What date has been communicated as the recommended deadline
                          for completion of payments and/or next major payment milestone?
                        </p>
                        <Datetime
                          timeFormat={false}
                          inputProps={{ placeholder: "Click here to open calendar" }}
                          onChange={date => setRemediationPaymentDeadline(date._d)}
                          value={remediationPaymentDeadline}
                        />
                      </GridItem>

                      <GridItem lg={12}>
                        <p className={classes.label + ' ' + classes.buttonLabel}>
                          How much progress has been made on remediation, as recommended by Issara?
                        </p>
                        <ButtonBar
                          value={remediationProgress}
                          labelWidth={12}
                          buttons={[
                            { name: "None", value: "None" },
                            { name: "A little", value: "A little" },
                            { name: "A lot", value: "A lot" },
                          ]}
                          onClick={(name, value) => setRemediationProgress(value)}
                        />
                      </GridItem>

                      <GridItem lg={12}>
                        <p className={classes.label + ' ' + classes.buttonLabel}>
                          How aligned are the business's responses with Issara's
                          recommendations and international ethical standards?
                        </p>
                        <ButtonBar
                          value={remediationAligned}
                          labelWidth={12}
                          buttons={[
                            { name: "None", value: "None" },
                            { name: "A little", value: "A little" },
                            { name: "A lot", value: "A lot" },
                          ]}
                          onClick={(name, value) => setRemediationAligned(value)}
                        />
                      </GridItem>

                      <GridItem xs={12} lg={6}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          Describe steps taken by the business so far.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setRemediationBusinessStepsTaken(e.target.value)
                            }
                          }}
                          value={remediationBusinessStepsTaken}
                        />
                      </GridItem>

                      <GridItem xs={12} lg={6}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          Describe steps remaining by the business.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setRemediationBusinessStepsRemaining(e.target.value)
                            }
                          }}
                          value={remediationBusinessStepsRemaining}
                        />
                      </GridItem>

                      <GridItem xs={12}>
                        <p className={classes.label}>
                          How much money is owed in total to all workers?
                          (If none is owed, please enter '0')
                        </p>
                      </GridItem>

                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="Thai Baht"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationOwedBaht(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationOwedBaht)}`}
                        />
                      </GridItem>
                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="Myanmar Kyat"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationOwedKyat(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationOwedKyat)}`}
                        />
                      </GridItem>
                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="Malaysian Ringitt"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationOwedRingitt(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationOwedRingitt)}`}
                        />
                      </GridItem>
                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="US Dollars"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationOwedUsd(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationOwedUsd)}`}
                        />
                      </GridItem>

                      <GridItem xs={12}>
                        <p className={classes.label}>
                          How much money has been paid back so far?
                          (If none is has been paid, please enter '0')
                        </p>
                      </GridItem>

                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="Thai Baht"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationPaidBaht(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationPaidBaht)}`}
                        />
                      </GridItem>
                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="Myanmar Kyat"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationPaidKyat(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationPaidKyat)}`}
                        />
                      </GridItem>
                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="Malaysian Ringitt"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationPaidRingitt(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationPaidRingitt)}`}
                        />
                      </GridItem>
                      <GridItem xs={3} className={classes.customGridItem}>
                        <CustomInput
                          labelText="US Dollars"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationPaidUsd(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationPaidUsd)}`}
                        />
                      </GridItem>

                      <GridItem xs={12} className={classes.customGridItem}>
                        <CustomInput
                          labelText="How many workers have received payments to date?"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationWorkersPaid(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationWorkersPaid)}`}
                        />
                      </GridItem>

                      <GridItem xs={12} className={classes.customGridItem}>
                        <CustomInput
                          labelText="How many workers are owed documents, visas, or WPs?"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationDocumentsOwed(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationDocumentsOwed)}`}
                        />
                      </GridItem>

                      <GridItem xs={12} className={classes.customGridItem}>
                        <CustomInput
                          labelText="How many workers have received back their documents, visas, or WPs?"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            type: "number",
                            onChange: (e) => {
                              setRemediationDocumentsProvided(e.target.value > 0 ? e.target.value : 0)
                            }
                          }}
                          value={`${parseInt(remediationDocumentsProvided)}`}
                        />
                      </GridItem>

                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: 0 }}>
                          What date has been communicated as the recommended deadline
                          for return of documents and/or next major document processing milestone?
                        </p>
                        <Datetime
                          timeFormat={false}
                          inputProps={{ placeholder: "Click here to open calendar" }}
                          onChange={date => setRemediationDocumentsDeadline(date._d)}
                          value={remediationDocumentsDeadline}
                        />
                      </GridItem>

                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          (* Special field for Mark or Lisa Only) Please share any other detail about remediation issue.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setRemediationNotes(e.target.value)
                            }
                          }}
                          value={remediationNotes}
                        />
                      </GridItem>
                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          (* Special field for Mark or Lisa Only) Please share any other detail about remediation action owed and provided.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setRemediationAction(e.target.value)
                            }
                          }}
                          value={remediationAction}
                        />
                      </GridItem>
                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          (* Special field for Mark or Lisa Only) Please share any other detail about remediation validation.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setRemediationValidation(e.target.value)
                            }
                          }}
                          value={remediationValidation}
                        />
                      </GridItem>
                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          (* Special field for Mark or Lisa Only) Please share any other detail about remediation results.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setRemediationResults(e.target.value)
                            }
                          }}
                          value={remediationResults}
                        />
                      </GridItem>
                    </GridContainer>
                  )
                },
                {
                  tabName: "Assessment: systems change",
                  tabContent: (
                    <GridContainer>

                      <GridItem lg={12}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          Please summarize Issara's recommendations for systems change
                          to address this KPI, including timeframe.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setSystemsChangeIssaraRecommendations(e.target.value)
                            }
                          }}
                          value={systemsChangeIssaraRecommendations}
                        />
                      </GridItem>

                      openedAt

                      <GridItem lg={12}>
                        <p className={classes.label + ' ' + classes.buttonLabel}>
                          How much progress has been made on systems change,
                          as recommended by Issara?
                        </p>
                        <ButtonBar
                          value={systemsChangeProgress}
                          labelWidth={12}
                          buttons={[
                            { name: "None", value: "None" },
                            { name: "A little", value: "A little" },
                            { name: "A lot", value: "A lot" }
                          ]}
                          onClick={(name, value) => setSystemsChangeProgress(value)}
                        />
                      </GridItem>

                      <GridItem lg={12}>
                        <p className={classes.label + ' ' + classes.buttonLabel}>
                          How aligned are the business's responses with
                          Issara's recommendations and international ethical standards?
                        </p>
                        <ButtonBar
                          value={systemsChangeAligned}
                          labelWidth={12}
                          buttons={[
                            { name: "None", value: "None" },
                            { name: "A little", value: "A little" },
                            { name: "A lot", value: "A lot" }
                          ]}
                          onClick={(name, value) => setSystemsChangeAligned(value)}
                        />
                      </GridItem>

                      <GridItem xs={12} lg={6}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          Describe steps taken by the business so far.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setSystemsChangeBusinessStepsTaken(e.target.value)
                            }
                          }}
                          value={systemsChangeBusinessStepsTaken}
                        />
                      </GridItem>

                      <GridItem xs={12} lg={6}>
                        <p className={classes.label} style={{ marginBottom: '-16px' }}>
                          Describe steps remaining by the business.
                        </p>
                        <CustomInput
                          isTextArea={true}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onChange: (e) => {
                              setSystemsChangeBusinessStepsRemaining(e.target.value)
                            }
                          }}
                          value={systemsChangeBusinessStepsRemaining}
                        />
                      </GridItem>
                      <GridContainer justify='flex-end'>
                        <GridItem>
                          <Button color='success' onClick={onSubmit} disabled={saving}>Update</Button>
                        </GridItem>
                      </GridContainer>

                    </GridContainer>
                  )
                },
              ]}
            />
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );


}

import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";


import ReactTable from "react-table-6";


// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox"

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Tooltip from '@material-ui/core/Tooltip';
import Utils from "../../services/utils.js";

import Check from "@material-ui/icons/Check";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import { batchDeleteSupplierKpiUpdates } from "../../redux/actions/SupplierActions";

import { fetchSupplierKPIs, fetchSupplierKpiUpdates } from "../../redux/actions/SupplierActions.js";

import SupplierKpiUpdateForm from "./SupplierKpiUpdateForm.js";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import loginStore from "../../redux/stores/LoginStore.js";


import moment from 'moment';

// style
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { is } from "@babel/types";

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
    maxWidth: '88%',
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
    padding: 0,
    margin: 0
  },
  checkRoot: {
    padding: 0
  },
  labelRoot: {
    margin: 0
  },
};


const useStyles = makeStyles(customStyles);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);


export default function SupplierKpiDetailsSubPanel(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
    
  const showDataCorrectionUI = (props.showDataCorrectionUI !== null || props.showDataCorrectionUI !== undefined ) ? props.showDataCorrectionUI : false;

  const supplierKPI = props.supplierKPI;
  const recruitersMap = props.recruitersMap;
  const callsMap = props.callsMap;
  const supplierKpiUpdates = props.supplierKpiUpdates;
  const [selectedKPIs, setSelectedKPIs] = useState([]);

  const [alertBox, setAlertBox] = useState(null);
  const [kpiUpdateForm, setKpiUpdateForm] = useState(null);

  const supplier_kpi_update_status_closed = 3;

  const handleSelectKPI = (kpi_id) => {
    const newSelectedKPIs = [...selectedKPIs];
    const currentIndex = selectedKPIs.indexOf(kpi_id);

    if (currentIndex === -1) {
      newSelectedKPIs.push(kpi_id);
    } else {
      newSelectedKPIs.splice(currentIndex, 1);
    }
    setSelectedKPIs(newSelectedKPIs);
  };

  const checkbox = (kpi_id) => {
    return (loginStore.isIssaraManagement()) ? (
      <FormControlLabel
        control={
          <Checkbox
            onClick={() => handleSelectKPI(kpi_id)}
            checked={selectedKPIs.includes(kpi_id)}
            checkedIcon={<Check className={classes.checkedIcon} />}
            icon={<Check className={classes.uncheckedIcon} />}
            classes={{
              checked: classes.checked,
              root: classes.checkRoot
            }}
          />
        }
        classes={{
          // label: classes.label + ' ' + classes.customLabel,
          root: classes.labelRoot
        }}
      />
    ) : (null);
  }

  let updates = [];
  if (supplierKPI !== undefined) {
    updates.push(supplierKPI);


    // Ill always show the first one...  !!  The actual status of the Supplier KPI record
    // Ill always show the first one...
    // The rest of the history.. Ill only show the closed updates... Which should be the full period that kpi was open in that period.  Should always just be...   closed - opened.
    if (supplierKPI.updates !== undefined && supplierKPI.updates.length !== undefined && supplierKPI.updates.length > 0 && supplierKpiUpdates !== undefined && Object.keys(supplierKpiUpdates).length > 0) {
      let sortedUpdates = supplierKPI.updates;
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

        if (supplierKpiUpdates[kpiUpdateId] !== undefined &&
          supplierKpiUpdates[kpiUpdateId] !== null) {
          updates.push(supplierKpiUpdates[kpiUpdateId]);
        }
      });
    }
  }

  if( kpiUpdateForm !== null && kpiUpdateForm !== undefined ) {
    return (<div key={Utils.giveMeGuid()} style={{ padding: "20px" }}>
      {kpiUpdateForm}
    </div>)
  }

  return (
    <div key={Utils.giveMeGuid()} style={{ padding: "20px" }}>
      {alertBox}
      <h4>Supplier KPI ID: {supplierKPI.id}</h4>
      <GridContainer>
        {(supplierKPI.source_recruiters &&
          supplierKPI.source_recruiters !== null &&
          supplierKPI.source_recruiters.length > 0) ? (() => {
            let foundSourceRecruiters = new Array();
            let mapRecuriterId = new Map();

            supplierKPI.source_recruiters.forEach((recruiter_id) => {
              if (mapRecuriterId.has(recruiter_id) === false && recruitersMap[recruiter_id] !== undefined && recruitersMap[recruiter_id] !== null) {
                recruitersMap[recruiter_id].count = 1;
                mapRecuriterId.set(recruiter_id, recruitersMap[recruiter_id])
              } else {
                mapRecuriterId.get(recruiter_id).count += 1;
              }
            });

            mapRecuriterId.forEach((value, key, map) => {
              foundSourceRecruiters.push(value);
            });

            return (
              <GridContainer>
                <GridItem xs={12} sm={12} lg={12}>
                  <h4>Source Recruiters</h4>
                  <ReactTable
                    data={foundSourceRecruiters}
                    defaultSorted={[{
                      id: 'count',
                      desc: true,
                    }]}

                    columns={[
                      {
                        Header: "id",
                        accessor: "id",
                        sortable: false,
                        width: 60,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "Recruiter",
                        accessor: "name",
                        sortable: true,
                        width: 340,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "# Call References",
                        accessor: "count",
                        sortable: true,
                        width: 110,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "",
                        width: 20
                      }

                    ]}
                    defaultPageSize={foundSourceRecruiters.length}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                    filterable={false}
                    sortable={false}
                    className="-striped -highlight"
                  />
                </GridItem>
              </GridContainer>);


          })() : (<div style={{ padding: "20px" }}>No source recruiters logged for this Supplier KPI: {supplierKPI.id} </div>)}

        <GridItem>
          <br />
        </GridItem>

        {(supplierKPI.destination_recruiters &&
          supplierKPI.destination_recruiters !== null &&
          supplierKPI.destination_recruiters.length > 0) ? (() => {
            let foundDestinationRecruiters = new Array();
            let mapRecuriterId = new Map();

            supplierKPI.destination_recruiters.forEach((recruiter_id) => {
              if (mapRecuriterId.has(recruiter_id) === false && recruitersMap[recruiter_id] !== undefined && recruitersMap[recruiter_id] !== null) {
                recruitersMap[recruiter_id].count = 1;
                mapRecuriterId.set(recruiter_id, recruitersMap[recruiter_id])
              } else {
                mapRecuriterId.get(recruiter_id).count += 1;
              }
            });

            mapRecuriterId.forEach((value, key, map) => {
              foundDestinationRecruiters.push(value);
            });

            return (
              <div>
                <GridItem xs={12} sm={12} lg={12}>
                  <h4>Destination Recruiters</h4>
                  <ReactTable
                    data={foundDestinationRecruiters}
                    defaultSorted={[{
                      id: 'count',
                      desc: true,
                    }]}

                    columns={[
                      {
                        Header: "id",
                        accessor: "id",
                        sortable: false,
                        width: 60,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "Recruiter",
                        accessor: "name",
                        sortable: true,
                        width: 340,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "# Call References",
                        accessor: "count",
                        sortable: true,
                        width: 110,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "",
                        width: 20
                      }

                    ]}
                    defaultPageSize={foundDestinationRecruiters.length}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                    filterable={false}
                    sortable={false}
                    className="-striped -highlight"
                  />
                </GridItem>
              </div>);


          })() : (<div style={{ padding: "20px" }}>No destination recruiters logged for this Supplier KPI: {supplierKPI.id} </div>)}

      </GridContainer>


      <GridContainer style={{ padding: "20px" }}>
       
        <h5> Supplier KPI History of Updates: </h5>
        
        <GridContainer>

          {(loginStore.isIssaraManagement() && showDataCorrectionUI === true) ? (<GridItem xs={12} sm={12} lg={12} >
          <Button onClick={() => {
            if( ! selectedKPIs || selectedKPIs.length < 1 ) {
              
              setAlertBox(
                <SweetAlert
                  error
                  title="Oooops"
                  onConfirm={() =>{ 
                    setAlertBox(null)
                  }}
                  confirmBtnCssClass={classes.button + " " + classes.info}
                  
                >
                  {'Please select Supplier KPI Updates for deletion.'}
                </SweetAlert>
              );

            } else {
              setAlertBox(
                <SweetAlert
                  success
                  showConfirm
                  showCancel
                  onConfirm={() => {

                    dispatch(batchDeleteSupplierKpiUpdates(selectedKPIs, ()=>{ 
                      setTimeout(()=>{
                        setAlertBox(<SweetAlert
                          success
                          title="Supplier KPI Updates deleted"
                          onConfirm={() =>{ 
                            setAlertBox(null)
                          }}
                          confirmBtnCssClass={classes.button + " " + classes.info}
                          
                        >
                          {'You have successfully deleted those supplier kpi updates'}
                        </SweetAlert>);
                      }, -1);
                      
                    }, ()=>{
                      setAlertBox(<SweetAlert
                        error
                        title="Supplier KPI Updates deleted"
                        onConfirm={() =>{ 
                          setAlertBox(null)
                        }}
                        confirmBtnCssClass={classes.button + " " + classes.info}
                        
                      >
                        {'Error deleted those supplier kpi updates'}
                      </SweetAlert>);
                    }));

                                      }}
                  onCancel={() => setAlertBox(null)}
                  confirmBtnCssClass={classes.button + " " + classes.info}
                  cancelBtnCssClass={classes.button + " " + classes.default}
                  confirmBtnText="Confirm"
                  title={"Confirm Delete ?"}
                >
                  {'About to delete supplier kpi updates id(s): ' + JSON.stringify(selectedKPIs)}
                </SweetAlert>
              );
            }

          }}>Delete Selected Supplier KPI Updates</Button>
       
          </GridItem>  
        ) : (null)}

          
          {updates.map((supplierKpiUpdateItem, index) => {
            let status = Utils.getSupplierKpiStatusFromId(supplierKpiUpdateItem.status);
            const quality = supplierKpiUpdateItem.closed_at && supplierKpiUpdateItem.closed_quality.toLowerCase();
            let duration = "N/A";

            if (supplierKpiUpdateItem.closed_at !== undefined &&
              supplierKpiUpdateItem.closed_at !== null &&
              supplierKpiUpdateItem.opened_at !== undefined &&
              supplierKpiUpdateItem.opened_at !== null) {
              duration = parseInt(Math.round(moment.duration(new Date(supplierKpiUpdateItem.closed_at).getTime() - new Date(supplierKpiUpdateItem.opened_at).getTime()).asDays())) + " Days";
            } else if (supplierKpiUpdateItem.opened_at !== undefined && supplierKpiUpdateItem.opened_at !== null) {
              duration = parseInt(Math.round(moment.duration(new Date().getTime() - new Date(supplierKpiUpdateItem.opened_at).getTime()).asDays())) + " Days";
            }

            return (
              <GridItem xs={12} sm={12} md={6} lg={4} style={{ padding: "20px" }}>
                <Card key={index}>
                  <CardHeader style={{ paddingBottom: 10 }}>
                    
                    { ( loginStore.isIssaraManagement() && supplierKpiUpdateItem.supplier_kpi !== undefined && showDataCorrectionUI === true ) ? (<a style={{ cursor: "pointer" }} href target="__blank" onClick={()=>{
                      setKpiUpdateForm(<GridItem xs={12}><Card>
                          <CardHeader>
                        <h4>Copy values from Supplier KPI Update: {supplierKpiUpdateItem.id} to Supplier KPI: {supplierKpiUpdateItem.supplier_kpi}</h4>
                        <Button onClick={()=>{
                          setKpiUpdateForm(null);
                        }}>Cancel</Button>
                        </CardHeader>
                        <CardBody>
                        <SupplierKpiUpdateForm id={supplierKpiUpdateItem.supplier_kpi} supplierKpiCopy={{...supplierKpiUpdateItem}}
                            onUpdateKPI={()=>{
                              setKpiUpdateForm(null);
                              dispatch(fetchSupplierKPIs());
                              dispatch(fetchSupplierKpiUpdates());
                            }}/>
                          </CardBody>
                          </Card>
                          </GridItem>
                        );
                    }}>
                      View Update
                    </a>) : (null)
                    } 
                  
                    <div><br/></div>
                    {(
                      <div> <h4 style={{ marginTop: 0 }}> {(supplierKpiUpdateItem.supplier_kpi === undefined) ? ((<div>* KPI Current Status ⇢ </div>)) : (<div>{checkbox(supplierKpiUpdateItem.id)}&nbsp;&nbsp;Update #{supplierKpiUpdateItem.id}</div>)}</h4></div>
                    )}
                    <p className={[classes.preBlock, classes.updateHeaderSpan]}>Update Source: <span>{(supplierKpiUpdateItem.kpi_update_source !== null && supplierKpiUpdateItem.kpi_update_source !== undefined && supplierKpiUpdateItem.kpi_update_source !== "") ? supplierKpiUpdateItem.kpi_update_source : "N/A"}</span> </p>
                    <p className={[classes.preBlock, classes.updateHeaderSpan]}>status: <span style={{ fontWeight: 500, color: status !== 'Closed' ? 'black' : 'green' }}>{status}</span> </p>
                    
                    {quality &&
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}>quality: <span style={{ fontWeight: 500 }}>{quality}</span> </p>
                    }
                    
                    {supplierKpiUpdateItem.closed_at &&
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}>duration was open: <span style={{ fontWeight: 500 }}>{duration}</span></p>
                    }


                    {(supplierKpiUpdateItem.opened_at) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>opened_at: <span style={{ fontWeight: 500 }}>{supplierKpiUpdateItem.opened_at}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>opened_at: <span style={{ fontWeight: 500 }}>N/A</span></p>)}
                    {(supplierKpiUpdateItem.closed_at) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>closed_at: <span style={{ fontWeight: 500 }}>{supplierKpiUpdateItem.closed_at}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>closed_at: <span style={{ fontWeight: 500 }}>N/A</span></p>)}
                    {(supplierKpiUpdateItem.closed_quality) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>closed_quality: <span style={{ fontWeight: 500 }}>{Utils.shortenString(supplierKpiUpdateItem.closed_quality, 200)}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>closed_quality: <span style={{ fontWeight: 500 }}>N/A</span></p>)}
                    {(supplierKpiUpdateItem.overview_date) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>updated: <span style={{ fontWeight: 500 }}>{supplierKpiUpdateItem.overview_date}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>updated: <span style={{ fontWeight: 500 }}>N/A</span></p>)}

                    <HtmlTooltip title={supplierKpiUpdateItem.closed_notes} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>closed_notes:</span><div className={"cell-overflow"}><p className={classes.preBlock}>{Utils.shortenString(supplierKpiUpdateItem.closed_notes, 200)}</p></div></p>
                    </HtmlTooltip>

                    <br />
                    {(supplierKpiUpdateItem.remediation_documents_deadline) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>documents_deadline: <span style={{ fontWeight: 500 }}>{supplierKpiUpdateItem.remediation_documents_deadline}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>documents_deadline: <span style={{ fontWeight: 500 }}>N/A</span></p>)}
                    {(supplierKpiUpdateItem.remediation_payment_deadline) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>payment_deadline: <span style={{ fontWeight: 500 }}>{supplierKpiUpdateItem.remediation_payment_deadline}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>payment_deadline: <span style={{ fontWeight: 500 }}>N/A</span></p>)}
                    {(supplierKpiUpdateItem.systems_change_deadline) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>change_deadline: <span style={{ fontWeight: 500 }}>{supplierKpiUpdateItem.systems_change_deadline}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>change_deadline: <span style={{ fontWeight: 500 }}>N/A</span></p>)}

                    <HtmlTooltip title={supplierKpiUpdateItem.remediation_issara_recommendation} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>
                        recommendation:</span>
                        <div className={[classes.preBlock]}>{Utils.shortenString(supplierKpiUpdateItem.remediation_issara_recommendation, 200)}</div>
                      </p>
                    </HtmlTooltip>



                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_aligned}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>progress:</span><div className={"cell-overflow"}>{supplierKpiUpdateItem.remediation_aligned}</div></p>
                    </HtmlTooltip>

                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_progress}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>aligned:</span><div className={"cell-overflow"}>{supplierKpiUpdateItem.remediation_progress}</div></p>
                    </HtmlTooltip>

                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_business_steps_taken}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>steps:</span><div className={"cell-overflow"}>{Utils.shortenString(supplierKpiUpdateItem.remediation_business_steps_taken, 200)}</div></p>
                    </HtmlTooltip>

                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_business_steps_remaining}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>remaining:</span><div className={"cell-overflow"}>{Utils.shortenString(supplierKpiUpdateItem.remediation_business_steps_remaining, 200)}</div></p>
                    </HtmlTooltip>

                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_notes}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>remedation notes:</span><div className={"cell-overflow"}>{Utils.shortenString(supplierKpiUpdateItem.remediation_notes, 200)}</div></p>
                    </HtmlTooltip>

                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_action}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>remediation action:</span><div className={"cell-overflow"}>{Utils.shortenString(supplierKpiUpdateItem.remediation_action, 200)}</div></p>
                    </HtmlTooltip>

                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_notes}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>remmediation validation:</span><div className={"cell-overflow"}>{Utils.shortenString(supplierKpiUpdateItem.remediation_validation, 200)}</div></p>
                    </HtmlTooltip>

                    <HtmlTooltip title={<p className={classes.preBlock}>{supplierKpiUpdateItem.remediation_notes}</p>} interactive>
                      <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>remmediation results:</span><div className={"cell-overflow"}>{Utils.shortenString(supplierKpiUpdateItem.remediation_results, 200)}</div></p>
                    </HtmlTooltip>

                    <br />
                    {(supplierKpiUpdateItem.affected_workers) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>affected_workers: <span style={{ fontWeight: 500 }}>{supplierKpiUpdateItem.affected_workers}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>affected_workers: <span style={{ fontWeight: 500 }}>N/A</span></p>)}
                    <br />

                    {(supplierKpiUpdateItem.retaliation) ? <p className={[classes.preBlock, classes.updateHeaderSpan]}>retaliation: <span style={{ fontWeight: 500 }}>{(supplierKpiUpdateItem.retaliation === 1) ? "Yes" : "No"}</span></p> : (<p className={[classes.preBlock, classes.updateHeaderSpan]}>retaliation: <span style={{ fontWeight: 500 }}>N/A</span></p>)}
                    <br />


                  </CardHeader>
                  <CardBody>
                    <div title={JSON.stringify(supplierKpiUpdateItem)}>
                      <div className={classes.updateContainer}>
                        <div className={classes.updateCircle + ' kpi-update-circle'} style={{ borderColor: supplierKpiUpdateItem.status === supplier_kpi_update_status_closed ? 'green' : 'black' }}>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>
            )
          })}

        </GridContainer>

      </GridContainer>

      <GridContainer style={{ padding: "20px" }}>

        <h5>{(supplierKPI !== undefined && supplierKPI.calls !== undefined && supplierKPI.calls !== null) ? supplierKPI.calls.length : 0} Call(s) Referencing this KPI</h5>
        <GridContainer>
          {supplierKPI.calls && Object.keys(callsMap).length > 0 ? (supplierKPI.calls.sort((a, b) => {
            if (a < b) {
              return 1;
            }
            if (a > b) {
              return -1;
            }
            return 0;
          })).map((id, index) => {
            let call = callsMap[id];
            if (call === undefined || call === null) {
              return (null);
            }
            return <GridItem xs={12} sm={12} md={6} lg={4}>
              <Card>
                <CardBody>

                  <div>
                    <p><a target="_blank" href={`/admin/new-call?id=${call.id}`}>{call.id}</a></p>
                    <p><strong>Created:</strong> {(call.created !== null || call.created !== undefined) ? call.created : "N/A"}</p>
                    <p><strong>Interacted:</strong> {(call.interaction_date !== null || call.interaction_date !== undefined) ? call.interaction_date : "N/A"}</p>
                    <p><strong>Modified:</strong> {(call.last_modified !== null || call.last_modified !== undefined) ? call.last_modified : "N/A"}</p>
                    <p><strong>Issara Staff:</strong> {(call.issara_user !== null || call.issara_user !== undefined) ? call.issara_user : "N/A"}</p>
                    <p><strong>Client Nickname:</strong> {(call.client_nickname !== null || call.client_nickname !== undefined) ? call.client_nickname : "N/A"}</p>
                    <p><strong>Client Phone Number:</strong> {(call.client_phonenumber !== null || call.client_phonenumber !== undefined) ? call.client_phonenumber : "N/A"}</p>
                    <p><strong>Assigned Issara Staff:</strong> {(call.next_steps_issara_user !== null || call.next_steps_issara_user !== undefined) ? call.next_steps_issara_user : "N/A"}</p>
                    <p><strong>Call Level:</strong> {(call.kpi_level !== null || call.kpi_level !== undefined) ? call.kpi_level : "N/A"}</p>
                    <p><strong>Source Recrutier:</strong> {(call.source_recruiter_name !== null || call.source_recruiter_name !== undefined) ? call.source_recruiter_name : "N/A"}</p>
                    <p><strong>Destination Recrutier:</strong> {(call.destination_recruiter_name !== null || call.destination_recruiter_name !== undefined) ? call.destination_recruiter_name : "N/A"}</p>
                    <div className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>Description:</span>   <HtmlTooltip title={<p className={classes.preBlock} >{call.description}</p>} interactive><div className="cell-overflow">{Utils.shortenString(call.description, 200)}</div></HtmlTooltip> </div>
                    <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>Referal Notes:</span>   <HtmlTooltip title={<p className={classes.preBlock} >{call.referral_notes}</p>} interactive><div title={call.referral_notes} className="cell-overflow">{Utils.shortenString(call.referral_notes, 200)}</div></HtmlTooltip> </p>
                    <p className={[classes.preBlock, classes.updateHeaderSpan]}><span style={{ fontWeight: 500 }}>Next Steps:</span>   <HtmlTooltip title={<p className={classes.preBlock} >{call.next_steps}</p>} interactive><div title={call.next_steps} className="cell-overflow">{Utils.shortenString(call.next_steps, 200)}</div></HtmlTooltip> </p>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          }) : (null)}

        </GridContainer>
      </GridContainer>


    </div>
  );

}

import React, { useState, useEffect, useRef } from "react";
import Tooltip from '@material-ui/core/Tooltip';

import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";
import Datetime from "react-datetime";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from '@material-ui/core/CircularProgress';

import Pagination from "components/Pagination/Pagination2.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
//import CardHeader from "components/Card/CardHeader.js";
//import CardBody from "components/Card/CardBody.js";

import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import RecruitersDropdown from '../../components/ilmdb/RecruitersDropdown';
import SupplierKPIModal from "../suppliers/SupplierKPIModal"

import { fetchSupplierKpiUpdates, fetchSupplierKPIs } from "redux/actions/SupplierActions.js";

import { fetchRecruiters } from "redux/actions/RecruiterActions.js";

import ComponentToPrint from "./ComponentToPrint";
import { useReactToPrint } from 'react-to-print';
import Utils from "../../services/utils.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { fetchAllCalls } from "redux/actions/CallActions.js";


const customStyles = {
  ...styles,
  largeStatContainer: {
    paddingTop: '6.3rem',
    paddingBottom: '6.3rem',
    margin: '10px 0 0 0'
  },
  largeStatNumber: {
    textAlign: 'center',
    fontSize: '3.5rem',
    fontWeight: 500,
    minHeight: '2.5rem'
  },
  largeStatName: {
    textAlign: 'center',
    fontSize: '1.3rem',
    fontWeight: 400
  },
  smallStatContainer: {
    paddingTop: '1.8rem',
    paddingBottom: '1rem',
    margin: '0 0 1rem 0'
  },
  smallStatNumber: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 600,
    minHeight: '1.65rem'
  },
  smallStatName: {
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: 400,
  },
  outreachTable: {
    padding: '0.7rem 1rem 0.7rem 1rem',
    margin: '10px 0 1rem 0'
  },
  marginTopZero: {
    marginTop: 0,
  },
  marginBottom: {
    marginBottom: '1rem',
  },
  center: {
    textAlign: 'center'
  },
  marginAuto: {
    margin: 'auto'
  },
  gaugeBox: {
    minHeight: '10rem',
    margin: 'auto'
  },
  gaugeTableText: {
    fontSize: '1.2rem',
    fontWeight: 500
  },
  button: {
    padding: 0,
    margin: 0
  }
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



export default function RecruiterKpiDashboard(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID = 3;

  const [init, setInit] = useState(false);


  const recruitersMap = useSelector(state => state.recruitersReducer.recruitersMap);


  const supplierKPIs = useSelector((state) => { return state.suppliersReducer.supplierKPIs });
  const fetchingSupplierKPIs = useSelector((state) => { return state.suppliersReducer.fetchingSupplierKPIs });

  const [filteredOpenSupplierKpis, setFilteredOpenSupplierKpis] = useState({})
  const [filteredClosedSupplierKpis, setFilteredClosedSupplierKpis] = useState({})

  // FILTERS
  const [filters, setFilters] = useState({
    recruiters: null,
    startTime: null,
    endTime: null,
    search: ""
  });

  const [modal, setModal] = useState((null));


  const handleViewKpi = (id) => {
    setModal((<SupplierKPIModal open={true} value={id} onClose={() => setModal((null))} />));
  }



  const viewKpiButton = (id) => {
    return (
      <Button
        simple
        color="info"
        value={id}
        className={classes.button}
        onClick={e => handleViewKpi(id)}
      >
        <VisibilityIcon />
      </Button>
    )
  }




  const filterMetrics = () => {
    // FILTER SUPPLIER KPI UPDATES


    if (supplierKPIs) {
      // FILTER OPEN SUPPLIER KPIS
      const supplierKpisToBeFiltered = supplierKPIs
      const supplierOpenKpisFiltered = []
      const supplierClosedKpisFiltered = []

      const openRecruiterKPIMap = new Map();
      const closedRecruiterKPIMap = new Map();


      Object.keys(supplierKpisToBeFiltered).map(key => {
        const supplierKpi = supplierKpisToBeFiltered[key]

        if (!(supplierKpi.source_recruiters &&
          supplierKpi.source_recruiters !== null &&
          supplierKpi.source_recruiters.length > 0) && !(supplierKpi.destination_recruiters &&
            supplierKpi.destination_recruiters !== null &&
            supplierKpi.destination_recruiters.length > 0)) {
          return;
        }


        let call_count = (supplierKpi.calls !== undefined && supplierKpi.calls !== null && supplierKpi.calls.length !== undefined) ? supplierKpi.calls.length : 0;

        if (
          supplierKpi.status !== SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID
          && (!filters.startTime || new Date(supplierKpi.opened_at) >= new Date(filters.startTime))
          && (!filters.endTime || new Date(supplierKpi.opened_at) <= new Date(filters.endTime))
        ) {

          if (supplierKpi.source_recruiters) {
            supplierKpi.source_recruiters.forEach((recruiter_id) => {
              let key = "" + supplierKpi.id + ":" + recruiter_id;
              if (!openRecruiterKPIMap.has(key)) {
                openRecruiterKPIMap.set(key);
              } else {
                return;
              }
              if (!filters.recruiters || filters.recruiters.includes(recruiter_id)) {
                supplierOpenKpisFiltered.push({ ...supplierKpi, call_count, recruiter_name: recruitersMap[recruiter_id].name, recruiter: recruitersMap[recruiter_id], recruiter_role: "Source" });
              }
            });
          }

          if (supplierKpi.destination_recruiters) {
            supplierKpi.destination_recruiters.forEach((recruiter_id) => {
              let key = "" + supplierKpi.id + ":" + recruiter_id;
              if (!openRecruiterKPIMap.has(key)) {
                openRecruiterKPIMap.set(key);
              } else {
                return;
              }

              if (!filters.recruiters || filters.recruiters.includes(recruiter_id)) {
                supplierOpenKpisFiltered.push({ ...supplierKpi, call_count, recruiter_name: recruitersMap[recruiter_id].name, recruiter: recruitersMap[recruiter_id], recruiter_role: "Destination" });
              }

            });
          }

        } else if (
          supplierKpi.status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID
          && (!filters.startTime || new Date(supplierKpi.opened_at) >= new Date(filters.startTime))
          && (!filters.endTime || new Date(supplierKpi.opened_at) <= new Date(filters.endTime))
        ) {

          if (supplierKpi.source_recruiters) {
            supplierKpi.source_recruiters.forEach((recruiter_id) => {
              let key = "" + supplierKpi.id + ":" + recruiter_id;
              if (!closedRecruiterKPIMap.has(key)) {
                closedRecruiterKPIMap.set(key);
              } else {
                return;
              }

              if (!filters.recruiters || filters.recruiters.includes(recruiter_id)) {
                supplierClosedKpisFiltered.push({ ...supplierKpi, call_count, recruiter_name: recruitersMap[recruiter_id].name, recruiter: recruitersMap[recruiter_id], recruiter_role: "Source" });
              }
            });
          }

          if (supplierKpi.destination_recruiters) {
            supplierKpi.destination_recruiters.forEach((recruiter_id) => {
              let key = "" + supplierKpi.id + ":" + recruiter_id;
              if (!closedRecruiterKPIMap.has(key)) {
                closedRecruiterKPIMap.set(key);
              } else {
                return;
              } if (!filters.recruiters || filters.recruiters.includes(recruiter_id)) {
                supplierClosedKpisFiltered.push({ ...supplierKpi, call_count, recruiter_name: recruitersMap[recruiter_id].name, recruiter: recruitersMap[recruiter_id], recruiter_role: "Destination" });
              }

            });
          }
        }
      })

      if (filters.search !== undefined && filters.search.length > 1) {
        let filteredSearchData = Utils.findStringInObjectFields(supplierOpenKpisFiltered, filters.search, ["id",
          "supplier_name",
          "recruiter_name",
          "recruiter_role",
          "category",
          "description",
          "level",
          "opened_at",
          "affected_workers",
          "status_name",
          "call_count",
          "source_recruiter_count",
          "destination_recruiter_count",
          "remediation_notes",
          "total_update_count"
        ]);
        setFilteredOpenSupplierKpis(filteredSearchData);
      } else {
        setFilteredOpenSupplierKpis(supplierOpenKpisFiltered);
      }

      if (filters.search !== undefined && filters.search.length > 1) {
        let filteredSearchData = Utils.findStringInObjectFields(supplierClosedKpisFiltered, filters.search, ["id",
          "supplier_name",
          "recruiter_name",
          "recruiter_role",
          "category",
          "description",
          "level",
          "opened_at",
          "affected_workers",
          "status_name",
          "call_count",
          "source_recruiter_count",
          "destination_recruiter_count",
          "remediation_notes",
          "total_update_count"
        ]);
        setFilteredClosedSupplierKpis(filteredSearchData);
      } else {
        setFilteredClosedSupplierKpis(supplierClosedKpisFiltered);
      }

    }

  }

  useEffect(() => {
    if (init === false) {
      setInit(true);
      dispatch(fetchSupplierKPIs());
      dispatch(fetchSupplierKpiUpdates());
      dispatch(fetchRecruiters());
      dispatch(fetchAllCalls());
    }
  }, []);

  useEffect(() => {
    filterMetrics();
  }, [filters, supplierKPIs]);

  let displayNode = (
    <div>

      {modal}

      <GridContainer className={classes.marginBottom}>

        <GridItem xs={6} sm={4} md={3} lg={3}>
          <RecruitersDropdown multipleselect={true} value={filters.recruiters} onSelect={recruiters => setFilters({ ...filters, recruiters: (recruiters.length < 1) ? null : recruiters })} />
        </GridItem>
        <GridItem xs={6} sm={2} lg={2} xl={1}>
          <InputLabel className={classes.label}>Between</InputLabel>
          <FormControl fullWidth>
            <Datetime
              value={filters.startTime}
              timeFormat={false}
              inputProps={{ placeholder: "Start" }}
              onChange={date => typeof date === 'object' && setFilters({ ...filters, startTime: date })}
              closeOnSelect={true}
            />
          </FormControl>
        </GridItem>
        <GridItem xs={6} sm={2} lg={2} xl={1}>
          <InputLabel className={classes.label}>And</InputLabel>
          <FormControl fullWidth>
            <Datetime
              value={filters.endTime}
              timeFormat={false}
              inputProps={{ placeholder: "End" }}
              onChange={date => typeof date === 'object' && setFilters({ ...filters, endTime: date })}
              closeOnSelect={true}
            />
          </FormControl>
        </GridItem>
        <GridItem xs={12} sm={2} lg={2} xl={2}>
          <FormControl justify="center">
            <Button
              color="rose"
              onClick={
                () => setFilters({
                  recruiters: null,
                  startTime: null,
                  endTime: null
                })
              }> Reset all </Button>
          </FormControl>
        </GridItem>
      </GridContainer>
      <h3 className={classes.center}>Open Supplier KPIs Listed By Referenced Recruiters </h3>
      <GridContainer>
        <GridItem xs={12}>
          <h4>Search Results(Found: {filteredOpenSupplierKpis ? filteredOpenSupplierKpis.length : 0})</h4>
        </GridItem>
        <GridItem xs={12} sm={12} lg={12}>
          <FormControl fullWidth>
            <CustomInput
              id={"search_text"}
              labelText={"Search (Fuzzy Search Across all fields)"}
              isTextArea={false}
              formControlProps={{
                fullWidth: true
              }}
              value={filters.search}
              inputProps={{
                onChange: (e) => {
                  setFilters({ ...filters, search: (e.target.value === undefined) ? "" : e.target.value })
                }
              }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <br />
        </GridItem>
        <GridItem xs={12}>
          <Card className={classes.outreachTable}>
            {(!filteredOpenSupplierKpis || !filteredOpenSupplierKpis.map) ? <CircularProgress /> : <ReactTable PaginationComponent={Pagination}
              key={Utils.giveMeGuid()}
              id={Utils.giveMeGuid()}
              data={filteredOpenSupplierKpis}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}


              defaultSorted={[{
                id: 'opened_at',
                desc: true,
              }]}
              defaultPageSize={5}
              className="-striped -highlight"
              loading={fetchingSupplierKPIs}

              columns={[
                {
                  Header: "Supplier KPI ID",
                  accessor: "id",
                  width: 140,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Recruiter",
                  accessor: "recruiter_name",
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Role",
                  accessor: "recruiter_role",
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Supplier",
                  accessor: "supplier_name",
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Category",
                  accessor: "category",
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Description",
                  accessor: "description",
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Level",
                  accessor: "level",
                  maxWidth: 70,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "# Affected",
                  accessor: "affected_workers",
                  width: 110,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Remediation",
                  accessor: "remediation_issara_recommendation",
                  width: 100,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Opened",
                  accessor: "opened_at",
                  maxWidth: 90,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Updated",
                  accessor: "overview_date",
                  width: 90,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Status",
                  accessor: "status",
                  width: 110,
                  Cell: props => (
                    <HtmlTooltip title={Utils.getSupplierKpiStatusFromId(props.value)} interactive>
                      <div className="cell-overflow">
                        {Utils.getSupplierKpiStatusFromId(props.value)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "",
                  sortable: false,
                  accessor: "id",
                  width: 30,
                  Cell: props => (
                    viewKpiButton(props.value)
                  ),
                }
              ]}
            />}
          </Card>
        </GridItem>
      </GridContainer>

      <h3 className={classes.center}> Closed Supplier KPIs Listed By Referenced Recruiters</h3>
      <GridContainer>
        <GridItem xs={12}>
          <h4>Search Results(Found: {filteredClosedSupplierKpis ? filteredClosedSupplierKpis.length : 0})</h4>
        </GridItem>
        <GridItem xs={12}>
          <Card className={classes.outreachTable}>
            {(!filteredClosedSupplierKpis || !filteredClosedSupplierKpis.map) ? <CircularProgress /> : <ReactTable PaginationComponent={Pagination}
              key={Utils.giveMeGuid()}
              id={Utils.giveMeGuid()}
              loading={(!filteredClosedSupplierKpis || !filteredClosedSupplierKpis.map)}
              data={filteredClosedSupplierKpis}
              defaultSorted={[{
                id: 'closed_at',
                desc: true,
              }]}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}


              defaultPageSize={5}
              className="-striped -highlight"
              loading={fetchingSupplierKPIs}
              columns={[
                {
                  Header: "Id",
                  accessor: "id",
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Recruiter",
                  accessor: "recruiter_name",
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Role",
                  accessor: "recruiter_role",
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Supplier",
                  accessor: "supplier_name",
                  width: 140,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Kpi Id",
                  accessor: "supplier_kpi",
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)

                },
                {
                  Header: "Category",
                  accessor: "category",
                  width: 140,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Description",
                  accessor: "description",
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Level",
                  accessor: "level",
                  maxWidth: 70,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                // {
                //   Header: "# Affected",
                //   accessor: "affected_workers",
                //   width: 110
                // },
                {
                  Header: "Opened",
                  accessor: "opened_at",
                  width: 90,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Closed",
                  accessor: "closed_at",
                  width: 90,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Quality",
                  accessor: "closed_quality",
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Talking Points",
                  accessor: "remediation_notes",
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Rationale",
                  accessor: "closed_notes",
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Status",
                  accessor: "status",
                  width: 110,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "",
                  sortable: false,
                  accessor: "id",
                  width: 30,
                  Cell: props => (
                    viewKpiButton(props.value)
                  ),
                }
              ]}
            />}
          </Card>
        </GridItem>
      </GridContainer>


      {/*<h3 className={classes.center}>Response History </h3>
      <GridContainer>
        <GridItem xs={12}>
          <BusinessResponseInteractions />
        </GridItem>
      </GridContainer> */}
    </div>
  );

  const componentRef = useRef(this);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div style={{ display: "none" }}>
        <ComponentToPrint key={Utils.giveMeGuid()} ref={componentRef} render={() => {
          return (displayNode);
        }} />
      </div>
      <Button onClick={handlePrint}>Print Report</Button>
      {displayNode}
    </div>);
}

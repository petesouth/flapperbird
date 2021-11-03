import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import Datetime from "react-datetime";

import Pagination from "components/Pagination/Pagination2.js";

import ReactTable from "react-table-6";



import Tooltip from '@material-ui/core/Tooltip';


// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import CustomInput from "components/CustomInput/CustomInput.js";

import Button from "components/CustomButtons/Button.js";
import VisibilityIcon from '@material-ui/icons/Visibility';

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox"

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";

import SupplierKPIModal from "./SupplierKPIModal"

import Utils from "../../services/utils.js";
import SupplierKpiDetailsSubPanel from "./SupplierKpiDetailsSubPanel.js";

import loginStore from "../../redux/stores/LoginStore"
import moment from 'moment';

// style
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import { fetchSupplierKPIs, fetchSupplierKpiUpdates } from "../../redux/actions/SupplierActions.js";
import { fetchRecruiters } from "../../redux/actions/RecruiterActions.js";

import { fetchAllCalls } from "../../redux/actions/CallActions.js";

import ReactExport from "react-export-excel";
import { CircularProgress } from "@material-ui/core";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const customStyle = {
  ...customCheckboxRadioSwitch,
  checkRoot: {
    padding: 0
  },
  labelRoot: {
    margin: 0
  },
  button: {
    padding: 0,
    margin: 0
  },
  center: {
    textAlign: 'center'
  },

}

const useStyles = makeStyles(customStyle);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);


class DownloadSupplierKpiList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataset: props.dataset
    }
  }

  /*id
supplier_name
category
description
level
remediation_notes
opened_at
affected_workers
status_name
call_count
source_recruiter_count
destination_recruiter_count
total_update_count
*/

  render() {
    return (
      <GridContainer>
        <GridItem>
          <ExcelFile filename={"supplier_kpis"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="supplier_kpis">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="supplier_name" value="supplier_name" />
              <ExcelColumn label="category" value="category" />
              <ExcelColumn label="description" value="description" />
              <ExcelColumn label="level" value="level" />
              <ExcelColumn label="remediation_notes" value="remediation_notes" />
              <ExcelColumn label="opened_at" value="opened_at" />
              <ExcelColumn label="affected_workers" value="affected_workers" />
              <ExcelColumn label="status_name" value="status_name" />
              <ExcelColumn label="call_count" value="call_count" />
              <ExcelColumn label="source_recruiter_count" value="source_recruiter_count" />
              <ExcelColumn label="destination_recruiter_count" value="destination_recruiter_count" />
              <ExcelColumn label="total_update_count" value="total_update_count" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>

      </GridContainer>
    );
  }
}



export default function SupplierKPIsList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const supplierKpiSearchColumns = ["id",
    "affected_workers",
    "calls",
    "category",
    "closed_at",
    "closed_notes",
    "closed_quality",
    "description",
    "level",
    "opened_at",
    "overview_date",
    "remediation_action",
    "remediation_aligned",
    "remediation_business_steps_remaining",
    "remediation_business_steps_taken",
    "remediation_documents_deadline",
    "remediation_documents_owed",
    "remediation_documents_provided",
    "remediation_issara_recommendation",
    "remediation_notes",
    "remediation_owed_baht",
    "remediation_owed_kyat",
    "remediation_owed_ringitt",
    "remediation_owed_usd",
    "remediation_paid_baht",
    "remediation_paid_kyat",
    "remediation_paid_ringitt",
    "remediation_paid_usd",
    "remediation_payment_deadline",
    "remediation_progress",
    "remediation_results",
    "remediation_validation",
    "remediation_workers_paid",
    "retaliation",
    "status",
    "status_name",
    "supplier",
    "supplier_kpi",
    "supplier_name",
    "systems_change_aligned",
    "systems_change_business_steps_remaining",
    "systems_change_business_steps_taken",
    "systems_change_deadline",
    "systems_change_issara_recommendation",
    "systems_change_progress",
    "call_count",
    "source_recruiter_count",
    "destination_recruiter_count",
    "total_update_count"];

  const recruitersMap = useSelector(state => state.recruitersReducer.recruitersMap);
  const callsMap = useSelector(state => state.workerVoiceCaseCallsReducer.callsMap);

  const supplierKPIs = useSelector(state => state.suppliersReducer.supplierKPIs);
  const fetchingSupplierKPIs = useSelector(state => state.suppliersReducer.fetchingSupplierKPIs);

  const supplierKpiUpdates = useSelector(state => state.suppliersReducer.supplierKpiUpdates);

  const [searchFilteredSupplierKPIsArray, setSearchFilteredSupplierKPIsArray] = useState([]);
  const [searchFilteredSupplierKPIsHistoryArray, setSearchFilteredSupplierKPIsHistoryArray] = useState([]);
  const [selectedKPIs, setSelectedKPIs] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: null,
    startTime: null,
    endTime: null,
    showClosed: false,
    search: "",
    searchhistory: ""
  });

  const filterSupplierKPIUpdates = () => {
    const filteredSupplierKPIsHistoryArray = []

    Object.keys(supplierKpiUpdates).forEach(key => {
      const item = supplierKpiUpdates[key]

      // Filter by supplier
      if (filters.suppliers) {
        if (filters.suppliers.includes(item.supplier) === false) {
          return // skip this business response as no suppliers matched
        }
      }

      // Filter by startTime
      if (filters.startTime) {
        if (new Date(item.opened_at).getTime() < filters.startTime._d.getTime()) {
          return // skip this business response
        }
      }

      // Filter by endTime
      if (filters.endTime) {
        if (filters.endTime._d.getTime() < new Date(item.opened_at).getTime()) {
          return // skip this business response
        }
      }

      // Show only open KPIs
      if (filters.showClosed === false && (item.status === 3 || item.status === 4)) {
        return // skip this business response
      } else if (filters.showClosed === true && (item.status !== 3 && item.status !== 4)) {
        return // skip this business response
      }

      filteredSupplierKPIsHistoryArray.push({
        ...item,
        status_name: Utils.getSupplierKpiStatusFromId(item.status),
        call_count: ((item.calls !== undefined && item.calls !== null && item.calls.length !== undefined)
          ? item.calls.length : 0),
        source_recruiter_count: ((item.source_recruiters !== undefined && item.source_recruiters !== null && item.source_recruiters.length !== undefined)
          ? item.source_recruiters.length : 0),
        destination_recruiter_count: ((item.destination_recruiters !== undefined && item.destination_recruiters !== null && item.destination_recruiters.length !== undefined)
          ? item.destination_recruiters.length : 0),
        total_update_count: (item.updates !== undefined && item.updates !== null && item.updates.length !== undefined) ? item.updates.length : 0
      });
    });


    if (filters.searchhistory !== undefined && filters.searchhistory.length > 3) {
      let filteredSearchData = Utils.findStringInObjectFields(filteredSupplierKPIsHistoryArray, filters.searchhistory, supplierKpiSearchColumns);
      setSearchFilteredSupplierKPIsHistoryArray(filteredSearchData);
    } else {
      setSearchFilteredSupplierKPIsHistoryArray(filteredSupplierKPIsHistoryArray);
    }
  }


  const filterSupplierKPIs = () => {
    const filteredSupplierKPIsArray = []

    Object.keys(supplierKPIs).forEach(key => {
      const item = supplierKPIs[key]

      // Filter by supplier
      if (filters.suppliers) {
        if (filters.suppliers.includes(item.supplier) === false) {
          return // skip this business response as no suppliers matched
        }
      }

      // Filter by startTime
      if (filters.startTime) {
        if (new Date(item.opened_at).getTime() < filters.startTime._d.getTime()) {
          return // skip this business response
        }
      }

      // Filter by endTime
      if (filters.endTime) {
        if (filters.endTime._d.getTime() < new Date(item.opened_at).getTime()) {
          return // skip this business response
        }
      }

      // Show only open KPIs
      if (filters.showClosed === false && (item.status === 3 || item.status === 4)) {
        return // skip this business response
      } else if (filters.showClosed === true && (item.status !== 3 && item.status !== 4)) {
        return // skip this business response
      }

      filteredSupplierKPIsArray.push({
        ...item,
        status_name: Utils.getSupplierKpiStatusFromId(item.status),
        call_count: ((item.calls !== undefined && item.calls !== null && item.calls.length !== undefined)
          ? item.calls.length : 0),
        source_recruiter_count: ((item.source_recruiters !== undefined && item.source_recruiters !== null && item.source_recruiters.length !== undefined)
          ? item.source_recruiters.length : 0),
        destination_recruiter_count: ((item.destination_recruiters !== undefined && item.destination_recruiters !== null && item.destination_recruiters.length !== undefined)
          ? item.destination_recruiters.length : 0),
        total_update_count: (item.updates !== undefined && item.updates !== null && item.updates.length !== undefined) ? item.updates.length : 0
      });
    });


    if (filters.search !== undefined && filters.search.length > 3) {
      let filteredSearchData = Utils.findStringInObjectFields(filteredSupplierKPIsArray, filters.search, supplierKpiSearchColumns);
      setSearchFilteredSupplierKPIsArray(filteredSearchData);
    } else {
      setSearchFilteredSupplierKPIsArray(filteredSupplierKPIsArray);
    }
  }

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

  const handleViewButtonClick = (id) => {
    setModal({
      open: true,
      id: id
    })
  }

  const checkbox = (kpi_id) => {
    return (
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
    )
  }

  const viewButton = (kpi_id) => {
    return (
      <Button
        title={"View: " + kpi_id}
        simple
        color="info"
        value={kpi_id}
        className={classes.button}
        onClick={(e) => handleViewButtonClick(e.currentTarget.value)}
      >
        <VisibilityIcon />
      </Button>
    )
  }

  const subComponent = (data) => (
    <GridContainer style={{ width: '100%', margin: 0, border: '1px solid #eeeeee' }}>
      
      <GridItem>
        <p style={{ margin: 0 }}> <b> Updated: </b> {moment(data.overview_date).format('LL')} </p>
      </GridItem>
      <GridItem>
        <p style={{ margin: 0 }}> <b> Opened since: </b> {moment(data.opened_at).format('LL')} </p>
      </GridItem>
      <GridItem>
        <p style={{ margin: 0 }}> <b> Closed since: </b> {moment(data.closed_at).format('LL')} </p>
      </GridItem>
      <GridItem>
        <p style={{ margin: 0 }}> <b> Affected workers: </b> {data.affected_workers} </p>
      </GridItem>
      {data.remediation_notes &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Remediation Issues: </b> {data.remediation_notes} </p>
        </GridItem>
      }
      {data.remediation_action &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Remediation Action: </b> {data.remediation_action} </p>
        </GridItem>
      }
      {data.remediation_validation &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Remediation Validation: </b> {data.remediation_validation} </p>
        </GridItem>
      }
      {data.remediation_results &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Remediation Results: </b> {data.remediation_results} </p>
        </GridItem>
      }
    </GridContainer>
  )


  useEffect(() => {
    dispatch(fetchSupplierKPIs());
    dispatch(fetchSupplierKpiUpdates()); // In support of Modal Panel.
    dispatch(fetchRecruiters());
    dispatch(fetchAllCalls());

  }, []);

  useEffect(() => {
    filterSupplierKPIs()
    filterSupplierKPIUpdates();
  }, [supplierKpiUpdates, filters]);

  const handleClickUpdateKPIs = () => {
    const ids = selectedKPIs.toString()
    props.history.push(`/admin/supplier-kpi-bulk-update?ids=${ids}`)
  }

  if ((supplierKPIs === null || supplierKPIs === undefined || supplierKPIs.length < 1) ||
    (supplierKpiUpdates === null || supplierKpiUpdates === undefined || supplierKpiUpdates.length < 1)) {
    return (<div>
      <CircularProgress />
    </div>);
  }

  return (
    <GridContainer>
      <SupplierKPIModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} historical={modal.historical} onHistorySelect={(historicalModalData) => setModal({ ...modal, ...historicalModalData })} />


      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <GridContainer justify="center">
              <GridItem xs={6} sm={4} lg={4} xl={4}>
                <SuppliersDropdown multipleselect={true} value={filters.suppliers} onSelect={(supplier) => setFilters({ ...filters, suppliers: supplier })} />
              </GridItem>
              <GridItem xs={6} sm={2} lg={2} xl={1}>
                <InputLabel className={classes.label}>Between</InputLabel>
                <FormControl fullWidth>
                  <Datetime
                    value={filters.startTime}
                    timeFormat={false}
                    inputProps={{ placeholder: "Start" }}
                    onChange={date => typeof date === 'object' && setFilters({ ...filters, startTime: date })}
                    dateFormat='YYYY-MM'
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
                    dateFormat='YYYY-MM'
                    closeOnSelect={true}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={2} lg={2} xl={2}>
                <FormControl justify="center">
                  <Button
                    color="rose"
                    onClick={
                      () =>{
                        
                        setFilters({
                        ...filters,
                        suppliers: null,
                        startTime: null,
                        endTime: null
                      });
                      dispatch(fetchSupplierKPIs());
                      dispatch(fetchSupplierKpiUpdates());
                    }
                      
                    }> Reset all </Button>
                </FormControl>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      {loginStore.isIssaraManagement() === true &&
        <GridItem>
          {(searchFilteredSupplierKPIsArray !== undefined && searchFilteredSupplierKPIsArray.length !== undefined && searchFilteredSupplierKPIsArray.length > 0) ? (<DownloadSupplierKpiList dataset={searchFilteredSupplierKPIsArray} />) : (null)}
        </GridItem>
      }
      <GridContainer justify="flex-end">
        <FormControlLabel
          control={
            <Checkbox
              tabIndex={-1}
              checked={filters.showClosed}
              onClick={() => {
                setFilters({ ...filters, showClosed: !filters.showClosed })
              }}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot
              }}
            />
          }
          label="&nbsp; Show Closed"
        />
      </GridContainer>



      {/* Current Supplier KPI List*/}
      <GridItem xs={12}>
        <h4 className={classes.center}>Supplier KPIs</h4>

        <Card style={{ marginTop: 0 }}>
          <CardHeader>
                <h4>Search Results (Found: {(searchFilteredSupplierKPIsArray !== undefined &&
                  searchFilteredSupplierKPIsArray.length !== undefined) ? searchFilteredSupplierKPIsArray.length : 0})</h4>
         
          </CardHeader>
          <CardBody>
            <GridItem xs={12} sm={12} lg={12}>
            <HtmlTooltip title={"You can enter a text or number thats used in the object.  Call IDs Also work. (You'll get the supplier KPIs that have that Call ID in the drop down panel or info view"} interactive>
              <div className="cell-overflow">
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
              </div>
            </HtmlTooltip>
             
            </GridItem>
            <GridItem>
              <br />
            </GridItem>

            {(filters.showClosed === false) ? (<GridItem xs={12} sm={12} lg={12}>
              <Card>
                <CardBody>
                  <ReactTable PaginationComponent={Pagination} PaginationComponent={Pagination}
                    data={searchFilteredSupplierKPIsArray}
                    defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                    filterable={true}

                    collapseOnDataChange={false}
                    SubComponent={(row) => (<SupplierKpiDetailsSubPanel supplierKPI={supplierKPIs[row.original.id]}
                      recruitersMap={recruitersMap}
                      callsMap={callsMap}
                      supplierKpiUpdates={supplierKpiUpdates} />)}
                    defaultSorted={[{
                      id: 'opened_at',
                      desc: true,
                    }]}
                    columns={[
                      {
                        Header: "",
                        sortable: false,
                        accessor: "id",
                        width: 40,
                        Cell: props => (
                          checkbox(props.value)
                        ),
                        getProps: (state, rowInfo, column) => {
                          return {
                            style: {
                              textAlign: 'center',
                            },
                          };
                        },
                      },
                      {
                        Header: "id",
                        accessor: "id",
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
                        Header: "Supplier",
                        accessor: "supplier_name",
                        width: 120,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "Category",
                        accessor: "category",
                        width: 150,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {Utils.shortenString(props.value, 60)}
                            </div>
                          </HtmlTooltip>)
                      },
                      {
                        Header: "Description",
                        accessor: "description",
                        width: 220,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {Utils.shortenString(props.value, 60)}
                            </div>
                          </HtmlTooltip>)
                      },
                      {
                        Header: "Level",
                        accessor: "level",
                        width: 60
                      },
                      {
                        Header: "Opened At",
                        accessor: "opened_at",
                        width: 100
                      },
                      // {
                      //   Header: "Remediation",
                      //   accessor: "remediation",
                      // },
                      // {
                      //   Header: "Systems Change",
                      //   accessor: "systems_change",
                      // },
                      {
                        Header: "Affected",
                        accessor: "affected_workers",
                        width: 90
                      },
                      // {
                      //   Header: "Law Violated",
                      //   accessor: "law",
                      // },
                      {
                        Header: "Status",
                        accessor: "status_name",
                        width: 90,
                      },
                      {
                        Header: "Updates",
                        accessor: "total_update_count",
                        width: 90
                      },{ 
                        Header: "Call #",
                        accessor: "call_count",
                        width: 90

                      },
                      { 
                        Header: "Calls",
                        accessor: "calls",
                        width: 290,
                        Cell:((props)=>{
                          return <div>
                            {(props.value) ? props.value.map((item)=> {
                            return (<span style={{paddingLeft: "4px"}}>{"("}<a title={"Call Id: " + item} href={"/admin/new-call?id=" + item} target="__blank">{item}</a>{")"}</span>)
                            }) : "-"}
                        </div> })

                      },
                      {
                        Header: "",
                        sortable: false,
                        filterable: false,
                        accessor: "id",
                        width: 60,
                        Cell: props => (
                          viewButton(props.value)
                        ),
                      }
                    ]}
                    defaultPageSize={5}
                    showPaginationTop={false}
                    showPaginationBottom={true}
                    loading={fetchingSupplierKPIs === true}
                    className="-striped -highlight"
                  />
                </CardBody>
              </Card>

            </GridItem>) : (<GridItem xs={12} sm={12} lg={12}>
              <Card>
                <CardBody>
                  <ReactTable PaginationComponent={Pagination} PaginationComponent={Pagination}
                    data={searchFilteredSupplierKPIsArray}
                    defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                    filterable={true}

                    collapseOnDataChange={false}
                    SubComponent={(row) => (<SupplierKpiDetailsSubPanel supplierKPI={supplierKPIs[row.original.id]}
                      recruitersMap={recruitersMap}
                      callsMap={callsMap}
                      supplierKpiUpdates={supplierKpiUpdates} />)}
                    defaultSorted={[{
                      id: 'closed_at',
                      desc: true,
                    }]}
                  
                    columns={[
                      {
                        Header: "",
                        sortable: false,
                        accessor: "id",
                        width: 40,
                        Cell: props => (
                          checkbox(props.value)
                        ),
                        getProps: (state, rowInfo, column) => {
                          return {
                            style: {
                              textAlign: 'center',
                            },
                          };
                        },
                      },
                      {
                        Header: "id",
                        accessor: "id",
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
                        Header: "Supplier",
                        accessor: "supplier_name",
                        width: 120,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "Category",
                        accessor: "category",
                        width: 150,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {Utils.shortenString(props.value, 60)}
                            </div>
                          </HtmlTooltip>)
                      },
                      {
                        Header: "Description",
                        accessor: "description",
                        width: 220,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {Utils.shortenString(props.value, 60)}
                            </div>
                          </HtmlTooltip>)
                      },
                      {
                        Header: "Level",
                        accessor: "level",
                        width: 60
                      },
                      {
                        Header: "Closed At",
                        accessor: "closed_at",
                        width: 100
                      },
                      // {
                      //   Header: "Remediation",
                      //   accessor: "remediation",
                      // },
                      // {
                      //   Header: "Systems Change",
                      //   accessor: "systems_change",
                      // },
                      {
                        Header: "Affected",
                        accessor: "affected_workers",
                        width: 90
                      },
                      // {
                      //   Header: "Law Violated",
                      //   accessor: "law",
                      // },
                      {
                        Header: "Status",
                        accessor: "status_name",
                        width: 90,
                      },
                      {
                        Header: "Updates",
                        accessor: "total_update_count",
                        width: 90
                      },{ 
                        Header: "Call #",
                        accessor: "call_count",
                        width: 90

                      },
                      { 
                        Header: "Calls",
                        accessor: "calls",
                        width: 290,
                        Cell:((props)=>{
                          return <div>
                            {(props.value) ? props.value.map((item)=> {
                            return (<span style={{paddingLeft: "4px"}}>{"("}<a title={"Call Id: " + item} href={"/admin/new-call?id=" + item} target="__blank">{item}</a>{")"}</span>)
                            }) : "-"}
                        </div> })

                      },
                      {
                        Header: "",
                        sortable: false,
                        filterable: false,
                        accessor: "id",
                        width: 60,
                        Cell: props => (
                          viewButton(props.value)
                        ),
                      }
                    ]}

                    defaultPageSize={5}
                    showPaginationTop={false}
                    showPaginationBottom={true}
                    loading={fetchingSupplierKPIs === true}
                    className="-striped -highlight"
                  />
                </CardBody>
              </Card>

            </GridItem>)}

          </CardBody>
        </Card>
        {selectedKPIs.length > 0 &&
          <FormControl justify="right">
            <Button color="rose" onClick={handleClickUpdateKPIs}>Update selected KPIs</Button>
          </FormControl>
        }
      </GridItem>


      {/* Current Supplier KPI HISTORY List*/}
      <GridItem xs={12}>
        <h4 className={classes.center}>Supplier KPI Updated History</h4>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>Search Results (Found: {(searchFilteredSupplierKPIsHistoryArray !== undefined &&
              searchFilteredSupplierKPIsHistoryArray.length !== undefined) ? searchFilteredSupplierKPIsHistoryArray.length : 0})</h4>
          </CardHeader>
          <CardBody>
            <GridItem xs={12} sm={12} lg={12}>
              <FormControl fullWidth>
                <CustomInput
                  id={"search_text"}
                  labelText={"Search (Fuzzy Search Across all fields)"}
                  isTextArea={false}
                  formControlProps={{
                    fullWidth: true
                  }}
                  value={filters.searchhistory}
                  inputProps={{
                    onChange: (e) => {
                      setFilters({ ...filters, searchhistory: (e.target.value === undefined) ? "" : e.target.value })
                    }
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <br />
            </GridItem>

            <GridItem xs={12} sm={12} lg={12}>
              <Card>
                <CardBody>
                  <ReactTable PaginationComponent={Pagination} PaginationComponent={Pagination}
                    data={searchFilteredSupplierKPIsHistoryArray}
                    defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                    filterable={true}

                    collapseOnDataChange={false}
                    SubComponent={(row) => (<SupplierKpiDetailsSubPanel supplierKPI={supplierKPIs[row.original.supplier_kpi]}
                      recruitersMap={recruitersMap}
                      callsMap={callsMap}
                      supplierKpiUpdates={supplierKpiUpdates} />)}
                    defaultSorted={[{
                      id: 'opened_at',
                      desc: true,
                    }]}
                    columns={[
                      {
                        Header: "id",
                        accessor: "id",
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
                        Header: props => (
                          <HtmlTooltip title={"This is the parent Supplier KPI ID.  This is ID in the Supplkier KPI List table above"} interactive>
                            <div className="cell-overflow">
                              Supplier KPI ID
                            </div>
                          </HtmlTooltip>
                        ),
                        accessor: "supplier_kpi",
                        width: 150,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {props.value}
                            </div>
                          </HtmlTooltip>
                        )
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
                          </HtmlTooltip>
                        )
                      },
                      {
                        Header: "Category",
                        accessor: "category",
                        width: 150,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {Utils.shortenString(props.value, 60)}
                            </div>
                          </HtmlTooltip>)
                      },
                      {
                        Header: "Description",
                        accessor: "description",
                        width: 220,
                        Cell: props => (
                          <HtmlTooltip title={props.value} interactive>
                            <div className="cell-overflow">
                              {Utils.shortenString(props.value, 60)}
                            </div>
                          </HtmlTooltip>)
                      },
                      {
                        Header: "Level",
                        accessor: "level",
                        width: 60
                      },
                      {
                        Header: "Opened At",
                        accessor: "opened_at",
                        width: 100
                      },
                      {
                        Header: "Closed At",
                        accessor: "closed_at",
                        width: 100
                      },
                      // {
                      //   Header: "Remediation",
                      //   accessor: "remediation",
                      // },
                      // {
                      //   Header: "Systems Change",
                      //   accessor: "systems_change",
                      // },
                      {
                        Header: "# Affected",
                        accessor: "affected_workers",
                        width: 100
                      },
                      // {
                      //   Header: "Law Violated",
                      //   accessor: "law",
                      // },
                      {
                        Header: "Status",
                        accessor: "status_name",
                        width: 90,
                      },
                      {
                        Header: "",
                        sortable: false,
                        filterable: false,
                        accessor: "supplier_kpi",
                        width: 60,
                        Cell: props => (
                          viewButton(props.value)
                        ),
                      }
                    ]}
                    defaultPageSize={5}
                    showPaginationTop={false}
                    showPaginationBottom={true}
                    loading={fetchingSupplierKPIs === true}
                    className="-striped -highlight"
                  />
                </CardBody>
              </Card>

            </GridItem>

          </CardBody>
        </Card>
        {selectedKPIs.length > 0 &&
          <FormControl justify="right">
            <Button color="rose" onClick={handleClickUpdateKPIs}>Update selected KPIs</Button>
          </FormControl>
        }
      </GridItem>


    </GridContainer>
  );
}


import React, { useState, useEffect } from "react";


import Tooltip from '@material-ui/core/Tooltip';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import KpiSelector from "components/ilmdb/KpiSelector.js";
import moment from "moment";

//import Datetime from "react-datetime";

import VisibilityIcon from '@material-ui/icons/Visibility';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Pagination from "../../components/Pagination/Pagination2.js";
import LaunchIcon from "@material-ui/icons/Launch";

import { fetchKPIList, fetchKPICategoryList, fetchIssueCategories } from "../../redux/actions/IssueActions.js";



import Datetime from "react-datetime";

import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import ReactTable from "react-table-6";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";

import { fetchCalls } from "redux/actions/CallActions.js";

import InteractionCallModal from "./InteractionCallModal.js";

import Utils from "../../services/utils.js";

import { useDispatch, useSelector } from "react-redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js";


import ReactExport from "react-export-excel";


import loginStore from "../../redux/stores/LoginStore";



const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;



const customStyle = {
  button: {
    padding: 0,
    margin: 0,
  }
};

const useStyles = makeStyles(customStyle);

let fetchedKpis = false;

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

/*
 id: (caseIssueRow.id),
          client_nickname: ((([null,undefined,""].includes(caseIssueRow.client_nickname) === true) ? "Anonymous" : caseIssueRow.client_nickname) + " / " + caseIssueRow.client_gender_name),
          client_phonenumber: (caseIssueRow.client_phonenumber),
          supplier: (caseIssueRow.supplier_name),
          source_recruiter: (caseIssueRow.source_recruiter_name),
          destination_recruiter: (caseIssueRow.destination_recruiter_name),
          kpi_long: (caseIssueRow.kpi_description),
          kpi: (caseIssueRow.kpi_description),
          kpi_ids: caseIssueRow.kpi_ids,
          kpi_count: (caseIssueRow.kpi_ids !== undefined && caseIssueRow.kpi_ids !== null) ? caseIssueRow.kpi_ids.length : 0,
          level: (caseIssueRow.kpi_level),
          issue_category: (caseIssueRow.issue_category_name),
          description: caseIssueRow.description,
          description_long: caseIssueRow.description,
          issara_staff: (caseIssueRow.issara_user),
          created: (caseIssueRow.created),
          actions_edit: (simpleButtons_edit),
          actions_view: (simpleButtons_view),
          subComponent: (subComponentView)

*/

class DownloadCalls extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataset: props.dataset
    }
  }

  render() {
    return (
      <GridContainer>
        <GridItem>
          <ExcelFile filename={"worker_voice_cases"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="calls">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="client_nickname" value="client_nickname" />
              <ExcelColumn label="supplier" value="supplier" />
              <ExcelColumn label="source_recruiter" value="source_recruiter" />
              <ExcelColumn label="destination_recruiter" value="destination_recruiter" />
              <ExcelColumn label="kpi_long" value="kpi_long" />
              <ExcelColumn label="kpi" value="kpi" />
              <ExcelColumn label="kpi_count" value="kpi_count" />
              <ExcelColumn label="level" value="level" />
              <ExcelColumn label="issue_category" value="issue_category" />
              <ExcelColumn label="description_long" value="description_long" />
              <ExcelColumn label="issara_staff" value="issara_staff" />
              <ExcelColumn label="created" value="created" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>

      </GridContainer>
    );
  }
}




export default function InteractionCallList(props) {

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  // Default 30 days back
  const [allCallsAfterSearchDate, setAllCallsAfterSearchDate] = useState(undefined)
  const [allCallsBeforeSearchDate, setAllCallsBeforeSearchDate] = useState(undefined)
  const [supplierIds, setSupplierIds] = useState([]);
  const [srcRecruiterIds, setSrcRecruiterIds] = useState([]);
  const [destRecruiterIds, setDestRecruiterIds] = useState([]);
  const kpis = useSelector(state => state.kpisReducer.kpiitems);
  const fetcingKPIs = useSelector(state => state.kpisReducer.fetcingKPIs);
  const kpiCategories = useSelector(state => state.kpisReducer.kpicategoryitems);

  const [runCallServerSearch, setRunCallServerSearch] = useState(true);

  const currentUser = loginStore.getLoginUser();

  const classes = useStyles();

  const [modal, setModal] = useState({
    open: false,
    value: null
  });

  const [workerVoiceCaseCalls, setWorkerVoiceCaseCalls] = useState(undefined);
  const workerVoiceCaseCallsSearch = useSelector((state) => {
    return state.workerVoiceCaseCallsReducer.items;
  });
  const fetchingCalls = useSelector((state) => {
    return state.workerVoiceCaseCallsReducer.fetchingCalls;
  });


  const [origSearchData, setOrigSearchData] = useState([]);
  const [reactTableData, setGReactTable] = useState({
    data: undefined,
    filter: false
  });

  


  const setReactTable = (reactTable) => {
    setGReactTable(reactTable);
    if(props.onReactTable) {

      props.onReactTable( {...reactTable, suppliers: supplierIds, srcRecruiters: srcRecruiterIds, destRecruiter: destRecruiterIds});
    
    }
  }


  const setupWorkerVoiceCalls = () => {

    if (kpis !== undefined && kpis.length > 0 && workerVoiceCaseCalls !== undefined && workerVoiceCaseCalls.length !== undefined && reactTableData.data === undefined) {
      const tableData = []
      workerVoiceCaseCalls.forEach((caseIssueRow) => {

        const simpleButtons_external_edit = (<div>
          <a href={"/admin/new-call?id=" + caseIssueRow.id} target="__blank">
            <LaunchIcon />
          </a>
        </div>);

        const simpleButtons_edit = (<div>
          <Button
            title={"Edit Item: " + caseIssueRow.id}
            color={"success"}
            icon={Edit}
            simple
            className={classes.button}

            key={Utils.giveMeGuid()}
            onClick={() => {
              props.history.push(`/admin/new-call?id=${caseIssueRow.id}`);
            }}
          >
            <Edit />
          </Button>
        </div>);


        const simpleButtons_view = (<div>
          <Button
            title={"View Item: " + caseIssueRow.id}
            simple
            color={"info"}
            className={classes.button}
            key={Utils.giveMeGuid()}
            onClick={() => {
              setModal({ open: true, value: Object.assign({}, caseIssueRow) });
            }}
          >
            <VisibilityIcon />
          </Button>
        </div>);

        let subComponentView = (<div>
          <Card>
            <CardBody>
              {(caseIssueRow.kpi_ids && caseIssueRow.kpi_ids !== null &&
                caseIssueRow.kpi_ids.length > 0 &&
                kpis !== undefined &&
                kpis !== null && kpis.length > 0) ? (() => {
                  let foundKpis = new Array();
                  kpis.forEach((kpi) => {
                    if (caseIssueRow.kpi_ids.includes(kpi.id)) {
                      foundKpis.push(kpi);
                    }
                  });

                  return (<KpiSelector
                    issueCategory={1}
                    selectedKpis={(() => {
                      let selectedKpis = {};

                      foundKpis.forEach((kpi) => {
                        if (selectedKpis[kpi.kpi_category.id] === undefined || selectedKpis[kpi.kpi_category.id] === null) {
                          selectedKpis[kpi.kpi_category.id] = new Array();
                        }
                        selectedKpis[kpi.kpi_category.id].push(kpi.id);
                      });
                      return selectedKpis;

                    })()}
                    displayOnlyMode={true}
                  />);

                })() : (<div>No KPIs logged for this call id: {caseIssueRow.id} </div>)}
            </CardBody>
          </Card>
        </div>);

        let kpiDescription = (Utils.shortenString(caseIssueRow.kpi_description, 80));

        tableData.push({
          id: (caseIssueRow.id),
          client_nickname: ((([null, undefined, ""].includes(caseIssueRow.client_nickname) === true) ? "Anonymous" : caseIssueRow.client_nickname)),
          client_phonenumber: (caseIssueRow.client_phonenumber),
          supplier: (caseIssueRow.supplier_name),
          source_recruiter: (caseIssueRow.source_recruiter_name),
          destination_recruiter: (caseIssueRow.destination_recruiter_name),
          kpi_long: (caseIssueRow.kpi_description),
          kpi: (caseIssueRow.kpi_description),
          kpi_ids: caseIssueRow.kpi_ids,
          kpi_count: (caseIssueRow.kpi_ids !== undefined && caseIssueRow.kpi_ids !== null) ? caseIssueRow.kpi_ids.length : 0,
          level: (caseIssueRow.kpi_level),
          issue_category: (caseIssueRow.issue_category_name),
          description: caseIssueRow.description,
          description_long: caseIssueRow.description,
          issara_staff: (caseIssueRow.issara_user),
          created: (caseIssueRow.created),
          client_gender_name: (caseIssueRow.client_gender_name),
          client_nationality_name: (caseIssueRow.client_nationality_name),
          client_ethnicity_name: (caseIssueRow.client_ethnicity_name),
          dead_line_date: (caseIssueRow.dead_line_date),
          interaction_date: (caseIssueRow.interaction_date),
          interaction_type: (caseIssueRow.interaction_type),
          actions_edit: (simpleButtons_edit),
          actions_view: (simpleButtons_view),
          actions_edit_external: (simpleButtons_external_edit),
          subComponent: (subComponentView)

        });

      });


      setOrigSearchData(tableData);

      setReactTable({
        data: tableData,
        filter: false
      });

    }


    if (search !== undefined && search !== undefined && search.length > 1 && reactTableData.filter != false && reactTableData.data !== undefined) {
      let filteredSearchData = Utils.findStringInObjectFields(origSearchData, search, ["id",
        "supplier",
        "source_recruiter",
        "destination_recruiter",
        "kpi_long",
        "level",
        "issue_category",
        "description_long",
        "issara_staff",
        "client_nickname",
        "client_phonenumber",
        "dead_line_date",
        "client_gender_name",
        "client_nationality_name",
        "client_ethnicity_name",
        "interaction_type",
        "interaction_date"
      ]);
      setReactTable({
        data: filteredSearchData,
        filter: false
      });
    }

  }

  useEffect(() => {
    dispatch(fetchKPIList());
    dispatch(fetchKPICategoryList());
    dispatch(fetchIssueCategories());

  }, [])

  useEffect(() => {
    if (runCallServerSearch) {
      dispatch(fetchCalls(allCallsAfterSearchDate, allCallsBeforeSearchDate, supplierIds, srcRecruiterIds, destRecruiterIds));
    } else {
      setWorkerVoiceCaseCalls(workerVoiceCaseCallsSearch);
    }

    setRunCallServerSearch(false);



  }, [workerVoiceCaseCallsSearch, runCallServerSearch, kpis]);

  setupWorkerVoiceCalls();


  return (
    <GridContainer>

      <GridItem xs={12} sm={12} lg={12}>
        <InteractionCallModal key={Utils.giveMeGuid()} open={modal.open} value={(modal.value) ? modal.value.id : undefined} onClose={() => setModal({ value: undefined, open: false })} />
      </GridItem>

      <GridItem xs={12} sm={12} lg={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>Worker Voice Calls</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12}  lg={6}>
                <SuppliersDropdown multipleselect={true} value={supplierIds} onSelect={(tsupplierIds) => {
                  console.log("SupplierIDs selected = ", tsupplierIds);
                  setSupplierIds(tsupplierIds)
                }} />
              </GridItem>
              <GridItem xs={12} sm={12}  lg={6}>
                <RecruitersDropdown multipleselect={true} value={srcRecruiterIds} label={"Source Recruiter"} onSelect={(trecruiterIds) => {
                  setSrcRecruiterIds(trecruiterIds)
                }} />
              </GridItem>
              <GridItem xs={12} sm={12}  lg={6}>
                <RecruitersDropdown multipleselect={true} value={destRecruiterIds} label={"Destination Recruiter"} onSelect={(trecruiterIds) => {
                  setDestRecruiterIds(trecruiterIds)
                }} />
              </GridItem>
              <GridItem xs={12} sm={12}  lg={6}>
                <GridContainer>
                  <GridItem>
                    <InputLabel>After Date:</InputLabel>
                    <FormControl fullWidth>
                      <Datetime
                        timeFormat={false}
                        inputProps={{ placeholder: "Date" }}
                        value={allCallsAfterSearchDate}
                        onChange={(e) => {
                          setAllCallsAfterSearchDate(((e === undefined || e === "" || e === null) ? undefined : new Date(e)));
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <InputLabel>Before Date:</InputLabel>
                    <FormControl fullWidth>
                      <Datetime
                        timeFormat={false}
                        inputProps={{ placeholder: "Date" }}
                        value={allCallsBeforeSearchDate}
                        onChange={(e) => {
                          setAllCallsBeforeSearchDate(((e === undefined || e === "" || e === null) ? undefined : new Date(e)));
                        }}
                      />
                    </FormControl>
                  </GridItem>

                </GridContainer>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12}  lg={6}>
                <Button
                  onClick={(e) => {
                    setWorkerVoiceCaseCalls(undefined)
                    setReactTable({
                      data: undefined,
                      filter: false
                    });
                    setRunCallServerSearch(true);

                  }} >
                  Search
                </Button>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>

      {loginStore.isIssaraManagement() &&
        <GridItem>
          {(reactTableData !== undefined && reactTableData.data !== undefined) ? (<DownloadCalls dataset={reactTableData.data} />) : (null)}
        </GridItem>
      }

      <GridItem xs={12} sm={12} lg={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>Search Results (Found: {(reactTableData !== undefined &&
              reactTableData.data !== undefined &&
              reactTableData.data.length !== undefined) ? reactTableData.data.length : 0})</h4>
          </CardHeader>
          <CardBody>
            <div>
              <GridItem xs={12} sm={12} lg={12}>
                <FormControl fullWidth>
                  <CustomInput
                    id={"search_text"}
                    labelText={"Search (Fuzzy Search Across all fields)"}
                    isTextArea={false}
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={search}
                    inputProps={{
                      onChange: (e) => {
                        setSearch(e.target.value);

                        if (e.target.value === undefined || e.target.value === "") {
                          setReactTable({
                            data: undefined,
                            filter: false
                          })
                        } else {
                          let newReact = Object.assign({}, reactTableData);
                          newReact.filter = true;
                          setReactTable(newReact);
                        }
                      }
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <br />
              </GridItem>
              <GridItem xs={12} sm={12} lg={12}>
                {(fetcingKPIs === true) ? (<div>Fetching....</div>) : (<ReactTable
                  PaginationComponent={Pagination}
                  
                  defaultPageSize={5}
                  showPageSizeOptions={true}
                  pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  className="-striped -highlight"

                  defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                  filterable={true}
      
                  data={reactTableData.data}
                  loading={fetchingCalls}
                  collapseOnDataChange={false}
                  SubComponent={d => {
                    let caseIssue = d.original;
                    return caseIssue.subComponent;
                  }}

              
                  columns={[
                    {
                      Header: "Id",
                      accessor: "id",
                      width: 80,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Supplier",
                      accessor: "supplier",
                      width: 180,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    }, {
                      Header: "RecruiterSrc",
                      accessor: "source_recruiter",
                      width: 120,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "RecruiterDst",
                      accessor: "destination_recruiter",
                      width: 120,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    }, {
                      Header: "Level",
                      accessor: "level",
                      width: 80,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Issue Category",
                      accessor: "issue_category",
                      Cell: props => (
                        <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 25)}
                        </div>
                      </HtmlTooltip>)
                    },
                    {
                      Header: "Kpi",
                      accessor: "kpi",
                      width: 160,
                      Cell: props => (
                        <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 25)}
                        </div>
                      </HtmlTooltip>)
                    }, {
                      Header: "# Kpis",
                      accessor: "kpi_count",
                      width: 90,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    }, {
                      Header: "Description",
                      accessor: "description",
                      width: 100,
                      Cell: props => (
                        <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 25)}
                        </div>
                      </HtmlTooltip>)
                    },
                    {
                      Header: "IssaraStaff",
                      accessor: "issara_staff",
                      width: 100,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Client",
                      accessor: "client_nickname",
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Gender",
                      accessor: "client_gender_name",
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Nationality",
                      accessor: "client_nationality_name",
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Incoming Outgoing",
                      accessor: "interaction_type",
                      width: 100,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Phone",
                      accessor: "client_phonenumber",
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "Interaction",
                      accessor: "interaction_date",
                      width: 90,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "",
                      accessor: "actions_view",
                      width: 30,
                      sortable: false,
                      filterable: false,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "",
                      accessor: "actions_edit",
                      width: 30,
                      sortable: false,
                      filterable: false,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "",
                      accessor: "actions_edit_external",
                      width: 30,
                      sortable: false,
                      filterable: false,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    },
                    {
                      Header: "",
                      width: 20,
                      sortable: false,
                      filterable: false
                    }
                  ]}
                />)}
              </GridItem>
            </div>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer >
  );
}

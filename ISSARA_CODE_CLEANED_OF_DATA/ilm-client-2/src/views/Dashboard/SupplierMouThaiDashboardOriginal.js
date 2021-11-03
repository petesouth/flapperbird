import React, { useState, useEffect } from "react";


import Tooltip from '@material-ui/core/Tooltip';

import ReactTable from "react-table-6";
import ReactExport from "react-export-excel";
import Pagination from "components/Pagination/Pagination2.js";

import Button from "components/CustomButtons/Button.js";

import loginStore from "../../redux/stores/LoginStore";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import SuppliersDropdown from '../../components/ilmdb/SuppliersDropdown';


import HttpService from "../../services/HttpService";
import Utils from "../../services/utils";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import SupplierList from "views/suppliers/SupplierList";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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



class DownloadDemandDataAsExcel extends React.Component {
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
          <ExcelFile filename={"mou_demand_data"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="mou_demand_data">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="supplier" value="supplier_name" />
              <ExcelColumn label="recruiter" value="recruiter_name" />
              <ExcelColumn label="record_date" value="record_date" />
              <ExcelColumn label="province" value="province" />
              <ExcelColumn label="factory_type" value="type_of_factory" />
              <ExcelColumn label="industry" value="industry" />
              <ExcelColumn label="subindustry" value="subindustry" />
              <ExcelColumn label="num_males" value="num_males" />
              <ExcelColumn label="num_females" value="num_females" />
              <ExcelColumn label="num_total" value="num_total" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>

      </GridContainer>
    );
  }
}

class DownloadSendDataAsExcel extends React.Component {
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
          <ExcelFile filename={"mou_send_data"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="mou_send_data">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="supplier" value="supplier_name" />
              <ExcelColumn label="recruiter" value="recruiter_name" />
              <ExcelColumn label="record_date" value="record_date" />
              <ExcelColumn label="province" value="province_name" />
              <ExcelColumn label="factory_type" value="factory_type_name" />
              <ExcelColumn label="industry" value="industry" />
              <ExcelColumn label="subindustry" value="subindustry" />
              <ExcelColumn label="sending_male" value="sending_male" />
              <ExcelColumn label="sending_female" value="sending_female" />
              <ExcelColumn label="sending_total" value="sending_total" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>

      </GridContainer>
    );
  }
}



export default function SupplierMouThaiDashboardOriginal(props) {
  const classes = useStyles();

  const [init, setInit] = useState(false);
  const [mmThaiSendingData, setMMThaiSendingData] = useState([])
  const [mmFilteredThaiSendingData, setMMFilteredThaiSendingData] = useState([])
  const [fetchingMMThaiSendingData, setFetchingMMThaiSendingData] = useState(true);


  const [mmThaiDemandData, setMMThaiDemandData] = useState([])
  const [mmFilteredThaiDemandData, setMMFilteredThaiDemandData] = useState([])
  const [fetchingMMThaiDemandData, setFetchingMMThaiDemandData] = useState(true);
  const currentUser = loginStore.getLoginUser();

  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: []
  });

  const fetchMetricsAll = () => {

    Promise.all([
      new Promise((resolve) => {
        setFetchingMMThaiDemandData(true);
        HttpService.get(`${process.env.REACT_APP_API_URL}/mmthaidemanddata/`,
          (resp) => {
            setFetchingMMThaiDemandData(false);
            setMMThaiDemandData(resp.results);
            resolve(resp.results);
          },
          (err) => {
            console.log(err.message)
            resolve(err.message);
          }
        );
      })
    ]).then((resolve) => {
      console.log("Resolve====>", resolve);

      setFilters({
        suppliers: []
      });
    });

    Promise.all([
      new Promise((resolve) => {
        setFetchingMMThaiSendingData(true);
        HttpService.get(`${process.env.REACT_APP_API_URL}/mm-thai-sending-data-raw`,
          (resp) => {
            setFetchingMMThaiSendingData(false);
            setMMThaiSendingData(resp);
            resolve(resp);
          },
          (err) => {
            console.log(err.message)
            resolve(err.message);
          }
        );
      })
    ]).then((resolve) => {
      console.log("Resolve====>", resolve);

      setFilters({
        suppliers: []
      });
    });

  }

  const filterMetrics = () => {

    if (mmThaiSendingData) {
      const filteredMMThaiSendingData = mmThaiSendingData.filter(item => { return filters.suppliers.length < 1 || filters.suppliers.includes(item.supplier) })
      setMMFilteredThaiSendingData(filteredMMThaiSendingData);
    }

    if (mmThaiDemandData) {
      const filteredMMThaiDemandData = mmThaiDemandData.filter(item => { return filters.suppliers.length < 1 || filters.suppliers.includes(item.supplier) })
      setMMFilteredThaiDemandData(filteredMMThaiDemandData)
    }

  }



  useEffect(() => {
    if (init === false) {
      setInit(true);
      fetchMetricsAll();
    }
  }, []);

  useEffect(() => {
    filterMetrics();
  }, [filters]);


  if (mmThaiSendingData === undefined ||
    mmThaiSendingData === null ||
    mmThaiSendingData.length < 1 ||
    mmThaiDemandData === undefined ||
    mmThaiDemandData === null ||
    mmThaiDemandData.length < 1) {
    return (<div>Loading...</div>);
  }

  let demandNode = (
    <div>

      <GridContainer className={classes.marginBottom}>

        <GridItem xs={6} sm={4} md={3} lg={3}>
          <SuppliersDropdown multipleselect={true} value={filters.suppliers} onSelect={suppliers => setFilters({ ...filters, suppliers: suppliers })} />
        </GridItem>
      </GridContainer>


      {loginStore.isIssaraManagement() &&
        <GridItem>
          {(mmFilteredThaiDemandData !== undefined) ? (<DownloadDemandDataAsExcel key={Utils.giveMeGuid()} dataset={mmFilteredThaiDemandData} />) : (null)}
        </GridItem>
      }
      <h3 className={classes.center}> Mou Thailand Demand Data</h3>
      <GridContainer>
        <GridItem xs={12}>
          <h4>Search Results(Found: {mmFilteredThaiDemandData ? mmFilteredThaiDemandData.length : 0})</h4>
        </GridItem>
        <GridItem xs={12}>
          <Card className={classes.outreachTable}>
            {(fetchingMMThaiDemandData) ? <CircularProgress /> : (<ReactTable PaginationComponent={Pagination}
              data={mmFilteredThaiDemandData}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              loading={fetchingMMThaiDemandData}
              defaultSorted={[{
                id: 'record_date',
                desc: true,
              }]}
              defaultPageSize={5}
              className="-striped -highlight"
              columns={[
                {
                  Header: "id",
                  accessor: "id",
                  show: false,
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
                  sortable: true,
                  filterable: true,
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
                  sortable: true,
                  filterable: true,
                  width: 140,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Record Date",
                  accessor: "record_date",
                  sortable: true,
                  width: 100,
                  filterable: true,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)

                },
                {
                  Header: "Province",
                  accessor: "province",
                  sortable: true,
                  filterable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Factory Type",
                  accessor: "type_of_factory",
                  sortable: true,
                  filterable: true,
                  width: 100,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Industry",
                  accessor: "industry",
                  sortable: true,
                  filterable: true,
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Sub Industry",
                  accessor: "subindustry",
                  sortable: true,
                  filterable: true,
                  width: 180,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Males",
                  accessor: "num_males",
                  sortable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Females",
                  accessor: "num_females",
                  sortable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Total",
                  accessor: "num_total",
                  sortable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "",
                  width: 20,
                  sortable: false,
                }
              ]}
            />)}

          </Card>
        </GridItem>
      </GridContainer>


    </div>
  );


  let sendingNode = (
    <div>

      <GridContainer className={classes.marginBottom}>

        <GridItem xs={6} sm={4} md={3} lg={3}>
          <SuppliersDropdown multipleselect={true} value={filters.suppliers} onSelect={suppliers => setFilters({ ...filters, suppliers: suppliers })} />
        </GridItem>
      </GridContainer>


      {loginStore.isIssaraManagement() &&
        <GridItem>
          {(mmFilteredThaiSendingData !== undefined) ? (<DownloadSendDataAsExcel key={Utils.giveMeGuid()} dataset={mmFilteredThaiSendingData} />) : (null)}
        </GridItem>
      }

      <h3 className={classes.center}> Mou Thailand Sending Data</h3>
      <GridContainer>
        <GridItem xs={12}>
          <h4>Search Results(Found: {mmFilteredThaiSendingData.length})</h4>
        </GridItem>
        <GridItem xs={12}>
          <Card className={classes.outreachTable}>
            {(fetchingMMThaiSendingData) ? <CircularProgress /> : (<ReactTable PaginationComponent={Pagination}
              data={mmFilteredThaiSendingData}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              loading={fetchingMMThaiSendingData}
              defaultSorted={[{
                id: 'record_date',
                desc: true,
              }]}
              defaultPageSize={5}
              className="-striped -highlight"
              columns={[
                {
                  Header: "id",
                  show: false,
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
                  Header: "Supplier",
                  accessor: "supplier_name",
                  sortable: true,
                  filterable: true,
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
                  sortable: true,
                  filterable: true,
                  width: 140,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Record Date",
                  accessor: "record_date",
                  sortable: true,
                  width: 100,
                  filterable: true,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)

                },
                {
                  Header: "Province",
                  accessor: "province_name",
                  sortable: true,
                  filterable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Factory Type",
                  accessor: "factory_type_name",
                  sortable: true,
                  filterable: true,
                  width: 100,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Industry",
                  accessor: "industry",
                  sortable: true,
                  filterable: true,
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Sub Industry",
                  accessor: "subindustry",
                  sortable: true,
                  filterable: true,
                  width: 180,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Males",
                  accessor: "sending_male",
                  sortable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Females",
                  accessor: "sending_female",
                  sortable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Total",
                  accessor: "sending_total",
                  sortable: true,
                  width: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "",
                  width: 20,
                  sortable: false,
                }
              ]}
            />)}
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );


  return (<GridContainer>
    {demandNode}

    {sendingNode}
  </GridContainer>
  )
}

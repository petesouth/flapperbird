import React, { useState, useEffect } from "react";


import Tooltip from '@material-ui/core/Tooltip';

import ReactTable from "react-table-6";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import SuppliersDropdown from '../../components/ilmdb/SuppliersDropdown';


import HttpService from "../../services/HttpService";
import Utils from "services/utils";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";


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


export default function SupplierDashboard(props) {
  const classes = useStyles();

  const [init, setInit] = useState(false);
  const [mmThaiSendingData, setMMThaiSendingData] = useState([])
  const [mmFilteredThaiSendingData, setMMFilteredThaiSendingData] = useState([])
  const [fetchingMMThaiSendingData, setFetchingMMThaiSendingData] = useState(true);

  // FILTERS
  const [filters, setFilters] = useState({
    supplier: null
  });

  const fetchMetricsAll = () => {

    Promise.all([
       new Promise((resolve) => {
         setFetchingMMThaiSendingData(true);
         HttpService.get(`${process.env.REACT_APP_API_URL}/mm-thai-sending-data-raw`,
           (resp) => {
             setFetchingMMThaiSendingData(false);
             setMMThaiSendingData(resp);
             setMMFilteredThaiSendingData(resp);
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
        supplier: null
      });
    });

  }

  const filterMetrics = () => {

   if (mmThaiSendingData) {
      const filteredMMThaiSendingData = mmThaiSendingData.filter(item => {return item.supplier === filters.supplier || !filters.supplier})
      setMMFilteredThaiSendingData(filteredMMThaiSendingData);
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

  return (
    <div>

      <GridContainer className={classes.marginBottom}>

        <GridItem xs={6} sm={4} md={3} lg={3}>
          <SuppliersDropdown value={filters.supplier} onSelect={supplier => setFilters({ ...filters, supplier: supplier })} />
        </GridItem>
      </GridContainer>

      <h3 className={classes.center}> Mou Thailand Sending Data</h3>
      <GridContainer>
        <GridItem xs={12}>
          <h4>Search Results(Found: {mmFilteredThaiSendingData.length})</h4>
        </GridItem>
        <GridItem xs={12}>
          <Card className={classes.outreachTable}>
            {(fetchingMMThaiSendingData) ? <CircularProgress /> : (<ReactTable
              data={mmFilteredThaiSendingData}
              loading={fetchingMMThaiSendingData}
              defaultSorted={[{
                id: 'record_date',
                desc: true,
              }]}
              defaultPageSize={5}
              className="-striped -highlight"
              columns={[
                {
                  Header: "ID",
                  accessor: "id",
                  width: 50,
                  show: false
                },
                {
                  Header: "Supplier",
                  accessor: "supplier_name",
                  sortable: true,
                  width: 100,
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
                  width: 100,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Date",
                  accessor: "record_date",
                  sortable: true,
                  width: 90,
                },
                {
                  Header: "Province",
                  accessor: "province_name",
                  sortable: true,
                  width: 100,
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
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Industry",
                  accessor: "industry_name",
                  sortable: true,
                  width: 90,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Sub Industry",
                  accessor: "subindustry_name",
                  sortable: true,
                  width: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Sending Males",
                  accessor: "Sending_males",
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
                  Header: "Sending Females",
                  accessor: "sending_females",
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
                  Header: "Sending Total",
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
}

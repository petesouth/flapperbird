import React, { useState, useEffect } from "react";


import Tooltip from '@material-ui/core/Tooltip';

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import CircularProgress from '@material-ui/core/CircularProgress';

import Pagination from "components/Pagination/Pagination2.js";

import Datetime from "react-datetime";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js"
import Button from "components/CustomButtons/Button.js";

import SpeedometerStat from './SpeedometerStat';
import RecruitersDropdown from '../../components/ilmdb/RecruitersDropdown';

import BusinessResponseInteractions from './BusinessResponseInteractions.js';

import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";

import { fetchSuppliers } from "../../redux/actions/SupplierActions";
import HttpService from "../../services/HttpService";
import Utils from "services/utils.js";

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
    margin: '0 0 1rem 0'
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



export default function RecruiterDashboard(props) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const [workerInteractions, setWorkerInteractions] = useState({})
  const [workers, setWorkers] = useState({})
  const [crcScores, setCrcScores] = useState({})
  const [violations, setViolations] = useState([])
  const [fetchingInteractions, setFetchingInteractions] = useState(true);
  const [fetchingWorkers, setFetchingWorkers] = useState(true);
  const [fetchingCrcScores, setFetchingCrcScores] = useState(true);
  const [fetchingViolations, setFetchingViolations] = useState(true);

  const unknownGenderInteractions = workerInteractions.total - workerInteractions.men - workerInteractions.women
  const unknownGenderWorkers = workers.total - workers.men - workers.women

  // FILTERS
  const [filters, setFilters] = useState({
    supplier: null,
    startTime: null,
    endTime: null
  });


  useEffect(() => {
    fetchMetrics()
  }, [filters]);

  const fetchMetrics = () => {

    setFetchingInteractions(true);
    HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/interactions?start=${filters.startTime && filters.startTime.unix() || ''}&end=${filters.endTime && filters.endTime.unix() || ''}&supplierId=${filters.supplier || ''}`,
      (interactions) => {
        setWorkerInteractions(interactions)
        setFetchingInteractions(false);
      },
      (err) => {
        console.log(err.message)
      }
    );

    setFetchingWorkers(true);
    HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/workers?supplierId=${filters.supplier || ''}`,
      (workers) => {
        setWorkers(workers)
        setFetchingWorkers(false);
      },
      (err) => {
        console.log(err.message)
      }
    );

    setFetchingCrcScores(true);
    HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/crc-scores?start=${filters.startTime && filters.startTime.unix() || ''}&end=${filters.endTime && filters.endTime.unix() || ''}&supplierId=${filters.supplier || ''}`,
      (scores) => {
        setCrcScores(scores)
        setFetchingCrcScores(false);
      },
      (err) => {
        console.log(err.message)
      }
    );

    setFetchingViolations(true);
    HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/violations?start=${filters.startTime && filters.startTime.unix() || ''}&end=${filters.endTime && filters.endTime.unix() || ''}&supplierId=${filters.supplier || ''}`,
      (violations) => {
        setViolations(violations)
        setFetchingViolations(false);
      },
      (err) => {
        console.log(err.message)
      }
    );
  }

  return (
    <div>
      <GridContainer className={classes.marginBottom}>
        <GridItem xs={6} sm={4} md={3} lg={3}>
          <RecruitersDropdown/>
        </GridItem>
        <GridItem xs={6} sm={2} lg={2} xl={1}>
          <InputLabel className={classes.label}>Between</InputLabel>
          <FormControl fullWidth>
            <Datetime
              value={filters.startTime}
              timeFormat={false}
              inputProps={{ placeholder: "Start" }}
              onChange={date => typeof date === 'object' && setFilters({...filters, startTime: date})}
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
              onChange={date => typeof date === 'object' && setFilters({...filters, endTime: date})}
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
                  supplier: null,
                  startTime: null,
                  endTime: null
                })
              }> Reset all </Button>
          </FormControl>
        </GridItem>
      </GridContainer>
      <h3 className={classes.center}> Worker Voice Metrics </h3>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4} lg={3}>
          <Card className={classes.largeStatContainer}>
            <CardHeader>
              <div className={`${classes.cardTitle} ${classes.largeStatNumber}`}> {fetchingInteractions? <CircularProgress/> : workerInteractions.total} </div>
              <p className={`${classes.cardCategory} ${classes.largeStatName}`}> Total Interactions </p>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8} lg={9}>
          <GridContainer>
            <GridItem xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <CardHeader>
                  <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions? <CircularProgress size={25}/> : workerInteractions.men} </div>
                  <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Men </p>
                </CardHeader>
              </Card>
            </GridItem>
            <GridItem xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <CardHeader>
                  <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions? <CircularProgress size={25}/> : workerInteractions.women} </div>
                  <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Women </p>
                </CardHeader>
              </Card>
            </GridItem>
            <GridItem xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <CardHeader>
                  <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions? <CircularProgress size={25}/> : unknownGenderInteractions} </div>
                  <p className={`${classes.cardCategory} ${classes.smallStatName}`}> N/A </p>
                </CardHeader>
              </Card>
            </GridItem>
            <GridItem xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <CardHeader>
                  <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions? <CircularProgress size={25}/> : workerInteractions.burmese} </div>
                  <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Burmese </p>
                </CardHeader>
              </Card>
            </GridItem>
            <GridItem xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <CardHeader>
                  <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions? <CircularProgress size={25}/> : workerInteractions.khmer} </div>
                  <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Khmer </p>
                </CardHeader>
              </Card>
            </GridItem>
            <GridItem xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <CardHeader>
                  <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions? <CircularProgress size={25}/> : workerInteractions.thai} </div>
                  <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Thai </p>
                </CardHeader>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <h3 className={classes.center}> CRC Average Scores </h3>
      <GridContainer className={classes.center}>
        <GridItem sm={2} md={3} lg={3} className={classes.marginAuto}>
          <p className={classes.gaugeTableText}> Quality </p>
        </GridItem>
        <GridItem xs={12} sm={10} md={9} lg={9}>
          <GridContainer>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.quality_avg}/>}</div>
              </Card>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.quality_min}/>}</div>
              </Card>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.quality_max}/>}</div>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem sm={2} md={3} lg={3} className={classes.marginAuto}>
          <p className={classes.gaugeTableText}> Timeliness </p>
        </GridItem>
        <GridItem xs={12} sm={10} md={9} lg={9}>
          <GridContainer>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.timeliness_avg}/>}</div>
              </Card>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.timeliness_min}/>}</div>
              </Card>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.timeliness_max}/>}</div>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem sm={2} md={3} lg={3} className={classes.marginAuto}>
          <p className={classes.gaugeTableText}> Openness </p>
        </GridItem>
        <GridItem xs={12} sm={10} md={9} lg={9}>
          <GridContainer>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.openness_avg}/>}</div>
              </Card>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.openness_min}/>}</div>
              </Card>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <Card className={classes.marginTopZero}>
                <div className={classes.gaugeBox}>{fetchingCrcScores? <CircularProgress style={{marginTop:'3rem'}}/> : <SpeedometerStat value={crcScores.openness_max}/>}</div>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem sm={2} md={3} lg={3}></GridItem>
        <GridItem xs={12} sm={10} md={9} lg={9}>
          <GridContainer>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <p className={classes.gaugeTableText}> Average </p>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <p className={classes.gaugeTableText}> Minimum </p>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <p className={classes.gaugeTableText}> Maximum </p>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <h3 className={classes.center}>KPI Open Reported Violations </h3>
      <GridContainer>
        <GridItem xs={12}>
          <Card className={classes.outreachTable}>
            <ReactTable PaginationComponent={Pagination}
              data={violations}
              defaultPageSize={5}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}

              className="-striped -highlight"
              columns={[
                {
                  Header: "Category",
                  accessor: "category",
                  sortable: false,
                  maxWidth: 400,
                  Cell: props => (
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
                  sortable: false,
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
                  maxWidth: 80,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Open Since",
                  accessor: "created",
                  maxWidth: 120,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                    </HtmlTooltip>)
                },
                {
                  width: 20,
                },
              ]}
            />
          </Card>
        </GridItem>
      </GridContainer>
      <h3 className={classes.center}>Response History </h3>
      <GridContainer>
        <GridItem xs={12}>
          <BusinessResponseInteractions />
        </GridItem>
      </GridContainer>
    </div>
  );
}

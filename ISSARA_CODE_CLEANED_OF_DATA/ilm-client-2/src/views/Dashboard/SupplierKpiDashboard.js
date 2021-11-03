import React, { useState, useEffect, useRef } from "react";

import Tooltip from '@material-ui/core/Tooltip';

import { useDispatch, useSelector } from "react-redux";

import Datetime from "react-datetime";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from '@material-ui/core/CircularProgress';

import { fetchSharedFiles } from "../../redux/actions/StrategicPartnerActions";
import { fetchNationalities } from "../../redux/actions/LocaleActions";
import C3Chart from 'react-c3js';
import 'c3/c3.css';

import * as d3 from "d3";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

//import VisibilityIcon from '@material-ui/icons/Visibility';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from "components/CustomButtons/Button.js";

import SpeedometerStat from './SpeedometerStat';
import SuppliersDropdown from '../../components/ilmdb/SuppliersDropdown';
//import SupplyChainDropdown from '../../components/ilmdb/SupplyChainDropdown';
//import SupplierKPIModal from "../suppliers/SupplierKPIModal"
import GoogleMapReact from 'google-map-react';
import SupplierKpisTimelineChart from "../../components/Charts/SupplierKpisTimelineChart";
import { fetchSupplierKPIs, fetchSuppliers, fetchSupplierKpiUpdates } from "redux/actions/SupplierActions.js";
import { fetchSupplyChains, fetchStrategicPartners } from "redux/actions/StrategicPartnerActions";
import { fetchRecruiters } from "redux/actions/RecruiterActions.js";

import HttpService from "../../services/HttpService";

import ComponentToPrint from "./ComponentToPrint";
import { useReactToPrint } from 'react-to-print';
import Utils from "../../services/utils";

import loginStore from "../../redux/stores/LoginStore";

import { OpenClosedKpisListSummary } from "./SupplyChainDashboardKpi";

import { fetchKPICategoryList } from "redux/actions/IssueActions.js";

import moment from "moment";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
//import { Map as MapIcon } from "@material-ui/icons";


const customStyles = {
  ...styles,
  largeStatContainer: {
    paddingTop: '6.3rem',
    paddingBottom: '6.7rem',
    margin: '10px 0 0 0'
  },
  largeStatContainer2: {
    paddingTop: '6.3rem',
    paddingBottom: '7.3rem',
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
  gaugeContainer: {
    textAlign: "center",
    width: "200px",
    height: "200px"

  },
  button: {
    padding: 0,
    margin: 0
  },
  chartcontainerholder: {
    minWidth: "850px"
  },
  galleryImg: {
    /* CSS Hack will make it width 100% and height 100% */
    width: "30px",
    height: "18px",
    maxWidth: "30px",
    maxHeight: "20px",
    paddingRight: "5px",
    paddingBottom: "4px"
  },
  galleryContainer: {



  },
  galleryContainerBigger: {
    width: "100px",
    height: "100px"
  },
  cardCategory: {
    padding: "20px"
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




const AnyReactComponent = ({ text }) => (<div>
  <HtmlTooltip title={text} interactive>
    <AccountCircleIcon style={{ fontSize: "18px", color: "red" }} />
  </HtmlTooltip></div>);


const defaultProps = {
  center: {
    lng: 100.992541,
    lat: 15.870032
  },
  zoom: 4
};

/**
 *
 * @param {totalWorkerCalls} props
 * @returns
 */
function CallsAndMessagesFromWorkersChart(props) {
  const classes = useStyles();
  const totalWorkerCalls = props.totalWorkerCalls;



  return (<div>
    <h3 className={classes.center}> Calls and Messages from Workers </h3>

    <GridContainer>
      <GridItem xs={12}>
        <Card className={classes.chartcontainerholder}>
          <CardBody>
            <C3Chart key={Utils.giveMeGuid()} data={{
              x: 'x',
              columns: [
                totalWorkerCalls.x,
                totalWorkerCalls.y
              ],
              types: {
                "Worker Calls and Messages By Month": 'area-spline'
              }

            }}

              grid={{
                x: {
                  show: true,
                  tick: {
                    fit: true,
                    show: false,
                    rotate: -75,
                    multiline: false
                  }
                },
                y: {
                  show: true
                }
              }}

              legend={{
                position: 'bottom'
              }}

              point={{
                show: false
              }}

              axis={{
                x: {
                  type: 'timeseries',
                  tick: {
                    format: '%Y-%m'
                  }
                }
              }}


            />

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>


  </div>);
}


/**
 *
 * @param {workerInteractions} props
 * @returns
 */
export function TotalWorkerCasesSummaryPanels(props) {
  const classes = useStyles();
  const workerInteractions = props.workerInteractions;
  const sharedFiles = props.sharedFiles;
  const nationalities = props.nationalities;

  if (workerInteractions === undefined || workerInteractions === null ||
    workerInteractions.caseDataSummary === undefined || workerInteractions.caseDataSummary === null ||
    workerInteractions.nationalityByCallCount === undefined || workerInteractions.nationalityByCallCount === null ||
    sharedFiles === undefined || sharedFiles === null ||
    nationalities === undefined || nationalities === null || nationalities.length < 0
  ) {
    return <div />;
  }

  return (<div>
    <GridContainer>
      <GridItem xs={12} sm={12} md={4} lg={3}>
        <Card className={classes.largeStatContainer2}>
          <span>
            <div className={`${classes.cardTitle} ${classes.largeStatNumber}`}> {Utils.formatNumber(workerInteractions.caseDataSummary.total)} </div>
            <p className={`${classes.cardCategory} ${classes.largeStatName}`}> Total Hotline Calls </p>
          </span>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={8} lg={9}>
        <GridContainer>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <span>
                <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {Utils.formatNumber(workerInteractions.caseDataSummary.men)} </div>
                <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Men </p>
              </span>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <span>
                <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {Utils.formatNumber(workerInteractions.caseDataSummary.women)} </div>
                <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Women </p>
              </span>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <span>
                <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {Utils.formatNumber(workerInteractions.caseDataSummary.total - (workerInteractions.caseDataSummary.women + workerInteractions.caseDataSummary.men))} </div>
                <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Unknown </p>
              </span>
            </Card>
          </GridItem>

          {(workerInteractions.nationalityByCallCount.length > 0) ? workerInteractions.nationalityByCallCount.map((item) => {
            let nationality = nationalities.find((nationalityItem) => {
              return nationalityItem.id === item.client_nationality;
            });

            let sharedFileFlag = (nationality !== null && nationality !== undefined) ? sharedFiles.find((sharedFileItem) => {
              return sharedFileItem.id === nationality.imageicon;
            }) : null;

            return (<GridItem key={Utils.giveMeGuid()} xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {Utils.formatNumber(item.client_nationality__count)} </div>
                <span className={`${classes.cardCategory} ${classes.smallStatName}`}>
                  {sharedFileFlag && <img className={classes.galleryImg} src={sharedFileFlag.file_path} />}
                  {Utils.formatNumber(item.client_nationality__name)}
                </span>

              </Card>
            </GridItem>);
          }) : <div />}

        </GridContainer>
      </GridItem>
    </GridContainer>


  </div>)
}

/**
 *
 * @param {suppliers, suppliersMap} props
 */
export function SupplyChainWorkforceSummaryPanels(props) {
  const classes = useStyles();
  const suppliers = props.suppliers;
  const suppliersMap = props.suppliersMap;
  const sharedFiles = props.sharedFiles;
  const nationalities = props.nationalities;

  if (suppliers === null ||
    suppliers === undefined ||
    suppliers.length === undefined ||
    suppliers.length < 1) {
    return (<div>Not selected suppliers to chart</div>)
  }

  return (<div key={Utils.giveMeGuid()}>
    <HtmlTooltip title={(<h6 className={classes.center}><p>These workforce demographics are based on figures provided by your supplier to Issara Institute. Please note the figures correspond to the suppliers selected at top. </p></h6>)} interactive>
      <div className="cell-overflow">
        <h3 className={classes.center}>Workforce Demographics</h3>
      </div>
    </HtmlTooltip>
    <GridContainer>
      <GridItem xs={12} sm={12} md={4} lg={3}>
        <Card className={classes.largeStatContainer}>
          <span>
            <div className={`${classes.cardTitle} ${classes.largeStatNumber}`}> {Utils.formatNumber((() => {
              let total = 0;
              suppliers.forEach((item) => {
                let totalWorkers = (suppliersMap[item] && suppliersMap[item].total_num_workers !== undefined && suppliersMap[item].total_num_workers !== null) ? suppliersMap[item].total_num_workers : 0;
                total += totalWorkers;
              });
              return total;
            })())} </div>
            <p className={`${classes.cardCategory} ${classes.largeStatName}`}> Total</p>
          </span>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={8} lg={9}>
        <GridContainer>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}>
                {Utils.formatNumber((() => {
                  let total = 0;
                  suppliers.forEach((item) => {
                    let totalWorkers = (suppliersMap[item] && suppliersMap[item].total_num_thai_workers !== undefined && suppliersMap[item].total_num_thai_workers !== null) ? suppliersMap[item].total_num_thai_workers : 0;
                    total += totalWorkers;
                  });
                  return total;
                })())} </div>
              {(() => {
                let nationality = nationalities.find((nationalityItem) => {
                  return nationalityItem.name.toLowerCase().indexOf("thai") !== -1;
                });

                let sharedFileFlag = (nationality !== null && nationality !== undefined) ? sharedFiles.find((sharedFileItem) => {
                  return sharedFileItem.id === nationality.imageicon;
                }) : null;

                return (<span className={`${classes.cardCategory} ${classes.smallStatName}`}>
                  {sharedFileFlag && <img className={classes.galleryImg} src={sharedFileFlag.file_path} />}
                  Thai
                </span>);

              })()}
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}>
                {Utils.formatNumber((() => {
                  let total = 0;
                  suppliers.forEach((item) => {
                    let totalWorkers = (suppliersMap[item] && suppliersMap[item].total_num_cambodian_workers !== undefined && suppliersMap[item].total_num_cambodian_workers !== null) ? suppliersMap[item].total_num_cambodian_workers : 0;
                    total += totalWorkers;
                  });
                  return total;
                })())} </div>
              {(() => {
                let nationality = nationalities.find((nationalityItem) => {
                  return nationalityItem.name.toLowerCase().indexOf("cambodia") !== -1;
                });

                let sharedFileFlag = (nationality !== null && nationality !== undefined) ? sharedFiles.find((sharedFileItem) => {
                  return sharedFileItem.id === nationality.imageicon;
                }) : null;

                return (<span className={`${classes.cardCategory} ${classes.smallStatName}`}>
                  {sharedFileFlag && <img className={classes.galleryImg} src={sharedFileFlag.file_path} />}
                  Cambodia
                </span>);

              })()}
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}>
                {Utils.formatNumber((() => {
                  let total = 0;
                  suppliers.forEach((item) => {
                    let totalWorkers = (suppliersMap[item] && suppliersMap[item].total_num_myanmar_workers !== undefined && suppliersMap[item].total_num_myanmar_workers !== null) ? suppliersMap[item].total_num_myanmar_workers : 0;
                    total += totalWorkers;
                  });
                  return total;
                })())} </div>
              {(() => {
                let nationality = nationalities.find((nationalityItem) => {
                  return nationalityItem.name.toLowerCase().indexOf("burmese") !== -1;
                });

                let sharedFileFlag = (nationality !== null && nationality !== undefined) ? sharedFiles.find((sharedFileItem) => {
                  return sharedFileItem.id === nationality.imageicon;
                }) : null;

                return (<span className={`${classes.cardCategory} ${classes.smallStatName}`}>
                  {sharedFileFlag && <img className={classes.galleryImg} src={sharedFileFlag.file_path} />}
                  Myanmar
                </span>);

              })()}
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}>
                {Utils.formatNumber((() => {
                  let total = 0;
                  suppliers.forEach((item) => {
                    let totalWorkers = (suppliersMap[item] && suppliersMap[item].total_num_lao_workers !== undefined && suppliersMap[item].total_num_lao_workers !== null) ? suppliersMap[item].total_num_lao_workers : 0;
                    total += totalWorkers;
                  });
                  return total;
                })())} </div>
              {(() => {
                let nationality = nationalities.find((nationalityItem) => {
                  return nationalityItem.name.toLowerCase().indexOf("lao") !== -1;
                });

                let sharedFileFlag = (nationality !== null && nationality !== undefined) ? sharedFiles.find((sharedFileItem) => {
                  return sharedFileItem.id === nationality.imageicon;
                }) : null;

                return (<span className={`${classes.cardCategory} ${classes.smallStatName}`}>
                  {sharedFileFlag && <img className={classes.galleryImg} src={sharedFileFlag.file_path} />}
                  Lao
                </span>);

              })()}
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}>
                {Utils.formatNumber((() => {
                  let total = 0;
                  suppliers.forEach((item) => {
                    let totalWorkers = (suppliersMap[item] && suppliersMap[item].total_num_vietnamese_workers !== undefined && suppliersMap[item].total_num_vietnamese_workers !== null) ? suppliersMap[item].total_num_vietnamese_workers : 0;
                    total += totalWorkers;
                  });
                  return total;
                })())} </div>
              {(() => {

                let sharedFileFlag = sharedFiles.find((sharedFileItem) => {
                  return sharedFileItem.id === 31; // ID for shared file Vietnam
                });

                return (<span className={`${classes.cardCategory} ${classes.smallStatName}`}>
                  {sharedFileFlag && <img className={classes.galleryImg} src={sharedFileFlag.file_path} />}
                  Vietnamese
                </span>);

              })()}
            </Card>

          </GridItem>

        </GridContainer>
      </GridItem>
    </GridContainer>

  </div>)

}

/**
 * <CRCScoreSummaryPanels key={Utils.giveMeGuid()} workerInteractions={workerInteractions} />
 * @param {workerInteractions} props
 * @returns
 */
function CRCScoreSummaryPanels(props) {
  const classes = useStyles();

  const supplier = props.supplier;
  const workerInteractions = props.workerInteractions;
  const crcDataSummaryMap = Utils.generateCrCAveragesMap(workerInteractions.crcRawScored);
  let crcDataSummary = crcDataSummaryMap.get(supplier);

  if(!crcDataSummary) {
    return (null);
  }

  return (<div>
    <h3 className={classes.center}> Supplier Performance </h3>
    <GridContainer style={{ paddingLeft: "20%" }}>
      <GridItem xs={12} sm={6} md={6} lg={3}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card className={classes.gaugeContainer}>
              <div className={classes.gaugeBox}><SpeedometerStat value={crcDataSummary.quality_avg} /></div>
              <p className={classes.gaugeTableText}> Quality of Response </p>
            </Card>
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12} sm={6} md={6} lg={3}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card className={classes.gaugeContainer}>
              <div className={classes.gaugeBox}><SpeedometerStat value={crcDataSummary.timeliness_avg} /></div>
              <p className={classes.gaugeTableText}> Timeliness of Response </p>
            </Card>
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12} sm={6} md={6} lg={3}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card className={classes.gaugeContainer}>
              <div className={classes.gaugeBox}><SpeedometerStat value={crcDataSummary.openness_avg} /></div>
              <p className={classes.gaugeTableText}> Openness to Reform </p>
            </Card>
          </GridItem>
        </GridContainer>
      </GridItem>
    </GridContainer>
  </div>);
}



export default function SupplierKpiDashboard(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const supplierKPIs = useSelector((state) => { return state.suppliersReducer.supplierKPIs });
  const supplierKPIsList = useSelector((state) => { return state.suppliersReducer.supplierKPIsList });
  const supplierKPIUpdateItems = useSelector(state => state.suppliersReducer.supplierKPIUpdateItems);
  const kpiCategories = useSelector(state => state.kpisReducer)


  const sharedFiles = useSelector(state => state.sharedFilesReducer.sharedFiles);
  const sharedFilesMap = useSelector(state => state.sharedFilesReducer.sharedFilesMap);

  const nationalities = useSelector(state => state.nationalitiesReducer.items);

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const supplyChains = useSelector(state => state.supplyChainReducer.items)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.strategicPartners);
  const suppliersMap = useSelector(state => state.suppliersReducer.itemsMap)

  const [workerInteractions, setWorkerInteractions] = useState({})

  const [totalWorkerCalls, setTotalWorkerCalls] = useState({ x: ["x"], y: ["Worker Calls and Messages By Month"] });

  const [partnerObject, setPartnerObject] = useState(null);



  // FILTERS
  const [filters, setFilters] = useState({
    supplier: null,
    supplyChain: null,
    startTime: moment('2018-01-01'),
    endTime: moment(),
    search: ""
  });

  const [modal, setModal] = useState((null));


  const fetchMetricsFilters = () => {

    Promise.all([
      new Promise((resolve) => {
        HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/interactions?start=${filters.startTime && filters.startTime.unix() || ''}&end=${filters.endTime && filters.endTime.unix() || ''}&supplierIds=${(filters.supplier) ? "" + filters.supplier : ''}`,
          (interactions) => {
            setWorkerInteractions(interactions);

            const totalProvinceCallsNew = [];
            const totalNationalityCallsNew = [];

            interactions.nationalityByCallCount.forEach((item => {
              totalNationalityCallsNew.push([item.client_nationality__name, item.client_nationality__count, item.client_nationality__id]);
            }));


            interactions.districtsByCallCount.forEach((item => {
              totalProvinceCallsNew.push({ name: item.district__name, call_count: item.district__count, lng: item.lng, lat: item.lat });

            }));

            const totalWorkerCallsNew = { x: ["x"], y: ["Worker Calls and Messages By Month"] };

            interactions.caseCountByYearMonth.forEach((item => {
              totalWorkerCallsNew.x.push(item.month_year + "-01");
              totalWorkerCallsNew.y.push(item.call_count);
            }));


            setTotalWorkerCalls(totalWorkerCallsNew);

            resolve(interactions);
          },
          (err) => {
            console.log(err.message)
            resolve(err.message);
          }
        )
      })
    ]).then((resolve) => {
    });


  }


  useEffect(() => {

    dispatch(fetchNationalities());
    dispatch(fetchSharedFiles());
    dispatch(fetchSupplierKPIs());
    dispatch(fetchRecruiters());
    dispatch(fetchKPICategoryList());

    dispatch(fetchSupplyChains());
    dispatch(fetchStrategicPartners());
    if (suppliers === null || suppliers === undefined || suppliers.length < 1) {
      dispatch(fetchSuppliers());
    }
    dispatch(fetchSupplierKpiUpdates())

  }, []);

  useEffect(() => {
    fetchMetricsFilters()
    let partnerData = Utils.findPartnerAndSupplyChain(loginStore.getLoginUser(), supplyChains, strategicPartners);
    setPartnerObject(partnerData);

  }, [filters, supplierKPIUpdateItems]);


  const componentRef = useRef(this);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  if ((suppliers === null || suppliers === undefined || suppliers.length === undefined || suppliers.length < 1) ||
    (supplierKPIUpdateItems === null || supplierKPIUpdateItems === undefined || supplierKPIUpdateItems.length === undefined || supplierKPIUpdateItems.length < 1) ||
    (sharedFiles === null || sharedFiles === undefined || sharedFiles.length === undefined || sharedFiles.length < 1) ||
    (nationalities === null || nationalities === undefined || nationalities.length === undefined || nationalities.length < 1) ||
    (kpiCategories === null || kpiCategories === undefined) ||
    (kpiCategories.kpicategoryitems === null || kpiCategories.kpicategoryitems === undefined || kpiCategories.kpicategoryitems.length < 1) ||
    (totalWorkerCalls === null || totalWorkerCalls === undefined) ||
    (suppliersMap === null || suppliersMap === undefined || Object.keys(suppliersMap).length < 1) ||
    (supplierKPIs === null || supplierKPIs === undefined || Object.keys(supplierKPIs).length < 1) ||
    (workerInteractions === null || workerInteractions === undefined || Object.keys(workerInteractions).length < 1)) {
    return <CircularProgress />
  }

  let displayNode = (
    <div>

      {modal}

      <GridContainer className={classes.marginBottom}>

        <GridItem xs={6} sm={6} md={6} lg={6}>
          <SuppliersDropdown value={filters.supplier}
            multipleselect={false}
            filterSuppliers={(partnerObject && partnerObject.foundSupplyChain && partnerObject.foundSupplyChain.suppliers) ? partnerObject.foundSupplyChain.suppliers : null}
            onSelect={supplier => setFilters({
              supplier: supplier,
              supplyChain: null,
              endTime: (props.endTime) ? props.endTime : moment(),
              startTime: (props.startTime) ? props.startTime : moment('2018-01-01'),
              search: ""
            })} />
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
                  supplier: null,
                  supplyChain: null,
                  endTime: (props.endTime) ? props.endTime : moment(),
                  startTime: (props.startTime) ? props.startTime : moment('2018-01-01'),
                  search: ""
                })
              }> Reset all </Button>
          </FormControl>
        </GridItem>
      </GridContainer>

      {(!filters.supplier) ? (<div style={{ padding: "40px" }}>
        <Card><CardHeader><h4 className={classes.center}>* Please Select Supplier</h4></CardHeader></Card>
      </div>) :
        (<div>
          <GridContainer>
            <GridItem>
              <br />
            </GridItem>
            <GridItem>
              <br />
            </GridItem>
          </GridContainer>


          <SupplyChainWorkforceSummaryPanels suppliers={[filters.supplier]}
            suppliersMap={suppliersMap}
            sharedFiles={sharedFiles}
            nationalities={nationalities} />

          <GridContainer>
            <GridItem>
              <br />
            </GridItem>
            <GridItem>
              <br />
            </GridItem>
          </GridContainer>

          <CallsAndMessagesFromWorkersChart totalWorkerCalls={totalWorkerCalls} />


          <GridContainer>
            <GridItem>
              <br />
            </GridItem>
            <GridItem>
              <br />
            </GridItem>
          </GridContainer>


          <TotalWorkerCasesSummaryPanels workerInteractions={workerInteractions} sharedFiles={sharedFiles} nationalities={nationalities} />

          <CRCScoreSummaryPanels workerInteractions={workerInteractions} supplier={filters.supplier} />

          <SupplierKpisTimelineChart
            filters={filters} />

          <OpenClosedKpisListSummary key={Utils.giveMeGuid()} selectedSuppliers={[filters.supplier]} />


          {/*<h3 className={classes.center}>Response History </h3>
      <GridContainer>
        <GridItem xs={12}>
          <BusinessResponseInteractions />
        </GridItem>
      </GridContainer> */}
        </div>)}


    </div>
  );



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

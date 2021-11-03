import React, { useState, useEffect, useRef } from "react";

import Tooltip from '@material-ui/core/Tooltip';

import { useDispatch, useSelector } from "react-redux";


// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

import C3Chart from 'react-c3js';
import 'c3/c3.css';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import SpeedometerStat from './SpeedometerStat';
import SupplyChainFilter from "components/ilmdb/SupplyChainFilter.js";

import HttpService from "../../services/HttpService";

import ComponentToPrint from "./ComponentToPrint";
import { useReactToPrint } from 'react-to-print';

import { fetchRecruiters } from "redux/actions/RecruiterActions.js";
import { fetchSuppliers } from "../../redux/actions/SupplierActions";
import { fetchStrategicPartners, fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";
import { fetchSharedFiles } from "../../redux/actions/StrategicPartnerActions";
import { fetchNationalities } from "../../redux/actions/LocaleActions";
import Utils from "../../services/utils";

import loginStore from "../../redux/stores/LoginStore";

import { SupplyChainWorkforceSummaryPanels, TotalWorkerCasesSummaryPanels} from "./SupplierKpiDashboard";

import moment from "moment";

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
  },
  gaugeContainer: {
    textAlign: "center",
    width: "200px",
    height: "200px"

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


/**
 * 
 * @param {  <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>} param0 
 */

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


export default function SupplyChainDashboardWorker(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID = 3;
  const SUPPLIER_UPDATE_KPI_STATUS_OLD_ID = 4;

  const [init, setInit] = useState(false);


  const supplyChains = useSelector(state => state.supplyChainReducer.items)
  const supplyChainsMap = useSelector(state => state.supplyChainReducer.itemsMap)

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)
  const suppliersMap = useSelector(state => state.suppliersReducer.itemsMap)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.strategicPartners);
  const strategicPartnersMap = useSelector(state => state.strategicPartnerReducer.strategicPartnersMap);
  const sharedFiles = useSelector(state => state.sharedFilesReducer.sharedFiles);
  const sharedFilesMap = useSelector(state => state.sharedFilesReducer.sharedFilesMap);

  const nationalities = useSelector(state => state.nationalitiesReducer.items);

  const [workerInteractions, setWorkerInteractions] = useState({})
  const [fetchingInteractions, setFetchingInteractions] = useState(true);

  const [totalWorkerCalls, setTotalWorkerCalls] = useState({ x: ["x"], y: ["Hotline Calls By Month"] });



  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: null,
    supplyChain: null,
    startTime: moment('2019-01-01'),
    endTime: moment(),
    industry: null,
    subindustry: null,
    disableSupplyChainSelect: false,
    search: ""
  });

  const [modal, setModal] = useState((null));



  const fetchMetricsFilters = () => {

    Promise.all([
      new Promise((resolve) => {
        setFetchingInteractions(true);
        HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/interactions?start=${filters.startTime && filters.startTime.unix() || ''}&end=${filters.endTime && filters.endTime.unix() || ''}&supplierIds=${(filters.suppliers) ? "" + filters.suppliers : ''}`,
          (interactions) => {
            setWorkerInteractions(interactions);

            const totalProvinceCallsNew = [];
            const totalNationalityCallsNew = [];

            interactions.nationalityByCallCount.forEach((item => {
              totalNationalityCallsNew.push([item.client_nationality__name, item.client_nationality__count]);
            }));


            interactions.districtsByCallCount.forEach((item => {
              totalProvinceCallsNew.push({ name: item.district__name, call_count: item.district__count, lng: item.lng, lat: item.lat });

            }));

            const totalWorkerCallsNew = { x: ["x"], y: ["Hotline Calls By Month"] };

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
      console.log("resolve=", resolve);
      setFetchingInteractions(false);
    });


  }


  useEffect(() => {

    dispatch(fetchNationalities());
    dispatch(fetchSharedFiles());
    dispatch(fetchRecruiters());
    dispatch(fetchSupplyChains());
    dispatch(fetchStrategicPartners());
    dispatch(fetchSuppliers()); // Done for child controls/modal

  }, []);


  useEffect(() => {

    if (strategicPartners && strategicPartners.forEach !== undefined && strategicPartners.length > 0 &&
      supplyChains && supplyChains.forEach !== undefined && supplyChains.length > 0) {
      let partnerData = Utils.findPartnerAndSupplyChain(loginStore.getLoginUser(), supplyChains, strategicPartners);

      setFilters({
        ...filters,
        partner: partnerData.partnerFound,
        disableSupplyChainSelect: (partnerData.foundSupplyChain !== null),
        supplyChain: partnerData.foundSupplyChain,
        suppliers: (partnerData.foundSupplyChain && partnerData.foundSupplyChain.suppliers) ? (() => {
          let array = [];
          partnerData.foundSupplyChain.suppliers.forEach((supplierId) => {
            array.push("" + supplierId);
          });
          return array;
        })() : null

      });
    }

  }, [suppliers])


  useEffect(() => {
    fetchMetricsFilters();
  }, [filters]);


  const createSupplierWorkerTotals = (tsuppliersMap, tsuppliers) => {

    let total = 0;
    let returnVal = {
      total_num_workers: 0,
      total_num_thai_workers: 0,
      total_num_cambodian_workers: 0,
      total_num_myanmar_workers: 0,
      total_num_lao_workers: 0,
      total_num_vietnamese_workers: 0
    }

    if (!tsuppliersMap || Object.keys(tsuppliersMap).length < 1 || !tsuppliers || !tsuppliers.forEach || tsuppliers.length < 1) {
      return returnVal;
    }

    tsuppliers.forEach((item) => {

     
      if(!tsuppliersMap[item]) {
        return;
      }

      returnVal.total_num_thai_workers += (tsuppliersMap[item].total_num_thai_workers !== undefined &&
        tsuppliersMap[item].total_num_thai_workers !== null) ? tsuppliersMap[item].total_num_thai_workers : 0;

      returnVal.total_num_cambodian_workers += (tsuppliersMap[item].total_num_cambodian_workers !== undefined &&
        tsuppliersMap[item].total_num_cambodian_workers !== null) ? tsuppliersMap[item].total_num_cambodian_workers : 0;

      returnVal.total_num_myanmar_workers += (tsuppliersMap[item].total_num_myanmar_workers !== undefined &&
        tsuppliersMap[item].total_num_myanmar_workers !== null) ? tsuppliersMap[item].total_num_myanmar_workers : 0;

      returnVal.total_num_lao_workers += (tsuppliersMap[item].total_num_lao_workers !== undefined &&
        tsuppliersMap[item].total_num_lao_workers !== null) ? tsuppliersMap[item].total_num_lao_workers : 0;

      returnVal.total_num_vietnamese_workers += (tsuppliersMap[item].total_num_vietnamese_workers !== undefined &&
        tsuppliersMap[item].total_num_vietnamese_workers !== null) ? tsuppliersMap[item].total_num_vietnamese_workers : 0;


        returnVal.total_num_workers += (tsuppliersMap[item].total_num_thai_workers +
          tsuppliersMap[item].total_num_cambodian_workers +
          tsuppliersMap[item].total_num_myanmar_workers +
          tsuppliersMap[item].total_num_lao_workers +
          tsuppliersMap[item].total_num_vietnamese_workers );


    });

    return returnVal;
  }




  const componentRef = useRef(this);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (suppliers === undefined || suppliers === null || suppliers.length < 1) {
    return (<GridContainer><CircularProgress /></GridContainer>);
  }


  let supplierWorkerTotals = createSupplierWorkerTotals(suppliersMap, filters.suppliers);


  let displayNode = (
    <div>

      {modal}

      <GridContainer className={classes.marginBottom}>

        {((loginStore.isGlobalPartner() === false ||
          (loginStore.isGlobalPartner() === true && (filters.supplyChain === null || filters.supplyChain === undefined))) &&
          (suppliers === undefined || suppliers === null || suppliers.length < 1)) ? <div>Loading...</div> : <SupplyChainFilter key={Utils.giveMeGuid()}
            supplyChainValue={filters.supplyChain}
            startTime={filters.startTime}
            endTime={filters.endTime}
            industry={filters.industry}
            subindustry={filters.subindustry}
            suppliers={filters.suppliers}
            disableSupplyChainSelect={loginStore.isGlobalPartner() === true}
            onUpdateSummary={(selectedData) => {
              let suppliersMap = selectedData.suppliersMap;
              setFilters({
                ...filters,
                startTime: selectedData.startTime,
                endTime: selectedData.endTime,
                industry: selectedData.industry,
                subindustry: selectedData.subindustry,
                supplyChain: supplyChainsMap[selectedData.supplyChain],
                suppliers: (() => {
                  let array = [];
                  for (const [key, value] of Object.entries(suppliersMap)) {
                    array.push(key);
                  }
                  return array;
                })()

              });
            }} />}

      </GridContainer>


      <GridContainer>
        <GridItem>
          <br />
        </GridItem>
        <GridItem>
          <br />
        </GridItem>
      </GridContainer>

      {((filters.supplyChain === null || filters.supplyChain === undefined)) ? (<div></div>) : (<div>
        
        <GridContainer>
          <GridItem>
            <br />
          </GridItem>
          <GridItem>
            <br />
          </GridItem>
        </GridContainer>


        {(<div>

         

          <SupplyChainWorkforceSummaryPanels suppliers={filters.suppliers} 
                                             suppliersMap={suppliersMap} 
                                             sharedFiles={sharedFiles}
                                             nationalities={nationalities} />
          </div>)}

        
        <h3 className={classes.center}> Hotline Calls </h3>
        <h6 className={classes.center}><p>
          * The Hotline calls are a subset of all Issara worker voice channel traffic from workers at  the supplier site(s) selected above. The hotline calls are from Issara’s 24-hour multi-lingual toll-free hotline, staffed in-house by Issara team members who speak the same language as the callers.  The calls, nationalities, and gender figures at bottom represent the information displayed in the graph.
        </p></h6>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardBody>
                {totalWorkerCalls && totalWorkerCalls.x && totalWorkerCalls.y && 
                 totalWorkerCalls.y.length > 0 && totalWorkerCalls.x.length > 0 ?
                  <C3Chart key={Utils.giveMeGuid()} data={{
                    x: 'x',
                    columns: [
                      totalWorkerCalls.x,
                      totalWorkerCalls.y
                    ],
                    types: {
                      "Hotline Calls By Month": 'area-spline'
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
                  /> : <CircularProgress />
                }
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem>
            <br />
          </GridItem>
          <GridItem>
            <br />
          </GridItem>
        </GridContainer>

        <TotalWorkerCasesSummaryPanels workerInteractions={workerInteractions} sharedFiles={sharedFiles} nationalities={nationalities} />


        {/*<h3 className={classes.center}>Response History </h3>
      <GridContainer>
        <GridItem xs={12}>
          <BusinessResponseInteractions />
        </GridItem>
      </GridContainer> */}

      </div>
      )}

    </div>
  );


  return (
    <div>
      <h6>
        <p>
          You may select and filter suppliers to show your entire supply chain (default), suppliers by industry and by sub-industry, or specific supplier(s).  The date range further enables visibility of the selection over a specific timeframe (default is 1/1/2019 to present). The selections made will determine the supply chain analytics displayed below. Please press the Search button after selections are made.
      </p>
      </h6>
      <div style={{ display: "none" }}>
        <ComponentToPrint key={Utils.giveMeGuid()} ref={componentRef} render={() => {
          return (displayNode);
        }} />
      </div>
      { /*<Button onClick={handlePrint}>Print Report</Button>)*/}

      {((supplyChains === undefined || supplyChains === null || supplyChains.length < 1) &&
        (strategicPartners === undefined || strategicPartners === null || strategicPartners.length < 1) &&
        (suppliers === undefined || suppliers === null || suppliers.length < 1)) ? (<div>Loading...</div>) : displayNode}

    </div>);
}
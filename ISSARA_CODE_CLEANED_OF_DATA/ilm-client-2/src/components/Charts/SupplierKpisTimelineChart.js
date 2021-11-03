import React, { useState, useEffect, useRef } from "react";

// third party components
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Datetime from "react-datetime";
import { Chart } from "react-google-charts";

// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import SuppliersDropdown from 'components/ilmdb/SuppliersDropdown';
import { fetchKPICategoryList } from "redux/actions/IssueActions.js";
import { fetchSupplierKPIs, fetchSupplierKpiUpdates } from "redux/actions/SupplierActions.js";
import Utils from "../../services/utils";

import Paper from '@material-ui/core/Paper';
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";



const customStyles = {
  ...styles,
  checkRoot: {
    padding: 0
  },
  root: {
    flexGrow: 1
  },
  labelRoot: {
    margin: 0
  },
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
    //minWidth: "850px"
  }
};

const useStyles = makeStyles(customStyles);

const barColors = {
  CLOSED: '#F0F8FF',
  OPEN: '#FFC0CB',
  UPCOMING: 'grey'
}

function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}


export default function SupplierKpisTimelineChart(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  /*
1	Labour recruitment	1
4	Payment systems and transparency	1
5	Working conditions	1
8	Employer-employee communications and relations	1
9	Living and eating conditions	1
*/
  const kpi_category_id_order = [1, 4, 5, 8, 9];
  const [drawChart, setDrawChart] = useState(Utils.giveMeGuid());
  const kpiCategories = useSelector(state => state.kpisReducer)
  const supplierKPIsMap = useSelector(state => state.suppliersReducer.supplierKPIs);
  const supplierKpiUpdatesArray = useSelector(state => state.suppliersReducer.supplierKPIUpdateItems);
  const supplierKpiUpdatesMap = useSelector(state => state.suppliersReducer.supplierKpiUpdates);

  const fetchingSupplierKPIs = useSelector(state => state.suppliersReducer.fetchingSupplierKPIs);
  const fetchingSupplierKPIUpdates = useSelector(state => state.suppliersReducer.fetchingSupplierKpiUpdates);

  const [selectedCategory, setSelectedCategory] = useState(5) // Working Conditions
  const [filteredSupplierKpiUpdates, setFilteredSupplierKpiUpdates] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(()=>{
    window.addEventListener('resize', ()=>{

      if (!window.screenTop && !window.screenY) {
        setDrawChart(Utils.giveMeGuid())
      }

    })
  });


  useEffect(() => {
    const filteredArray = supplierKpiUpdatesArray.filter(
      kpiUpdate => (
        kpiUpdate.calls && kpiUpdate.calls.length > 0 &&
        props.filters.supplier === kpiUpdate.supplier
        && kpiUpdate.category_id == selectedCategory
        && moment(kpiUpdate.opened_at) >= props.filters.startTime
        && moment(kpiUpdate.opened_at) <= props.filters.endTime
      )
    )
    setFilteredSupplierKpiUpdates(filteredArray)
  }, [props.filters, selectedCategory])

  useEffect(() => {
    const kpiUpdatesMap = {}
    const unresolvedKpis = {} // stores old/unresolved KPIs

    filteredSupplierKpiUpdates.map(kpiUpdate => {
      if (kpiUpdate.status == 4) {
        if (unresolvedKpis[kpiUpdate.supplier_kpi]) {
          unresolvedKpis[kpiUpdate.supplier_kpi].add(kpiUpdate.opened_at)
        } else {
          unresolvedKpis[kpiUpdate.supplier_kpi] = new Set([kpiUpdate.opened_at])
        }
      }
      if (kpiUpdatesMap[kpiUpdate.supplier_kpi]) {
        if (kpiUpdatesMap[kpiUpdate.supplier_kpi][kpiUpdate.opened_at]) {
          kpiUpdatesMap[kpiUpdate.supplier_kpi][kpiUpdate.opened_at] = {
            closed_at: kpiUpdate.closed_at,
          }
        } else {
          kpiUpdatesMap[kpiUpdate.supplier_kpi][kpiUpdate.opened_at] = {
            closed_at: kpiUpdate.closed_at,
          }
        }
      } else {
        kpiUpdatesMap[kpiUpdate.supplier_kpi] = {
          [kpiUpdate.opened_at]: {
            closed_at: kpiUpdate.closed_at
          }
        }
      }
    })

    // Clean up unresolved KPIs
    Object.keys(unresolvedKpis).map(supplierKpiId => {
      [...unresolvedKpis[supplierKpiId]].map(openedAt => {
        if (kpiUpdatesMap[supplierKpiId] && kpiUpdatesMap[supplierKpiId][openedAt]) {
          delete kpiUpdatesMap[supplierKpiId][openedAt]
        }
      })
    })

    const data = []

    Object.keys(kpiUpdatesMap).map(supplierKpiId => {
      const sortedKpiHistory = sortObject(kpiUpdatesMap[supplierKpiId])

      Object.keys(sortedKpiHistory).map(openedAt => {
        const previousKpi = data[data.length - 1]
        const name = supplierKPIsMap[supplierKpiId].description

        const gapBar = [
          name,
          '', // closed
          barColors.CLOSED,
          previousKpi && previousKpi[0] == name ? moment(previousKpi[4]) : moment(props.filters.startTime),
          moment(openedAt)
        ]

        if (gapBar[3] > gapBar[4]) {
          gapBar[4] = gapBar[3].clone().add(30, 'days');
        }
        data.push(gapBar)


        const getBarEndTime = () => {
          if (kpiUpdatesMap[supplierKpiId][openedAt].closed_at && moment(kpiUpdatesMap[supplierKpiId][openedAt].closed_at) < moment(props.filters.endTime)) {
            return moment(kpiUpdatesMap[supplierKpiId][openedAt].closed_at)
          } else if (moment() < moment(props.filters.endTime)) {
            return moment()
          }
          return moment(props.filters.endTime)
        }

        const bar = [
          name,
          '', // open
          barColors.OPEN,
          moment(openedAt),
          getBarEndTime()
        ]

        if (bar[3] > bar[4]) {
          bar[4] = bar[3].clone().add(30, 'days');
        }
        data.push(bar)

        if (Object.keys(sortedKpiHistory).length - 1 == Object.keys(sortedKpiHistory).indexOf(openedAt)) {
          if (moment() < moment(props.filters.endTime)) {
            const toCurrentDate = [
              name,
              '', // closed or open
              kpiUpdatesMap[supplierKpiId][openedAt].closed_at ? barColors.CLOSED : barColors.OPEN,
              bar[4],
              moment().add(1, 'hours')
            ]
            data.push(toCurrentDate)

            const afterCurrentDate = [
              name,
              '', // future
              barColors.UPCOMING,
              toCurrentDate[4],
              moment(props.filters.endTime)
            ]
            data.push(afterCurrentDate)
          } else {
            const toFilterEndTime = [
              name,
              '', // closed or open
              kpiUpdatesMap[supplierKpiId][openedAt].closed_at ? barColors.CLOSED : barColors.OPEN,
              bar[4],
              moment(props.filters.endTime).add(1, 'days')
            ]
            data.push(toFilterEndTime)
          }
        }
      })
    })

    setChartData(data)
  }, [filteredSupplierKpiUpdates])


  return (<div key={drawChart}>
    <GridContainer className={classes.marginBottom}>
      <Card>
        <CardHeader>
          <h3> Supplier KPIs timeline chart </h3>
          {kpiCategories.fetchingKPICategories || kpiCategories.kpicategoryitems.length < 1 ?
            <p> Fetching KPI categories.. </p>
            :
            <div className={classes.root}>
            <AppBar style={{ backgroundColor: "#005B4C" }} position="static">
                <Tabs
                  variant="scrollable"
                  aria-label="KPI Categories"
                  value={selectedCategory}
                  onChange={(event, newValue) => setSelectedCategory(newValue)}
                  centered
                >

                  {(() => {
                    let itemsReturn = [];

                    kpi_category_id_order.forEach((kpi_kategory_id) => {
                      let found = kpiCategories.kpicategoryitems.find((item) => {
                        return item.id === kpi_kategory_id;
                      })
                      if (found) {
                        itemsReturn.push(found);
                      }
                    });

                    return itemsReturn;
                  })().map((category, index) =>
                    <Tab label={category.name} value={category.id} key={index} />
                  )}
                </Tabs>
            </AppBar>
            </div>
          }
          {(!props.filters.supplier) &&
            <p className='mt-1'> Please choose a supplier </p>
          }
          {props.filters.supplier && (filteredSupplierKpiUpdates.length < 1 || !chartData || chartData.length < 1) &&
            <p className='mt-1'> This supplier doesn't have any KPI History for the chosen period of time and category </p>
          }
        </CardHeader>
        <CardBody>
          {(selectedCategory && chartData && chartData.length > 0) ?
            <Chart
              className={classes.root}
              height={'400px'}
              chartType="Timeline"
              loader={<div>Loading Chart</div>}
              data={[
                [
                  { type: 'string', id: 'kpi' },
                  { type: 'string', id: 'dummyLabel' },
                  { type: 'string', role: 'style' },
                  { type: 'date', id: 'start' },
                  { type: 'date', id: 'end' },
                ],
                ...chartData
              ]}
              options={{
                avoidOverlappingGridLines: false,
                width: "100%",
                width_units: '%'
              }}
            /> : (null)
          }
        </CardBody>
      </Card>
    </GridContainer></div>
  );
}
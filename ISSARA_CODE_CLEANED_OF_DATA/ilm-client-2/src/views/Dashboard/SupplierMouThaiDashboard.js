import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BarChart from "../../components/barchart/BarChart";

import Tooltip from '@material-ui/core/Tooltip';

import ReactTable from "react-table-6";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

import C3Chart from 'react-c3js';
import 'c3/c3.css';
import * as d3 from "d3";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import Button from "components/CustomButtons/Button.js";


import SupplyChainFilter from "../../components/ilmdb/SupplyChainFilter.js";
import PieChart from 'components/Charts/Pie'
import StackedBar from 'components/Charts/StackedBar'



import { fetchStrategicPartners, fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";

import { fetchSuppliers } from "../../redux/actions/SupplierActions";

import { fetchRecruiters } from "../../redux/actions/RecruiterActions.js";


import HttpService from "../../services/HttpService";
import Utils from "services/utils";

import loginStore from "../../redux/stores/LoginStore";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

import ReactExport from "react-export-excel";
import moment from "moment";

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
const reducer = (accumulator, currentValue) => accumulator + currentValue


class DownloadSendData extends React.Component {
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
          <ExcelFile filename={"thai_mm_send_data"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="thai_mm_send_data">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="recruiter_name" value="recruiter_name" />
              <ExcelColumn label="supplier_name" value="supplier_name" />
              <ExcelColumn label="factory_type_name" value="factory_type_name" />
              <ExcelColumn label="industry_name" value="industry_name" />
              <ExcelColumn label="recruiter_name" value="recruiter_name" />
              <ExcelColumn label="province_name" value="province_name" />
              <ExcelColumn label="created" value="created" />
              <ExcelColumn label="record_date" value="record_date" />
              <ExcelColumn label="demand_approved_male" value="demand_approved_male" />
              <ExcelColumn label="demand_approved_female" value="demand_approved_female" />
              <ExcelColumn label="demand_approved_total" value="demand_approved_total" />
              <ExcelColumn label="visa_issued_male" value="visa_issued_male" />
              <ExcelColumn label="visa_issued_female" value="visa_issued_female" />
              <ExcelColumn label="visa_issued_total" value="visa_issued_total" />
              <ExcelColumn label="sending_male" value="sending_male" />
              <ExcelColumn label="sending_female" value="sending_female" />
              <ExcelColumn label="sending_total" value="sending_total" />
              <ExcelColumn label="smart_card_issued_male" value="smart_card_issued_male" />
              <ExcelColumn label="smart_card_issued_female" value="smart_card_issued_female" />
              <ExcelColumn label="smart_card_issued_total" value="smart_card_issued_total" />
              <ExcelColumn label="recruiter" value="recruiter" />
              <ExcelColumn label="supplier" value="supplier" />
              <ExcelColumn label="industry" value="industry" />
              <ExcelColumn label="subindustry" value="subindustry" />
              <ExcelColumn label="factory_type" value="factory_type" />
              <ExcelColumn label="province" value="province" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>
      </GridContainer>
    );
  }
}


class DownloadDemandData extends React.Component {
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
          <ExcelFile filename={"thai_mm_demand_data"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="thai_mm_demand_data">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="week" value="week" />
              <ExcelColumn label="year" value="year" />
              <ExcelColumn label="month" value="month" />
              <ExcelColumn label="year_month" value="year_month" />
              <ExcelColumn label="recruiter_name" value="recruiter_name" />
              <ExcelColumn label="supplier_name" value="supplier_name" />
              <ExcelColumn label="province" value="province" />
              <ExcelColumn label="industry" value="industry" />
              <ExcelColumn label="subindustry" value="subindustry" />
              <ExcelColumn label="num_males" value="num_males" />
              <ExcelColumn label="num_females" value="num_females" />
              <ExcelColumn label="num_total" value="num_total" />
              <ExcelColumn label="recruiter" value="recruiter" />
              <ExcelColumn label="supplier" value="supplier" />
              <ExcelColumn label="factorytype" value="factorytype" />
              <ExcelColumn label="ilm_industry" value="ilm_industry" />
              <ExcelColumn label="ilm_subindustry" value="ilm_subindustry" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>
      </GridContainer>
    );
  }
}


export default function SupplierMouThaiDashboard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [init, setInit] = useState(false);
  const [isPartner, setIsPartner] = useState((loginStore.isGlobalPartner() === true));

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const recruiters = useSelector(state => state.recruitersReducer.items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)
  const suppliersMap = useSelector(state => state.suppliersReducer.itemsMap)
  const supplyChains = useSelector(state => state.supplyChainReducer.items)
  const supplyChainsMap = useSelector(state => state.supplyChainReducer.itemsMap)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.strategicPartners);
  const strategicPartnersMap = useSelector(state => state.strategicPartnerReducer.strategicPartnersMap);

  const [mmThaiSendingData, setMMThaiSendingData] = useState([])
  const [totalSendDataRecruiter, setTotalSendDataRecruiter] = useState([]);
  const [mmFilteredThaiSendingData, setMMFilteredThaiSendingData] = useState([])
  const [fetchingMMThaiSendingData, setFetchingMMThaiSendingData] = useState(true);

  const [datesRange, setDatesRange] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [stackedBarByGender, setStackedBarByGender] = useState([])
  const [stackedBarRecruitersData, setStackedBarRecruitersData] = useState([])
  const [stackedBarRecruiters, setStackedBarRecruiters] = useState([])
  const [rerenderC3Chart, setRerenderC3Chart] = useState(false)
  const [colors, setColors] = useState({})

  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: null,
    supplyChain: null,
    partner: null,
    startTime: moment('1/1/2018'),
    endTime: moment('12/31/2019'),
    industry: null,
    subindustry: null,
    disableSupplyChainSelect: false,
    search: ""
  });

  const fetchMMThaiSendingData = () => {
    

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

    });
  }

  const setTotalSendingDataFilteredRecruiters = (tfilteredMMThaiSendingData) => {
    if (!tfilteredMMThaiSendingData === undefined || tfilteredMMThaiSendingData === null || tfilteredMMThaiSendingData.length === undefined) {
      setTotalSendDataRecruiter([]);
      return
    }

    const mapFoundRecruiter = new Map();
    const mapFoundDatesRecruiter = new Map();

    tfilteredMMThaiSendingData.forEach((mmThaiSendingRow) => {
      if (!mmThaiSendingRow.recruiter) {
        return;
      }
      let date = new Date(mmThaiSendingRow.record_date);
      let key = "" + mmThaiSendingRow.recruiter + "" + date.getFullYear() + ":" + date.getMonth();
      if (mapFoundDatesRecruiter.has(key) === false) {
        mapFoundDatesRecruiter.set(key, key);
        if (mapFoundRecruiter.has(mmThaiSendingRow.recruiter) === false) {
          mapFoundRecruiter.set(mmThaiSendingRow.recruiter, {
            recruiter_id: mmThaiSendingRow.supplier,
            supplier_name: mmThaiSendingRow.supplier_name,
            recruiter_name: mmThaiSendingRow.recruiter_name,
            data: {
              x: ["x"], y: ["Myanmar Government Sending Totals By Date"], ym: ["Male"], yf: ["Female"]
            }
          });
        }

        let foundSendingData = mapFoundRecruiter.get(mmThaiSendingRow.recruiter);
        foundSendingData.data.x.push(mmThaiSendingRow.record_date);
        foundSendingData.data.y.push(mmThaiSendingRow.sending_total);
        foundSendingData.data.ym.push(mmThaiSendingRow.sending_male);
        foundSendingData.data.yf.push(mmThaiSendingRow.sending_female);

      }

    });

    if (filters.supplyChain) {
      let recruiterSendingTotals = [];
      mapFoundRecruiter.forEach((value, key, map) => {
        recruiterSendingTotals.push(value);
      });

      recruiterSendingTotals = recruiterSendingTotals.sort(function (a, b) {
        return a.supplier_name.localeCompare(b.supplier_name);
      });

      setTotalSendDataRecruiter(recruiterSendingTotals);
    } else {
      setTotalSendDataRecruiter([]);
    }
  }


  const filterMetrics = () => {
    if (mmThaiSendingData) {
      const filteredMMThaiSendingData = mmThaiSendingData.filter(item => {
        return !filters.suppliers || (filters.suppliers.includes("" + item.supplier) &&
          (!filters.startTime || new Date(item.record_date).getTime() >= new Date(filters.startTime).getTime()) &&
          (!filters.endTime || new Date(item.record_date).getTime() <= new Date(filters.endTime).getTime()));
      });
      setMMFilteredThaiSendingData(filteredMMThaiSendingData);
      setTotalSendingDataFilteredRecruiters(filteredMMThaiSendingData);
    }
  }

  useEffect(() => {
    dispatch(fetchRecruiters());
    dispatch(fetchSupplyChains());
    dispatch(fetchStrategicPartners());

    if( suppliers === null || suppliers === undefined || suppliers.length === undefined || suppliers.length < 1 ) {
      dispatch(fetchSuppliers());
    } else {
      fetchMMThaiSendingData();
    }
  }, []);


  useEffect(() => {
    fetchMMThaiSendingData();
  }, [suppliers]);

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
  }, [mmThaiSendingData, strategicPartners, supplyChains])


  useEffect(() => {
    if (filters.supplyChain) {
      const datesArray = []
      const startTime = filters.startTime.clone()

      while (startTime.isBefore(filters.endTime)) {
        datesArray.push(startTime.format('YYYY-MM-01'));
        startTime.add(1, 'months');
      }

      const pieChartDataDict = new Object();
      const pieChartDataArray = [];

      const stackedBarDataDict = new Object();
      const stackedBarDataArray = [];
      const stackedBarRecruitersSet = new Set()

      const stackedBarByGenderDict = { female: {}, male: {} };
      const stackedBarByGenderArray = [];


      mmFilteredThaiSendingData.map(record => {
        stackedBarRecruitersSet.add(record.recruiter_name)

        // Populate pie chart data dict
        if (pieChartDataDict[record.recruiter]) {
          pieChartDataDict[record.recruiter].total_sent += record.sending_total
        } else {
          pieChartDataDict[record.recruiter] = {
            recruiter_name: record.recruiter_name,
            total_sent: record.sending_total
          }
        }

        // populate stacked bar chart data
        const date = record.record_date.split('-')
        const yearMonthDay = date[0] + '-' + date[1] + '-01'

        if (stackedBarDataDict[record.recruiter_name]) {
          if (stackedBarDataDict[record.recruiter_name][yearMonthDay]) {
            stackedBarDataDict[record.recruiter_name][yearMonthDay].sending_male += record.sending_male
            stackedBarDataDict[record.recruiter_name][yearMonthDay].sending_female += record.sending_female
            stackedBarDataDict[record.recruiter_name][yearMonthDay].sending_total += record.sending_total
          } else {
            stackedBarDataDict[record.recruiter_name][yearMonthDay] = {
              sending_male: record.sending_male,
              sending_female: record.sending_female,
              sending_total: record.sending_total
            }
          }
        } else {
          stackedBarDataDict[record.recruiter_name] = {
            [yearMonthDay]: {
              sending_male: record.sending_male,
              sending_female: record.sending_female,
              sending_total: record.sending_total
            }
          }
        }

        // stacked bar by gender data dict
        if (stackedBarByGenderDict['male'][yearMonthDay]) {
          stackedBarByGenderDict['male'][yearMonthDay] += record.sending_male
          stackedBarByGenderDict['female'][yearMonthDay] += record.sending_female
        } else {
          stackedBarByGenderDict['male'][yearMonthDay] = record.sending_male
          stackedBarByGenderDict['female'][yearMonthDay] = record.sending_female
        }
      })

      // PIE
      Object.values(pieChartDataDict).map(record => {
        pieChartDataArray.push({ name: record.recruiter_name, value: record.total_sent })
      })
      pieChartDataArray.sort((a, b) => b.value - a.value)
      setPieChartData(pieChartDataArray)

      // STACKED BAR BY RECRUITMENT AGENCY
      Object.keys(stackedBarDataDict).map(key => {
        const values = []
        datesArray.map(date => {
          if (stackedBarDataDict[key][date]) {
            values.push(stackedBarDataDict[key][date].sending_total)
          } else {
            values.push(0)
          }
        })
        stackedBarDataArray.push([key, ...values])
      })

      stackedBarDataArray.sort((a, b) => b.slice(1).reduce(reducer, 0) - a.slice(1).reduce(reducer, 0))

      // STACKED BAR BY GENDER
      Object.keys(stackedBarByGenderDict).map(key => {
        const values = []
        datesArray.map(date => {
          if (stackedBarByGenderDict[key][date]) {
            values.push(stackedBarByGenderDict[key][date])
          } else {
            values.push(0)
          }
        })
        stackedBarByGenderArray.push([key, ...values])
      })

      setStackedBarRecruitersData(stackedBarDataArray)
      setStackedBarByGender(stackedBarByGenderArray)
      setStackedBarRecruiters(stackedBarRecruitersSet)
      setDatesRange(datesArray)
      setRerenderC3Chart(false)
    }
  }, [mmFilteredThaiSendingData])


  useEffect(() => {
    setRerenderC3Chart(true)
    filterMetrics();
  }, [filters, mmThaiSendingData, suppliers]);

  const colorsGenerator = d3.scaleSequential(d3.interpolateRainbow).domain([0, stackedBarRecruitersData.length])

  useEffect(() => {
    const colorsMap = {}
    stackedBarRecruitersData.map((value, id) => {
      colorsMap[value[0]] = colorsGenerator(id)
    })
    setColors(colorsMap)
  }, [stackedBarRecruitersData])

  if (fetchingMMThaiSendingData === true || suppliers === undefined || suppliers === null || suppliers.length < 1 ||
    (isPartner === true && (filters.supplyChain === null || filters.supplyChain === undefined))) {
    return (<GridContainer><CircularProgress /></GridContainer>);
  }

  console.log(stackedBarByGender)

  let sendingNode = (!filters.supplyChain) ? (<Card><CardHeader><h4>Please select supply chain for Myanmar-Thai MOU Sending data</h4></CardHeader></Card>) : (
    <div>
      {loginStore.isIssaraManagement() &&
        <GridItem xs={12} md={12} lg={12}>
          {(mmFilteredThaiSendingData !== undefined && mmFilteredThaiSendingData.length !== undefined && mmFilteredThaiSendingData.length > 0) ? (<DownloadSendData key={Utils.giveMeGuid()} dataset={mmFilteredThaiSendingData} />) : (null)}
        </GridItem>
      }
      <GridContainer>
        <Card>
          <CardHeader>
            <h3>
              Number of workers recruited by Recruitment Agency
            </h3>
          </CardHeader>
          <CardBody>
            {pieChartData.length > 0 ?
              <PieChart data={pieChartData} />
              :
              <p> No data found </p>
            }
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3>
              Number of workers recruited by Recruitment Agency
            </h3>
          </CardHeader>
          <CardBody>
            {rerenderC3Chart ?
              <p> Rerendering... </p>
              :
              <C3Chart
                data={{
                  x: 'date',
                  columns: [
                    ['date', ...datesRange],
                    ...stackedBarRecruitersData
                  ],
                  type: 'bar',
                  groups: [
                    [...stackedBarRecruiters]
                  ],
                  colors: colors
                }}
                axis={{
                  x: {
                    type: 'timeseries',
                    tick: {
                      format: '%Y-%m',
                      // rotate: -45,
                    },
                    height: 60
                  }
                }}

                legend={{
                  show: false
                }}

                tooltip={{
                  show: true,
                  contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    var $$ = this, config = $$.config,
                      titleFormat = config.tooltip_format_title || defaultTitleFormat,
                      nameFormat = config.tooltip_format_name || function (name) { return name; },
                      valueFormat = config.tooltip_format_value || defaultValueFormat,
                      text, i, title, value, name, bgcolor;
                    for (i = 0; i < d.length; i++) {

                      if (
                        d[i] === null || d[i] === undefined ||
                        d[i].value === null || d[i].value === undefined
                        || d[i].value < 1) {
                        continue;
                      }

                      if (!text) {
                        title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                        text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                      }
                      name = nameFormat(d[i].name);
                      value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                      bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                      text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                      text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                      text += "<td class='value'>" + value + "</td>";
                      text += "</tr>";
                    }
                    return text + "</table>";
                  }
                }}
              />
            }
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3>
              Number of workers recruited by Gender
            </h3>
            {stackedBarByGender.length > 0 &&
              <div>
                <p style={{ margin: 0 }}> <b>Total:</b> {stackedBarByGender[0].slice(1).reduce(reducer, 0) + stackedBarByGender[1].slice(1).reduce(reducer, 0)} </p>
                <p style={{ margin: 0 }}> <b>Female:</b> {stackedBarByGender[0].slice(1).reduce(reducer, 0)}</p>
                <p style={{ margin: 0 }}> <b>Male:</b> {stackedBarByGender[1].slice(1).reduce(reducer, 0)}</p>
              </div>
            }
          </CardHeader>
          <CardBody>
            {rerenderC3Chart ?
              <p> Rerendering... </p>
              :
              <C3Chart
                data={{
                  x: 'date',
                  columns: [
                    ['date', ...datesRange],
                    ...stackedBarByGender
                  ],
                  type: 'bar',
                  groups: [
                    ['male', 'female']
                  ],
                  colors: {
                    male: 'teal',
                    female: '#ffeb3b',
                  },
                }}
                axis={{
                  x: {
                    type: 'timeseries',
                    tick: {
                      format: '%Y-%m',
                      // rotate: -45,
                    },
                    height: 45
                  }
                }}

                tooltip={{
                  show: true,
                  contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    var $$ = this, config = $$.config,
                      titleFormat = config.tooltip_format_title || defaultTitleFormat,
                      nameFormat = config.tooltip_format_name || function (name) { return name; },
                      valueFormat = config.tooltip_format_value || defaultValueFormat,
                      text, i, title, value, name, bgcolor;
                    for (i = 0; i < d.length; i++) {

                      if (
                        d[i] === null || d[i] === undefined ||
                        d[i].value === null || d[i].value === undefined
                        || d[i].value < 1) {
                        continue;
                      }

                      if (!text) {
                        title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                        text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                      }
                      name = nameFormat(d[i].name);
                      value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                      bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                      text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                      text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                      text += "<td class='value'>" + value + "</td>";
                      text += "</tr>";
                    }
                    return text + "</table>";
                  }
                }}
              />
            }
          </CardBody>
        </Card>
      </GridContainer>

    </div>
  );


  return (<div>
    <div>

      <GridContainer>
        <h6>
        YOU MAY SELECT AND FILTER SUPPLIERS TO SHOW YOUR ENTIRE SUPPLY CHAIN (DEFAULT), SUPPLIERS BY INDUSTRY AND BY SUB-INDUSTRY, OR SPECIFIC SUPPLIER(S). THE SELECTIONS MADE WILL DETERMINE THE SUPPLY CHAIN ANALYTICS DISPLAYED BELOW. PLEASE PRESS THE SEARCH BUTTON AFTER SELECTIONS ARE MADE. PLEASE ALSO NOTE THAT THE DATE RANGE SHOWS 1/1/2018 TO 12/31/2019. THIS IS THE FULL AVAILALBE RECRUTIMENT DATA -  CROSS BORDER RECRUITMENT HAS NOT TAKEN PLACE SINCE 2020 DUE TO COVID-19 BORDER CLOSURES
        </h6>
        {(//(mmThaiDemandData === undefined || mmThaiDemandData === null || mmThaiDemandData.length < 1) ||
          // (mmThaiSendingData === undefined || mmThaiSendingData === null || mmThaiSendingData.length < 1) ||
          ((loginStore.isGlobalPartner() === false ||
            (loginStore.isGlobalPartner() === true && (filters.supplyChain === null || filters.supplyChain === undefined))) &&
            (suppliers === undefined || suppliers === null || suppliers.length < 1))) ? <div><CircularProgress /></div>
          : <SupplyChainFilter key={Utils.giveMeGuid()}
            supplyChainValue={filters.supplyChain}
            startTime={filters.startTime}
            endTime={filters.endTime}
            minStartTime={moment('1/1/2018')}
            maxEndTime={moment('12/31/2019')}
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
    </div>
    <div><br /><br /></div>
    <div>
      {sendingNode}
    </div>
  </div>
  )
}

import React, { useState, useEffect, useRef } from "react";

import ComponentToPrint from "./ComponentToPrint";
import { useReactToPrint } from 'react-to-print';
import Utils from "../../services/utils";
import Pagination from "components/Pagination/Pagination2.js";
import { fetchStrategicPartners, fetchSharedFiles } from "../../redux/actions/StrategicPartnerActions";


// react plugin for creating charts

import C3Chart from 'react-c3js';
import 'c3/c3.css';
import * as d3 from "d3";
import Tooltip from '@material-ui/core/Tooltip';

import Datetime from "react-datetime";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import VisibilityIcon from '@material-ui/icons/Visibility';

import Edit from "@material-ui/icons/Edit";
import SpeedometerStat from './SpeedometerStat';

import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";

import HttpService from "../../services/HttpService";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown";
import { fetchRecruiters } from "../../redux/actions/RecruiterActions";
import { fetchSuppliers } from "../../redux/actions/SupplierActions";
import { fetchFieldworkActivities } from "../../redux/actions/TeamActivityActions";

import FieldworkActivityModal from "./FieldworkActivityModal";

import moment from "moment";
import ReactExport from "react-export-excel";
import loginStore from "../../redux/stores/LoginStore";


require('chartist-plugin-legend');

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
    padding: '1rem 1rem 1rem 1rem',
    margin: '10px 0 1rem 0'
  },
  marginBottom: {
    marginBottom: '1rem',
  },
  button: {
    padding: 0,
    margin: 0,
    cursor: "pointer;"
  },
  gaugeContainer: {
    textAlign: "center",
    width: "190px",
    height: "190px"

  },
  chartcontainerholder: {
    minWidth: "850px"
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


/*
 "id": 345,
            "fieldwork_date": "2020-08-23",
            "created_by": 43,
            "fieldwork_type_name": "O&E9. Worker empowerment session",
            "province_name": "Phetchaburi",
            "nationality_name": "Cambodia",
            "location": "Khao Yoi, Phetchaburi, Thailand",
            "outreach_target": 15,
            "fieldwork_notes": "The Cambodian team estimated to reach 15 workers. We could meet around 14 workers to conduct FGD for Khmer GD name, to meet with potential ambassadors at Petchaburi in order to re-engaged for potential ambassadors to provide training, identify the volunteer potential ambassadors to do testimony video on impact of engagement with ISSARA. The workers were interested and were very happy for participation in each activities. We did meet with its expected.",
            "created_at": "2020-10-02",
            "fieldwork_type": 9,
            "nationality": 2,
            "country": 8,
            "province": 64,
            "district": 463,
            "suppliers": [
                1110
            ],
            "recruiters": []
*/
class DownloadFieldWork extends React.Component {
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
          <ExcelFile filename={"field_work"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="field_work">
              <ExcelColumn label="id" value="id" />

              <ExcelColumn label="fieldwork_type_name" value="fieldwork_type_name" />
              <ExcelColumn label="province_name" value="province_name" />
              <ExcelColumn label="nationality_name" value="nationality_name" />
              <ExcelColumn label="location" value="location" />
              <ExcelColumn label="outreach_target" value="outreach_target" />
              <ExcelColumn label="fieldwork_notes" value="fieldwork_notes" />
              <ExcelColumn label="outreach_target" value="outreach_target" />
              <ExcelColumn label="fieldwork_type" value="fieldwork_type" />
              <ExcelColumn label="nationality" value="nationality" />
              <ExcelColumn label="country" value="country" />
              <ExcelColumn label="province" value="province" />
              <ExcelColumn label="district" value="district" />
              <ExcelColumn label="supplier_names" value="supplier_names" />
              <ExcelColumn label="recruiter_names" value="recruiter_names" />

            </ExcelSheet>
          </ExcelFile>
        </GridItem>

      </GridContainer>
    );
  }
}


export default function IssaraActivityDashboard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [filteredFieldworkActivities, setFilteredFieldworkActivities] = useState([])
  const [fetchingInteractions, setFetchingInteractions] = useState(true);
  const [monthlyWorkerVoice, setMonthlyWorkerVoice] = useState([])
  const fieldworkActivities = useSelector(state => state.teamActivityReducer.fieldworkActivities)
  const fetchingFieldworkActivities = useSelector(state => state.teamActivityReducer.fetchingFieldworkActivities)
  const [workerInteractions, setWorkerInteractions] = useState({})
  const [fetchingMonthlyWorkerVoice, setFetchingMonthlyWorkerVoice] = useState(true);

  const recruiters = useSelector(state => state.recruitersReducer.recruiters)
  const fetchingRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)
  const suppliers = useSelector(state => state.suppliersReducer.suppliers_items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)

  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)


  const workerVoiceCaseCalls = useSelector((state) => {
    return state.workerVoiceCaseCallsReducer.items;
  });

  const [totalWorkerCalls, setTotalWorkerCalls] = useState({ x: ["x"], y: ["worker_calls_count_by_month"] });

  const [totalFieldVisits, setTotalFieldVisits] = useState({ x: ["x"], y: ["field_visit_count_by_month"] });

  const [totalFieldWorkersReached, setTotalFieldWorkersReached] = useState(0);
  const [totalFieldWorkersReachedList, setTotalFieldWorkersReachedList] = useState({ x: ["x"], y: ["field_workers_reached_by_month"] });

  const colorsGenerator = d3.scaleSequential(d3.interpolateRainbow).domain([0, 11])


  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: null,
    src_recruiters: null,
    dest_recruiters: null,
    startTime: moment('2018-01-01'),
    endTime: moment(),
    search: ""
  });

  const [modal, setModal] = useState({
    open: false,
    id: null
  });



  const fetchMetrics = () => {
    setFetchingInteractions(true)
    HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/interactions?start=${filters.startTime && filters.startTime.unix() || ''}&end=${filters.endTime && filters.endTime.unix() || ''}&supplierIds=${(filters.suppliers) ? "" + filters.suppliers : ''}&dest_recruiter_Ids=${(filters.dest_recruiter_Ids) ? "" + filters.dest_recruiter_Ids : ''}&src_recruiterIds=${(filters.src_recruiters) ? "" + filters.src_recruiters : ''}`,
      (interactions) => {
        setWorkerInteractions(interactions)
        setFetchingInteractions(false)
      },
      (err) => { console.log(err.message) }
    );

    setFetchingMonthlyWorkerVoice(true);
    HttpService.get(`${process.env.REACT_APP_API_URL}/metrics/monthly-worker-voice?start=${filters.startTime && filters.startTime.unix() || ''}&end=${filters.endTime && filters.endTime.unix() || ''}`,
      (response) => {
        setMonthlyWorkerVoice(response)
        setFetchingMonthlyWorkerVoice(false);
      },
      (err) => {
        console.log(err.message)
      }
    );


  }

  const filterWorkerVoiceCaseCallsMetrics = () => {
    // FILTER FIELDWORK ACTIVITIES

    const totalWorkerCallsNew = { x: ["x"], y: ["worker_calls_count_by_month"] };


    (workerInteractions && workerInteractions.caseCountByYearMonth) && workerInteractions.caseCountByYearMonth.forEach((item => {
      totalWorkerCallsNew.x.push(item.month_year + "-01");
      totalWorkerCallsNew.y.push(item.call_count);
    }));



    setTotalWorkerCalls(totalWorkerCallsNew);

  }



  const filterFieldActivityMetrics = () => {
    // FILTER FIELDWORK ACTIVITIES
    let fieldworkActivitiesToBeFiltered = ((mapObject) => {
      let asArray = [];
      Object.keys({ ...mapObject }).map(key => {
        asArray.push(mapObject[key]);
      });
      return asArray;
    })(fieldworkActivities);

    const fieldworkActivitiesFiltered = []
    const mapDateFieldfield_visit_count_by_month = new Map();
    const mapDateFieldfield_workers_reached_by_month = new Map();

    const totalFieldVisitsNew = { x: ["x"], y: ["field_visit_count_by_month"] };
    const totalFieldWorkersReachedListNew = { x: ["x"], y: ["field_workers_reached_by_month"] };
    let totalFieldWorkersReachedNew = 0;

    if (filters.search !== undefined && filters.search.length > 1) {
      fieldworkActivitiesToBeFiltered = Utils.findStringInObjectFields(fieldworkActivitiesToBeFiltered, filters.search, ["id",
        "fieldwork_date",
        "fieldwork_type_name",
        "supplier_names",
        "recruiter_names",
        "location",
        "outreach_target",
        "fieldwork_notes"
      ]);
    }


    fieldworkActivitiesToBeFiltered.forEach(fieldworkActivity => {
      let fieldWorkDate = new Date(fieldworkActivity.fieldwork_date);
      let monthKey = "" + fieldWorkDate.getFullYear() + "-" + ((fieldWorkDate.getMonth() + 1) < 10 ? "0" + (fieldWorkDate.getMonth() + 1) : (fieldWorkDate.getMonth() + 1)) + "-01";

      let pastSupplierTest = (!filters.suppliers || ((() => {
        let found = false;
        filters.suppliers.forEach((supplierId) => {
          if (found === false) {
            found = fieldworkActivity.suppliers.includes(supplierId);
          }
        });

        return found;
      })() === true));

      let pastRecruiterTest = (!filters.recruiters || ((() => {
        let found = false;
        filters.recruiters.forEach((recruiterId) => {
          if (found === false) {
            found = fieldworkActivity.recruiters.includes(recruiterId);
          }
        });

        return found;
      })() === true));


      let afterTimePastTest = ((!filters.startTime) || (fieldWorkDate.getTime() >= new Date(filters.startTime).getTime()));
      let beforeTimePastTest = ((!filters.endTime) || (fieldWorkDate.getTime() <= new Date(filters.endTime).getTime()));

      if (pastSupplierTest === true && pastRecruiterTest && afterTimePastTest === true && beforeTimePastTest === true) {

        fieldworkActivity.supplier_names = ((suppliers_values) => {
          let names = []
          if (suppliers && suppliers.length > 0) {
            const filteredSuppliers = suppliers_values.map(item => {
              return suppliers.find((element) => {
                return element.id === item
              })
            })
            names = filteredSuppliers.map(item => {
              return item.name
            })
          }
          return names.join(', ') || '-';
        })(fieldworkActivity.suppliers);

        fieldworkActivity.recruiter_names = ((recruiters_values) => {
          let names = []
          if (recruiters && recruiters.length > 0) {
            const filteredRecruiters = recruiters_values.map(item => {
              return recruiters.find((element) => {
                return element.id === item
              })
            })
            names = filteredRecruiters.map(item => {
              return item && item.name
            })
          }
          return names.join(', ') || '-';
        })(fieldworkActivity.recruiters);

        fieldworkActivitiesFiltered.push(fieldworkActivity);

        if (fieldworkActivity.fieldwork_date !== null && fieldworkActivity.fieldwork_date !== undefined && fieldworkActivity.fieldwork_date !== "") {
          if (mapDateFieldfield_visit_count_by_month.has(monthKey) === false) {
            mapDateFieldfield_visit_count_by_month.set(monthKey, 1);
          } else {
            mapDateFieldfield_visit_count_by_month.set(monthKey, mapDateFieldfield_visit_count_by_month.get(monthKey) + 1);
          }

          let targetNumber = (fieldworkActivity.outreach_target) ? fieldworkActivity.outreach_target : 0;
          totalFieldWorkersReachedNew = totalFieldWorkersReachedNew + targetNumber;
          if (mapDateFieldfield_workers_reached_by_month.has(monthKey) === false) {
            mapDateFieldfield_workers_reached_by_month.set(monthKey, targetNumber);
          } else {
            mapDateFieldfield_workers_reached_by_month.set(monthKey, mapDateFieldfield_workers_reached_by_month.get(monthKey) + targetNumber);
          }
        }

      }

    });

    let iterator1 = mapDateFieldfield_visit_count_by_month.keys();
    for (var next = iterator1.next(); !next || !next.done; next = iterator1.next()) {
      let key = next.value;
      let value = mapDateFieldfield_visit_count_by_month.get(key);

      totalFieldVisitsNew.x.push(key);
      totalFieldVisitsNew.y.push(value);
    }

    iterator1 = mapDateFieldfield_workers_reached_by_month.keys();
    for (var next = iterator1.next(); !next || !next.done; next = iterator1.next()) {
      let key = next.value;
      let value = mapDateFieldfield_workers_reached_by_month.get(key);

      totalFieldWorkersReachedListNew.x.push(key);
      totalFieldWorkersReachedListNew.y.push(value);

    }

    setTotalFieldVisits(totalFieldVisitsNew);
    setTotalFieldWorkersReached(totalFieldWorkersReachedNew);
    setTotalFieldWorkersReachedList(totalFieldWorkersReachedListNew);
    setFilteredFieldworkActivities(fieldworkActivitiesFiltered);

  }


  const redirectToEditActivity = (id) => {
    props.history.push(`/admin/fieldwork-activity?id=${id}`);
  }

  const viewEditButton = (id) => {
    return (<div>
      <Button
        title={"Edit: " + id}
        simple
        color="success"
        value={id}
        className={classes.button}
        onClick={(e) => redirectToEditActivity(e.currentTarget.value)}
      >
        <Edit style={{ cursor: "pointer" }} />
      </Button></div>
    )
  }


  const viewFieldworkActivityButton = (id) => {
    return (<div>
      <Button
        simple
        color="info"
        className={classes.button}
        onClick={e => setModal({ open: true, id: id })}
      >
        <VisibilityIcon />
      </Button></div>
    )
  }



  const montlyWorkerVoiceFiltered = new Array();

  monthlyWorkerVoice.forEach((item) => {
    if (item.month_year) {
      montlyWorkerVoiceFiltered.push(item);
    }
  });

  useEffect(() => {

    if (strategicPartners === null || strategicPartners === undefined || strategicPartners.length < 1) {
      dispatch(fetchStrategicPartners());
    }
    if (suppliers === null || suppliers === undefined || suppliers.length < 1) {
      dispatch(fetchSuppliers());
    }

    if (recruiters === null || recruiters === undefined || recruiters.length < 1) {
      dispatch(fetchRecruiters());
    }

    dispatch(fetchFieldworkActivities());
    fetchMetrics();
    
  }, []);

  useEffect(() => {

    fetchMetrics();
    
  }, [filters]);


  useEffect(() => {
    filterFieldActivityMetrics()
    filterWorkerVoiceCaseCallsMetrics();
  }, [fieldworkActivities, suppliers, recruiters]);

  const componentRef = useRef(this);
  const currentUser = loginStore.getLoginUser();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });



  if ((fieldworkActivities === null || fieldworkActivities === undefined || Object.keys(fieldworkActivities).length < 1) ||
    (suppliers === null || suppliers === undefined || Object.keys(suppliers).length < 1)
  ) {
    return <CircularProgress />
  }


  let displayNode = (<div>
    <GridContainer className={classes.marginBottom}>
      <FieldworkActivityModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
      <GridItem sm={6} lg={6}>
        <SuppliersDropdown multipleselect={true}
          value={filters.suppliers}
          onSelect={suppliers => setFilters({ ...filters, suppliers: (suppliers && suppliers.length < 1) ? null : suppliers })} />

      </GridItem>

      <GridItem xs={6} sm={2} lg={2} xl={1}>
        <InputLabel className={classes.label}>Between</InputLabel>
        <FormControl fullWidth>
          <Datetime
            value={filters.startTime}
            timeFormat={false}
            inputProps={{ placeholder: "Start" }}
            onChange={date => {
              let newDate = (!date || date === "") ? moment('2018-01-01') : date;
              setFilters({ ...filters, startTime: newDate })
            }}
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
            onChange={date => {
              let newDate = (!date || date === "") ? moment() : date;
              setFilters({ ...filters, endTime: newDate })
            }} closeOnSelect={true}
          />
        </FormControl>
      </GridItem>
      <GridItem xs={12} sm={2} lg={2} xl={2}>
        <FormControl justify="center">
          <Button
            color="rose"
            onClick={
              () => setFilters({
                suppliers: null,
                src_recruiters: null,
                dest_recruiters: null,
                startTime: moment('2018-01-01'),
                endTime: moment()
              })
            }> Reset all </Button>
        </FormControl>
      </GridItem>
    </GridContainer>
    <GridContainer>
      <GridItem xs={12}>
        <Card className={classes.chartcontainerholder}>
          <CardHeader>
            {fetchingMonthlyWorkerVoice ?
              <CircularProgress />
              : ((!montlyWorkerVoiceFiltered || montlyWorkerVoiceFiltered.length < 2) ? (<div>No Data found</div>) : <C3Chart data={{
                x: "x",

                columns: [
                  (() => {
                    let array = montlyWorkerVoiceFiltered.map(item => {
                      return item.month_year;
                    }); array.unshift("x"); return array;
                  })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.mm_fb_total); array.unshift('MM Facebook Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.mm_viber_total); array.unshift('MM Viber Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.mm_hotline_total); array.unshift('MM Hotline Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.mm_line_total); array.unshift('MM Line Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.yangon_hotline_total); array.unshift('Yangon Hotline Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.cb_hotline_total); array.unshift('CB Hotline Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.cb_fb_total); array.unshift('CB Facebook Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.cb_line_total); array.unshift('CB Line Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.thai_hotline_total); array.unshift('TH Hotline Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.thai_fb_total); array.unshift('TH Facebook Total'); return array })(),
                  (() => { let array = montlyWorkerVoiceFiltered.map(item => item.thai_line_total); array.unshift('TH Line Total'); return array })(),
                ],
                types: {
                  'MM Hotline Total': 'bar',
                  'Yangon Hotline Total': 'bar',
                  'MM Facebook Total': 'bar',
                  'MM Line Total': 'bar',
                  'MM Viber Total': 'bar',
                  'CB Hotline Total': 'bar',
                  'CB Facebook Total': 'bar',
                  'CB Line Total': 'bar',
                  'TH Hotline Total': 'bar',
                  'TH Facebook Total': 'bar',
                  'TH Facebook Total': 'bar'
                },
                groups: [[
                  'MM Facebook Total',
                  'MM Viber Total',
                  'MM Hotline Total',
                  'MM Line Total',
                  'Yangon Hotline Total',
                  'CB Hotline Total',
                  'CB Facebook Total',
                  'CB Line Total',
                  'TH Hotline Total',
                  'TH Facebook Total',
                  'TH Facebook Total']
                ],
                colors: {
                  'MM Facebook Total': colorsGenerator(0),
                  'MM Viber Total': colorsGenerator(1),
                  'MM Hotline Total': colorsGenerator(2),
                  'MM Line Total': colorsGenerator(3),
                  'Yangon Hotline Total': colorsGenerator(4),
                  'CB Hotline Total': colorsGenerator(5),
                  'CB Facebook Total': colorsGenerator(6),
                  'CB Line Total': colorsGenerator(7),
                  'TH Hotline Total': colorsGenerator(8),
                  'TH Facebook Total': colorsGenerator(9),
                  'TH Facebook Total': colorsGenerator(10)
                }
              }}

                grid={{
                  x: {
                    show: true,
                    tick: {
                      fit: false,
                      show: false,
                      //count: 29,
                      rotate: -75,
                      multiline: false
                    }
                  },
                  y: {
                    show: true
                  }
                }}


                bar={{
                  width: 10 // this makes bar width 100px
                }}


                legend={{
                  position: 'bottom'
                }}

                point={{
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

                axis={{
                  x: {
                    type: 'timeseries',
                    tick: {
                      format: '%Y-%m-%d'
                    }
                  }
                }} />)
            }
          </CardHeader>
        </Card>
      </GridItem>

    </GridContainer>


    <h3 className={classes.center}> Worker Metrics </h3>
    <GridContainer>
      <GridItem xs={12} sm={12} md={4} lg={3}>
        <Card className={classes.largeStatContainer}>
          <CardHeader>
            <div className={`${classes.cardTitle} ${classes.largeStatNumber}`}> {fetchingInteractions ? <CircularProgress /> : workerInteractions.caseDataSummary.total} </div>
            <p className={`${classes.cardCategory} ${classes.largeStatName}`}> Total Worker Cases </p>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={8} lg={9}>
        <GridContainer>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <CardHeader>
                <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions ? <CircularProgress size={25} /> : workerInteractions.caseDataSummary.men} </div>
                <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Men </p>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <CardHeader>
                <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions ? <CircularProgress size={25} /> : workerInteractions.caseDataSummary.women} </div>
                <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Women </p>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={4} md={4} lg={4}>
            <Card className={classes.smallStatContainer}>
              <CardHeader>
                <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {fetchingInteractions ? <CircularProgress size={25} /> : workerInteractions.caseDataSummary.total - (workerInteractions.caseDataSummary.women + workerInteractions.caseDataSummary.men)} </div>
                <p className={`${classes.cardCategory} ${classes.smallStatName}`}> Unknown </p>
              </CardHeader>
            </Card>
          </GridItem>

          {fetchingInteractions ? <CircularProgress size={25} /> : workerInteractions.ethnicityByCallCount.map((item) => {
            return (<GridItem xs={6} sm={4} md={4} lg={4}>
              <Card className={classes.smallStatContainer}>
                <CardHeader>
                  <div className={`${classes.cardTitle} ${classes.smallStatNumber}`}> {item.client_ethnicity__count} </div>
                  <p className={`${classes.cardCategory} ${classes.smallStatName}`}>{item.client_ethnicity__name} </p>
                </CardHeader>
              </Card>
            </GridItem>);
          })}

        </GridContainer>
      </GridItem>
    </GridContainer>

    <GridContainer>
      <GridItem xs={12}>
        <Card className={classes.chartcontainerholder}>
          <CardHeader>
            {!totalWorkerCalls || !totalWorkerCalls.x ?
              <CircularProgress />
              : ((totalWorkerCalls.x.length < 2) ? <div>No Data Found</div> : <C3Chart key={Utils.giveMeGuid()} data={{
                x: 'x',
                columns: [
                  totalWorkerCalls.x,
                  totalWorkerCalls.y
                ],
                types: {
                  worker_calls_count_by_month: 'area-spline'
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
              />)
            }
          </CardHeader>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={12} md={12} lg={12}>
        <Card className={classes.largeStatContainer}>
          <CardHeader>
            <div className={`${classes.cardTitle} ${classes.largeStatNumber}`}> {fetchingFieldworkActivities ? <CircularProgress size={25} /> : filteredFieldworkActivities.length} </div>
            <p className={`${classes.cardCategory} ${classes.largeStatName}`}>Total field visits</p>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card className={classes.chartcontainerholder}>
          <CardHeader>
            {!totalFieldVisits ?
              <CircularProgress />
              : (totalFieldVisits.x.length < 2) ? (<div>No Data found</div>) : (<C3Chart key={Utils.giveMeGuid()} data={{
                x: 'x',
                columns: [
                  totalFieldVisits.x,
                  totalFieldVisits.y
                ],
                types: {
                  field_visit_count_by_month: 'area-spline'
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

              />)
            }
          </CardHeader>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={12} md={12} lg={12}>
        <Card className={classes.largeStatContainer}>
          <CardHeader>
            <div className={`${classes.cardTitle} ${classes.largeStatNumber}`}> {totalFieldWorkersReached} </div>
            <p className={`${classes.cardCategory} ${classes.largeStatName}`}>Total Workers Reached</p>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card className={classes.chartcontainerholder}>
          <CardHeader>
            {!totalFieldWorkersReachedList ?
              <CircularProgress />
              : ((totalFieldWorkersReachedList.x.length < 2 ) ? <div>No Data Found</div> : <C3Chart key={Utils.giveMeGuid()} data={{
                x: 'x',
                columns: [
                  totalFieldWorkersReachedList.x,
                  totalFieldWorkersReachedList.y
                ],
                types: {
                  field_workers_reached_by_month: 'area-spline'
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

              />)
            }
          </CardHeader>
        </Card>
      </GridItem>

    </GridContainer>
  </div>);


  let tableNode = (<GridContainer>
    {currentUser && currentUser.groups && currentUser.groups.includes('Issara Management') &&
      <GridItem xs={12} md={12} lg={12}>
        {(filteredFieldworkActivities !== undefined && filteredFieldworkActivities.length !== undefined && filteredFieldworkActivities.length > 0) ? (<DownloadFieldWork key={Utils.giveMeGuid()} dataset={filteredFieldworkActivities} />) : (null)}
      </GridItem>
    }

    <GridItem xs={12}>
      <h4>Search Results(Found: {filteredFieldworkActivities ? filteredFieldworkActivities.length : 0})</h4>
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

    <GridItem xs={12} sm={12} md={12} lg={12}>
      <Card className={classes.outreachTable}>
        { <ReactTable PaginationComponent={Pagination}

          defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
          filterable={true}

          data={filteredFieldworkActivities}
          key={Utils.giveMeGuid()}
          defaultPageSize={5}
          className="-striped -highlight"
          loading={fetchingSuppliers || fetchingRecruiters || fetchingFieldworkActivities}
          defaultSorted={[{
            id: 'fieldwork_date',
            desc: true,
          }]}
          columns={[
            {
              Header: "ID",
              accessor: "id",
              maxWidth: 90,
              sortable: true
            }, {
              Header: "Date",
              accessor: "fieldwork_date",
              maxWidth: 100,
              sortable: true
            },
            {
              Header: "Type",
              accessor: "fieldwork_type_name",
              sortable: true,
              maxWidth: 200,
              Cell: props => (
                <HtmlTooltip title={props.value} interactive>
                  <div className="cell-overflow">
                    {props.value}
                  </div>
                </HtmlTooltip>)
            },
            {
              Header: "Suppliers",
              accessor: "supplier_names",
              sortable: true,
              maxWidth: 200,
              Cell: props => (
                <HtmlTooltip title={props.value} interactive>
                  <div className="cell-overflow">
                    {props.value}
                  </div>
                </HtmlTooltip>)
            },
            {
              Header: "Recruiters",
              accessor: "recruiter_names",
              sortable: true,
              maxWidth: 200,
              Cell: props => (
                <HtmlTooltip title={props.value} interactive>
                  <div className="cell-overflow">
                    {props.value}
                  </div>
                </HtmlTooltip>)
            },
            {
              Header: "Location",
              accessor: "location",
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
              Header: "Target",
              accessor: "outreach_target",
              width: 80
            },
            {
              Header: "Notes",
              accessor: "notes",
              sortable: true,
              Cell: props => (
                <HtmlTooltip title={props.value} interactive>
                  <div className="cell-overflow">
                    {Utils.shortenString(props.value, 80)}
                  </div>
                </HtmlTooltip>)
            },
            {
              Header: "",
              sortable: false,
              accessor: "id",
              width: 30,
              Cell: props => (
                viewEditButton(props.value)
              ),
            },
            {
              Header: "",
              sortable: false,
              accessor: "id",
              width: 30,
              Cell: props => (
                viewFieldworkActivityButton(props.value)
              ),
            },
            {
              Header: "",
              sortable: false,
              width: 20
            }

          ]}
        />}
      </Card>
    </GridItem>

  </GridContainer>)


  return (
    <div>
      <div style={{ display: "none" }}>
        <ComponentToPrint key={Utils.giveMeGuid()} ref={componentRef} render={() => {
          return (displayNode);
        }} />
      </div>
      <Button onClick={handlePrint}>Print Report</Button>
      {displayNode}
      {tableNode}
    </div>);
}

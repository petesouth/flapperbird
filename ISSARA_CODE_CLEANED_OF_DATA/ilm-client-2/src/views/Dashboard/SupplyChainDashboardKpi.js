import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import Tooltip from '@material-ui/core/Tooltip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useDispatch, useSelector } from "react-redux";


import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";
import queryString from 'query-string'

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

import C3Chart from 'react-c3js';
import 'c3/c3.css';

import * as d3 from "d3";


import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CustomInput from "components/CustomInput/CustomInput.js";
import PieChart from 'components/Charts/Pie'

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";


import { fetchSupplierKPIs } from "../../redux/actions/SupplierActions.js";
import { fetchStrategicPartners, fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";
import { fetchRecruiters } from "../../redux/actions/RecruiterActions.js";
import { fetchSuppliers } from "../../redux/actions/SupplierActions";
import Utils from "../../services/utils";

import loginStore from "../../redux/stores/LoginStore";

import moment from "moment";

import SupplyChainFilter from "../../components/ilmdb/SupplyChainFilter.js";




import ComponentToPrint from "./ComponentToPrint";
import { useReactToPrint } from 'react-to-print';


import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";


const customStyles = {
  ...styles,
  ...customCheckboxRadioSwitch,
  checkRoot: {
    padding: 0
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



const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



function CategoryKPIsBySupplierChart(props) {
  const classes = useStyles();

  const kpis = (props.kpis) ? props.kpis : [];
  const header = props.header;
  const supplierKPIs = useSelector((state) => { return state.suppliersReducer.supplierKPIs });
  const suppliers = useSelector(state => state.suppliersReducer.items)
  const allSuppliersMap = useSelector(state => state.suppliersReducer.itemsMap)

  if (!supplierKPIs || !suppliers || !allSuppliersMap) {
    return <CircularProgress />
  }

  let kpiNames = [];
  let supplierNames = [];
  let foundSuppliersMap = new Map();
  let kpiContainedMap = new Map();
  let supplierValuesArray = [];
  let maxDescriptionLength = 0;

  // Gather non repeating list of kpi descriptions and supplier_names
  kpis && kpis.forEach((kpiItem) => {
    if (kpiContainedMap.has(kpiItem.description) === false) {
      kpiContainedMap.set(kpiItem.description, true);
      kpiNames.push(kpiItem.description);

      if (kpiItem.description.length > maxDescriptionLength) {
        maxDescriptionLength = kpiItem.description.length;
      }
    }

    if (foundSuppliersMap.has(kpiItem.supplier_name) === false) {
      foundSuppliersMap.set(kpiItem.supplier_name, true);
      supplierNames.push(kpiItem.supplier_name);
    }
  });

  supplierNames.forEach((supplierName) => {
    let newSupplierValues = [supplierName];

    kpiNames.forEach((kpiName) => {
      let count = 0;

      kpis && kpis.forEach((kpiItem) => {
        if (kpiItem.description === kpiName && kpiItem.supplier_name === supplierName) {
          count += 1;
        }
      });
      newSupplierValues.push(count);
    });
    supplierValuesArray.push(newSupplierValues);
  });


  if (!supplierValuesArray || supplierValuesArray.length < 1) {
    return (<div>No Issues Found</div>);
  }

  return (<Card className={classes.chartcontainerholder}>
    <CardHeader>
      {header}
    </CardHeader>
    <CardBody>
      <C3Chart key={Utils.giveMeGuid()}

        data={{
          x: 'x',
          columns: [['x', ...kpiNames],
          ...supplierValuesArray
          ],
          type: "bar",
          colors: (() => {
            const colorsGenerator = d3.scaleSequential(d3.interpolateRainbow).domain([0, supplierValuesArray.length])
            const colorsMap = {}
            supplierValuesArray.map((value, id) => {
              colorsMap[value[0]] = colorsGenerator(id)
            })
            return colorsMap;
          })(),
          groups: [supplierNames]
        }}

        size={{
          height: ((100) * kpiNames.length)
        }}

        axis={{
          rotated: true,
          y: {
            show: false,
            //max: ((supplierValuesArray.length > 2) ? supplierValuesArray.length : 2)
          },
          x: {
            height: (kpiNames.length < 11) ? maxDescriptionLength : maxDescriptionLength * 2.7,
            fit: false,
            type: 'category',
            tick: {
              multiline: true
            }
          }
        }}

        bar={{
          width: 35 // this makes bar width 100px
        }}


        legend={{
          hide: false,
          position: "bottom"
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
              //value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
              bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
              text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
              //text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
            }
            return text + "</table>";
          }
        }}


      /></CardBody></Card>)
}



/**
 *
 * <OpenClosedSummaryChart totalWorkerCalls={totalWorkerCalls} totalWorkerCallGroups={totalWorkerCallGroups} />
 * @param { totalWorkerCalls, totalWorkerCallGroups } props
 * @returns
 */
function OpenClosedSummaryChart(props) {
  const classes = useStyles();
  const totalWorkerCalls = props.totalWorkerCalls;
  const totalWorkerCallGroups = props.totalWorkerCallGroups;

  return (<Card className={classes.chartcontainerholder}>
    <CardHeader>
      <h4 className={classes.center}>Open/Closed</h4>
    </CardHeader>
    <CardBody>
      {totalWorkerCalls && totalWorkerCalls.length < 1 && totalWorkerCallGroups && totalWorkerCallGroups.length > 1 ?
        <CircularProgress />
        : <div>
          <br /><br />
          <C3Chart key={Utils.giveMeGuid()}
            data={{
              x: 'x',
              columns: [["x"].concat(totalWorkerCallGroups)].concat(totalWorkerCalls),
              type: "bar",
              groups: [["Closed", "Open"]],
              colors: {
                Closed: '#ABD4D4',
                Open: '#242424'
              }

            }}

            bar={{
              width: 35 // this makes bar width 100px
            }}

            legend={{
              position: 'top'
            }}

            point={{
              show: false
            }}

            axis={{
              y: {
                show: false
              },
              x: {
                type: 'category',
                height: 100,
                tick: {
                  //rotate: 75,
                  multiline: true
                }
              }
            }}
          />
        </div>
      }
    </CardBody>
  </Card>
  );
}

/*


         <OpenKpiPanel getStatusColor={getStatusColor}
            getDaysActive={getDaysActive}
            kpi_category={"Payment Systems And Transparency"}
            kpis={filteredOpenSupplierKpisPaymentSystemsAndTransparency}
            highlightRow={highlightRow}
            subComponent={subComponent} />

*/
function OpenKpiPanel(props) {

  const classes = useStyles();

  const getStatusColor = props.getStatusColor;
  const getStatusString = props.getStatusString;
  const getDaysActive = props.getDaysActive;
  const kpi_category = props.kpi_category;
  const kpis = props.kpis;


  const highlightRow = props.highlightRow;
  const subComponent = props.subComponent;
  const fetchingSupplierKPIs = useSelector((state) => { return state.suppliersReducer.fetchingSupplierKPIs });

  if (!kpis || kpis.length < 1) {
    return (<div></div>)
  }

  return (<GridItem xs={12}>

    <Card>
      <CardHeader>
        <h4 className={classes.center}>{kpi_category}({(kpis) ? kpis.length : 0})</h4>
      </CardHeader>
      <CardBody>
        {(!kpis || !kpis.map) ? <CircularProgress /> : (kpis.length < 1) ? (null) : <div>
          <ReactTable
            key={Utils.giveMeGuid()}
            id={Utils.giveMeGuid()}
            data={(()=>{
              let returnKpis = kpis;

              if(returnKpis) {
                returnKpis.forEach((item)=>{
                  item.status_string = getStatusString(getDaysActive(item.opened_at), item.status) + " (Opened: " + item.opened_at + ")";
                })
              }
              return returnKpis;
            })()}
            defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
            filterable={true}
            PaginationComponent={(Pagination) ? Pagination : undefined}
            defaultSorted={[{
              id: 'call_count',
              desc: true,
            }]}
            defaultPageSize={(kpis.length < 10 ? kpis.length : 5)}
            pagination={kpis.length < 10 ? false : true}
            showPagination={kpis.length < 10 ? false : true}

            className="-striped -highlight"
            loading={fetchingSupplierKPIs}
            SubComponent={d => subComponent(d.original)}

            getTrProps={highlightRow}

            columns={[
              {
                Header: "ID",
                accessor: "id",
                width: 60,
              },
              {
                Header: "Supplier",
                accessor: "supplier_name",
                width: 260,
                Cell: props => (
                  <HtmlTooltip title={props.value || "N/A"} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                  </HtmlTooltip>)
              },
              {
                Header: "Description",
                accessor: "description",
                Cell: props => (
                  <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {props.value}
                    </div>
                  </HtmlTooltip>)
              },
              {
                accessor: "level",
                width: 70,
                Header: (
                  <HtmlTooltip
                    title={`
                    Calls are assigned levels from 1-4 to denote the severity of the situation.
                    All information queries and communications around coordination are categorized as Level 1, the least severe level.
                    Level 2 cases are reported labour violations that do not violate national law but violate most ethical sourcing standards.
                    Level 3 cases are serious labour violations that are violations of labour and/or criminal law. Level 4 cases are threat-to-life cases.
                    Each level has its own response protocol.
                  `}
                    interactive
                  >
                    <p style={{ marginBottom: 0, display: 'inline' }}> Level </p>
                  </HtmlTooltip>
                )
              },
              {
                Header: "Days active",
                accessor: "opened_at",
                Cell: props => getDaysActive(props.value),
                width: 120
              },
              {
                Header: (
                  <HtmlTooltip
                    title={`
                    For Open KPIs:
                    Red if No Progress has been made for over 60 days
                    Orange if No Progress has been made for 30 to 60 days
                    Yellow if Some Progress has been made in 15 or more days
                    Black if the case is less then 15 days active
                  `}
                    interactive
                  >
                    <p style={{ marginBottom: 0, display: 'inline' }}> Status </p>
                  </HtmlTooltip>
                ),
                accessor: "status_string",
                Cell: ({ row, original }) => (
                  <HtmlTooltip title={row.status_string} interactive>
                    <div className="cell-overflow">
                      <div
                        className='statusIndicator'
                        style={{ backgroundColor: getStatusColor(getDaysActive(row._original.opened_at), row._original.status) }}
                      >
                      </div>
                    </div>
                  </HtmlTooltip>),
                width: 60,
                filterable: true,
                sortable: true
              },
              {
                Header: "",
                sortable: false,
                filterable: false,
                width: 20
              }
            ]}
          />

        </div>}
      </CardBody>
    </Card>
  </GridItem>);
}

/**
 * <OpenClosedKpisListSummary selectedSuppliers={selectedSuppliers} />
 * @param { selectedSuppliers, startTime, endTime } props
 * @returns
 */
export function OpenClosedKpisListSummary(props) {
  const classes = useStyles();


  const SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID = 3;
  const SUPPLIER_UPDATE_KPI_STATUS_OLD_ID = 4;

  const searchColumns = ["id",
    "supplier_name",
    "category",
    "description",
    "level",
    "opened_at",
    "closed_at",
    "affected_workers",
    "status_name",
    "call_count",
    "source_recruiter_count",
    "destination_recruiter_count",
    "remediation_business_steps_taken",
    "remediation_business_steps_remaining",
    "closed_notes",
    "closed_quality",
    "remediation_notes",
    "remediation_action",
    "remediation_validation",
    "remediation_results",
    "total_update_count"
  ];



  const supplierKPIs = useSelector((state) => { return state.suppliersReducer.supplierKPIs });
  const fetchingSupplierKPIs = useSelector((state) => { return state.suppliersReducer.fetchingSupplierKPIs });

  const [filteredOpenSupplierKpis, setFilteredOpenSupplierKpis] = useState(null)
  const [filteredClosedSupplierKpis, setFilteredClosedSupplierKpis] = useState(null)
  const [highlightedKpi, setHighlightedKpi] = useState(null)


  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: props.selectedSuppliers,
    startTime: props.startTime,
    endTime: props.endTime,
    search: "",
    search2: ""
  });

  const [modal, setModal] = useState((null));


  const filterByPanelSettings = (supplierKpisToBeFiltered,
    supplierClosedKpisFiltered,
    supplierOpenKpisFiltered) => {

    Object.keys(supplierKpisToBeFiltered).map(key => {
      const supplierKpi = supplierKpisToBeFiltered[key];
      let call_count = (supplierKpi.calls !== undefined && supplierKpi.calls !== null && supplierKpi.calls.length !== undefined) ? supplierKpi.calls.length : 0;
      let source_recruiter_count = ((supplierKpi.source_recruiters !== undefined && supplierKpi.source_recruiters !== null && supplierKpi.source_recruiters.length !== undefined)
        ? supplierKpi.source_recruiters.length : 0);
      let destination_recruiter_count = ((supplierKpi.destination_recruiters !== undefined && supplierKpi.destination_recruiters !== null && supplierKpi.destination_recruiters.length !== undefined)
        ? supplierKpi.destination_recruiters.length : 0);

      let total_update_count = ((supplierKpi.updates !== undefined && supplierKpi.updates !== null && supplierKpi.updates.length !== undefined)
        ? supplierKpi.updates.length : 0);

      if ((filters.suppliers !== null && filters.suppliers.length > 0 && (filters.suppliers.includes("" + supplierKpi.supplier) || filters.suppliers.includes(supplierKpi.supplier)))
        && (!filters.startTime || new Date(supplierKpi.opened_at).getTime() >= new Date(filters.startTime).getTime())
        && (!filters.endTime || new Date(supplierKpi.opened_at).getTime() <= new Date(filters.endTime).getTime())) {



        if (supplierKpi.status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || supplierKpi.status === SUPPLIER_UPDATE_KPI_STATUS_OLD_ID) {
          supplierClosedKpisFiltered.push({ ...supplierKpi, call_count, source_recruiter_count, destination_recruiter_count, total_update_count });

        } else { //open

          supplierOpenKpisFiltered.push({ ...supplierKpi, call_count, source_recruiter_count, destination_recruiter_count, total_update_count });
        }

      }
    });
  }

  const filterMetrics = () => {
    // FILTER SUPPLIER KPI UPDATES

    if (supplierKPIs !== undefined && supplierKPIs !== null && Object.keys(supplierKPIs).length > 0) {
      // FILTER OPEN SUPPLIER KPIS
      const supplierKpisToBeFiltered = Object.fromEntries(Object.entries(supplierKPIs).filter(([key, value]) => value.calls.length > 0))
      const supplierOpenKpisFiltered = [];
      const supplierClosedKpisFiltered = [];

      filterByPanelSettings(supplierKpisToBeFiltered,
        supplierClosedKpisFiltered,
        supplierOpenKpisFiltered)

      if (filters.search !== undefined && filters.search.length > 2) {
        let filteredSearchData = Utils.findStringInObjectFields(supplierOpenKpisFiltered, filters.search, searchColumns);
        setFilteredOpenSupplierKpis(filteredSearchData);
      } else {
        setFilteredOpenSupplierKpis(supplierOpenKpisFiltered);
      }

      if (filters.search2 !== undefined && filters.search2.length > 2) {
        let filteredSearchData = Utils.findStringInObjectFields(supplierClosedKpisFiltered, filters.search2, searchColumns);
        setFilteredClosedSupplierKpis(filteredSearchData);
      } else {
        setFilteredClosedSupplierKpis(supplierClosedKpisFiltered);
      }

    }

  }

  const filterByCategory = (category, supplierKpis) => {
    if (!supplierKpis || !supplierKpis.forEach) {
      return [];
    }

    let returnArray = [];
    supplierKpis.forEach((item) => {
      if (item.category === category) {
        returnArray.push(item);
      }
    });
    return returnArray;
  }

  useEffect(() => {
    filterMetrics();
  }, []);

  useEffect(() => {
    filterMetrics();
  }, [filters]);



  /**
   *
   *
   *
   *
  /*
"Keep react tables for all the 5 Open Issues tables, but make fixed column widths for less messiness.  Display the following columns in this table - note reduction in number of columns:
- Little arrow at far left like worker voice > view calls page
- Supplier V
- Description V
- Level V
- *new* Days Active (suggested new variable, please calculate present date - opened date) V
- *new* suggest new variable, something like status_new, which displays as a color-coded block or dot for easy scanning, filtering, etc in this table, but also whose value is what triggers an alert email to SPs:
   - black: days_active <=15 days  Hover:  Active under 15 days
   - yellow: days_active > 15 and < 60 days and status.  Hover: Some progress
   - orange: days_active > 30 and < 60 days and status.  Hover: No progress
   - red: days_active >= 60 days.  Hover: No progress for over 60 days

If react table is similar to worker voice > view calls, then clicking the arrow at left would expand the row to display the other columns that we previously had: open date, # affected, and Remediation notes.
"
*/



  const getDaysActive = (openedAt) => moment().diff(openedAt, 'days');

  const getStatusColor = (daysActive, statusId) => {
    const status = Utils.getSupplierKpiStatusFromId(statusId)

    if (daysActive >= 60) {
      return 'red'
    } else if (daysActive > 15 && daysActive < 60 && status === 'No Progress' ) {
      return 'orange'
    } else if ((daysActive > 15 && daysActive < 60 && status == 'Some Progress')) {
      return 'yellow'
    } else if (daysActive <= 15) {
      return 'black'
    } else {
      return 'grey' // for debugging purposes


      if (daysActive >= 60) {
        return 'red'
      } else if (daysActive > 30 && daysActive < 60 && status === 'No Progress') {
        return 'orange'
      } else if ((daysActive > 15 && daysActive < 60 && status == 'Some Progress')) {
        return 'yellow'
      } else if ((daysActive > 15 && daysActive < 30 && status === 'No Progress ')) {
        return 'yellow'
      } else if (daysActive <= 15) {
        return 'black'
      } else {
        return 'grey' // for debugging purposes
      }

    }
  }

  const getStatusString = (daysActive, statusId) => {
    const status = Utils.getSupplierKpiStatusFromId(statusId)


    if (daysActive >= 60) {
      return 'No Progress for over 60 days'
    } else if (daysActive > 30 && daysActive < 60 && status === 'No Progress') {
      return 'No Progress'
    } else if ((daysActive > 15 && daysActive < 60 && status == 'Some Progress')) {
      return 'Some Progress'
    } else if (daysActive <= 15) {
      return 'Active Under 15 days'
    } else if ((daysActive > 15 && daysActive < 30 && status === 'No Progress ')) {
      return 'No Progress'
    } else {
      return 'No Progress' // for debugging purposes
    }



  }

  /*
    Color for closed:
      Poor = 'Red',
      Fair = 'orange',
      Good = 'yellow',
      Excellent='green',
      Unresolved='grey'
*/
  const getRemediationQualityClosedColor = (closed_quality) => {
    if (closed_quality === null || closed_quality === undefined) {
      closed_quality = "";
    }

    if (closed_quality.toUpperCase() === "POOR") {
      return 'red'
    } else if (closed_quality.toUpperCase() === "FAIR") {
      return 'orange'
    } else if (closed_quality.toUpperCase() === "GOOD") {
      return 'yellow'
    } else if (closed_quality.toUpperCase() === "EXCELLENT") {
      return 'green'
    } else {
      // UnResolved and no quality saved
      return 'grey' // for debugging purposes
    }
  }

  const getRemediationQualityClosedColorString = (closed_quality) => {
    if (closed_quality === null || closed_quality === undefined) {
      closed_quality = "";
    }

    if (closed_quality.toUpperCase() === "POOR") {
      return 'Poor'
    } else if (closed_quality.toUpperCase() === "FAIR") {
      return 'Fair'
    } else if (closed_quality.toUpperCase() === "GOOD") {
      return 'Good'
    } else if (closed_quality.toUpperCase() === "EXCELLENT") {
      return 'Excellent'
    } else {
      // Unresolved and no quality saved
      return 'Unresolved' // for debugging purposes
    }
  }

  const highlightRow = (state, rowInfo, instance) => {
    if (rowInfo) {
      return rowInfo.row.id == highlightedKpi &&
      {
        className: 'activeKpiRow',
        onClick: handleHighlightedKpiClick
      }
    }
    return {};
  }

  const handleHighlightedKpiClick = () => {
    setHighlightedKpi(null);
  }


  const subComponent = (data) => (
    <GridContainer style={{ width: '100%', margin: 0, border: '1px solid #eeeeee' }}>
      <GridItem>
        <p style={{ margin: 0 }}> <b> Opened since: </b> {data.opened_at && moment(data.opened_at).format('LL') || "-"} </p>
      </GridItem>

      {data.closed_at && (<GridItem>
        <p style={{ margin: 0 }}> <b> Closed since: </b> {data.closed_at && moment(data.closed_at).format('LL')} </p>
      </GridItem>)}

      {data.closed_quality && (<GridItem>
        <p style={{ margin: 0 }}> <b> Remediation Quality: </b> {(data.closed_quality) ? data.closed_quality : "-"} </p>
      </GridItem>)}

      <GridItem>
        <p style={{ margin: 0 }}> <b> Affected workers: </b> {(data.affected_workers !== undefined &&
          data.affected_workers !== null &&
          data.affected_workers > 0) ? data.affected_workers : "-"} </p>
      </GridItem>
      {data.remediation_notes &&
        <GridItem xs={12}>
          <h5><b>Remediation Notes (Summary):</b></h5>
        </GridItem>
      }

      {data.remediation_notes &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Issues: </b> {data.remediation_notes} </p>
        </GridItem>
      }
      {data.remediation_action &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Action: </b> {data.remediation_action} </p>
        </GridItem>
      }
      {data.remediation_validation &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Validation: </b> {data.remediation_validation} </p>
        </GridItem>
      }
      {data.remediation_results &&
        <GridItem xs={12}>
          <p style={{ margin: 0 }}> <b> Results: </b> {data.remediation_results} </p>
        </GridItem>
      }

      <GridItem>
        <br />
      </GridItem>
    </GridContainer>
  )

  if (filteredOpenSupplierKpis === null || filteredClosedSupplierKpis === null) {
    return (<GridContainer><CircularProgress /></GridContainer>)
  }

  let filteredOpenSupplierKpisLabourRecruitment = filterByCategory('Labour recruitment', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisPaymentSystemsAndTransparency = filterByCategory('Payment systems and transparency', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisWorkingConditions = filterByCategory('Working conditions', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisEmployerEmployeeCommunicationsAndRelations = filterByCategory('Employer-employee communications and relations', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisLivingAndEatingConditions = filterByCategory('Living and eating conditions', filteredOpenSupplierKpis);

  return (
    <div>

      <GridContainer>
        <GridItem>
          <br />
        </GridItem>
        <GridItem>
          <br />
        </GridItem>
      </GridContainer>



      <h3 className={classes.center}>  Open Worker-Reported Violations</h3>
      <h6 className={classes.center}><p>Worker reported labor violations below are organized into the 5 main KPI I categories.  These map to and expand upon internationally recognized types of labor violations and potential workplace and recruitment issues.</p></h6>

      <GridContainer>

        <GridItem xs={12}>
          <h4>Search Results(Found: {filteredOpenSupplierKpis ? filteredOpenSupplierKpis.length : 0})</h4>
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

        <OpenKpiPanel getStatusColor={getStatusColor}
          getStatusString={getStatusString}
          getDaysActive={getDaysActive}
          kpi_category={"Labour Recruitment"}
          kpis={filteredOpenSupplierKpisLabourRecruitment}
          highlightRow={highlightRow}
          subComponent={subComponent} />

        <OpenKpiPanel getStatusColor={getStatusColor}
          getStatusString={getStatusString}
          getDaysActive={getDaysActive}
          kpi_category={"Payment Systems And Transparency"}
          kpis={filteredOpenSupplierKpisPaymentSystemsAndTransparency}
          highlightRow={highlightRow}
          subComponent={subComponent} />

        <OpenKpiPanel getStatusColor={getStatusColor}
          getStatusString={getStatusString}
          getDaysActive={getDaysActive}
          kpi_category={"Working Condition Issues"}
          kpis={filteredOpenSupplierKpisWorkingConditions}
          highlightRow={highlightRow}
          subComponent={subComponent} />

        <OpenKpiPanel getStatusColor={getStatusColor}
          getStatusString={getStatusString}
          getDaysActive={getDaysActive}
          kpi_category={"Employer-Employee Communications And Relations"}
          kpis={filteredOpenSupplierKpisEmployerEmployeeCommunicationsAndRelations}
          highlightRow={highlightRow}
          subComponent={subComponent} />

        <OpenKpiPanel getStatusColor={getStatusColor}
          getStatusString={getStatusString}
          getDaysActive={getDaysActive}
          kpi_category={"Living And Eating Conditions"}
          kpis={filteredOpenSupplierKpisLivingAndEatingConditions}
          highlightRow={highlightRow}
          subComponent={subComponent} />



      </GridContainer>


      <GridContainer>
        <br />
        <br />
      </GridContainer>

      <GridContainer>
        <GridItem>
          <Divider orientation="vertical" flexItem />
        </GridItem>
      </GridContainer>


      <h3 className={classes.center}> Closed Worker-Reported Violations </h3>
      <GridContainer>
        <GridItem xs={12}>
          <h4>Search Results(Found: {filteredClosedSupplierKpis ? filteredClosedSupplierKpis.length : 0})</h4>
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
              value={filters.search2}
              inputProps={{
                onChange: (e) => {
                  setFilters({ ...filters, search2: (e.target.value === undefined) ? "" : e.target.value })
                }
              }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <br />
        </GridItem>
        <GridItem xs={12}>
          <Card>
            <CardHeader>
              <h4>Closed Issues ({(filteredClosedSupplierKpis) ? filteredClosedSupplierKpis.length : 0})</h4>
            </CardHeader>
            <CardBody>
              {(!filteredClosedSupplierKpis || !filteredClosedSupplierKpis.map) ? <CircularProgress /> : (filteredClosedSupplierKpis.length < 1) ? (null) : <ReactTable PaginationComponent={Pagination}
                key={Utils.giveMeGuid()}
                id={Utils.giveMeGuid()}
                data={(() => {
                  filteredClosedSupplierKpis.forEach((item) => {
                    let remediation_summary = Utils.stringOrEmpty(item.remediation_notes) + " " +
                      Utils.stringOrEmpty(item.remediation_validation) + " " +
                      Utils.stringOrEmpty(item.remediation_action) + " " +
                      Utils.stringOrEmpty(item.remediation_results);
                    item.remediation_summary = remediation_summary;
                  })
                  return filteredClosedSupplierKpis;
                })()}
                defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                filterable={true}

                defaultPageSize={(filteredClosedSupplierKpis.length < 10 ? filteredClosedSupplierKpis.length : 10)}
                pagination={filteredClosedSupplierKpis.length < 10 ? false : true}
                showPagination={filteredClosedSupplierKpis.length < 10 ? false : true}

                SubComponent={d => subComponent(d.original)}

                defaultSorted={[{
                  id: 'call_count',
                  desc: true,
                }]}
                className="-striped -highlight"
                loading={fetchingSupplierKPIs}

                columns={[
                  {
                    Header: "ID",
                    accessor: "id",
                    width: 60
                  },
                  {
                    Header: "Supplier",
                    accessor: "supplier_name",
                    width: 260,
                    Cell: props => (
                      <HtmlTooltip title={(props.value) ? props.value : "N/A"} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>)
                  },
                  {
                    Header: "Category",
                    accessor: "category",
                    width: 260,
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
                    width: 260,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 60)}
                        </div>
                      </HtmlTooltip>)
                  },
                  {
                    Header: "Level (1-4)",
                    accessor: "level",
                    maxWidth: 60,
                    Header: (<HtmlTooltip title={"Calls are assigned levels from 1-4 to denote the severity of the situation. All information queries and communications around coordination are categorized as Level 1, the least severe level. Level 2 cases are reported labour violations that do not violate national law but violate most ethical sourcing standards. Level 3 cases are serious labour violations that are violations of labour and/or criminal law. Level 4 cases are threat-to-life cases. Each level has its own response protocol."} interactive>
                      <div className="cell-overflow">
                        Level (1-4)
                      </div>
                    </HtmlTooltip>)
                  },
                  {
                    Header: "Opened",
                    accessor: "opened_at",
                    width: 80
                  },
                  {
                    Header: "Closed",
                    accessor: "closed_at",
                    maxWidth: 80,
                  },
                  {
                    Header: (<HtmlTooltip title={"The estimated number of workers affected by the KPI issue.  If 0 is listed, the estimate is an unknown number of workers that will be updated as progress against the issue is made.  Often, issues reported by a smaller number of workers affect entire lines or additional workers, which is updated as further information from these workers or the business is received."} interactive>
                      <div className="cell-overflow">
                        Affected
                      </div>
                    </HtmlTooltip>),
                    accessor: "affected_workers",
                    width: 70,
                    Cell: (props) => { return (props.value !== null && props.value !== undefined && props.value > 0) ? props.value : "-" }
                  },
                  {
                    Header: (<HtmlTooltip title={<p>The final
                      Remediation Score.
                      <br />
                      <br />
                      Color for closed:<br />
                      Poor = 'Red', <br />
                      Fair = 'Orange', <br />
                      Good = 'Yellow', <br />
                      Excellent='Green', <br />
                      Unresolved='Grey'`</p>} interactive>
                      <div className="cell-overflow">
                        Remediation Outcome
                      </div>
                    </HtmlTooltip>),
                    width: 100,
                    accessor: "closed_quality",
                    width: 120,
                    Cell: (props) => (
                      <HtmlTooltip title={getRemediationQualityClosedColorString(props.value)} interactive>
                        <div className="cell-overflow">
                          <div
                            className='statusIndicator'
                            style={{ backgroundColor: getRemediationQualityClosedColor(props.value) }}
                          >
                          </div>
                        </div>
                      </HtmlTooltip>),
                  },
                  {
                    Header: "",
                    sortable: false,
                    width: 20
                  }
                ]}
              />}
            </CardBody>
          </Card>
        </GridItem>



      </GridContainer>
    </div>
  );

}

export default function SupplyChainDashboardKpis(props) {
  const classes = useStyles();
  const location = useLocation();
  const SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID = 3;
  const SUPPLIER_UPDATE_KPI_STATUS_OLD_ID = 4;

  const dispatch = useDispatch();


  const supplierKPIs = useSelector((state) => { return state.suppliersReducer.supplierKPIs });
  const fetchingSupplierKPIs = useSelector((state) => { return state.suppliersReducer.fetchingSupplierKPIs });
  const supplyChains = useSelector(state => state.supplyChainReducer.items)
  const supplyChainsMap = useSelector(state => state.supplyChainReducer.itemsMap)
  const supplierKPIUpdateItems = useSelector(state => state.suppliersReducer.supplierKPIUpdateItems);

  const suppliers = useSelector(state => state.suppliersReducer.items)

  const strategicPartners = useSelector(state => state.strategicPartnerReducer.strategicPartners);

  const [filteredOpenSupplierKpis, setFilteredOpenSupplierKpis] = useState(null)
  const [filteredClosedSupplierKpis, setFilteredClosedSupplierKpis] = useState(null)
  const [highlightedKpi, setHighlightedKpi] = useState(null)

  const [totalWorkerCalls, setTotalWorkerCalls] = useState([]);

  const totalWorkerCallGroups = ["Working conditions",
    "Labour recruitment",
    "Payment systems and transparency",
    "Employer-employee communications and relations",
    "Living and eating conditions"];

  const [pieChartTotals, setPieChartTotals] = useState([]);
  const [selectedShowGroup, setSelectedShowGroup] = useState(0)

  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: null,
    supplyChain: null,
    startTime: moment('2019-01-01'),
    endTime: moment(),
    industry: null,
    subindustry: null,
    disableSupplyChainSelect: false,
    search: "",
    search2: ""
  });

  const [modal, setModal] = useState((null));


  const pieChartTotalOpenClosedIssues = (supplierKpiCountOpenMap, supplierKpiCountClosedMap) => {
    let pieChartTotalsNew = [];

    totalWorkerCallGroups.forEach((groupKpiCategoryname) => {
      let countsOpen = (supplierKpiCountOpenMap.has(groupKpiCategoryname) === true) ? supplierKpiCountOpenMap.get(groupKpiCategoryname) : 0;
      let countsClosed = (supplierKpiCountClosedMap.has(groupKpiCategoryname) === true) ? supplierKpiCountClosedMap.get(groupKpiCategoryname) : 0;

      pieChartTotalsNew.push({
        name: groupKpiCategoryname,
        value: countsOpen + countsClosed
      });
    });

    pieChartTotalsNew.sort((a, b) => b.value - a.value);
    setPieChartTotals(pieChartTotalsNew);
  }

  const barchartOpenClosedByCategory = (supplierKpiCountOpenMap, supplierKpiCountClosedMap) => {
    let totalWorkerCallsNew = [];
    let categoryCountsOpen = ["Open"];
    let categoryCountsClosed = ["Closed"];

    totalWorkerCallGroups.forEach((groupKpiCategoryname) => {
      let countsOpen = (supplierKpiCountOpenMap.has(groupKpiCategoryname) === true) ? supplierKpiCountOpenMap.get(groupKpiCategoryname) : 0;
      let countsClosed = (supplierKpiCountClosedMap.has(groupKpiCategoryname) === true) ? supplierKpiCountClosedMap.get(groupKpiCategoryname) : 0;

      categoryCountsOpen.push(countsOpen);
      categoryCountsClosed.push(countsClosed);
    });
    totalWorkerCallsNew.push(categoryCountsClosed);
    totalWorkerCallsNew.push(categoryCountsOpen);

    setTotalWorkerCalls(totalWorkerCallsNew);
  }


  const filterByPanelSettings = (supplierKpisToBeFiltered,
    supplierClosedKpisFiltered,
    supplierOpenKpisFiltered,
    supplierKpiCountClosedMap,
    supplierKpiCountOpenMap) => {

    Object.keys(supplierKpisToBeFiltered).map(key => {

      const supplierKpi = supplierKpisToBeFiltered[key];

      let call_count = (supplierKpi.calls !== undefined && supplierKpi.calls !== null && supplierKpi.calls.length !== undefined) ? supplierKpi.calls.length : 0;
      let source_recruiter_count = ((supplierKpi.source_recruiters !== undefined && supplierKpi.source_recruiters !== null && supplierKpi.source_recruiters.length !== undefined)
        ? supplierKpi.source_recruiters.length : 0);
      let destination_recruiter_count = ((supplierKpi.destination_recruiters !== undefined && supplierKpi.destination_recruiters !== null && supplierKpi.destination_recruiters.length !== undefined)
        ? supplierKpi.destination_recruiters.length : 0);

      let total_update_count = ((supplierKpi.updates !== undefined && supplierKpi.updates !== null && supplierKpi.updates.length !== undefined)
        ? supplierKpi.updates.length : 0);

      if ((filters.suppliers !== null && filters.suppliers.length > 0 && (filters.suppliers.includes("" + supplierKpi.supplier) || filters.suppliers.includes(supplierKpi.supplier)))
        && (!filters.startTime || new Date(supplierKpi.opened_at).getTime() >= new Date(filters.startTime).getTime())
        && (!filters.endTime || new Date(supplierKpi.opened_at).getTime() <= new Date(filters.endTime).getTime())) {

        if (supplierKpi.status === SUPPLIER_UPDATE_KPI_STATUS_CLOSED_ID || supplierKpi.status === SUPPLIER_UPDATE_KPI_STATUS_OLD_ID) {

          if (!supplierKpiCountClosedMap) {
            alert("WTF");
          }
          if (supplierKpiCountClosedMap.has(supplierKpi.category) === false) {
            supplierKpiCountClosedMap.set(supplierKpi.category, 0);
          }
          supplierKpiCountClosedMap.set(supplierKpi.category, supplierKpiCountClosedMap.get(supplierKpi.category) + 1);

          supplierClosedKpisFiltered.push({ ...supplierKpi, call_count, source_recruiter_count, destination_recruiter_count, total_update_count });

        } else { //open
          if (supplierKpiCountOpenMap.has(supplierKpi.category) === false) {
            supplierKpiCountOpenMap.set(supplierKpi.category, 0);
          }
          supplierKpiCountOpenMap.set(supplierKpi.category, supplierKpiCountOpenMap.get(supplierKpi.category) + 1);

          supplierOpenKpisFiltered.push({ ...supplierKpi, call_count, source_recruiter_count, destination_recruiter_count, total_update_count });
        }

      }
    });
  }




  const filterMetrics = () => {
    // FILTER SUPPLIER KPI UPDATES

    if (supplierKPIs !== undefined && supplierKPIs !== null && Object.keys(supplierKPIs).length > 0) {
      // FILTER OPEN SUPPLIER KPIS
      const supplierKpisToBeFiltered = Object.fromEntries(Object.entries(supplierKPIs).filter(([key, value]) => value.calls.length > 0))
      const supplierKpiCountOpenMap = new Map();
      const supplierKpiCountClosedMap = new Map();
      const supplierOpenKpisFiltered = [];
      const supplierClosedKpisFiltered = [];

      filterByPanelSettings(supplierKpisToBeFiltered,
        supplierClosedKpisFiltered,
        supplierOpenKpisFiltered,
        supplierKpiCountClosedMap,
        supplierKpiCountOpenMap);

      setFilteredOpenSupplierKpis(supplierOpenKpisFiltered);

      setFilteredClosedSupplierKpis(supplierClosedKpisFiltered);

      barchartOpenClosedByCategory(supplierKpiCountOpenMap, supplierKpiCountClosedMap);
      pieChartTotalOpenClosedIssues(supplierKpiCountOpenMap, supplierKpiCountClosedMap);

    }

  }

  const filterByCategory = (category, supplierKpis) => {
    if (!supplierKpis || !supplierKpis.forEach) {
      return [];
    }

    let returnArray = [];
    supplierKpis.forEach((item) => {
      if (item.category === category) {
        returnArray.push(item);
      }
    });
    return returnArray;
  }



  useEffect(() => {

    dispatch(fetchSupplierKPIs());
    dispatch(fetchRecruiters());
    dispatch(fetchSupplyChains());
    dispatch(fetchStrategicPartners());
    dispatch(fetchSuppliers());
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
    filterMetrics();
  }, [filters, supplierKPIs]);

  useEffect(() => {
    const queryParams = queryString.parse(location.search)
    const supplyChain = supplyChainsMap[queryParams.sc]
    const highlightKpiId = queryParams.kpi

    if (supplyChain && Object.keys(supplierKPIs).length > 0 && strategicPartners.length > 0 && suppliers.length > 0) {
      setFilters({
        ...filters,
        supplyChain: supplyChainsMap[queryParams.sc],
        suppliers: supplyChain.suppliers.map(id => `${id}`)
      })
      setHighlightedKpi(highlightKpiId)
    }
  }, [supplyChainsMap, supplierKPIs, strategicPartners, suppliers])



  const componentRef = useRef(this);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  const tabSelect = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };


  if (filteredOpenSupplierKpis === null || filteredClosedSupplierKpis === null) {
    return (<GridContainer><CircularProgress /></GridContainer>)
  }

  let filteredOpenSupplierKpisLabourRecruitment = filterByCategory('Labour recruitment', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisPaymentSystemsAndTransparency = filterByCategory('Payment systems and transparency', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisWorkingConditions = filterByCategory('Working conditions', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisEmployerEmployeeCommunicationsAndRelations = filterByCategory('Employer-employee communications and relations', filteredOpenSupplierKpis);
  let filteredOpenSupplierKpisLivingAndEatingConditions = filterByCategory('Living and eating conditions', filteredOpenSupplierKpis);

  let filteredClosedSupplierKpisLabourRecruitment = filterByCategory('Labour recruitment', filteredClosedSupplierKpis);
  let filteredClosedSupplierKpisPaymentSystemsAndTransparency = filterByCategory('Payment systems and transparency', filteredClosedSupplierKpis);
  let filteredClosedSupplierKpisWorkingConditions = filterByCategory('Working conditions', filteredClosedSupplierKpis);
  let filteredClosedSupplierKpisEmployerEmployeeCommunicationsAndRelations = filterByCategory('Employer-employee communications and relations', filteredOpenSupplierKpis);
  let filteredClosedSupplierKpisLivingAndEatingConditions = filterByCategory('Living and eating conditions', filteredClosedSupplierKpis);



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


      {(filters.supplyChain === null || filters.supplyChain === undefined) ? (<div></div>) : (<div>

        <h3 className={classes.center}>Summary of Open/Closed Issues</h3>

        <GridContainer>
          <GridItem xs={12}>
            <h6 className={classes.center}><p>The graph of open/closed issues represents the supplier(s) and date range selected above. Details of the 5 open/closed labor category KPIs are presented below.
            </p></h6>

            <Card className={classes.chartcontainerholder}>
              <CardBody>
                {totalWorkerCalls && totalWorkerCalls.length < 1 && totalWorkerCallGroups && totalWorkerCallGroups.length > 1 ?
                  <CircularProgress />
                  : <div>
                    <br /><br />
                    <PieChart data={pieChartTotals} />
                  </div>
                }
              </CardBody>
            </Card>

          </GridItem>

          <GridItem>
            <br />
          </GridItem>


          <GridContainer>
            <Card>
              <CardHeader>
                <AppBar style={{ backgroundColor: "#005B4C" }} position="static">
                  <Tabs variant={"scrollable"} value={selectedShowGroup} onChange={(event, newValue) => {
                    setSelectedShowGroup(newValue);
                  }} aria-label="KPI Categories">
                    <Tab label="Open/Closed" {...tabSelect(0)} />
                    <Tab label="Labour Recruitment" {...tabSelect(1)} />
                    <Tab label="Payment Systems And Transparency" {...tabSelect(2)} />
                    <Tab label="Working Conditions" {...tabSelect(3)} />
                    <Tab label="Employer-Employee Communications And Relations" {...tabSelect(4)} />
                    <Tab label="Living And Eating Conditions" {...tabSelect(6)} />

                  </Tabs>
                </AppBar>
              </CardHeader>
              <CardBody>
                <TabPanel value={selectedShowGroup} index={0}>
                  <OpenClosedSummaryChart totalWorkerCalls={totalWorkerCalls}
                    totalWorkerCallGroups={totalWorkerCallGroups} />
                </TabPanel>
                <TabPanel value={selectedShowGroup} index={1}>
                  <CategoryKPIsBySupplierChart header={<h4 className={classes.center}>Labour Recruitment</h4>}
                    kpis={filteredOpenSupplierKpisLabourRecruitment.concat(filteredClosedSupplierKpisLabourRecruitment)} />
                </TabPanel>
                <TabPanel value={selectedShowGroup} index={2}>
                  <CategoryKPIsBySupplierChart header={<h4 className={classes.center}>Payment Systems And Transparency</h4>}
                    kpis={filteredOpenSupplierKpisPaymentSystemsAndTransparency.concat(filteredClosedSupplierKpisPaymentSystemsAndTransparency)} />
                </TabPanel>
                <TabPanel value={selectedShowGroup} index={3}>
                  <CategoryKPIsBySupplierChart header={<h4 className={classes.center}>Working Conditions</h4>}
                    kpis={filteredOpenSupplierKpisWorkingConditions.concat(filteredClosedSupplierKpisWorkingConditions)} />
                </TabPanel>
                <TabPanel value={selectedShowGroup} index={4}>
                  <CategoryKPIsBySupplierChart header={<h4 className={classes.center}>Employer-Employee Communications And Relations</h4>}
                    kpis={filteredOpenSupplierKpisEmployerEmployeeCommunicationsAndRelations.concat(filteredClosedSupplierKpisEmployerEmployeeCommunicationsAndRelations)} />
                </TabPanel>
                <TabPanel value={selectedShowGroup} index={5}>
                  <CategoryKPIsBySupplierChart header={<h4 className={classes.center}>Living And Eating Conditions</h4>}
                    kpis={filteredOpenSupplierKpisLivingAndEatingConditions.concat(filteredClosedSupplierKpisLivingAndEatingConditions)} />
                </TabPanel>
              </CardBody>
            </Card>
          </GridContainer>
        </GridContainer>

        <GridItem>
          <br />
        </GridItem>

        <GridItem>
          <br />
        </GridItem>

        <OpenClosedKpisListSummary key={Utils.giveMeGuid()}
          startTime={filters.startTime}
          endTime={filters.endTime}
          selectedSuppliers={filters.suppliers} />

      </div>)}



      {/*<h3 className={classes.center}>Response History </h3>
      <GridContainer>
        <GridItem xs={12}>
          <BusinessResponseInteractions />
        </GridItem>
      </GridContainer> */}
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
      { /*<Button onClick={handlePrint}>Print Report</Button>*/}
      {((supplierKPIs === undefined || supplierKPIs === null || supplierKPIs.length < 1) &&
        (supplyChains === undefined || supplyChains === null || supplyChains.length < 1) &&
        (strategicPartners === undefined || strategicPartners === null || strategicPartners.length < 1) &&
        (suppliers === undefined || suppliers === null || suppliers.length < 1)) ? <div>Loading...</div>
        : displayNode}
    </div>);

}

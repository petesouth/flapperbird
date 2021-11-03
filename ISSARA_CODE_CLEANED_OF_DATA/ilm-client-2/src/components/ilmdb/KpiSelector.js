import React, { useState, useEffect } from "react";


import Tooltip from '@material-ui/core/Tooltip';
// @material-ui/core components

import { withStyles, makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox"

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import utils from 'services/utils.js'
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import ReactTable from "react-table-6";
import Button from "components/CustomButtons/Button.js";

// @material-ui/icons
import Check from "@material-ui/icons/Check";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import { useDispatch, useSelector } from "react-redux";

import { fetchKPIList, fetchKPICategoryList, fetchIssueCategories } from "../../redux/actions/IssueActions.js";
import IssueCategoriesDropdown from "./IssueCategoriesDropdown.js";



const customStyles = {
  ...customCheckboxRadioSwitch,
  gridItem: {
    padding: '0 !important',
  },
  kpisContainer: {
    marginTop: '60px !important',
  },
  customLabel: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
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

let fetch = false;

export default function KpiSelector(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };
  const displayOnlyMode = (props.displayOnlyMode !== undefined) ? props.displayOnlyMode : false;

  const LABOR_ISSUE_CATEOGORY_ID = 1; // ilm.issue_categories First ROW ID:
  // '1', 'Labour trafficking, exploitation, and labour-related issues'

  const issueCategories = useSelector(state => state.issueCategoriesReducer.items);
  const issueCategoriesFetching = useSelector(state => state.issueCategoriesReducer.fetchingCategories);
  const kpiCategories = useSelector(state => state.kpisReducer.kpicategoryitems);
  const kpiCategoriesFetching = useSelector(state => state.kpisReducer.fetchingKPICategories);
  const kpis = useSelector(state => state.kpisReducer.kpiitems);
  const kpisFetching = useSelector(state => state.kpisReducer.fetchingKPIs);
  const selectedKpis = useSelector((state) => {
    return (props.selectedKpis !== undefined) ? props.selectedKpis : {};

  });
  const [editMode, setEditMode] = useState((props.selectedKpis !== undefined && Object.keys(props.selectedKpis).length > 0) ? false : true);
  const [selectedTab, setSelectedTab] = useState( undefined  )
  const dispatch = useDispatch();


  useEffect(() => {
    if (fetch === false) {
      fetch = true;
      dispatch(fetchIssueCategories())
      dispatch(fetchKPICategoryList())
      dispatch(fetchKPIList())
    }
  }, []);

  const classes = useStyles();

  var tabs = []

  const selectKpi = (category_id, kpi_id, selectedKpi) => {
    props.onSelectKpi(category_id, kpi_id);
    setSelectedTab( selectedKpi );
  }

  let selectedKpiSummary = new Array();
  let theSelectedTab = selectedTab;

  if (kpiCategories && kpis) {

    kpiCategories.map(kpi_category => {

      const kpi_category_kpis = kpis.filter(kpi => {
        return kpi.kpi_category.id == kpi_category.id
      })

      let currentLength = tabs.length;
      
      const tab = {
        tabName: kpi_category.name,
        tabContent: (
          <GridContainer key={utils.giveMeGuid()}>
            {kpi_category_kpis.map((kpi, key) => {

              // While Im at it.... Ill keep track of the ones the user passed in.. Or has now selected.
              // This Ill use to show a summary.. 
              if (selectedKpis[kpi.kpi_category.id] && selectedKpis[kpi.kpi_category.id].includes(kpi.id)) {
                selectedKpiSummary.push(kpi);

                if( theSelectedTab === undefined ) {
                  setSelectedTab(  currentLength ); // 0 based for selected tab
                  theSelectedTab = currentLength;
                }
              }

             
              return (
                <GridItem key={utils.giveMeGuid()} className={classes.gridItem} xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedKpis[kpi.kpi_category.id] ? selectedKpis[kpi.kpi_category.id].includes(kpi.id) : false}
                        onClick={() => selectKpi(kpi.kpi_category.id, kpi.id, currentLength)}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label + ' ' + classes.customLabel,
                      root: classes.labelRoot
                    }}
                    label={kpi.description}
                  />
                </GridItem>
              )
            })
            }
          </GridContainer>
        )
      }

      tabs.push(tab);
    });


  }

  if (displayOnlyMode === true || (editMode === false && props.issueCategory === LABOR_ISSUE_CATEOGORY_ID)) {
    return (<div key={utils.giveMeGuid()}>
      <Card>
        <CardBody style={{ scrollX: "auto;"}}>
          <h4>KPI(s)</h4>
          <GridItem>
            {(displayOnlyMode === false) ? (<Button onClick={() => {
              setEditMode(true);
            }}>Edit</Button>) : (null)}
            
          </GridItem>
          <GridItem>
          <ReactTable
              data={selectedKpiSummary.map((selectedKpiObject) => (
                { category: selectedKpiObject.kpi_category.name,
                  kpi: selectedKpiObject.description,
                  level: selectedKpiObject.level,
                  goal: selectedKpiObject.goal
                }
              ))}
              columns={[
                {
                  Header: "Category",
                  accessor: "category",
                  sortable: false,
                  resizable: false,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {utils.shortenString(props.value, 25)}
                    </div>
                  </HtmlTooltip>)
                },
                {
                  Header: "Kpi",
                  accessor: "kpi",
                  sortable: false,
                  resizable: false,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {utils.shortenString(props.value, 25)}
                    </div>
                  </HtmlTooltip>)
                },
                {
                  Header: "Level",
                  accessor: "level",
                  sortable: false,
                  resizable: false
                },
                {
                  Header: "Goal",
                  accessor: "goal",
                  sortable: false,
                  resizable: false,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {utils.shortenString(props.value, 25)}
                    </div>
                  </HtmlTooltip>)
                }
              ]}
              defaultPageSize={(selectedKpiSummary !== undefined ) ? selectedKpiSummary.length : 0}
              showPaginationTop={false}
              showPaginationBottom={false}
              className="-striped -highlight"
            />
          </GridItem>
          
        </CardBody>
      </Card>

    </div>)
  } else {

    return (
      <div key={utils.giveMeGuid()}>
        <Card key={utils.giveMeGuid()}>
          <CardHeader>
            <h4>KPI(s)</h4>
          </CardHeader>
          <CardBody>
            <GridItem>
              {(props.issueCategory === LABOR_ISSUE_CATEOGORY_ID) ? (<Button onClick={() => {
                setEditMode(false);
              }}>Done</Button>) : null}
            </GridItem>
            <GridItem>
              <br />
            </GridItem>
            <GridItem>
              <IssueCategoriesDropdown key={utils.giveMeGuid()} values={props.issueCategory} onSelect={(e) => props.onSelectIssueCategory(e.target.value)} />
              {props.issueCategory == LABOR_ISSUE_CATEOGORY_ID ?
                kpiCategories && kpis ?
                  <div className={classes.kpisContainer}>
                    <CustomTabs value={theSelectedTab} key={utils.giveMeGuid()} align="center" headerColor="rose" tabs={tabs} />
                  </div>
                  :
                  <p> Loading.. </p>
                :
                null
              }
            </GridItem>
          </CardBody>
        </Card>

      </div>
    );

  }

}

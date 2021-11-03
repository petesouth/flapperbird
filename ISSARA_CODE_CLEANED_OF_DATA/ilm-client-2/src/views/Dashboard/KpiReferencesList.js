import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

import Tooltip from '@material-ui/core/Tooltip';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
import Checkbox from "@material-ui/core/Checkbox";
import VisibilityIcon from '@material-ui/icons/Visibility';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import KpiReferenceModal from "./KpiReferenceModal.js";
import KpiCategoriesDropdown from "components/ilmdb/KpiCategoriesDropdown.js";

import { fetchKPIList, fetchKPICategoryList } from "../../redux/actions/IssueActions.js";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import Utils from "../../services/utils";

const customStyle = {
  ...styles,
  checkRoot: {
    padding: 5,
  },
  button: {
    padding: 0,
    margin: 0,
  }
}

const useStyles = makeStyles(customStyle);


const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);


export default function KpiReferencesList(props) {

  const dispatch = useDispatch();
  const classes = useStyles();

  const kpis = useSelector(state => state.kpisReducer.kpiitems);
  const fetchingKpis = useSelector(state => state.kpisReducer.fetchingKPIs);

  const [filteredKpis, setFilteredKpis] = useState([]);

  // MODAL
  const [modal, setModal] = useState({
    open: false,
    value: null
  });

  // FILTERS
  const [filters, setFilters] = useState({
    categories: [],
    levels: [],
  });

  useEffect(() => {
    dispatch(fetchKPIList());
    dispatch(fetchKPICategoryList())

  }, []);

  useEffect(() => {
    filterKpis()
  }, [kpis, filters]);

  const filterKpis = () => {
    const filteredKpisArray = []

    kpis.map(kpi => {
      // Filter by category
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(kpi.kpi_category.id)) {
          return // skip this kpi as no categories matched
        }
      }
      // Filter by level
      if (filters.levels.length > 0) {
        if (!filters.levels.includes(kpi.level)) {
          return // skip this kpi
        }
      }

      filteredKpisArray.push(kpi)
    });
    setFilteredKpis(filteredKpisArray)
  }

  const toggleLevel = (level) => {
    const levels = [...filters.levels]
    var index = levels.indexOf(level);

    if (index === -1) {
      levels.push(level);
    } else {
      levels.splice(index, 1);
    }
    setFilters({ ...filters, levels: levels })
  }

  const handleViewButtonClick = (id) => {
    setModal({
      open: true,
      value: id
    })
  }

  const viewButton = (id) => {
    return (
      <Button
        title={"View: " + id}
        simple
        color="info"
        className={classes.button}
        onClick={(e) => handleViewButtonClick(id)}
      >
        <VisibilityIcon />
      </Button>
    )
  }

  return ((kpis === undefined || kpis === null || kpis.length < 1) ? (<div>Loading...</div>) : (
    <div>
      <GridContainer>
        <KpiReferenceModal open={modal.open} value={modal.value} onClose={() => setModal({ value: undefined, open: false })} />
        <GridItem xs={12} sm={12} lg={12}>
          <Card style={{ marginTop: 0 }}>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={8} lg={8}>
                  <KpiCategoriesDropdown multipleselect={true} onSelect={kpiCategories => setFilters({ ...filters, categories: kpiCategories })} value={filters.categories} />
                </GridItem>
                <GridItem xs={12} sm={4} lg={4}>
                  <p style={{ marginBottom: 0, fontWeight: 500, marginLeft: -8 }}> Level: </p>
                  {[1, 2, 3, 4].map((level, index) => {
                    return (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            tabIndex={-1}
                            checked={filters.levels.includes(level)}
                            onClick={() => toggleLevel(level)}
                            checkedIcon={<Check className={classes.checkedIcon} />}
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot
                            }}
                          />
                        }
                        label={level}
                      />
                    )
                  })}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} lg={12}>
          <Card style={{ marginTop: 0 }}>
            <CardHeader>
              <h4>Search Results (Found: {(filteredKpis !== undefined &&
                filteredKpis.length !== undefined) ? filteredKpis.length : 0})</h4>
            </CardHeader>
            <CardBody>
              <ReactTable PaginationComponent={Pagination}
              key={Utils.giveMeGuid()}
                data={filteredKpis}
                columns={[
                  {
                   width: 20,
                   sortable: false,
                   Cell: props => (<div style={{paddingTop: "40px"}}></div>)
                  },
                  {
                    Header: "Category",
                    accessor: "kpi_category.name",
                    width: 200,
                    Cell: props => (
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    ),
                  },
                  {
                    Header: "Description",
                    accessor: "description",
                    length: 260,
                    Cell: props => (
                      <HtmlTooltip title={props.value || "N/A"} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 40)}
                        </div>
                      </HtmlTooltip>),
                  },
                  {
                    Header: "Level",
                    accessor: "level",
                    width: 70
                  },
                  {
                    Header: "Goal",
                    accessor: "goal",
                    length: 260,
                    Cell: props => (
                      <HtmlTooltip title={props.value || "N/A"} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 40)}
                        </div>
                      </HtmlTooltip>),
                  },
                  {
                    Header: "ETI Code",
                    accessor: "eti_base_code.name",
                    length: 260,
                    Cell: props => (
                      <HtmlTooltip title={props.value || "N/A"} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 40)}
                        </div>
                      </HtmlTooltip>),
                  },
                  /*
                  
                  {
                    Header: "Legal",
                    accessor: "kpi_legal_violation.description",
                    Cell: props => (
                      <div className="cell-overflow" title={props.value}>
                        {props.value}
                      </div>
                    ),
                  },
                  {
                    Header: "Remediation",
                    accessor: "kpi_recommended_remediation.description",
                    Cell: props => (
                      <div className="cell-overflow" title={props.value}>
                        {props.value}
                      </div>
                    ),
                  },
                  {
                    Header: "Systems",
                    accessor: "kpi_systems_change.description",
                    Cell: props => (
                      <div className="cell-overflow" title={props.value}>
                        {props.value}
                      </div>
                    ),
                  },
                */
                  {
                    Header: "",
                    sortable: false,
                    accessor: "id",
                    width: 30,
                    Cell: props => (
                      viewButton(props.value)
                    ),
                  },
                  {
                    width: 20
                  }
                ]}
                loading={fetchingKpis}
                defaultPageSize={(filteredKpis.length < 20 ? filteredKpis.length : 20)}
                pagination={filteredKpis.length < 20 ? false : true}
                showPagination={filteredKpis.length < 20 ? false : true}

                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  ));
}

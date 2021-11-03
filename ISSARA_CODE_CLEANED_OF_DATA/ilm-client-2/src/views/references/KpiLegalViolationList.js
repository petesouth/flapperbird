import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from "@material-ui/core/styles";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import KpiLegalViolationModal from "./KpiLegalViolationModal.js";

import { fetchKpiLegalViolationTypes } from "../../redux/actions/LocaleActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";


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

let fetch = false;

export default function KpiLegalViolationList(props) {

  const dispatch = useDispatch();
  const classes = useStyles();

  const kpiLegalViolations = useSelector(state => state.kpiLegalViolationTypesReducer.items);

  const fetchingKpiLegalViolationTypes = useSelector(state => state.kpiLegalViolationTypesReducer.fetchingKpiLegalViolationTypes);

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
    if (fetch === false) {
      fetch = true;
      dispatch(fetchKpiLegalViolationTypes());
    }
  }, []);

  useEffect(() => {

  }, [kpiLegalViolations]);


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

  return (
    <div>
      <GridContainer>
        <KpiLegalViolationModal open={modal.open} value={modal.value} onClose={() => setModal({ value: undefined, open: false })} />
        <GridItem xs={12} sm={12} lg={12}>
          <Card style={{ marginTop: 0 }}>
            <CardHeader>
              <h4>Search Results (Found: {(kpiLegalViolations !== undefined &&
                kpiLegalViolations.length !== undefined) ? kpiLegalViolations.length : 0})</h4>
            </CardHeader>
            <CardBody>
              <ReactTable PaginationComponent={Pagination}
                data={kpiLegalViolations}
                columns={[
                  {
                    Header: "Id",
                    accessor: "id",
                    width: 60
                  }, {
                    Header: "Name",
                    accessor: "name"
                  }, {
                    Header: "Description",
                    accessor: "description",
                    Cell: props => (
                      <div className="cell-overflow" title={props.value}>
                        {props.value}
                      </div>
                    ),
                  }, {
                    Header: "",
                    sortable: false,
                    accessor: "id",
                    width: 30,
                    Cell: props => (
                      viewButton(props.value)
                    ),
                  }
                ]}
                loading={fetchingKpiLegalViolationTypes}
                defaultPageSize={20}
                showPaginationTop={false}
                showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

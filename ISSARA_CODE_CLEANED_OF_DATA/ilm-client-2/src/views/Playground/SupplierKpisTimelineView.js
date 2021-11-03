import React, { useState, useEffect, useRef } from "react";

// third party components
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Datetime from "react-datetime";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import SuppliersDropdown from 'components/ilmdb/SuppliersDropdown';
import SupplierKpisTimelineChart from 'components/Charts/SupplierKpisTimelineChart'
import { fetchKPICategoryList } from "redux/actions/IssueActions.js";
import { fetchSupplierKPIs, fetchSuppliers, fetchSupplierKpiUpdates } from "redux/actions/SupplierActions.js";


export default function SupplierKpisTimelineView() {
  const dispatch = useDispatch();

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const kpiCategories = useSelector(state => state.kpisReducer)
  const supplierKPIsMap = useSelector(state => state.suppliersReducer.supplierKPIs);
  const supplierKpiUpdatesArray = useSelector(state => state.suppliersReducer.supplierKPIUpdateItems);

  const fetchingSupplierKPIs = useSelector(state => state.suppliersReducer.fetchingSupplierKPIs);
  const fetchingSupplierKPIUpdates = useSelector(state => state.suppliersReducer.fetchingSupplierKpiUpdates);

  const [filters, setFilters] = useState({
    supplier: null,
    startTime: moment('2018-01-01'),
    endTime: moment(),
  });

  useEffect(() => {
    !kpiCategories.fetchingKPICategories && kpiCategories.kpicategoryitems.length < 1 && dispatch(fetchKPICategoryList())
    !fetchingSupplierKPIs && Object.keys(supplierKPIsMap).length < 1 && dispatch(fetchSupplierKPIs())
    !fetchingSupplierKPIUpdates && supplierKpiUpdatesArray.length < 1 && dispatch(fetchSupplierKpiUpdates())
  }, [])

  return (
    <div>
      <Card>
        <CardBody>
          <GridContainer>
            <GridItem sm={6}>
              <SuppliersDropdown
                value={filters.supplier}
                onSelect={supplier => setFilters({...filters, supplier: supplier})}
                multiselect={false}
              />
            </GridItem>
            <GridItem xs={6} sm={2} lg={2} xl={1}>
              <InputLabel>Between</InputLabel>
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
              <InputLabel>And</InputLabel>
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
                      startTime: moment('2018-01-01'),
                      endTime: moment(),
                    })
                  }> Reset all </Button>
              </FormControl>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem>
              <p>
                <b> Recommended supplier: </b>
                Cal-Comp Electronics (Thailand) Public Co., Ltd. - Phetchaburi
              </p>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>

      <SupplierKpisTimelineChart filters={filters} />
    </div>
  );
}

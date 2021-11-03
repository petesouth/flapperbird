import React, { useState, useEffect } from "react";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";

import SupplierKpiUpdateForm from "./SupplierKpiUpdateForm.js"

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(sweetAlertStyles);


export default function SupplierKpiBulkUpdate(props) {
  const classes = useStyles();

  const [ids, setIds] = useState([])
  const [alert, setAlert] = useState(null)
  const [updatedCount, setUpdatedCount] = useState(0)

  useEffect(() => {
    if (ids.length == 0) {
      const ids_from_url = new URLSearchParams(props.location.search).get('ids')
      const ids_array = ids_from_url.split(',').map(Number)
      setIds(ids_array)
    }
    if (ids.length != 0 && ids.length == updatedCount) {
      successAlert()
    }
  }, [updatedCount]);

  const onUpdateKPI = () => {
    setUpdatedCount(updatedCount + 1)
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={() => props.history.push('/admin/businesskpiupdates')}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        KPIs were successfully updated
      </SweetAlert>
    );
  };

  console.log(ids)

  return (
    <GridContainer>
      {alert}
      {ids.map((item, index) => {
        return <SupplierKpiUpdateForm key={index} id={item} onUpdateKPI={onUpdateKPI}/>
      })}
    </GridContainer>
  );
}

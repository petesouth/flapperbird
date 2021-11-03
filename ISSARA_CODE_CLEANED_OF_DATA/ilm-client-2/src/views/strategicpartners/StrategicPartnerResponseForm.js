import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Datetime from "react-datetime";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Table from "components/Table/Table.js";

import Button from "components/CustomButtons/Button.js";


import StrategicPartnersDropdown from "components/ilmdb/StrategicPartnersDropdown.js"
import ResponseInteractionTypesDropdown from "components/ilmdb/ResponseInteractionTypesDropdown.js"

import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";

import { fetchStrategicPartnerResponses, updateStrategicPartnerResponse, createStrategicPartnerResponse } from "../../redux/actions/StrategicPartnerResponseActions";

import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

const useStyles = makeStyles(styles);


export default function StrategicPartnerResponseForm(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const strategicPartnerResponses = useSelector(state => state.strategicPartnerResponsesReducer.items)
  const updatingStrategicPartnerResponses = useSelector(state => state.strategicPartnerResponsesReducer.updatingStrategicPartnerResponses)

  const [payload, setPayload] = useState({
    strategic_partner: null,
    issara_user_focal_point: null,
    response_interaction_type: null,
    general_notes: '',
    next_steps: '',
    interaction_date: null,
    interaction_event_location: '',
    response_focal_point: ''
  })

  const [alert, setAlert] = useState(null)

  const id = new URLSearchParams(props.location.search).get('id') // id from query string of edited strategic partner response

  useEffect(() => {
    // Fetch strategic partners
    if (Object.keys(strategicPartnerResponses).length === 0) {
      dispatch(fetchStrategicPartnerResponses())
    }

    if (Object.keys(strategicPartnerResponses).length > 0 && id) {
      const strategicPartnerResponse = strategicPartnerResponses[id]

      if (strategicPartnerResponse) {
        setPayload({
          strategic_partner: strategicPartnerResponse.strategic_partner || null,
          issara_user_focal_point: strategicPartnerResponse.issara_user_focal_point || null,
          response_interaction_type: strategicPartnerResponse.response_interaction_type || null,
          general_notes: strategicPartnerResponse.general_notes || '',
          next_steps: strategicPartnerResponse.next_steps || '',
          interaction_date: strategicPartnerResponse.interaction_date || null,
          interaction_event_location: strategicPartnerResponse.interaction_event_location || '',
          response_focal_point: strategicPartnerResponse.response_focal_point || '',
        })
      }
    }
  }, [strategicPartnerResponses, id]);


  const handleConfirmSuccessAlert = () => {
    props.history.push('/admin/strategic-partner-responses')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id? 'Strategic partner response was updated' : 'Strategic partner response has been successfully created'}
      </SweetAlert>
    );
  };

  const errorAlert = (error) => {
    setAlert(
      <SweetAlert
        danger
        onConfirm={() => setAlert(null)}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Error"
      >
        {error.message}
      </SweetAlert>
    );
  };

  const onSubmit = () => {
    // Update existing strategic partner response if we got ID from URL query otherwise create new
    if (id) {
      dispatch(updateStrategicPartnerResponse(id, payload, successAlert, errorAlert))
    }
    else {
      dispatch(createStrategicPartnerResponse(payload, successAlert, errorAlert))
    }
  }

  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} lg={12}>
        <Card style={{marginTop: 0}}>
          <CardBody>
            <GridItem xs={12}>
              <StrategicPartnersDropdown
                value={payload.strategic_partner}
                onSelect={strategicPartner => {
                  setPayload({
                    ...payload,
                    strategic_partner: strategicPartner
                  })
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <ResponseInteractionTypesDropdown
                value={payload.response_interaction_type}
                onSelect={interactionType => {
                  setPayload({
                    ...payload,
                    response_interaction_type: interactionType
                  })
                }}
              />
            </GridItem>

            <GridItem xs={12} style={{marginTop:'-16px'}}>
              <CustomInput
                labelText="Interaction Location"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  type: "text",
                  onChange: e => setPayload({
                    ...payload,
                    interaction_event_location: e.target.value
                  })
                }}
                value={payload.interaction_event_location}
              />
            </GridItem>
            <GridItem xs={12} style={{marginTop:'-16px'}}>
              <CustomInput
                labelText="Name of business contact"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  type: "text",
                  onChange: e => setPayload({
                    ...payload,
                    response_focal_point: e.target.value
                  })
                }}
                value={payload.response_focal_point}
              />
            </GridItem>

            <GridItem xs={12} lg={3}>
              <Datetime
                timeFormat={false}
                inputProps={{ placeholder: "Interaction Date" }}
                value={payload.interaction_date}
                onChange={date => setPayload({
                  ...payload,
                  interaction_date: date._d? date._d.toLocaleDateString() : null
                })}
                closeOnSelect={true}
                closeOnTab={true}
              />
            </GridItem>

            <GridItem xs={12} >
              <CustomInput
                labelText="General Notes"
                isTextArea={true}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: e => setPayload({
                    ...payload,
                    general_notes: e.target.value
                  })
                }}
                value={payload.general_notes}
              />
            </GridItem>

            <GridItem xs={12} >
              <CustomInput
                labelText="Next Steps"
                isTextArea={true}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: e => setPayload({
                    ...payload,
                    next_steps: e.target.value
                  })
                }}
                value={payload.next_steps}
              />
            </GridItem>

            <GridItem xs={12} >
              <IssaraStaffDropdown
                value={payload.issara_user_focal_point}
                onSelect={issaraUser => {
                  setPayload({
                    ...payload,
                    issara_user_focal_point: issaraUser
                  })
                }}
              />
            </GridItem>

            <GridContainer justify='flex-end'>
              <GridItem>
                <Button color='success' onClick={onSubmit} disabled={updatingStrategicPartnerResponses}>Save</Button>
              </GridItem>
            </GridContainer>

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

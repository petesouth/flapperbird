import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";

import Datetime from "react-datetime";

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js";
import StrategicPartnersDropdown from "components/ilmdb/StrategicPartnersDropdown.js";
import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";
import ResponseInteractionTypesDropdown from "components/ilmdb/ResponseInteractionTypesDropdown.js";

import { fetchBusinessResponses, createBusinessResponse, updateBusinessResponse } from "../../redux/actions/BusinessResponseActions";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";


const customStyles = {
  ...sweetAlertStyles,
  header: {
    textAlign: 'center'
  },
  subheader: {
    fontWeight: '400',
  },
  datetime: {
    marginTop: '24px'
  },
};

const useStyles = makeStyles(customStyles);


export default function BusinessResponseForm(props) {

  const dispatch = useDispatch()
  const classes = useStyles();

  /*********************************************/
  /***************** START STATE ***************/
  /*********************************************/

  // Participants
  const [suppliers, setSuppliers] = useState([])
  const [suppliersNotes, setSuppliersNotes] = useState('')

  const [recruiters, setRecruiters] = useState([])
  const [recruitersNotes, setRecruitersNotes] = useState('')

  const [globalBuyers, setGlobalBuyers] = useState([])
  const [globalBuyersNotes, setGlobalBuyersNotes] = useState('')

  const [otherPartiesNotes, setOtherPartiesNotes] = useState('')

  // Details
  const [eventDetails, setEventDetails] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDate, setEventDate] = useState(null)
  const [eventInteractionType, setEventInteractionType] = useState(null)

  // Actions
  const [suppliersNextSteps, setSuppliersNextSteps] = useState('')
  const [suppliersNextStepsDeadline, setSuppliersNextStepsDeadline] = useState(null)
  const [suppliersFocalPoints, setSuppliersFocalPoints] = useState('')

  const [recruitersNextSteps, setRecruitersNextSteps] = useState('')
  const [recruitersNextStepsDeadline, setRecruitersNextStepsDeadline] = useState(null)
  const [recruitersFocalPoints, setRecruitersFocalPoints] = useState('')

  const [globalBuyersNextSteps, setGlobalBuyersNextSteps] = useState('')
  const [globalBuyersNextStepsDeadline, setGlobalBuyersNextStepsDeadline] = useState(null)
  const [globalBuyersFocalPoints, setGlobalBuyersFocalPoints] = useState('')

  const [issaraNextSteps, setIssaraNextSteps] = useState('')
  const [issaraNextStepsDeadline, setIssaraNextStepsDeadline] = useState(null)
  const [issaraFocalPoints, setIssaraFocalPoints] = useState([])

  const [createdBy, setCreatedBy] = useState(null)

  // Not related to payload
  const businessResponses = useSelector(state => state.businessResponsesReducer.items)
  const savingBusinessResponse = useSelector(state => state.businessResponsesReducer.savingBusinessResponse)
  const [alert, setAlert] = useState(null)

  const id = new URLSearchParams(props.location.search).get('id') // id from query string of edited business response

  useEffect(() => {
    // Fetch business responses
    dispatch(fetchBusinessResponses())
    
  }, []);

  useEffect(() => {

    if (businessResponses && Object.keys(businessResponses).length > 0 && id) {
      const item = businessResponses[id]

      if (item) {
        setSuppliers(item.suppliers);
        item.suppliers_notes && setSuppliersNotes(item.suppliers_notes);
        setRecruiters(item.recruiters);
        item.recruiters_notes && setRecruitersNotes(item.recruiters_notes);
        setGlobalBuyers(item.global_buyers);
        item.global_buyers_notes && setGlobalBuyersNotes(item.global_buyers_notes);
        item.other_parties_notes && setOtherPartiesNotes(item.other_parties_notes);

        item.event_details && setEventDetails(item.event_details);
        item.event_location && setEventLocation(item.event_location);
        setEventInteractionType(item.event_interaction_type);
        setEventDate(item.event_date && new Date(item.event_date));

        item.suppliers_next_steps && setSuppliersNextSteps(item.suppliers_next_steps);
        setSuppliersNextStepsDeadline(item.suppliers_next_steps_deadline && new Date(item.suppliers_next_steps_deadline));
        setSuppliersFocalPoints(item.suppliers_focal_points);

        item.recruiters_next_steps && setRecruitersNextSteps(item.recruiters_next_steps);
        setRecruitersNextStepsDeadline(item.recruiters_next_steps_deadline && new Date(item.recruiters_next_steps_deadline));
        setRecruitersFocalPoints(item.recruiters_focal_points);

        item.global_buyers_next_steps && setGlobalBuyersNextSteps(item.global_buyers_next_steps);
        setGlobalBuyersNextStepsDeadline(item.global_buyers_next_steps_deadline && new Date(item.global_buyers_next_steps_deadline));
        setGlobalBuyersFocalPoints(item.global_buyers_focal_points);

        item.issara_next_steps && setIssaraNextSteps(item.issara_next_steps);
        setIssaraNextStepsDeadline(item.issara_next_steps_deadline && new Date(item.issara_next_steps_deadline));
        setIssaraFocalPoints(item.issara_focal_points)

        item.created_by && setCreatedBy(item.created_by);
      }
    }
  }, [businessResponses]);

  /*********************************************/
  /****************** END STATE ****************/
  /*********************************************/

  const handleConfirmSuccessAlert = () => {
    props.history.push('/admin/business-responses')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id ? 'Business response was updated' : 'New business response has been successfully created'}
      </SweetAlert>
    );
  };

  const errorAlert = (error) => {
    console.log('ERRROR', error)
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
    const payload = {
      suppliers: suppliers,
      suppliers_notes: suppliersNotes,
      recruiters: recruiters,
      recruiters_notes: recruitersNotes,
      global_buyers: globalBuyers,
      global_buyers_notes: globalBuyersNotes,
      other_parties_notes: otherPartiesNotes,
      event_details: eventDetails,
      event_location: eventLocation,
      event_date: eventDate instanceof Date ? eventDate.toLocaleDateString() : null,
      event_interaction_type: eventInteractionType,
      suppliers_next_steps: suppliersNextSteps,
      suppliers_next_steps_deadline: suppliersNextStepsDeadline instanceof Date ? suppliersNextStepsDeadline.toLocaleDateString() : null,
      suppliers_focal_points: suppliersFocalPoints,
      recruiters_next_steps: recruitersNextSteps,
      recruiters_next_steps_deadline: recruitersNextStepsDeadline instanceof Date ? recruitersNextStepsDeadline.toLocaleDateString() : null,
      recruiters_focal_points: recruitersFocalPoints,
      global_buyers_next_steps: globalBuyersNextSteps,
      global_buyers_next_steps_deadline: globalBuyersNextStepsDeadline instanceof Date ? globalBuyersNextStepsDeadline.toLocaleDateString() : null,
      global_buyers_focal_points: globalBuyersFocalPoints,
      issara_next_steps: issaraNextSteps,
      issara_next_steps_deadline: issaraNextStepsDeadline instanceof Date ? issaraNextStepsDeadline.toLocaleDateString() : null,
      issara_focal_points: issaraFocalPoints,
    }

    if (createdBy) {
      payload['created_by'] = createdBy
    }

    // Update existing business response if we got ID from URL query otherwise create new
    if (id) {
      dispatch(updateBusinessResponse(id, payload, successAlert, errorAlert))
    }
    else {
      dispatch(createBusinessResponse(payload, successAlert, errorAlert))
    }
  }

  if( id && (businessResponses === undefined || businessResponses === null || Object.keys(businessResponses).length < 1)) {
    return <CircularProgress />
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} lg={12}>
        <Card style={{ marginTop: 0 }}>
          {alert}
          <CardBody>
            {/* PARTICIPANTS*/}
            <h3 className={classes.header}> Participants involved </h3>
            <GridItem>
              <h5 className={classes.subheader}> Suppliers involved in this event </h5>
              <SuppliersDropdown
                multipleselect={true}
                value={suppliers}
                onSelect={suppliers => setSuppliers(suppliers)}
              />
              <CustomInput
                name="suppliers_notes"
                value={suppliersNotes}
                labelText="Notes on participating suppliers"
                isTextArea={true}
                formControlProps={{ fullWidth: true }}
                inputProps={{ onChange: e => setSuppliersNotes(e.target.value) }}
              />
            </GridItem>

            <GridItem>
              <h5 className={classes.subheader}> Recruiters involved in this event </h5>
              <RecruitersDropdown
                multipleselect={true}
                value={recruiters}
                onSelect={recruiters => setRecruiters(recruiters)}
              />
              <CustomInput
                name="recruiters_notes"
                value={recruitersNotes}
                labelText="Notes on participating recruiters"
                isTextArea={true}
                formControlProps={{ fullWidth: true }}
                inputProps={{ onChange: e => setRecruitersNotes(e.target.value) }}
              />
            </GridItem>

            <GridItem>
              <h5 className={classes.subheader}> Global buyers involved in this event </h5>
              <StrategicPartnersDropdown
                multipleselect={true}
                value={globalBuyers}
                onSelect={globalBuyers => setGlobalBuyers(globalBuyers)}
              />
              <CustomInput
                name="global_buyers_notes"
                value={globalBuyersNotes}
                labelText="Notes on participating global buyers"
                isTextArea={true}
                formControlProps={{ fullWidth: true }}
                inputProps={{ onChange: e => setGlobalBuyersNotes(e.target.value) }}
              />
            </GridItem>

            <GridItem>
              <h5 className={classes.subheader}> Others involved in this event </h5>
              <CustomInput
                name="other_parties_notes"
                value={otherPartiesNotes}
                labelText="Notes on other participants"
                isTextArea={true}
                formControlProps={{ fullWidth: true }}
                inputProps={{ onChange: e => setOtherPartiesNotes(e.target.value) }}
              />
            </GridItem>

            <h3 className={classes.header}> Event details </h3>
            <GridItem>
              <ResponseInteractionTypesDropdown
                value={eventInteractionType}
                onSelect={interactionType => {
                  console.log(interactionType)
                  setEventInteractionType(interactionType)
                }}
              />
              <CustomInput
                name="event_details"
                value={eventDetails}
                labelText="Add details regarding event/interaction"
                isTextArea={true}
                formControlProps={{ fullWidth: true }}
                inputProps={{ onChange: e => setEventDetails(e.target.value) }}
              />
            </GridItem>
            <GridItem style={{ marginTop: '-16px' }}>
              <CustomInput
                name="event_location"
                value={eventLocation}
                labelText="Event Location"
                formControlProps={{ fullWidth: true }}
                inputProps={{ onChange: e => setEventLocation(e.target.value) }}
              />
            </GridItem>
            <GridItem xs={12} lg={3} style={{ marginTop: '-32px' }}>
              <FormControl>
                <Datetime
                  timeFormat={false}
                  value={eventDate}
                  onChange={date => setEventDate(date._d)}
                  inputProps={{ placeholder: "Event date" }}
                  className={classes.datetime}
                  closeOnSelect={true}
                  closeOnTab={true}
                />
              </FormControl>
            </GridItem>

            <h3 className={classes.header}> Agreed next steps </h3>
            <GridContainer>
              <GridItem xs={12}>
                <h5 className={classes.subheader}> Suppliers next steps </h5>
                <CustomInput
                  name="suppliers_next_steps"
                  value={suppliersNextSteps}
                  labelText="Agreed next steps for suppliers"
                  isTextArea={true}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{ onChange: e => setSuppliersNextSteps(e.target.value) }}
                />
              </GridItem>
              <GridItem xs={4} lg={2}>
                <FormControl>
                  <Datetime
                    id="suppliers_next_steps_deadline"
                    timeFormat={false}
                    value={suppliersNextStepsDeadline}
                    onChange={date => setSuppliersNextStepsDeadline(date._d)}
                    inputProps={{ placeholder: "Deadline for action" }}
                    className={classes.datetime}
                    closeOnSelect={true}
                    closeOnTab={true}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={8} lg={10}>
                <CustomInput
                  name="suppliers_focal_points"
                  value={suppliersFocalPoints}
                  labelText="Responsible supplier focal points"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{ onChange: e => setSuppliersFocalPoints(e.target.value) }}
                />
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12}>
                <h5 className={classes.subheader}> Recruiters next steps </h5>
                <CustomInput
                  name="recruiters_next_steps"
                  value={recruitersNextSteps}
                  labelText="Agreed next steps for recruiters"
                  isTextArea={true}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{ onChange: e => setRecruitersNextSteps(e.target.value) }}
                />
              </GridItem>
              <GridItem xs={4} lg={2}>
                <FormControl>
                  <Datetime
                    id="recruiters_next_steps_deadline"
                    timeFormat={false}
                    value={recruitersNextStepsDeadline}
                    onChange={date => setRecruitersNextStepsDeadline(date._d)}
                    inputProps={{ placeholder: "Deadline for action" }}
                    className={classes.datetime}
                    closeOnSelect={true}
                    closeOnTab={true}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={8} lg={10}>
                <CustomInput
                  name="recruiters_focal_points"
                  value={recruitersFocalPoints}
                  labelText="Responsible RA focal points"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{ onChange: e => setRecruitersFocalPoints(e.target.value) }}
                />
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12}>
                <h5 className={classes.subheader}> Global buyers next steps </h5>
                <CustomInput
                  name="global_buyers_next_steps"
                  value={globalBuyersNextSteps}
                  labelText="Agreed next steps for global buyers"
                  isTextArea={true}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{ onChange: e => setGlobalBuyersNextSteps(e.target.value) }}
                />
              </GridItem>
              <GridItem xs={4} lg={2}>
                <FormControl>
                  <Datetime
                    id="global_buyers_next_steps_deadline"
                    timeFormat={false}
                    value={globalBuyersNextStepsDeadline}
                    onChange={date => setGlobalBuyersNextStepsDeadline(date._d)}
                    inputProps={{ placeholder: "Deadline for action" }}
                    className={classes.datetime}
                    closeOnSelect={true}
                    closeOnTab={true}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={8} lg={10}>
                <CustomInput
                  name="global_buyers_focal_points"
                  value={globalBuyersFocalPoints}
                  labelText="Responsible global buyer focal points"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{ onChange: e => setGlobalBuyersFocalPoints(e.target.value) }}
                />
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12}>
                <h5 className={classes.subheader}> Issara next steps </h5>
                <CustomInput
                  name="issara_next_steps"
                  value={issaraNextSteps}
                  labelText="Agreed next steps for Issara"
                  isTextArea={true}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{ onChange: e => setIssaraNextSteps(e.target.value) }}
                />
              </GridItem>
              <GridItem xs={4} lg={2}>
                <FormControl>
                  <Datetime
                    id="issara_next_steps_deadline"
                    timeFormat={false}
                    value={issaraNextStepsDeadline}
                    onChange={date => setIssaraNextStepsDeadline(date._d)}
                    inputProps={{ placeholder: "Deadline for action" }}
                    className={classes.datetime}
                    closeOnSelect={true}
                    closeOnTab={true}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={8} lg={10}>
                <IssaraStaffDropdown
                  multipleselect={true}
                  value={issaraFocalPoints}
                  onSelect={issaraUsers => setIssaraFocalPoints(issaraUsers)}
                />
              </GridItem>
            </GridContainer>

            <GridContainer justify='flex-end'>
              <GridItem>
                <Button color='success' onClick={onSubmit} disabled={savingBusinessResponse}>Save</Button>
              </GridItem>
            </GridContainer>

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

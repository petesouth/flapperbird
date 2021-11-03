import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

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

import { fetchPersonContacts, createPersonContact, updatePersonContact } from "../../redux/actions/StrategicPartnerActions";

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



export default function PersonContactForm(props) {

  const dispatch = useDispatch()
  const classes = useStyles();

  /*********************************************/
  /***************** START STATE ***************/
  /*********************************************/

  // Participants
  const [contacts, setContacts] = useState([])
  // Not related to payload
  const personContacts = useSelector(state => (state.personContactsReducer) ? state.personContactsReducer.items : [])
  const savingPersonContacts = useSelector(state => (state.personContactsReducer) ? state.personContactsReducer.savingPersonContacts : false)
  const [alert, setAlert] = useState(null)

  const id = new URLSearchParams(props.location.search).get('id') // id from query string of edited business response

  const [payload, setPayload] = useState({
    name: null,
    phone: null,
    email: null,
    description: null,
  })

  useEffect(() => {
    // Fetch business responses
    if (Object.keys(personContacts).length === 0) {
      dispatch(fetchPersonContacts())
    }

  }, []);

  useEffect(() => {
    if (personContacts && id) {
      const item = personContacts[id]

      if (item) {
        setPayload(item);

      }
    }
  }, [personContacts]);

  /*********************************************/
  /****************** END STATE ****************/
  /*********************************************/

  const handleConfirmSuccessAlert = () => {
    // props.history.push('/admin/business-responses')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id ? 'Contact was updated' : 'Contact has been successfully created'}
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


    // Update existing business response if we got ID from URL query otherwise create new
    if (id) {
      dispatch(updatePersonContact(id, payload, successAlert, errorAlert))
    }
    else {
      dispatch(createPersonContact(payload, successAlert, errorAlert))
    }
  }

  return (
    <GridContainer>
      <Card style={{ marginTop: 0 }}>
        {alert}
        <CardBody>

          <h3 className={classes.header}> Contact </h3>
          <GridItem xs={12} >
            <CustomInput
              id="Name"
              labelText="Name of Contact"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                type: "text",
                onChange: e => setPayload({
                  ...payload,
                  name: e.target.value
                })
              }}
              value={payload.name}
            />
          </GridItem>

          <GridItem xs={12} >
            <CustomInput
              id="phone"
              labelText="Phone Number"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                type: "text",
                onChange: e => setPayload({
                  ...payload,
                  phone: e.target.value
                })
              }}
              value={payload.phone}
            />
          </GridItem>

          <GridItem xs={12} >
            <CustomInput
              id="email"
              labelText="Email"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                type: "text",
                onChange: e => setPayload({
                  ...payload,
                  email: e.target.value
                })
              }}
              value={payload.email}
            />
          </GridItem>



          <GridItem xs={12} >
            <CustomInput
              name="description"
              value={payload.description}
              labelText="Contact Description"
              isTextArea={true}
              formControlProps={{ fullWidth: true }}
              inputProps={{ onChange: e => setPayload({ 
                ...payload, 
                description: e.target.value }) }}
            />
          </GridItem>

          <GridContainer justify='flex-end'>
              <GridItem>
                <Button color='success' onClick={onSubmit} disabled={savingPersonContacts}>Save</Button>
              </GridItem>
            </GridContainer>

        </CardBody>
      </Card>
    </GridContainer >
  );
}

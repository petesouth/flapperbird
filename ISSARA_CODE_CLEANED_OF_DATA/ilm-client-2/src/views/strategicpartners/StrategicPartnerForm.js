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
import Button from "components/CustomButtons/Button.js";

import CountriesDropdown from "components/ilmdb/CountriesDropdown.js";
import SharedFilesDropdown from "components/ilmdb/SharedFilesDropdown.js";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import Check from "@material-ui/icons/Check";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { makeStyles } from "@material-ui/core/styles";
import { fetchStrategicPartners, createStrategicPartner, updateStrategicPartner } from "../../redux/actions/StrategicPartnerActions";
import loginStore from "../../redux/stores/LoginStore";
import utils from "../../services/utils.js";

const customStyle = {
  ...styles,
  ...sweetAlertStyles,
  label: {
    color: 'black',
    fontSize: '14px',
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.42857,
  },
  customLabel: {
    color: 'rgba(0, 0, 0, 0.87)'
  }
}

const useStyles = makeStyles(customStyle);


export default function StrategicPartnerForm(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const savingStrategicPartner = useSelector(state => state.strategicPartnerReducer.savingStrategicPartner)

  const [payload, setPayload] = useState({
    name: '',
    country: null,
    address: '',
    zipcode: '',
    imageicon: null,
    contract_start_date: null,
    contract_end_date: null,
    payment_amount: 0,
    payment_receipt_date: null,
    date_last_annual_risk_report: null,
    date_last_call_meeting_visit: null,
    focal_point_name: '',
    focal_point_title: '',
    focal_point_email: '',
    focal_point_phone_number: '',
    products_sourced: '',
    email_notify: false
  })

  const [alert, setAlert] = useState(null)

  const id = new URLSearchParams(props.location.search).get('id') // id from query string of edited strategic partner

  useEffect(() => {
    dispatch(fetchStrategicPartners())
  }, []);

  useEffect(() => {
    // Fetch strategic partners
    if (strategicPartners && strategicPartners.length > 0 && id) {
      const strategicPartner = strategicPartners.filter(item => { return item.id == id })[0]

      if (strategicPartner) {
        setPayload({
          name: strategicPartner.name || '',
          country: strategicPartner.country || null,
          address: strategicPartner.address || '',
          zipcode: strategicPartner.zipcode || '',
          imageicon: strategicPartner.imageicon || null,
          contract_start_date: strategicPartner.contract_start_date,
          contract_end_date: strategicPartner.contract_end_date,
          payment_amount: strategicPartner.payment_amount || 0,
          payment_receipt_date: strategicPartner.payment_receipt_date,
          date_last_annual_risk_report: strategicPartner.date_last_annual_risk_report,
          date_last_call_meeting_visit: strategicPartner.date_last_call_meeting_visit,
          focal_point_name: strategicPartner.focal_point_name || '',
          focal_point_title: strategicPartner.focal_point_title || '',
          focal_point_email: strategicPartner.focal_point_email || '',
          focal_point_phone_number: strategicPartner.focal_point_phone_number || '',
          products_sourced: strategicPartner.products_sourced || '',
          email_notify: strategicPartner.email_notify || false
        })
      }
    }
  }, [strategicPartners]);

  const handleConfirmSuccessAlert = () => {
    props.history.push('/admin/strategicpartners-list')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id ? 'Strategic partner was updated' : 'Strategic partner has been successfully created'}
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
    // Update existing strategic partner if we got ID from URL query otherwise create new
    if (id) {
      dispatch(updateStrategicPartner(id, payload, successAlert, errorAlert))
    }
    else {
      dispatch(createStrategicPartner(payload, successAlert, errorAlert))
    }
  }

  return (
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader color="rose" icon>
            <h4 className={classes.cardIconTitle}>Add/Edit Strategic Partner</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} >
                <CustomInput
                  id="Name"
                  labelText="Name of Partner"
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
                <CountriesDropdown values={payload.country} onSelect={(e) => {
                  setPayload({
                    ...payload,
                    country: e.target.value
                  });
                }}
                />
              </GridItem>
              <GridItem xs={9} >
                <CustomInput
                  id="adress"
                  labelText="Address"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      address: e.target.value
                    })
                  }}
                  value={payload.address}
                />
              </GridItem>
              <GridItem xs={3} >
                <CustomInput
                  id="zipcode"
                  labelText="zipcode"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      zipcode: e.target.value
                    })
                  }}
                  value={payload.zipcode}
                />
              </GridItem>
              <GridItem xs={6} >
                <CustomInput
                  id="focal_point_name"
                  labelText="Focal Point Name"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      focal_point_name: e.target.value
                    })
                  }}
                  value={payload.focal_point_name}
                />
              </GridItem>
              <GridItem xs={6} >
                <CustomInput
                  id="focal_point_title"
                  labelText="Focal Point Title"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      focal_point_title: e.target.value
                    })
                  }}
                  value={payload.focal_point_title}
                />
              </GridItem>
              <GridItem xs={6} >
                <CustomInput
                  id="focal_point_email"
                  labelText="Focal Point Email"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      focal_point_email: e.target.value
                    })
                  }}
                  value={payload.focal_point_email}
                />
              </GridItem>
              <GridItem xs={6} >
                <CustomInput
                  id="focal_point_phone"
                  labelText="Focal Point Phone Number"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      focal_point_phone_number: e.target.value
                    })
                  }}
                  value={payload.focal_point_phone_number}
                />
              </GridItem>

               <GridItem xs={6} >
                <FormControlLabel
                control={<Checkbox
                    key={utils.giveMeGuid()}
                    checked={payload.email_notify}
                    tabIndex={-1}
                    onClick={() => {
                        setPayload({
                        ...payload,
                        email_notify: !payload.email_notify
                      });
                    }}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />}
                classes={{
                  label: classes.label + ' ' + classes.customLabel,
                  root: classes.labelRoot
                }}
                label={"Send Notification Email to Partners"}
              />
              </GridItem>

              <GridItem xs={12} >
                <SharedFilesDropdown values={payload.imageicon} onSelect={(e) => {
                  setPayload({
                    ...payload,
                    imageicon: e.target.value
                  });
                }}
                />
              </GridItem>

              <GridItem xs={12} >
                <CustomInput
                  id="products_sourced"
                  labelText="Products Sourced"
                  isTextArea={true}
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: e => setPayload({
                      ...payload,
                      products_sourced: e.target.value
                    })
                  }}
                  value={payload.products_sourced}
                />
              </GridItem>

              <GridItem xs={12} >
                <CustomInput
                  id="pament_amount"
                  labelText="Payment Amount"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      setPayload({
                        ...payload,
                        payment_amount: e.target.value > 0 ? e.target.value : 0
                      })
                    }
                  }}
                  value={`${parseInt(payload.payment_amount)}` || null}
                />
              </GridItem>

            </GridContainer>

            <GridContainer>
              <GridItem xs={12} >
                <p className={classes.label} style={{ marginBottom: 0 }}>
                  Payment Receipt Date:
                </p>
                <Datetime
                  timeFormat={false}
                  inputProps={{ placeholder: "Open calendar" }}
                  value={payload.payment_receipt_date}
                  onChange={date => setPayload({
                    ...payload,
                    payment_receipt_date: date._d ? date._d.toLocaleDateString() : null
                  })}
                  closeOnSelect={true}
                  closeOnTab={true}
                />
              </GridItem>

              <GridItem xs={6}>
                <p className={classes.label} style={{ marginBottom: 0 }}>
                  Contract Start Date:
                </p>
                <Datetime
                  timeFormat={false}
                  inputProps={{ placeholder: "Open calendar" }}
                  value={payload.contract_start_date}
                  onChange={date => setPayload({
                    ...payload,
                    contract_start_date: date._d ? date._d.toLocaleDateString() : null
                  })}
                  closeOnSelect={true}
                  closeOnTab={true}
                />
              </GridItem>

              <GridItem xs={6}>
                <p className={classes.label} style={{ marginBottom: 0 }}>
                  Contract End Date:
                </p>
                <Datetime
                  timeFormat={false}
                  inputProps={{ placeholder: "Open calendar" }}
                  formControlProps={{ labelText: 'fsdfsdf' }}
                  value={payload.contract_end_date}
                  onChange={date => setPayload({
                    ...payload,
                    contract_end_date: date._d ? date._d.toLocaleDateString() : null
                  })}
                  closeOnSelect={true}
                  closeOnTab={true}
                />
              </GridItem>

              <GridItem xs={6}>
                <p className={classes.label} style={{ marginBottom: 0 }}>
                  Last Annual Risk Report Date:
                </p>
                <Datetime
                  timeFormat={false}
                  inputProps={{ placeholder: "Open calendar" }}
                  value={payload.date_last_annual_risk_report}
                  onChange={date => setPayload({
                    ...payload,
                    date_last_annual_risk_report: date._d ? date._d.toLocaleDateString() : null
                  })}
                  closeOnSelect={true}
                  closeOnTab={true}
                />
              </GridItem>

              <GridItem xs={6}>
                <p className={classes.label} style={{ marginBottom: 0 }}>
                  Last Interaction Date:
                </p>
                <FormControl fullWidth>
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "Open calendar" }}
                    value={payload.date_last_call_meeting_visit}
                    onChange={date => setPayload({
                      ...payload,
                      date_last_call_meeting_visit: date._d ? date._d.toLocaleDateString() : null
                    })}
                    closeOnSelect={true}
                    closeOnTab={true}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>


            <GridContainer justify='flex-end'>
              <GridItem>
                {(() => {
                  return (<div>
                    {loginStore.isDirectors() === false && <h4>*Please Note: To Add or Edit Strategic Partners you must have 'Directors' Group added to your account .</h4>}
                    <Button disabled={loginStore.isDirectors() === false} color='success' onClick={onSubmit}>Save</Button>
                  </div>)
                })()}
              </GridItem>
            </GridContainer>


          </CardBody>
        </Card>
      </GridItem>
    </GridContainer >);
}

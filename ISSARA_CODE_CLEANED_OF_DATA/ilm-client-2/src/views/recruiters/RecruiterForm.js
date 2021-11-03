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
import Utils from "services/utils";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import CountryProvincesDistrictsDropdown from "components/ilmdb/CountryProvincesDistrictsDropdown.js";

import IndustriesSubIndustriesDropdown from "components/ilmdb/IndustriesSubIndustriesDropdown.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { makeStyles } from "@material-ui/core/styles";

import {fetchRecruiters, createRecruiter, updateRecruiter} from "../../redux/actions/RecruiterActions";

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
}

const useStyles = makeStyles(customStyle);


export default function RecruiterForm(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const valueEmpty = "  ";

  const recruiters = useSelector(state => state.recruitersReducer.items)
  const fetchingRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)

  const [payload, setPayload] = useState({
    name: '',
    country: undefined,
    address: '',
    zipcode: '',
    gps: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    num_of_staff: 0,
    num_lisc_agents: 0,
    worker_placement_industries: '',
    other: '',
    industry: undefined,
    subindustry: undefined,
    country: undefined,
    province: undefined,
    district: undefined,
    facebook_website: undefined,
    description: undefined,
    website: undefined,
    lng: undefined,
    lat: undefined,
    golden_dreams_recruiter_id: undefined,
    tier_id: undefined
  })




  const [alert, setAlert] = useState(null)

  const id = (props.location) ? new URLSearchParams(props.location.search).get('id') : ((props.recruiterId) ? props.recruiterId : null); // id from query string of edited strategic partner

  useEffect(() => {
    dispatch(fetchRecruiters())
  },[]);
  
  useEffect(() => {
    
    if (recruiters && recruiters.length > 0 && id) {
      const recruiter = recruiters.filter(item => { return item.id == id })[0]

      if (recruiter) {
        setPayload({
          name: recruiter.name || '',
          address: recruiter.address || '',
          zipcode: recruiter.zipcode,
          gps: recruiter.gps,
          contact_name: recruiter.contact_name,
          contact_phone: recruiter.contact_phone,
          contact_email: recruiter.contact_email,
          num_of_staff: recruiter.num_of_staff,
          num_lisc_agents: recruiter.num_lisc_agents,
          worker_placement_industries: recruiter.worker_placement_industries,
          other: recruiter.other,
          industry: recruiter.industry,
          subindustry: recruiter.subindustry,
          country: recruiter.country || null,
          province: recruiter.province || null,
          district: recruiter.district || null,
          facebook_website: recruiter.facebook_website || null,
          description: recruiter.description || null,
          website: recruiter.website || null,
          tier_id: recruiter.tier_id || null,
          lng: recruiter.lng || null,
          lat: recruiter.lat || null,
          golden_dreams_recruiter_id: recruiter.golden_dreams_recruiter_id || null,
          
        })
      }
    }
  }, [fetchingRecruiters]);


  const handleConfirmSuccessAlert = () => {

    if( props.handleConfirmSuccessAlert ) {
      props.handleConfirmSuccessAlert(); 
    } else {
      props.history.push('/admin/recruiters')
    }
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        {id ? 'Recruiter was updated' : 'Recruiter has been successfully created'}
      </SweetAlert>
    );

    dispatch(fetchRecruiters())
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
    if (id) {
      dispatch(updateRecruiter(id, payload, successAlert, errorAlert))

    }
    else {
      dispatch(createRecruiter(payload, successAlert, errorAlert))
    }
  }

  let spacer = (<GridContainer>
    <GridItem>
      <br />
    </GridItem>
  </GridContainer>);

  return (
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader color="rose" icon>
            <h4 className={classes.cardIconTitle}>Add/Edit Recruiter</h4>
          </CardHeader>
          <CardBody>

            <GridContainer>
              <GridItem xs={12} >
                <CustomInput
                  id="Name"
                  labelText="Name of Recruiter"
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
                  id="website"
                  labelText="website"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      website: e.target.value
                    })
                  }}
                  value={payload.website}
                />
              </GridItem>
              <GridItem xs={12} >
                <CustomInput
                  id="facebook_website"
                  labelText="facebook_website"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      facebook_website: e.target.value
                    })
                  }}
                  value={payload.facebook_website}
                />
              </GridItem>
              <GridItem xs={12} >
                <CustomInput
                  id="description"
                  labelText="Description"
                  formControlProps={{ fullWidth: true }}
                  isTextArea={true}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      description: e.target.value
                    })
                  }}
                  value={payload.description}
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

              <GridItem xs={3} >
                <CustomInput
                  id="lng"
                  labelText="lng"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      lng: e.target.value
                    })
                  }}
                  value={payload.lng}
                />
                
              </GridItem> 
              
              <GridItem xs={3} >
                <CustomInput
                  id="lat"
                  labelText="lat"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      lat: e.target.value
                    })
                  }}
                  value={payload.lat}
                />
              </GridItem>

              <GridItem xs={12}>
                <IndustriesSubIndustriesDropdown key={Utils.giveMeGuid()} industry_values={payload.industry}
                  subindustry_values={payload.subindustry}
                  onSelect={(e) => {
                    console.log("Recruiter Selected:", e);
                    setPayload({
                      ...payload,
                      industry: e.industry_id,
                      subindustry: e.subindustry_id
                    });
                  }} />
              </GridItem>

              <GridItem xs={12}>
                <CountryProvincesDistrictsDropdown key={Utils.giveMeGuid()} country_values={(payload.country) ? { id: payload.country } : undefined}
                  province_values={(payload.province) ? { id: payload.province } : undefined}
                  district_values={(payload.district) ? { id: payload.district } : undefined}
                  onSelect={(e) => {
                    console.log("Recruiter Selected:", e);
                    setPayload({
                      ...payload,
                      country: e.country_id,
                      province: e.province_id,
                      district: e.district_id
                    });
                  }} />
              </GridItem>
            </GridContainer>

            <GridContainer>

              <GridItem xs={12} >
                <CustomInput
                  id="contact_name"
                  labelText="contact_name"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      contact_name: e.target.value
                    })
                  }}
                  value={payload.contact_name}
                />
              </GridItem>


              <GridItem xs={12} >
                <CustomInput
                  id="contact_phone"
                  labelText="contact_phone"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      contact_phone: e.target.value
                    })
                  }}
                  value={payload.contact_phone}
                />
              </GridItem>

              <GridItem xs={12} >
                <CustomInput
                  id="contact_email"
                  labelText="contact_email"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      contact_email: e.target.value
                    })
                  }}
                  value={payload.contact_email}
                />
              </GridItem>

            </GridContainer>

            <GridContainer>

              <GridItem xs={6} >
                <CustomInput
                  id="gps"
                  labelText="gps"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      gps: e.target.value
                    })
                  }}
                  value={payload.gps}
                />
              </GridItem>

              <GridItem xs={12} >
                <CustomInput
                  id="tier_id"
                  labelText="tier_id"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "number",
                    onChange: e => setPayload({
                      ...payload,
                      tier_id: e.target.value
                    })
                  }}
                  value={payload.tier_id}
                />
              </GridItem>

              <GridItem xs={12} >
                <CustomInput
                  id="golden_dreams_recruiter_id"
                  labelText="golden_dreams_recruiter_id"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "number",
                    onChange: e => setPayload({
                      ...payload,
                      golden_dreams_recruiter_id: e.target.value
                    })
                  }}
                  value={payload.golden_dreams_recruiter_id}
                />
              </GridItem>

            </GridContainer>

            {spacer}

           

            {spacer}

           <GridContainer>

           

           <GridItem xs={12} >
                <CustomInput
                  id="worker_placement_industries"
                  labelText="worker_placement_industries"
                  formControlProps={{ fullWidth: true }}
                  isTextArea={true}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      worker_placement_industries: e.target.value
                    })
                  }}
                  value={payload.worker_placement_industries}
                />
              </GridItem>

              <GridItem xs={12} >
                <CustomInput
                  id="other"
                  labelText="other"
                  formControlProps={{ fullWidth: true }}
                  isTextArea={true}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      other: e.target.value
                    })
                  }}
                  value={payload.other}
                />
              </GridItem>

            </GridContainer>

            {spacer}

            <GridContainer justify='flex-end'>
              <GridItem>
                <Button color='success' onClick={onSubmit} disabled={fetchingRecruiters}>Save</Button>
              </GridItem>
            </GridContainer>


          </CardBody>
        </Card>
      </GridItem>
    </GridContainer >);
}

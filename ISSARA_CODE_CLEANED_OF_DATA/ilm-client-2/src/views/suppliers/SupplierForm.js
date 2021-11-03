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

import loginStore from "../../redux/stores/LoginStore"
import { fetchSuppliers, createSupplier, updateSupplier } from "../../redux/actions/SupplierActions";

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


export default function SupplierForm(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const valueEmpty = "  ";

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const savingSupplier = useSelector(state => state.suppliersReducer.fetchingSuppliers)

  const [payload, setPayload] = useState({
    name: '',
    country: undefined,
    address: '',
    zipcode: '',
    gps: '',
    tier_id: undefined,
    vessel_number: '',
    fishing_gear_liscense_number: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    name_harvesting_business: '',
    num_vessels_sourced_from: 0,
    total_num_workers: 0,
    total_num_thai_workers: 0,
    total_num_cambodian_workers: 0,
    total_num_myanmar_workers: 0,
    total_num_lao_workers: 0,
    total_num_vietnamese_workers: 0,
    hiring_practice: '',
    other: '',
    vessel_type: undefined,
    industry: undefined,
    subindustry: undefined,
    lng: undefined,
    lat: undefined,
    country: undefined,
    province: undefined,
    district: undefined
  })




  const [alert, setAlert] = useState(null)

  const id = (props.location) ? new URLSearchParams(props.location.search).get('id') : ((props.supplierId) ? props.supplierId : null); // id from query string of edited strategic partner

  useEffect(()=>{
    if(suppliers === null || suppliers === undefined || suppliers.length < 1 ) {
      dispatch(fetchSuppliers());
    }
  },[])

  useEffect(() => {
    // Fetch strategic partners
    if (suppliers.length > 0 && id) {
      const supplier = suppliers.filter(item => { return item.id == id })[0]

      if (supplier) {
        setPayload({
          name: supplier.name || '',
          address: supplier.address || '',
          zipcode: supplier.zipcode,
          gps: supplier.gps,
          tier_id: supplier.tier_id,
          vessel_number: supplier.vessel_number,
          fishing_gear_liscense_number: supplier.fishing_gear_liscense_number,
          contact_name: supplier.contact_name,
          contact_phone: supplier.contact_phone,
          contact_email: supplier.contact_email,
          name_harvesting_business: supplier.name_harvesting_business,
          num_vessels_sourced_from: supplier.num_vessels_sourced_from,
          total_num_workers: supplier.total_num_workers,
          total_num_thai_workers: supplier.total_num_thai_workers,
          total_num_cambodian_workers: supplier.total_num_cambodian_workers,
          total_num_myanmar_workers: supplier.total_num_myanmar_workers,
          total_num_lao_workers: supplier.total_num_lao_workers,
          total_num_vietnamese_workers: supplier.total_num_vietnamese_workers,
          golden_dreams_employer_id: supplier.golden_dreams_employer_id,
          hiring_practice: supplier.hiring_practice,
          other: supplier.other,
          vessel_type: supplier.vessel_type,
          industry: supplier.industry,
          subindustry: supplier.subindustry,
          country: supplier.country || null,
          province: supplier.province || null,
          district: supplier.district || null,
          website: supplier.website || null,
          description: supplier.description || null,
          lng: supplier.lng,
          lat: supplier.lat
        })
      }
    }
  }, [suppliers]);

  const handleConfirmSuccessAlert = () => {

    if( props.handleConfirmSuccessAlert ) {
      props.handleConfirmSuccessAlert();
    } else {
      props.history.push('/admin/suppliers-list')
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
        {id ? 'Supplier was updated' : 'Supplier has been successfully created'}
      </SweetAlert>
    );

    dispatch(fetchSuppliers())
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
      dispatch(updateSupplier(id, payload, successAlert, errorAlert))

    }
    else {
      dispatch(createSupplier(payload, successAlert, errorAlert))
    }
  }

  let spacer = (<GridContainer>
    <GridItem>
      <br />
    </GridItem>
  </GridContainer>);

  return (id && (suppliers === undefined || suppliers === null || suppliers.length === undefined || suppliers.length < 1)) ? (<div>Loading...</div>) :(
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader color="rose" icon>
            <h4 className={classes.cardIconTitle}>Add/Edit Supplier</h4>
          </CardHeader>
          <CardBody>

            <GridContainer>
              <GridItem xs={12} >
                <CustomInput
                  id="Name"
                  labelText="Name of Supplier"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      name: e.target.value
                    }),
                    disabled: !loginStore.isIssaraManagement()
                  }}
                  value={payload.name}
                />
              </GridItem>
              <GridItem xs={12} >
              <CustomInput
                  id="website"
                  labelText="Website of Supplier"
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
                    type: "number",
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
                    type: "number",
                    onChange: e => setPayload({
                      ...payload,
                      lat: e.target.value
                    })
                  }}
                  value={payload.lat}
                />
              </GridItem>


              <GridItem xs={12} >
                <CustomInput
                  id="description"
                  labelText="description"
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

              <GridItem xs={12}>
                <IndustriesSubIndustriesDropdown key={Utils.giveMeGuid()} industry_values={payload.industry}
                  subindustry_values={payload.subindustry}
                  onSelect={(e) => {
                    console.log("Supplier Selected:", e);
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
                    console.log("Supplier Selected:", e);
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
              <GridItem xs={6}>
                <CustomInput
                  id="tier_id"
                  labelText="tier_id"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        tier_id: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.tier_id)}` || undefined}
                />
              </GridItem>

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

            </GridContainer>

            {spacer}

            <GridContainer>
              <GridItem xs={6} >
                <CustomInput
                  id="vessel_number"
                  labelText="vessel_number"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      vessel_number: e.target.value
                    })
                  }}
                  value={payload.vessel_number}
                />
              </GridItem>

              <GridItem xs={6} >
                <CustomInput
                  id="fishing_gear_liscense_number"
                  labelText="fishing_gear_liscense_number"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      fishing_gear_liscense_number: e.target.value
                    })
                  }}
                  value={payload.fishing_gear_liscense_number}
                />
              </GridItem>
            </GridContainer>

            {spacer}

            <GridContainer>
              <GridItem xs={12} >
                <CustomInput
                  id="hiring_practice"
                  labelText="hiring_practice"
                  isTextArea={true}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    type: "text",
                    onChange: e => setPayload({
                      ...payload,
                      hiring_practice: e.target.value
                    })
                  }}
                  value={payload.hiring_practice}
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

            <GridContainer>
              <GridItem xs={3}>
                <CustomInput
                  id="num_vessels_sourced_from"
                  labelText="num_vessels_sourced_from"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        num_vessels_sourced_from: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.num_vessels_sourced_from)}` || undefined}
                />
              </GridItem>

              <GridItem xs={3}>
                <CustomInput
                  id="total_num_workers"
                  labelText="total_num_workers"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        total_num_workers: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.total_num_workers)}` || undefined}
                />
              </GridItem>


              <GridItem xs={3}>
                <CustomInput
                  id="total_num_thai_workers"
                  labelText="total_num_thai_workers"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        total_num_thai_workers: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.total_num_thai_workers)}` || undefined}
                />
              </GridItem>

              <GridItem xs={3}>
                <CustomInput
                  id="total_num_cambodian_workers"
                  labelText="total_num_cambodian_workers"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        total_num_cambodian_workers: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.total_num_cambodian_workers)}` || undefined}
                />
              </GridItem>

              <GridItem xs={3}>
                <CustomInput
                  id="total_num_myanmar_workers"
                  labelText="total_num_myanmar_workers"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        total_num_myanmar_workers: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.total_num_myanmar_workers)}` || undefined}
                />
              </GridItem>


              <GridItem xs={3}>
                <CustomInput
                  id="total_num_lao_workers"
                  labelText="total_num_lao_workers"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        total_num_lao_workers: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.total_num_lao_workers)}` || undefined}
                />
              </GridItem>

              <GridItem xs={3}>
                <CustomInput
                  id="total_num_vietnamese_workers"
                  labelText="total_num_vietnamese_workers"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        total_num_vietnamese_workers: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.total_num_vietnamese_workers)}` || undefined}
                />
              </GridItem>

              <GridItem xs={3}>
                <div title="You get these values from the golden dreams tab">
                <CustomInput
                  id="golden_dreams_employer_id"
                  labelText="golden_dreams_employer_id"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    onChange: (e) => {
                      let value = e.target.value;
                      if (value < 0) {
                        value = 0;
                      }
                      setPayload({
                        ...payload,
                        golden_dreams_employer_id: value
                      })
                    }
                  }}
                  value={`${parseInt(payload.golden_dreams_employer_id)}` || undefined}
                />
                </div>
              </GridItem>


            </GridContainer>

            <GridContainer justify='flex-end'>
              <GridItem>
                <Button color='success' onClick={onSubmit} disabled={savingSupplier}>Save</Button>
              </GridItem>
            </GridContainer>


          </CardBody>
        </Card>
      </GridItem>
    </GridContainer >);
}

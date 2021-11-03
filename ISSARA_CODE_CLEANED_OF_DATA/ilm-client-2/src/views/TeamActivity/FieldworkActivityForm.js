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
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger"


import { CircularProgress } from "@material-ui/core";
import Datetime from "react-datetime";

import FieldworkTypeDropdown from "../../components/ilmdb/FieldworkTypeDropdown.js";
import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js";
import CountryProvincesDistrictsDropdown from "../../components/ilmdb/CountryProvincesDistrictsDropdown.js";

import { fetchFieldworkTypes } from "../../redux/actions/TeamActivityActions";
import OutreachFields from "./ActivityExtraFields/OutreachFields"
import OtherFields from "./ActivityExtraFields/OtherFields"

import { fetchSuppliers } from "redux/actions/SupplierActions.js";
import { fetchRecruiters } from "redux/actions/RecruiterActions.js";
import { fetchFieldworkActivitiy, createFieldworkActivity, updateFieldworkActivity } from "../../redux/actions/TeamActivityActions.js";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import utils from "../../services/utils.js";

import loginStore from "../../redux/stores/LoginStore";

const customStyles = {
  ...sweetAlertStyles,
  label: {
    color: 'black',
    fontSize: '16px',
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.42857,
  },
};

const useStyles = makeStyles(customStyles);


export default function FieldworkActivityForm(props) {

  const dispatch = useDispatch()
  const classes = useStyles()

  const id = (props.location) ? new URLSearchParams(props.location.search).get('id') : ((props.supplierId) ? props.supplierId : null); // id from query string of edited strategic partner


  const fieldworkActivities = useSelector(state => state.teamActivityReducer.fieldworkActivities)
  const fetchingFieldworkActivities = useSelector(state => state.teamActivityReducer.fetchingFieldworkActivities)


  const fieldworkTypes = useSelector(state => state.teamActivityReducer.fieldworkTypes)
  const fetchingFieldworkTypes = useSelector(state => state.teamActivityReducer.fetchingFieldworkTypes)

  const suppliers = useSelector(state => state.suppliersReducer.items)

  /*********************************************/
  /***************** START STATE ***************/
  /*********************************************/
  const [payload, setPayload] = useState({
    fieldwork_date: new Date()
  })
  const [outreachPayload, setOutreachPayload] = useState({
    total_workers_reached: 0,
    female_workers_reached: 0,
    male_workers_reached: 0,
    myanmar_workers_reached: 0,
    cambodian_workers_reached: 0,
    thai_workers_reached: 0,
    lao_workers_reached: 0,
    other_workers_reached: 0
  })
  const [otherPayload, setOtherPayload] = useState({
    strategic_partners: [],
    total_people_reached: 0,
    male_reached: 0,
    female_reached: 0,
    primary_focus: null,
    primary_focus_other_description: null
  })
  const [submitted, setSubmitted] = useState(false)

  // Not related to payload
  const [alert, setAlert] = useState(null)

  /*********************************************/
  /****************** END STATE ****************/
  /*********************************************/

  const sumOfNationalities = (
    outreachPayload.myanmar_workers_reached
    + outreachPayload.cambodian_workers_reached
    + outreachPayload.thai_workers_reached
    + outreachPayload.lao_workers_reached
    + outreachPayload.other_workers_reached
  )

  const handleConfirmSuccessAlert = () => {
    props.history.push('/admin/issara-dashboard')
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        onConfirm={handleConfirmSuccessAlert}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Well done!"
      >
        New fieldwork activity has been successfully created
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

  const validated = () => {
    if (!payload.fieldwork_date) {
      return false
    }

    if (payload.fieldWorkType) {
      if (payload.fieldWorkType.category == 1) {
        if (outreachPayload.total_workers_reached < outreachPayload.female_workers_reached
          || outreachPayload.total_workers_reached < outreachPayload.male_workers_reached
          || outreachPayload.total_workers_reached != sumOfNationalities
        ) {
          return false
        } else {
          return true
        }
      } else {
        if (otherPayload.total_people_reached < otherPayload.female_reached
          || otherPayload.total_people_reached < otherPayload.male_reached
        ) {
          return false
        } else {
          return true
        }
      }
    }
    return false
  }

  const onSubmit = () => {
    setSubmitted(true)
    if (validated()) {
      const extraPayload = payload.fieldWorkType.category == 1 ? outreachPayload : otherPayload
      payload.fieldwork_date = utils.turnDateIntoString(payload.fieldwork_date)
      payload.fieldwork_type = payload.fieldWorkType.id

      if (!id) {
        dispatch(createFieldworkActivity({ ...payload, ...extraPayload }, successAlert, errorAlert));
      } else {
        dispatch(updateFieldworkActivity(id, { ...payload, ...extraPayload }, successAlert, errorAlert));
      }
    }
  }

  const extraFields = (category) => {
    if (category === 1) {
      return (
        <OutreachFields
          state={outreachPayload}
          onChange={values => setOutreachPayload({ ...outreachPayload, ...values })}
        />
      )
    } else if ([2, 3, 4].includes(category)) {
      return (
        <OtherFields
          state={otherPayload}
          onChange={values => setOtherPayload({ ...otherPayload, ...values })}
        />
      )
    } else {
      return <p> Please contact a developer </p>
    }
  }



  useEffect(() => {
    dispatch(fetchFieldworkTypes());

    if (suppliers === null || suppliers === undefined || suppliers.length < 1) {
      dispatch(fetchSuppliers());

    }

    if (id !== null && id !== "" && id !== undefined &&
      Object.keys(fieldworkActivities).length < 1) {
      dispatch(fetchFieldworkActivitiy(id));
    }

  }, [])

  useEffect(() => {
    if (Object.keys(fieldworkActivities).length > 0 &&
      Object.keys(fieldworkTypes).length > 0 &&
      id !== null && id !== "" && id !== undefined) {
      const fieldworkActivity = fieldworkActivities[id];
      fieldworkActivity.fieldWorkType = (() => {
        let found = null;
        Object.keys(fieldworkTypes).map((key) => {
          let comparedTypes = fieldworkTypes[key];
          comparedTypes.types.forEach((item) => {
            if (item && item.id === fieldworkActivity.fieldwork_type) {
              found = item;
            }
          });
        });
        return found;
      })();
      let thePayload = { ...fieldworkActivity, fieldwork_date: (fieldworkActivity.fieldwork_date) ? new Date(fieldworkActivity.fieldwork_date) : new Date() };
      setPayload(thePayload);
      setOutreachPayload({
        total_workers_reached: thePayload.total_workers_reached,
        female_workers_reached: thePayload.female_workers_reached,
        male_workers_reached: thePayload.male_workers_reached,
        myanmar_workers_reached: thePayload.myanmar_workers_reached,
        cambodian_workers_reached: thePayload.cambodian_workers_reached,
        thai_workers_reached: thePayload.thai_workers_reached,
        lao_workers_reached: thePayload.lao_workers_reached,
        other_workers_reached: thePayload.other_workers_reached
      })

      setOtherPayload({
        strategic_partners: (thePayload.strategic_partners) ? thePayload.strategic_partners : [],
        total_people_reached: thePayload.total_people_reached,
        male_reached: thePayload.male_reached,
        female_reached: thePayload.female_reached,
        primary_focus: (thePayload.primary_focus) ? thePayload.primary_focus : null,
        primary_focus_other_description: thePayload.primary_focus_other_description
      })
    }
  }, [fieldworkActivities, fieldworkTypes]);



  const commonForm = (extraFields) => (
    <GridItem xs={12}>
      <div className='mt-1'>
        <p className={classes.label}> Suppliers </p>
        <SuppliersDropdown
          multipleselect={true}
          value={payload.suppliers}
          onSelect={suppliers => setPayload({ ...payload, suppliers: suppliers })}
        />
      </div>

      <div className='mt-1'>
        <p className={classes.label}> Recruiters </p>
        <RecruitersDropdown
          multipleselect={true}
          value={payload.recruiters}
          onSelect={recruiters => setPayload({ ...payload, recruiters: recruiters })}
        />
      </div>

      {extraFields}

      <div className='mt-1'>
        <p className={classes.label} style={{ marginBottom: '-16px' }}>
          Notes
        </p>
        <CustomInput
          isTextArea={true}
          formControlProps={{ fullWidth: true }}
          inputProps={{
            onChange: (e) => setPayload({ ...payload, notes: e.target.value })
          }}
          value={payload.notes}
        />
      </div>
    </GridItem>
  )


  if (!suppliers || suppliers.length < 1 ||
    (id !== null && id !== undefined && id !== "" && Object.keys(fieldworkActivities).length < 1) ||
    Object.keys(fieldworkTypes).length < 1) {
    return (<CircularProgress />);
  }

  return (
    <GridItem xs={12} sm={12} lg={12}>
      <Card style={{ marginTop: 0 }}>
        {alert}
        <CardBody>
          <GridContainer>

            <GridItem xs={12}>
              <p className={classes.label} style={{ marginBottom: 0 }}>
                Date of fieldwork
              </p>
              <Datetime
                timeFormat={false}
                inputProps={{ placeholder: "Click here to open calendar" }}
                onChange={date => setPayload({ ...payload, fieldwork_date: date._d })}
                value={payload.fieldwork_date}
                closeOnSelect
              />
              {submitted && !payload.fieldwork_date &&
                <Danger>
                  <p style={{ textAlign: 'right' }}> Please choose the date </p>
                </Danger>
              }
            </GridItem>

            <GridItem xs={12}>
              <CountryProvincesDistrictsDropdown
                key={utils.giveMeGuid()}
                country_values={{ id: payload.country }}
                province_values={{ id: payload.province }}
                onSelect={(data) => {
                  setPayload({
                    ...payload,
                    country: data.country_id,
                    province: data.province_id
                  });
                }}
                hideDistrict
              />
            </GridItem>

            <GridItem xs={12}>
              <FieldworkTypeDropdown
                value={payload.fieldWorkType}
                onSelect={fieldworkType => {
                  setPayload({ ...payload, fieldWorkType: fieldworkType })
                }}
              />
            </GridItem>

            {payload.fieldWorkType && commonForm(extraFields(payload.fieldWorkType.category))}

          </GridContainer>

          {submitted && !payload.fieldWorkType &&
            <Danger>
              <p> Please choose a fieldwork type </p>
            </Danger>
          }

          {submitted && !validated() &&
            <Danger>
              <p style={{ textAlign: 'right' }}> Please fix the errors above </p>
            </Danger>
          }

          <GridContainer justify='flex-end'>
            <GridItem>
              {(() => {
                let isManagement = loginStore.isIssaraManagement();
                let isActivityUser = loginStore.isActivityUser();
                let isId = id !== null && id !== undefined && id !== "";
                let isDisabled = ( (isId && !isManagement) ||(!isId && !isManagement && !isActivityUser));

                return (<div>
                  {isDisabled === true && <h4>*Please Note: To Edit you must have 'Issara Management' Group added to your account
                    and to add new Items you must have 'Activity User' Group added to your account .</h4>}

                  <Button disabled={isDisabled} color='success' onClick={onSubmit}>Save</Button>
                </div>)
              })()}

            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </GridItem>
  );
}

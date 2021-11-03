import React, {useState, useEffect} from "react";

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

import Datetime from "react-datetime";

import { createMonthlyWorkerVoice } from "redux/actions/TeamActivityActions.js";


import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";


const customStyles = {
  ...sweetAlertStyles,
  label: {
    color: 'black',
    fontSize: '16px',
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.42857,
  },
  customGridItem: {
    marginTop: '-20px',
  },
};

const useStyles = makeStyles(customStyles);


export default function MonthlyWorkerVoiceForm(props) {

  const dispatch = useDispatch()
  const classes = useStyles()

  /*********************************************/
  /***************** START STATE ***************/
  /*********************************************/

  const [monthYear, setMonthYear] = useState(null)
  const [mmHotlineTotal, setMmHotlineTotal] = useState(0)
  const [yangonHotlineTotal, setYangonHotlineTotal] = useState(0)
  const [mmFbTotal, setMmFbTotal] = useState(0)
  const [mmLineTotal, setMmLineTotal] = useState(0)
  const [mmViberTotal, setMmViberTotal] = useState(0)
  const [cbHotlineTotal, setCbHotlineTotal] = useState(0)
  const [cbFbTotal, setCbFbTotal] = useState(0)
  const [cbLineTotal, setCbLineTotal] = useState(0)
  const [cbViberTotal, setCbViberTotal] = useState(0)
  const [thaiHotlineTotal, setThaiHotlineTotal] = useState(0)
  const [thaiFbTotal, setThaiFbTotal] = useState(0)
  const [thaiLineTotal, setThaiLineTotal] = useState(0)
  const [thaiViberTotal, setThaiViberTotal] = useState(0)


  // Not related to payload
  const [alert, setAlert] = useState(null)

  /*********************************************/
  /****************** END STATE ****************/
  /*********************************************/

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
        New monthly worker voice record has been successfully created
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
      month_year: monthYear instanceof Date? monthYear.toLocaleDateString() : null,
      mm_hotline_total: mmHotlineTotal,
      yangon_hotline_total: yangonHotlineTotal,
      mm_fb_total: mmFbTotal,
      mm_line_total: mmLineTotal,
      mm_viber_total: mmViberTotal,
      cb_hotline_total: cbHotlineTotal,
      cb_fb_total: cbFbTotal,
      cb_line_total: cbLineTotal,
      cb_viber_total: cbViberTotal,
      thai_hotline_total: thaiHotlineTotal,
      thai_fb_total: thaiFbTotal,
      thai_line_total: thaiLineTotal,
      thai_viber_total: thaiViberTotal
    }
    console.log(payload)
    dispatch(createMonthlyWorkerVoice(payload, successAlert, errorAlert))
  }

  return (
      <GridItem xs={12} sm={12} lg={12}>
        <Card style={{marginTop: 0}}>
          {alert}
          <CardBody>
            <GridContainer>

              <GridItem lg={2}>
                <p className={classes.label} style={{marginBottom:0}}>
                  Month Year
                </p>
                <Datetime
                  dateFormat='YYYY-MM'
                  inputProps={{ placeholder: "Click here to open calendar" }}
                  closeOnSelect={true}
                  onChange={date => setMonthYear(date._d)}
                  value={monthYear}
                />
              </GridItem>

              <GridContainer justify="center" style={{padding: 0}}>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="MM Hotline Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setMmHotlineTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(mmHotlineTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="Yangon Hotline Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setYangonHotlineTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(yangonHotlineTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="MM Facebok Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setMmFbTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(mmFbTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="MM Line Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setMmLineTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(mmLineTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="MM Viber Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setMmViberTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(mmViberTotal)}`}
                  />
                </GridItem>

                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="CB Hotline Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setCbHotlineTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(cbHotlineTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="CB Facebook Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setCbFbTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(cbFbTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="CB Line Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setCbLineTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(cbLineTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="CB Viber Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setCbViberTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(cbViberTotal)}`}
                  />
                </GridItem>

                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="TH Hotline Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setThaiHotlineTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(thaiHotlineTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="TH Facebook Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setThaiFbTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(thaiFbTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="TH Line Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setThaiLineTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(thaiLineTotal)}`}
                  />
                </GridItem>
                <GridItem className={classes.customGridItem}>
                  <CustomInput
                    labelText="TH Viber Total"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      type: "number",
                      onChange: (e) => {
                        setThaiViberTotal(e.target.value > 0? e.target.value : 0)
                      }
                    }}
                    value={`${parseInt(thaiViberTotal)}`}
                  />
                </GridItem>
              </GridContainer>

            </GridContainer>

            <GridContainer justify='flex-end'>
              <GridItem>
                <Button color='success' onClick={onSubmit}>Save</Button>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
  );
}

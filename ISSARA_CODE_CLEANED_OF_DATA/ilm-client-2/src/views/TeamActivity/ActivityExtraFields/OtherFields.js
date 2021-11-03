import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Danger from "components/Typography/Danger"

import StrategicPartnersDropdown from "components/ilmdb/StrategicPartnersDropdown.js";
import FieldworkActivityPrimaryFocusesDropdown from "components/ilmdb/FieldworkActivityPrimaryFocusesDropdown"


const customStyles = {
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


export default function OtherFields(props) {
  const classes = makeStyles(customStyles)()

  return (
    <div className='mt-1'>

      <p className={classes.label}> Strategic Partners </p>
      <StrategicPartnersDropdown
        multipleselect={true}
        value={props.state.strategic_partners}
        onSelect={partners => props.onChange({strategic_partners: partners})}
      />

      <div className='mt-1'>
        <FieldworkActivityPrimaryFocusesDropdown
          value={props.state.primary_focus}
          onSelect={primary_focus => props.onChange({primary_focus: primary_focus})}
        />
      </div>

      {props.state.primary_focus == 4 &&
        <div className='mt-1'>
          <p className={classes.label} style={{ marginBottom: '-16px' }}>
            Other Primary Focus Description
          </p>
          <CustomInput
            isTextArea={true}
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: (e) => props.onChange({primary_focus_other_description: e.target.value})
            }}
            value={props.state.primary_focus_other_description}
          />
        </div>
      }

      <p className='mt-1' style={{marginBottom: -10}}> Estimated number of people reached </p>
      <GridContainer>
        <GridItem lg={1}>
          <CustomInput
            labelText="Total"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                total_people_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
                female_reached: Math.floor(e.target.value/2),
                male_reached: e.target.value - (Math.floor(e.target.value/2))
              })
            }}
            value={`${parseInt(props.state.total_people_reached)}`}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Female"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                female_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
                male_reached: props.state.total_people_reached - e.target.value
              })
            }}
            value={`${parseInt(props.state.female_reached)}`}
            helperText={
              props.state.total_people_reached < props.state.female_reached
              && "This value can not be greater than the total "
            }
            error={props.state.total_people_reached < props.state.female_reached}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Male"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                male_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
                female_reached: props.state.total_people_reached - e.target.value
              })
            }}
            value={`${parseInt(props.state.male_reached)}`}
            helperText={
              props.state.total_people_reached < props.state.male_reached
              && "This value can not be greater than the total "
            }
            error={props.state.total_people_reached < props.state.male_reached}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

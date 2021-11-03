import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Danger from "components/Typography/Danger"


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


export default function OutreachFields(props) {
  const classes = makeStyles(customStyles)()

  const sumOfNationalities = (
    props.state.myanmar_workers_reached
    + props.state.cambodian_workers_reached
    + props.state.thai_workers_reached
    + props.state.lao_workers_reached
    + props.state.other_workers_reached
  )

  return (
    <div className='mt-1'>
      <p className={classes.label} style={{marginBottom: -10}}> Estimated number of workers reached </p>
      <GridContainer>
        <GridItem lg={1}>
          <CustomInput
            labelText="Total"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                total_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
                female_workers_reached: Math.floor(e.target.value/2),
                male_workers_reached: e.target.value - (Math.floor(e.target.value/2))
              })
            }}
            value={`${parseInt(props.state.total_workers_reached)}`}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Female"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                female_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
                male_workers_reached: props.state.total_workers_reached - e.target.value
              })
            }}
            value={`${parseInt(props.state.female_workers_reached)}`}
            helperText={
              props.state.total_workers_reached < props.state.female_workers_reached
              && "This value can not be greater than the total"
            }
            error={props.state.total_workers_reached < props.state.female_workers_reached}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Male"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                male_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
                female_workers_reached: props.state.total_workers_reached - e.target.value
              })
            }}
            value={`${parseInt(props.state.male_workers_reached)}`}
            helperText={
              props.state.total_workers_reached < props.state.male_workers_reached
              && "This value can not be greater than the total "
            }
            error={props.state.total_workers_reached < props.state.male_workers_reached}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Burmese"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                myanmar_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
              })
            }}
            value={`${parseInt(props.state.myanmar_workers_reached)}`}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Cambodian"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                cambodian_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
              })
            }}
            value={`${parseInt(props.state.cambodian_workers_reached)}`}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Thai"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                thai_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
              })
            }}
            value={`${parseInt(props.state.thai_workers_reached)}`}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Lao"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                lao_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
              })
            }}
            value={`${parseInt(props.state.lao_workers_reached)}`}
          />
        </GridItem>

        <GridItem lg={1}>
          <CustomInput
            labelText="Other"
            formControlProps={{ fullWidth: true }}
            inputProps={{
              type: 'number',
              onChange: (e) => props.onChange({
                  other_workers_reached: e.target.value > 0 ? parseInt(e.target.value) : 0,
                })
            }}
            value={`${parseInt(props.state.other_workers_reached)}`}
          />
        </GridItem>
      </GridContainer>
      {props.state.total_workers_reached != sumOfNationalities &&
        <Danger>
          <p>
            {
              `Total (${props.state.total_workers_reached})
              ${props.state.total_workers_reached > sumOfNationalities? '>' : '<'}
              Sum of nationalities (${sumOfNationalities})`
            }
          </p>
        </Danger>
      }
    </div>
  );
}

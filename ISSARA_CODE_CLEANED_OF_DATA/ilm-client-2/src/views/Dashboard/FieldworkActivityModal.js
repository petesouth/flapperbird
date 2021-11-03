import React, {useState, useEffect} from "react";

import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


const customStyles = {
  paper: {
    backgroundColor: 'white',
    padding: 30,
    webkitBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    mozBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    boxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
  },
  modal: {
    display: 'block',
    maxWidth: '70%',
    height: '100%',
    overflowWrap: "break-word",
    overflowY: "auto;",
    overflowX: "none;",
    paddingBottom: "20px"
  },
  spanLabel: {
    fontWeight: 500,
  },
  button: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    top: '40px',
    right: '40px',
    scrollbars: "none"
  },
  preBlock: {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    scroll: "none",
    width: "100%"
  }
};

const useStyles = makeStyles(customStyles);


export default function FieldworkActivityModal(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const recruiters = useSelector(state => state.recruitersReducer.items)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)

  const fieldworkActivities = useSelector(state => state.teamActivityReducer.fieldworkActivities)


  const getSuppliersNames = (ids) => {
    let names = []
    const filteredSuppliers = ids.map(id => {
      return suppliers.find((supplier) => {
        return supplier.id === id
      })
    })
    names = filteredSuppliers.map(item => {
      return item.name
    })
    return names.length > 0? names.join(', ') : '-'
  }

  

  const getStrategicPartnerNames = (ids) => {
    let names = []
    const filteredPartners = ids.map(id => {
      return strategicPartners.find((partner) => {
        return partner.id === id
      })
    })
    names = filteredPartners.map(item => {
      return item.name
    })
    return names.length > 0? names.join(', ') : '-'
  }

  const getRecruitersNames = (ids) => {
    let names = []
    const filteredRecruiters = ids.map(id => {
      return recruiters.find((recruiter) => {
        return recruiter.id === id
      })
    })
    names = filteredRecruiters.map(item => {
      return item.name
    })
    return names.length > 0? names.join(', ') : '-'
  }

  const fieldworkActivity = fieldworkActivities[props.value]

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <h3 style={{marginTop: 0}}> {`Fieldwork Activity #${props.value}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon/>
        </Button>
        {fieldworkActivity &&
          <div>
            <Divider />
            <h5> General Information: </h5>
            <p> <span className={classes.spanLabel}> Type: </span> {fieldworkActivity.fieldwork_type_name} </p>
            <p> <span className={classes.spanLabel}> Date:</span> {fieldworkActivity.fieldwork_date && new Date(fieldworkActivity.fieldwork_date).toDateString() || '-'} </p>
            <p> <span className={classes.spanLabel}> Location: </span> {fieldworkActivity.location || '-'} </p>
            <p> <span className={classes.spanLabel}> Workers Reached: </span> {fieldworkActivity.outreach_target} </p>
            <p> <span className={classes.spanLabel}> Suppliers: </span> {getSuppliersNames(fieldworkActivity.suppliers)} </p>
            <p> <span className={classes.spanLabel}> Recruiters: </span> {getRecruitersNames(fieldworkActivity.recruiters)} </p>
            <p> <span className={classes.spanLabel}> Partners: </span> {getStrategicPartnerNames(fieldworkActivity.strategic_partners)} </p>
            <p> <span className={classes.spanLabel}> Nationality: </span> {fieldworkActivity.nationality_name} </p>
            <p><span className={classes.spanLabel}>  Notes:</span>
            <GridItem xs={12} md={12} lg={12}><p className={classes.preBlock} style={{overflow: "overflow-wrap"}}>
              {fieldworkActivity.notes}</p>
            </GridItem>
            </p>
           
          </div>
        }
        </div>
    </Modal>
  );
}

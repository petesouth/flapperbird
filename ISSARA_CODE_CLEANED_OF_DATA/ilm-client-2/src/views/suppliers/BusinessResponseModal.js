import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import FormControl from "@material-ui/core/FormControl";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';

import Datetime from "react-datetime";

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js";
import StrategicPartnersDropdown from "components/ilmdb/StrategicPartnersDropdown.js";
import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";
import ResponseInteractionTypesDropdown from "components/ilmdb/ResponseInteractionTypesDropdown.js";

import { fetchRecruiters } from "../../redux/actions/RecruiterActions";
import { fetchStrategicPartners } from "../../redux/actions/StrategicPartnerActions";

import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";


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


export default function BusinessResponseModal(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const businessResponses = useSelector(state => state.businessResponsesReducer.items)
  const users = useSelector(state => state.usersReducer.items)
  const suppliers = useSelector(state => state.suppliersReducer.items)
  const recruiters = useSelector(state => state.recruitersReducer.items)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const interactionTypes = useSelector(state => state.responseInteractionTypesReducer.items)

  useEffect(() => {
    // Fetch recruiters
    if (recruiters.length === 0) {
      dispatch(fetchRecruiters())
    }
    // Fetch strategicPartners
    if (strategicPartners.length === 0) {
      dispatch(fetchStrategicPartners())
    }
  }, []);

  const getSupplierNames = (ids) => {
    let names = []
    const filteredSuppliers = ids.map(id => {
      return suppliers.find((supplier) => {
        return supplier.id === id
      })
    })
    names = filteredSuppliers.map(item => {
      return item.name
    })
    return names.length > 0 ? names.join(', ') : '-'
  }

  const getRecruiterNames = (ids) => {
    let names = []
    const filteredRecruiters = ids.map(id => {
      return recruiters.find((recruiter) => {
        return recruiter.id === id
      })
    })
    names = filteredRecruiters.map(item => {
      return item.name
    })
    return names.length > 0 ? names.join(', ') : '-'
  }

  const getStrategicPartnerNames = (ids) => {
    let names = []
    const filteredStrategicPartners = ids.map(id => {
      return strategicPartners.find((strategicPartner) => {
        return strategicPartner.id === id
      })
    })
    names = filteredStrategicPartners.map(item => {
      return item.name
    })
    return names.length > 0 ? names.join(', ') : '-'
  }

  const getInteractionTypeName = (id) => {
    const interactionType = interactionTypes.find((element) => {
      return element.id === id
    });
    return interactionType ? interactionType.name : '-'
  }

  const getIssaraNames = (ids) => {
    let names = []
    const filteredUsers = ids.map(id => {
      return users.find((user) => {
        return user.id === id
      })
    })
    names = filteredUsers.map(item => {
      return item.first_name
    })
    return names.length > 0 ? names.join(', ') : '-'
  }

  const businessResponse = businessResponses[props.value]

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <h3 style={{ marginTop: 0 }}> {`Business Response #${props.value}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </Button>
        <Divider />
        <h5> Participants: </h5>
        <p> <span className={classes.spanLabel}>Suppliers:</span> {businessResponse && getSupplierNames(businessResponse.suppliers)} </p>
        <p><span className={classes.spanLabel}>Suppliers Notes:</span>
          <GridItem xs={12} md={12} lg={12}>
            <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
              {businessResponse && businessResponse.suppliers_notes || '-'}
            </p>
          </GridItem>
        </p>


        <p> <span className={classes.spanLabel}>Recruiters:</span> {businessResponse && getRecruiterNames(businessResponse.recruiters)} </p>
        <p><span className={classes.spanLabel}>Recruiters Notes:</span>
          <GridItem xs={12} md={12} lg={12}>
            <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
              {businessResponse && businessResponse.recruiters_notes || '-'}
            </p>
          </GridItem>
        </p>

        <p> <span className={classes.spanLabel}>Global Buyers:</span> {businessResponse && getStrategicPartnerNames(businessResponse.global_buyers)} </p>
        <p><span className={classes.spanLabel}>Global Buyers Notes:</span>
          <GridItem xs={12} md={12} lg={12}>
            <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
              {businessResponse && businessResponse.global_buyers_notes || '-'}
            </p>
          </GridItem>
        </p>

        <p><span className={classes.spanLabel}>Other Participants Notes:</span>
          <GridItem xs={12} md={12} lg={12}>
            <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
              {businessResponse && businessResponse.other_parties_notes || '-'}
            </p>
          </GridItem>
        </p>

        <Divider />
        <h5> Event Details: </h5>
        <p> <span className={classes.spanLabel}>Type:</span> {businessResponse && getInteractionTypeName(businessResponse.event_interaction_type)} </p>
        <p> <span className={classes.spanLabel}>Location:</span> {businessResponse && businessResponse.event_location} </p>
        <p> <span className={classes.spanLabel}>Date:</span> {businessResponse && businessResponse.event_date && new Date(businessResponse.event_date).toDateString() || '-'} </p>
        <div> <span className={classes.spanLabel}>Details:</span><GridItem xs={12} md={12} lg={12}>
          <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
            {businessResponse && businessResponse.event_details || '-'}
          </p>
        </GridItem></div>

        <Divider />
        <h5> Agreed Next Steps: </h5>
        <p> <span className={classes.spanLabel}>Suppliers Next Steps: </span>
          <GridItem xs={12} md={12} lg={12}>
            <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
              {businessResponse && businessResponse.suppliers_next_steps || '-'}
            </p>
          </GridItem></p>
        <p> <span className={classes.spanLabel}>Suppliers Focal Points: </span> {businessResponse && businessResponse.suppliers_focal_points || '-'} </p>
        <p> <span className={classes.spanLabel}>Suppliers Next Steps Deadline: </span> {businessResponse && businessResponse.suppliers_next_steps_deadline && new Date(businessResponse.suppliers_next_steps_deadline).toDateString() || '-'} </p>

        <p> <span className={classes.spanLabel}>Recruiters Next Steps:</span> <GridItem xs={12} md={12} lg={12}>
          <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
            {businessResponse && businessResponse.recruiters_next_steps || '-'}
          </p>
        </GridItem></p>
        <p> <span className={classes.spanLabel}>Recruiters Focal Points:</span> {businessResponse && businessResponse.recruiters_focal_points || '-'} </p>
        <p> <span className={classes.spanLabel}>Recruiters Next Steps Deadline:</span> {businessResponse && businessResponse.recruiters_next_steps_deadline && new Date(businessResponse.recruiters_next_steps_deadline).toDateString() || '-'} </p>
        <p> <span className={classes.spanLabel}>Global Buyers Next Steps:</span> <GridItem xs={12} md={12} lg={12}>
          <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
            {businessResponse && businessResponse.global_buyers_next_steps || '-'}
          </p>
        </GridItem> </p>
        <p> <span className={classes.spanLabel}>Global Buyers Focal Points:</span> {businessResponse && businessResponse.global_buyers_focal_points || '-'} </p>
        <p> <span className={classes.spanLabel}>Global Buyers Next Steps Deadline:</span>{businessResponse && businessResponse.global_buyers_next_steps_deadline && new Date(businessResponse.global_buyers_next_steps_deadline).toDateString() || '-'} </p>
        <p> <span className={classes.spanLabel}>Issara Next Steps:</span>
          <GridItem xs={12} md={12} lg={12}>
            <p className={classes.preBlock} style={{ overflow: "overflow-wrap" }}>
              {businessResponse && businessResponse.issara_next_steps || '-'}
            </p>
          </GridItem></p>
        <p> <span className={classes.spanLabel}>Issara Focal Points:</span> {businessResponse && getIssaraNames(businessResponse.issara_focal_points)} </p>
        <p> <span className={classes.spanLabel}>Issara Next Steps Deadline:</span> {businessResponse && businessResponse.issara_next_steps_deadline && new Date(businessResponse.issara_next_steps_deadline).toDateString() || '-'} </p>
      </div>
    </Modal>
  );
}

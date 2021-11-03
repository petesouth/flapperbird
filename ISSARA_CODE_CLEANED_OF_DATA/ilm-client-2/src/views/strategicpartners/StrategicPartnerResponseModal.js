import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';

import { fetchResponseInteractionTypes } from "../../redux/actions/LocaleActions.js";


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
    overflowY: 'auto !important',
    maxWidth: '700px',
    height: '100%',
  },
  spanLabel: {
    fontWeight: 500,
  },
  button: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    top: '40px',
    right: '40px'
  }
};

const useStyles = makeStyles(customStyles);

export default function StrategicPartnerResponseModal(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const users = useSelector(state => state.usersReducer.items)
  const interactionTypes = useSelector(state => state.responseInteractionTypesReducer.items)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const strategicPartnerResponses = useSelector(state => state.strategicPartnerResponsesReducer.items)

  useEffect(() => {
    // Fetch interaction types
    if (interactionTypes.length === 0) {
      dispatch(fetchResponseInteractionTypes())
    }
  }, []);

  const getStrategicPartnerName = (id) => {
    const strategicPartnerResponse = strategicPartners.find(strategicPartnerResponse => {
      return strategicPartnerResponse.id === parseInt(id)
    })
    return strategicPartnerResponse? strategicPartnerResponse.name : '-'
  }

  const getInteractionTypeName = (id) => {
    const interactionType = interactionTypes.find(interactionType => {
      return interactionType.id === parseInt(id)
    })
    return interactionType? interactionType.name : '-'
  }

  const getUserName = (id) => {
    const user = users.find(user => {
      return user.id === parseInt(id)
    })
    return user? user.first_name : '-'
  }

  const strategicPartnerResponse = strategicPartnerResponses[props.value]

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{marginTop: 0}}> {`Response #${strategicPartnerResponse && strategicPartnerResponse.id}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon/>
        </Button>
        <p> <span className={classes.spanLabel}> Strategic Partner: </span> {strategicPartnerResponse && getStrategicPartnerName(strategicPartnerResponse.strategic_partner)} </p>
        <p> <span className={classes.spanLabel}> Interaction Type: </span> {strategicPartnerResponse && getInteractionTypeName(strategicPartnerResponse.response_interaction_type)} </p>
        <p> <span className={classes.spanLabel}> Interaction Location: </span> {strategicPartnerResponse && strategicPartnerResponse.interaction_event_location || '-'} </p>
        <p> <span className={classes.spanLabel}> Interaction Date: </span> {strategicPartnerResponse && strategicPartnerResponse.interaction_date && new Date(strategicPartnerResponse.interaction_date).toDateString() || '-'} </p>
        <p> <span className={classes.spanLabel}> Response Focal Point: </span> {strategicPartnerResponse && strategicPartnerResponse.response_focal_point || '-'} </p>
        <div> <span className={classes.spanLabel}> General Notes: </span><pre>{strategicPartnerResponse && strategicPartnerResponse.general_notes || '-'}</pre></div>
        <div> <span className={classes.spanLabel}> Next Steps: </span><pre>{strategicPartnerResponse && strategicPartnerResponse.next_steps || '-'}</pre></div>
        <p> <span className={classes.spanLabel}> Issara Focal Point: </span> {strategicPartnerResponse && getUserName(strategicPartnerResponse.issara_user_focal_point)} </p>
      </div>
    </Modal>
  );
}

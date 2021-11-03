import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import GridContainer from "components/Grid/GridContainer.js";

import GridItem from "components/Grid/GridItem.js";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';


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

export default function RecruiterModal(props) {
  const classes = useStyles();

  const countries = useSelector(state => state.countriesReducer.items)
  const provinces = useSelector(state => state.provincesReducer.items)
  const industries = useSelector(state => state.industriesReducer.items)
  const subindustries = useSelector(state => state.subIndustriesReducer.items)
  const districts = useSelector(state => state.districtsReducer.items);



  const recruiters = useSelector(state => state.recruitersReducer.items)
  const fetchingRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)

  const getRecruiter = (id) => {
    return recruiters.find(recruiter => {
      return recruiter.id === parseInt(id)
    })
  }

  const getCountryName = (id) => {
    if(!id) return "N/A";
    const tobject = countries.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }

  const getDistrictName = (id) => {
    if(!id) return "N/A";
    const tobject = districts.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }


  const getProvinceName = (id) => {
    if(!id) return "N/A";
    const tobject = provinces.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }


  const getIndustryName = (id) => {
    if(!id) return "N/A";
    const tobject = industries.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }

  const getSubIndustryName = (id) => {
    if(!id) return "N/A";
    const tobject = subindustries.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }

  const recruiter = getRecruiter(props.value)

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{ marginTop: 0 }}> {`${recruiter && recruiter.name || '-'}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </Button>
        <GridContainer>
          <GridItem xs={6} sm={6} lg={6}>
            <h4> Location: </h4>
            <p> <span className={classes.spanLabel}> Created: </span> {recruiter && recruiter.created || '-'} </p>
            <p> <span className={classes.spanLabel}> Address: </span> {recruiter && recruiter.address || '-'} </p>
            <p> <span className={classes.spanLabel}> Zipcode: </span> {recruiter && recruiter.zipcode || '-'} </p>
            <p> <span className={classes.spanLabel}> Country: </span> {recruiter && getCountryName(recruiter.country)} </p>
            <p> <span className={classes.spanLabel}> Province: </span> {recruiter && getProvinceName(recruiter.province)} </p>
            <p> <span className={classes.spanLabel}> District: </span> {recruiter && getDistrictName(recruiter.district)} </p>
            <p> <span className={classes.spanLabel}> Industry: </span> {recruiter && getIndustryName(recruiter.industry)} </p>
            <p> <span className={classes.spanLabel}> Sub Industry: </span> {recruiter && getSubIndustryName(recruiter.subindustry)} </p>
            <p> <span className={classes.spanLabel}> Zipcode: </span> {recruiter && recruiter.zipcode || '-'} </p>
            <p> <span className={classes.spanLabel}> Lng: </span> {recruiter && recruiter.lng || '-'} </p>
            <p> <span className={classes.spanLabel}> Lat: </span> {recruiter && recruiter.lat || '-'} </p>
            <p> <span className={classes.spanLabel}> Gps: </span> {recruiter && recruiter.gps || '-'} </p>
            <p> <span className={classes.spanLabel}> website: </span> {(recruiter && recruiter.website) ? (<a target="_blank" href={recruiter.website}>{recruiter.website}</a>) : '-'} </p>
            <p> <span className={classes.spanLabel}> facebook_website: </span> {(recruiter && recruiter.facebook_website) ? (<a target="_blank" href={recruiter.facebook_website}>{recruiter.facebook_website}</a>) : '-'} </p>
            <p> <span className={classes.spanLabel}> Tier ID: </span> {recruiter && recruiter.tier_id || '-'} </p>
            <p> <span className={classes.spanLabel}> Golden Dreams Recruiter ID: </span> {recruiter && recruiter.golden_dreams_recruiter_id || '-'} </p>
            
          </GridItem>

          <GridItem xs={6} sm={6} lg={6}>
            <h4> Contact: </h4>
            <p> <span className={classes.spanLabel}> contact_name: </span> {recruiter && recruiter.contact_name || '-'} </p>
            <p> <span className={classes.spanLabel}> contact_phone: </span> {recruiter && recruiter.contact_phone || '-'} </p>
            <p> <span className={classes.spanLabel}> contact_email: </span> {recruiter && recruiter.contact_email || '-'} </p>
            <p> <span className={classes.spanLabel}> num_of_staff: </span> {recruiter && recruiter.num_of_staff || '-'} </p>
            <p> <span className={classes.spanLabel}> num_lisc_agents: </span> {recruiter && recruiter.num_lisc_agents || '-'} </p>
            </GridItem>

      
          <GridItem xs={6} sm={6} lg={6}>
            <h4> Informative: </h4>
            <p> <span className={classes.spanLabel}> worker_placement_industries: </span> {recruiter && recruiter.worker_placement_industries || '-'} </p>
            <p> <span className={classes.spanLabel}> Other: </span> {recruiter && recruiter.other || '-'} </p>
            <p> <span className={classes.spanLabel}> Description: </span> {recruiter && recruiter.description || '-'} </p>
          </GridItem>
        </GridContainer>
      </div>
    </Modal>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GridContainer from "components/Grid/GridContainer.js";

import GoogleMapReact from 'google-map-react';
import GridItem from "components/Grid/GridItem.js";

// core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';

import Tooltip from '@material-ui/core/Tooltip';

import ReactTable from "react-table-6";
import Utils from "../../services/utils";

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
  }
};

const useStyles = makeStyles(customStyles);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const AnyReactComponent = ({ text }) => (<div>
  <HtmlTooltip title={text} interactive>
    <AccountCircleIcon style={{ fontSize: "18px", color: "red" }} />
  </HtmlTooltip></div>);


export default function SupplierModal(props) {
  const classes = useStyles();

  const defaultProps = {
    center: {
      lng: 100.5018,
      lat: 13.7563
    },
    zoom: 7
  };

  const suppliers = useSelector(state => state.suppliersReducer.items);

  const industries = useSelector(state => state.industriesReducer.items);

  const subindustries = useSelector(state => state.subIndustriesReducer.items);

  const countries = useSelector(state => state.countriesReducer.items);

  const provinces = useSelector(state => state.provincesReducer.items);

  const districts = useSelector(state => state.districtsReducer.items);

  const supplyChains = useSelector(state => state.supplyChainReducer.items);


  const getSupplyChains = (supplier) => {
    if (!supplier) {
      return [];
    }
    let supplyChainFound = [];
    let foundMap = new Map();
    supplyChains.forEach((supplyChain) => {
      foundMap.has(supplyChain.id) === false &&
        supplyChain.suppliers && supplyChain.suppliers.forEach((supplierId) => {
          if (supplier.id === supplierId) {
            foundMap.set(supplyChain.id, supplyChain);
            supplyChainFound.push(supplyChain);
          }
        });
    });

    return supplyChainFound;
  }

  const getSupplier = (id) => {
    return suppliers.find(supplier => {
      return supplier.id === parseInt(id)
    })
  }

  const getCountryName = (id) => {
    const tobject = countries.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }

  const getDistrictName = (id) => {
    const tobject = districts.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }


  const getProvinceName = (id) => {
    const tobject = provinces.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }


  const getIndustryName = (id) => {
    const tobject = industries.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }

  const getSubIndustryName = (id) => {
    const tobject = subindustries.find((ttobject) => {
      return ttobject.id === id
    });
    return tobject ? tobject.name : '-'
  }

  const supplier = getSupplier(props.value)

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{ marginTop: 0 }}> {`${supplier && supplier.name || '-'}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </Button>
        <GridContainer>
          <GridItem>
            <br />
          </GridItem>

          <GridContainer>

            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h4> General: </h4>
              <p> <span className={classes.spanLabel}> website: </span> {supplier && (<a target="_blank" href={supplier.website}>{supplier.website}</a>) || '-'} </p>
              <p> <span className={classes.spanLabel}> Company Description: </span> {supplier && supplier.description || '-'} </p>
            </GridItem>

          </GridContainer>

          <GridContainer>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h4> Location: </h4>
              <p> <span className={classes.spanLabel}> Created: </span> {supplier && supplier.created || '-'} </p>
              <p> <span className={classes.spanLabel}> Address: </span> {supplier && supplier.address || '-'} </p>
              <p> <span className={classes.spanLabel}> Zipcode: </span> {supplier && supplier.zipcode || '-'} </p>
              <p> <span className={classes.spanLabel}> Country: </span> {supplier && getCountryName(supplier.country)} </p>
              <p> <span className={classes.spanLabel}> Province: </span> {supplier && getProvinceName(supplier.province)} </p>
              <p> <span className={classes.spanLabel}> District: </span> {supplier && getDistrictName(supplier.district)} </p>
              <p> <span className={classes.spanLabel}> Industry: </span> {supplier && getIndustryName(supplier.industry)} </p>
              <p> <span className={classes.spanLabel}> Sub Industry: </span> {supplier && getSubIndustryName(supplier.subindustry)} </p>
              <p> <span className={classes.spanLabel}> Zipcode: </span> {supplier && supplier.zipcode || '-'} </p>
              <p> <span className={classes.spanLabel}> Lng: </span> {supplier && supplier.lng || '-'} </p>
              <p> <span className={classes.spanLabel}> Lat: </span> {supplier && supplier.lat || '-'} </p>
              
            </GridItem>

            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h4> Contact: </h4>
              <p> <span className={classes.spanLabel}> contact_name: </span> {supplier && supplier.contact_name || '-'} </p>
              <p> <span className={classes.spanLabel}> contact_phone: </span> {supplier && supplier.contact_phone || '-'} </p>
              <p> <span className={classes.spanLabel}> contact_email: </span> {supplier && supplier.contact_email || '-'} </p>
              <p> <span className={classes.spanLabel}> vessel_number: </span> {supplier && supplier.vessel_number || '-'} </p>
              <p> <span className={classes.spanLabel}> fishing_gear_liscense_number: </span> {supplier && supplier.fishing_gear_liscense_number || '-'} </p>
            </GridItem>

          </GridContainer>

          <GridContainer>
            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h4> Work Environment: </h4>

              <p> <span className={classes.spanLabel}> Tier_Id: </span> {supplier && supplier.tier_id || '-'} </p>
              <p> <span className={classes.spanLabel}> name_harvesting_business: </span> {supplier && supplier.name_harvesting_business || '-'} </p>
              <p> <span className={classes.spanLabel}> num_vessels_sourced_from: </span> {supplier && supplier.num_vessels_sourced_from || '-'} </p>
              <p> <span className={classes.spanLabel}> total_num_workers: </span> {supplier && supplier.total_num_workers || '-'} </p>
              <p> <span className={classes.spanLabel}> total_num_thai_workers: </span> {supplier && supplier.total_num_thai_workers || '-'} </p>
              <p> <span className={classes.spanLabel}> total_num_cambodian_workers: </span> {supplier && supplier.total_num_cambodian_workers || '-'} </p>
              <p> <span className={classes.spanLabel}> total_num_myanmar_workers: </span> {supplier && supplier.total_num_myanmar_workers || '-'} </p>
              <p> <span className={classes.spanLabel}> total_num_lao_workers: </span> {supplier && supplier.total_num_lao_workers || '-'} </p>
              <p> <span className={classes.spanLabel}> total_num_vietnamese_workers: </span> {supplier && supplier.total_num_vietnamese_workers || '-'} </p>
            </GridItem>

            <GridItem xs={12} sm={12} md={6} lg={6}>
              <h4> Informative: </h4>
              <p> <span className={classes.spanLabel}> hiring_practice: </span> {supplier && supplier.hiring_practice || '-'} </p>
              <p> <span className={classes.spanLabel}> other: </span> {supplier && supplier.other || '-'} </p>
            </GridItem>

            <GridItem xs={12} sm={12} md={12} lg={12}>
              <h4> Supply Chains</h4>
              <div>
                <ReactTable
                  key={Utils.giveMeGuid()}
                  data={getSupplyChains(supplier)}
                  columns={[
                    {
                      Header: "id",
                      accessor: "id",
                      sortable: false,
                      resizable: false,
                      width: 80,
                    },
                    {
                      Header: "name",
                      accessor: "name",
                      sortable: false,
                      resizable: false,
                      width: 160
                    }, {
                      Header: "",
                      sortable: false,
                      accessor: "edit",
                      width: 30,
                    }
                  ]}
                  defaultPageSize={getSupplyChains(supplier).length}
                  showPaginationTop={false}
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              </div>
            </GridItem>
          </GridContainer>

        </GridContainer>
        <GridItem>
          <br/>
        </GridItem>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
        {supplier && supplier.lat && supplier.lng && (<p><span className={classes.spanLabel}> Google Maps:</span>{(
                <div style={{ height: "400px", width: '100%' }}>
                <GoogleMapReact key={Utils.giveMeGuid()} bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY }} defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}>
                  <AnyReactComponent
                    key={Utils.giveMeGuid()}
                    lat={supplier.lat}
                    lng={supplier.lng}
                    text={(<div>{supplier.name}
                      <br />
                      {(supplier.total_num_workers) ? (<div><br />{"" + supplier.total_num_workers + " total workers"}</div>) : (null)}
                      {(supplier.total_num_thai_workers) ? (<div><br />{"" + supplier.total_num_thai_workers + " Thai workers"}</div>) : (null)}
                      {(supplier.total_num_cambodian_workers) ? (<div><br />{"" + supplier.total_num_cambodian_workers + " Cambodian workers"}</div>) : (null)}
                      {(supplier.total_num_myanmar_workers) ? (<div><br />{"" + supplier.total_num_myanmar_workers + " Myanmar workers"}</div>) : (null)}
                      {(supplier.total_num_lao_workers) ? (<div><br />{"" + supplier.total_num_lao_workers + " Lao workers"}</div>) : (null)}
                      {(supplier.total_num_vietnamese_workers) ? (<div><br />{"" + supplier.total_num_vietnamese_workers + " Vietanmese workers"}</div>) : (null)}
                    </div>)}
                  />
                </GoogleMapReact>

              </div>
              )}</p>)}
              </GridItem>
        </GridContainer>
      </div>
    </Modal>
  );
}

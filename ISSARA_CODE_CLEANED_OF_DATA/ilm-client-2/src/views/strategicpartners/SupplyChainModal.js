import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';
import SweetAlert from "react-bootstrap-sweetalert";
import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { fetchSupplyChains } from '../../redux/actions/StrategicPartnerActions';
import { batchSupplierBatchUpdate, fetchSuppliers } from "../../redux/actions/SupplierActions";
import Edit from "@material-ui/icons/Edit";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import ReactTable from "react-table-6";
import Utils from "../../services/utils.js";

const customStyles = {
  ...customCheckboxRadioSwitch,
  ...sweetAlertStyles,
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
  buttoncustom: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    top: '40px',
    right: '40px'
  }
};

const useStyles = makeStyles(customStyles);

export default function SupplyChainModal(props) {
  const dispatch = useDispatch();

  const classes = useStyles();

  const countries = useSelector(state => state.countriesReducer.items)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)

  const supplyChains = useSelector(state => state.supplyChainReducer.items);
  const fetchingSupplyChains = useSelector(state => state.supplyChainReducer.fetchingSupplyChains)
  const suppliersMap = useSelector(state => state.suppliersReducer.suppliers_items_map);

  
  const [alert, setAlert] = useState(null)


  const getStrategicPartner = (id) => {
    return strategicPartners.find(strategicPartner => {
      return strategicPartner.id === parseInt(id)
    })
  }

  const editButton = (id) => {
    return (<div>
      <a target="__blank" href={`/admin/edit-supplier?id=${id}`}>View</a>
    </div>);
  }

  const getSupplyChain = (id) => {
    if (id === null || id === undefined || id === "") {
      return supplyChains[0]
    }
    return supplyChains.find(supplyChain => {
      return supplyChain.id === parseInt(id)
    })
  }

  const getCountryName = (id) => {
    const country = countries.find((country) => {
      return country.id === id
    });
    return country ? country.name : '-'
  }

  const handleAnonymousClick = (anonymousFlag) => {
    let suppliersUpdated = [];
    if (supplyChain && supplyChain.suppliers && supplyChain.suppliers.length > 0) {
      supplyChain.suppliers.forEach((supplier) => {
        let supplierUpdate = suppliersMap[supplier];
        supplierUpdate.anonymous = anonymousFlag;
        suppliersUpdated.push(supplierUpdate);

      });
    }
    dispatch(batchSupplierBatchUpdate(suppliersUpdated, () => {

      setAlert(<SweetAlert
        success
        title="Supplier Updates"
        onConfirm={() => {
          setAlert(null);
          dispatch(fetchSuppliers());
          dispatch(fetchSupplyChains());
          props.onClose();
        }}
        confirmBtnCssClass={classes.button + " " + classes.info}

      > 
        You have successfully updated supply chain suppliers to {((anonymousFlag === false) ? "Visible Suppiler Names" : "Anonymous (Hidden) Supplier Names")}
      </SweetAlert>);

    }, (error) => {

      setAlert(<SweetAlert
        error
        title="Supplier Updates"
        onConfirm={() => {
          setAlert(null)
        }}
        confirmBtnCssClass={classes.button + " " + classes.info}

      >
        {'Error Occured:' + JSON.stringify(error)}
      </SweetAlert>);

    }));
  }



  useEffect(() => {

    if (props.open === false) {
      return;
    }


  });

  if ((supplyChains === null || supplyChains === undefined || supplyChains.length === undefined || supplyChains.length < 0) ||
    (strategicPartners === null || strategicPartners === undefined || strategicPartners.length === undefined || strategicPartners.length < 0)) {
    return <div>Loading...</div>;
  }

  const supplyChain = getSupplyChain(props.value);

  if ((supplyChain === null || supplyChain === undefined || supplyChain.strategic_partner === undefined || supplyChain.strategic_partner === null)) {
    return <div>Loading...</div>;
  }

  const strategicPartner = (supplyChain) ? getStrategicPartner(supplyChain.strategic_partner) : {};

  if ((strategicPartner === null || strategicPartner === undefined)) {
    return <div>Loading...</div>;
  }


  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        {alert}
        <h3 style={{ marginTop: 0 }}> {`${supplyChain && supplyChain.name || '-'}`} </h3>
        <Button
          simple
          color="danger"
          className={classes.buttoncustom}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </Button>
        <p> <span className={classes.spanLabel}> Belongs to Partner: </span> <a target="__blank" href={"/admin/edit-strategic-partner?id=" + strategicPartner.id}>{strategicPartner && strategicPartner.name}</a> </p>
        <p><br /></p>
        <p>
          <Button onClick={() => {
            handleAnonymousClick(true);
          }}>Anonymous</Button>
          <Button onClick={() => {
            handleAnonymousClick(false);
          }}>Visible</Button>

        </p>
        <p><br /></p>
        <h4>Suppliers in Supply Chain:</h4>
        <div>
          <ReactTable
            key={Utils.giveMeGuid()}
            data={suppliersMap && Object.keys(suppliersMap).length > 0 && supplyChain && supplyChain.suppliers && supplyChain.suppliers.length && supplyChain.suppliers.map((supplierId) => suppliersMap[supplierId] && (
              {
                id: suppliersMap[supplierId].id,
                name: suppliersMap[supplierId].name,
                lng: suppliersMap[supplierId].lng,
                lat: suppliersMap[supplierId].lat,
                anonymous: suppliersMap[supplierId].anonymous,
                edit: editButton(supplierId)

              }
            ))}
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
                Header: "Lat",
                accessor: "lat",
                width: 80
              }, {
                Header: "Lng",
                accessor: "lng",
                width: 80
              }, {
                Header: "Anonymous",
                accessor: "anonymous",
                width: 120,
                Cell: props => {
                  return (
                    props.value === false ? "False" : "True"
                  )
                }
              }, {
                Header: "",
                sortable: false,
                accessor: "edit",
                width: 30,
              }, {
                Header: "",
                sortable: false,
                width: 20,
              }
            ]}
            defaultPageSize={(supplyChain && supplyChain.suppliers) ? supplyChain.suppliers.length : 0}
            showPaginationTop={false}
            showPaginationBottom={false}
            className="-striped -highlight"
          />
        </div>
      </div>
    </Modal>
  );
}

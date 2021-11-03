import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Datetime from "react-datetime";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Table from "components/Table/Table.js";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import VisibilityIcon from '@material-ui/icons/Visibility';

import StrategicPartnersDropdown from "components/ilmdb/StrategicPartnersDropdown.js"
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import SupplyChainModal from "./SupplyChainModal";

import { fetchSuppliers } from "../../redux/actions/SupplierActions";
import { fetchStrategicPartners, fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";
import { fetchCountries } from "../../redux/actions/LocaleActions";
import Utils from "services/utils.js";

const customStyle = {
  button: {
    padding: 0,
    margin: 0
  }
}

const useStyles = makeStyles(customStyle);


export default function SupplyChainList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const countries = useSelector(state => state.countriesReducer.items)
  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingCountries = useSelector(state => state.countriesReducer.fetchingCountries)
  const strategicPartnersMap = useSelector(state => state.strategicPartnerReducer.itemsMap)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)
  const supplyChains = useSelector(state => state.supplyChainReducer.items);
  const fetchingSupplyChains = useSelector(state => state.supplyChainReducer.fetchingSupplyChains)

  const [supplyChainArray, setSupplyChainArray] = useState([]);
  const [filteredSupplyChainArray, setFilteredSupplyChainArray] = useState([]);
  
  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [selectedStrategicPartner, setSelectedStrategicPartner] = useState([]);

  useEffect(() => {
    dispatch(fetchSupplyChains());
    dispatch(fetchCountries());
    dispatch(fetchStrategicPartners());
    dispatch(fetchSuppliers()); // Done for child controls/modal

  }, []);

  useEffect(() => {
    // Fetch countries
    onSearchStrategicPartners();

  }, [suppliers, strategicPartnersMap, supplyChains, selectedStrategicPartner]);

  const redirectToEditSupplyChain = (id) => {
    props.history.push(`/admin/edit-supply-chain?id=${id}`)
  }

  const handleViewButtonClick = (id) => {
    setModal({
      open: true,
      id: id
    })
  }

  const editButton = (id) => {
    return (<div>
      <Button
        title={"Edit: " + id}
        simple
        color="success"
        value={id}
        className={classes.button}
        onClick={(e) => redirectToEditSupplyChain(e.currentTarget.value)}
      >
        <Edit />
      </Button></div>
    )
  }

  const viewButton = (id) => {
    return (<div>
      <Button
        title={"View: " + id}
        simple
        color="info"
        value={id}
        className={classes.button}
        onClick={(e) => handleViewButtonClick(e.currentTarget.value)}
      >
        <VisibilityIcon />
      </Button></div>
    )
  }

  const onSearchStrategicPartners = () => {
    const filteredSupplyChainArray = []



    if (strategicPartnersMap === undefined ||
      strategicPartnersMap === null ||
      Object.keys(strategicPartnersMap).length < 1 ||
      suppliers === undefined ||
      suppliers === null ||
      suppliers.length === undefined ||
      suppliers.length < 1 ||
      supplyChains === undefined ||
      supplyChains === null ||
      supplyChains.length === undefined ||
      supplyChains.length < 1) {
      setFilteredSupplyChainArray(filteredSupplyChainArray);
      return;
    }

    supplyChains.map(item => {

      // Filter by strategic partner
      if (selectedStrategicPartner.length > 0) {
        if (!selectedStrategicPartner.includes(item.strategic_partner)) {
          return // skip
        }
      }

      item['strategic_partner_name'] = strategicPartnersMap[item.strategic_partner].name;
      item['edit'] = editButton(item.id);
      item['view'] = viewButton(item.id);

      filteredSupplyChainArray.push(item)
    });
    setFilteredSupplyChainArray(filteredSupplyChainArray)
  }

  if (strategicPartnersMap === undefined ||
    strategicPartnersMap === null ||
    Object.keys(strategicPartnersMap).length < 1 ||
    suppliers === undefined ||
    suppliers === null ||
    suppliers.length === undefined ||
    suppliers.length < 1 ||
    supplyChains === undefined ||
    supplyChains === null ||
    supplyChains.length === undefined ||
    supplyChains.length < 1) {
    return (<div>Loading...</div>);
  }

  return (
    <GridContainer>
      <SupplyChainModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <StrategicPartnersDropdown
                  value={selectedStrategicPartner}
                  onSelect={strategicPartners => setSelectedStrategicPartner(strategicPartners)}
                  multipleselect={true}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>

     

      <GridItem xs={12}>
        <CardHeader>
          <h4>Search Results (Found: {(filteredSupplyChainArray !== undefined &&
            filteredSupplyChainArray.length !== undefined) ? filteredSupplyChainArray.length : 0})</h4>
        </CardHeader>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <ReactTable PaginationComponent={Pagination}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}

              data={filteredSupplyChainArray}
              defaultSorted={[{
                id: 'name',
              }]}
              columns={[
                {
                  Header: "ID",
                  accessor: "id",
                  width: 80
                }, {
                  Header: "Name",
                  accessor: "name"
                }, {
                  Header: "Partner",
                  accessor: "strategic_partner_name"
                }, {
                  Header: "",
                  sortable: false,
                  accessor: "view",
                  width: 30,
                }, {
                  Header: "",
                  sortable: false,
                  accessor: "edit",
                  width: 30,
                }, {
                  Header: "",
                  width: 20,
                  sortable: false,
                  filterable: false
                }
              ]}
              defaultPageSize={5}
              showPaginationTop={false}
              showPaginationBottom={true}
              loading={fetchingStrategicPartners || fetchingCountries}
              className="-striped -highlight"
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from '@material-ui/core/Tooltip';

import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";
import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox"
import Check from "@material-ui/icons/Check";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js"
import { withStyles, makeStyles } from "@material-ui/core/styles";

import SupplierModal from "./SupplierModal";
import SupplierForm from "./SupplierForm";

import { batchSupplierBatchUpdate, fetchSuppliers, mergeSupplierDuplicates } from "../../redux/actions/SupplierActions";

import { fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";

import { fetchCountries } from "../../redux/actions/LocaleActions";

import { fetchIndustries, fetchSubIndustries } from "../../redux/actions/LocaleActions.js";
import { fetchProvinces } from "../../redux/actions/LocaleActions";
import { fetchDistricts } from "../../redux/actions/LocaleActions";


import Utils from "services/utils.js";

import loginStore from "../../redux/stores/LoginStore"
import { CircularProgress } from "@material-ui/core";


const customStyle = {
  ...customCheckboxRadioSwitch,
  ...sweetAlertStyles,
  customButton: {
    padding: 0,
    margin: 0
  },
  checkRoot: {
    padding: 0
  },
  labelRoot: {
    margin: 0
  },
}

const useStyles = makeStyles(customStyle);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);



export default function SupplierList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const industries = useSelector(state => state.industriesReducer.items)
  const fetchingIndustries = useSelector(state => state.industriesReducer.fetchingIndustries)

  const subindustries = useSelector(state => state.subIndustriesReducer.items)
  const fetchingSubIndustries = useSelector(state => state.subIndustriesReducer.fetchingSubIndustries)

  const countries = useSelector(state => state.countriesReducer.items)
  const fetchingCountries = useSelector(state => state.countriesReducer.fetchingCountries)

  const provinces = useSelector(state => state.provincesReducer.items)
  const fetchingProvinces = useSelector(state => state.provincesReducer.fetchingProvinces)

  const districts = useSelector(state => state.districtsReducer.items)
  const fetchingDistricts = useSelector(state => state.districtsReducer.fetchingDistricts)

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const suppliersMap = useSelector(state => state.suppliersReducer.suppliers_items_map);
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)

  const supplyChains = useSelector(state => state.supplyChainReducer.items);
  const fetchingSupplyChains = useSelector(state => state.supplyChainReducer.fetchingSupplyChains)


  const [suppliersArray, setSuppliersArray] = useState([]);

  
  // -------------------------------
  //    DATA CLEANING MODE START
  // -------------------------------

  const currentUser = loginStore.getLoginUser();

  const [dataCleaningMode, setDataCleaningMode] = useState(false)
  const [duplicatesMarked, setDuplicatesMarked] = useState([])
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [mergeAlert, setMergeAlert] = useState(null);

  const mergeSuccess = () => {
    setDuplicatesMarked([]);
  };

  const mergeError = (error) => {
    setMergeAlert(
      <SweetAlert
        danger
        onConfirm={() => setMergeAlert(null)}
        confirmBtnCssClass={classes.button + " " + classes.success}
        title="Error"
      >
        {error.message}
      </SweetAlert>
    );
  };

  const handleMergeDuplicates = () => {
    console.log('Merging ,', duplicatesMarked)
    setConfirmationModal(false);
    dispatch(mergeSupplierDuplicates(duplicatesMarked, mergeSuccess, mergeError))
  };

  const handleSelectDuplicate = (supplier_id) => {
    const newSelectedDuplicates = [...duplicatesMarked];
    const currentIndex = duplicatesMarked.indexOf(supplier_id);

    if (currentIndex === -1) {
      newSelectedDuplicates.push(supplier_id);
    } else {
      newSelectedDuplicates.splice(currentIndex, 1);
    }
    setDuplicatesMarked(newSelectedDuplicates);
  };


  const checkbox = (supplier_id) => {
    return (
      <div>
        <FormControlLabel
          control={
            <Checkbox
              onClick={() => handleSelectDuplicate(supplier_id)}
              checked={duplicatesMarked.includes(supplier_id)}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{ checked: classes.checked, root: classes.checkRoot }}
            />
          }
          label={(duplicatesMarked[0] === supplier_id) ? (<h4>*</h4>) : ""}
          classes={{ root: classes.labelRoot }}
        />
      </div>
    )
  }

  const handleAnonymousClick = () => {
    let suppliersUpdated = [];


    if (duplicatesMarked && duplicatesMarked.length > 0) {
      duplicatesMarked.forEach((supplier) => {
        let supplierUpdate = { ...suppliersMap[supplier] };
        supplierUpdate.anonymous = !supplierUpdate.anonymous;
        suppliersUpdated.push(supplierUpdate);

      });
    }

    dispatch(batchSupplierBatchUpdate(suppliersUpdated, () => {

      setMergeAlert(<SweetAlert
        success
        title="Supplier Updates"
        onConfirm={() => {
          setMergeAlert(null);
          dispatch(fetchSuppliers());
        }}
        confirmBtnCssClass={classes.button + " " + classes.info}

      >
        {'You have successfully updated suppliers anonymous flags'}
      </SweetAlert>);

    }, (error) => {

      setMergeAlert(<SweetAlert
        error
        title="Supplier Updates"
        onConfirm={() => {
          setMergeAlert(null)
        }}
        confirmBtnCssClass={classes.button + " " + classes.info}

      >
        {'Error Occured:' + JSON.stringify(error)}
      </SweetAlert>);

    }));
  }



  // -------------------------------
  //     DATA CLEANING MODE END
  // -------------------------------

  const [showFormInline, setShowFormInline] = useState({
    open: false,
    id: null
  });
  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  useEffect(() => {
    // Fetch countries
    dispatch(fetchCountries())
    dispatch(fetchProvinces())
    dispatch(fetchDistricts())
    dispatch(fetchSupplyChains());
    dispatch(fetchIndustries())
    dispatch(fetchSubIndustries())
    dispatch(fetchSuppliers());

  }, []);


  useEffect(() => {
    if (suppliers.length > 0) {
      onSearchSuppliers()
    }

  }, [suppliers, selectedSuppliers, industries, subindustries, countries, supplyChains]);

  const redirectToEditSupplier = (id) => {
    if (props.inlinePanel === true) {
      setShowFormInline({ open: true, id: id });
    } else {
      props.history.push(`/admin/edit-supplier?id=${id}`);
    }
  }

  const handleViewButtonClick = (id) => {
    setModal({
      open: true,
      id: id
    })
  }

  const editButton = (id) => {
    return (
      <Button
        title={"Edit: " + id}
        simple
        color="success"
        value={id}
        className={classes.customButton}
        onClick={(e) => redirectToEditSupplier(e.currentTarget.value)}
      >
        <Edit />
      </Button>
    )
  }

  const viewButton = (id) => {
    return (
      <Button
        title={"View: " + id}
        simple
        color="info"
        value={id}
        className={classes.customButton}
        onClick={(e) => handleViewButtonClick(e.currentTarget.value)}
      >
        <VisibilityIcon />
      </Button>
    )
  }

  const onSearchSuppliers = () => {
    const filteredSuppliersArray = []

    suppliers.map(itemIter => {
      let newItem = {...itemIter};

      // Filter by strategic partner
      if (selectedSuppliers.length > 0) {
        if (!selectedSuppliers.includes(newItem.id)) {
          return // skip
        }
      }

      newItem['industry_name'] = (industries) ? (props => {
        const industry = industries.find((item) => {
          return item.id === props;
        });
        return (industry ? industry.name : '-');

      })(newItem.industry) : "-";

      newItem['subindustry_name'] = (subindustries) ? (props => {
        const subindustry = subindustries.find((item) => {
          return item.id === props;
        });
        return (subindustry ? subindustry.name : '-');

      })(newItem.subindustry) : "-";

      newItem['country_name'] = (countries) ? (props => {
        const country = countries.find((item) => {
          return item.id === props;
        });
        return (country ? country.name : '-');

      })(newItem.country) : "-";

      newItem['supply_chains'] = (Utils.isEmpty(supplyChains) === false) ? (() => {
        let supplyChainNames = [];
        supplyChains.forEach((supplyChain) => {
          supplyChainNames.includes(supplyChain.name) === false &&
            supplyChain.suppliers && supplyChain.suppliers.forEach((supplierId) => {
              if (newItem.id === supplierId) {
                supplyChainNames.push(supplyChain.name);
              }
            });
        });

        return "" + supplyChainNames;
      })() : "-";

      newItem['edit'] = editButton(newItem.id)
      newItem['view'] = viewButton(newItem.id)

      filteredSuppliersArray.push(newItem)
    });
    setSuppliersArray(filteredSuppliersArray)
  }



  if (Utils.isEmpty(suppliers) === true ||
    Utils.isEmpty(industries) === true ||
    Utils.isEmpty(subindustries) === true ||
    Utils.isEmpty(countries) === true ||
    Utils.isEmpty(supplyChains) === true) {
    return <CircularProgress />
  }

  return (props.inlinePanel === true && showFormInline.open === true) ? (<SupplierForm supplierId={showFormInline.id} handleConfirmSuccessAlert={() => {
    dispatch(fetchSuppliers());
    setShowFormInline({ open: false, id: null });
  }} />) : (
    <GridContainer>
      <SupplierModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <SuppliersDropdown
                  value={selectedSuppliers}
                  onSelect={suppliers => setSelectedSuppliers(suppliers)}
                  multipleselect={true}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem xs={12}>
        <CardHeader style={{ padding: 0 }}>
          <GridContainer justify='space-between'>
            <GridItem>
              <h4>Search Results (Found: {(suppliersArray !== undefined &&
                suppliersArray.length !== undefined) ? suppliersArray.length : 0})
              </h4>
            </GridItem>
            {currentUser && currentUser.groups && currentUser.groups.includes('Data Cleaning') &&
              <GridItem>
                <Button simple color="rose" onClick={() => setDataCleaningMode(!dataCleaningMode)}> {`${dataCleaningMode ? 'Disable' : 'Enable'} cleaning mode`} </Button>
              </GridItem>
            }
          </GridContainer>
        </CardHeader>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <ReactTable PaginationComponent={Pagination}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}

              data={suppliersArray}
              defaultSorted={[{
                id: 'name',
              }]}
              columns={[
                {
                  Header: "",
                  show: dataCleaningMode,
                  sortable: false,
                  accessor: "id",
                  width: 40,
                  Cell: props => (
                    checkbox(props.value)
                  ),
                },
                {
                  Header: "Name",
                  accessor: "name",
                  filterable: true,
                  width: 200,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 120)}
                        </div>
                      </HtmlTooltip>
                    )
                  }
                }, {
                  Header: "Anonymous",
                  accessor: "anonymous",
                  filterable: true,
                  sortable: true,
                  width: 120,
                  Cell: props => {
                    return (
                      props.value === false ? "False" : "True" 
                    )
                  }
                }, {
                  Header: "Industry",
                  accessor: "industry_name",
                  width: 200,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 120)}
                        </div>
                      </HtmlTooltip>
                    )
                  }
                }, {
                  Header: "Sub Industry",
                  accessor: "subindustry_name",
                  width: 200,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 120)}
                        </div>
                      </HtmlTooltip>
                    )
                  }
                }, {
                  Header: "Country",
                  accessor: "country_name",
                  width: 200,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {Utils.shortenString(props.value, 80)}
                        </div>
                      </HtmlTooltip>
                    )
                  }
                }, {
                  Header: "Supply Chains",
                  accessor: "supply_chains",
                  width: 300,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                }, {
                  Header: "Lat",
                  accessor: "lat",
                  width: 80,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                }, {
                  Header: "Lng",
                  accessor: "lng",
                  width: 80,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                }, {
                  Header: "",
                  sortable: false,
                  filterable: false,
                  accessor: "view",
                  width: 40
                }, {
                  Header: "",
                  sortable: false,
                  filterable: false,
                  accessor: "edit",
                  width: 40,
                },
                {
                  Header: "",
                  width: 20,
                  sortable: false,
                  filterable: false
                }
              ]}
              defaultPageSize={5}
              showPaginationTop={false}
              showPaginationBottom={true}
              loading={fetchingSuppliers || fetchingCountries || fetchingIndustries || fetchingSubIndustries || fetchingProvinces || fetchingDistricts}
              className="-striped -highlight"
            />
          </CardBody>
        </Card>
      </GridItem>
      {dataCleaningMode && duplicatesMarked.length > 1 &&
        <GridItem>
          <Button color="rose" onClick={() => setConfirmationModal(true)}> Merge duplicates </Button>
        </GridItem>
      }

      {dataCleaningMode && duplicatesMarked.length > 0 &&
        <GridItem>
          <Button color="rose" onClick={() => {
            handleAnonymousClick();
          }}>Flip Anonymous Flag</Button>
        </GridItem>
      }
      {confirmationModal &&
        <SweetAlert
          info
          title=""
          showCancel
          showCloseButton
          confirmBtnCssClass={classes.button + " " + classes.info}
          cancelBtnCssClass={classes.button + " " + classes.default}
          onConfirm={() => handleMergeDuplicates()}
          confirmBtnText="Confirm"
          onCancel={() => setConfirmationModal(false)}
        >
          <h5> Following suppliers will be merged: </h5>
          <ul style={{ textAlign: 'left' }}>

            {duplicatesMarked.map((id, key) =>
              <li key={key}> {(id === duplicatesMarked[0]) ? (<h4>(*New Master*) - {suppliers.find(x => x.id === id).name}<br /></h4>) : ("Merge/Removal: " + suppliers.find(x => x.id === id).name)} </li>
            )}
          </ul>
        </SweetAlert>
      }
      {mergeAlert}
    </GridContainer>
  );
}

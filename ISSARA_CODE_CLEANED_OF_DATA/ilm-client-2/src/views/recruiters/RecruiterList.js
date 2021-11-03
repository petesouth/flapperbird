import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js"
import { makeStyles } from "@material-ui/core/styles";

import { fetchRecruiters, mergeRecruiterDuplicates } from "../../redux/actions/RecruiterActions";
import { fetchCountries } from "../../redux/actions/LocaleActions";
import RecruiterForm from "./RecruiterForm";
import RecruiterModal from "./RecruiterModal";
import { fetchIndustries, fetchSubIndustries } from "../../redux/actions/LocaleActions";
import Utils from "services/utils.js";

import loginStore from "../../redux/stores/LoginStore";
import { fetchProvinces } from "../../redux/actions/LocaleActions";
import { fetchDistricts } from "../../redux/actions/LocaleActions";

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


export default function RecruiterList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();

  const countries = useSelector(state => state.countriesReducer.items)
  const fetchingCountries = useSelector(state => state.countriesReducer.fetchingCountries)

  const recruiters = useSelector(state => state.recruitersReducer.items)
  const fetchingRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)

  const [recruitersArray, setRecruitersArray] = useState([]);


  // -------------------------------
  //    DATA CLEANING MODE START
  // -------------------------------

  const currentUser = loginStore.getLoginUser();
  const [dataCleaningMode, setDataCleaningMode] = useState(false)
  const [duplicatesMarked, setDuplicatesMarked] = useState([])
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [mergeAlert, setMergeAlert] = useState(null);



  const [showFormInline, setShowFormInline] = useState({
    open: false,
    id: null
  });


  const [modal, setModal] = useState({
    open: false,
    id: null
  });



  // FILTERS
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);

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


  const redirectToEditRecruiter = (id) => {

    if (props.inlinePanel === true) {
      setShowFormInline({ open: true, id: id });
    } else {
      props.history.push(`/admin/edit-recruiter?id=${id}`);
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
        onClick={(e) => redirectToEditRecruiter(e.currentTarget.value)}
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


  const handleMergeDuplicates = () => {
    console.log('Merging ,', duplicatesMarked)
    setConfirmationModal(false);
    dispatch(mergeRecruiterDuplicates(duplicatesMarked, mergeSuccess, mergeError))
  };

  const handleSelectDuplicate = (recruiter_id) => {
    const newSelectedDuplicates = [...duplicatesMarked];
    const currentIndex = duplicatesMarked.indexOf(recruiter_id);

    if (currentIndex === -1) {
      newSelectedDuplicates.push(recruiter_id);
    } else {
      newSelectedDuplicates.splice(currentIndex, 1);
    }
    setDuplicatesMarked(newSelectedDuplicates);
  };

  const checkbox = (recruiter_id) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            onClick={() => handleSelectDuplicate(recruiter_id)}
            checked={duplicatesMarked.includes(recruiter_id)}
            checkedIcon={<Check className={classes.checkedIcon} />}
            icon={<Check className={classes.uncheckedIcon} />}
            classes={{ checked: classes.checked, root: classes.checkRoot }}
          />
        }
        classes={{ root: classes.labelRoot }}
        label={(duplicatesMarked[0] === recruiter_id) ? (<h4>*</h4>) : ""}

      />
    )
  }

  // -------------------------------
  //     DATA CLEANING MODE END
  // -------------------------------



  useEffect(() => {
    // Fetch countries
    dispatch(fetchCountries())
    dispatch(fetchProvinces())
    dispatch(fetchDistricts())

    dispatch(fetchIndustries())
    dispatch(fetchSubIndustries())

    dispatch(fetchRecruiters())
  }, []);

  useEffect(() => {
    if (recruiters.length > 0) {
      onSearchRecruiters()
    }
  }, [recruiters, selectedRecruiters, countries]);




  const onSearchRecruiters = () => {
    const filteredRecruitersArray = []

    recruiters.map(item => {

      if (selectedRecruiters.length > 0) {
        if (!selectedRecruiters.includes(item.id)) {
          return // skip
        }
      }

      item['country_name'] = (countries) ? (props => {
        const country = countries.find((item) => {
          return item.id === props;
        });
        return (country ? country.name : '-');
      })(item['country']) : "-";
      
      item['edit'] = editButton(item.id)
      item['view'] = viewButton(item.id)

      filteredRecruitersArray.push(item)
    });
    setRecruitersArray(filteredRecruitersArray)
  }

  return (props.inlinePanel === true && showFormInline.open === true) ? (<RecruiterForm recruiterId={showFormInline.id} handleConfirmSuccessAlert={() => {
    dispatch(fetchRecruiters());
    setShowFormInline({ open: false, id: null });
  }} />) : (
      <GridContainer>
        <RecruiterModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />

        <GridItem xs={12}>
          <Card style={{ marginTop: 0 }}>
            <CardBody>
              <GridContainer>
                <GridItem xs={12}>
                  <RecruitersDropdown
                    value={selectedRecruiters}
                    onSelect={recruiters => setSelectedRecruiters(recruiters)}
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
                <h4>Search Results (Found: {(recruitersArray !== undefined &&
                  recruitersArray.length !== undefined) ? recruitersArray.length : 0})
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

                data={recruitersArray}
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
                    width: 500
                  }, {
                    Header: "Country",
                    accessor: "country_name",
                    width: 500
                  },
                  {
                    Header: "",
                    sortable: false,
                    filterable: false,
                    accessor: "view",
                    width: 40,
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
                loading={fetchingRecruiters || fetchingCountries}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
        {dataCleaningMode && duplicatesMarked.length > 1 &&
          <div>
            <Button color="rose" onClick={() => setConfirmationModal(true)}> Merge duplicates </Button>
          </div>
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
            <h5> Following Recruiters will be merged: </h5>
            <ul style={{ textAlign: 'left' }}>
              {duplicatesMarked.map((id, key) =>
                <li key={key}> {(id === duplicatesMarked[0]) ? (<h4>(*New Master*) - {recruiters.find(x => x.id === id).name}<br /></h4>) : ("Merge/Removal: " + recruiters.find(x => x.id === id).name)} </li>
              )}
            </ul>
          </SweetAlert>
        }
        {mergeAlert}
      </GridContainer>
    );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";


import Tooltip from '@material-ui/core/Tooltip';

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Datetime from "react-datetime";

import Pagination from "components/Pagination/Pagination2.js";

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
import { withStyles, makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import StrategicPartnerForm from "./StrategicPartnerForm.js";
import StrategicPartnerModal from "./StrategicPartnerModal";

import { fetchStrategicPartners, fetchSharedFiles } from "../../redux/actions/StrategicPartnerActions";
import { fetchCountries } from "../../redux/actions/LocaleActions";
import Utils from "../../services/utils.js";

const customStyle = {
  button: {
    padding: 0,
    margin: 0
  }
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


export default function StrategicPartnerList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const countries = useSelector(state => state.countriesReducer.items)
  const fetchingCountries = useSelector(state => state.countriesReducer.fetchingCountries)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)

  const [strategicPartnersArray, setStrategicPartnersArray] = useState([]);

  const sharedFiles = useSelector(state => state.sharedFilesReducer.sharedFiles);
  const sharedFilesMap = useSelector(state => state.sharedFilesReducer.sharedFilesMap);
  
  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [selectedStrategicPartners, setSelectedStrategicPartners] = useState([]);

  useEffect(() => {
    // Fetch countries
   dispatch(fetchSharedFiles());
   dispatch(fetchCountries())
   dispatch(fetchStrategicPartners())
  },[]);


  useEffect(() => {
    if (strategicPartners.length > 0) {
      onSearchStrategicPartners()
    }
  }, [strategicPartners, selectedStrategicPartners, countries, sharedFiles]);

  const redirectToEditStrategicPartner = (id) => {
    props.history.push(`/admin/edit-strategic-partner?id=${id}`)
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
        className={classes.button}
        onClick={(e) => redirectToEditStrategicPartner(e.currentTarget.value)}
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
        className={classes.button}
        onClick={(e) => handleViewButtonClick(e.currentTarget.value)}
      >
        <VisibilityIcon />
      </Button>
    )
  }

  const onSearchStrategicPartners = () => {
    const filteredStrategicPartnersArray = []

    strategicPartners.map(item => {

      // Filter by strategic partner
      if (selectedStrategicPartners.length > 0) {
        if (!selectedStrategicPartners.includes(item.id)) {
          return // skip
        }
      }

      item['country_name'] = (countries) ? (props => {
        const country = countries.find((item) => {
          return item.id === props;
        });
        return (country ? country.name : '-');
      })(item['country']) : "-";

      item['imageicon_file_path'] = (sharedFilesMap[item.imageicon]) ? sharedFilesMap[item.imageicon].file_path : "-";
      
      item['edit'] = editButton(item.id)
      item['view'] = viewButton(item.id)

      filteredStrategicPartnersArray.push(item)
    });
    setStrategicPartnersArray(filteredStrategicPartnersArray)
  }

  return (
    <GridContainer>
      <StrategicPartnerModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <StrategicPartnersDropdown
                  value={selectedStrategicPartners}
                  onSelect={strategicPartners => setSelectedStrategicPartners(strategicPartners)}
                  multipleselect={true}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem xs={12}>
        <CardHeader>
          <h4>Search Results (Found: {(strategicPartnersArray !== undefined &&
            strategicPartnersArray.length !== undefined) ? strategicPartnersArray.length : 0})</h4>
        </CardHeader>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <ReactTable PaginationComponent={Pagination}

              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}

              data={strategicPartnersArray}
              defaultSorted={[{
                id: 'name',
              }]}
              columns={[
                {
                  Header: "Name",
                  accessor: "name",
                  width: 100
                }, {
                  Header: "Country",
                  accessor: "country_name",
                  width: 100
                }, {
                  Header: "Start",
                  accessor: "contract_start_date",
                  width: 90
                }, {
                  Header: "End",
                  accessor: "contract_end_date",
                  width: 90
                }, {
                  Header: "Partner Icon",
                  accessor: "imageicon_file_path",
                  width: 350,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        <a target="__blank" href={props.value}>{Utils.shortenString(props.value, 50)}</a>
                      </div>
                    </HtmlTooltip>
                  )
                }, {
                  Header: "Focal Point",
                  accessor: "focal_point_name",
                  width: 150
                }, {
                  Header: "Email Notify",
                  accessor: "email_notify",
                  width: 80,
                  Cell: props => (<div>{"" + props.value}</div>)
                }, {
                  Header: "",
                  sortable: false,
                  accessor: "view",
                  filterable: false,
                  width: 40,
                }, {
                  Header: "",
                  sortable: false,
                  accessor: "edit",
                  filterable: false,
                  width: 40,
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

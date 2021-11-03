import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Tooltip from '@material-ui/core/Tooltip';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import FormControl from "@material-ui/core/FormControl";

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
import StrategicPartnerResponseForm from "./StrategicPartnerResponseForm.js";
import StrategicPartnerResponseModal from "./StrategicPartnerResponseModal"

import { fetchUsers } from "redux/actions/UsersActions.js";
import { fetchStrategicPartners } from "../../redux/actions/StrategicPartnerActions";
import { fetchStrategicPartnerResponses } from "../../redux/actions/StrategicPartnerResponseActions";
import Utils from "services/utils.js";

const customStyle = {
  ...styles,
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


export default function StrategicPartnerResponseList(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const users = useSelector(state => state.usersReducer.items)
  const fetchingUsers = useSelector(state => state.usersReducer.fetchingUsers)

  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)

  const strategicPartnerResponses = useSelector(state => state.strategicPartnerResponsesReducer.items)
  const fetchingStrategicPartnerResponses = useSelector(state => state.strategicPartnerResponsesReducer.fetchingStrategicPartnerResponses)

  const [strategicPartnerResponsesArray, setStrategicPartnerResponsesArray] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [filterStrategicPartners, setFilterStrategicPartners] = useState([]);

  useEffect(() => {

    dispatch(fetchStrategicPartners());
    dispatch(fetchUsers())
    dispatch(fetchStrategicPartnerResponses())
   
  }, []);

  useEffect(() => {
    if (Object.keys(strategicPartnerResponses).length > 0) {
      onSearchStrategicPartnerResponses()
    }
  }, [strategicPartnerResponses, filterStrategicPartners, strategicPartners, users, strategicPartners]);

  const redirectToEditStrategicPartnerResponse = (id) => {
    props.history.push(`/admin/edit-stategic-partner-response?id=${id}`)
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
        onClick={(e) => redirectToEditStrategicPartnerResponse(e.currentTarget.value)}
      >
        <Edit />
      </Button>
    )
  }

  const viewButton = (id) => {
    return (
      <Button
        title={"View:" + id}
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

  const onSearchStrategicPartnerResponses = () => {
    const filteredStrategicPartnerResponsesArray = []

    Object.keys(strategicPartnerResponses).map(id => {
      const item = strategicPartnerResponses[id]

      // Filter by strategic partner
      if (filterStrategicPartners.length > 0) {
        if (!filterStrategicPartners.includes(item.strategic_partner)) {
          return // skip
        }
      }

      item['strategic_partner_name'] = (strategicPartners) ? (props => {
        const strategicPartner = strategicPartners.find((item) => {
          return item.id === props;
        });
        return (strategicPartner ? strategicPartner.name : '-');
      })(item['strategic_partner']) : "-";

      item['issara_user_focal_point_name'] = (users) ? (props => {
        const issaraUser = users.find((item) => {
          return item.id === props;
        });
        return (issaraUser ? issaraUser.first_name : '-');
      })(item['issara_user_focal_point']) : "-";

      item['edit'] = editButton(item.id)
      item['view'] = viewButton(item.id)

      filteredStrategicPartnerResponsesArray.push(item)
    });
    setStrategicPartnerResponsesArray(filteredStrategicPartnerResponsesArray)
  }

  return (
    <GridContainer>
      <StrategicPartnerResponseModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <StrategicPartnersDropdown
                  value={filterStrategicPartners}
                  onSelect={strategicPartners => setFilterStrategicPartners(strategicPartners)}
                  multipleselect={true}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>Search Results (Found: {(strategicPartnerResponsesArray !== undefined &&
              strategicPartnerResponsesArray.length !== undefined) ? strategicPartnerResponsesArray.length : 0})</h4>
          </CardHeader>
          <CardBody>
            <ReactTable

              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}

              data={strategicPartnerResponsesArray}
              defaultSorted={[{
                id: 'interaction_date',
                desc: true,
              }]}
              columns={[
                {
                  Header: "Partner",
                  accessor: "strategic_partner_name",
                  width: 200,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>
                  )
                }, {
                  Header: "Focal Point",
                  accessor: "response_focal_point",
                  width: 200,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>
                  )
                }, {
                  Header: "Location",
                  accessor: "interaction_event_location",
                  width: 200,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>
                  )
                }, {
                  Header: "Notes",
                  accessor: "general_notes",
                  width: 160,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>
                  )
                }, {
                  Header: "Next Steps",
                  accessor: "next_steps",
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>
                  )
                }, {
                  Header: "Staff",
                  accessor: "issara_user_focal_point_name",
                  width: 80
                }, {
                  Header: "Date",
                  accessor: "interaction_date",
                  width: 100
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
                }
              ]}
              defaultPageSize={5}
              showPaginationTop={false}
              showPaginationBottom={true}
              loading={fetchingStrategicPartnerResponses || fetchingStrategicPartners || fetchingUsers}
              className="-striped -highlight"
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";


import Tooltip from '@material-ui/core/Tooltip';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Datetime from "react-datetime";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";


import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js";
import IssaraStaffDropdown from "components/ilmdb/IssaraStaffDropdown.js";
import EthicalRecruitmentMeetingModal from "./EthicalRecruitmentMeetingModal";

import { fetchEthicalRecruitmentMeetings } from "redux/actions/EthicalRecruitmentActions.js";
import Utils from "services/utils.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import { fetchRecruiters } from "redux/actions/RecruiterActions";
import { fetchSuppliers } from "redux/actions/SupplierActions";


const customStyle = {
  ...styles,
  button: {
    padding: 0,
    margin: 0,
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


export default function EthicalRecruitmentMeetingsListView(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const meetings = useSelector(state => state.ethicalRecruitmentReducer.items)
  const fetchingMeetings = useSelector(state => state.ethicalRecruitmentReducer.fetching)

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)

  const recruiters = useSelector(state => state.recruitersReducer.items)
  const fetchingRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)

  const users = useSelector(state => state.usersReducer.items)
  const fetchingUsers = useSelector(state => state.usersReducer.fetchingUsers)

  const [meetingsArray, setMeetingsArray] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: [],
    recruiters: [],
    users: [],
    startTime: null,
    endTime: null
  });

  useEffect(() => {
    dispatch(fetchEthicalRecruitmentMeetings());
    if(suppliers === null || suppliers === undefined || suppliers.length < 1 ) {
      dispatch(fetchSuppliers());
    }
    dispatch(fetchRecruiters());
    
  }, []);

  useEffect(() => {
    if (meetings) {
      filterMeetings()
    }
  }, [meetings, filters, suppliers, recruiters])

  const filterMeetings = () => {
    const filteredMeetingsArray = []

    Object.keys(meetings).forEach(key => {
      const item = meetings[key]

      // Filter by suppliers
      if (filters.suppliers.length > 0) {
        if (!filters.suppliers.includes(item.supplier)) {
          return // skip this meeting as no suppliers matched
        }
      }

      // Filter by recruiters
      if (filters.recruiters.length > 0) {
        if (!filters.recruiters.includes(item.recruiter)) {
          return // skip this meeting as no recruiters matched
        }
      }

      // Filter by users
      if (filters.users.length > 0) {
        const users_intersection = filters.users.filter(x => [...item.issara_staff, item.created_by].includes(x))
        if (users_intersection.length === 0) {
          return // skip this meeting as no users matched
        }
      }

      // Filter by startTime
      if (filters.startTime) {
        if (new Date(item.created_at).getTime() < filters.startTime._d.getTime()) {
          return // skip this meeting
        }
      }

      // Filter by endTime
      if (filters.endTime) {
        if (filters.endTime._d.getTime() < new Date(item.created_at).getTime()) {
          return // skip this meeting
        }
      }

      item['supplier_name'] = (suppliers) ? (props => {
        const supplier = suppliers.find((item) => {
          return item.id === props;
        });
        return (supplier ? supplier.name : '-');
      })(item['supplier']) : "-";

      item['recruiter_name'] = (recruiters) ? (props => {
        const recruiter = recruiters.find((item) => {
          return item.id === props;
        });
        return (recruiter ? recruiter.name : '-');
      })(item['recruiter']) : "-";


      item['created_by_name'] = (users) ? (props => {
        const createdBy = users.find((element) => {
          return element.id === props;
        });
        return createdBy ? createdBy.first_name : '-';
      })(item['created_by']) : "-";

      item['edit'] = editButton(item.id)
      item['view'] = viewButton(item.id)

      filteredMeetingsArray.push(item)
    });
    setMeetingsArray(filteredMeetingsArray)
  }

  const redirectToEditMeeting = (id) => {
    props.history.push(`/admin/new-ethical-recruitment-meeting?id=${id}`)
  }

  const handleViewButtonClick = (id) => {
    setModal({
      open: true,
      id: id
    })
  }

  const editButton = (meeting_id) => {
    return (
      <Button
        title={"Edit: " + meeting_id}
        simple
        color="success"
        value={meeting_id}
        className={classes.button}
        onClick={(e) => redirectToEditMeeting(e.currentTarget.value)}
      >
        <Edit />
      </Button>
    )
  }

  const viewButton = (meeting_id) => {
    return (
      <Button
        title={"View: " + meeting_id}
        simple
        color="info"
        value={meeting_id}
        className={classes.button}
        onClick={(e) => handleViewButtonClick(e.currentTarget.value)}
      >
        <VisibilityIcon />
      </Button>
    )
  }


  return (
    <GridContainer>
      <EthicalRecruitmentMeetingModal open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardBody>
            <GridContainer justify="center">
              <GridItem xs={12} sm={4} lg={4} xl={3}>
                <SuppliersDropdown multipleselect={true} onSelect={suppliers => setFilters({ ...filters, suppliers: suppliers })} value={filters.suppliers} />
              </GridItem>
              <GridItem xs={12} sm={4} lg={4} xl={3}>
                <RecruitersDropdown multipleselect={true} onSelect={recruiters => setFilters({ ...filters, recruiters: recruiters })} value={filters.recruiters} />
              </GridItem>
              <GridItem xs={12} sm={4} lg={4} xl={2}>
                <IssaraStaffDropdown multipleselect={true} onSelect={users => setFilters({ ...filters, users: users })} value={filters.users} />
              </GridItem>
              <GridItem xs={6} sm={2} lg={2} xl={1}>
                <InputLabel className={classes.label}>Between</InputLabel>
                <FormControl fullWidth>
                  <Datetime
                    value={filters.startTime}
                    timeFormat={false}
                    inputProps={{ placeholder: "Start" }}
                    onChange={date => typeof date === 'object' && setFilters({ ...filters, startTime: date })}
                    dateFormat='YYYY-MM'
                    closeOnSelect={true}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={6} sm={2} lg={2} xl={1}>
                <InputLabel className={classes.label}>And</InputLabel>
                <FormControl fullWidth>
                  <Datetime
                    value={filters.endTime}
                    timeFormat={false}
                    inputProps={{ placeholder: "End" }}
                    onChange={date => typeof date === 'object' && setFilters({ ...filters, endTime: date })}
                    dateFormat='YYYY-MM'
                    closeOnSelect={true}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={2} lg={2} xl={2}>
                <FormControl justify="center">
                  <Button
                    color="rose"
                    onClick={
                      () => setFilters({
                        suppliers: [],
                        recruiters: [],
                        users: [],
                        startTime: null,
                        endTime: null
                      })
                    }
                  > Reset All </Button>
                </FormControl>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>Search Results (Found: {(meetingsArray !== undefined &&
              meetingsArray.length !== undefined) ? meetingsArray.length : 0})</h4>
          </CardHeader>
          <CardBody>
            <ReactTable PaginationComponent={Pagination}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}

              data={meetingsArray}
              defaultSorted={[{
                id: 'created_at',
                desc: true,
              }]}
              columns={[
                {
                  Header: "Supplier",
                  accessor: "supplier_name",
                  width: 140,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div title={props.value} className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  }
                },
                {
                  Header: "Recruiter",
                  accessor: "recruiter_name",
                  width: 140,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                        <div title={props.value} className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  }
                },
                {
                  Header: "Location",
                  accessor: "location",
                  width: 180,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Assessment",
                  accessor: "assesment",
                  width: 200,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                },
                {
                  Header: "Created",
                  accessor: "created_at",
                  width: 100,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>)
                }, {
                  Header: "Created By",
                  accessor: "created_by_name",
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {props.value}
                      </div>
                    </HtmlTooltip>),
                  width: 110
                },
                {
                  Header: "",
                  sortable: false,
                  accessor: "view",
                  width: 30,
                },
                {
                  Header: "",
                  sortable: false,
                  accessor: "edit",
                  width: 30,
                }
              ]}
              defaultPageSize={5}
              showPaginationTop={false}
              showPaginationBottom={true}
              loading={fetchingSuppliers || fetchingRecruiters || fetchingUsers || fetchingMeetings}
              className="-striped -highlight"
            />

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

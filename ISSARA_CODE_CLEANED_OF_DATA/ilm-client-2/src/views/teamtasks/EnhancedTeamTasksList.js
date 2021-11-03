import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Datetime from "react-datetime";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import CustomInput from "components/CustomInput/CustomInput.js";

import Utils from "services/utils";

import Check from "@material-ui/icons/Check";
import Checkbox from "@material-ui/core/Checkbox";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Pagination from "components/Pagination/Pagination2.js";

import BusinessResponseModal from '../suppliers/BusinessResponseModal';
import InteractionCallModal from '../calls/InteractionCallModal.js';

import CheckIcon from '@material-ui/icons/Check';
import ScheduleIcon from '@material-ui/icons/Schedule';


import { makeStyles } from "@material-ui/core/styles";

import { fetchTeamTasks, updateTeamTask } from "redux/actions/TeamTasksActions.js";
import { fetchBusinessResponses } from "redux/actions/BusinessResponseActions.js";
import { fetchResponseInteractionTypes } from "redux/actions/LocaleActions.js";
import { fetchUsers } from "redux/actions/UsersActions.js";
import { fetchSuppliers } from "redux/actions/SupplierActions.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import loginStore from "../../redux/stores/LoginStore";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;



const customStyle = {
  ...styles,
  button: {
    padding: 0,
    margin: 0,
  },
}

const useStyles = makeStyles(customStyle);


class DownloadTeamTasklist extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataset: props.dataset
    }
  }


  render() {
    return (
      <GridContainer>
        <GridItem>
          <ExcelFile filename={"team_tasks"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="team_tasks">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="assigned_by" value="assigned_by" />
              <ExcelColumn label="assigned_by_name" value="assigned_by_name" />
              <ExcelColumn label="assigned_to_name" value="assigned_to_name" />
              <ExcelColumn label="assigned_to" value="assigned_to" />
              <ExcelColumn label="source_id" value="source_id" />
              <ExcelColumn label="deadline" value="deadline" />
              <ExcelColumn label="done" value="done" />
              <ExcelColumn label="level" value="level" />
              <ExcelColumn label="created_at" value="created_at" />
              <ExcelColumn label="modified_at" value="modified_at" />
              <ExcelColumn label="done" value="done" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>

      </GridContainer>
    );
  }
}

export default function EnhancedTeamTasksList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const teamTasks = useSelector(state => state.teamTasksReducer.items)
  const teamTasksReceivedAt = useSelector(state => state.teamTasksReducer.receivedAt)
  const fetchingTeamTasks = useSelector(state => state.teamTasksReducer.fetching)

  const businessResponses = useSelector(state => state.businessResponsesReducer.items)
  const businessResponsesReceivedAt = useSelector(state => state.businessResponsesReducer.receivedAt)
  const fetchingBusinessResponses = useSelector(state => state.businessResponsesReducer.fetchingBusinessResponses)

  const interactionTypes = useSelector(state => state.responseInteractionTypesReducer.items)
  const fetchingInteractionTypes = useSelector(state => state.responseInteractionTypesReducer.fetchingResponseInteractionTypes)

  const users = useSelector(state => state.usersReducer.items)
  const fetchingUsers = useSelector(state => state.usersReducer.fetchingUsers)

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)

  const [teamTasksArray, setTeamTasksArray] = useState([]);

  const currentUser = loginStore.getLoginUser();
  
  const [modal, setModal] = useState({
    open: false,
    id: null,
    type: null
  });

  // FILTERS
  const [filters, setFilters] = useState({
    showDone: false,
    search: ""
  });

  useEffect(() => {
   

    // Fetch teams tasks
    if (!fetchingTeamTasks && !teamTasksReceivedAt || (new Date() - teamTasksReceivedAt) > 1000 * 600) { // Refetch every 10 minutes
      dispatch(fetchTeamTasks())
    }
    // Fetch users
    if (users.length === 0 && !fetchingUsers) {
      dispatch(fetchUsers())
    }
    // Fetch suppliers
    if (suppliers.length === 0 && !fetchingSuppliers) {
      dispatch(fetchSuppliers())
    }
    // Fetch business responses
    if (!businessResponsesReceivedAt && !fetchingBusinessResponses) {
      dispatch(fetchBusinessResponses())
    }
    // Convert business responses to be used in a table
    if (teamTasks) {
      filterTeamTasks()
    }
  }, [teamTasks]);

  useEffect(() => {
    if (teamTasks) {
      filterTeamTasks()
    }
  }, [filters, currentUser])

  const filterTeamTasks = () => {
    const filteredTeamTasksArray = []

    Object.keys(teamTasks).forEach(key => {
      const item = teamTasks[key]

      if (currentUser && currentUser.groups && !currentUser.groups.includes('Issara Management')) {
        // filter by assigned to current user
        if (currentUser && currentUser.id) {
          if (currentUser.id !== item.assigned_to) {
            return // skip this task because it doesn't belong to the user
          }
        }
      }

      item['view_button'] = viewButton(item.source_id, item.source_type)
      item['done_button'] = doneButton(item.id, item.assigned_to, item.done)


      // filter by done (hide done by default)
      if (filters.showDone === true && item.done === true) {
        filteredTeamTasksArray.push(item);
      } else if (filters.showDone === false && item.done === false) {
        filteredTeamTasksArray.push(item);

      }

    });


    if (filters.search !== undefined && filters.search.length > 1) {
      let filteredSearchData = Utils.findStringInObjectFields(filteredTeamTasksArray, filters.search, ["id",
        "source_id",
        "source_type",
        "assigned_by_name",
        "assigned_to_name",
        "deadline"
      ]);
      setTeamTasksArray(filteredSearchData);
    } else {
      setTeamTasksArray(filteredTeamTasksArray)
    }



  }

  const handleViewButtonClick = (id, type) => {
    setModal({
      open: true,
      id: id,
      type: type
    })
  }

  const viewButton = (source_id, source_type) => {
    return (
      <Button
        style={{ cursor: "pointer" }}
        title={"View Item: " + source_id}
        simple
        color="info"
        value={source_id}
        className={classes.button}
        onClick={(e) => handleViewButtonClick(e.currentTarget.value, source_type)}
      >
        <VisibilityIcon />
      </Button>
    )
  }

  const toggleDoneButton = (id, value) => {
    const payload = { done: value }
    dispatch(updateTeamTask(id, payload))
  }

  const doneButton = (id, assigned_to, done) => {
    return (<div style={{ cursor: "pointer" }} title={(done === true) ? "Re-Open item " + id : "Close/Finish Item " + id} >
      <Button
        simple
        color="info"
        disabled={currentUser && currentUser.id !== assigned_to}
        value={id}
        className={classes.button}
        onClick={(e) => toggleDoneButton(e.currentTarget.value, !done)}
      >
        {(done === true) ?
          <CheckIcon fontSize='small' style={{ color: 'green', verticalAlign: 'middle' }} />
          :
          <ScheduleIcon fontSize='small' style={{ color: 'orange', verticalAlign: 'middle' }} />
        }
      </Button>
    </div>
    )
  }

  console.log(modal.open && modal.type === 'Call')

  return (
    <GridContainer>
      <BusinessResponseModal open={modal.open && modal.type === 'Business Response'} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
      <InteractionCallModal open={modal.open && modal.type === 'Call'} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />

      <GridContainer justify="flex-end">
        <FormControlLabel
          control={
            <Checkbox
              tabIndex={-1}
              checked={filters.showDone}
              onClick={() => setFilters({ ...filters, showDone: !filters.showDone })}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot
              }}
            />
          }
          label="Show finished"
        />
      </GridContainer>

      {currentUser && currentUser.groups && currentUser.groups.includes('Issara Management') &&
        <GridItem>
          {(teamTasksArray !== undefined && teamTasksArray.length !== undefined && teamTasksArray.length > 0) ? (<DownloadTeamTasklist dataset={teamTasksArray} />) : (null)}
        </GridItem>
      }

      <GridItem xs={12}>
        <Card style={{ marginTop: 0 }}>
          <CardHeader>
            <h4>Search Results (Found: {(teamTasksArray !== undefined &&
              teamTasksArray.length !== undefined) ? teamTasksArray.length : 0})</h4>
          </CardHeader>
          <CardBody>
            <GridItem xs={12} sm={12} lg={12}>
              <FormControl fullWidth>
                <CustomInput
                  id={"search_text"}
                  labelText={"Search (Fuzzy Search Across all fields)"}
                  isTextArea={false}
                  formControlProps={{
                    fullWidth: true
                  }}
                  value={filters.search}
                  inputProps={{
                    onChange: (e) => {
                      setFilters({ ...filters, search: (e.target.value === undefined) ? "" : e.target.value })
                    }
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <br />
            </GridItem>
            <GridItem>
              <ReactTable
                PaginationComponent={Pagination}
                defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                filterable={true}

                data={teamTasksArray}
                defaultSorted={[{
                  id: 'created_at',
                  desc: true,
                }]}
                columns={[
                  {
                    Header: "ID",
                    accessor: "id",
                    width: 60,
                    filterable: true
                  },
                  {
                    Header: "Source ID",
                    accessor: "source_id",
                    width: 110,
                    filterable: true
                  },
                  {
                    Header: "Source Type",
                    accessor: "source_type",
                    filterable: true
                  }, {
                    Header: "Assigned by",
                    accessor: "assigned_by_name",
                    filterable: true
                  }, {
                    Header: "Assigned to",
                    accessor: "assigned_to_name",
                    filterable: true
                  }, {
                    Header: "Deadline",
                    accessor: "deadline",
                    width: 100,
                    filterable: true
                  }, {
                    Header: "",
                    accessor: "done_button",
                    sortable: false,
                    width: 30
                  }, {
                    Header: "",
                    sortable: false,
                    accessor: "view_button",
                    width: 30,
                  }
                ]}
                defaultPageSize={5}
                showPaginationTop={false}
                showPaginationBottom={true}
                loading={fetchingTeamTasks || fetchingBusinessResponses || !currentUser}
                className="-striped -highlight"
              />
            </GridItem>

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

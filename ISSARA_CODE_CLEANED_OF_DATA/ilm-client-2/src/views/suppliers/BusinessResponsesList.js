
import Tooltip from '@material-ui/core/Tooltip';import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Datetime from "react-datetime";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import CustomInput from "components/CustomInput/CustomInput.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';

import BusinessResponseModal from './BusinessResponseModal';
import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js";
import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js"

import { makeStyles, withStyles } from "@material-ui/core/styles";

import { fetchBusinessResponses } from "redux/actions/BusinessResponseActions.js";
import { fetchResponseInteractionTypes } from "redux/actions/LocaleActions.js";
import { fetchUsers } from "redux/actions/UsersActions.js";
import { fetchSuppliers } from "redux/actions/SupplierActions.js";

import { fetchStrategicPartners, fetchSharedFiles } from "../../redux/actions/StrategicPartnerActions";

import { fetchRecruiters } from "redux/actions/RecruiterActions.js";
import ReactExport from "react-export-excel";
import Utils from "../../services/utils.js";


import loginStore from "../../redux/stores/LoginStore";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const customStyle = {
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


class DownloadBuinessResponseList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataset: props.dataset
    }
  }

  /*

  "id": 753,
            "suppliers": [
                1114
            ],
            "suppliers_notes": "",
            "recruiters": [],
            "recruiters_notes": "",
            "global_buyers": [],
            "global_buyers_notes": "",
            "other_parties_notes": "",
            "event_details": "sent email for appointment the remediation-focus call.",
            "event_location": "MCL",
            "event_date": "2020-10-05",
            "event_interaction_type": 9,
            "suppliers_next_steps": "The business will respond the available date.",
            "suppliers_next_steps_deadline": "2020-10-09",
            "suppliers_focal_points": "Sahasa",
            "recruiters_next_steps": "",
            "recruiters_next_steps_deadline": null,
            "recruiters_focal_points": "",
            "global_buyers_next_steps": "",
            "global_buyers_next_steps_deadline": null,
            "global_buyers_focal_points": "",
            "issara_next_steps": "BHR follow up the business response.",
            "issara_next_steps_deadline": "2020-10-09",
            "issara_focal_points": [
                12
            ],
            "created_by": 12,
            "created_at": "2020-10-07"


*/

  render() {
    return (
      <GridContainer>
        <GridItem>
          <ExcelFile filename={"business_respponses"} element={<Button>Download As XLS File</Button>}>
            <ExcelSheet data={this.state.dataset} name="business_responses">
              <ExcelColumn label="id" value="id" />
              <ExcelColumn label="supplier_names" value="supplier_names" />
              <ExcelColumn label="suppliers_notes" value="suppliers_notes" />
              <ExcelColumn label="recruiter_names" value="recruiter_names" />
              <ExcelColumn label="partner_names" value="partner_names" />
              <ExcelColumn label="recruiters_notes" value="recruiters_notes" />
              <ExcelColumn label="global_buyers_notes" value="global_buyers_notes" />
              <ExcelColumn label="other_parties_notes" value="other_parties_notes" />
              <ExcelColumn label="event_details" value="event_details" />
              <ExcelColumn label="event_location" value="event_location" />
              <ExcelColumn label="event_interaction_type" value="event_interaction_type" />
              <ExcelColumn label="suppliers_next_steps" value="suppliers_next_steps" />
              <ExcelColumn label="suppliers_next_steps_deadline" value="suppliers_next_steps_deadline" />
              <ExcelColumn label="recruiters_next_steps" value="recruiters_next_steps" />
              <ExcelColumn label="recruiters_next_steps_deadline" value="recruiters_next_steps_deadline" />
              <ExcelColumn label="recruiters_focal_points" value="recruiters_focal_points" />
              <ExcelColumn label="global_buyers_next_steps" value="global_buyers_next_steps" />
              <ExcelColumn label="global_buyers_next_steps_deadline" value="global_buyers_next_steps_deadline" />
              <ExcelColumn label="global_buyers_focal_points" value="global_buyers_focal_points" />
              <ExcelColumn label="issara_next_steps" value="issara_next_steps" />
              <ExcelColumn label="issara_next_steps_deadline" value="issara_next_steps_deadline" />
              <ExcelColumn label="created_at" value="created_at" />
              <ExcelColumn label="created_by_name" value="created_by_name" />
            </ExcelSheet>
          </ExcelFile>
        </GridItem>

      </GridContainer>
    );
  }
}



export default function BusinessResponsesList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const businessResponses = useSelector(state => state.businessResponsesReducer.items)
  const businessResponsesFetching = useSelector(state => state.businessResponsesReducer.fetchingBusinessResponses)
  const interactionTypes = useSelector(state => state.responseInteractionTypesReducer.items)
  const fetchingInteractionTypes = useSelector(state => state.responseInteractionTypesReducer.fetchingResponseInteractionTypes)
  const users = useSelector(state => state.usersReducer.items)
  const fetchingUsers = useSelector(state => state.usersReducer.fetchingUsers)
  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingReducerSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)
  const recruiters = useSelector(state => state.recruitersReducer.items)
  const fetchingReducerRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)
  const currentUser = loginStore.getLoginUser();
  
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)


  const [businessResponsesArray, setBusinessResponsesArray] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: [],
    recruiters: [],
    startTime: null,
    endTime: null,
    search: ""
  });


  const filterBusinessResponses = () => {
    const filteredBusinessResponsesArray = []

    Object.keys(businessResponses).forEach(key => {
      const item = businessResponses[key]

      // Filter by supplier
      if (filters.suppliers.length > 0) {
        const suppliers_intersection = filters.suppliers.filter(x => item.suppliers.includes(x))
        if (suppliers_intersection.length === 0) {
          return // skip this business response as no suppliers matched
        }
      }

      // Filter by recruiter
      if (filters.recruiters.length > 0) {
        const recruiters_intersection = filters.recruiters.filter(x => item.recruiters.includes(x))
        if (recruiters_intersection.length === 0) {
          return // skip this business response as no recruiters matched
        }
      }

      // Filter by startTime
      if (filters.startTime) {
        if (new Date(item.created_at).getTime() < filters.startTime._d.getTime()) {
          return // skip this business response
        }
      }

      // Filter by endTime
      if (filters.endTime) {
        if (filters.endTime._d.getTime() < new Date(item.created_at).getTime()) {
          return // skip this business response
        }
      }

      item["supplier_names"] = (()=>{
        let names = []
        if (suppliers.length !== 0) {
          const filteredSuppliers = item.suppliers.map(item => {
            return suppliers.find((element) => {
              return element.id === item
            })
          })
          names = filteredSuppliers.map(item => {
            return item.name
          })
        }

        return "" + names;
      })();

      item["recruiter_names"] = (()=>{
        let names = []
        if (recruiters.length !== 0) {
          const filteredRecruiters = item.recruiters.map(item => {
            return recruiters.find((element) => {
              return element.id === item
            })
          })
          names = filteredRecruiters.map(item => {
            return item.name
          })
        }

        return "" + names;
      })();

      item["partner_names"] = (()=>{
        let names = []
        if (strategicPartners.length !== 0) {
          const filteredPartners = item.global_buyers.map(item => {
            return strategicPartners.find((element) => {
              return element.id === item
            })
          })
          names = filteredPartners.map(item => {
            return item.name
          })
        }

        return "" + names;
      })();


      item["event_interaction_type_name"] = (value => {
        const interactionType = interactionTypes.find((element) => {
          return element.id === value
        });
        return interactionType? interactionType.name : '-';
      })(item["event_interaction_type"])

      item["created_by_name"] = ((value) => {
        const createdBy = users.find((element) => {
          return element.id === value
        });
        return createdBy? createdBy.first_name + " " + createdBy.last_name + " (" + createdBy.email + ")": '-';
      })(item["created_by"]);


      item["created_by_short_name"] = ((value) => {
        const createdBy = users.find((element) => {
          return element.id === value
        });
        return createdBy? createdBy.first_name + " " + createdBy.last_name: '-';
      })(item["created_by"]);

      item['edit'] = editButton(item.id)
      item['view'] = viewButton(item.id)

      filteredBusinessResponsesArray.push(item)
    });

    if (filters.search !== undefined && filters.search.length > 1) {
      let filteredSearchData = Utils.findStringInObjectFields(filteredBusinessResponsesArray, filters.search, ["id",
        "supplier_names",
        "recruiter_names",
        "partner_names",
        "event_details",
        "event_interaction_type_name",
        "created_by_name",
        "event_date"
      ]);
      setBusinessResponsesArray(filteredSearchData);
    } else {
      setBusinessResponsesArray(filteredBusinessResponsesArray)
    }

   
  }

  const redirectToEditBusinessResponse = (id) => {
    props.history.push(`/admin/edit-business-response?id=${id}`)
  }

  const handleViewButtonClick = (id) => {
    setModal({
      open: true,
      id: id
    })
  }

  const editButton = (response_id) => {
    return (
      <Button
        title={"Edit: " + response_id}
        simple
        color="success"
        value={response_id}
        className={classes.button}
        onClick={(e) => redirectToEditBusinessResponse(e.currentTarget.value)}
      >
        <Edit/>
      </Button>
    )
  }

  const viewButton = (response_id) => {
    return (
      <Button
        title={"View: " + response_id}
        simple
        color="info"
        value={response_id}
        className={classes.button}
        onClick={(e) => handleViewButtonClick(e.currentTarget.value)}
      >
        <VisibilityIcon/>
      </Button>
    )
  }


  useEffect(()=>{
    dispatch(fetchRecruiters());
    if(suppliers === null || suppliers === undefined || suppliers.length < 1 ) {
      dispatch(fetchSuppliers());
    }
    dispatch(fetchUsers());
    dispatch(fetchStrategicPartners());
    dispatch(fetchResponseInteractionTypes())
    dispatch(fetchBusinessResponses())
        
  }, []);


  useEffect(() => {
    if (businessResponses && suppliers) {
      filterBusinessResponses()
    }
  }, [filters, suppliers, users, interactionTypes, recruiters, businessResponses])


  return ((suppliers === undefined || suppliers === null || suppliers.length === undefined || suppliers.length < 1) ||
  (strategicPartners === undefined || strategicPartners === null || strategicPartners.length === undefined || strategicPartners.length < 1)) ? (<div>Loading...</div>) : (
    <GridContainer>
      <BusinessResponseModal open={modal.open} value={modal.id} onClose={() => setModal({...modal, open: false})} />
      <GridItem xs={12}>
        <Card style={{marginTop: 0}}>
          <CardBody>
            <GridContainer justify="center">
              <GridItem xs={12} sm={4} lg={6} xl={4}>
                <SuppliersDropdown multipleselect={true} onSelect={suppliers => setFilters({...filters, suppliers: suppliers})} value={filters.suppliers}/>
              </GridItem>
              <GridItem xs={12} sm={4} lg={6} xl={4}>
                <RecruitersDropdown multipleselect={true} onSelect={recruiters => setFilters({...filters, recruiters: recruiters})} value={filters.recruiters}/>
              </GridItem>
              <GridItem xs={6} sm={2} lg={2} xl={1}>
                <InputLabel className={classes.label}>Between</InputLabel>
                <FormControl fullWidth>
                  <Datetime
                    value={filters.startTime}
                    timeFormat={false}
                    inputProps={{ placeholder: "Start" }}
                    onChange={date => typeof date === 'object' && setFilters({...filters, startTime: date})}
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
                    onChange={date => typeof date === 'object' && setFilters({...filters, endTime: date})}
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
                        startTime: null,
                        endTime: null
                      })
                    }
                  > Reset all </Button>
                </FormControl>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      {currentUser && currentUser.groups && currentUser.groups.includes('Issara Management') &&
        <GridItem>
          {(businessResponsesArray !== undefined && businessResponsesArray.length !== undefined && businessResponsesArray.length > 0) ? (<DownloadBuinessResponseList dataset={businessResponsesArray} />) : (null)}
        </GridItem>
      }
      <GridItem xs={12}>
        <Card style={{marginTop: 0}}>
         <CardHeader>
            <h4>Search Results (Found: {(businessResponsesArray !== undefined &&
              businessResponsesArray.length !== undefined) ? businessResponsesArray.length : 0})</h4>
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
            <ReactTable PaginationComponent={Pagination}
              defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
              filterable={true}
    
              data={businessResponsesArray}
              defaultSorted={[{
                id   : 'id',
                desc : true,
              }]}
              columns={[
                {
                  Header: "Id",
                  accessor: "id",
                  width: 80,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        { props.value }
                      </div>
                      </HtmlTooltip>
                    )
                  },
                },
                {
                  Header: "Suppliers",
                  accessor: "supplier_names",
                  width: 200,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        { props.value }
                      </div>
                      </HtmlTooltip>
                    )
                  },
                },
                {
                  Header: "Recruiters",
                  accessor: "recruiter_names",
                  width: 200,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        { props.value }
                      </div>
                      </HtmlTooltip>
                    )
                  },
                },
                {
                  Header: "Partners",
                  accessor: "partner_names",
                  width: 200,
                  filterable: true,
                  Cell: props => {
                    return (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        { props.value }
                      </div>
                      </HtmlTooltip>
                    )
                  },
                },
                // {
                //   Header: "Recruiters Notes",
                //   accessor: "recruiters_notes",
                //   Cell: props => (
                //     <Tooltip title={props.value? props.value : ''} TransitionComponent={Zoom} classes={tooltipClasses}>
                //       <div className="cell-overflow">
                //         {props.value}
                //       </div>
                //     </Tooltip>
                //   ),
                //   // width: 200
                // },{
                //   Header: "Global Buyers Notes",
                //   accessor: "global_buyers_notes",
                //   Cell: props => (
                //     <Tooltip title={props.value? props.value : ''} TransitionComponent={Zoom} classes={tooltipClasses}>
                //       <div className="cell-overflow">
                //         {props.value}
                //       </div>
                //     </Tooltip>
                //   ),
                // },
                {
                  Header: "Details",
                  accessor: "event_details",
                  filterable: true,
                  Cell: props => (
                    <HtmlTooltip title={props.value} interactive>
                    <div className="cell-overflow">
                      {Utils.shortenString(props.value, 120)}
                    </div>
                  </HtmlTooltip>),
                },{
                  Header: "Type",
                  accessor: "event_interaction_type_name",
                  width: 160,
                  filterable: true,
                  Cell: props => (
                    <HtmlTooltip title={props.value || '-'} interactive>
                      <div className="cell-overflow">
                      {props.value || '-'}
                    </div>
                    </HtmlTooltip>
                  )
                },{
                  Header: "Date",
                  accessor: "event_date",
                  filterable: true,
                  width: 100
                },{
                  Header: "Created By",
                  accessor: "created_by_name",
                  filterable: true,
                  Cell: props => (
                    <HtmlTooltip title={props.value || '-'} interactive>
                      <div className="cell-overflow">
                      {props.original.created_by_short_name || '-'}
                    </div>
                    </HtmlTooltip>
                  ),
                  width: 110
                },{
                  Header: "",
                  sortable: false,
                  accessor: "view",
                  width: 30,
                },{
                  Header: "",
                  sortable: false,
                  accessor: "edit",
                  width: 30,
                }
              ]}
              defaultPageSize={5}
              showPaginationTop={false}
              showPaginationBottom={true}
              loading={businessResponsesFetching || fetchingUsers || fetchingInteractionTypes || fetchingReducerSuppliers}
              className="-striped -highlight"
            />
            </GridItem>
            
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

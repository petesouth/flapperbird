import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

import Tooltip from '@material-ui/core/Tooltip';

// react component used to create sweet alerts

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';

import RecruitersDropdown from "components/ilmdb/RecruitersDropdown.js"
import { makeStyles, withStyles } from "@material-ui/core/styles";

import RecruiterCRCModal from "./RecruiterCRCModal";

import { fetchRecruiterCRCs, fetchRecruiters } from "../../redux/actions/RecruiterActions";
import Utils from "services/utils.js";
import loginStore from "../../redux/stores/LoginStore"

const customStyle = {
  ...customCheckboxRadioSwitch,
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



export default function RecruiterCRCList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const recruiters = useSelector(state => state.recruitersReducer.items)
  const fetchingRecruiters = useSelector(state => state.recruitersReducer.fetchingRecruiters)
  
  const recruiterCRCList = useSelector(state => state.recruiterCRCReducer.items);
  const fetchingRecruiterCRCS = useSelector(state => state.recruitersReducer.fetchingRecruiterCRCS)
  

  const [recruiterCRCArray, setRecruiterCRCArray] = useState([]);


  // -------------------------------
  //    DATA CLEANING MODE START
  // -------------------------------

  const currentUser = loginStore.getLoginUser();

  
  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);

  useEffect(() => {
    dispatch(fetchRecruiterCRCs());
    dispatch(fetchRecruiters());

  }, []);

  useEffect(() => {
    if (recruiterCRCList && recruiterCRCList.length > 0 && recruiters && recruiters.length > 0 ) {
      onSearchRecruiterCRCs()
    }
  }, [recruiterCRCList, recruiters, selectedRecruiters]);

  const redirectToEditRecruiterCRC = (id) => {
    props.history.push(`/admin/recruitercrcscoring?id=${id}`);
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
        onClick={(e) => redirectToEditRecruiterCRC(e.currentTarget.value)}
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
        onClick={(e) => handleViewButtonClick(id)}
      >
        <VisibilityIcon />
      </Button>
    )
  }

  const onSearchRecruiterCRCs = () => {
    const filteredRecruiterCRCsArray = []

    recruiterCRCList.map(item => {

      // Filter by strategic partner
      if (selectedRecruiters.length > 0) {
        if (!selectedRecruiters.includes(item.recruiter)) {
          return // skip
        }
      }

      item['recruiter_name'] = (recruiters) ? (props => {
        const recruiter = recruiters.find((item) => {
          return item.id === props;
        });
        return (recruiter? recruiter.name : '-');
        
      })(item.recruiter) : "-";


      item['edit'] = editButton(item.id)
      item['view'] = viewButton(item.id)

      filteredRecruiterCRCsArray.push(item)
    });
    setRecruiterCRCArray(filteredRecruiterCRCsArray)
  }

  return (!recruiterCRCList || ! recruiters) ? (<div>Loading...</div>) : (
      <GridContainer>
        <RecruiterCRCModal key={Utils.giveMeGuid()} open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
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
                <h4>Search Results (Found: {(recruiterCRCArray !== undefined &&
                  recruiterCRCArray.length !== undefined) ? recruiterCRCArray.length : 0})
              </h4>
              </GridItem>
            </GridContainer>
          </CardHeader>
          <Card style={{ marginTop: 0 }}>
            <CardBody>
              <ReactTable PaginationComponent={Pagination}
                defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                filterable={true}

                data={recruiterCRCArray}
                defaultSorted={[{
                  id: 'id',
                  desc: true,
                }]}
                columns={[
                  {
                    Header: "",
                    accessor: "id",
                    width: 80,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                  {
                    Header: "Recruiter",
                    accessor: "recruiter_name",
                    width: 200,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                  {
                    Header: "Quality Comments",
                    accessor: "response_quality_comments",
                    width: 300,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                  {
                    Header: "Timeliness Comments",
                    accessor: "response_timeliness_comments",
                    width: 300,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                  {
                    Header: "Openness Comments",
                    accessor: "response_openness_comments",
                    width: 300,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow">
                          {props.value}
                        </div>
                      </HtmlTooltip>
                    )
                  },
                  {
                    Header: "",
                    sortable: false,
                    accessor: "view",
                    width: 30,
                  }, {
                    Header: "",
                    sortable: false,
                    accessor: "edit",
                    width: 30,
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
                loading={fetchingRecruiterCRCS || fetchingRecruiters}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
       
      </GridContainer>
    );
}

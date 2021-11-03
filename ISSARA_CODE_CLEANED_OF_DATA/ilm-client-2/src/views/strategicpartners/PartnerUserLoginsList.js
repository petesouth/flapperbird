import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tooltip from '@material-ui/core/Tooltip';
import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

import moment from "moment";

import { fetchUsers } from "../../redux/actions/UsersActions";



import { fetchPartnerUserLogins, fetchStrategicPartners } from "../../redux/actions/StrategicPartnerActions";
import Utils from "../../services/utils.js";

const customStyle = {
  ...styles,
  button: {
    padding: 0,
    margin: 0
  },


  preBlock: {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    scroll: "none",
    width: "100%"
  },
  center: {
    textAlign: "center"
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

export default function PartnerUserLoginsList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const partnerUserLogins = useSelector(state => state.parnterUserLoginsReducer.partnerUserLogins);
  const fetchingPartnerUserLogins = useSelector(state => state.parnterUserLoginsReducer.fetchingPartnerUserLogins)
  const [partnerUserLoginsArray, setPartnerUserLoginsArray] = useState([]);

  const users = useSelector(state => state.usersReducer.items);
  const fetchingUsers = useSelector(state => state.usersReducer.fetchingUsers);

  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)
  const fetchingStrategicPartners = useSelector(state => state.strategicPartnerReducer.fetchingStrategicPartners)

  const [filters, setFilters] = useState({
    search: ""
  });

  function createPartnerLoginsArray(tpartnerUserLogins, tstrategicPartners) {
    let partnerLogins = [];
    tpartnerUserLogins.forEach((itemUserLogin) => {
      let user = users.find(user => {
        return user.id === itemUserLogin.user;
      });
      let partner = (user) ? tstrategicPartners.find(partner => {
        return partner.id === user.partner;
      }) : undefined;


      if (user && partner) {
        partnerLogins.push({
          id: itemUserLogin.id,
          loggedout_at: (itemUserLogin.loggedout_at) ? moment(itemUserLogin.loggedout_at).format('MM/DD/YYYY h:mm a') : "-",
          created_at: (itemUserLogin.created_at) ?  moment(itemUserLogin.created_at).format('MM/DD/YYYY h:mm a') : "-",
          user_name: user.username,
          partner_name: partner.name
        });
      }

    });
    return partnerLogins;
  }

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchStrategicPartners());
    dispatch(fetchPartnerUserLogins());

  }, []);

  useEffect(() => {

    if (partnerUserLogins && partnerUserLogins.length > 0 &&
      strategicPartners && strategicPartners.length > 0 &&
      users && users.length > 0) {
      setPartnerUserLoginsArray(createPartnerLoginsArray(partnerUserLogins, strategicPartners));
    }
  }, [partnerUserLogins, strategicPartners, users]);

  useEffect(() => {
    if (filters.search !== undefined && filters.search.length > 0) {
      let filteredSearchData = Utils.findStringInObjectFields(createPartnerLoginsArray(partnerUserLogins, strategicPartners), filters.search, ["id",
        "user_name",
        "partner_name",
        "created_at",
        "loggedout_at"
      ]);
      setPartnerUserLoginsArray(filteredSearchData);
    } else {
      setPartnerUserLoginsArray(createPartnerLoginsArray(partnerUserLogins, strategicPartners));
    }

  }, [filters]);

  if ((partnerUserLogins === null || partnerUserLogins === undefined) ||
    (strategicPartners === null || strategicPartners === undefined || strategicPartners.length < 1) ||
    (users === null || users === undefined || users.length < 1)) {

    return (<CircularProgress />);

  }
  return (
    <GridContainer>

      <GridItem xs={12}>
        <CardHeader>
          <h4>Strategic Partner Login Tracking (Found: {(partnerUserLoginsArray) ? partnerUserLoginsArray.length : 0})</h4>
        </CardHeader>
        <Card style={{ marginTop: 0 }}>
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


              {(partnerUserLoginsArray === undefined || partnerUserLoginsArray === null || partnerUserLoginsArray.length < 1)
                ? (<GridContainer key={Utils.giveMeGuid()}>
                  <Card>
                    <CardBody>
                      <GridContainer>
                        <GridItem>
                          <h4>Strategic Partner Logins:</h4>
                          <div>
                            <p>
                              No Strategic Partner Logins at this time.
                            </p>
                          </div>

                        </GridItem>
                      </GridContainer>

                    </CardBody>
                  </Card>
                </GridContainer>) :
                <ReactTable key={Utils.giveMeGuid()}
                  PaginationComponent={Pagination}
                  defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                  filterable={true}
                  sortable={true}
                  data={partnerUserLoginsArray}
                  columns={[
                    {
                      Header: "User",
                      accessor: "user_name",
                      width: 250,
                      Cell: props => (
                        <HtmlTooltip title={props.value} interactive>
                          <div className="cell-overflow" >
                            {Utils.shortenString(props.value, 100)}
                          </div>
                        </HtmlTooltip>)
                    }, {
                      Header: "Partner",
                      accessor: "partner_name",
                      width: 250,
                      Cell: props => (
                        <HtmlTooltip title={(<div className={classes.preBlock}>{props.value}</div>)} interactive>
                          <div className="cell-overflow" >
                            {Utils.shortenString(props.value, 100)}
                          </div>
                        </HtmlTooltip>)
                    }, {
                      Header: "Log-In",
                      accessor: "created_at",
                      width: 250,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    }, {
                      Header: "Log-Out",
                      accessor: "loggedout_at",
                      width: 250,
                      Cell: props => (
                        <HtmlTooltip title={(props.value) ? props.value : ""} interactive>
                          <div className="cell-overflow">
                            {props.value}
                          </div>
                        </HtmlTooltip>)
                    }, {
                      Header: "",
                      width: 20,
                      sortable: false,
                      filterable: false
                    }
                  ]}
                  defaultPageSize={partnerUserLoginsArray.length}
                  showPaginationTop={false}
                  showPaginationBottom={false}
                  loading={fetchingPartnerUserLogins}
                  className="-striped -highlight"
                />

              }
            </GridItem>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );


}

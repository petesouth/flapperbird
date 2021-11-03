import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tooltip from '@material-ui/core/Tooltip';
import ReactTable from "react-table-6";

import Pagination from "components/Pagination/Pagination2.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import CircularProgress from '@material-ui/core/CircularProgress';


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

import { fetchNewsUpdates } from "../../redux/actions/StrategicPartnerActions";
import Utils from "services/utils.js";

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

export default function NewsUpdateList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const newsUpdates = useSelector(state => state.newsUpdatesReducer.newsUpdates);
  const fetchingNewsUpdates = useSelector(state => state.newsUpdatesReducer.fetchingNewsUpdates)
  const [newsUpdateArray, setNewsUpdateArray] = useState([]);

  useEffect(() => {
    dispatch(fetchNewsUpdates());

  }, []);

  useEffect(() => {

    if (newsUpdates && newsUpdates.length > 0) {
      setNewsUpdateArray( [...newsUpdates].sort((a, b) => {
        if (a.sort_number < b.sort_number) {
          return -1;
        }
        if (a.sort_number > b.sort_number) {
          return 1;
        }
        // a must be equal to b
        return 0;
      }));
    }
  }, [newsUpdates]);

  if (newsUpdateArray === undefined ||
    newsUpdateArray === null ||
    newsUpdateArray.length < 1) {
    return (<GridContainer>
      <Card>
        <CardBody>
          <GridContainer>
            <GridItem>
              <h4>News And Updates:</h4>
              <div>
                <p>
                  No Future News And Updates at this time.
                </p>
              </div>

            </GridItem>
          </GridContainer>

        </CardBody>
      </Card>
    </GridContainer>);
  }

  return (
    <GridContainer>

      <GridItem xs={12}>
        <CardHeader>
          <h4>News Updates (Found: {(newsUpdateArray) ? newsUpdateArray.length : 0})</h4>
        </CardHeader>
        <Card style={{ marginTop: 0 }}>
          <CardBody>

            {newsUpdateArray &&
              <ReactTable PaginationComponent={Pagination}
                defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                filterable={false}
                sortable={false}

                SubComponent={(data) => (
                  <GridContainer style={{ width: '100%', margin: 0 }}>
                    <GridItem xs={12}>

                      <Card>
                        <CardHeader>
                          <h5 className={classes.center}>{data.original.title}</h5>
                        </CardHeader>
                        <CardBody>
                          <p className={classes.preBlock}>{data.original.description} </p>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                )}

                data={newsUpdateArray}
                columns={[
                  {
                    Header: "Title",
                    accessor: "title",
                    width: 250,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                        <div className="cell-overflow" >
                          {Utils.shortenString(props.value, 100)}
                        </div>
                      </HtmlTooltip>)
                  }, {
                    Header: "Description",
                    accessor: "description",
                    width: 350,
                    Cell: props => (
                      <HtmlTooltip title={(<div className={classes.preBlock}>{props.value}</div>)} interactive>
                        <div className="cell-overflow" >
                          {Utils.shortenString(props.value, 100)}
                        </div>
                      </HtmlTooltip>)
                  }, {
                    Header: "Created",
                    accessor: "created",
                    width: 90,
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
                defaultPageSize={newsUpdateArray.length}
                showPaginationTop={false}
                showPaginationBottom={false}
                loading={fetchingNewsUpdates}
                className="-striped -highlight"
              />

            }
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

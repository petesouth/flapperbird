import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

import Tooltip from '@material-ui/core/Tooltip';

// react component used to create sweet alerts

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import Pagination from "components/Pagination/Pagination2.js";

import Button from "components/CustomButtons/Button.js";
import Edit from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';

import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js"
import { makeStyles, withStyles } from "@material-ui/core/styles";

import SupplierCRCModal from "./SupplierCRCModal";

import { fetchSupplierCRCs, fetchSuppliers } from "../../redux/actions/SupplierActions";
import Utils from "services/utils.js";
import Launch from "@material-ui/icons/Launch";

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



export default function SupplierCRCList(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)
  
  const supplierCRCList = useSelector(state => state.supplierCRCReducer.items);
  const fetchingSupplierCRCS = useSelector(state => state.suppliersReducer.fetchingSupplierCRCS)
  

  const [supplierCRCArray, setSupplierCRCArray] = useState([]);


  // -------------------------------
  //    DATA CLEANING MODE START
  // -------------------------------

  
  const [modal, setModal] = useState({
    open: false,
    id: null
  });

  // FILTERS
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  useEffect(() => {
    dispatch(fetchSupplierCRCs());
    dispatch(fetchSuppliers());

  }, []);

  useEffect(() => {
    if (supplierCRCList && supplierCRCList.length > 0 && suppliers && suppliers.length > 0 ) {
      onSearchSupplierCRCs()
    }
  }, [supplierCRCList, suppliers, selectedSuppliers]);

  const redirectToEditSupplierCRC = (id) => {
    props.history.push(`/admin/businesscrcscoring?id=${id}`);
  }

  const handleViewButtonClick = (id) => {
    setModal({
      open: true,
      id: id
    })
  }

  const editExternalButton = (id) => {
    return (<a target={"__blank"} title={"edit: " + id} href={`/admin/businesscrcscoring?id=${id}`}><Launch /></a>)
  }

  const editButton = (id) => {
    return (
      <Button
        title={"Edit: " + id}
        simple
        color="success"
        value={id}
        className={classes.customButton}
        onClick={(e) => redirectToEditSupplierCRC(e.currentTarget.value)}
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

  const onSearchSupplierCRCs = () => {
    const filteredSupplierCRCsArray = []

    supplierCRCList.map(item => {

      // Filter by strategic partner
      if (selectedSuppliers.length > 0) {
        if (!selectedSuppliers.includes(item.supplier)) {
          return // skip
        }
      }

      item['supplier_name'] = (suppliers) ? (props => {
        const supplier = suppliers.find((item) => {
          return item.id === props;
        });
        return (supplier? supplier.name : '-');
        
      })(item.supplier) : "-";

      const crcDataSummaryMap = Utils.generateCrCAveragesMap([{...item, supplier_id: item.supplier}]);
      let crcDataSummary = crcDataSummaryMap.get(item.supplier);


      item['crc_quality_avg'] = (crcDataSummary && crcDataSummary.quality_avg) ? new Number(crcDataSummary.quality_avg).toFixed(2) : "-";
      item['crc_timeliness_avg'] = (crcDataSummary && crcDataSummary.timeliness_avg) ? new Number(crcDataSummary.timeliness_avg).toFixed(2) : "-";
      item['crc_openness_avg'] = (crcDataSummary && crcDataSummary.openness_avg) ? new Number(crcDataSummary.openness_avg).toFixed(2) : "-";

      item['edit'] = editButton(item.id)
      item['view'] = viewButton(item.id)
      item['editExternal'] = editExternalButton(item.id);

      filteredSupplierCRCsArray.push(item)
    });
    setSupplierCRCArray(filteredSupplierCRCsArray)
  }

  return (!supplierCRCList || ! suppliers) ? (<div>Loading...</div>) : (
      <GridContainer>
        <SupplierCRCModal key={Utils.giveMeGuid()} open={modal.open} value={modal.id} onClose={() => setModal({ ...modal, open: false })} />
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
                <h4>Search Results (Found: {(supplierCRCArray !== undefined &&
                  supplierCRCArray.length !== undefined) ? supplierCRCArray.length : 0})
              </h4>
              </GridItem>
            </GridContainer>
          </CardHeader>
          <Card style={{ marginTop: 0 }}>
            <CardBody>
              <ReactTable PaginationComponent={Pagination}
                defaultFilterMethod={(filter, row) => Utils.findStringInObjectFields([row._original], filter.value, [filter.id]).length > 0}
                filterable={true}

                data={supplierCRCArray}
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
                    Header: "Supplier",
                    accessor: "supplier_name",
                    width: 180,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                  },
                  {
                    Header: "Quality Comments",
                    accessor: "response_quality_comments",
                    width: 180,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                  },
                  {
                    Header: "Timeliness Comments",
                    accessor: "response_timeliness_comments",
                    width: 180,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                  },
                  {
                    Header: "Openness Comments",
                    accessor: "response_openness_comments",
                    width: 180,
                    Cell: props => (
                      <HtmlTooltip title={props.value} interactive>
                      <div className="cell-overflow">
                        {Utils.shortenString(props.value, 80)}
                      </div>
                    </HtmlTooltip>)
                  },
                  {
                    Header: 'Quality',
                    sortable: true,
                    filtearble: true,
                    accessor: 'crc_quality_avg',
                    width: 100  
                  },
                  {
                    Header: 'Timeliness',
                    sortable: true,
                    filtearble: true,
                    accessor: 'crc_timeliness_avg',
                    width: 100
                  },
                  {
                    Header: 'Openness',
                    sortable: true,
                    filtearble: true,
                    accessor: 'crc_openness_avg',
                    width: 100
                  },
                  {
                    Header: "",
                    sortable: false,
                    filtearble: false,
                    accessor: "view",
                    width: 40,
                  }, {
                    Header: "",
                    sortable: false,
                    filtearble: false,
                    accessor: "edit",
                    width: 40,
                  }, {
                    Header: "",
                    sortable: false,
                    accessor: "editExternal",
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
                loading={fetchingSupplierCRCS || fetchingSuppliers}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
       
      </GridContainer>
    );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GridContainer from "components/Grid/GridContainer.js";

import GridItem from "components/Grid/GridItem.js";

// core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Button from "components/CustomButtons/Button.js";
import CloseIcon from '@material-ui/icons/Close';

import QualityOfResponseForm from "./crc/QualityOfResponseForm.js";
import TimelinessOfResponseForm from "./crc/TimelinessOfResponseForm.js";
import OpennessToReformForm from "./crc/OpennessToReformForm.js";
import Utils from "../../services/utils";

const customStyles = {
  paper: {
    backgroundColor: 'white',
    padding: 30,
    webkitBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    mozBoxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
    boxShadow: '5px 6px 10px 0px rgba(0,0,0,0.27)',
  },
  modal: {
    display: 'block',
    maxWidth: '80%',
    height: '100%',
    overflowWrap: "break-word",
    overflowY: "auto;",
    overflowX: "none;",
    paddingBottom: "20px"
  },
  spanLabel: {
    fontWeight: 500,
  },
  button: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    top: '40px',
    right: '40px',
    scrollbars: "none"
  }
};

const useStyles = makeStyles(customStyles);

/*

Table: supplier_crc_responses
Columns:
id int(11) AI PK 
created_at date 
avg_worker_response_feedback int(11) 
avg_worker_recruitment_mngmt_feedback int(11) 
issara_tech_assessment_response_quality_hr int(11) 
issara_tech_assessment_response_quality_production int(11) 
issara_tech_assessment_response_quality_sr_mngmt int(11) 
site_cooperation_with_ethicall_distribution int(11) 
business_attitude_toward_suggested_remedies int(11) 
business_attitude_toward_capacity_and_risks int(11) 
business_attitude_toward_promoting_worker_voice int(11) 
business_attitude_toward_worker_treatment int(11) 
business_attitude_toward_issara int(11) 
duration_of_time_taken_to_respond int(11) 
duration_of_time_taken_to_revert_on_action_plan int(11) 
duration_of_time_taken_to_resolve_issues int(11) 
response_quality_comments longtext 
response_openness_comments longtext 
response_timeliness_comments longtext 
supplier_id int(11)
*/

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



export default function SupplierCRCModal(props) {
  const classes = useStyles();



  const [selectedShowGroup, setSelectedShowGroup] = useState(0)

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const supplierCRCList = useSelector(state => state.supplierCRCReducer.items);

  const getSupplier = (id) => {
    return suppliers.find(supplier => {
      return supplier.id === parseInt(id)
    })
  }

  const getSupplierCRC = (id) => {
    return supplierCRCList.find(supplierCrc => {
      return supplierCrc.id === parseInt(id)
    })
  }

  const tabSelect = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  

  let supplierCRC = getSupplierCRC(props.value);
  if (!supplierCRC) {
    supplierCRC = {};
  }

  let supplier = getSupplier(supplierCRC.supplier);
  if (!supplier) {
    supplier = {};
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      className={classes.modal + ' modal'}
    >
      <div className={classes.paper}>
        <h3 style={{ marginTop: 0 }}> Supplier CRC: {supplierCRC && (<a target={"__blank"} href={`/admin/businesscrcscoring?id=${supplierCRC.id}`}>{supplierCRC.id}</a>) || '-'} </h3>
        <Button
          simple
          color="danger"
          className={classes.button}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </Button>
        <GridContainer>
          <GridItem>
            <br />
          </GridItem>

          <GridContainer>

            <GridItem xs={12} sm={12} lg={12}>
              <h4> General: </h4>
              <p> <span className={classes.spanLabel}> Supplier: </span> {supplier && supplier.name || '-'} </p>
              <p> <span className={classes.spanLabel}> created_at: </span> {supplierCRC && supplierCRC.created_at || '-'} </p>
            </GridItem>

          </GridContainer>

          <GridContainer>

            <Card>
              <CardHeader>
                <AppBar style={{ backgroundColor: "#9c27b0" }} position="static">
                  <Tabs variant={"scrollable"} value={selectedShowGroup} onChange={(event, newValue) => {
                    setSelectedShowGroup(newValue);
                  }} aria-label="CRC Score Categories">
                    <Tab label="Quality Of Response" {...tabSelect(0)} />
                    <Tab label="Timeliness Of Response" {...tabSelect(1)} />
                    <Tab label="Openness To Reform" {...tabSelect(2)} />
                  </Tabs>
                </AppBar>
              </CardHeader>
              <CardBody>
                <TabPanel value={selectedShowGroup} index={0}>
                  <QualityOfResponseForm globalEditData={supplierCRC} readOnly={true} />
                </TabPanel>
                <TabPanel value={selectedShowGroup} index={1}>
                  <TimelinessOfResponseForm globalEditData={supplierCRC} readOnly={true} />
                </TabPanel>
                <TabPanel value={selectedShowGroup} index={2}>
                  <OpennessToReformForm globalEditData={supplierCRC} readOnly={true} />
                </TabPanel>

              </CardBody>
            </Card>

          </GridContainer>

        </GridContainer>
      </div>
    </Modal>
  );
}

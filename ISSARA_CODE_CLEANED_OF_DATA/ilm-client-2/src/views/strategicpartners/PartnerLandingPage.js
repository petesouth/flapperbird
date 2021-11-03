import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ReactTable from "react-table-6";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import SupplyChainFilter from "components/ilmdb/SupplyChainFilter.js";
import GridItem from "components/Grid/GridItem.js";
import Datetime from "react-datetime";

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import CircularProgress from '@material-ui/core/CircularProgress';
import HomeIcon from '@material-ui/icons/Home';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import utils from "services/utils";
import Box from '@material-ui/core/Box';
import Check from "@material-ui/icons/Check";
import Checkbox from "@material-ui/core/Checkbox";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import withStyles from "@material-ui/core/styles/withStyles";
import Timeline from "components/Timeline/Timeline.js";

import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import ReactExport from "react-export-excel";
import GoogleMapReact from 'google-map-react';

import loginStore from "../../redux/stores/LoginStore";

import { fetchSuppliers } from "../../redux/actions/SupplierActions";
import { fetchStrategicPartners, fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";
import { fetchCountries } from "../../redux/actions/LocaleActions";
import Utils from "../../services/utils";
import NewsUpdateList from "./NewsUpdateList";
import PartnerMessageBoardList from "./PartnerMessageBoardList";
import SharedFileList from "./SharedFileList";

import Tooltip from '@material-ui/core/Tooltip';
import { FilterSharp, Map } from "@material-ui/icons";

import { fetchSharedFiles } from "../../redux/actions/StrategicPartnerActions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;



const customStyle = {
  ...styles,
  button: {
    padding: 0,
    margin: 0,
  },
  newInteractionGridItem: {
    // padding: '0 6px !important',
  },
  buttonBar: {
    marginLeft: '-15px !important'
  },
  gallery: {
    height: "100%",
    width: "100%",
    position: "relative"
  },

  galleryImg: {
    /* CSS Hack will make it width 100% and height 100% */
    position: "absolute",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    /* Maintain aspect ratio */
    maxHeight: "100%",
    maxWidth: "100%"
  },
  galleryContainer: {
    width: "40px",
    height: "40px"
  },
  galleryContainerBigger: {
    width: "100px",
    height: "100px"
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

const AnyReactComponent = ({ text }) => (<div>
  <HtmlTooltip title={text} interactive>
    <AccountCircleIcon style={{ fontSize: "18px", color: "red" }} />
  </HtmlTooltip></div>);



function SuppliersMapPanel(props) {
  const classes = useStyles();
  const suppliers = (props.suppliers) ? props.suppliers : [];
  const suppliersMap = (props.suppliersMap) ? props.suppliersMap : {};

  const fullSuppliers = [];


  const defaultProps = {
    center: {
      lng: 100.5018,
      lat: 13.7563
    },
    zoom: 7
  };

  suppliers.forEach((supplier) => {
    let supplierObj = suppliersMap[supplier];
    if (supplierObj.lng && supplierObj.lat &&
      Utils.isNumeric(supplierObj.lng) && Utils.isNumeric(supplierObj.lat)) {
      fullSuppliers.push(supplierObj);
    }
  })

  return (<div style={{ height: props.height, width: '100%' }}>
    <GoogleMapReact bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY }} defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}>

      {fullSuppliers.map((item) => {
        let textStr = (<div>{item.name}
          <br />
          {(item.total_num_workers) ? (<div><br />{"" + item.total_num_workers + " total workers"}</div>) : (null)}
          {(item.total_num_thai_workers) ? (<div><br />{"" + item.total_num_thai_workers + " Thai workers"}</div>) : (null)}
          {(item.total_num_cambodian_workers) ? (<div><br />{"" + item.total_num_cambodian_workers + " Cambodian workers"}</div>) : (null)}
          {(item.total_num_myanmar_workers) ? (<div><br />{"" + item.total_num_myanmar_workers + " Myanmar workers"}</div>) : (null)}
          {(item.total_num_lao_workers) ? (<div><br />{"" + item.total_num_lao_workers + " Lao workers"}</div>) : (null)}
          {(item.total_num_vietnamese_workers) ? (<div><br />{"" + item.total_num_vietnamese_workers + " Vietanmese workers"}</div>) : (null)}
        </div>);

        return (<AnyReactComponent
          key={Utils.giveMeGuid()}
          lat={item.lat}
          lng={item.lng}
          text={textStr}
        />);

      })}
    </GoogleMapReact>

  </div>);

}



export default function PartnerLandingPage(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const WALMART_SUPPLY_CHAIN_ID = 13;

  const supplyChains = useSelector(state => state.supplyChainReducer.items)
  const supplyChainsMap = useSelector(state => state.supplyChainReducer.itemsMap)

  const suppliers = useSelector(state => state.suppliersReducer.items)
  const fetchingSuppliers = useSelector(state => state.suppliersReducer.fetchingSuppliers)
  const suppliersMap = useSelector(state => state.suppliersReducer.itemsMap);

  const strategicPartners = useSelector(state => state.strategicPartnerReducer.strategicPartners);
  const strategicPartnersMap = useSelector(state => state.strategicPartnerReducer.strategicPartnersMap);

  const sharedFiles = useSelector(state => state.sharedFilesReducer.sharedFiles);
  const sharedFilesMap = useSelector(state => state.sharedFilesReducer.sharedFilesMap);

  // FILTERS
  const [filters, setFilters] = useState({
    suppliers: null,
    supplyChain: null,
    startTime: null,
    endTime: null,
    industry: null,
    subindustry: null,
    disableSupplyChainSelect: false,
    partner: null,
    search: ""
  });



  const [modal, setModal] = useState({
    open: false,
    id: null,
    type: null
  });

  useEffect(() => {

    dispatch(fetchSharedFiles());
    dispatch(fetchSupplyChains());
    dispatch(fetchCountries());
    dispatch(fetchStrategicPartners());
    dispatch(fetchSuppliers()); // Done for child controls/modal



  }, []);


  useEffect(() => {

    if (strategicPartners && strategicPartners.forEach !== undefined && strategicPartners.length > 0 &&
      supplyChains && supplyChains.forEach !== undefined && supplyChains.length > 0) {
      let partnerData = Utils.findPartnerAndSupplyChain(loginStore.getLoginUser(), supplyChains, strategicPartners);


      setFilters({
        ...filters,
        partner: partnerData.partnerFound,
        disableSupplyChainSelect: (partnerData.foundSupplyChain !== null),
        supplyChain: partnerData.foundSupplyChain,
        suppliers: (partnerData.foundSupplyChain && partnerData.foundSupplyChain.suppliers) ? (() => {
          let array = [];
          partnerData.foundSupplyChain.suppliers.forEach((supplierId) => {
            array.push("" + supplierId);
          });
          return array;
        })() : null

      });
    }


  }, [suppliers, strategicPartners, supplyChains])


  // const accountgrid = (<div>
  //   <Timeline key={utils.giveMeGuid()} stories={[
  //     {
  //       badgeColor: "success",
  //       badgeIcon: HomeIcon,
  //       title: "Partner Joined",
  //       inverted: false,
  //       titleColor: "success",
  //       body: (
  //         <div>
  //           <p style={{ fontWeight: 500, margin: 0 }}>Partner Joined Issara</p>
  //           <p>Welcome to issara !!!</p>
  //         </div>
  //       ),
  //       footerTitle: (new Date()).toLocaleString()
  //     },
  //     {
  //       badgeColor: "success",
  //       badgeIcon: SupervisorAccountIcon,
  //       title: "Account Created",
  //       inverted: true,
  //       titleColor: "success",
  //       body: (
  //         <div>
  //           <p style={{ fontWeight: 500, margin: 0 }}>Account Created</p>
  //           <p>Login is now valid. Activation of Supply Chain Data.</p>
  //         </div>
  //       ),
  //       footerTitle: (new Date()).toLocaleString()
  //     }
  //   ]} />
  // </div>);


  if (suppliers === undefined || suppliers === null || suppliers.length < 1) {
    return (<GridContainer><CircularProgress /></GridContainer>);
  }


  return (
    <GridContainer>
      <div style={{ width: '100%', verticalAlign: "middle" }}>
        <Box component="span" display="block" p={1} m={1} bgcolor="background.paper">
          <GridContainer>
            <GridItem xs={1} md={1} lg={1}>
              <div className={classes.galleryContainer}>
                <div className={classes.gallery}>
                  <a target="__blank" href="https://www.issarainstitute.org">
                    <img className={classes.galleryImg} src="/static/media/issara_institute.png" />
                  </a>
                </div>
              </div>
            </GridItem>

            <GridItem xs={1} md={1} lg={1}>

              {(filters === null ||
                filters === undefined ||
                filters.supplyChain === null ||
                filters.supplyChain === undefined ||
                filters.supplyChain.strategic_partner === undefined
                || !strategicPartnersMap[filters.supplyChain.strategic_partner]) ? <div /> : (() => {

                  let partner = strategicPartnersMap[filters.supplyChain.strategic_partner]
                  let image = (sharedFilesMap[partner.imageicon]) ? sharedFilesMap[partner.imageicon] : "";

                  return (
                    <div className={classes.galleryContainerBigger}>
                      <div className={classes.gallery}>
                        <a target="__blank" href={(partner.website) ? partner.website : ""} >
                          <img className={classes.galleryImg} src={image.file_path} />
                        </a>
                      </div>
                    </div>

                  )
                })()}
            </GridItem>
          </GridContainer>
          <GridItem xs={12} md={12} lg={12}>
            <GridItem>
              <h4>WELCOME!</h4>
              <div>
                <p>
                  The Issara Institute launched the Strategic Partners Dashboard in 2021, building upon the feedback and aspirations of the Issara Institute team, Strategic Partners, and donors.
                </p>

                <p>
                  Objective: The objective of this Dashboard is to provide brands, retailers, and importers/agents with a robust tool to help monitor, benchmark, remediate, and improve labor issues, systems, and business performance in global supply chains.
                </p>
                <p>
                  Confidentiality: The information in the Dashboard is confidential to each Strategic Partner and is tailored to your own unique supply chain. All information provided via the Dashboard is governed by your company’s Strategic Partner agreement with Issara Institute. The information may not be shard externally, including with your suppliers.
                </p>

                <p>
                  Features: Issara will continue to advance features within the Dashboard, and we welcome your feedback and input to make the Dashboard as useful and impactful as possible. For example, benchmarking and trend analysis are slated for upcoming iterations. How this information may be integrated with your internal practices and protocols (current and planned), will also be part of discussions with each Strategic Partner as part of the revised Strategic Partners Program, launched in January 2021.
                </p>

                <p>
                  We are excited about the breadth of information, data analysis, and transparency that the Strategic Partners Dashboard can provide. We look forward to our ongoing collaboration with you to support ethical supply chains and improved working conditions. If you have any questions, please contact your Issara Institute Strategic Partner dashboard focal point, <a href="mailto: jarrett@issarainstitute.org">Jarrett Basedow</a>.
                </p>

              </div>

            </GridItem>
          </GridItem>
        </Box>
      </div>

      {((loginStore.isGlobalPartner() === false ||
        (loginStore.isGlobalPartner() === true && (filters.supplyChain === null || filters.supplyChain === undefined))) &&
        (suppliers === undefined || suppliers === null || suppliers.length < 1)) ? <div>Loading...</div> :
        (/* Im doing this so I can make it show later if I wanted too */ (filters.disableSupplyChainSelect === true) ? (null) : (<Card><CardBody>
          <SupplyChainFilter key={Utils.giveMeGuid()}
            supplyChainValue={filters.supplyChain}
            startTime={filters.startTime}
            endTime={filters.endTime}
            industry={filters.industry}
            subindustry={filters.subindustry}
            suppliers={filters.suppliers}
            disableSupplyChainSelect={filters.disableSupplyChainSelect}
            onUpdateSummary={(selectedData) => {
              let suppliersMap = selectedData.suppliersMap;
              setFilters({
                ...filters,
                startTime: selectedData.startTime,
                endTime: selectedData.endTime,
                industry: selectedData.industry,
                subindustry: selectedData.subindustry,
                supplyChain: supplyChainsMap[selectedData.supplyChain],
                suppliers: (() => {
                  let array = [];
                  for (const [key, value] of Object.entries(suppliersMap)) {
                    array.push(key);
                  }
                  return array;
                })()

              });
            }} /></CardBody>
        </Card>))}


      <GridContainer>
        {(filters === null ||
                filters === undefined ||
                filters.supplyChain === null ||
                filters.supplyChain === undefined ||
                filters.supplyChain.strategic_partner === undefined
                || !strategicPartnersMap[filters.supplyChain.strategic_partner]) ? <div /> : (() => {

                  let partner = strategicPartnersMap[filters.supplyChain.strategic_partner];
                  return (<PartnerMessageBoardList key={Utils.giveMeGuid()}
                  partnerID={partner.id} />);
                })()}

        <NewsUpdateList key={Utils.giveMeGuid()}
           />

        
        <SharedFileList />
      </GridContainer>


      {!filters.suppliers || filters.suppliers.length < 1 || !suppliersMap || Object.keys(suppliersMap).length < 1 ? (null)
        : (<GridContainer>
          <SuppliersMapPanel height={"70vh"} width={"100%"} suppliers={filters.suppliers} suppliersMap={suppliersMap} />
        </GridContainer>)}

      <GridItem><br/></GridItem>

      <GridContainer>
        <div style={{ width: '100%', verticalAlign: "middle" }}>
          <Box component="span" display="block" p={1} m={1} bgcolor="background.paper">
            <GridItem xs={12} md={12} lg={12}>
              <h4>Legal Disclaimer</h4>
              <p>
                While we have made our best efforts to ensure the accuracy and reliability of the information collected and contained in this dashboard,
                Issara Institute is not responsible for any errors or omissions, or for the results obtained from the use of this information.
              </p>
              <p>
                All information in this dashboard is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results
                obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties
                of performance, merchantability and fitness for a particular purpose. Nothing herein shall to any extent substitute for the independent
                investigation and the sound technical and business judgment of the reader.
              </p>
              <p>
                Any views, opinions and guidance set out in this dashboard are provided for information purposes only, and do not purport to be
                legal and/or professional advice or a definitive interpretation of any law. In no event will Issara Institute or its employees be liable
                to you or anyone else for any decision made or action taken in reliance on the information in this report or for any consequential,
                special or similar damages, even if advised of the possibility of such damages. The information contained in this dashboard is intended solely to provide general guidance on matters of interest for the use of the reader, who accepts full responsibility for its use.
              </p>
            </GridItem>



          </Box>

        </div>
      </GridContainer>



    </GridContainer>
  );
}
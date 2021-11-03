import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import utils from '../../services/utils';

import Datetime from "react-datetime";
// core components
import { makeStyles } from "@material-ui/core/styles";

import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import SupplyChainDropdown from "./SupplyChainDropdown";
import IndustriesSubIndustriesDropdown from "./IndustriesSubIndustriesDropdown";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Checkbox from "@material-ui/core/Checkbox"
import Check from "@material-ui/icons/Check";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import SearchIcon from '@material-ui/icons/Search';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import moment from "moment";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";


const customStyles = {
  ...styles,
  ...customCheckboxRadioSwitch
};


const useStyles = makeStyles(customStyles);

export default function SupplyChainFilter(props) {
  const classes = useStyles();

  const propOnUpdateSummary = props.onUpdateSummary;
  const minStartTime = (props.minStartTime) ? props.minStartTime : moment('2019-01-01');
  const maxEndTime = props.maxEndTime;

  const countries = useSelector(state => state.countriesReducer.items)
  const strategicPartners = useSelector(state => state.strategicPartnerReducer.items)

  const supplyChains = useSelector(state => state.supplyChainReducer.items);
  const suppliersMap = useSelector(state => state.suppliersReducer.suppliers_items_map);
  const [showList, setShowList] = useState(false);


  const [selectedData, setSelectedData] = useState({
    supplyChain: (props.supplyChainValue) ? props.supplyChainValue.id : null,
    industry: (props.industry) ? props.industry : null,
    subindustry: (props.subindustry) ? props.subindustry : null,
    endTime: (props.endTime) ? props.endTime : moment(),
    specialilzedEndTimeLabel: (props.specialilzedEndTimeLabel) ? props.specialilzedEndTimeLabel : null,
    startTime: (props.startTime) ? props.startTime : minStartTime,
    suppliersMap: (props.suppliers && props.suppliers.forEach !== undefined) ? (() => {
      let newSuppliersMap = {};
      props.suppliers.forEach((supplierId) => {
        newSuppliersMap["" + supplierId] = suppliersMap[supplierId];
      });
      return newSuppliersMap;
    })() : {}
  });

  const getStrategicPartner = (id) => {
    return strategicPartners.find(strategicPartner => {
      return strategicPartner.id === parseInt(id)
    })
  }


  const currenctSelectedSupplyChainSuppliers = (tSupplyChain, industry, subindustry) => {
    let newSuppliersMap = {};

    let supplyChain = supplyChains.find(supplyChain => {
      return supplyChain.id === parseInt(tSupplyChain)
    })

    if (supplyChain !== undefined && supplyChain !== null && supplyChain.suppliers && supplyChain.suppliers.length > 0) {
      supplyChain.suppliers.map((supplierId) => {

        if ((industry === null || industry === undefined || suppliersMap[supplierId].industry === industry) &&
          (subindustry === null || subindustry === undefined || suppliersMap[supplierId].subindustry === subindustry)) {
          newSuppliersMap[supplierId] = suppliersMap[supplierId];
        }

      });
    }
    return newSuppliersMap;
  }

  const getSupplyChain = (id) => {
    return supplyChains.find(supplyChain => {
      return supplyChain.id === parseInt(id)
    })
  }

  const getCountryName = (id) => {
    const country = countries.find((country) => {
      return country.id === id
    });
    return country ? country.name : '-'
  }


  const selectAll = () => {
    setSelectedData({
      ...selectedData,
      suppliersMap: currenctSelectedSupplyChainSuppliers(selectedData.supplyChain)
    })
  }

  const deselectAll = () => {

    setSelectedData({
      ...selectedData,
      suppliersMap: {}
    })

  }

  useEffect(() => {


    if (!props.suppliers && selectedData.supplyChain) {
      let newSelectedData = {
        ...selectedData,
        suppliersMap: currenctSelectedSupplyChainSuppliers(selectedData.supplyChain)
      };

      setSelectedData(newSelectedData);

    } else {
      // selectAll();
    }


  }, []);

  let supplyChain = getSupplyChain(selectedData.supplyChain);
  let strategicPartner = getStrategicPartner((supplyChain) ? supplyChain.strategic_partner : 0);
  let supplyChainSuppliersCount = (() => {
    let found = 0
    if (supplyChain && supplyChain.suppliers !== null && supplyChain.suppliers.length > 0) {
      supplyChain.suppliers.map((supplierId) => {

        if ((selectedData.industry === null || suppliersMap[supplierId].industry === selectedData.industry) &&
          (selectedData.subindustry === null || suppliersMap[supplierId].subindustry === selectedData.subindustry)) {
          found += 1;
        }

      })
    }

    return found;
  })();

  if (supplyChain === undefined || supplyChain === null) {
    supplyChain = {};
  }

  if (strategicPartner === undefined || strategicPartner === null) {
    strategicPartner = {};
  }



  return (
    <Card>
      <CardBody>
        <GridContainer>

          <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridItem>
              <SupplyChainDropdown disableSupplyChainSelect={props.disableSupplyChainSelect} value={selectedData.supplyChain} onSelect={(tSupplyChain) => {
                let newSelectedData = {
                  ...selectedData,
                  industry: null,
                  subindustry: null,
                  supplyChain: tSupplyChain,
                  suppliersMap: currenctSelectedSupplyChainSuppliers(tSupplyChain)
                };

                setSelectedData(newSelectedData);

                if (propOnUpdateSummary !== null && propOnUpdateSummary !== undefined) {
                  propOnUpdateSummary(newSelectedData);
                }

              }} />

            </GridItem>
          </GridItem>


          <GridItem xs={12} sm={12} md={6} lg={6}>
            <GridItem>
              <InputLabel className={classes.selectLabel}>Start</InputLabel>
              <FormControl fullWidth>
                <Datetime
                  value={selectedData.startTime}
                  timeFormat={false}
                  inputProps={{ placeholder: "Start" }}
                  onChange={date =>{
                    if(minStartTime && minStartTime > date) {
                      date = minStartTime;
                    }
                    return (typeof date === 'object') ? setSelectedData({ ...selectedData, startTime: date }) : setSelectedData({ ...selectedData, startTime: null })
                    
                  } }closeOnSelect={true}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <InputLabel className={classes.selectLabel}>End {(selectedData.specialilzedEndTimeLabel) ? (selectedData.specialilzedEndTimeLabel) : (null)}</InputLabel>
              <FormControl fullWidth>
                <Datetime
                  value={selectedData.endTime}
                  timeFormat={false}
                  inputProps={{ placeholder: "End" }}
                  onChange={date =>{
                    if(maxEndTime && maxEndTime < date) {
                      date = maxEndTime;
                    }
                    return (typeof date === 'object') ? setSelectedData({ ...selectedData, endTime: date }) : setSelectedData({ ...selectedData, endTime: null })
                    
                  } }
                  closeOnSelect={true}
                />
              </FormControl>
            </GridItem>
          </GridItem>

          <GridItem xs={12} sm={12} md={6} lg={6}>


            <IndustriesSubIndustriesDropdown key={utils.giveMeGuid()} industry_values={selectedData.industry} subindustry_values={selectedData.subindustry} onSelect={(e) => {
              setSelectedData({
                ...selectedData,
                industry: e.industry_id,
                subindustry: e.subindustry_id,
                suppliersMap: currenctSelectedSupplyChainSuppliers(selectedData.supplyChain, e.industry_id, e.subindustry_id)
              });
            }} />

          </GridItem>

          <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridItem>
              <Button color={"info"} onClick={() => {
                if (propOnUpdateSummary !== null && propOnUpdateSummary !== undefined) {
                  propOnUpdateSummary({ ...selectedData });
                }

              }}>Search&nbsp;<SearchIcon /></Button>
            </GridItem>
          </GridItem>

          <GridItem xs={12} sm={12} md={12} lg={12}>


            <Card>
              <CardHeader>{(selectedData.supplyChain) ? (
                <GridItem>
                  <GridContainer>
                    {(showList === false) ? (<a style={{ cursor: "pointer" }} onClick={() => {
                      setShowList(true);
                    }}><ExpandMoreIcon style={{ paddingTop: "4px" }} />&nbsp;Suppliers&nbsp;({supplyChainSuppliersCount})</a>
                    ) : (<a style={{ cursor: "pointer" }} onClick={() => {
                      setShowList(false);
                    }}><ExpandLessIcon />&nbsp;Suppliers&nbsp;({supplyChainSuppliersCount})</a>
                    )}
                  </GridContainer>
                </GridItem>
              ) : (<GridContainer></GridContainer>)}</CardHeader>

              {(selectedData.supplyChain === null) ? (<GridContainer>

                <CardBody><h4>No Supply Chain Selected</h4></CardBody>
              </GridContainer>) : (null)}


              {(showList === false || selectedData.supplyChain === null && selectedData.supplyChain === undefined) ? (null) : (suppliersMap && supplyChain && supplyChain.suppliers && supplyChain.suppliers.length && (<div>

                <CardBody>

                  <GridContainer>
                    <GridItem xs={2} md={2} lg={2}>
                      <a style={{ cursor: "pointer" }} onClick={() => { selectAll(); }}>Select All</a>
                    </GridItem>
                    <GridItem xs={2} md={2} lg={2}>
                      <a style={{ cursor: "pointer" }} onClick={() => { deselectAll(); }}>Un-select All</a>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    {(supplyChainSuppliersCount > 0 && supplyChain.suppliers !== null && supplyChain.suppliers.length > 0) ? (() => {
                      return supplyChain.suppliers.sort((a, b) => {
                        return suppliersMap[a].name.localeCompare(suppliersMap[b].name);
                      });
                    })().map((supplierId) => {

                      return (<GridItem key={utils.giveMeGuid()} className={classes.gridItem} xs={12} sm={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              style={{ paddingRight: "20px" }}
                              checked={(selectedData.suppliersMap[supplierId] !== undefined)}
                              onClick={() => {
                                let newSelectedData = { ...selectedData };

                                if (newSelectedData.suppliersMap[supplierId] === undefined || newSelectedData.suppliersMap[supplierId] === null) {
                                  newSelectedData.suppliersMap[supplierId] = suppliersMap[supplierId];
                                } else {
                                  delete newSelectedData.suppliersMap[supplierId];
                                }
                                setSelectedData(newSelectedData);

                              }}
                              checkedIcon={<Check className={classes.checkedIcon} />}
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{
                                checked: classes.checked,
                                root: classes.checkRoot
                              }}
                            />
                          }
                          classes={{
                            label: classes.label + ' ' + classes.customLabel,
                            root: classes.labelRoot
                          }}
                          label={suppliersMap[supplierId].name}
                        />
                      </GridItem>);


                    }) : (<Card><CardHeader><h4>No Suppliers Exist Under these Search Parameters</h4></CardHeader></Card>)}
                  </GridContainer>



                </CardBody>

              </div>
              ))}

            </Card>

          </GridItem>

        </GridContainer>
      </CardBody>
    </Card>
  );
}

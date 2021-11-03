import React from "react";
// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

import config from '../ilm-config.json'

// Wrapper around axios. Since Axios sends different structured responses
// for error and success, we're sending our own json for both cases in the
// response.data property. This service can swallow the actual response object
// and send only the data we care about to the corresponding action.

class Utils {

  constructor() {

  }

  arrayToObject = (array) => {
    return array.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {});

  }


  formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  /* 
     Doing this to save time writing the API.. But at same time...
     I will remove this hack.. but... I want this to be an easy grep/text find
    when I remove it.
  */
  getSupplierKpiStatusFromId = (id) => {
    let status = "N/A";
    if (id === 1) {
      status = "No Progress";
    } else if (id === 2) {
      status = "Some Progress";
    } else if (id === 3) {
      status = "Closed";
    } else if (id === 4) {
      status = "Old, unresolved case";
    }
    return status;
  }

  shortenString = (stringToShorten, shorterLength) => {
    if (shorterLength < 1 || stringToShorten === undefined || stringToShorten === "" || stringToShorten === null || stringToShorten.length < shorterLength) {
      return stringToShorten;
    }

    let returnVal = stringToShorten.substr(0, shorterLength - 1);
    if (stringToShorten.length > shorterLength) {
      returnVal += "...";
    }

    return returnVal;
  }


  removeNulls = (object) => {
    let noNullsMe = {};
    if (object) {
      Object.keys(object).forEach((key) => {
        if (object[key] !== undefined && object[key] !== null) {
          noNullsMe[key] = object[key];
        }
      });
    }

    return noNullsMe;
  };

  yyyymm = (theDateStr) => {
    if (!theDateStr || theDateStr === "") {
      return theDateStr;
    }
    var theDate = new Date(theDateStr);
    var mm = theDate.getMonth() + 1; // getMonth() is zero-based

    return [theDate.getFullYear(),
    (mm > 9 ? '' : '0') + mm
    ].join('-');
  };


  yyyymmdd = (theDateStr) => {
    if (!theDateStr || theDateStr === "") {
      return theDateStr;
    }
    var theDate = new Date(theDateStr);
    var mm = theDate.getMonth() + 1; // getMonth() is zero-based
    var dd = theDate.getDate();

    return [theDate.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
  };


  giveMeGuid = () => {
    var self = {};
    var lut = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
    self.generate = function () {
      var d0 = Math.random() * 0xffffffff | 0;
      var d1 = Math.random() * 0xffffffff | 0;
      var d2 = Math.random() * 0xffffffff | 0;
      var d3 = Math.random() * 0xffffffff | 0;
      return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }
    return self.generate();
  }

  findStringInObjectFields = (list, search, keys) => {
    let returnList = [];

    if (list !== undefined && list !== null) {
      list.forEach((item) => {

        for (let i = 0; i < keys.length; ++i) {
          let key = keys[i];

          let value = (item[key]) ? ((Array.isArray(item[key])) ? item[key].toString() : "" + item[key]) : "";


          if (value.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
            returnList.push(item);
            break;
          }

        }
      });
    }

    return returnList;
  }

  composeSlackBugMessage = (err, payload) => {
    const details = err.response.status === 500 ? 'Please see the details above from Python Logger' : JSON.stringify(err.response.data)

    const slackMessage = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "-----------------------------------------------------------\nYou have a new bug :beers:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Status Code:*\n${err.response.status}\n\n*Message:*\n${err.message}\n\n*Details:*\n${details}\n\n*Payload:*\n${payload ? JSON.stringify(payload) : '-'}`
          }
        },
      ]
    }
    return JSON.stringify(slackMessage);
  }

  generateClientErrorAlert = (version) => {
    return (
      <SweetAlert
        info
        onConfirm={() => window.location.reload()}
        title="Client version expired"
      >
        <p> {`You are using version ${config.client_version}, new version is available ${version}`} </p>
        <p> Please press ok to update the client. Thank you :) </p>
      </SweetAlert>
    )
  }

  arrayIdsToSqlParamString = (ids) => {
    if (!ids || !ids.length || ids.length < 1) {
      return "";
    }

    return ("(") + ("" + ids) + (")");
  }

  isEmpty = (value) => {
    return (value === undefined ||
      value === null ||
      (value.length !== undefined && value.length < 1) ||
      (value.length === undefined && Object.keys(value).length < 1));
  }

  isEmptyField = (value) => {
    return (value === undefined ||
      value === null ||
      (value.length !== undefined && value.length < 1));
  }

  stringOrEmpty = (value) => {
    return (this.isEmpty(value) === true) ? "" : value;
  }

  isNumeric = (input) => {
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
  }

  findPartnerAndSupplyChain = (user, tsupplyChains, tstrategicPartners) => {

    if (tsupplyChains && tsupplyChains.forEach !== undefined && tsupplyChains.length > 0) {
      let partnerFound = tstrategicPartners.find(partner => {
        return partner.id === user.partner
      });

      let foundSupplyChain = (!partnerFound) ? null : tsupplyChains.find(supplyChain => {
        return supplyChain.strategic_partner === partnerFound.id;
      });

      return {
        foundSupplyChain,
        partnerFound
      }
    }
  }

  turnDateIntoString = (date) => {
    if (Object.prototype.toString.call(date) === '[object String]') {
      return date;
    }

    if (Object.prototype.toString.call(date) === '[object Date]' && date.toLocaleDateString !== undefined) {
      return date.toLocaleDateString();
    }

    return "" + date;

  }

  generateCrCAveragesMap = (crcData) => {

    let supplierCRCAveragesMap = new Map();

    if (crcData && crcData.length !== undefined && crcData.length > 0) {
      // This looks strange... Im insuring it's only the first element.. Not all of them.
      // Thinknig they just want the average of the most recent one.  We used to average all
      // the CRC for a score over time.. BUt I think they actually just want the latest.
      // Ill Ask them if they want me to chart it over time.
      crcData.forEach((crcDataItem) => {
        if (supplierCRCAveragesMap.has(crcDataItem.supplier_id) === false) {
          supplierCRCAveragesMap.set(crcDataItem.supplier_id, {
            quality_avg: 0,
            timeliness_avg: 0,
            openness_avg: 0,
            supplier_crc_scores: []
          });
        }

        let supplierCRCAverages = supplierCRCAveragesMap.get(crcDataItem.supplier_id);
        supplierCRCAverages.supplier_crc_scores.push(crcDataItem);
      
      });




      supplierCRCAveragesMap.forEach((supplierCRCAverages, key, map)=>{

        let quality_avg_total = 0;
        let quality_avg_count = 0;

        let timeliness_avg_total = 0;
        let timeliness_avg_count = 0;

        let openness_avg_total = 0;
        let openness_avg_count = 0;

        supplierCRCAverages.supplier_crc_scores.forEach((supplierCRCScore)=> {

          // Quality
          let quality_avg_val = (supplierCRCScore.avg_worker_response_feedback) ? supplierCRCScore.avg_worker_response_feedback : 0;
          let quality_avg_divide = (supplierCRCScore.avg_worker_response_feedback) ? 1 : 0;

          quality_avg_val += (supplierCRCScore.avg_worker_recruitment_mngmt_feedback) ? supplierCRCScore.avg_worker_recruitment_mngmt_feedback : 0;
          quality_avg_divide += (supplierCRCScore.avg_worker_recruitment_mngmt_feedback) ? 1 : 0;

          quality_avg_val += (supplierCRCScore.issara_tech_assessment_response_quality_hr) ? supplierCRCScore.issara_tech_assessment_response_quality_hr : 0;
          quality_avg_divide += (supplierCRCScore.issara_tech_assessment_response_quality_hr) ? 1 : 0;
          
          quality_avg_val += (supplierCRCScore.issara_tech_assessment_response_quality_production) ? supplierCRCScore.issara_tech_assessment_response_quality_production : 0;
          quality_avg_divide += (supplierCRCScore.issara_tech_assessment_response_quality_production) ? 1 : 0;
          
          quality_avg_val += (supplierCRCScore.issara_tech_assessment_response_quality_sr_mngmt) ? supplierCRCScore.issara_tech_assessment_response_quality_sr_mngmt : 0;
          quality_avg_divide += (supplierCRCScore.issara_tech_assessment_response_quality_sr_mngmt) ? 1 : 0;
          

          quality_avg_total += (quality_avg_divide > 0 ) ? quality_avg_val / quality_avg_divide : 0;
          quality_avg_count += (quality_avg_divide > 0 ) ? 1 : 0;
            
          
          // Timeliness
          let timeliness_avg_val = (supplierCRCScore.duration_of_time_taken_to_respond) ? supplierCRCScore.duration_of_time_taken_to_respond : 0;
          let timeliness_avg_divide = (supplierCRCScore.duration_of_time_taken_to_respond) ? 1 : 0;

          timeliness_avg_val += (supplierCRCScore.duration_of_time_taken_to_revert_on_action_plan) ? supplierCRCScore.duration_of_time_taken_to_revert_on_action_plan : 0;
          timeliness_avg_divide += (supplierCRCScore.duration_of_time_taken_to_revert_on_action_plan) ? 1 : 0;

          timeliness_avg_val += (supplierCRCScore.duration_of_time_taken_to_resolve_issues) ? supplierCRCScore.duration_of_time_taken_to_resolve_issues : 0;
          timeliness_avg_divide += (supplierCRCScore.duration_of_time_taken_to_resolve_issues) ? 1 : 0;
          
          timeliness_avg_total += (timeliness_avg_divide > 0 ) ? timeliness_avg_val / timeliness_avg_divide : 0;
          timeliness_avg_count += (timeliness_avg_divide > 0 ) ? 1 : 0;
          
         
          // Openness
          let openness_avg_val = (supplierCRCScore.site_cooperation_with_ethicall_distribution) ? supplierCRCScore.site_cooperation_with_ethicall_distribution : 0;
          let openness_avg_divide = (supplierCRCScore.site_cooperation_with_ethicall_distribution) ? 1 : 0;

          openness_avg_val += (supplierCRCScore.business_attitude_toward_suggested_remedies) ? supplierCRCScore.business_attitude_toward_suggested_remedies : 0;
          openness_avg_divide += (supplierCRCScore.business_attitude_toward_suggested_remedies) ? 1 : 0;

          openness_avg_val += (supplierCRCScore.business_attitude_toward_capacity_and_risks) ? supplierCRCScore.business_attitude_toward_capacity_and_risks : 0;
          openness_avg_divide += (supplierCRCScore.business_attitude_toward_capacity_and_risks) ? 1 : 0;
          
          openness_avg_val += (supplierCRCScore.business_attitude_toward_promoting_worker_voice) ? supplierCRCScore.business_attitude_toward_promoting_worker_voice : 0;
          openness_avg_divide += (supplierCRCScore.business_attitude_toward_promoting_worker_voice) ? 1 : 0;
          
          openness_avg_val += (supplierCRCScore.business_attitude_toward_worker_treatment) ? supplierCRCScore.business_attitude_toward_worker_treatment : 0;
          openness_avg_divide += (supplierCRCScore.business_attitude_toward_worker_treatment) ? 1 : 0;
          
          openness_avg_val += (supplierCRCScore.business_attitude_toward_issara) ? supplierCRCScore.business_attitude_toward_issara : 0;
          openness_avg_divide += (supplierCRCScore.business_attitude_toward_issara) ? 1 : 0;
          
          openness_avg_total += (openness_avg_divide > 0 ) ? openness_avg_val / openness_avg_divide : 0;
          openness_avg_count += (openness_avg_divide > 0 ) ? 1 : 0;
        
        });

        supplierCRCAverages.quality_avg = (quality_avg_count > 0 ) ? quality_avg_total / quality_avg_count : 0;
        supplierCRCAverages.timeliness_avg = (timeliness_avg_count > 0 ) ? timeliness_avg_total / timeliness_avg_count : 0;
        supplierCRCAverages.openness_avg = (openness_avg_count > 0 ) ? openness_avg_total / openness_avg_count : 0;

      });
    }

    return supplierCRCAveragesMap;

  }



}

const utils = new Utils();

export default utils;

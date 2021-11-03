import React from "react";
import { withParentSize } from '@vx/responsive';

import Utils from "../../services/utils";
import c3 from "c3";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components

const customStyles = {

    chart: {
        background: "#fff;",
        width: "90%;",
        margin: "1em auto;"
      }

};
const useStyles = makeStyles(customStyles);



function BarChart(props) {
  const classes = useStyles();
    
  const uid = Utils.giveMeGuid();

  

  React.useEffect(() => {
    c3.generate({
      bindto: "#chart" + uid,
      data: {
        columns: (props.columns) ? props.columns : [],
        type: "bar",
        groups: (props.groups) ? props.groups : [[]],
        colors: (props.colors) ? props.colors : {},
        withLegend: false,
        bar: {
          width: {
            ratio: 0.1
          }
        },

        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m'
            }
          }
        },
        

        types: (props.types) ? props.types : {},
  
        grid: {
          x: {
            show: true,
            tick: {
              fit: true,
              show: false,
              rotate: -75,
              multiline: false
            }
          },
          y: {
            show: true
          }
        },
  
        legend: {
          hide: true,
          position: 'bottom'
        },
  
        point: {
          show: false
        },
  
  
      },
     
    });
  }, []);
 

  return <div id={"chart" + uid} style={{width: "100%", height: "100%"}} />;

}

export default withParentSize(BarChart);

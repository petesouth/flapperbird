import React from "react";

import ReactSpeedometer from "react-d3-speedometer"


import { withParentSize } from '@vx/responsive';

//import Gauge from "react-d3";


// Note... c3 uses the exact same chart.. They just delegate to d3
// So if you try to use c3 instead.. it'll fail... Looking for d3 the exact version it uses.
// It's a rabit whole... So trust... d3 is the same control literally... and in c3
// this control is actually broken... So just use this... The reason it looks different
// were style settings only.  Exactly the same control.
//   segmentColors= ['#242424', '#3f7852', '#246C6C', '#ABD4D4', '#90bb9f','#03454D']
    
function SpeedometerStat(props) {
  return (<div>
    <ReactSpeedometer
    value={props.value? props.value : 0}
    valueFormat=".3"
    maxValue={5}
    segments={3}
    maxSegmentLabels={0}
    customSegmentStops={[0, 1, 2, 3, 4, 5]}
    height={180}
    width={150}
    forceRender={true}
    paddingVertical={14}
    valueTextFontSize="2rem"
    segmentColors={['red', 'pink', 'orange', 'yellow', 'green', '#005b4c']}
    needleColor="3C4858"
    textColor="3C4858"
    needleHeightRatio={0.6}
    ringWidth={20}
  />

 </div>)
};


export default withParentSize(SpeedometerStat);
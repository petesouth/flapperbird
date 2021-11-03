import React from "react";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import * as d3 from "d3";


const data = [
  {name: "Arbourfield International Co., Ltd", value: 244},
  {name: "Golden Sea Myanmar Co., Ltd", value: 395},
  {name: "International Focus General Services Co., Ltd", value: 435},
  {name: "Than Than Services Agency Co., Ltd", value: 87},
  {name: "Labour Asia Services Co., Ltd", value: 70},
  {name: "Yun Nadi Oo Co., Ltd", value: 200},
  {name: "Moe Moe Family General Services Co., Ltd", value: 102},
  {name: "Top Choice Manpower Co., Ltd", value: 246},
  {name: "Moe Man Services Co., Ltd", value: 94},
  {name: "Golden Myanmar Lighting Co., Ltd", value: 48},
  {name: "Limonia Co., Ltd", value: 47},
  {name: "Myanmar The Best One Manpower Group Co., Ltd", value: 84},
  {name: "Popular Land Services Co., Ltd", value: 44},
  {name: "Shwe Myanmar Aung General Services Co., Ltd", value: 14},
  {name: "O.T.A Golden Family Co., Ltd", value: 55}
]
data.sort((a,b) => b.value - a.value)


const Arc = ({ data, total, index, createArc, createLabelArc, colors, format, threshold }) => (
  <g key={index} className="arc">
    <path className="arc" d={createArc(data)} fill={colors(index)} stroke='white' />
    {parseInt(data.value/total*100) >= 2 &&
      <text
        transform={`translate(${createLabelArc(1.5).centroid(data)})`}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="white"
        fontSize="11"
        fontWeight="bold"
      >
        {format((data.value/total.toFixed(1)))}
      </text>
    }
    {parseInt(data.value/total*100) >= threshold &&
      <text
        transform={`translate(${createLabelArc(1.5).centroid(data)})`}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="white"
        fontSize="12"
        y={'1.2em'}
      >
        {parseInt(data.value)}
      </text>
    }
  </g>
);

const Pie = props => {

  const reducer = (accumulator, currentValue) => accumulator + currentValue
  const total = props.data.map(record => record.value).reduce(reducer, 0)

  const createPie = d3
    .pie()
    .value(d => d.value)
    .sort(null)

  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);

  const createLabelArc = (multiplier) => d3
    .arc()
    .innerRadius(props.innerRadius * multiplier)
    .outerRadius(props.outerRadius * multiplier);

  const colors = d3.scaleSequential(d3.interpolateRainbow).domain([0, props.data.length])
  // d3.scaleOrdinal(d3.schemeTableau10)
  const format = d3.format(".0%");
  const data = createPie(props.data);

  return (
    <GridContainer style={{justifyContent: 'center'}}>
      <GridItem>
        <svg width={props.width} height={props.height}>
          <g transform={`translate(${props.outerRadius} ${props.outerRadius})`}>
            {data.map((d, i) => (
              <Arc
                key={i}
                data={d}
                total={total}
                index={i}
                createArc={createArc}
                createLabelArc={createLabelArc}
                colors={colors}
                format={format}
                threshold={props.threshold}
              />
            ))}
          </g>
          <text
            x='50%'
            y={props.height-5}
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            fontSize="13"
            fontWeight="bold"
          >
            Total: {total}
          </text>
        </svg>
      </GridItem>
      <GridItem style={{marginLeft: '2em'}}>
        <svg height={(data.length + 1) * 20}>
          <g>
            {data.map((d, i) => (
              <g key={i}>
                <circle r="5" cx="12" cy={20*(i+1)} fill={colors(i)} />
                <text
                  x="30"
                  y={20*(i+1)+5}
                  fill="black"
                  fontSize="10"
                >
                  {props.data[i].name + " (" + props.data[i].value + ")" }
                </text>
              </g>
            ))}
          </g>
        </svg>
      </GridItem>
    </GridContainer>
  );
};

Pie.defaultProps = {
  width: 300,
  height: 320,
  innerRadius: 0,
  outerRadius: 150,
  threshold: 5,
  showLegend: true,
  data: data,
};

export default Pie;

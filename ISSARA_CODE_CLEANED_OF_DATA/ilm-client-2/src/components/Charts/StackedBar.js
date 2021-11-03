import React, { useState, useEffect, useRef } from "react";


import moment from 'moment'

import C3Chart from 'react-c3js';
import 'c3/c3.css';

import * as d3 from "d3";


const startTime = moment('2019-01-01')
const endTime = moment()

const datesArray = []
while (startTime.isBefore(endTime)) {
  datesArray.push(startTime.format('YYYY-MM-01'));
  startTime.add(1, 'months');
}




const groups = [
  "Moe Moe Family General Services Co., Ltd",
  "Yun Nadi Oo Co., Ltd",
  "Than Than Services Agency Co., Ltd",
  "Arbourfield International Co., Ltd",
  "Labour Asia Services Co., Ltd",
  "International Focus General Services Co., Ltd",
  "Shwe Myanmar Aung General Services Co., Ltd",
  "Limonia Co., Ltd",
  "Golden Sea Myanmar Co., Ltd",
  "Golden Myanmar Lighting Co., Ltd",
  "Top Choice Manpower Co., Ltd",
  "Myanmar The Best One Manpower Group Co., Ltd",
  "Moe Man Services Co., Ltd",
  "O.T.A Golden Family Co., Ltd",
  "Popular Land Services Co., Ltd"
]

const values = [
  ["Moe Moe Family General Services Co., Ltd", 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Yun Nadi Oo Co., Ltd", 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Than Than Services Agency Co., Ltd", 0, 0, 0, 0, 0, 0, 0, 0, 35, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Arbourfield International Co., Ltd", 0, 72, 0, 0, 98, 0, 0, 0, 0, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Labour Asia Services Co., Ltd", 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["International Focus General Services Co., Ltd", 0, 193, 0, 0, 192, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Shwe Myanmar Aung General Services Co., Ltd", 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Limonia Co., Ltd", 0, 0, 0, 0, 0, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Golden Sea Myanmar Co., Ltd", 0, 0, 0, 0, 0, 0, 0, 196, 199, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Golden Myanmar Lighting Co., Ltd", 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Top Choice Manpower Co., Ltd", 0, 0, 0, 0, 199, 0, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Myanmar The Best One Manpower Group Co., Ltd", 0, 0, 0, 0, 80, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Moe Man Services Co., Ltd", 0, 0, 0, 48, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["O.T.A Golden Family Co., Ltd", 0, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Popular Land Services Co., Ltd", 0, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const reducer = (accumulator, currentValue) => accumulator + currentValue
values.sort((a,b) => b.slice(1).reduce(reducer, 0) - a.slice(1).reduce(reducer, 0))



export default function StackedBar(props) {

  const colorsGenerator = d3.scaleSequential(d3.interpolateRainbow).domain([0, values.length])
  const [colors, setColors] = useState({})

  useEffect(() => {
    const colorsMap = {}
    values.map((value, id) => {
      colorsMap[value[0]] = colorsGenerator(id)
    })
    setColors(colorsMap)
  }, [])

  return (
    <div>
      <C3Chart
        data={{
          x: 'date',
          columns: [
            ['date', ...datesArray],
            ...values,
          ],
          type: 'bar',
          groups: [
            [...groups]
          ],
          colors: colors
        }}
        axis={{
          x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m',
                // rotate: -45,
            },
            height: 45
          }
        }}
        tooltip={{ show: false }}
      />
    </div>
  );
}

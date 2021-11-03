import React, { useState, useEffect } from "react";


import IndustriesDropdown from "./IndustriesDropdown.js";
import SubIndustriesDropdown from "./SubIndustriesDropdown.js";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";


export default function IndustriesSubIndustriesDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const valueEmpty = " ";

  const [industryId, setIndustryId] = useState((props.industry_values) ? props.industry_values : valueEmpty);

  const [subIndustryId, setSubIndustryId] = useState((props.subindustry_values) ? props.subindustry_values : valueEmpty);


  return (

    <div style={{ paddingTop: "4px"}}>
      <GridItem>
      <IndustriesDropdown value={industryId} onSelect={(e) => {
        console.log("Country Selected:", e);
        setIndustryId( e.target.value );
        setSubIndustryId(valueEmpty);
        
        propsOnSelect({
          ...e,
          industry_id:  (e.target.value !== valueEmpty ) ? e.target.value : null,
          subindustry_id: null
        });

      }} />
      </GridItem>
      <GridItem>
      <SubIndustriesDropdown
        industryId={industryId}
         value={subIndustryId}
        onSelect={(e) => {
          console.log("Province Selected:", e);
          setSubIndustryId(e.target.value);
          

          propsOnSelect({
            ...e,
            industry_id:  (industryId !== valueEmpty ) ? industryId : null,
            subindustry_id: (e.target.value !== valueEmpty ) ? e.target.value : null
          });

        }}
      />
      </GridItem>
      
    </div>
  );
}

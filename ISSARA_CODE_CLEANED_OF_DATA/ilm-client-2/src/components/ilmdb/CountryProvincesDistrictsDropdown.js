import React, { useState } from "react";




import CountriesDropdown from "./CountriesDropdown.js";
import ProvincesDropdown from "./ProvincesDropdown.js";
import DistrictsDropdown from "./DistrictsDropdown.js";



export default function CountryProvinceDistrictsDropdown(props) {
  const propsOnSelect = (props.onSelect) ? props.onSelect : (e) => { };


  const valueEmpty = " ";


  const [countryId, setCountryId] = useState((props.country_values) ? props.country_values.id : valueEmpty);

  const [provinceId, setProvinceId] = useState((props.province_values) ? props.province_values.id : valueEmpty);

  const [districtId, setDistrictId] = useState((props.district_values) ? props.district_values.id : valueEmpty);


  return (

    <div>
      <CountriesDropdown values={countryId} onSelect={(e) => {
        console.log("Country Selected:", e);
        setCountryId( e.target.value );
        setProvinceId(valueEmpty);
        setDistrictId(valueEmpty);

        propsOnSelect({
          ...e,
          country_id:  (e.target.value !== valueEmpty ) ? e.target.value : null,
          province_id: null,
          district_id: null
        });

      }} />
      <div className='mt-1' />
      <ProvincesDropdown
        countryId={countryId}
        values={provinceId}
        onSelect={(e) => {
          console.log("Province Selected:", e);
          setProvinceId(e.target.value);
          setDistrictId(valueEmpty);


          propsOnSelect({
            ...e,
            country_id:  (countryId !== valueEmpty ) ? countryId : null,
            province_id: (e.target.value !== valueEmpty ) ? e.target.value : null,
            district_id: null
          });

        }}
      />
      {!props.hideDistrict &&
        <>
          <div className='mt-1' />
          <DistrictsDropdown
            countryId={countryId}
            provinceId={provinceId}
            values={districtId}
            onSelect={(e) => {
              console.log("District Selected:", e);
              setDistrictId(e.target.value);

              propsOnSelect({
                ...e,
                country_id:  (countryId !== valueEmpty ) ? countryId : null,
                province_id: (provinceId !== valueEmpty ) ? provinceId : null,
                district_id: (e.target.value !== valueEmpty ) ? e.target.value : null
              });
            }}
          />
        </>
      }
    </div>
  );
}

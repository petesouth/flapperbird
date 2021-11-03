import HttpService from '../../services/HttpService';

export const REQUEST_COUNTRIES = 'REQUEST_COUNTRIES'
export const RECEIVE_COUNTRIES = 'RECEIVE_COUNTRIES'
export const REQUEST_PROVINCES = 'REQUEST_PROVINCES'
export const RECEIVE_PROVINCES = 'RECEIVE_PROVINCES'
export const REQUEST_DISTRICTS = 'REQUEST_DISTRICTS'
export const RECEIVE_DISTRICTS = 'RECEIVE_DISTRICTS'

export const REQUEST_NATIONALITIES = 'REQUEST_NATIONALITIES'
export const RECEIVE_NATIONALITIES = 'RECEIVE_NATIONALITIES'
export const REQUEST_ETHNICITIES = 'REQUEST_ETHNICITIES'
export const RECEIVE_ETHNICITIES = 'RECEIVE_ETHNICITIES'
export const REQUEST_CASE_STATUSES = 'REQUEST_CASE_STATUSES'
export const RECEIVE_CASE_STATUSES = 'RECEIVE_CASE_STATUSES'
export const REQUEST_CLIENT_STATUSES = 'REQUEST_CLIENT_STATUSES'
export const RECEIVE_CLIENT_STATUSES = 'RECEIVE_CLIENT_STATUSES'
export const REQUEST_CASE_CATEGORIES = 'REQUEST_CASE_CATEGORIES'
export const RECEIVE_CASE_CATEGORIES = 'RECEIVE_CASE_CATEGORIES'
export const REQUEST_CLIENT_TYPES = 'REQUEST_CLIENT_TYPES'
export const RECEIVE_CLIENT_TYPES = 'RECEIVE_CLIENT_TYPES'

export const REQUEST_REFERRAL_ACTIONS = 'REQUEST_REFERRAL_ACTIONS'
export const RECEIVE_REFERRAL_ACTIONS = 'RECEIVE_REFERRAL_ACTIONS'


export const REQUEST_RESPONSE_INTERACTION_TYPES = 'REQUEST_RESPONSE_INTERACTION_TYPES'
export const RECEIVE_RESPONSE_INTERACTION_TYPES = 'RECEIVE_RESPONSE_INTERACTION_TYPES'


export const REQUEST_KPI_LEGAL_VIOLATION_TYPES = 'REQUEST_KPI_LEGAL_VIOLATION_TYPES'
export const RECEIVE_KPI_LEGAL_VIOLATION_TYPES = 'RECEIVE_KPI_LEGAL_VIOLATION_TYPES'


export const REQUEST_INDUSTRIES = 'REQUEST_INDUSTRIES'
export const RECEIVE_INDUSTRIES = 'RECEIVE_INDUSTRIES'

export const REQUEST_SUBINDUSTRIES = 'REQUEST_SUBINDUSTRIES'
export const RECEIVE_SUBINDUSTRIES = 'RECEIVE_SUBINDUSTRIES'

export const REQUEST_MM_THAI_DEMAND_DATA = 'REQUEST_MM_THAI_DEMAND_DATA'
export const RECEIVE_MM_THAI_DEMAND_DATA = 'RECEIVE_MM_THAI_DEMAND_DATAS'

export const REQUEST_FACTORY_TYPES = 'REQUEST_FACTORY_TYPES'
export const RECEIVE_FACTORY_TYPES = 'RECEIVE_FACTORY_TYPES'


export const REQUEST_SUPPLIER_KPI_UPDATE_STATUSES = 'REQUEST_SUPPLIER_KPI_UPDATE_STATUSES'
export const RECEIVE_SUPPLIER_KPI_UPDATE_STATUSES = 'RECEIVE_SUPPLIER_KPI_UPDATE_STATUSES'



export const requestSupplierKpiUpdateStatuses = () => ({
  type: REQUEST_SUPPLIER_KPI_UPDATE_STATUSES
})

export const receiveSupplierKpiUpdateStatuses = (json) => ({
  type: RECEIVE_SUPPLIER_KPI_UPDATE_STATUSES,
  supplierkpiupdatestatuses: json,
  receivedAt: Date.now()
})

export const fetchSupplierUpdateStatuses = () => dispatch => {
  console.log('fetchSupplierUpdateStatuses dispatched')
  dispatch(requestSupplierKpiUpdateStatuses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/supplierkpiupdatestatuses/`,
    (resp) => {
      dispatch(receiveSupplierKpiUpdateStatuses(resp.results));
    },
    (err) => { console.log(err.message) });
}


export const requestMMThaiDemandData = () => ({
  type: REQUEST_MM_THAI_DEMAND_DATA
})

export const receiveMMThaiDemandData = (json) => ({
  type: RECEIVE_MM_THAI_DEMAND_DATA,
  mmthaidemanddata: json,
  receivedAt: Date.now()
})

export const fetchMMThaiDemandData = () => dispatch => {
  console.log('fetchMMThaiDemandData dispatched')
  dispatch(requestMMThaiDemandData())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/mmthaidemanddata/`,
    (resp) => {
      dispatch(receiveMMThaiDemandData(resp.results));
    },
    (err) => { console.log(err.message) });
}


export const requestFactoryTypes = () => ({
  type: REQUEST_FACTORY_TYPES
})

export const receiveFactoryTypes = (json) => ({
  type: RECEIVE_FACTORY_TYPES,
  factorytypes: json,
  receivedAt: Date.now()
})

export const fetchFactoryTypes = () => dispatch => {
  console.log('fetchFactoryTypes dispatched')
  dispatch(requestFactoryTypes())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/factorytypes/`,
    (resp) => {
      dispatch(receiveFactoryTypes(resp.results));
    },
    (err) => { console.log(err.message) });
}




export const requestSubIndustries = () => ({
  type: REQUEST_SUBINDUSTRIES
})

export const receiveSubIndustries = (json) => ({
  type: RECEIVE_SUBINDUSTRIES,
  subindustries: json,
  receivedAt: Date.now()
})

export const fetchSubIndustries = () => dispatch => {
  console.log('fetchSubIndustries dispatched')
  dispatch(requestSubIndustries())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/subindustries/`,
    (resp) => {
      dispatch(receiveSubIndustries(resp.results));
    },
    (err) => { console.log(err.message) });
}



export const requestIndustries = () => ({
  type: REQUEST_INDUSTRIES
})

export const receiveIndustries = (json) => ({
  type: RECEIVE_INDUSTRIES,
  industries: json,
  receivedAt: Date.now()
})

export const fetchIndustries = () => dispatch => {
  console.log('fetchIndustries dispatched')
  dispatch(requestIndustries())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/industries/`,
    (resp) => {
      dispatch(receiveIndustries(resp.results));
    },
    (err) => { console.log(err.message) });
}



export const requestKpiLegalViolationTypes = () => ({
  type: REQUEST_KPI_LEGAL_VIOLATION_TYPES
})

export const receiveKpiLegalViolationTypes = (json) => ({
  type: RECEIVE_KPI_LEGAL_VIOLATION_TYPES,
  kpilegalviolations: json,
  receivedAt: Date.now()
})

export const fetchKpiLegalViolationTypes = () => dispatch => {
  console.log('fetchKpiLegalViolationTypes dispatched')
  dispatch(requestKpiLegalViolationTypes())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/kpilegalviolations/`,
    (resp) => {
      dispatch(receiveKpiLegalViolationTypes(resp.results));
    },
    (err) => { console.log(err.message) });
}


export const requestResponseInteractionTypes = () => ({
  type: REQUEST_RESPONSE_INTERACTION_TYPES
})

export const receiveResponseInteractionTypes = (json) => ({
  type: RECEIVE_RESPONSE_INTERACTION_TYPES,
  responseinteractiontypes: json,
  receivedAt: Date.now()
})

export const fetchResponseInteractionTypes = () => dispatch => {
  console.log('fetchResponseInteractionTypes dispatched')
  dispatch(requestResponseInteractionTypes())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/business-response-interaction-types/`,
    (resp) => {
      dispatch(receiveResponseInteractionTypes(resp.results));
    },
    (err) => { console.log(err.message) });
}


export const requestReferralActions = () => ({
  type: REQUEST_REFERRAL_ACTIONS
})

export const receiveReferralActions = (json) => ({
  type: RECEIVE_REFERRAL_ACTIONS,
  referralactions: json,
  receivedAt: Date.now()
})

export const fetchReferralActions = () => dispatch => {
  console.log('fetchReferralActions dispatched')
  dispatch(requestReferralActions())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/referralactions/`,
    (resp) => {
      dispatch(receiveReferralActions(resp.results));
    },
    (err) => { console.log(err.message) });
}



export const requestCaseCategories = () => ({
  type: REQUEST_CASE_CATEGORIES
})

export const receiveCaseCategories = (json) => ({
  type: RECEIVE_CASE_CATEGORIES,
  casecategories: json,
  receivedAt: Date.now()
})

export const fetchCaseCategories = () => dispatch => {
  console.log('fetchCaseStatuses dispatched')
  dispatch(requestCaseCategories())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/casecategories/`,
    (resp) => {
      dispatch(receiveCaseCategories(resp.results));
    },
    (err) => { console.log(err.message) });
}




export const requestClientStatuses = () => ({
  type: REQUEST_CLIENT_STATUSES
})

export const receiveClientStatuses = (json) => ({
  type: RECEIVE_CLIENT_STATUSES,
  clientstatuses: json,
  receivedAt: Date.now()
})

export const fetchClientStatuses = () => dispatch => {
  console.log('fetchCaseStatuses dispatched')
  dispatch(requestClientStatuses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/clientstatuses/`,
    (resp) => {
      dispatch(receiveClientStatuses(resp.results));
    },
    (err) => { console.log(err.message) });
}



export const requestClientTypes = () => ({
  type: REQUEST_CLIENT_TYPES
})

export const receiveClientTypes = (json) => ({
  type: RECEIVE_CLIENT_TYPES,
  clienttypes: json,
  receivedAt: Date.now()
})

export const fetchClientTypes = () => dispatch => {
  console.log('fetchCaseStatuses dispatched')
  dispatch(requestClientTypes())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/clienttypes/`,
    (resp) => {
      dispatch(receiveClientTypes(resp.results));
    },
    (err) => { console.log(err.message) });
}






export const requestCaseStatuses = () => ({
  type: REQUEST_CASE_STATUSES
})

export const receiveCaseStatuses = (json) => ({
  type: RECEIVE_CASE_STATUSES,
  casestatuses: json,
  receivedAt: Date.now()
})

export const fetchCaseStatuses = () => dispatch => {
  console.log('fetchCaseStatuses dispatched')
  dispatch(requestCaseStatuses())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/casestatuses/`,
    (resp) => {
      dispatch(receiveCaseStatuses(resp.results));
    },
    (err) => { console.log(err.message) });
}




export const requestCountries = () => ({
  type: REQUEST_COUNTRIES
})

export const receiveCountries = (json) => ({
  type: RECEIVE_COUNTRIES,
  countries: json,
  receivedAt: Date.now()
})

export const fetchCountries = () => dispatch => {
  console.log('fetchCountries dispatched')
  dispatch(requestCountries())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/countries/`,
    (resp) => {
      dispatch(receiveCountries(resp.results));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchCountries = (state) => {
  console.log('shouldFetchCountries', state)
  const countries = state.countriesReducer.items
  if (!countries) {
    return true
  }
  if (countries.fetchingCountries) {
    return false
  }
  return false;
}

export const fetchCountriesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchCountries(getState())) {
    return dispatch(fetchCountries())
  }
}

export const requestProvinces = () => ({
  type: REQUEST_PROVINCES
})

export const receiveProvinces = (json) => ({
  type: RECEIVE_PROVINCES,
  provinces: json,
  thaiProvinces: json,
  receivedAt: Date.now()
})

export const fetchProvinces = () => dispatch => {
  console.log('fetchProvinces dispatched')
  dispatch(requestProvinces())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/provinces/`,
    (resp) => {
      dispatch(receiveProvinces(resp.results));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchProvinces = (state) => {
  console.log('shouldFetchProvinces', state)
  const provinces = state.provincesReducer.items
  if (!provinces) {
    console.log('shouldFetchProvinces returning true 1')
    return true
  }
  if (provinces.fetchingProvinces) {
    console.log('shouldFetchProvinces returning false')
    return false
  }
  console.log('shouldFetchProvinces returning false')
  return false;
}

export const fetchProvincesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchProvinces(getState())) {
    return dispatch(fetchProvinces())
  }
}

export const requestDistricts = () => ({
  type: REQUEST_DISTRICTS
})

export const receiveDistricts = (json) => ({
  type: RECEIVE_DISTRICTS,
  districts: json,
  receivedAt: Date.now()
})

export const fetchDistricts = () => dispatch => {
  console.log('fetchDistricts dispatched')
  dispatch(requestDistricts())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/districts/`,
    (resp) => {
      dispatch(receiveDistricts(resp.results));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchDistricts = (state) => {
  console.log('shouldFetchDistricts', state)
  const districts = state.districtsReducer.items
  if (!districts) {
    console.log('shouldFetchDistricts returning true 1')
    return true
  }
  if (districts.fetchingDistrict) {
    console.log('shouldFetchDistricts returning false')
    return false
  }
  console.log('shouldFetchDistricts returning false')
  return false;
}

export const fetchDistrictsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchDistricts(getState())) {
    return dispatch(fetchDistricts())
  }
}

export const requestNationalities = () => ({
  type: REQUEST_NATIONALITIES
})

export const receiveNationalities = (json) => ({
  type: RECEIVE_NATIONALITIES,
  nationalities: json,
  receivedAt: Date.now()
})

export const fetchNationalities = () => dispatch => {
  console.log('fetchNationalities dispatched')
  dispatch(requestNationalities())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/nationalities/`,
    (resp) => {
      dispatch(receiveNationalities(resp.results));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchNationalities = (state) => {
  console.log('shouldFetchNationalities', state)
  const nationalities = state.nationalitiesReducer.items
  if (!nationalities) {
    console.log('shouldFetchNationalities returning true')
    return true
  }
  if (nationalities.fetchingNationalities) {
    console.log('shouldFetchNationalities returning false')
    return false
  }
  console.log('shouldFetchNationalities returning false')
  return false;
}

export const fetchNationalitiesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchNationalities(getState())) {
    return dispatch(fetchNationalities())
  }
}

export const requestEthnicities = () => ({
  type: REQUEST_ETHNICITIES
})

export const receiveEthnicities = (json) => ({
  type: RECEIVE_ETHNICITIES,
  ethnicities: json,
  receivedAt: Date.now()
})

export const fetchEthnicities = () => dispatch => {
  console.log('fetchEthnicitiess dispatched')
  dispatch(requestEthnicities())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/ethnicities/`,
    (resp) => {
      dispatch(receiveEthnicities(resp.results));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchEthnicities = (state) => {
  const ethnicities = state.ethnicitiesReducer.items
  if (!ethnicities) {
    return true
  }
  if (ethnicities.fetchingEthnicities) {
    return false
  }

  return false;
}

export const fetchEthnicitiesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchEthnicities(getState())) {
    return dispatch(fetchEthnicities())
  }
}

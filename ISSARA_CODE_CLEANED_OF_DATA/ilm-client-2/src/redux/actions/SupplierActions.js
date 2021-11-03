import HttpService from '../../services/HttpService';
import moment from 'moment';


import loginStore from "../stores/LoginStore";
export const REQUEST_SUPPLIERS_BHR = 'REQUEST_SUPPLIERS_BHR'
export const RECEIVE_SUPPLIERS_BHR = 'RECEIVE_SUPPLIERS_BHR'

export const REQUEST_SUPPLIER_KPI_CALLS = 'REQUEST_SUPPLIER_KPI_CALLS'
export const RECEIVE_SUPPLIER_KPI_CALLS = 'RECEIVE_SUPPLIER_KPI_CALLS'

export const REQUEST_SUPPLIER_KPIS = 'REQUEST_SUPPLIER_KPIS'
export const RECEIVE_SUPPLIER_KPIS = 'RECEIVE_SUPPLIER_KPIS'

export const REQUEST_SUPPLIER_KPI_UPDATES = 'REQUEST_SUPPLIER_KPI_UPDATES'
export const RECEIVE_SUPPLIER_KPI_UPDATES = 'RECEIVE_SUPPLIER_KPI_UPDATES'

export const REQUEST_SUPPLIER = 'REQUEST_SUPPLIER'
export const RECEIVE_SUPPLIER = 'RECEIVE_SUPPLIER'

export const REQUEST_SUPPLIERS = 'REQUEST_SUPPLIERS'
export const RECEIVE_SUPPLIERS = 'RECEIVE_SUPPLIERS'
export const REQUEST_WORKPLACE_TYPES = 'REQUEST_WORKPLACE_TYPES'
export const RECEIVE_WORKPLACE_TYPES = 'RECEIVE_WORKPLACE_TYPES'
export const REQUEST_INDUSTRIES = 'REQUEST_INDUSTRIES'
export const RECEIVE_INDUSTRIES = 'RECEIVE_INDUSTRIES'

export const UPDATE_SUPPLIER_ISSUE_REQUEST = 'UPDATE_SUPPLIER_ISSUE_REQUEST';
export const UPDATE_SUPPLIER_ISSUE_SUCCESS = 'UPDATE_SUPPLIER_ISSUE_SUCCESS';
export const SUPPLIER_ISSUE_ERROR = 'SUPPLIER_ISSUE_ERROR';

export const UPDATE_SUPPLIER_REQUEST = 'UPDATE_SUPPLIER_REQUEST';
export const UPDATE_SUPPLIER_SUCCESS = 'UPDATE_SUPPLIER_SUCCESS';

export const UPDATE_SUPPLIER_KPI_REQUEST = 'UPDATE_SUPPLIER_KPI_REQUEST';
export const UPDATE_SUPPLIER_KPI_SUCCESS = 'UPDATE_SUPPLIER_KPI_SUCCESS';
export const UPDATE_SUPPLIER_KPI_FAILURE = 'UPDATE_SUPPLIER_KPI_FAILURE';

export const CREATE_SUPPLIER_REQUEST = 'CREATE_SUPPLIER_REQUEST';
export const CREATE_SUPPLIER_SUCCESS = 'CREATE_SUPPLIER_SUCCESS';

export const SUPPLIER_ERROR = 'SUPPLIER_ERROR';

export const MERGE_SUPPLIER_DUPLICATES_START = 'MERGE_SUPPLIER_DUPLICATES_START';
export const MERGE_SUPPLIER_DUPLICATES_SUCCESS = 'MERGE_SUPPLIER_DUPLICATES_SUCCESS';
export const MERGE_SUPPLIER_DUPLICATES_FAILURE = 'MERGE_SUPPLIER_DUPLICATES_FAILURE';

export const REQUEST_SUPPLIER_CRCS = 'REQUEST_SUPPLIER_CRCS';
export const RECEIVE_SUPPLIER_CRCS = 'RECEIVE_SUPPLIER_CRCS';





export const requestSuppliers = () => ({
  type: REQUEST_SUPPLIERS
})

export const requestSupplier = () => ({
  type: REQUEST_SUPPLIER
})

export const requestSupplierKPIs = () => ({
  type: REQUEST_SUPPLIER_KPIS
})


export const receiveSuppliers = (suppliersJson) => {

  if(loginStore.isGlobalPartner() && suppliersJson && suppliersJson.length && suppliersJson.length > 0 ) {
    suppliersJson.forEach((supplier)=>{
      if(supplier.anonymous === true ) {
        supplier.name = "Supplier " + supplier.id;
      }
    });
  }
  return ({
    type: RECEIVE_SUPPLIERS,
    suppliers: suppliersJson,
    receivedAt: Date.now()
  });
} 


export const receiveSupplier = (json) => {

  let supplier = { ...json.supplier[0]};

  if(loginStore.isGlobalPartner() && supplier && supplier.anonymous === true ) {
    supplier.name = "Supplier " + supplier.id;
  }
  return ({
    type: RECEIVE_SUPPLIER,
    supplier: json.supplier[0],
    receivedAt: Date.now()
  });
}


export const receiveSupplierKPIs = (supplierKPIs) => {
  return ({
    type: RECEIVE_SUPPLIER_KPIS,
    supplierKPIs: supplierKPIs,
    receivedAt: Date.now()
});

}



export const createSupplierRequest = (supplier) => ({
  type: CREATE_SUPPLIER_REQUEST,
  supplier: supplier
})


export function createSupplier(supplier, success, error) {
  console.log('createStrategicPartner, got', supplier)
  return function (dispatch) {
    dispatch(createSupplierRequest(supplier))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/suppliers/`, supplier,
      (res) => {
        dispatch({ type: CREATE_SUPPLIER_SUCCESS,
                   supplier: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: SUPPLIER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}


export const updateSupplierRequest = () => ({
  type: UPDATE_SUPPLIER_REQUEST,
})


export function updateSupplier(id, strategicParetner, success, error) {
  console.log('updateStrategicParetner, got', id, strategicParetner)
  return function (dispatch) {
    dispatch(updateSupplierRequest());
    return HttpService.put(`${process.env.REACT_APP_API_URL}/suppliers/${id}/`, strategicParetner,
      (res) => {
        dispatch({ type: UPDATE_SUPPLIER_SUCCESS,
                   id: parseInt(id),
                   supplier: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: SUPPLIER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}


export const updateBhrIssueRequest = (id) => ({
  type: UPDATE_SUPPLIER_ISSUE_REQUEST,
  id: id
})

export function updateBhrIssue(id, issue, supplier_id) {
  console.log('updateBhrIssue, got', id, issue, supplier_id)
  return function (dispatch) {
    dispatch(updateBhrIssueRequest(id))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/bhrIssues/${id}`, issue,
      (res) => {
        dispatch({ type: UPDATE_SUPPLIER_ISSUE_SUCCESS,
                   id: id,
                   supplier_id: supplier_id,
                   issue: res.issue,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
      },
      (err) => { console.log(err)
        dispatch({ type: SUPPLIER_ISSUE_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
      });
  }
}


export const requestSupplierCRCs = () => ({
  type: REQUEST_SUPPLIER_CRCS
})

export const receiveSupplierCRCs = (json) => ({
  type: RECEIVE_SUPPLIER_CRCS,
  suppliercrcs: json,
  receivedAt: Date.now()
})

export const fetchSupplierCRCs = () => dispatch => {
  console.log('fetchSupplierCRCs dispatched')
  dispatch(requestSupplierCRCs())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/supplier-crc-scores/`,
    (resp) => {
      dispatch(receiveSupplierCRCs(resp.results));
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
  return HttpService.get(`${process.env.REACT_APP_API_URL}/industries`,
    (resp) => {
      dispatch(receiveIndustries(resp.industries));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchIndustries = (state) => {
  console.log('shouldFetchIndustries', state)
  const industries = state.industriesReducer.items
  if (!industries) {
    return true
  }
  if (industries.fetchingIndustries) {
    return false
  }
  return false;
}

export const fetchIndustriesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchIndustries(getState())) {
    return dispatch(fetchIndustries())
  }
}

export const requestWorkplaceTypes = () => ({
  type: REQUEST_WORKPLACE_TYPES
})

export const receiveWorkplaceTypes = (json) => ({
  type: RECEIVE_WORKPLACE_TYPES,
  workplaceTypes: json,
  receivedAt: Date.now()
})

export const fetchWorkplaceTypes = () => dispatch => {
  console.log('fetchWorkplaceTypes dispatched')
  dispatch(requestWorkplaceTypes())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/workplaceTypes`,
    (resp) => {
      dispatch(receiveWorkplaceTypes(resp.workplaceTypes));
    },
    (err) => { console.log(err.message) });
}

const shouldFetchWorkplaceTypes = (state) => {
  console.log('shouldFetchWorkplaceTypes', state)
  const { workplaceTypesReducer} = state;

  const workplaceTypes = workplaceTypesReducer.items
  if (!workplaceTypes) {
    console.log('shouldFetchWorkplaceTypes returning true 1')
    return true
  }
  if (workplaceTypes.fetchingWorkplaceTypes) {
    console.log('shouldFetchWorkplaceTypes returning false')
    return false
  }
  console.log('shouldFetchWorkplaceTypes returning false')
  return false;
}

export const fetchWorkplaceTypesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchWorkplaceTypes(getState())) {
    return dispatch(fetchWorkplaceTypes())
  }
}





export const requestSuppliersBhr = () => ({
  type: REQUEST_SUPPLIERS_BHR
})

export const receiveSuppliersBhr = (json) => ({
  type: RECEIVE_SUPPLIERS_BHR,
  suppliers: json.suppliers,
  unknownSupplier: json.unknownSupplier,
  receivedAt: Date.now()
})

export const requestSupplierKpiCalls = () => ({
  type: REQUEST_SUPPLIER_KPI_CALLS
})

export const receiveSupplierKpiCalls = (json) => ({
  type: RECEIVE_SUPPLIER_KPI_CALLS,
  supplierkpicalls: json.supplierkpicalls,
  receivedAt: Date.now()
})




export const fetchSuppliers = () => dispatch => {
  console.log('fetchSuppliers dispatched')
  dispatch(requestSuppliers())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/suppliers/`,
    (resp) => {
      dispatch(receiveSuppliers(resp.results));
    },
    (err) => { console.log(err.message) });
}


export const fetchSupplierKpiCalls = (id) => dispatch => {
  console.log('fetchSupplier by ID dispatched')
  dispatch(requestSupplierKpiCalls(id))
  return HttpService.get(`${process.env.REACT_APP_API_URL}/suppliers/` + id + "/calls",
    (resp) => {
      dispatch(receiveSupplierKpiCalls(resp));
    },
    (err) => { console.log(err.message) });
}


export const fetchSupplier = (id) => dispatch => {
  console.log('fetchSupplier by ID dispatched')
  dispatch(requestSupplier(id))
  return HttpService.get(`${process.env.REACT_APP_API_URL}/suppliers/` + id ,
    (resp) => {
      dispatch(receiveSupplier(resp));
    },
    (err) => { console.log(err.message) });
}

export const fetchSuppliersBhr = () => dispatch => {
  console.log('fetchSuppliers dispatched')
  dispatch(requestSuppliersBhr())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/suppliers/bhrlist`,
    (resp) => {
      dispatch(receiveSuppliersBhr(resp.suppliers));
    },
    (err) => { console.log(err.message) });
}








export const fetchSupplierKPIs = () => dispatch => {
  dispatch(requestSupplierKPIs())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/supplierkpis_raw`,
    (resp) => {
     dispatch(receiveSupplierKPIs(resp));
    },
    (err) => { console.log(err.message) });
}


export const updateSupplierKPIRequest = () => ({
  type: UPDATE_SUPPLIER_KPI_REQUEST,
})

export const updateSupplierKPISuccess = (response) => ({
  type: UPDATE_SUPPLIER_KPI_SUCCESS,
  response: response,
})

export const updateSupplierKPIFailure = (error) => ({
  type: UPDATE_SUPPLIER_KPI_FAILURE,
  error: error
})

export const updateSupplierKPI = (id, payload, success, error) => dispatch => {
  dispatch(updateSupplierKPIRequest())
  return HttpService.put(`${process.env.REACT_APP_API_URL}/supplier-kpis/${id}/`, payload,
    (resp) => {
      dispatch(updateSupplierKPISuccess(resp));
      success(resp)
    },
    (err) => {
      dispatch(updateSupplierKPIFailure(err))
      error(err)
    });
}


export const requestSupplierKpiUpdates = () => ({
  type: REQUEST_SUPPLIER_KPI_UPDATES
})

export const receiveSupplierKpiUpdates = (supplierKpiUpdates) => ({
  type: RECEIVE_SUPPLIER_KPI_UPDATES,
  supplierKpiUpdates: supplierKpiUpdates,
  receivedAt: Date.now()
})

export const fetchSupplierKpiUpdates = () => dispatch => {
  dispatch(requestSupplierKpiUpdates())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/supplier-kpi-updates/`,
    (resp) => {
      dispatch(receiveSupplierKpiUpdates(resp.results));
    },
    (err) => {
      console.log(err.message)
    });
}


export const mergeSupplierDuplicatesStart = () => ({
  type: MERGE_SUPPLIER_DUPLICATES_START,
})

export const mergeSupplierDuplicatesSuccess = () => ({
  type: MERGE_SUPPLIER_DUPLICATES_SUCCESS,
})

export const mergeSupplierDuplicatesFailure = () => ({
  type: MERGE_SUPPLIER_DUPLICATES_FAILURE,
})

export const mergeSupplierDuplicates = (duplicates, success, error) => dispatch => {
  dispatch(mergeSupplierDuplicatesStart())
  return HttpService.post(`${process.env.REACT_APP_API_URL}/merge-supplier-duplicates`, duplicates,
    (resp) => {
      dispatch(mergeSupplierDuplicatesSuccess());
      dispatch(fetchSuppliers()) // Refetch suppliers after successful merge
      success(resp)
    },
    (err) => {
      dispatch(mergeSupplierDuplicatesFailure())
      error(err)
    });
}


export const batchRemoveSupplierKpis = (removesupplierkpis, success, error) => dispatch => {
  return HttpService.post(`${process.env.REACT_APP_API_URL}/removesupplierkpis`, removesupplierkpis,
    (resp) => {
      dispatch(fetchSupplierKpiUpdates()) // Refetch suppliers after successful merge
      dispatch(fetchSupplierKPIs());
      success(resp)
    },
    (err) => {
      error(err)
    });
}

export const batchDeleteSupplierKpiUpdates = (duplicates, success, error) => dispatch => {
  return HttpService.post(`${process.env.REACT_APP_API_URL}/supplierkpiupdatebatchdelete`, duplicates,
    (resp) => {
      dispatch(fetchSupplierKpiUpdates()) // Refetch suppliers after successful merge
      dispatch(fetchSupplierKPIs());
      success(resp)
    },
    (err) => {
      error(err)
    });
}

export const batchSupplierBatchUpdate = (suppliers, success, error) => dispatch => {
  return HttpService.post(`${process.env.REACT_APP_API_URL}/supplierbatchupdate`, suppliers,
    (resp) => {
      success(resp)
    },
    (err) => {
      error(err)
    });
}



import HttpService from '../../services/HttpService';
import moment from 'moment';


export const REQUEST_PERSON_CONTACTS = 'REQUEST_PERSON_CONTACTS'
export const RECEIVE_PERSON_CONTACTS = 'RECEIVE_PERSON_CONTACTS'

export const UPDATE_PERSON_CONTACT_REQUEST = 'UPDATE_PERSON_CONTACT_REQUEST';
export const UPDATE_PERSON_CONTACT_SUCCESS = 'UPDATE_PERSON_CONTACT_SUCCESS';

export const CREATE_PERSON_CONTACT_REQUEST = 'CREATE_PERSON_CONTACT_REQUEST';
export const CREATE_PERSON_CONTACT_SUCCESS = 'CREATE_PERSON_CONTACT_SUCCESS';


export const REQUEST_PARTNER_USER_LOGINS = 'REQUEST_PARTNER_USER_LOGINS'
export const RECEIVE_PARTNER_USER_LOGINS = 'RECEIVE_PARTNER_USER_LOGINS'


export const REQUEST_NEWS_UPDATES = 'REQUEST_NEWS_UPDATES'
export const RECEIVE_NEWS_UPDATES = 'RECEIVE_NEWS_UPDATES'

export const REQUEST_PARTNER_MESSAGE_BOARD = 'REQUEST_PARTNER_MESSAGE_BOARD'
export const RECEIVE_PARTNER_MESSAGE_BOARD = 'RECEIVE_PARTNER_MESSAGE_BOARD'

export const REQUEST_SHARED_FILES = 'REQUEST_SHARED_FILES'
export const RECEIVE_SHARED_FILES = 'RECEIVE_SHARED_FILES'


export const REQUEST_SUPPLY_CHAINS = 'REQUEST_SUPPLY_CHAINS'
export const RECEIVE_SUPPLY_CHAINS = 'RECEIVE_SUPPLY_CHAINS'


export const REQUEST_STRATEGIC_PARTNERS = 'REQUEST_STRATEGIC_PARTNERS'
export const RECEIVE_STRATEGIC_PARTNERS = 'RECEIVE_STRATEGIC_PARTNERS'

export const REQUEST_STRATEGIC_PARTNER = 'REQUEST_STRATEGIC_PARTNER'
export const RECEIVE_STRATEGIC_PARTNER = 'RECEIVE_STRATEGIC_PARTNER'

export const UPDATE_STRATEGIC_PARTNER_REQUEST = 'UPDATE_STRATEGIC_PARTNER_REQUEST';
export const UPDATE_STRATEGIC_PARTNER_SUCCESS = 'UPDATE_STRATEGIC_PARTNER_SUCCESS';

export const CREATE_STRATEGIC_PARTNER_REQUEST = 'CREATE_STRATEGIC_PARTNER_REQUEST';
export const CREATE_STRATEGIC_PARTNER_SUCCESS = 'CREATE_STRATEGIC_PARTNER_SUCCESS';


export const UPDATE_SUPPLY_CHAIN_REQUEST = 'UPDATE_SUPPLY_CHAIN_REQUEST';
export const UPDATE_SUPPLY_CHAIN_SUCCESS = 'UPDATE_SUPPLY_CHAIN_SUCCESS';

export const CREATE_SUPPLY_CHAIN_REQUEST = 'CREATE_SUPPLY_CHAIN_REQUEST';
export const CREATE_SUPPLY_CHAIN_SUCCESS = 'CREATE_SUPPLY_CHAIN_SUCCESS';



export const STRATEGIC_PARTNER_ERROR = 'STRATEGIC_PARTNER_ERROR';

// Shared File Uploads
export const requestSharedFiles = () => ({
  type: REQUEST_SHARED_FILES
});

export const receiveSharedFiles = (json) => ({
  type: RECEIVE_SHARED_FILES,
  shared_files: json,
  receivedAt: Date.now()
})

export const fetchSharedFiles = () => dispatch => {
  console.log('fetchSharedFiles dispatched')
  dispatch(requestSharedFiles())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/shared-files/`,
    (resp) => {
      dispatch(receiveSharedFiles(resp));
    },
    (err) => { console.log(err.message) });
}


export const requestPartnerMessageBoard = () => ({
  type: REQUEST_PARTNER_MESSAGE_BOARD
});

export const receivePartnerMessageBoard = (json) => ({
  type: RECEIVE_PARTNER_MESSAGE_BOARD,
  partner_news_updates: json.results,
  receivedAt: Date.now()
})

export const fetchPartnerMessageBoard = () => dispatch => {
  console.log('fetchNewsUpdates dispatched')
  dispatch(requestNewsUpdates())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/partnernewsupdates/`,
    (resp) => {
      dispatch(receivePartnerMessageBoard(resp));
    },
    (err) => { console.log(err.message) });
}

// News Updates
export const requestNewsUpdates = () => ({
  type: REQUEST_NEWS_UPDATES
});

export const receiveNewsUpdates = (json) => ({
  type: RECEIVE_NEWS_UPDATES,
  news_updates: json.results,
  receivedAt: Date.now()
})

export const fetchNewsUpdates = () => dispatch => {
  console.log('fetchNewsUpdates dispatched')
  dispatch(requestNewsUpdates())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/newsupdates/`,
    (resp) => {
      dispatch(receiveNewsUpdates(resp));
    },
    (err) => { console.log(err.message) });
}


// Partner User Logins
export const requestPartnerUserLogins = () => ({
  type: REQUEST_PARTNER_USER_LOGINS
});

export const receivePartnerUserLogins = (json) => ({
  type: RECEIVE_PARTNER_USER_LOGINS,
  partner_user_logins: json.results,
  receivedAt: Date.now()
})

export const fetchPartnerUserLogins = () => dispatch => {
  console.log('fetchPartnerUserLogins dispatched')
  dispatch(requestNewsUpdates())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/userpartnerlogins/`,
    (resp) => {
      dispatch(receivePartnerUserLogins(resp));
    },
    (err) => { console.log(err.message) });
}



// Person Contact
export const createPersonContactRequest = (personContact) => ({
  type: CREATE_PERSON_CONTACT_REQUEST,
  person_contact: personContact
})


export function createPersonContact(personContact, success, error) {
  console.log('createPersonContactRequest, got', personContact)
  return function (dispatch) {
    dispatch(createPersonContactRequest(personContact))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/personcontacts/`, personContact,
      (res) => {
        dispatch({ type: CREATE_PERSON_CONTACT_SUCCESS,
                   person_contact: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}


export const updatePersonContactRequest = () => ({
  type: UPDATE_PERSON_CONTACT_REQUEST,
})


export function updatePersonContact(id, personContact, success, error) {
  console.log('updateSupplyChain, got', id, personContact)
  return function (dispatch) {
    dispatch(updatePersonContactRequest());
    return HttpService.put(`${process.env.REACT_APP_API_URL}/personcontacts/${id}/`, personContact,
      (res) => {
        dispatch({ type: UPDATE_PERSON_CONTACT_SUCCESS,
                   id: parseInt(id),
                   person_contact: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}


export const requestPersonContacts = () => ({
  type: REQUEST_PERSON_CONTACTS
});

export const receivePersonContacts = (json) => ({
  type: RECEIVE_PERSON_CONTACTS,
  person_contacts: json.results,
  receivedAt: Date.now()
})

export const fetchPersonContacts = () => dispatch => {
  console.log('fetchPersonContacts dispatched')
  dispatch(requestPersonContacts())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/personcontacts/`,
    (resp) => {
      dispatch(receivePersonContacts(resp));
    },
    (err) => { console.log(err.message) });
}



// Supply Chain
export const createSupplyChainRequest = (supplyChain) => ({
  type: CREATE_SUPPLY_CHAIN_REQUEST,
  supply_chain: supplyChain
})


export function createSupplyChain(supplyChain, success, error) {
  console.log('createSupplyChain, got', supplyChain)
  return function (dispatch) {
    dispatch(createSupplyChainRequest(supplyChain))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/supplychains/`, supplyChain,
      (res) => {
        dispatch({ type: CREATE_SUPPLY_CHAIN_SUCCESS,
                   supply_chain: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}


export const updateSupplyChainRequest = () => ({
  type: UPDATE_SUPPLY_CHAIN_REQUEST,
})


export function updateSupplyChain(id, supplyChain, success, error) {
  console.log('updateSupplyChain, got', id, supplyChain)
  return function (dispatch) {
    dispatch(updateSupplyChainRequest());
    return HttpService.put(`${process.env.REACT_APP_API_URL}/supplychains/${id}/`, supplyChain,
      (res) => {
        dispatch({ type: UPDATE_SUPPLY_CHAIN_SUCCESS,
                   id: parseInt(id),
                   supply_chain: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}


export const requestSupplyChains = () => ({
  type: REQUEST_SUPPLY_CHAINS
});

export const receiveSupplyChains = (json) => ({
  type: RECEIVE_SUPPLY_CHAINS,
  supplychains: json.results,
  receivedAt: Date.now()
})

export const fetchSupplyChains = () => dispatch => {
  console.log('fetchSupplyChains dispatched')
  dispatch(requestSupplyChains())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/supplychains/`,
    (resp) => {
      dispatch(receiveSupplyChains(resp));
    },
    (err) => { console.log(err.message) });
}



// Strategic Partner

export const createStrategicPartnerRequest = (strategicParetner) => ({
  type: CREATE_STRATEGIC_PARTNER_REQUEST,
  strategic_partner: strategicParetner
})


export function createStrategicPartner(strategicPartner, success, error) {
  console.log('createStrategicPartner, got', strategicPartner)
  return function (dispatch) {
    dispatch(createStrategicPartnerRequest(strategicPartner))
    return HttpService.post(`${process.env.REACT_APP_API_URL}/strategicpartners/`, strategicPartner,
      (res) => {
        dispatch({ type: CREATE_STRATEGIC_PARTNER_SUCCESS,
                   strategicPartner: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                })
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}


export const updateStrategicPartnerRequest = () => ({
  type: UPDATE_STRATEGIC_PARTNER_REQUEST,
})


export function updateStrategicPartner(id, strategicParetner, success, error) {
  console.log('updateStrategicParetner, got', id, strategicParetner)
  return function (dispatch) {
    dispatch(updateStrategicPartnerRequest());
    return HttpService.put(`${process.env.REACT_APP_API_URL}/strategicpartners/${id}/`, strategicParetner,
      (res) => {
        dispatch({ type: UPDATE_STRATEGIC_PARTNER_SUCCESS,
                   id: parseInt(id),
                   strategicPartner: res,
                   receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
                });
        success(res)
      },
      (err) => { console.log(err)
        dispatch({ type: STRATEGIC_PARTNER_ERROR,
           message: err.message,
           receivedAt: moment().format('MMM Do YYYY, h:mm:ss a')
        })
        error(err)
      });
  }
}
export const requestStrategicPartner = (id) => ({
  type: REQUEST_STRATEGIC_PARTNER,
  id: id
})

export const requestStrategicPartners = () => ({
  type: REQUEST_STRATEGIC_PARTNERS
})

export const receiveStrategicPartners = (json) => ({
  type: RECEIVE_STRATEGIC_PARTNERS,
  strategicpartners: json.results,
  receivedAt: Date.now()
})
export const receiveStrategicPartner = (json) => ({
  type: RECEIVE_STRATEGIC_PARTNER,
  strategicpartner: json.strategicpartner,
  receivedAt: Date.now()
})

export const fetchStrategicPartners = () => dispatch => {
  console.log('fetchStrategicPartners dispatched')
  dispatch(requestStrategicPartners())
  return HttpService.get(`${process.env.REACT_APP_API_URL}/strategicpartners/`,
    (resp) => {
      dispatch(receiveStrategicPartners(resp));
    },
    (err) => { console.log(err.message) });
}


export const fetchStrategicPartner = (id) => dispatch => {
  console.log('fetchStrategicPartner by ID dispatched')
  dispatch(requestStrategicPartner(id))
  return HttpService.get(`${process.env.REACT_APP_API_URL}/strategicpartners/` + id ,
    (resp) => {
      dispatch(receiveStrategicPartner(resp));
    },
    (err) => { console.log(err.message) });
}


const shouldFetchStrategicPartner = (id, state) => {
  console.log('shouldFetchStrategicPartner', id, state)
  return true;
}


const shouldFetchStrategicPartners = (id, state) => {
  console.log('shouldFetchStrategicPartners', id, state)
  return true;
}



export const fetchStrategicPartnersIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchStrategicPartners(getState())) {
    return dispatch(fetchStrategicPartners())
  }
}


export const fetchStrategicPartnerIfNeeded = (id) => (dispatch, getState) => {
  if (shouldFetchStrategicPartner(id, getState())) {
    return dispatch(fetchStrategicPartner(id));
  }
}

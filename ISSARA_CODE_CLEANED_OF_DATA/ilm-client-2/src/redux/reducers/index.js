import { combineReducers } from 'redux'
import { toast } from "react-toastify";

import {
  REQUEST_CALLS, RECEIVE_CALLS,
  REQUEST_CALL_DATA, RECEIVE_CALL_DATA,
  UPDATE_CALL_REQUEST, CREATE_CALL_REQUEST,
  CREATE_CALL_SUCCESS, UPDATE_CALL_SUCCESS,
  REQUEST_CALL_CHANNELS, RECEIVE_CALL_CHANNELS,
  REQUEST_CALL_REASONS, RECEIVE_CALL_REASONS,
  REQUEST_CALL_TYPES, RECEIVE_CALL_TYPES,
  REQUEST_HOW_HEAR_ISSARA, RECEIVE_HOW_HEAR_ISSARA,
  CALL_ERROR
} from '../actions/CallActions'

import {
  REQUEST_ALL_ISSUES, RECEIVE_ALL_ISSUES,
  REQUEST_ISSUES_BY_CALL_ID, RECEIVE_ISSUES_BY_CALL_ID,
  UPDATE_ISSUE_REQUEST, UPDATE_ISSUE_SUCCESS,
  DELETE_ISSUE_REQUEST, DELETE_ISSUE_SUCCESS,
  CREATE_ISSUE_SUCCESS, CREATE_ISSUE_REQUEST,
  REQUEST_KPI_CATEGORY_LIST, RECEIVE_KPI_CATEGORY_LIST,
  REQUEST_KPI_LIST, RECEIVE_KPI_LIST,
  REQUEST_ISSUE_CATEGORIES, RECEIVE_ISSUE_CATEGORIES,
  ISSUE_ERROR
} from '../actions/IssueActions'

import {
  REQUEST_BHR_ISSUE, RECEIVE_BHR_ISSUE,
  UPDATE_BHR_ISSUE_REQUEST, UPDATE_BHR_ISSUE_SUCCESS,
  BHR_ISSUE_ERROR
} from '../actions/BhrIssueActions'

import {
  REQUEST_BUSINESS_RESPONSES, RECEIVE_BUSINESS_RESPONSES,
  CREATE_BUSINESS_RESPONSE_REQUEST, CREATE_BUSINESS_RESPONSE_SUCCESS,
  CREATE_BUSINESS_RESPONSE_FAILURE, UPDATE_BUSINESS_RESPONSE_REQUEST,
  UPDATE_BUSINESS_RESPONSE_SUCCESS, UPDATE_BUSINESS_RESPONSE_FAILURE
} from '../actions/BusinessResponseActions'

import {
  REQUEST_BHR_CRC_RESPONSES, RECEIVE_BHR_CRC_RESPONSES,
  REQUEST_BHR_RESPONSES, RECEIVE_BHR_RESPONSES,
  REQUEST_BHR_RESPONSE, RECEIVE_BHR_RESPONSE,
  UPDATE_BHR_RESPONSE_REQUEST, UPDATE_BHR_RESPONSE_SUCCESS,
  CREATE_BHR_RESPONSE_REQUEST, CREATE_BHR_RESPONSE_SUCCESS,
  DELETE_BHR_RESPONSE_REQUEST, DELETE_BHR_RESPONSE_SUCCESS,
  DELETE_BHR_CRC_RESPONSE_REQUEST, DELETE_BHR_CRC_RESPONSE_SUCCESS,
  UPDATE_BHR_CRC_RESPONSE_REQUEST, UPDATE_BHR_CRC_RESPONSE_SUCCESS,
  CREATE_BHR_CRC_RESPONSE_REQUEST, CREATE_BHR_CRC_RESPONSE_SUCCESS,
  UPDATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST, UPDATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS,
  CREATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST, CREATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS,
  BHR_RESPONSE_ERROR, CREATE_BHR_CRC_RESPONSE_ERROR
} from '../actions/BhrResponseActions'

import {
  REQUEST_COUNTRIES, RECEIVE_COUNTRIES,
  REQUEST_DISTRICTS, RECEIVE_DISTRICTS,
  REQUEST_NATIONALITIES, RECEIVE_NATIONALITIES,
  REQUEST_PROVINCES, RECEIVE_PROVINCES,
  REQUEST_ETHNICITIES, RECEIVE_ETHNICITIES,
  REQUEST_CASE_STATUSES, RECEIVE_CASE_STATUSES,
  REQUEST_CASE_CATEGORIES, RECEIVE_CASE_CATEGORIES,
  REQUEST_CLIENT_STATUSES, RECEIVE_CLIENT_STATUSES,
  REQUEST_CLIENT_TYPES, RECEIVE_CLIENT_TYPES,
  REQUEST_REFERRAL_ACTIONS, RECEIVE_REFERRAL_ACTIONS,
  REQUEST_RESPONSE_INTERACTION_TYPES, RECEIVE_RESPONSE_INTERACTION_TYPES,
  REQUEST_KPI_LEGAL_VIOLATION_TYPES, RECEIVE_KPI_LEGAL_VIOLATION_TYPES,
  REQUEST_INDUSTRIES, RECEIVE_INDUSTRIES,
  REQUEST_SUBINDUSTRIES, RECEIVE_SUBINDUSTRIES,
  REQUEST_FACTORY_TYPES, RECEIVE_FACTORY_TYPES,
  REQUEST_MM_THAI_DEMAND_DATA, RECEIVE_MM_THAI_DEMAND_DATA,
  REQUEST_SUPPLIER_KPI_UPDATE_STATUSES, RECEIVE_SUPPLIER_KPI_UPDATE_STATUSES

} from '../actions/LocaleActions'

import {
  REQUEST_SUPPLIER_KPI_CALLS, RECEIVE_SUPPLIER_KPI_CALLS,
  REQUEST_SUPPLIER_KPIS, RECEIVE_SUPPLIER_KPIS,
  REQUEST_SUPPLIER_KPI_UPDATES, RECEIVE_SUPPLIER_KPI_UPDATES,
  REQUEST_SUPPLIER, RECEIVE_SUPPLIER,
  REQUEST_SUPPLIERS, RECEIVE_SUPPLIERS,
  REQUEST_SUPPLIER_CRCS, RECEIVE_SUPPLIER_CRCS,
  REQUEST_SUPPLIERS_BHR, RECEIVE_SUPPLIERS_BHR,
  REQUEST_WORKPLACE_TYPES, RECEIVE_WORKPLACE_TYPES,
  SUPPLIER_ERROR, UPDATE_SUPPLIER_REQUEST, UPDATE_SUPPLIER_SUCCESS,
  CREATE_SUPPLIER_REQUEST, CREATE_SUPPLIER_SUCCESS,
  UPDATE_SUPPLIER_KPI_REQUEST, UPDATE_SUPPLIER_KPI_SUCCESS,
  UPDATE_SUPPLIER_KPI_FAILURE
} from '../actions/SupplierActions';

import {
  REQUEST_ETHICAL_RECRUITMENT_MEETINGS, RECEIVE_ETHICAL_RECRUITMENT_MEETINGS,
  CREATE_ETHICAL_RECRUITMENT_MEETING_REQUEST, CREATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS,
  UPDATE_ETHICAL_RECRUITMENT_MEETING_REQUEST, UPDATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS,
  ETHICAL_RECRUITMENT_ERROR
} from '../actions/EthicalRecruitmentActions';

import {
  REQUEST_STRATEGIC_PARTNER, RECEIVE_STRATEGIC_PARTNER,
  REQUEST_STRATEGIC_PARTNERS, RECEIVE_STRATEGIC_PARTNERS,
  UPDATE_STRATEGIC_PARTNER_REQUEST, UPDATE_STRATEGIC_PARTNER_SUCCESS,
  CREATE_STRATEGIC_PARTNER_REQUEST, CREATE_STRATEGIC_PARTNER_SUCCESS,
  UPDATE_SUPPLY_CHAIN_REQUEST, UPDATE_SUPPLY_CHAIN_SUCCESS,
  CREATE_SUPPLY_CHAIN_REQUEST, CREATE_SUPPLY_CHAIN_SUCCESS,
  REQUEST_SUPPLY_CHAINS, RECEIVE_SUPPLY_CHAINS,
  UPDATE_PERSON_CONTACT_REQUEST, UPDATE_PERSON_CONTACT_SUCCESS,
  CREATE_PERSON_CONTACT_REQUEST, CREATE_PERSON_CONTACT_SUCCESS,
  REQUEST_PERSON_CONTACTS, RECEIVE_PERSON_CONTACTS,
  REQUEST_PARTNER_USER_LOGINS, RECEIVE_PARTNER_USER_LOGINS,
  REQUEST_NEWS_UPDATES, RECEIVE_NEWS_UPDATES,
  REQUEST_PARTNER_MESSAGE_BOARD, RECEIVE_PARTNER_MESSAGE_BOARD,
  REQUEST_SHARED_FILES, RECEIVE_SHARED_FILES,
  STRATEGIC_PARTNER_ERROR
} from '../actions/StrategicPartnerActions';

import {
  REQUEST_STRATEGIC_PARTNER_RESPONSES, RECEIVE_STRATEGIC_PARTNER_RESPONSES,
  REQUEST_STRATEGIC_PARTNER_RESPONSE, RECEIVE_STRATEGIC_PARTNER_RESPONSE,
  UPDATE_STRATEGIC_PARTNER_RESPONSE_REQUEST, UPDATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS,
  CREATE_STRATEGIC_PARTNER_RESPONSE_REQUEST, CREATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS,
  DELETE_STRATEGIC_PARTNER_RESPONSE_REQUEST, DELETE_STRATEGIC_PARTNER_RESPONSE_SUCCESS,
  STRATEGIC_PARTNER_RESPONSE_ERROR
} from '../actions/StrategicPartnerResponseActions';


import {
  REQUEST_RECRUITER, RECEIVE_RECRUITER,
  REQUEST_RECRUITERS, RECEIVE_RECRUITERS,
  REQUEST_RECRUITERS_BHR, RECEIVE_RECRUITERS_BHR,
  REQUEST_RECRUITER_CRCS, RECEIVE_RECRUITER_CRCS,
  UPDATE_RECRUITER_REQUEST, UPDATE_RECRUITER_SUCCESS, RECRUITER_ERROR
} from '../actions/RecruiterActions';

import {
  REQUEST_FIELDWORK_TYPES, RECEIVE_FIELDWORK_TYPES,
  REQUEST_FIELDWORK_PRIMARY_FOCUSES, RECEIVE_FIELDWORK_PRIMARY_FOCUSES,
  REQUEST_FIELDWORK_ACTIVITIES, RECEIVE_FIELDWORK_ACTIVITIES,
  CREATE_FIELDWORK_ACTIVITY_REQUEST, CREATE_FIELDWORK_ACTIVITY_SUCCESS,
  CREATE_FIELDWORK_ACTIVITY_FAILURE, CREATE_MONTHLY_WORKER_VOICE_REQUEST,
  UPDATE_FIELDWORK_ACTIVITY_REQUEST, UPDATE_FIELDWORK_ACTIVITY_SUCCESS,
  UPDATE_FIELDWORK_ACTIVITY_FAILURE,
  CREATE_MONTHLY_WORKER_VOICE_SUCCESS, CREATE_MONTHLY_WORKER_VOICE_FAILURE
} from '../actions/TeamActivityActions'

import {
  REQUEST_TEAM_TASKS, RECEIVE_TEAM_TASKS,
  UPDATE_TEAM_TASK_REQUEST, UPDATE_TEAM_TASK_SUCCESS,
  UPDATE_TEAM_TASK_FAILURE
} from '../actions/TeamTasksActions'

import {
  REQUEST_USERS, RECEIVE_USERS,
  REQUEST_DASHBOARDS, RECEIVE_DASHBOARDS,

} from '../actions/UsersActions';

import Utils from "../../services/utils";

const workerVoiceCaseCallsReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CALLS:
      return {
        ...state,
        fetchingCalls: true,
        items: undefined,
        call_items: undefined,
        itemsMap: {},
        callsMap: {}
      }
    case RECEIVE_CALLS:
      return {
        ...state,
        fetchingCalls: false,
        items: action.calls,
        call_items: action.calls,
        itemsMap: Utils.arrayToObject(action.calls),
        callsMap: Utils.arrayToObject(action.calls),
        lastUpdated: action.receivedAt
      }
    case REQUEST_CALL_DATA:
      return {
        ...state,
        fetchingCallData: true,
        item: undefined,
        call_item: undefined,

      }
    case RECEIVE_CALL_DATA:
      return {
        ...state,
        fetchingCallData: false,
        item: Object.assign({}, action.call),
        call_item: Object.assign({}, action.call),
        lastUpdated: action.receivedAt
      }
    case CREATE_CALL_REQUEST:
      return {
        ...state,
        savingCall: true,
        item: Object.assign({}, action.call),
        call_item: Object.assign({}, action.call),
        lastUpdated: action.receivedAt
      }
    case UPDATE_CALL_REQUEST:
      return {
        ...state,
        savingCall: true,
        item: Object.assign({}, action.call),
        call_item: Object.assign({}, action.call),
        lastUpdated: action.receivedAt
      }
    case CREATE_CALL_SUCCESS:
      toast.success('Call created: ' + action.receivedAt)
      return {
        ...state,
        savingCall: false,
        item: Object.assign({}, action.call),
        call_item: Object.assign({}, action.call),
        lastUpdated: action.receivedAt
      }
    case UPDATE_CALL_SUCCESS:
      toast.success('Call updated: ' + action.receivedAt)
      return {
        ...state,
        savingCall: false,
        item: Object.assign({}, action.call),
        call_item: Object.assign({}, action.call),
        lastUpdated: action.receivedAt
      }
    case CALL_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingCall: false,
        fetchingCalls: false,
        fetchingCallData: false
      }

    default:
      return state
  }
}

const supplierKpiUpdateStatusReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_SUPPLIER_KPI_UPDATE_STATUSES:
      return {
        ...state,
        fetchingSupplierKpiUpdateStatuses: true,
        items: []
      }
    case RECEIVE_SUPPLIER_KPI_UPDATE_STATUSES:
      return {
        ...state,
        fetchingSupplierKpiUpdateStatuses: false,
        items: action.supplierkpiupdatestatuses,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const allCallTypes = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CALL_TYPES:
      return {
        ...state,
        fetchingCallTypes: true,
        items: []
      }
    case RECEIVE_CALL_TYPES:
      return {
        ...state,
        fetchingCallTypes: false,
        items: action.callTypes,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const callChannels = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CALL_CHANNELS:
      return {
        ...state,
        fetchingChannels: true,
        items: [],
        channelItems: []
      }
    case RECEIVE_CALL_CHANNELS:
      return {
        ...state,
        fetchingChannels: false,
        items: action.callChannels,
        channelItems: action.callChannels,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const callReasons = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CALL_REASONS:
      return {
        ...state,
        fetchingReasons: true,
        items: [],
        reasonItems: [],
      }
    case RECEIVE_CALL_REASONS:
      return {
        ...state,
        fetchingReasons: false,
        items: action.callReasons,
        reasonItems: action.callReasons,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const callHHI = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_HOW_HEAR_ISSARA:
      return {
        ...state,
        fetchingCallHHI: true,
        items: []
      }
    case RECEIVE_HOW_HEAR_ISSARA:
      return {
        ...state,
        fetchingCallHHI: false,
        items: action.callHHI,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const countriesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_COUNTRIES:
      return {
        ...state,
        fetchingCountries: true,
        items: []
      }
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        fetchingCountries: false,
        items: action.countries,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const districtsReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_DISTRICTS:
      return {
        ...state,
        fetchingDistricts: true,
        items: []
      }
    case RECEIVE_DISTRICTS:
      return {
        ...state,
        fetchingDistricts: false,
        items: action.districts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const provincesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_PROVINCES:
      return {
        ...state,
        fetchingProvinces: true,
        thaiProvinces: [],
        items: {}
      }
    case RECEIVE_PROVINCES:
      return {
        ...state,
        fetchingProvinces: false,
        items: action.provinces,
        thaiProvinces: action.thaiProvinces,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const caseStatusReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CASE_STATUSES:
      return {
        ...state,
        fetchingCaseStatuses: true,
        items: []
      }
    case RECEIVE_CASE_STATUSES:
      return {
        ...state,
        fetchingCaseStatuses: false,
        items: action.casestatuses,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const caseCategoriesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CASE_CATEGORIES:
      return {
        ...state,
        fetchingCaseCategories: true,
        items: []
      }
    case RECEIVE_CASE_CATEGORIES:
      return {
        ...state,
        fetchingCaseCategories: false,
        items: action.casecategories,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const clientStatusReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CLIENT_STATUSES:
      return {
        ...state,
        fetchingClientStatuses: true,
        items: []
      }
    case RECEIVE_CLIENT_STATUSES:
      return {
        ...state,
        fetchingClientStatuses: false,
        items: action.clientstatuses,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const clientTypesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_CLIENT_TYPES:
      return {
        ...state,
        fetchingClientTypes: true,
        items: []
      }
    case RECEIVE_CLIENT_TYPES:
      return {
        ...state,
        fetchingClientTypes: false,
        items: action.clienttypes,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const referralActionsReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_REFERRAL_ACTIONS:
      return {
        ...state,
        fetchingReferralActions: true,
        items: undefined
      }
    case RECEIVE_REFERRAL_ACTIONS:
      return {
        ...state,
        fetchingReferralActions: false,
        items: action.referralactions,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const kpiLegalViolationTypesReducer = (state = { items: [] }, action) => {

  switch (action.type) {
    case REQUEST_KPI_LEGAL_VIOLATION_TYPES:
      return {
        ...state,
        fetchingKpiLegalViolationTypes: true,
      }
    case RECEIVE_KPI_LEGAL_VIOLATION_TYPES:
      return {
        ...state,
        fetchingKpiLegalViolationTypes: false,
        items: action.kpilegalviolations,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}



const responseInteractionTypesReducer = (state = { items: [] }, action) => {

  switch (action.type) {
    case REQUEST_RESPONSE_INTERACTION_TYPES:
      return {
        ...state,
        fetchingResponseInteractionTypes: true,
      }
    case RECEIVE_RESPONSE_INTERACTION_TYPES:
      return {
        ...state,
        fetchingResponseInteractionTypes: false,
        items: action.responseinteractiontypes,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}



const ethnicitiesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_ETHNICITIES:
      return {
        ...state,
        fetchingEthnicities: true,
        items: []
      }
    case RECEIVE_ETHNICITIES:
      return {
        ...state,
        fetchingEthnicities: false,
        items: action.ethnicities,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const nationalitiesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_NATIONALITIES:
      return {
        ...state,
        fetchingNationalities: true,
        items: []
      }
    case RECEIVE_NATIONALITIES:
      return {
        ...state,
        fetchingNationalities: false,
        items: action.nationalities,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const initialSuppliersState = {
  items: [],
  itemsMap: {},
  supplier_items: [],
  supplier_items_map: {},
  supplierKPIs: {},
  supplierKPIsList: [],
  supplierKPIUpdateItems: [],
  supplierKpiUpdates: {}
}

const suppliersReducer = (state = initialSuppliersState, action) => {

  switch (action.type) {
    case REQUEST_SUPPLIER_KPI_CALLS:
      return {
        ...state,
        fetchingSupplierKpiCalls: true,
        itemcalls: {}
      }
    case RECEIVE_SUPPLIER_KPI_CALLS:
      return {
        ...state,
        fetchingSupplierKpiCalls: false,
        itemcalls: action.supplierkpicalls,
        lastUpdated: action.receivedAt
      }

    case REQUEST_SUPPLIER_KPIS:
      return {
        ...state,
        fetchingSupplierKPIs: true,
      }
    case RECEIVE_SUPPLIER_KPIS:
      return {
        ...state,
        fetchingSupplierKPIs: false,
        supplierKPIs: Utils.arrayToObject(action.supplierKPIs),
        supplierKPIsList: action.supplierKPIs,
        lastUpdated: action.receivedAt
      }

    case REQUEST_SUPPLIER_KPI_UPDATES:
      return {
        ...state,
        fetchingSupplierKpiUpdates: true,
      }
    case RECEIVE_SUPPLIER_KPI_UPDATES:
      return {
        ...state,
        fetchingSupplierKpiUpdates: false,
        supplierKpiUpdates: Utils.arrayToObject(action.supplierKpiUpdates),
        supplierKPIUpdateItems: (action.supplierKpiUpdates) ? action.supplierKpiUpdates : [],
        supllierKpiUpdatesReceivedAt: action.receivedAt
      }

    case UPDATE_SUPPLIER_KPI_REQUEST:
      return {
        ...state,
        savingSupplierKpi: true
      }

    case UPDATE_SUPPLIER_KPI_SUCCESS:
      return {
        ...state,
        supplierKPIs: {
          ...state.supplierKPIs,
          [action.response.id]: action.response
        },
        savingSupplierKpi: false
      }

    case REQUEST_SUPPLIERS_BHR:
      return {
        ...state,
        fetchingSuppliersBhr: true,
        unknownSupplier: '',
        items: {}
      }
    case RECEIVE_SUPPLIERS_BHR:
      return {
        ...state,
        fetchingSuppliersBhr: false,
        items: action.suppliers,
        unknownSupplier: action.unknownSupplier,
        lastUpdated: action.receivedAt
      }

    case REQUEST_SUPPLIERS:
      return {
        ...state,
        fetchingSuppliers: true,
        items: [],
        itemMap: {},
        suppliers_items: [],
        suppliers_items_map: {},
        unknownSupplier: '',
      }
    case RECEIVE_SUPPLIERS:
      return {
        ...state,
        fetchingSuppliers: false,
        items: action.suppliers,
        itemsMap: Utils.arrayToObject(action.suppliers),
        suppliers_items: action.suppliers,
        suppliers_items_map: Utils.arrayToObject(action.suppliers),
        unknownSupplier: action.unknownSupplier,
        lastUpdated: action.receivedAt
      }
    case REQUEST_SUPPLIER:
      return {
        ...state,
        fetchingSupplier: true,
        items: state.items || {}
      }
    case RECEIVE_SUPPLIER:
      return {
        ...state,
        fetchingSupplier: false,
        item: action.supplier,
        lastUpdated: action.receivedAt
      }
    case UPDATE_SUPPLIER_REQUEST:
      return {
        ...state,
        savingSupplier: true
      }

    case UPDATE_SUPPLIER_SUCCESS:
      toast.success('Supplier updated: ' + action.receivedAt)
      return {
        ...state,
        savingSupplier: false,
        item: action.supplier
      }

    case CREATE_SUPPLIER_REQUEST:
      return {
        ...state,
        savingSupplier: true
      }

    case CREATE_SUPPLIER_SUCCESS:
      toast.success('Supplier updated: ' + action.receivedAt)
      return {
        ...state,
        savingSupplier: false,
        item: action.supplier
      }

    case SUPPLIER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingSupplierKpi: false,
        savingSupplier: false,
        fetchingSupplier: false
      }
    default:
      return state
  }
}


const newUpdatesInitialState = {
  items: [],
  itemsMap: {},
  newsUpdates: [],
  newsUpdatesMap: {},
  fetchingNewsUpdates: false,
  savingNewsUpdates: false

}

const newsUpdatesReducer = (state = newUpdatesInitialState, action) => {
  switch (action.type) {
    case REQUEST_NEWS_UPDATES:
      return {
        ...state,
        items: [],
        itemsMap: {},
        newsUpdates: [],
        newsUpdatesMap: {},

        fetchingNewsUpdates: true,
      }
    case RECEIVE_NEWS_UPDATES:
      return {
        ...state,
        fetchingNewsUpdates: false,
        items: action.news_updates,
        itemsMap: Utils.arrayToObject(action.news_updates),
        newsUpdates: action.news_updates,
        newsUpdatesMap: Utils.arrayToObject(action.news_updates),
        lastUpdated: action.receivedAt
      }
    case STRATEGIC_PARTNER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingPersonContacts: false,
        fetchingPersonContacts: false
      }
    default:
      return state
  }
}

const partnerNewUpdatesInitialState = {
  items: [],
  itemsMap: {},
  partnerMessageBoard: [],
  partnerMessageBoardMap: {},
  fetchingPartnerMessageBoard: false

}

const partnerMessageBoardReducer = (state = partnerNewUpdatesInitialState, action) => {
  switch (action.type) {
    case REQUEST_PARTNER_MESSAGE_BOARD:
      return {
        ...state,
        items: [],
        itemsMap: {},
        partnerMessageBoard: [],
        partnerNnewsUpdatesMap: {},
        fetchingPartnerMessageBoard: true,
      }
    case RECEIVE_PARTNER_MESSAGE_BOARD:
      return {
        ...state,
        fetchingPartnerMessageBoard: false,
        items: action.partner_news_updates,
        itemsMap: Utils.arrayToObject(action.partner_news_updates),
        partnerMessageBoard: action.partner_news_updates,
        partnerMessageBoardMap: Utils.arrayToObject(action.partner_news_updates),
        lastUpdated: action.receivedAt
      }
    case STRATEGIC_PARTNER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state
      }
    default:
      return state
  }
}




const partnerUserLoginsInitialState = {
  items: [],
  itemsMap: {},
  partnerUserLogins: [],
  partnerUserLoginsMap: {},
  fetchingPartnerUserLogins: false,
  savingPartnerUserLogins: false

}

const parnterUserLoginsReducer = (state = partnerUserLoginsInitialState, action) => {
  switch (action.type) {
    case REQUEST_PARTNER_USER_LOGINS:
      return {
        ...state,
        items: [],
        itemsMap: {},
        partnerUserLogins: [],
        partnerUserLoginsMap: {},

        fetchingPartnerUserLogins: true,
        savingPartnerUserLogins: true
      }
    case RECEIVE_PARTNER_USER_LOGINS:
      return {
        ...state,
        savingPartnerUserLogins: false,
        fetchingPartnerUserLogins: false,
        items: action.partner_user_logins,
        itemsMap: Utils.arrayToObject(action.partner_user_logins),
        partnerUserLogins: action.partner_user_logins,
        partnerUserLoginsMap: Utils.arrayToObject(action.partner_user_logins),
        lastUpdated: action.receivedAt
      }
    case STRATEGIC_PARTNER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingPartnerUserLogins: false,
        fetchingPartnerUserLogins: false
      }
    default:
      return state
  }
}


const sharedFilesInitialState = {
  items: [],
  itemsMap: {},
  sharedFiles: [],
  sharedFilesMap: {},
  fetchingSharedFiles: false

}

const sharedFilesReducer = (state = sharedFilesInitialState, action) => {
  switch (action.type) {
    case REQUEST_SHARED_FILES:
      return {
        ...state,
        items: [],
        itemsMap: {},
        sharedFiles: [],
        sharedFilesMap: {},

        fetchingSharedFiles: true,
      }
    case RECEIVE_SHARED_FILES:
      return {
        ...state,
        fetchingSharedFiles: false,
        items: action.shared_files,
        itemsMap: Utils.arrayToObject(action.shared_files),
        sharedFiles: action.shared_files,
        sharedFilesMap: Utils.arrayToObject(action.shared_files),
        lastUpdated: action.receivedAt
      }
    case STRATEGIC_PARTNER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        fetchingSharedFiles: false
      }
    default:
      return state
  }
}




const personContactsInitialState = {
  items: [],
  itemsMap: {},
  personContacts: [],
  personContactsMap: {},
  fetchingPersonContacts: false,
  savingPersonContacts: false

}

const personContactsReducer = (state = personContactsInitialState, action) => {

  switch (action.type) {
    case REQUEST_PERSON_CONTACTS:
      return {
        ...state,
        items: [],
        itemsMap: {},
        personContacts: [],
        personContactsMap: {},

        fetchingPersonContacts: true,
      }
    case RECEIVE_PERSON_CONTACTS:
      return {
        ...state,
        fetchingPersonContacts: false,
        items: action.personContacts,
        itemsMap: Utils.arrayToObject(action.person_contacts),
        personContacts: action.personContacts,
        personContactsMap: Utils.arrayToObject(action.person_contacts),
        lastUpdated: action.receivedAt
      }

    case UPDATE_PERSON_CONTACT_SUCCESS:
      return {
        ...state,
        savingPersonContacts: true
      }
    case UPDATE_PERSON_CONTACT_SUCCESS:
      return {
        ...state,
        savingPersonContacts: false,
        items:
          state.items.map(item => {
            return item.id === action.id ?
              // transform the one with a matching id
              { ...action.person_contact }
              :
              // otherwise return original
              item
          })
      }

    case CREATE_PERSON_CONTACT_REQUEST:
      return {
        ...state,
        savingPersonContacts: true
      }

    case CREATE_PERSON_CONTACT_SUCCESS:
      toast.success('Buyer updated: ' + action.receivedAt)
      return {
        ...state,
        savingPersonContacts: false,
        items: [
          ...state.items,
          action.person_contact
        ]
      }

    case STRATEGIC_PARTNER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingPersonContacts: false,
        fetchingPersonContacts: false
      }
    default:
      return state
  }
}



const strategicPartnersInitialState = {
  items: [],
  itemsMap: {},
  strategicPartners: [],
  strategicPartnersMap: {},
  fetchingStrategicPartners: false

}

const strategicPartnerReducer = (state = strategicPartnersInitialState, action) => {

  switch (action.type) {
    case REQUEST_STRATEGIC_PARTNERS:
      return {
        ...state,
        items: [],
        itemsMap: {},
        strategicPartners: [],
        strategicPartnersMap: {},

        fetchingStrategicPartners: true,
      }
    case RECEIVE_STRATEGIC_PARTNERS:
      return {
        ...state,
        fetchingStrategicPartners: false,
        items: action.strategicpartners,
        itemsMap: Utils.arrayToObject(action.strategicpartners),
        strategicPartners: action.strategicpartners,
        strategicPartnersMap: Utils.arrayToObject(action.strategicpartners),
        lastUpdated: action.receivedAt
      }
    case UPDATE_STRATEGIC_PARTNER_REQUEST:
      return {
        ...state,
        savingStrategicPartner: true
      }
    case UPDATE_STRATEGIC_PARTNER_SUCCESS:
      return {
        ...state,
        savingStrategicPartner: false,
        items:
          state.items.map(item => {
            return item.id === action.id ?
              // transform the one with a matching id
              { ...action.strategicPartner }
              :
              // otherwise return original
              item
          })
      }

    case CREATE_STRATEGIC_PARTNER_REQUEST:
      return {
        ...state,
        savingStrategicPartner: true
      }

    case CREATE_STRATEGIC_PARTNER_SUCCESS:
      toast.success('Buyer updated: ' + action.receivedAt)
      return {
        ...state,
        savingStrategicPartner: false,
        items: [
          ...state.items,
          action.strategicPartner
        ]
      }

    case STRATEGIC_PARTNER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingStrategicPartner: false,
        fetchingStrategicPartner: false
      }
    default:
      return state
  }
}




const strategicPartnerResponsesInitialState = {
  items: {}
}

const strategicPartnerResponsesReducer = (state = strategicPartnerResponsesInitialState, action) => {

  switch (action.type) {
    case REQUEST_STRATEGIC_PARTNER_RESPONSES:
      return {
        ...state,
        fetchingStrategicPartnerResponses: true,
      }
    case RECEIVE_STRATEGIC_PARTNER_RESPONSES:
      return {
        ...state,
        fetchingStrategicPartnerResponses: false,
        items: Utils.arrayToObject(action.responses),
        lastUpdated: action.receivedAt
      }

    case CREATE_STRATEGIC_PARTNER_RESPONSE_REQUEST:
      return {
        ...state,
        updatingStrategicPartnerResponses: true,
      }
    case CREATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS:
      return {
        ...state,
        updatingStrategicPartnerResponses: false,
        items: {
          ...state.items,
          [action.response.id]: action.response
        },
        lastUpdated: action.receivedAt
      }

    case UPDATE_STRATEGIC_PARTNER_RESPONSE_REQUEST:
      return {
        ...state,
        updatingStrategicPartnerResponses: true,
      }
    case UPDATE_STRATEGIC_PARTNER_RESPONSE_SUCCESS:
      return {
        ...state,
        updatingStrategicPartnerResponses: false,
        items: {
          ...state.items,
          [action.response.id]: action.response
        },
        lastUpdated: action.receivedAt
      }

    default:
      return state
  }
}

const ethicalRecruitmentReducer = (state = { items: {} }, action) => {

  switch (action.type) {

    // FETCH
    case REQUEST_ETHICAL_RECRUITMENT_MEETINGS:
      return {
        ...state,
        fetching: true,
      }
    case RECEIVE_ETHICAL_RECRUITMENT_MEETINGS:
      return {
        ...state,
        items: Utils.arrayToObject(action.meetings),
        fetching: false,
      }

    // CREATE
    case CREATE_ETHICAL_RECRUITMENT_MEETING_REQUEST:
      return {
        ...state,
        saving: true
      }
    case CREATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS:
      return {
        ...state,
        saving: false,
        items: {
          ...state.items,
          [action.meeting.id]: action.meeting,
        },
      }

    // UPDATE
    case UPDATE_ETHICAL_RECRUITMENT_MEETING_REQUEST:
      return {
        ...state,
        saving: true
      }
    case UPDATE_ETHICAL_RECRUITMENT_MEETING_SUCCESS:
      return {
        ...state,
        saving: false,
        items: {
          ...state.items,
          [action.meeting.id]: action.meeting,
        },
      }

    default:
      return state
  }
}

const bhrIssuesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_BHR_ISSUE:
      return {
        ...state,
        fetchingBhrIssue: true,
        item: state.item || {}
      }
    case RECEIVE_BHR_ISSUE:
      return {
        ...state,
        fetchingBhrIssue: false,
        item: action.issue,
        lastUpdated: action.receivedAt
      }

    case UPDATE_BHR_ISSUE_REQUEST:
      return {
        ...state,
        updatingBhrIssue: true
      }

    case UPDATE_BHR_ISSUE_SUCCESS:
      return {
        ...state,
        updatingBhrIssue: false,
        item: Object.assign({}, state.item, action.issue)
      }

    case BHR_ISSUE_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        updatingBhrIssue: false,
        fetchingBhrIssue: false
      }

    default:
      return state
  }

}

const bhrResponsesReducer = (state = {}, action) => {


  switch (action.type) {
    case REQUEST_BHR_CRC_RESPONSES:
      return {
        ...state,
        fetchingBhrCRCResponses: true,
        itemscrc: state.itemscrc || {}
      }
    case RECEIVE_BHR_CRC_RESPONSES:
      return {
        ...state,
        fetchingBhrCRCResponses: false,
        itemscrc: Utils.arrayToObject(action.crcresponses),
        lastUpdated: action.receivedAt
      }
    case REQUEST_BHR_RESPONSES:
      return {
        ...state,
        fetchingBhrResponses: true,
        items: state.items || {}
      }
    case RECEIVE_BHR_RESPONSES:
      return {
        ...state,
        fetchingBhrResponses: false,
        items: Utils.arrayToObject(action.responses),
        lastUpdated: action.receivedAt
      }
    case REQUEST_BHR_RESPONSE:
      return {
        ...state,
        fetchingResponse: true,
        items: state.items || {}
      }
    case RECEIVE_BHR_RESPONSE:
      return {
        ...state,
        fetchingResponse: false,
        items: Object.assign({}, state.items, { [action.response.id]: action.response }),
        lastUpdated: action.receivedAt
      }
    case UPDATE_BHR_RESPONSE_REQUEST:
      return {
        ...state,
        savingResponse: true,
        items: state.items || {}
      }
    case UPDATE_BHR_RESPONSE_SUCCESS:
      toast.success('Response updated: ' + action.receivedAt)

      return {
        ...state,
        savingResponse: false,
        items: Object.assign({}, state.items, { [action.response_id]: action.response }),
        lastUpdated: action.receivedAt
      }

    case CREATE_BHR_RESPONSE_REQUEST:
      return {
        ...state,
        savingResponse: true,
        itemscrc: state.itemscrc || {}

      }

    case CREATE_BHR_RESPONSE_SUCCESS:
      toast.success('Response created: ' + action.receivedAt)
      return {
        ...state,
        savingResponse: false,
        items: (action.response.ids) ? Object.assign({}, state.items, Utils.arrayToObject(action.response.ids)) : Object.assign({}, state.items, { [action.response_id]: action.response })
      }

    case UPDATE_BHR_CRC_RESPONSE_REQUEST:
      return {
        ...state,
        savingCRCResponse: true,
        itemscrc: state.itemscrc || {}
      }
    case UPDATE_BHR_CRC_RESPONSE_SUCCESS:
      toast.success('Response updated: ' + action.receivedAt)

      return {
        ...state,
        savingCRCResponse: false,
        itemscrc: Object.assign({}, state.itemscrc, { [action.response_id]: action.response }),
        lastUpdated: action.receivedAt
      }

    case CREATE_BHR_CRC_RESPONSE_REQUEST:
      return {
        ...state,
        itemscrc: Object.assign({}, state.itemscrc, { [action.response_id]: action.response }),
        savingCRCResponse: true
      }
    case CREATE_BHR_CRC_RESPONSE_SUCCESS:
      // toast.success('Response created: ' + action.receivedAt)
      return {
        ...state,
        savingCRCResponse: false,
        // itemscrc: (action.response.ids) ? Object.assign({}, state.itemscrc, Utils.arrayToObject(action.response.ids)) : Object.assign({}, state.itemscrc, { [action.response_id]: action.response })
      }


    case UPDATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST:
      return {
        ...state,
        savingRecruiterCRCResponse: true,
        itemscrc: state.itemscrc || {}
      }
    case UPDATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS:
      toast.success('Response updated: ' + action.receivedAt)

      return {
        ...state,
        savingRecruiterCRCResponse: false,
        itemscrc: Object.assign({}, state.itemscrc, { [action.response_id]: action.response }),
        lastUpdated: action.receivedAt
      }

    case CREATE_BHR_RECRUITER_CRC_RESPONSE_REQUEST:
      return {
        ...state,
        itemscrc: Object.assign({}, state.itemscrc, { [action.response_id]: action.response }),
        savingRecruiterCRCResponse: true
      }
    case CREATE_BHR_RECRUITER_CRC_RESPONSE_SUCCESS:
      // toast.success('Response created: ' + action.receivedAt)
      return {
        ...state,
        savingRecruiterCRCResponse: false,
        // itemscrc: (action.response.ids) ? Object.assign({}, state.itemscrc, Utils.arrayToObject(action.response.ids)) : Object.assign({}, state.itemscrc, { [action.response_id]: action.response })
      }

    case DELETE_BHR_RESPONSE_REQUEST:
      return {
        ...state,
        deletingResponse: true
      }

    case DELETE_BHR_RESPONSE_SUCCESS:
      toast.success('Response Deleted: ' + action.receivedAt)
      if (state.items) {
        delete state.items[action.response_id];
      }
      return {
        ...state,
        items: Object.assign({}, state.items),
        deletingResponse: false
      }

    case DELETE_BHR_CRC_RESPONSE_REQUEST:
      return {
        ...state,
        deletingCrcResponse: true
      }

    case DELETE_BHR_CRC_RESPONSE_SUCCESS:
      toast.success('CRC Response Deleted: ' + action.receivedAt)
      if (state.items) {
        delete state.items[action.response_id];
      }
      return {
        ...state,
        items: Object.assign({}, state.items),
        deletingCrcResponse: false
      }


    case CREATE_BHR_CRC_RESPONSE_ERROR:
      // toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingResponse: false,
        fetchingBhrResponses: false,
        fetchingResponse: false
      }
    case BHR_RESPONSE_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingResponse: false,
        fetchingBhrResponses: false,
        fetchingResponse: false
      }

    default:
      return state
  }

}

const initialRecruitersState = {

  item: {},
  recruiter: {},
  items: [],
  itemsMap: {},
  recruiters: [],
  recruitersMap: {}
}

const recruitersReducer = (state = initialRecruitersState, action) => {

  switch (action.type) {
    case REQUEST_RECRUITER:
      return {
        ...state,
        fetchingRecruiter: true,
        item: {},
        recruiter: {}

      }
    case RECEIVE_RECRUITER:
      return {
        ...state,
        fetchingRecruiter: false,
        item: Object.assign({}, state.items, { [action.recruiter.id]: action.recruiter }),
        recruiter: Object.assign({}, state.items, { [action.recruiter.id]: action.recruiter }),
        lastUpdated: action.receivedAt
      }

    case REQUEST_RECRUITERS:
      return {
        ...state,
        fetchingRecruiters: true,
        items: [],
        itemsMap: {},
        recruiters: [],
        recruitersMap: {},
      }
    case RECEIVE_RECRUITERS:
      return {
        ...state,
        fetchingRecruiters: false,
        items: action.recruiters,
        itemsMap: Utils.arrayToObject(action.recruiters),
        recruiters: action.recruiters,
        recruitersMap: Utils.arrayToObject(action.recruiters),
        lastUpdated: action.receivedAt
      }

    case RECRUITER_ERROR:
      toast.error('There was an error: ' + action.message + ' : ' + action.receivedAt)
      return {
        ...state,
        savingRecruiter: false,
        fetchingRecruiter: false
      }

    default:
      return state
  }
}

const initialSupplyChainState = {
  fetchingSupplyChains: false,
  items: [],
  itemsMap: {},
  supplyChains: [],
  supplyChainsMap: {},
  savingSupplyChain: false,
  item: {}

}

const supplyChainReducer = (state = initialSupplyChainState, action) => {

  switch (action.type) {
    case REQUEST_SUPPLY_CHAINS:
      return {
        ...state,
        fetchingSupplyChains: true,
        items: [],
        itemsMap: {},
        supplyChains: [],
        supplyChainsMap: {}
      }
    case RECEIVE_SUPPLY_CHAINS:
      return {
        ...state,
        fetchingSupplyChains: false,
        items: action.supplychains,
        itemsMap: Utils.arrayToObject(action.supplychains),
        supplyChains: action.supplychains,
        supplyChainsMap: Utils.arrayToObject(action.supplychains),
        lastUpdated: action.receivedAt
      }
    case UPDATE_STRATEGIC_PARTNER_REQUEST:
      return {
        ...state,
        savingSupplyChain: true
      }
    case UPDATE_STRATEGIC_PARTNER_SUCCESS:
      return {
        ...state,
        savingSupplyChain: false,
        item: action.supply_chain
      }

    case CREATE_SUPPLY_CHAIN_REQUEST:
      return {
        ...state,
        savingSupplyChain: true
      }

    case CREATE_SUPPLY_CHAIN_SUCCESS:
      return {
        ...state,
        savingSupplyChain: false,
        item: action.supply_chain
      }

    default:
      return state
  }
}


const supplierCRCReducer = (state = {}, action) => {

  switch (action.type) {

    case REQUEST_SUPPLIER_CRCS:
      return {
        ...state,
        fetchingSupplierCRCS: true,
        items: []
      }
    case RECEIVE_SUPPLIER_CRCS:
      return {
        ...state,
        fetchingSupplierCRCS: false,
        items: action.suppliercrcs,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const recruiterCRCReducer = (state = {}, action) => {

  switch (action.type) {

    case REQUEST_RECRUITER_CRCS:
      return {
        ...state,
        fetchingRecruiterCRCS: true,
        items: []
      }
    case RECEIVE_RECRUITER_CRCS:
      return {
        ...state,
        fetchingRecruiterCRCS: false,
        items: action.recruitercrcs,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const workplaceTypesReducer = (state = {}, action) => {

  switch (action.type) {

    case REQUEST_WORKPLACE_TYPES:
      return {
        ...state,
        fetchingWorkplaceTypes: true,
        items: []
      }
    case RECEIVE_WORKPLACE_TYPES:
      return {
        ...state,
        fetchingWorkplaceTypes: false,
        items: action.workplaceTypes,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const industriesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_INDUSTRIES:
      return {
        ...state,
        fetchingIndustries: true,
        items: []
      }
    case RECEIVE_INDUSTRIES:
      return {
        ...state,
        fetchingIndustries: false,
        items: action.industries,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const subIndustriesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_SUBINDUSTRIES:
      return {
        ...state,
        fetchingSubIndustries: true,
        items: []
      }
    case RECEIVE_SUBINDUSTRIES:
      return {
        ...state,
        fetchingSubIndustries: false,
        items: action.subindustries,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const factoryTypesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_FACTORY_TYPES:
      return {
        ...state,
        fetchingFactoryTypes: true,
        items: []
      }
    case RECEIVE_FACTORY_TYPES:
      return {
        ...state,
        fetchingFactoryTypes: false,
        items: action.factorytypes,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const mmThaiDemandDataReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_MM_THAI_DEMAND_DATA:
      return {
        ...state,
        fetchingMMThaiDemandData: true,
        items: []
      }
    case RECEIVE_MM_THAI_DEMAND_DATA:
      return {
        ...state,
        fetchingMMThaiDemandData: false,
        items: action.mmthaidemanddata,
        mmthaidemanddata: action.mmthaidemanddata,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const issuesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_ALL_ISSUES:
      return {
        ...state,
        fetchingIssues: true,
        items: [],
        issueSaved: false
      }
    case RECEIVE_ALL_ISSUES:
      return {
        ...state,
        fetchingIssues: false,
        items: action.issues,
        lastUpdated: action.receivedAt,
        issueSaved: false
      }
    case REQUEST_ISSUES_BY_CALL_ID:
      return {
        ...state,
        fetchingIssues: true,
        items: [],
        issueSaved: false
      }
    case RECEIVE_ISSUES_BY_CALL_ID:
      return {
        ...state,
        fetchingIssues: false,
        items: action.issues,
        lastUpdated: action.receivedAt,
        issueSaved: false
      }
    case CREATE_ISSUE_REQUEST:
    case UPDATE_ISSUE_REQUEST:
      return {
        ...state,
        savingIssue: true,
        issueSaved: false
      }
    case DELETE_ISSUE_REQUEST:
      return {
        ...state,
        deletingIssue: true,
        issueDeleted: false
      }
    case DELETE_ISSUE_SUCCESS:
      toast.success('Issue deleted: ' + action.receivedAt)
      let items = (state.items) ? state.items : {};
      delete items[action.issue.id];
      return {
        ...state,
        items: Object.assign({ ...items }),
        savingIssue: false,
        issueSaved: true
      }
    case CREATE_ISSUE_SUCCESS:
      toast.success('Issue created : ' + action.receivedAt);
      ((state.items) ? state.items : {})[action.issue.id] = action.issue;
      return {
        ...state,
        items: state.items,
        savingIssue: false,
        issueSaved: true
      }
    case UPDATE_ISSUE_SUCCESS:
      toast.success('Issue updated: ' + action.receivedAt)
      return {
        ...state,
        items: Object.assign({ ...((state.items) ? state.itmes : []), [action.issue.id]: action.issue }),
        savingIssue: false,
        issueSaved: true
      }
    case ISSUE_ERROR:
      toast.error(action.message + ' ' + action.receivedAt)
      return {
        ...state,
        savingIssue: false,
        fetchingIssues: false,
        issueSaved: false
      }
    default:
      return state
  }
}

const initialKpiReducerState = {
  fetcingKPIs: false,
  items: [],
  itemsMap: {},
  kpiitems: [],
  kpiItemsMap: {},
  kpicategoryitems: [],
}

const kpisReducer = (state = initialKpiReducerState, action) => {

  switch (action.type) {
    case REQUEST_KPI_LIST:
      return {
        ...state,
        ...initialKpiReducerState
      }
    case RECEIVE_KPI_LIST:
      return {
        ...state,
        fetchingKPIs: false,
        kpiitems: action.kpis,
        kpiitemsMap: Utils.arrayToObject(action.kpis),
        items: action.kpis,
        itemsMap: Utils.arrayToObject(action.kpis),
        lastUpdated: action.receivedAt
      }
    case REQUEST_KPI_CATEGORY_LIST:
      return {
        ...state,
        fetchingKPICategories: true,
      }
    case RECEIVE_KPI_CATEGORY_LIST:
      return {
        ...state,
        fetchingKPICategories: false,
        kpicategoryitems: action.kpicategories,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const issueCategoriesReducer = (state = {}, action) => {

  switch (action.type) {
    case REQUEST_ISSUE_CATEGORIES:
      return {
        ...state,
        fetchingCategories: true,
        items: {}
      }
    case RECEIVE_ISSUE_CATEGORIES:
      return {
        ...state,
        fetchingCategories: false,
        items: action.categories,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const usersInitialState = {
  items: []
}

const usersReducer = (state = usersInitialState, action) => {

  switch (action.type) {
    case REQUEST_USERS:
      return {
        ...state,
        fetchingUsers: true,
      }
    case RECEIVE_USERS:
      return {
        ...state,
        fetchingUsers: false,
        items: action.users,
        lastUpdated: action.receivedAt
      }
    case REQUEST_DASHBOARDS:
      return {
        ...state,
        fetchingDashboards: true,
        items_dash: {}
      }
    case RECEIVE_DASHBOARDS:
      return {
        ...state,
        fetchingDashboards: false,
        items_dash: action.dashboards,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const businessResponsesInitialState = {
  items: {}
}

const businessResponsesReducer = (state = businessResponsesInitialState, action) => {
  switch (action.type) {

    // FETCH
    case REQUEST_BUSINESS_RESPONSES:
      return {
        ...state,
        fetchingBusinessResponses: true,
      }
    case RECEIVE_BUSINESS_RESPONSES:
      return {
        ...state,
        fetchingBusinessResponses: false,
        items: Utils.arrayToObject(action.responses),
        receivedAt: new Date()
      }

    // CREATE
    case CREATE_BUSINESS_RESPONSE_REQUEST:
      return {
        ...state,
        savingBusinessResponse: true,
      }
    case CREATE_BUSINESS_RESPONSE_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.response.id]: action.response,
        },
        savingBusinessResponse: false,
      }
    case CREATE_BUSINESS_RESPONSE_FAILURE:
      return {
        ...state,
        savingBusinessResponse: false,
      }

    // UPDATE
    case UPDATE_BUSINESS_RESPONSE_REQUEST:
      return {
        ...state,
        savingBusinessResponse: true,
      }
    case UPDATE_BUSINESS_RESPONSE_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.response.id]: action.response,
        },
        savingBusinessResponse: false,
      }
    case UPDATE_BUSINESS_RESPONSE_FAILURE:
      return {
        ...state,
        savingBusinessResponse: false,
      }

    default:
      return state
  }
}

const teamWorkActivitiesInitialState = {
  monthlyWorkerVoice: [],
  fieldworkTypes: {},
  fieldworkPrimaryFocuses: [],
  fieldworkActivities: {},
}

const teamActivityReducer = (state = teamWorkActivitiesInitialState, action) => {
  switch (action.type) {

    // GET ALL FIELDWORK TYPES
    case REQUEST_FIELDWORK_TYPES:
      return {
        ...state,
        fetchingFieldworkTypes: true,
        fieldworkTypes: {}
      }
    case RECEIVE_FIELDWORK_TYPES:
      return {
        ...state,
        fetchingFieldworkTypes: false,
        fieldworkTypes: Utils.arrayToObject(action.fieldworkTypes),
      }

    // GET ALL FIELDWORK PRIMARY FOCUSES
    case REQUEST_FIELDWORK_PRIMARY_FOCUSES:
      return {
        ...state,
        fetchingFieldworkPrimaryFocuses: true,
      }
    case RECEIVE_FIELDWORK_PRIMARY_FOCUSES:
      return {
        ...state,
        fetchingFieldworkPrimaryFocuses: false,
        fieldworkPrimaryFocuses: action.fieldworkPrimaryFocuses,
      }

    // GET ALL FIELDWORK ACTIVITIES
    case REQUEST_FIELDWORK_ACTIVITIES:
      return {
        ...state,
        fetchingFieldworkActivities: true,
        fieldworkActivities: {}
      }
    case RECEIVE_FIELDWORK_ACTIVITIES:
      return {
        ...state,
        fetchingFieldworkActivities: false,
        fieldworkActivities: Utils.arrayToObject(action.fieldworkActivities),
        fetchedFieldworkActivitiesAt: new Date()
      }

    // POST NEW FIELDWORK ACTIVITY
    case CREATE_FIELDWORK_ACTIVITY_REQUEST:
      return {
        ...state,
        savingFieldworkActivity: true,
      }
    case CREATE_FIELDWORK_ACTIVITY_SUCCESS:
      return {
        ...state,
        fieldworkActivities: {
          ...state.fieldworkActivities,
          [action.fieldworkActivity.id]: action.fieldworkActivity,
        },
        savingFieldworkActivity: false,
      }
    case CREATE_FIELDWORK_ACTIVITY_FAILURE:
      return {
        ...state,
        savingFieldworkActivity: false,
      }
      case UPDATE_FIELDWORK_ACTIVITY_REQUEST:
        return {
          ...state,
          savingFieldworkActivity: true,
        }
      case UPDATE_FIELDWORK_ACTIVITY_SUCCESS:
        return {
          ...state,
          fieldworkActivities: {
            ...state.fieldworkActivities,
            [action.fieldworkActivity.id]: action.fieldworkActivity,
          },
          savingFieldworkActivity: false,
        }
      case UPDATE_FIELDWORK_ACTIVITY_FAILURE:
        return {
          ...state,
          savingFieldworkActivity: false,
        }

    // POST NEW MONTHLY WORKER VOICE
    case CREATE_MONTHLY_WORKER_VOICE_REQUEST:
      return {
        ...state,
        creatingMonthlyWorkerVoice: true,
      }
    case CREATE_MONTHLY_WORKER_VOICE_SUCCESS:
      return {
        ...state,
        monthlyWorkerVoice: [
          ...state.monthlyWorkerVoice,
          action.monthlyWorkerVoice
        ],
        creatingMonthlyWorkerVoice: false,
      }
    case CREATE_MONTHLY_WORKER_VOICE_FAILURE:
      return {
        ...state,
        creatingMonthlyWorkerVoice: false,
      }

    default:
      return state
  }
}

const teamTasksReducer = (state = { items: {} }, action) => {
  switch (action.type) {

    // GET TEAM TASKS
    case REQUEST_TEAM_TASKS:
      return {
        ...state,
        fetching: true,
      }
    case RECEIVE_TEAM_TASKS:
      return {
        ...state,
        fetching: false,
        items: Utils.arrayToObject(action.teamTasks),
        receivedAt: action.receivedAt
      }

    // UPDATE TEAM TASK
    case UPDATE_TEAM_TASK_REQUEST:
      return {
        ...state,
        saving: true,
      }
    case UPDATE_TEAM_TASK_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.teamTask.id]: {
            ...state.items[action.teamTask.id],
            ...action.teamTask
          }
        },
        saving: false,
      }

    case UPDATE_TEAM_TASK_FAILURE:
      return {
        ...state,
        saving: false,
      }

    default:
      return state
  }
}



export const gAllILMReducers = {
  workerVoiceCaseCallsReducer: workerVoiceCaseCallsReducer, callChannels, callReasons, allCallTypes, callHHI,
  countriesReducer, provincesReducer, districtsReducer, teamTasksReducer,
  nationalitiesReducer, ethnicitiesReducer, suppliersReducer, ethicalRecruitmentReducer, strategicPartnerReducer,
  strategicPartnerResponsesReducer, workplaceTypesReducer, industriesReducer, recruitersReducer,
  issuesReducer, kpisReducer, issueCategoriesReducer, usersReducer,
  bhrIssuesReducer, bhrResponsesReducer, caseStatusReducer, responseInteractionTypesReducer, businessResponsesReducer,
  teamActivityReducer, clientStatusReducer, clientTypesReducer, caseCategoriesReducer, referralActionsReducer, kpiLegalViolationTypesReducer,
  industriesReducer, subIndustriesReducer, factoryTypesReducer, mmThaiDemandDataReducer, supplierKpiUpdateStatusReducer, supplyChainReducer, supplierCRCReducer,
  recruiterCRCReducer, personContactsReducer, newsUpdatesReducer, sharedFilesReducer, parnterUserLoginsReducer, partnerMessageBoardReducer
};


export const rootILMReducer = combineReducers(gAllILMReducers);

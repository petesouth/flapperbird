import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// Tabs
import NewCallWizardView from "./NewCallWizardView.js"


import SweetAlert from "react-bootstrap-sweetalert";

import utils from "../../services/utils.js";


import { createCall, updateCall, fetchCallById } from "redux/actions/CallActions.js";



export default function InteractionCallView(props) {

  const dispatch = useDispatch();

  const loadedItem = useSelector((state) => state.workerVoiceCaseCallsReducer.call_item);



  const [theState, setTheState] = useState({
    id: undefined,
    loadingData: false,
    alert: null,
    dataItem: undefined,
    isSaving: false,
    cachedUserEnteredData: undefined,
    newWizardForm: (null)
  });

  const setComponentState = (newStateValueObj) => {
    let newState = Object.assign({}, theState, newStateValueObj);
    setTheState(newState);
  }


  const saveCall = (call, allData) => {
    setComponentState({ isSaving: true });

    const allDataLastUserEnteredState = Object.assign({}, allData);

    setTimeout(() => {

      if (call.id !== undefined) {
        dispatch(updateCall(call, (call) => {
          successAlert("Success saving the call with id: " + call.id);

        }, (error) => {
          errorAlert(error, allDataLastUserEnteredState);
        }));

      } else {
        dispatch(createCall(call, (call) => {
          successAlert("Success created a new call with id: " + call.id);
        }, (error) => {
          errorAlert(error, allDataLastUserEnteredState);
        }));
      }

    }, -1);
  }


  const successAlert = (message) => {

    setComponentState({
      isSaving: false,
      alert: (<SweetAlert
        key={utils.giveMeGuid()}
        success
        onConfirm={() => {

          const history_return_view_id = (new URLSearchParams(props.location.search)).get('history_return_view');
          let is_history_return_view = (history_return_view_id !== null &&
            history_return_view_id !== undefined &&
            history_return_view_id !== "");


          props.history.push((is_history_return_view === true) ? history_return_view_id : "/admin/calls");
        }}
        title="Well Done!"
      >
        {message}
      </SweetAlert>)
    });

  }

  const errorAlert = (error, allData) => {
    setComponentState({
      isSaving: false,
      alert: (<SweetAlert
        key={utils.giveMeGuid()}
        error
        onConfirm={() => {
          setComponentState({
            alert: null,
            cachedUserEnteredData: allData,
            loadingData: false,
            isSaving: false,
            newWizardForm: (<NewCallWizardView
              key={utils.giveMeGuid()}
              saveCall={(call, allData) => {
                saveCall(call, allData)
              }}
              allDataWizardSaveState={allData} />)
          });
        }}
        title="Error!"
      >
        {"Error (" + (error) ? error : "Unknown/Generic" + ")"}
      </SweetAlert>)
    });

  };

  
  const idExistsUseEffectAction = (urlId)=> {
    if (theState.loadingData === false && theState.dataItem === undefined) {
      
      dispatch(fetchCallById(urlId));
      setComponentState({ id: urlId,
                          loadingData: true,
                          dataItem: undefined,
                          newWizardForm: null});

    } else if (theState.loadingData === true  && loadedItem !== undefined ) {

      setComponentState( {
        dataItem: loadedItem,
        loadingData: false,
        newWizardForm: (<NewCallWizardView
          key={utils.giveMeGuid()}
          saveCall={(call, allData) => {
            saveCall(call, allData)
          }}
          loadedItem={loadedItem} />)
      });
    }

  }

  useEffect(() => {

    if( theState.cachedUserEnteredData !== undefined) {
      return;
    }
    

  

   const urlId = (new URLSearchParams(props.location.search)).get('id');
    let isUrlIdExist = (urlId !== null &&
      urlId !== undefined &&
      urlId !== "");

    if( isUrlIdExist === true ) {
      idExistsUseEffectAction(urlId);
    } else if( theState.id !== undefined || theState.newWizardForm === null) {
      setComponentState( {
        id: undefined,
        dataItem: undefined,
        loadingData: false,
        newWizardForm: (<NewCallWizardView
          key={utils.giveMeGuid()}
          saveCall={(call, allData) => {
            saveCall(call, allData)
          }}
          loadedItem={undefined} />)
      });
  
    }

  });


  if (theState.isSaving === true) {
    return (<div>Saving Data...</div>);
  }


  if ((theState.loadingData === true)) {
    return (<div>Loading Data...</div>)
  }


  return (<GridContainer>
    {(theState.alert !== null) ? (<GridItem>
      {theState.alert}
    </GridItem>) : (
        <GridItem xs={12}>
          {theState.newWizardForm}
        </GridItem>
      )}

  </GridContainer>);
}

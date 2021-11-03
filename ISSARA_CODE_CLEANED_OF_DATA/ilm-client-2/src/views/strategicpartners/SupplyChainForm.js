import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";


import StrategicPartnersDropdown from "components/ilmdb/StrategicPartnersDropdown.js"
import SuppliersDropdown from "components/ilmdb/SuppliersDropdown.js"

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import sweetAlertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { makeStyles } from "@material-ui/core/styles";
import { createSupplyChain, updateSupplyChain, fetchSupplyChains } from "../../redux/actions/StrategicPartnerActions";

import loginStore from "../../redux/stores/LoginStore";

const customStyle = {
    ...styles,
    ...sweetAlertStyles,
    label: {
        color: 'black',
        fontSize: '14px',
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 400,
        lineHeight: 1.42857,
    },
}

const useStyles = makeStyles(customStyle);


export default function SupplyChainForm(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const supplyChains = useSelector(state => state.supplyChainReducer.items);

    const [payload, setPayload] = useState({
        name: '',
        strategic_partner: null,
        suppliers: null
    })

    const [alert, setAlert] = useState(null)

    const id = new URLSearchParams(props.location.search).get('id') // id from query string of edited strategic partner

    useEffect(() => {
        dispatch(fetchSupplyChains());
    }, [])

    useEffect(() => {

        if (supplyChains && supplyChains.length > 0 && id) {
            const supplyChain = supplyChains.filter(item => { return item.id == id })[0]

            if (supplyChain) {
                setPayload({
                    name: supplyChain.name || '',
                    strategic_partner: supplyChain.strategic_partner,
                    suppliers: supplyChain.suppliers

                })
            }
        }
    }, [supplyChains]);

    const handleConfirmSuccessAlert = () => {
        props.history.push('/admin/supplychains')
    }

    const successAlert = () => {
        setAlert(
            <SweetAlert
                success
                onConfirm={handleConfirmSuccessAlert}
                confirmBtnCssClass={classes.button + " " + classes.success}
                title="Well done!"
            >
                {id ? 'Supply Chain was updated' : 'Supply Chain has been successfully created'}
            </SweetAlert>
        );
    };

    const errorAlert = (error) => {
        let errorMessage = error.message;

        console.log('ERRROR', error)
        setAlert(
            <SweetAlert
                danger
                onConfirm={() => setAlert(null)}
                confirmBtnCssClass={classes.button + " " + classes.success}
                title="Error"
            >
                {errorMessage}
            </SweetAlert>
        );
    };

    const onSubmit = () => {
        const errors = [];

        if (!payload.name || payload.name === '') {
            errors.push("Name must contain a value.");
        }

        if (!payload.strategic_partner) {
            errors.push("strategic_partner must contain a value.");
        }


        if (!payload.suppliers || !payload.suppliers.length || payload.suppliers.length < 1) {
            errors.push("At least one supplier must be selected.");
        }

        if (errors.length > 0) {
            errorAlert({
                message: (<div>{errors.map((error) => {
                    return (<div>{error}<br /><br /></div>);
                })}</div>)
            })
            return;
        }

        if (id) {
            dispatch(updateSupplyChain(id, payload, successAlert, errorAlert))
        }
        else {
            dispatch(createSupplyChain(payload, successAlert, errorAlert))
        }
    }

    return (
        <GridContainer>
            {alert}
            <GridItem xs={12}>
                <Card style={{ marginTop: 0 }}>
                    <CardHeader color="rose" icon>
                        <h4 className={classes.cardIconTitle}>Add/Edit Supply Chain</h4>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} >
                                <CustomInput
                                    id="name"
                                    labelText="Name"
                                    formControlProps={{ fullWidth: true }}
                                    inputProps={{
                                        type: "text",
                                        onChange: e => setPayload({
                                            ...payload,
                                            name: e.target.value
                                        })
                                    }}
                                    value={payload.name}
                                />
                            </GridItem>
                            <GridItem xs={12}>
                                <Card style={{ marginTop: 0 }}>
                                    <CardBody>
                                        <GridContainer>
                                            <GridItem xs={12}>
                                                <StrategicPartnersDropdown
                                                    value={payload.strategic_partner}
                                                    onSelect={partnerId => setPayload({
                                                        ...payload,
                                                        strategic_partner: partnerId
                                                    })}
                                                />
                                            </GridItem>
                                        </GridContainer>
                                    </CardBody>
                                </Card>
                            </GridItem>
                            <GridItem xs={12}>
                                <Card style={{ marginTop: 0 }}>
                                    <CardBody>
                                        <GridContainer>
                                            <GridItem xs={12}>
                                                <SuppliersDropdown
                                                    value={payload.suppliers}
                                                    onSelect={tsuppliers => setPayload({
                                                        ...payload,
                                                        suppliers: tsuppliers
                                                    })}
                                                    multipleselect={true}
                                                />
                                            </GridItem>
                                        </GridContainer>
                                    </CardBody>
                                </Card>
                            </GridItem>

                        </GridContainer>


                        <GridContainer justify='flex-end'>

                            {(() => {
                               return (<div>
                                    {loginStore.isDirectors() === false && <h4>*Please Note: To Add or Edit supply chains you must have 'Directors' Group added to your account .</h4>}
                                    <Button disabled={loginStore.isDirectors() === false} color='success' onClick={onSubmit}>Save</Button>
                                </div>)
                            })()}

                        </GridContainer>


                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer >);
}

import React, { useState, useEffect } from "react";
import {Link, useHistory, pushState} from 'react-router-dom';
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline
} from "@material-ui/core";
import useStyles from "./CheckoutStyles";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
//import Confirmation from "./Confirmation";
import { commerce } from "../../../library/Commerce";

const steps = ["Shipping Address", "Payment Details"];
const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setcheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [is, setIs] = useState(false);
  const history= useHistory();
  const classes = useStyles();

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        }); //generate token
        //console.log("token", token);
        setcheckoutToken(token);
      } catch (error) {
        //console.log(error);
        history.pushState("/");
      }
    };
    generateToken();
  }, [cart]);

  const nextStep = () =>
    setActiveStep((previousActiveStep) => previousActiveStep + 1);

  const backStep = () =>
    setActiveStep((previousActiveStep) => previousActiveStep - 1);

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  const timeout =()=> {
    setTimeout(() => {
      setIs(true)
    }, 3000);
  } 
  let Confirmation = () =>
  //console.log("Checkout order", order);
   order.customer ? (
      <div>
        <div>
          <Typography variant="h5">
            Thank You for your purchase, {order.customer.firstname} {order.customer.lastname}
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
          <br />
          <Button component={Link} to="/" variant="outlined" type="Button">
            Back to home
          </Button>
        </div>
      </div>
    ) : ( <div className={classes.spinner}>
    <CircularProgress /> 
  </div>);
  //is ? (<>Thank You for your Purchase!</>) : (
     
    //);

    if(error){
      <><Typography variant="h5">
          Error: {error}
        </Typography>
        <br/>
        <Button component={Link} to="/" variant="outlined" type="Button">
            Back to home
          </Button>
        </>

    }

  //console.log("At checkout");
  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        nextStep={nextStep}
        //timeout={timeout}
      />
    );

  return (
    <>
    <CssBaseline/>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;

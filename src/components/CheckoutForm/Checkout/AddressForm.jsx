import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import CustomTextField from "./CustomTextField";
import { commerce } from "../../../library/Commerce";
import { Link } from "react-router-dom";
import useStyles from "./CheckoutStyles";


const AddressForm = ({ checkoutToken, next }) => {
  const classes = useStyles();
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");
  const methods = useForm();

  const countryList = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  //console.log("countries", countryList);
  const subdivisionList = Object.entries(
    shippingSubdivisions
  ).map(([code, name]) => ({ id: code, label: name }));

  const options = shippingOptions.map((sO) => ({
    id: sO.id,
    label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
  }));
  console.log("ship", shippingOptions);
  //shipping countries
  //checkouTokenID is a unique id for each check out
  const fetchshippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    // const countries = response.countries;
    //console.log("countries", countries);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingSubdivisions(subdivisions); //plural
    setShippingSubdivision(Object.keys(subdivisions)[0]); //singular
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    region = null
  ) => {
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region }
    );
    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  useEffect(() => {
    fetchshippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision)
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubdivision
      );
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        {(!checkoutToken)?( <> <div className={classes.spinner}> <CircularProgress/> </div></>)
        : (
        <form
          onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision,
              shippingOption,
            })
          )}
        >
          <Grid container spacing={3}>
            <CustomTextField name="firstName" label="First Name" />
            <CustomTextField name="lastName" label="Last Name" />
            <CustomTextField name="address1" label="Address" />
            <CustomTextField name="email" label="Email" />
            <CustomTextField name="city" label="City" />
            <CustomTextField name="zip" label="Zip Postal Code" />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => {
                  setShippingCountry(e.target.value);
                }}
              >
                {countryList.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Sub Division</InputLabel>
              <Select
                value={shippingSubdivision}
                fullWidth
                onChange={(e) => {
                  setShippingSubdivision(e.target.value);
                }}
              >
                {subdivisionList.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth='true'
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button component={Link} to="/cart" variant="outlined">
            Back to Cart
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Next
          </Button>
        </div>
        </form>
        )}
      </FormProvider>
    </>
  );
};

export default AddressForm;

import React from "react";
import logo from "../../assets/commerce.jpg";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  MenuIcon,
  Menu,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import useStyles from "./Navstyles";

const Navbar = ({ cartItems }) => {
  const classes = useStyles();
  const location = useLocation();



  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" className={classes.title} color="inherit">
            <img
              src={logo}
              alt="Commerce"
              height="25px"
              className={classes.image}
            />
            Wahaj's Store
          </Typography>
          <div className={classes.grow} />
          {/**for as much space as needed*/}
          {location.pathname==='/' &&(
          <div className={classes.button}>
            <IconButton
              component={Link}
              to="/cart"
              aria-label="Show cart items"
              color="inherit"
            >
              <Badge badgeContent={cartItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;

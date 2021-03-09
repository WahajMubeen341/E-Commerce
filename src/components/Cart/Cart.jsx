import React from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import CartItem from "./cartItem/CartItem";
import { Link } from "react-router-dom";

import useStyles from "./cartstyles";

const Cart = ({
  Cart,
  handleUpdateCartQty,
  handleRemoveFromCart,
  handleEmptyCart,
}) => {
  console.log("cart item", Cart);
  const classes = useStyles();
  //const isEmpty = (!Cart.line_items.length) //
  //console.log("checkempty", isEmpty);

  const EmptyCart = () => (
    <Link to="/" className={classes.link}>
      <Typography variant="subtitle1">
        You have no Items in your shopping cart, start adding some!
      </Typography>
    </Link>
  );

  const FilledCart = () => (
    <>
      <Grid container spacing={3}>
        {Cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem
              item={item}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant="h4">
          {" "}
          Subtotal: {Cart.subtotal.formatted_with_symbol}
        </Typography>
        <div>
          <Button
            className={classes.emptyButton}
            size="large"
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleEmptyCart}
          >
            Empty Cart
          </Button>
          <Button
            className={classes.checkoutButton}
            size="large"
            type="button"
            variant="contained"
            color="primary"
            component={Link}
            to="/checkout"
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );

  if (!Cart.line_items)
    return (
      <>
        <div className={classes.toolbar} />

        <Typography variant="h1"> Loading...</Typography>
      </>
    );
  else {
    return (
      <Container>
        <div className={classes.toolbar} />
        <Typography className={classes.title} variant="h3" gutterBottom>
          Your Shopping Cart
        </Typography>
        {!Cart.line_items.length ? <EmptyCart /> : <FilledCart />}
        <div className={classes.toolbar} />
      </Container>
    );
  }
};
export default Cart;

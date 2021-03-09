import React, { useState, useEffect } from "react";
import "./App.css";
import { CircularProgress } from "@material-ui/core";
import Products from "./components/Products";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckoutForm/Checkout/Checkout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { commerce } from "./library/Commerce"; // Commerce will be used for all kinds of store actions
function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = React.useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  //---------FETCH PORDUCTS-------------
  const fetchProducts = async () => {
    const { data } = await commerce.products.list(); // fetch and set products in data
    setProducts(data);
    //console.log("data", data); //shows on console
    console.log("products", products); // doesn't show on console
  };
  //--------___FECTH CART------------

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  //---------ADD to cart-----
  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity,[]);
    setCart(item.cart);
  };

  //to update cart quantity
  const handleUpdateCartQty = async (productId, quantity) => {
    const response = await commerce.cart.update(productId, { quantity });
    setCart(response.cart);
  };

  // remove from cart
  const handleRemoveFromCart = async (productId) => {
    const response = await commerce.cart.remove(productId);
    setCart(response.cart);
  };

  //Empty Cart
  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();
    setCart(response.cart);
    console.log("empty clicked");
  };

  //refersh cart after order completion
  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    console.log("Capturing Checkout", newOrder);
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      console.log("incoming Order is:", incomingOrder);
      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
    //console.log("in useEffect",pro  ducts);
  }, []);

  console.log("cart", cart);
  return (
    <Router>
      <div className="App">
        <Navbar cartItems={cart.total_items} />

        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path="/cart">
            <Cart
              Cart={cart}
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveFromCart={handleRemoveFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>
          <Route exact path="/checkout">
            <Checkout
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

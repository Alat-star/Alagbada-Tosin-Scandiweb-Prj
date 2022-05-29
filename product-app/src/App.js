import React, { Component } from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretLeft,
  faCaretRight,
  faRefresh,
  faShoppingCart,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { flowRight as compose, uniqBy } from "lodash";
import { graphql } from "@apollo/client/react/hoc";

//component

import Header from "./components/Header";
import Home from "./components/Home";
import Clothes from "./components/Clothes";
import Tech from "./components/Tech";
import Pdp from "./components/Pdp";
import Cart from "./components/Cart";
import Overlay from "./components/Overlay";

//query
import { PRODUCT_QUERY } from "./components/queries/queries";

library.add(
  faShoppingCart,
  faRefresh,
  faCaretLeft,
  faCaretRight,
  faPlus,
  faMinus
);

export class App extends Component {
  constructor(props) {
    super(props);
    this.getCurrencySymbol.bind(this);
    this.getAProductId.bind(this);
    this.getCartItems.bind(this);
    this.getCartProps.bind(this);
    this.incrementCount.bind(this);
    this.decrementCount.bind(this);
    this.handleNextImage.bind(this);
    this.handlePrevImage.bind(this);
    this.overlayToggle.bind(this);
    this.cartQtyToggle.bind(this);

    this.state = {
      currency: "$",
      productSelected: null,
      cartItems: [],
      cartProps: [],
      items: [],
      total: 0,
      tax: null,
      quantity: null,
      symbol: null,
      displayOverlay: false,
      displayCartQty: false,
    };
  }

  overlayToggle = () => {
    this.setState({ displayOverlay: !this.state.displayOverlay });
  };

  cartQtyToggle = () => {
    if (this.state.cartItems.length > 0) {
      this.setState({ displayCartQty: true });
    }
  };

  getCurrencySymbol = (symbol) => {
    this.setState({ currency: symbol });
  };

  getAProductId = (name) => {
    this.setState({ productSelected: name });
  };

  getCartItems = (item) => {
    if (this.state.cartItems.includes(item)) {
      return;
    }
    this.setState((prev) => ({ cartItems: [...prev.cartItems, item] }));
  };

  getCartProps = (item) => {
    if (this.state.cartProps.length) {
      let compare;
      this.state.cartProps.map((prop) => {
        if (prop.id === item.id && prop.attr === item.attr) {
          compare = true;
        }
      });
      if (!compare) {
        this.setState((prev) => ({ cartProps: [item, ...prev.cartProps] }));
          return
      }
      
      this.setState((prev) => ({
        cartProps: prev.cartProps.map((prop) => {
          if (prop.id === item.id && prop.attr === item.attr) {
            return {
              ...prop,
              value: item.value,
            };
          }
          return prop;
        }),
      }));
      return;
    }

    this.setState((prev) => ({ cartProps: [item, ...prev.cartProps] }));
  };

  generateCartObj() {
    const arr = [];

    this.state.cartItems.map((item) => {
      arr.push({
        id: item,
        current: 0,
        count: 1,
      });
    });
    this.setState((prevState) => ({
      items: uniqBy([...prevState.items, ...arr], "id"),
    }));
  }

  incrementCount = (id) => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) => {
        if (id !== item.id) {
          return item;
        }
        return {
          ...item,
          count: item.count + 1,
        };
      }),
    }));
  };

  decrementCount = (id) => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) => {
        if (id !== item.id) {
          return item;
        }
        return {
          ...item,
          count: item.count == 1 ? (item.count = 1) : item.count - 1,
        };
      }),
    }));
  };

  handleNextImage = (id, total) => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) => {
        if (id !== item.id) {
          return item;
        }
        return {
          ...item,
          current: item.current === total ? 0 : item.current + 1,
        };
      }),
    }));
  };

  handlePrevImage = (id, total) => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) => {
        if (id !== item.id) {
          return item;
        }
        return {
          ...item,
          current: item.current === 0 ? total - 1 : item.current - 1,
        };
      }),
    }));
  };

  getTotal = () => {
    const data = this.props.PRODUCT_QUERY;
    let sum = 0;
    let currSymbol = "";

    this.state.items.map((item) => {
      data.category.products.map((product) => {
        if (product.id === item.id) {
          product.prices.map((price) => {
            const symbol = price.currency.symbol;
            const inputSymbol = this.state.currency.split(" ").includes(symbol);
            if (inputSymbol) {
              sum += price.amount * item.count;
              currSymbol = symbol;
            }
          });
        }
      });
    });
    this.setState({ total: Math.round((sum + Number.EPSILON) * 100) / 100 });
    this.setState({ symbol: currSymbol });
  };

  getQuantity() {
    let quantity = 0;
    this.state.items.map((item) => (quantity += item.count));
    this.setState({ quantity: quantity });
  }

  getTax() {
    this.setState({
      tax: Math.round((this.state.total * 0.21 + Number.EPSILON) * 100) / 100,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items !== this.state.items) {
      this.getTotal();
      this.getQuantity();
      this.getTax();
    }

    if (prevState.total !== this.state.total) {
      this.getTotal();
      this.getTax();
    }
    if (prevState.currency !== this.state.currency) {
      this.getTotal();
      this.getTax();
    }

    if (prevState.cartItems !== this.state.cartItems) {
      this.generateCartObj();
      this.cartQtyToggle();
    }
  }

  render() {
    return (
      <HashRouter>
        <div className="app-wrapper">
          <Header
            getCurrencySymbol={this.getCurrencySymbol}
            overlayToggle={this.overlayToggle}
            quantity={this.state.quantity}
            displayCartQty={this.state.displayCartQty}
            displayOverlay={this.state.displayOverlay}
          />
          <Overlay
            cartArr={this.state.cartItems}
            currency={this.state.currency}
            displayOverlay={this.state.displayOverlay}
            overlayToggle={this.overlayToggle}
            items={this.state.items}
            total={this.state.total}
            symbol={this.state.symbol}
            cartProps={this.state.cartProps}
            quantity={this.state.quantity}
            incrementCount={this.incrementCount}
            decrementCount={this.decrementCount}
          />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Home
                  getAProductId={this.getAProductId}
                  currency={this.state.currency}
                />
              }
            />
            <Route
              exact
              path="/clothes"
              element={
                <Clothes
                  currency={this.state.currency}
                  getAProductId={this.getAProductId}
                />
              }
            />
            <Route
              exact
              path="/tech"
              element={
                <Tech
                  currency={this.state.currency}
                  getAProductId={this.getAProductId}
                />
              }
            />
            <Route
              exact
              path="/pdp"
              element={
                <Pdp
                  id={this.state.productSelected}
                  currency={this.state.currency}
                  getCartItems={this.getCartItems}
                  getCartProps={this.getCartProps}
                />
              }
            />
            <Route
              exact
              path="/cart"
              element={
                <Cart
                  cartArr={this.state.cartItems}
                  currency={this.state.currency}
                  items={this.state.items}
                  total={this.state.total}
                  symbol={this.state.symbol}
                  tax={this.state.tax}
                  quantity={this.state.quantity}
                  cartProps={this.state.cartProps}
                  incrementCount={this.incrementCount}
                  decrementCount={this.decrementCount}
                  handleNextImage={this.handleNextImage}
                  handlePrevImage={this.handlePrevImage}
                />
              }
            />
          </Routes>
        </div>
      </HashRouter>
    );
  }
}

export default compose(graphql(PRODUCT_QUERY, { name: "PRODUCT_QUERY" }))(App);

import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsCart } from "react-icons/bs";
import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { CATEGORY_QUERY, CURRENCIES_QUERY } from "./queries/queries";
import { v4 as uniqid } from "uuid";

export class Header extends Component {
  constructor(props) {
    super(props);
    this.handleChange.bind(this);
    this.overlayHandler.bind(this);
    this.overlayHandlerTwo.bind(this);
  }

  overlayHandler = () => {
    if (this.props.displayOverlay) {
      this.props.overlayToggle();
      return;
    }
    this.props.overlayToggle();
    return;
  };

  overlayHandlerTwo = () => {
    if (this.props.displayOverlay) {
      this.props.overlayToggle();
      return;
    }
  };

  //Category bar
  categoryMenu() {
    const data = this.props.CATEGORY_QUERY;
    if (data.loading) {
      return "Loading...";
    }

    if (data.error) {
      return <pre>{data.error.message}</pre>;
    }
    return (
      <ul>
        {data.categories.map((category) => {
          let path;
          if (category.name === "all") path = "/";
          else if (category.name === "clothes") path = "/clothes";
          else if (category.name === "tech") path = "/tech";
          else path = "/";
          return (
            <li onClick={() => this.overlayHandlerTwo()} key={uniqid()}>
              <NavLink to={path} activeClassName="active" className="menu-link">
                {category.name}
              </NavLink>
            </li>
          );
        })}
      </ul>
    );
  }

  //currency switcher
  currencyMenu() {
    const data = this.props.CURRENCIES_QUERY;

    if (data.loading) {
      return <option disabled>Loading currency</option>;
    }

    if (data.error) {
      return <pre>{data.error.message}</pre>;
    }
    return data.currencies.map((curr) => {
      return (
        <option key={curr.symbol}>
          {curr.symbol} {curr.label}
        </option>
      );
    });
  }

  handleChange = (value) => {
    this.props.getCurrencySymbol(value);
  };

  render() {
    return (
      <div className="navBar">
        <div className="menu-left">{this.categoryMenu()}</div>
        <div className="middle-menu">
          <FontAwesomeIcon
            color="rgba(255, 255, 255, 1)"
            icon={["fas", "refresh"]}
            size="xs"
          />
        </div>
        <div className="menu-right">
          <select
            onChange={(e) => {
              this.handleChange(e.target.value);
            }}
          >
            <option>$</option>
            {this.currencyMenu()}
          </select>
          <div>
            <a
              onClick={() => this.overlayHandler()}
              style={{ fontSize: "25px", color: "black" }}
              className="overlay-link"
            >
              <BsCart />
            </a>
            <span
              className={
                this.props.displayCartQty ? "cart-pointer" : "hide-cart-pointer"
              }
            >
              {this.props.quantity}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(CATEGORY_QUERY, { name: "CATEGORY_QUERY" }),
  graphql(CURRENCIES_QUERY, { name: "CURRENCIES_QUERY" })
)(Header);

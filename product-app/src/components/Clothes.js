import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { PRODUCT_QUERY } from "./queries/queries";
import { v4 as uniqid } from "uuid";

export class Clothes extends Component {
  constructor(props) {
    super(props);
    this.clickHandler.bind.bind(this);
  }

  clickHandler = (name) => {
    this.props.getAProductId(name);
  };

  getClothes() {
    const data = this.props.PRODUCT_QUERY;
    if (data.loading) {
      return "Loading...";
    }
    if (data.error) {
      return <pre>{data.error.message}</pre>;
    }
    return data.category.products.map((item) => {
      const name = item.category === "clothes";
      if (name && !item.inStock) {
        return (
          <div
            key={uniqid()}
            className="card"
          >
            <div className="img-container">
              <img src={item.gallery[0]} alt="item.name" />
              <div className='div-img-overlay'>OUT OF STOCK</div>
            </div>

            <div className="out-of-stock-price-div">
              <span>
                {item.brand} {item.name}
              </span>
              {item.prices.map((price) => {
                const symbol = price.currency.symbol;
                const inputSymbol = this.props.currency
                  .split(" ")
                  .includes(symbol);
                return (
                  inputSymbol && (
                    <span key={uniqid()}>
                      {symbol} {price.amount}
                    </span>
                  )
                );
              })}
            </div>
          </div>
        );
      }
      return (
        name && (
          <Link key={uniqid()} to="/pdp">
            <div
              key={uniqid()}
              onClick={(e) => {
                this.clickHandler(item.id);
              }}
              className="card"
            >
              <div className="img-container">
                <img src={item.gallery[0]} alt="item.name" />
              </div>

              <div className="price-div">
                <span>
                  {item.brand} {item.name}
                </span>
                {item.prices.map((price) => {
                  const symbol = price.currency.symbol;
                  const inputSymbol = this.props.currency
                    .split(" ")
                    .includes(symbol);
                  return (
                    inputSymbol && (
                      <span key={uniqid()}>
                        {symbol} {price.amount}
                      </span>
                    )
                  );
                })}
              </div>
            </div>
          </Link>
        )
      );
    });
  }

  render() {
    return (
      <div className="home-div">
        <h1>Clothes</h1>
        <div className="product-container">{this.getClothes()}</div>
      </div>
    );
  }
}
export default compose(graphql(PRODUCT_QUERY, { name: "PRODUCT_QUERY" }))(
  Clothes
);

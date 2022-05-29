import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { PRODUCT_QUERY } from "./queries/queries";
import {v4 as uniqid} from 'uuid';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.clickHandler.bind.bind(this);
  }

  clickHandler = (name) => {
    this.props.getAProductId(name);
  };

  getProducts() {
    const data = this.props.PRODUCT_QUERY;
    if (data.loading) {
      return "Loading...";
    }
    if (data.error) {
      return <pre>{data.error.message}</pre>;
    }
    return data.category.products.map((item) => {
      if(!item.inStock){
        return(
          <div
            className="card"
            key={uniqid()}
          >
            <div className="img-container">
              <img src={item.gallery[0]} alt="item.name" />
              <div className='div-img-overlay'>OUT OF STOCK</div>
            </div>

            <div className="out-of-stock-price-div">
              <span>{item.brand} {item.name}</span>
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
        )
      }
      return (
        <Link key={uniqid()} to='/pdp'>
          <div
            onClick={(e) => {
              this.clickHandler(item.id);
            }}
            className="card"
            key={uniqid()}
          >
            <div className="img-container">
              <img src={item.gallery[0]} alt="item.name" />
            </div>

            <div className="price-div">
              <span>{item.brand} {item.name}</span>
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
      );
    });
  }
  render() {
    return (
      <div className="home-div">
        <h1>All Products</h1>
        <div className="product-container">{this.getProducts()}</div>
      </div>
    );
  }
}
export default compose(graphql(PRODUCT_QUERY, { name: "PRODUCT_QUERY" }))(Home);

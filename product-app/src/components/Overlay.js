import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { PRODUCT_QUERY } from "./queries/queries";
import { v4 as uniqid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Overlay extends Component {
  constructor(props) {
    super(props);
    this.incrementHandler.bind(this);
    this.decrementHandler.bind(this);
    this.overlayHandler.bind(this);
  }

  incrementHandler = (id) => {
    this.props.incrementCount(id);
  };

  decrementHandler = (id) => {
    this.props.decrementCount(id);
  };

  overlayHandler = () => {
    this.props.overlayToggle();
  };

  //
  getCartProducts() {
    const data = this.props.PRODUCT_QUERY;
    if (data.loading) {
      return "Loading...";
    }
    if (data.error) {
      return <pre>{data.error.message}</pre>;
    }

    const result =
      this.props.cartArr.length > 0 &&
      data.category.products.map((product) => {
        if (this.props.cartArr.includes(product.id)) {
          return (
            <div key={uniqid()} className="cart-div">
              <div key={product.id} className="overlay-description-div">
                <div>
                  <span className="overlay-p-brand p-brand">
                    {product.brand}
                  </span>
                  <span className="overlay-p-name p-name">{product.name}</span>
                </div>
                <div className="price-div">
                  {product.prices.map((price) => {
                    const symbol = price.currency.symbol;
                    const inputSymbol = this.props.currency
                      .split(" ")
                      .includes(symbol);
                    return (
                      inputSymbol && (
                        <span
                          key={uniqid()}
                          className="overlay-p-price cart-p-price"
                        >
                          {symbol} {price.amount}
                        </span>
                      )
                    );
                  })}
                </div>
                <div>
                  {product.attributes.map((attr) => {
                    if (attr.name === "Color") {
                      return (
                        <div key={uniqid()} className="overlay-p-attr p-attr">
                          <span className="overlay-p-tag p-tag">
                            {attr.name}:
                          </span>
                          <div className="overlay-attr-div attr-div">
                            {attr.items.map((prop) => {
                              let output;
                              this.props.cartProps.map((j) => {
                                if (
                                  prop.value === j.value &&
                                  product.id === j.id
                                ) {
                                  output = (
                                    <div
                                      className="overlay-t1-attr t1-attr"
                                      key={uniqid()}
                                      style={{
                                        backgroundColor: prop.value,
                                        border:
                                          "3px solid rgba(94, 206, 123, 1)",
                                      }}
                                    ></div>
                                  );
                                  return;
                                }
                                output = (
                                  <div
                                    className="overlay-t1-attr t1-attr"
                                    key={uniqid()}
                                    style={{ backgroundColor: prop.value }}
                                  ></div>
                                );
                                return;
                              });
                              return output;
                            })}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="overlay-p-attr p-attr">
                          <span className="overlay-p-tag p-tag">
                            {attr.name}:
                          </span>
                          <div className="overlay-attr-div attr-div">
                            {attr.items.map((prop) => {
                              let output;
                              this.props.cartProps.map((j) => {
                                if (
                                  prop.value === j.value &&
                                  product.id === j.id
                                ) {
                                  output = (
                                    <div
                                      key={uniqid()}
                                      className="overlay-t2-attr t2-attr"
                                      style={{
                                        background: "rgba(29, 31, 34, 1)",
                                        color: "#fff",
                                      }}
                                    >
                                      {prop.value}
                                    </div>
                                  );
                                  return;
                                }
                                output = (
                                  <div
                                    key={uniqid()}
                                    className="overlay-t2-attr t2-attr"
                                  >
                                    {prop.value}
                                  </div>
                                );
                                return;
                              });
                              return output;
                            })}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="overlay-ctrl-container ctrl-container">
                <div className="overlay-ctrl-box ctrl-box">
                  <span
                    className="overlay-counter counter"
                    onClick={() => this.incrementHandler(product.id)}
                  >
                    <FontAwesomeIcon size="xs" icon="fas fa-plus" />
                  </span>
                  <div>
                    {this.props.items.map((item) => {
                      if (item.id === product.id) {
                        return (
                          <span
                            className="overlay-count cart-count"
                            key={uniqid()}
                          >
                            {item.count}
                          </span>
                        );
                      }
                    })}
                  </div>
                  <span
                    className="overlay-counter counter"
                    onClick={() => this.decrementHandler(product.id)}
                  >
                    <FontAwesomeIcon size="xs" icon="fas fa-minus" />
                  </span>
                </div>
                <div className="slider-div">
                  {this.props.items.map((item) => {
                    if (item.id === product.id) {
                      return (
                        <div key={uniqid()}>
                          <div>
                            <img
                              src={product.gallery[0]}
                              className="overlay-slider-image slider-image"
                              alt="product visual"
                            />
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          );
        }
      });

    return result;
  }
  render() {
    return (
      <div
        className={this.props.displayOverlay ? "show-overlay" : "hide-overlay"}
      >
        <div className="overlay-box">
          <div>
            <span>My bag,</span>
            <span>{this.props.quantity} items</span>
          </div>
          {this.getCartProducts()}
          <div className="overlay-total-div">
            <span className="overlay-total-tag">Total</span>
            <span className="overlay-total">
              {this.props.symbol} {this.props.total}
            </span>
          </div>
          <div>
            <button
              className="overlay-btn"
              onClick={() => this.overlayHandler()}
            >
              <Link to="/cart">VIEW BAG</Link>
            </button>

            <button>CHECK OUT</button>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(graphql(PRODUCT_QUERY, { name: "PRODUCT_QUERY" }))(
  Overlay
);

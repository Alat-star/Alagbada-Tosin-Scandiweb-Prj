import React, { Component } from "react";
import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { PRODUCT_QUERY } from "./queries/queries";
import { v4 as uniqid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Cart extends Component {
  constructor(props) {
    super(props);
    this.incrementHandler.bind(this);
    this.decrementHandler.bind(this);
    this.nextImageHandler.bind(this);
    this.prevImageHandler.bind(this);
  }

  incrementHandler = (id) => {
    this.props.incrementCount(id);
  };

  decrementHandler = (id) => {
    this.props.decrementCount(id);
  };

  nextImageHandler = (a, b) => {
    this.props.handleNextImage(a, b);
  };

  prevImageHandler = (a, b) => {
    this.props.handlePrevImage(a, b);
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
              <div
                key={product.id}
                className="cart-description-div description-div"
              >
                <div>
                  <span className="p-brand">{product.brand}</span>
                  <span className="p-name">{product.name}</span>
                </div>
                <div className="price-div">
                  {product.prices.map((price) => {
                    const symbol = price.currency.symbol;
                    const inputSymbol = this.props.currency
                      .split(" ")
                      .includes(symbol);
                    return (
                      inputSymbol && (
                        <span key={uniqid()} className="cart-p-price">
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
                        <div key={uniqid()} className="p-attr">
                          <span className="p-tag">{attr.name}:</span>
                          <div className="attr-div">
                            {attr.items.map((prop) => {
                              let output;
                              this.props.cartProps.map((j) => {
                                if (
                                  prop.value === j.value &&
                                  product.id === j.id
                                ) {
                                  output = (
                                    <div
                                      className="t1-attr"
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
                                    className="t1-attr"
                                    key={uniqid()}
                                    style={{ backgroundColor: prop.value }}
                                  ></div>
                                );
                                return;
                              });
                              return output
                            })}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="p-attr">
                          <span className="p-tag">{attr.name}:</span>
                          <div className="attr-div">
                            {attr.items.map((prop) => {
                              let result;
                              this.props.cartProps.map((i) => {
                                if (
                                  prop.value === i.value &&
                                  product.id === i.id
                                ) {
                                  result = (
                                    <div
                                      key={uniqid()}
                                      className="t2-attr"
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
                                result = (
                                  <div key={uniqid()} className="t2-attr">
                                    {prop.value}
                                  </div>
                                );
                                return;
                              });
                              return result;
                            })}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="ctrl-container">
                <div className="ctrl-box">
                  <span
                    className="counter"
                    onClick={() => this.incrementHandler(product.id)}
                  >
                    <FontAwesomeIcon size="xs" icon="fas fa-plus" />
                  </span>
                  <div>
                    {this.props.items.map((item) => {
                      if (item.id === product.id) {
                        return (
                          <span className="cart-count" key={uniqid()}>
                            {item.count}
                          </span>
                        );
                      }
                    })}
                  </div>
                  <span
                    className="counter"
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
                          {product.gallery.map((image, index) => {
                            return (
                              <div
                                key={index}
                                className={
                                  index === item.current
                                    ? "active-slide"
                                    : "slide"
                                }
                              >
                                {index === item.current && (
                                  <img
                                    src={image}
                                    className="slider-image"
                                    alt="product visual"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  })}
                  <div className="slider-ctrl">
                    <span
                      onClick={() =>
                        this.prevImageHandler(
                          product.id,
                          product.gallery.length
                        )
                      }
                    >
                      <FontAwesomeIcon size="xs" icon="fas fa-caret-left" />
                    </span>
                    <span
                      onClick={() =>
                        this.nextImageHandler(
                          product.id,
                          product.gallery.length
                        )
                      }
                    >
                      <FontAwesomeIcon size="xs" icon="fas fa-caret-right" />
                    </span>
                  </div>
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
      <div className="home-div">
        <h1>Cart</h1>
        {this.getCartProducts()}
        <div className="cart-data">
          <div>
            <span>Tax 21%:</span>
            <span>
              {this.props.symbol} {this.props.tax}
            </span>
          </div>
          <div>
            <span>Quantity:</span>
            <span>{this.props.quantity}</span>
          </div>
          <div>
            <span className="total-tag">Total:</span>
            <span>
              {this.props.symbol} {this.props.total}
            </span>
          </div>
          <div>
            <button>ORDER</button>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(graphql(PRODUCT_QUERY, { name: "PRODUCT_QUERY" }))(Cart);

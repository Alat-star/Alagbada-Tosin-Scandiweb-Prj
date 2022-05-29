import React, { Component } from "react";
import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { GET_PRODUCT_QUERY } from "./queries/queries";
import { v4 as uniqid } from "uuid";

const styles = {
  selected: {
    backgroundColor: "rgba(29, 31, 34, 1)",
    color: "rgba(255, 255, 255, 1)",
  },
};

export class Pdp extends Component {
  constructor(props) {
    super(props);
    this.addToCart.bind(this);
    this.addCartProps.bind(this);
    this.state = {
      selected: -1,
      selectedColor: -1,
    };
  }

  addToCart = (product) => {
    this.props.getCartItems(product);
  };

  setIndexColor = (index) => {
    this.setState({
      selected: index,
    });
  };

  setIndexBColor = (index) => {
    this.setState({
      selectedColor: index,
    });
  };

  addCartProps = (id, attr, value) => {
    const productObj = {
      id: id,
      attr: attr,
      value: value,
    };
    this.props.getCartProps(productObj);
  };

  displayProductDetails() {
    const { product } = this.props.GET_PRODUCT_QUERY;
    if (product) {
      return (
        <div className="pdp-container">
          <div className="pdp-img-container">
            <div className="pdp-img-one">
              {product.gallery.map((item) => {
                return <img key={uniqid()} src={item} alt="Product image" />;
              })}
            </div>
            <div>
              <img src={product.gallery[0]} alt="Product image" />
            </div>
          </div>
          <div className="description-div">
            <div>
              <span className="p-brand">{product.brand}</span>
              <span className="p-name">{product.name}</span>
            </div>
            <div>
              {product.attributes.map((attr) => {
                if (attr.name === "Color") {
                  return (
                    <div key={uniqid()} className="p-attr">
                      <span className="p-tag">{attr.name}:</span>
                      <div className="attr-div">
                        {attr.items.map((prop, index) => {
                          return (
                            <div
                              key={uniqid()}
                              onClick={() => {
                                this.addCartProps(
                                  product.id,
                                  attr.name,
                                  prop.value
                                );
                                this.setIndexBColor(index);
                              }}
                              className={
                                this.state.selectedColor === index
                                  ? "selected-color t1-attr"
                                  : "t1-attr"
                              }
                              style={{ backgroundColor: prop.value }}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={uniqid()} className="p-attr">
                      <span className="p-tag">{attr.name}:</span>
                      <div className="attr-div">
                        {attr.items.map((prop, index) => {
                          return (
                            <div
                              onClick={() => {
                                this.addCartProps(
                                  product.id,
                                  attr.name,
                                  prop.value
                                );
                                this.setIndexColor(index);
                              }}
                              key={uniqid()}
                              className={
                                this.state.selected === index
                                  ? "selected t2-attr"
                                  : "t2-attr"
                              }
                            >
                              {prop.value}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <div>
              <span className="p-tag">PRICE:</span>
              {product.prices.map((price) => {
                const symbol = price.currency.symbol;
                const inputSymbol = this.props.currency
                  .split(" ")
                  .includes(symbol);
                return (
                  inputSymbol && (
                    <span key={uniqid()} className="p-price">
                      {symbol} {price.amount}
                    </span>
                  )
                );
              })}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  this.addToCart(product.id);
                }}
                className="p-btn"
              >
                ADD TO CART
              </button>
              <div
                className="p-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></div>
            </div>
          </div>
        </div>
      );
    }
  }
  render() {
    return <div>{this.displayProductDetails()}</div>;
  }
}

export default compose(
  graphql(
    GET_PRODUCT_QUERY,
    { name: "GET_PRODUCT_QUERY" },
    {
      options: (props) => {
        return {
          variables: {
            id: props.id,
          },
        };
      },
    }
  )
)(Pdp);

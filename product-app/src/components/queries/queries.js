import { gql } from "@apollo/client";

const PRODUCT_QUERY = gql`
  {
    category {
      products {
        id
        name
        category
        inStock
        brand
        gallery
        prices {
          amount
          currency {
            symbol
            label
          }
        }
        attributes {
          id
          name
          type
          items {
            displayValue
            id
            value
          }
        }
      }
    }
  }
`;

const CATEGORY_QUERY = gql`
  {
    categories {
      name
    }
  }
`;

const CURRENCIES_QUERY = gql`
  {
    currencies {
      label
      symbol
    }
  }
`;

const GET_PRODUCT_QUERY = gql`
  query Product($id: String!) {
    product(id: $id) {
      name
      id
      brand
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          id
          value
        }
      }
      prices {
        amount
        currency {
          symbol
          label
        }
      }
    }
  }
`;

export { PRODUCT_QUERY, CATEGORY_QUERY, CURRENCIES_QUERY, GET_PRODUCT_QUERY };

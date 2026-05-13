import path from 'path';

export const DATA_PATH = path.resolve(__dirname, '../data/addresses.json');

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const CREATE_ADDRESS = `
  mutation CreateAddress($username: String!, $address: AddressInput!) {
    createAddress(username: $username, address: $address) {
      street
      city
      zipcode
      state
    }
  }
`;

export const GET_ADDRESS = `
  query GetAddress($username: String!) {
    address(username: $username) {
      street
      city
      zipcode
      state
    }
  }
`;
'use server'

import { Tableland } from '@tableland/sdk';

// Initialize the Tableland SDK
const tableland = new Tableland({
  network: 'testnet', // or 'mainnet'
  chainId: 1, // Ethereum mainnet or other supported chains
});

// Connect to the Tableland network
await tableland.connect();

// Create a table to store messages and smart contract addresses
const createTableQuery = `
  CREATE TABLE message_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role TEXT,
    content TEXT,
    smart_contract_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;
await tableland.execute(createTableQuery);

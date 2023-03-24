const fs = require("fs");

const adminDID = String(process.env.CERAMIC_DID_KEY);
const config = {
  anchor: {},
  "http-api": {
    "cors-allowed-origins": [".*"],
    "admin-dids": [adminDID],
  },
  ipfs: {
    mode: "bundled",
  },
  logger: {
    "log-level": 2,
    "log-to-files": false,
  },
  metrics: {
    "metrics-exporter-enabled": false,
    "metrics-port": 9090,
  },
  network: {
    name: "testnet-clay",
  },
  node: {
    "stream-cache-limit": 10,
  },
  "state-store": {
    mode: "fs",
    "local-directory": "./.ceramic/statestore/",
  },
  indexing: {
    db: "sqlite:./.ceramic/indexing.sqlite",
    "allow-queries-before-historical-sync": true,
  },
};

fs.writeFileSync("daemon.config.json", JSON.stringify(config), (e) => {
  if (e) {
    console.log(e);
  }
});

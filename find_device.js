'use strict';

const noble = require('noble-mac');

const discovered = (peripheral) => {
  console.log(`Device Discovered: ${ peripheral.advertisement.localName }(${ peripheral.uuid })`);
  console.log(`    address: ${ peripheral.address }`);
  console.log(`    serviceUuids: ${ peripheral.advertisement.serviceUuids }`);
  console.log(`    rssi: ${ peripheral.rssi }`);
  console.log('-----------------');
}

noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', () => {
  console.log('[scanStart]');
});

noble.on('discover', discovered);

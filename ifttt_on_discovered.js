'use strict';

const noble = require('noble-mac');
const request = require('request');

const HID_SERV_UUID = '1812';
const PERIPHERAL_UUID  = 'Your peripheral UUID';
const IFTTT_WEBHOOK_EVENT = 'Your webhook event';
const IFTTT_WEBHOOK_KEY = 'Your webhook key';

let discovered_at;

let req_options = {
  uri: `https://maker.ifttt.com/trigger/${ IFTTT_WEBHOOK_EVENT }/with/key/${ IFTTT_WEBHOOK_KEY }`,
  headers: {
    'Content-type': 'application/json',
  },
  json: {
    'value1': 'うんち'
  }
};

const discovered = (peripheral) => {

  if( peripheral.uuid === PERIPHERAL_UUID){
    const elapsed = new Date() - discovered_at;

    if (elapsed > 5000) {
      console.log(`Device Discovered: ${ peripheral.advertisement.localName }(${ peripheral.uuid })`);
      request.post(req_options, (err, res, body) => {
        if (!err) {
          console.log('Report Sent');
        }
      });
      discovered_at = new Date();
    }
  }
}

noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    noble.startScanning([HID_SERV_UUID], true);
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', () => {
  discovered_at = new Date();
  console.log('[scanStart]');
})

noble.on('discover', discovered);

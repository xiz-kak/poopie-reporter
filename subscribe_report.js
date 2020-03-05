'use strict';

const noble = require('noble-mac');

const HID_SERV_UUID = '1812';
const REPORT_CHAR = '2a4d';
const PERIPHERAL_UUID  = 'Your peripheral UUID';

const discovered = (peripheral) => {

  if( peripheral.uuid == PERIPHERAL_UUID){
    peripheral.on('connect', () => {
      console.log('[connect]');
      peripheral.discoverServices();
    });

    peripheral.on('disconnect', () => {
      console.log('[disconnect]');
    });

    peripheral.on('servicesDiscover', (services) => {
      services.forEach(service => {
        service.on('characteristicsDiscover', (characteristics) => {
          characteristics.forEach(characteristic => {
            console.log('Characteristic Discovered');
            console.log(`    serviceUuid: ${ characteristic._serviceUuid }`);
            console.log(`    uuid: ${ characteristic.uuid }`);
            console.log(`    name: ${ characteristic.name }`);
            console.log(`    type: ${ characteristic.type }`);
            console.log(`    properties: ${ characteristic.properties }`);

            if (characteristic.uuid === REPORT_CHAR) {
              characteristic.on('data', (data, isNotif) => {
                const jsonStr = data.toString('utf-8');
                const jsonData = JSON.parse(jsonStr);
                console.log(jsonData);
                // TODO: ここでIFTTTにPOST
              });

              characteristic.subscribe((error) => {
                console.log('=> Subscribe Started');
              });
            }

            console.log('-----------------');
          });
        });

        service.discoverCharacteristics();
      });
    });

    peripheral.connect();
  }
};

noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    noble.startScanning([HID_SERV_UUID], true);
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', () => {
  console.log('[scanStart]');
});

noble.on('scanStop', () => {
  console.log('[scanStop]');
});

noble.on('discover', discovered);

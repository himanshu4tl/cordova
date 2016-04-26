var QBApp = {
  appId: 39782,
  authKey: 'VD6EeXhY8yRVSed',
  authSecret: 'L2dMm48ybuvjFYn'
};

var config = {
  chatProtocol: {
    active: 2
  },
  debug: {
    mode: 1,
    file: null
  }
};

QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);

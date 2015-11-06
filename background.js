chrome.browserAction.onClicked.addListener(function () {
  var port = chrome.runtime.connectNative("org.passwordstore.pass");
  port.onMessage.addListener(function (msg) {
    console.log("Received: " + JSON.stringify(msg));
  });
  port.onDisconnect.addListener(function () {
    console.log("Disconnected");
  });
  port.postMessage({"domain": "zazzle.se"});
});

chrome.browserAction.onClicked.addListener(function () {
  var port = chrome.runtime.connectNative("org.passwordstore.pass");

  port.onMessage.addListener(function (msg) {
    console.log("Received: " + JSON.stringify(msg));
    port.close();
  });

  port.postMessage({"domain": "zazzle.se"});
});

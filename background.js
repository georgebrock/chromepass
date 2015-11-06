chrome.browserAction.onClicked.addListener(function () {
  var port = chrome.runtime.connectNative("org.passwordstore.pass");
  port.onMessage.addListener(function (msg) {
    console.log("Received: " + msg.text);
  });
  port.onDisconnect.addListener(function () {
    console.log("Disconnected");
  });
  port.postMessage({"text": "ls"});
});

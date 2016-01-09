var pass = new Pass();

chrome.runtime.onMessage.addListener(function (message, sender, respond) {
  chrome.tabs.executeScript(message.tab, {"file": "content.js"}, function () {
    pass.getDetail(message.password).then(function (detail) {
      chrome.tabs.sendMessage(message.tab, {"fill": detail}, function () {
        respond();
      });
    });
  });

  // Keep the `respond` function alive, for an asynchronous response
  return true;
});

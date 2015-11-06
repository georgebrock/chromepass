function copy(text) {
  var target, range;

  target = document.createElement("span");
  target.innerHTML = text;
  document.body.appendChild(target);
  range = document.createRange();
  range.selectNode(target);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  document.body.removeChild(target);
  window.getSelection().removeAllRanges();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var port = chrome.runtime.connectNative("org.passwordstore.pass");

  port.onMessage.addListener(function (msg) {
    console.log("Received: " + JSON.stringify(msg));

    sendResponse(msg);

    copy(msg.password);
    setTimeout(function () { console.log("clearing"); copy("-"); }, 5000);
  });

  port.postMessage({"domain": "zazzle.se"});
  return true;
});

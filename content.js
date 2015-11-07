chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var field = document.activeElement;
  if (field.tagName == "INPUT" && field.type == "password") {
    field.value = message.fill.password;
  }
  sendResponse();
});

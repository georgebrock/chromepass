var port = chrome.runtime.connectNative("org.passwordstore.pass");

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

port.onMessage.addListener(function (msg) {
  var extra, dl, dd;

  document.getElementById("name").innerHTML = msg.name;
  extra = document.getElementById("extra");
  for (key in msg.extra) {
    dl = document.createElement("dl");
    dl.innerHTML = key;
    dd = document.createElement("dd");
    dd.innerHTML = msg.extra[key];
    extra.appendChild(dl);
    extra.appendChild(dd);
  }

  copy(msg.password);
  setTimeout(function () { copy("-"); }, 1000);
});

port.postMessage({"domain": "zazzle.se"});

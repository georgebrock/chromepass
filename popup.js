function URLParser(url) {
  this.url = url;
}
URLParser.prototype.domain = function () {
  var urlParts = new RegExp("^[a-z]+://([^/]+)", "i").exec(this.url);
  return urlParts[1].replace(/^www\./, "");
};


function LoadingIndicator() {}
LoadingIndicator.prototype.start = function () {
  document.body.className = "loading";
};
LoadingIndicator.prototype.stop = function () {
  document.body.className = "";
};


(function () {
  var form, input, list, pass;

  form = document.getElementById("form");
  input = document.getElementById("password");
  list = document.getElementById("password-options");
  pass = new Pass();
  loadingIndicator = new LoadingIndicator();

  pass.loadList().then(function (passwords) {
    chrome.tabs.getSelected(function (tab) {
      chrome.tabs.executeScript(tab.id, {"file": "content.js"}, function () {
        function select(password) {
          loadingIndicator.start();
          password.getDetail().then(function (detail) {
            chrome.tabs.sendMessage(tab.id, {"fill": detail}, function () {
              window.close();
            });
          });
        }

        passwords.buildUI(list);

        form.onsubmit = function () {
          passwords.firstMatch(input.value).then(select);
          return false;
        };

        list.onclick = function (event) {
          var name = event.srcElement.getAttribute("data-password");
          passwords.byName(name).then(select);
          return false;
        };

        input.onkeyup = function () { passwords.filter(input.value); };
        input.removeAttribute("disabled");
        input.value = new URLParser(tab.url).domain();
        input.focus();
        passwords.filter(input.value);
      });
    });
  });
}());

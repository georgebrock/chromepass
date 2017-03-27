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
      function select(password) {
        loadingIndicator.start();
        chrome.runtime.sendMessage(
          {"tab": tab.id, "password": password.name},
          function () { window.close(); }
        );
      }

      passwords.buildUI(list);

      form.onsubmit = function () {
        passwords.byName(input.value).then(select);
        return false;
      };

      input.removeAttribute("disabled");
      input.value = new URLParser(tab.url).domain();
      input.focus();
    });
  });
}());

function Pass() {
  this.app = "org.passwordstore.pass";
}
Pass.prototype.getDetail = function (name) {
  return this.send({"action": "detail", "name": name});
};
Pass.prototype.loadList = function () {
  var pass = this;
  if (this.loadListPromise === undefined) {
    this.loadListPromise = new Promise(function (resolve, reject) {
      pass.send({"action": "list"})
        .then(function (names) { resolve(new PasswordCollection(names, pass)); })
        .catch(reject);
    });
  }
  return this.loadListPromise;
};
Pass.prototype.send = function (message) {
  var pass = this;
  return new Promise(function (resolve, reject) {
    chrome.runtime.sendNativeMessage(pass.app, message, function (response) {
      if (response === undefined) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
};


function Password(name, pass) {
  this.name = name;
  this.pass = pass;
}
Password.prototype.getDetail = function () {
  return this.pass.getDetail(this.name);
};
Password.prototype.buildUI = function (parent) {
    this.element = document.createElement("li");
    this.element.setAttribute("data-password", this.name);
    this.element.innerHTML = this.name;
    parent.appendChild(this.element);
};
Password.prototype.toggle = function (query) {
  if (this.match(query)) {
    this.show();
  } else {
    this.hide();
  }
};
Password.prototype.match = function (query) {
  return this.name.indexOf(query) !== -1;
};
Password.prototype.show = function () {
  this.element.removeAttribute("style");
};
Password.prototype.hide = function () {
  this.element.setAttribute("style", "display: none");
};


function PasswordCollection(names, pass) {
  this.items = names.map(function (name) {
    return new Password(name, pass);
  });
}
PasswordCollection.prototype.buildUI = function (parent) {
  this.items.forEach(function (password) {
    password.buildUI(parent);
  });
};
PasswordCollection.prototype.filter = function (query) {
  this.items.forEach(function (password) {
    password.toggle(query);
  });
};
PasswordCollection.prototype.firstMatch = function (query) {
  var collection = this;
  return new Promise(function (resolve, reject) {
    collection.items.forEach(function (password) {
      if (password.match(query)) {
        resolve(password);
      }
    });

    reject();
  });
};


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
        passwords.buildUI(list);

        form.onsubmit = function () {
          loadingIndicator.start();

          passwords.firstMatch(input.value).then(function (password) {
            password.getDetail().then(function (detail) {
              chrome.tabs.sendMessage(tab.id, {"fill": detail}, function () {
                window.close();
              });
            });
          });

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

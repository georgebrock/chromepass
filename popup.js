function Pass() {
  this.app = "org.passwordstore.pass";
}
Pass.prototype.getDetail = function (name) {
  return this.send({"action": "detail", "name": name});
};
Pass.prototype.loadList = function () {
  if (this.loadListPromise === undefined) {
    this.loadListPromise = this.send({"action": "list"});
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


function Password(name) {
  this.name = name;
}
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


function PasswordCollection(names, parent) {
    this.items = names.map(function (name) {
      var password = new Password(name);
      password.buildUI(parent);
      return password;
    });
}
PasswordCollection.prototype.filter = function (query) {
  this.items.forEach(function (password) {
    password.toggle(query);
  });
}
PasswordCollection.prototype.firstMatch = function (query, callback) {
  for (var i = 0; i < this.items.length; i += 1) {
    if (this.items[i].match(query)) {
      return callback(this.items[i]);
    }
  }
}


function URLParser(url) {
  this.url = url;
}
URLParser.prototype.domain = function () {
  urlParts = new RegExp("^[a-z]+://([^/]+)", "i").exec(this.url);
  return urlParts[1].replace(/^www\./, "");
};


var pass = new Pass();
pass.loadList().then(function (passwords) {
  chrome.tabs.getSelected(function (tab) {
    chrome.tabs.executeScript(tab.id, {"file": "content.js"}, function () {
      var form, input, list, i, item, urlParts, host;
      form = document.getElementById("form");
      input = document.getElementById("password");
      list = document.getElementById("password-options");

      passwords = new PasswordCollection(passwords, list);

      form.onsubmit = function () {
        passwords.firstMatch(input.value, function (password) {
          pass.getDetail(password.name)
            .then(function (message) {
              chrome.tabs.sendMessage(tab.id, {"fill": message}, function (response) {
                window.close();
              });
            })
            .catch(function (message) {
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

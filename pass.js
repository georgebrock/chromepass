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
        .then(function (names) { resolve(new PasswordCollection(names)); })
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


function Password(name) {
  this.name = name;
}
Password.prototype.buildUI = function () {
  this.element = document.createElement("option");
  this.element.setAttribute("value", this.name);
};


function PasswordCollection(names) {
  this.items = names.map(function (name) {
    return new Password(name);
  });
}
PasswordCollection.prototype.buildUI = function (element) {
  var collection = this;
  this.element = element;
  this.items.forEach(function (password) {
    password.buildUI();
    collection.element.appendChild(password.element);
  });
};
PasswordCollection.prototype.byName = function (name) {
  var collection = this;
  return new Promise(function (resolve, reject) {
    collection.items.forEach(function (password) {
      if (password.name == name) {
        resolve(password);
      }
    });
    reject();
  });
};

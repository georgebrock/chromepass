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
Password.prototype.buildUI = function () {
  this.element = document.createElement("li");
  this.element.setAttribute("data-password", this.name);
  this.element.innerHTML = this.name;
};


function PasswordCollection(names, pass) {
  this.items = names.map(function (name) {
    return new Password(name, pass);
  });
  this.fuse = new Fuse(this.items, {"keys": ["name"], "searchFn": Pick});
}
PasswordCollection.prototype.buildUI = function (element) {
  this.element = element;
  this.items.forEach(function (password) {
    password.buildUI();
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
PasswordCollection.prototype.filter = function (query) {
  var collection = this;
  this.element.innerHTML = "";
  this.fuse.search(query).forEach(function (password) {
    collection.element.appendChild(password.element);
  });
};
PasswordCollection.prototype.firstMatch = function (query) {
  var collection = this;
  return new Promise(function (resolve, reject) {
    var matches = collection.fuse.search(query);
    if (matches.length > 0) {
      resolve(matches[0]);
    } else {
      reject();
    }
  });
};

chrome.runtime.sendMessage(
  {source: "popup", action: "load"},
  function (response) {
    var extra, dl, dd;

    document.getElementById("name").innerHTML = response.name;
    extra = document.getElementById("extra");
    for (key in response.extra) {
      dl = document.createElement("dl");
      dl.innerHTML = key;
      dd = document.createElement("dd");
      dd.innerHTML = response.extra[key];
      extra.appendChild(dl);
      extra.appendChild(dd);
    }
  }
);

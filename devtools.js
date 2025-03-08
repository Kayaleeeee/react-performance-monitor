chrome.devtools.panels.create(
  "React Performance Monitor",
  "",
  "panel.html",
  // function이 꼭 필요해?
  function (panel) {
    console.log("Panel created");
    alert("Panel created");
  }
);

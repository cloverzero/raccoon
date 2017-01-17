'use strict';

var hostInput = document.getElementById('host');
var saveButton = document.getElementById('saveButton');
var saveResult = document.getElementById('saveResult');
var testButton = document.getElementById('testButton');
var testResult = document.getElementById('testResult');
var checkboxes = document.querySelectorAll('[name="blocking"]');

function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    host: 'https://amoeba-api.herokuapp.com',
    blockingTypes: ['xmlhttprequest']
  }, function(items) {
    hostInput.value = items.host;
    checkboxes.forEach(function (input) {
      var value = input.value;
      if (items.blockingTypes.indexOf(value) !== -1) {
        input.checked = true;
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', restore_options);

function clearSaveResult() {
  setTimeout(function () {
    saveResult.innerHTML = '';
  }, 3000);
}

saveButton.addEventListener('click', function () {
  var options = {};
  options.host = hostInput.value;
  if (options.host.endsWith('/')) {
    options.host = options.host.substr(0, options.host.length - 1);
  }
  var blockingTypes = [];
  checkboxes.forEach(function (input) {
    if (input.checked === true) {
      blockingTypes.push(input.value);
    }
  });
  options.blockingTypes = blockingTypes;
  chrome.storage.sync.set(options, function () {
    saveResult.innerHTML = 'Saved!';
    clearSaveResult();
  });
});

function clearTestResult() {
  setTimeout(function () {
    testResult.innerHTML = '';
  }, 8000);
}

testButton.addEventListener('click', function () {
  var xhr = new XMLHttpRequest();
  var url = hostInput.value + "/namespaces";
  xhr.open('get', url);
  xhr.send();
  xhr.onload = function () {
    testResult.innerHTML = 'Connect Successfully. Congratulations!';
    clearTestResult();
  };
  xhr.onerror = function () {
    testResult.innerHTML = 'Connect Failed. Please check settings.';
    clearTestResult();
  }
});

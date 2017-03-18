'use strict';

const API_URL = 'http://localhost:3000/articles';

window.onload = function () {

  document.getElementById('submit').onclick = function () {
    if (confirm('Etes-vous sûr(e) de vouloir ajouter cette citation ?')) {
      submitCitation();
    }
  };
};

// Creation et envoi d'un nouvel objet citation
function submitCitation() {
    var citation = {};

    var fields = document.getElementsByClassName('form-control');
    for (let ctrl of fields) {
      citation[ctrl.name] = ctrl.value;
    }

    var date = new Date();
    citation.date = date.toISOString();

    sendCitation(citation);  
}

// Send new citation to the remote server
function sendCitation(citation) {

  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 201) {
        window.location = '/';
      } else {
        alert(`Erreur : ${xhr.statusText}.`);
      }
    }
  };

  xhr.open('POST', API_URL);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(citation));
}
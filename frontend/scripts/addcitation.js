'use strict';

const API_URL = 'http://localhost:3000/articles';

window.onload = function () {

  document.getElementById('submit').onclick = function () {
    // Submit the entered citation if all fields are ok
    var citation = buildCitation();
    if (!citation) {
      alert('Vous devez remplir tous les champs !');
    }
    else if (confirm('Etes-vous sûr(e) de vouloir ajouter cette citation ?')) {
        sendCitation(citation);  
    }
  };
};

// Create and store a new citation object
function buildCitation() {

    var fields = document.getElementsByClassName('form-control');
    var date = new Date();

    var citation = {
      date: date.toISOString()
    };

    for (let ctrl of fields) {
      if (ctrl.value.length == 0) {
        // Don't accept empty field
        return null;
      }
      citation[ctrl.name] = ctrl.value;
    }

    return citation;
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
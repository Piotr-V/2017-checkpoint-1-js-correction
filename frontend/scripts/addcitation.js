window.onload = function () {
  'use strict';

  const API_URL = 'http://localhost:3000/articles';

  document.getElementById('submit').onclick = function () {
    // Submit the entered citation if all fields are ok
    var citation = buildCitation();
    if (!citation) {
      window.alert('Vous devez remplir tous les champs !');
    } else if (window.confirm('Etes-vous sûr(e) de vouloir ajouter cette citation ?')) {
      sendCitation(citation);
    }
  };

  // Create and store a new citation object
  function buildCitation() {

    let fields = document.getElementsByClassName('form-control');
    let citation = {
      date: (new Date()).toISOString()
    };

    for (let field of fields) {
      if (field.value.length === 0) {
        // Don't accept empty field
        return null;
      }
      citation[field.name] = field.value;
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
          window.alert(`Erreur : ${xhr.statusText}.`);
        }
      }
    };

    xhr.open('POST', API_URL);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(citation));
  }

};
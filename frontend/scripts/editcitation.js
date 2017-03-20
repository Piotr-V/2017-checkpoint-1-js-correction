window.onload = function () {
  'use strict';

  const API_URL = 'http://localhost:3000/articles';

  let id = getCitationId(window.location.href);
  if (id == null) {
    window.alert('La citation demandée n\'existe pas');
  } else {
    loadCitation(id);
  }

  document.getElementById('submit').onclick = function () {
    // Submit the entered citation if all fields are ok
    var citation = buildCitation();
    if (!citation) {
      window.alert('Vous devez remplir tous les champs !');
    } else if (window.confirm('Etes-vous sûr(e) de vouloir modifier cette citation ?')) {
      saveCitation(citation);
    }
  };

  // Retrieve citation id from url
  function getCitationId(url) {
    var id = url.split('?')[1].split('&')[0];
    return id ? id.split('=')[1] : null;
  }

  // Create and store a new citation object
  function buildCitation() {

    let fields = document.getElementsByClassName('form-control');
    let citation = {};

    for (let field of fields) {
      if (field.value.length === 0) {
        if (field.id === "date") {
          field.value = (new Date()).toISOString();
        } else {
          // Don't accept empty field
          return null;
        }
      }
      citation[field.name] = field.value;
    }

    return citation;
  }

  // Load citations from the remote server
  function loadCitation(id) {

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          showCitation(JSON.parse(xhr.responseText));
        } else {
          window.alert(`Erreur : ${xhr.statusText}.`);
        }
      }
    };

    xhr.open('GET', API_URL + "/" + id);
    xhr.send();
  }

  // Send new citation to the remote server
  function saveCitation(citation) {

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          window.location = '/';
        } else {
          window.alert(`Erreur : ${xhr.statusText}.`);
        }
      }
    };

    xhr.open('PUT', API_URL + "/" + citation.id);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(citation));
  }

  // Fill input fields with citation content
  function showCitation(citation) {
    for (let property in citation) {
      if (citation.hasOwnProperty(property)) {
        let field = document.getElementById(property);
        if (field) {
          field.value = citation[property];
        }
      }
    }
  }

};
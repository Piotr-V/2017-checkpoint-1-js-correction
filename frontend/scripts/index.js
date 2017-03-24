window.onload = function () {
  'use strict';

  const API_URL = 'http://localhost:3000/articles';

  // Load all citations when DOM document ready
  loadCitations();

  // Load citations from the remote server
  function loadCitations() {

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          showCitations(JSON.parse(xhr.responseText));
        } else {
          window.alert(`Erreur : ${xhr.statusText}.`);
        }
      }
    };

    xhr.open('GET', API_URL);
    xhr.send();
  }

  // Put the received citations on the HTML page
  function showCitations(citations) {

    let container = document.getElementById('citations');
    let model = document.getElementById('template');

    citations.forEach(function(citation) {

      let source = `${citation.author}, <i>${citation.chapter}, ${citation.episode}</i>`;
      let thumb = model.cloneNode(true);

      thumb.getElementsByClassName('source')[0].innerHTML = source;
      thumb.getElementsByTagName('blockquote')[0].textContent = citation.content;
      thumb.getElementsByTagName('img')[0].src = citation.image;

      thumb.getElementsByClassName('actionDetails')[0].onclick = actionDetails;
      thumb.getElementsByClassName('actionDelete')[0].onclick = actionDelete;
      thumb.getElementsByClassName('actionEdit')[0].onclick = actionEdit;

      thumb.id = citation.id;

      container.appendChild(thumb);
    });
  }

  // Delete the given citation
  function deleteCitation(id) {

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          document.getElementById(id).remove();
        } else {
          window.alert(`Erreur : ${xhr.statusText}.`);
        }
      }
    };

    xhr.open('DELETE', API_URL + "/" + id);
    xhr.send();
  }

  // Display citation details modal dialog box
  function actionDetails(e) {

    let thumb = getParentThumb(e.currentTarget);
    if (thumb) {
      // Fill the unique modal dialog with the selected citation content
      let modal = document.getElementById('seeMoreModal');

      let content = thumb.getElementsByTagName('blockquote')[0].textContent;
      let source = thumb.getElementsByClassName('source')[0].innerHTML;

      modal.getElementsByTagName('blockquote')[0].textContent = content;
      modal.getElementsByClassName('source')[0].innerHTML = source;
    }
  }

  // Delete citation
  function actionDelete(e) {
    let thumb = getParentThumb(e.currentTarget);
    if (thumb && window.confirm('Etes-vous sûr(e) de vouloir effacer cette citation ?')) {
      deleteCitation(thumb.id);
    }
  }

  // Edit citation
  function actionEdit(e) {
    let thumb = getParentThumb(e.currentTarget);
    if (thumb) {
      window.location = `/editcitation?id=${thumb.id}`;
    }
  }

  // Search the parent thumb from one of its children
  function getParentThumb(element) {

    while (element && element.nodeName !== 'ARTICLE') {
      element = element.parentNode;
    }

    return element;
  }

};
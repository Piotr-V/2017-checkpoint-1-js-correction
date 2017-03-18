'use strict';

const API_URL = 'http://localhost:3000/articles';

window.onload = function () {
  // Load all citations when DOM document ready
  loadCitations();
};

// Load citations from the remote server
function loadCitations() {

  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        showCitations(JSON.parse(xhr.responseText));
      } else {
        alert(`Erreur : ${xhr.statusText}.`);
      }
    }
  };

  xhr.open('GET', API_URL);
  xhr.send();
}

// Delete the given citation
function deleteCitation(id) {

  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        document.getElementById(id).remove();
      } else {
        alert(`Erreur : ${xhr.statusText}.`);
      }
    }
  };

  xhr.open('DELETE', API_URL + "/" + id);
  xhr.send();
}

// Put the received citations on the HTML page
function showCitations(citations) {

  var container = document.getElementById('citations');
  var model = document.getElementById('template');

  for (let citation of citations) {

    var source = `${citation.author}, <i>${citation.chapter}, ${citation.episode}</i>`;
    var thumb = model.cloneNode(true);

    thumb.getElementsByClassName('source')[0].innerHTML = source;
    thumb.getElementsByTagName('blockquote')[0].textContent = citation.content;
    thumb.getElementsByTagName('img')[0].src = citation.image;

    thumb.getElementsByClassName('actionDetails')[0].onclick = actionDetails;
    thumb.getElementsByClassName('actionDelete')[0].onclick = actionDelete;

    thumb.id = citation.id;

    container.appendChild(thumb);
  }
}

// Display citation details modal dialog box
function actionDetails(e) {

  var thumb = getParentThumb(e.currentTarget.parentNode);

  if (thumb) {
    var modal = document.getElementById('seeMoreModal');

    var content = thumb.getElementsByTagName('blockquote')[0].textContent;
    var source = thumb.getElementsByClassName('source')[0].innerHTML;

    modal.getElementsByTagName('blockquote')[0].textContent = content;
    modal.getElementsByClassName('source')[0].innerHTML = source;
  }
}

// Delete citation
function actionDelete(e) {

  e.preventDefault();

  var thumb = getParentThumb(e.currentTarget);

  if (thumb && confirm('Etes-vous sûr(e) de vouloir effacer cette citation ?')) {
    deleteCitation(thumb.id);
  }
}

// Search parent frame givent 
function getParentThumb(element) {

  while (element && element.nodeName !== 'ARTICLE') {
    element = element.parentNode;
  }

  return element;
}
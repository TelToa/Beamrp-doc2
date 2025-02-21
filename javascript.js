// Page load
setTimeout(function() {
    var preCon = document.querySelector('.se-pre-con');
    if (preCon) {
        preCon.remove();
    }
}, 400);

// Link backup (Best to delete in final page (I prorbably will forget to do this though))
function checkLink(docName) {
    var firstLink = docName;
    var secondLink = docName + '.html';
  
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', firstLink, true);
  
    xhr.onload = function() {
      if (xhr.status === 200) {
        window.location.href = firstLink;
      } else {
        window.location.href = secondLink;
      }
    };
  
    xhr.onerror = function() {
      window.location.href = secondLink;
    };
  
    xhr.send();
  }

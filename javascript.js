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

// Create navbar
const template = document.createElement('template');

  template.innerHTML = `
    <nav class="navbar">
    <div class="nav-left">
    <a class="logo" href="#" onclick="checkLink('index')">Beam<span style="color: #4800ac">RP</span></a>
    </div>
    <div class="nav-center">
        <a href="#" onclick="checkLink('delivery')">Delivery Driver</a>
        <a href="#" onclick="checkLink('taxi')">Taxi</a>
        <a href="#" onclick="checkLink('bus')">Bus</a>
        <a href="#" onclick="checkLink('business')">Business</a>
        <a href="#" onclick="checkLink('emergency')">Emergency Services</a>
        <a href="#" onclick="checkLink('crime')">Criminal</a>
    </div>
        <div class="nav-right">
        </div>
    </nav>
  `;
  
document.body.appendChild(template.content);
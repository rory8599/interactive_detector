
//Introduction Tabs (n[input], x[tabs class], a[current tab]) Subdet(m, y, b) Particles (l, z, c)
var currentIntroTab = 0; // Current tab is set to be the first tab (0)
var currentSubdetTab = 0;
var currentParticleTab = 0;
var introDone = false;
showTab(currentIntroTab, currentSubdetTab, currentParticleTab); // Display the current tab

function showTab(n, m, l) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  var y = document.getElementsByClassName("subdetTab");
  var z = document.getElementsByClassName("particlesTab");
  if(!introDone){
    x[n].style.display = "grid";
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Close";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
  }
  else{
    y[m].style.display = "grid";
    z[l].style.display = "grid";
    if (m == 0) {
        document.getElementById("prevSubdet").hidden = true;
    } else if(m ==(y.length-1)) {
        document.getElementById("nextSubdet").hidden = true;
    } else {
        document.getElementById("prevSubdet").hidden = false;
        document.getElementById("nextSubdet").hidden = false;
    }
    if (l == 0) {
        document.getElementById("prevParticle").hidden = true;
    } else if(l == (z.length-1)) {
        document.getElementById("nextParticle").hidden = true;
    } else {
        document.getElementById("prevParticle").hidden = false;
        document.getElementById("nextParticle").hidden = false;
    }
  }

  fixStepIndicator(n,m,l)
}

function nextPrev(n, m, l) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  var y = document.getElementsByClassName("subdetTab");
  var z = document.getElementsByClassName("particlesTab");
  if(!introDone){
    if (n == 1){
        document.getElementsByClassName("step")[currentIntroTab].className += " finish";
    }
    x[currentIntroTab].style.display = "none";
    currentIntroTab = currentIntroTab + n;
    if (currentIntroTab >= x.length) {
        document.getElementById("introPopup").style.display = "none";
        introDone = true;
        closePopup();
    }
  }

  if(introDone){
    y[currentSubdetTab].style.display = "none";
    currentSubdetTab = currentSubdetTab + m;
    z[currentParticleTab].style.display = "none";
    currentParticleTab = currentParticleTab + l;
  }
  // Otherwise, display the correct tab:
  showTab(currentIntroTab, currentSubdetTab, currentParticleTab);
}


function fixStepIndicator(n, m, l) {
  // This function removes the "active" class of all steps...
  var i, j, k;
  var x = document.getElementsByClassName("step");
  var y = document.getElementsByClassName("subdetStep");
  var z = document.getElementsByClassName("particleStep");
  if(!introDone){
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }    
    x[n].className += " active";
  } else{
    for (j = 0; j < y.length; j++) {
        y[j].className = y[j].className.replace(" active", "");
    }
    for (k = 0; k < z.length; k++) {
        z[k].className = z[k].className.replace(" active", "");
    }
    y[m].className += " active";
    z[l].className += " active";
  } 
};

function closePopup(){
    document.getElementById("introPopup").style.display = "none";
    introDone = true;
    showTab(0,0,0);
}

function openPopup(){
  document.getElementById("introPopup").style.display = "block";
  introDone = false;
  showTab(0,currentSubdetTab,currentParticleTab);
}

//tabs for when mobile is in landscape
function openInfoTab(evt, tabName) {
    // Declare all variables
    var i, infoTabContent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    infoTabContent = document.getElementsByClassName("infoTabContent");
    for (i = 0; i < infoTabContent.length; i++) {
      infoTabContent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openMenu() {
    document.getElementById('moreInfo').style.width = '0px';
    document.getElementById('infoTabsContainerRight').style.display = "none";
    document.getElementById('menu').style.width = '50%';
    document.getElementById('infoTabsContainerLeft').style.display = "inline";
    openInfoTab(event,'rulesBody');
}

function openInfo(){
    document.getElementById('menu').style.width = '0px';
    document.getElementById('infoTabsContainerLeft').style.display = "none";
    document.getElementById('moreInfo').style.width = '50%';
    document.getElementById('infoTabsContainerRight').style.display = "inline";
    openInfoTab(event, 'subdetBody');
}

function closeNav(){
    document.getElementById('menu').style.width = '0px';
    document.getElementById('moreInfo').style.width = '0px';
    document.getElementById('infoTabsContainerLeft').style.display = "none";
    document.getElementById('infoTabsContainerRight').style.display = "none";
}

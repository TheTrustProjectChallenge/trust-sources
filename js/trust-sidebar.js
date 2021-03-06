var jsLoaded1 = false;
var jsLoaded2 = false;
var loadNextFile, confirmExtFiles;

loadNextFile = function() {
  console.log('Trust Bar loaded!');
  jsLoaded1 = true;
  var jsInsert2 = document.createElement('script');
  jsInsert2.setAttribute('src', '//unpkg.com/nlp_compromise@latest/builds/nlp_compromise.min.js');
  document.body.appendChild(jsInsert2);
  jsInsert2.onload = confirmExtFiles;
};

var jsInsert1 = document.createElement('script');
jsInsert1.setAttribute('src', '//cdnjs.cloudflare.com/ajax/libs/ramda/0.17.1/ramda.min.js');
jsInsert1.onload = loadNextFile;
document.body.appendChild(jsInsert1);

confirmExtFiles = function () {
console.log('Trust Bar dependencies loaded!');

jsLoaded2 = true;
var R = window.R;
var nlp = window.nlp_compromise;

const sourceWords = [
  'said',
  'told',
  'reported',
  'stated',
  'according to',
  'recalled',
  'suggested',
  'mentioned',
  'tweeted',
  'thought',
  'quoted',
  'sourced from',
  'as seen',
  'heard on',
  'corrected',
  'paused',
  'in an interview',
  'at a press conference',
  '“.*”'
];
const sourceRegex = new RegExp(sourceWords.join('|'), 'gi');

const getTextFromTag = tag => tag.innerText;
const getSentencesFromText = text => nlp.text(text).sentences.map(sentence => sentence.str);
const getSentencesFromTag = tag => {
  return R.compose(R.map((sentence) => ({
    sentence,
    tag
  })), R.map(formatSentence), R.filter(hasAtLeastOneSourceWord), getSentencesFromText, getTextFromTag)(tag);
};
const getSentencesFromTags = R.map(getSentencesFromTag);
const hasAtLeastOneSourceWord = R.test(sourceRegex);
const removeNewlines = R.replace(/\n/g, '');
const removeSpacesFromBeginningAndEnd = text => {
  let newText = text;
  if (newText[0] === ' ') {
    newText = R.slice(1, newText.length, newText);
  }
  if (newText[newText.length - 1] === ' ') {
    newText = R.slice(0, newText.length - 1, newText);
  }
  return newText;
};
const formatSentence = R.compose(removeSpacesFromBeginningAndEnd, removeNewlines);
const getSentenceObjectsWithSourceWords = R.compose(R.flatten, getSentencesFromTags);

const createAnchor = sentenceObj => {
  sentenceObj.tag.insertAdjacentHTML('afterbegin', `<span style='display: inline;' id='${createId(sentenceObj.tag)}'></span>`);
};
const createAnchors = R.forEach(createAnchor);

const createId = tag => {
  return encodeURI(`trust-${getTextFromTag(tag)}`);
};
const getDomain = hostName => {
  return hostName.split('.').slice(-2).join('.');
};
const createGoogleSearchUrl = tag => {
  return `//google.com/search?q=${encodeURI(getTextFromTag(tag))}+-:${getDomain(window.location.hostname)}`;
};


  // Build sidebar via HTML injection
  var sideBar = document.createElement("div");
  sideBar.id = "trust-sidebar";
  sideBar.innerHTML = '<div id="trust-close-bar" class="row"><div class="small-6 columns"><p><strong>Trust Bar</strong> <small><a href="http://thetrustproject.org" title="About Trust Bar" target="_blank"><i class="fa fa-question-circle"></i></a></small></p></div><div class="small-6 columns"><p id="trust-close-text"><strong><a href="#" id="trust-close" title="Close">&times;</a></strong></p></div></div>';

  var trustBarWrapper = document.createElement("div");
  trustBarWrapper.id = "trust-bar-wrapper";

  var trustBarSources = document.createElement("div");
  trustBarSources.id = "trust-bar-sources";
  trustBarSources.className = "trust-bar-content";
  trustBarSources.innerHTML = '<h6><strong>SOURCES</strong></h6>';

  var trustBarSourcesList = document.createElement("ol");
  trustBarSourcesList.id = "trust-sources-list";

  var tagsToLookAt = document.querySelectorAll('p');
  var sourceTagsArr = getSentenceObjectsWithSourceWords(tagsToLookAt);

  createAnchors(sourceTagsArr);

  if (sourceTagsArr.length > 0) {
    sourceTagsArr.forEach(function(e){
      trustBarSourcesList.innerHTML += `<li>${e.sentence} <p><small><strong>
      <a href="#${createId(e.tag)}" title="Source">Show</a></strong> |
      <strong><a href="${createGoogleSearchUrl(e.tag)}" title="Search" target="_blank">Search on Google</a></strong></small></p></li><hr>`;
    });
  } else {
    trustBarSourcesList.innerHTML += '<li><em>No sources found.</em></li>';
  }

  trustBarSources.appendChild(trustBarSourcesList);
  trustBarSources.innerHTML += '<hr>';
  trustBarWrapper.appendChild(trustBarSources);

  var trustBarMeta = document.createElement("div");
  trustBarMeta.id = "trust-bar-meta";
  trustBarMeta.className = "trust-bar-content";
  trustBarMeta.innerHTML = '<h6><strong>PUBLISHER</small></strong></h6><div class="row small-collapse expanded"><div class="small-6 columns"><p>Correction <a href="#" title="Correction"><i class="fa fa-check-circle"></i></a> <i class="fa fa-times-circle"></i></p></div><div class="small-6 columns"><p>Author <a href="#" title="Author"><i class="fa fa-check-circle"></i></a> <i class="fa fa-times-circle"></i></p></div><div class="small-6 columns"><p>Ethics <a href="#" title="Ethics"><i class="fa fa-check-circle"></i></a></p></div><div class="small-6 columns"><p>Location <a href="#" title="Author"><i class="fa fa-check-circle"></i></a> <i class="fa fa-times-circle"></i></p></div><hr>';
  trustBarWrapper.appendChild(trustBarMeta);

  // Append all HTML
  sideBar.appendChild(trustBarWrapper);
  document.getElementsByTagName('body')[0].appendChild(sideBar);

  // Handle close link
  var closeLink = document.getElementById('trust-close');
  closeLink.onclick = closeTrustBar;
  function closeTrustBar() {
    document.getElementById("trust-sidebar").remove();
    return false;
  };


}; // confirmExtFiles

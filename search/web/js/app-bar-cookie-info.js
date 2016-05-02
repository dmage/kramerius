var cookieName = 'k5Cookie';

$(function () {
  checkCookieInfo();
});

// check cookie
function checkCookieInfo() {
  var cookieVal = $.cookie(cookieName);
  if (cookieVal != 'true') {
    $('#app-bar-cookie-info').addClass('app-visible');
  }
}

// set cookie
function setCookieInfo() {
  $.cookie(cookieName, true);
  $('#app-bar-cookie-info').removeClass('app-visible');
}

//$.removeCookie('k5Cookie');

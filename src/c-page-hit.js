function cPageHit (clickEvent) {

  try {
  var pageHit = {
    apmSessionId:     getCookie("MRHSession"),
    timestamp:        Date.now(),
    userId:           (typeof _spPageContextInfo != "undefined" ? _spPageContextInfo.userId : ""),
    geoLocation:      getGeoLocation(),
    browser:          navigator.userAgent,
    operatingSystem:  navigator.oscpu,
    platform:         navigator.platform,
    contextHref:      encodeURI(window.location.href),
    click:            getClick(clickEvent)
  }
} catch (err) {
  console.error(err)
}

  function getGeoLocation () {
    if (typeof(navigator.geolocation) !== "undefined") {
      return navigator.geolocation.getCurrentPosition(function (position) { return { "lat": position.coords.latitude, "long": position.coords.longitude } })
    }
  }

  function getClick (event) {
    if (typeof(event) !== "undefined")
      if (event)
        return { "id": event.target.id, "href": encodeURI(event.target.href) }
  }

  // ["JavaScript Cookies" (2019)] (https://www.w3schools.com/js/js_cookies.asp)
  function getCookie (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function parseXmlHttpRequestHeader (xmlHttpRequestHeader) {
    var headerItems = xmlHttpRequestHeader.trim().split(/[\r\n]+/);
    var header = {}
  
    headerItems.forEach(function (item) {
      var parts = item.split(': ')
      var label = parts.shift().toLowerCase()
      var value = parts.join(': ')
      header[label] = value
    })
  
    return header
  }

  function addListItem (request, resolve) {
    var startTime
    var endTime
  
    function xmlHttpRequestListener() {
      endTime = Date.now()
      var totalRequestDuration = (endTime - startTime)
      var xmlHttpResponseHeader = parseXmlHttpRequestHeader(xmlHttpRequest.getAllResponseHeaders())
      var networkDuration = (totalRequestDuration || 0) - (xmlHttpResponseHeader.spclientservicerequestduration || 0) - (xmlHttpResponseHeader.splislatency || 0)
      var resultResponse = { "response": this.responseText, "metadata": { "id": "addListItem", "httpResponseHeader": xmlHttpResponseHeader, "totalRequestDuration": totalRequestDuration, "networkDuration": networkDuration } }
      resolve(resultResponse)
    }
  
    startTime = Date.now()
    var requestBody = "{ '__metadata': { 'type': 'SP.Data.Page_x005f_hitListItem' }, 'data': '" + JSON.stringify(pageHit) + "'}"
    var xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.addEventListener("readystatechange", xmlHttpRequestListener)
    xmlHttpRequest.open("POST", request.siteUrl + "/_api/web/lists/getbytitle(%27page_hit%27)/items", true)
    xmlHttpRequest.setRequestHeader("accept", "application/json; odata=verbose")
    xmlHttpRequest.setRequestHeader("content-type", "application/json; odata=verbose")
    xmlHttpRequest.setRequestHeader("X-RequestDigest", document.getElementById("__REQUESTDIGEST").value)
    xmlHttpRequest.send(requestBody)
    return

  }

  return {
    send: function (request, resolve) { addListItem(request, resolve) },
    status: function () { 
      if (pageHit.userId != "") 
        return "enabled" 
      else 
        return "disabled" }
  }
}

function pageHitWindowClick (event) {

  function isPageHitClickEvent (event) {
    var isPageHitClickEvent = false
    if (typeof(event) !== "undefined")
      if (event) {
        var pageHitClickEventTags = ['A']
        var unwantedTagValues = [ "", "javascript:", "javascript:;", "javascript:{}", "javascript:void(0)" ]

        for (var item = 0; item < pageHitClickEventTags.length; item++) {
          if (event.target.tagName == pageHitClickEventTags[item]) {
            isPageHitClickEvent = true

            for (var item = 0; item < unwantedTagValues.length; item++) {
              if (event.target.href == unwantedTagValues[item])
                isPageHitClickEvent = false
            }

          }
        }

      }
    return isPageHitClickEvent
  }

  if (isPageHitClickEvent(event)) {
    var pageHit = cPageHit(event)
    try {
      pageHit.send( { "siteUrl": _spPageContextInfo.webAbsoluteUrl }, function (data) {
      })
    } catch (err) {
      console.error(err)
    }
  }
}

window.addEventListener("load", function (event) {
  var pageHit = cPageHit()
  try {
    pageHit.send( { "siteUrl": _spPageContextInfo.webAbsoluteUrl }, function (data) {
    })
  } catch (err) {
    console.error(err, "[INFO] page hit logging is", pageHit.status());
  }
})
// capturing phase is enabled to apply the event down the DOM and override any stopped bubbling
window.addEventListener("click", pageHitWindowClick, true)

//debugger
function cPageHit () {

  var pageHit = {
    apmSessionId:     getCookie("MRHSession"),
    timestamp:        Date.now(),
    geoLocation:      navigator.geolocation,
    browser:          navigator.userAgent,
    operatingSystem:  navigator.oscpu,
    platform:         navigator.platform,
    url:              _spPageContextInfo.serverRequestPath,
    userId:           _spPageContextInfo.userId
  }
  var error

  // ["JavaScript Cookies" (2019)] (https://www.w3schools.com/js/js_cookies.asp)
  function getCookie(cname) {
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

  function parseXmlHttpRequestHeader(xmlHttpRequestHeader) {
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
      console.log("addListItem completed:", endTime, " elasped seconds:", totalRequestDuration / 1000, "http response status:", this.status)
      var xmlHttpResponseHeader = parseXmlHttpRequestHeader(xmlHttpRequest.getAllResponseHeaders())
      var networkDuration = (totalRequestDuration || 0) - (xmlHttpResponseHeader.spclientservicerequestduration || 0) - (xmlHttpResponseHeader.splislatency || 0)
      var resultResponse = { "response": this.responseText, "metadata": { "id": "addListItem", "httpResponseHeader": xmlHttpResponseHeader, "totalRequestDuration": totalRequestDuration, "networkDuration": networkDuration } }
      console.log(resultResponse.metadata)
      resolve(resultResponse)
    }
  
    startTime = Date.now()
    console.log("addListItem started: " + startTime)
    // https://mceits.usmc.mil/sites/MCTSSA/Development/_api/Web/Lists/getbytitle('page_hit')?$select=ListItemEntityTypeFullName ⊢ __metadata.type
    var requestBody = "{ '__metadata': { 'type': 'SP.Data.Page_x005f_hitListItem' }, 'data': '" + JSON.stringify(pageHit) + "'}"
    var xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.addEventListener("readystatechange", xmlHttpRequestListener)
    xmlHttpRequest.open("POST", request.siteUrl + "/_api/web/lists/getbytitle(%27page_hit%27)/items", true)
    xmlHttpRequest.setRequestHeader("accept", "application/json; odata=verbose")
    xmlHttpRequest.setRequestHeader("content-type", "application/json; odata=verbose")
    xmlHttpRequest.setRequestHeader("content-length", requestBody.length)
    xmlHttpRequest.setRequestHeader("X-RequestDigest", document.getElementById("__REQUESTDIGEST").value)
    xmlHttpRequest.send(requestBody)
    return

  }

  return {
    error: error,
    send: function (request, resolve) { addListItem(request, resolve) }
  }
}

var pageHit = cPageHit()
pageHit.send( { "siteUrl": "https://mceits.usmc.mil/sites/MCTSSA/Development" }, function (data) {
  console.log(data)
})
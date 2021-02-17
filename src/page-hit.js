var PageHit = function () {

  var pageContext = {
    formDigest: "",
    host: "",
    userId: "",
    webAbsoluteUrl: ""
  };

  var config = {
    spListName: "",
    spMetadataType:  "",
    enabled: true
  }

  var PageHitItem = function (clickEvent) {

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

    try {
      var pageHit = {
        apmSessionId:     getCookie("MRHSession"),
        timestamp:        Date.now(),
        userId:           pageContext.userId,
        geoLocation:      getGeoLocation(),
        browser:          navigator.userAgent,
        operatingSystem:  navigator.oscpu,
        platform:         navigator.platform,
        contextHref:      encodeURI(window.location.href),
        click:            getClick(clickEvent)
      }
    } catch (err) {
      console.error(err, { PageHitItem: "pageHit" });
    };
    return pageHit;
  };

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

  function getTotalRequestDuration(metadataId, startTime) {
    var endTime = Date.now();
    var totalRequestDuration = endTime - startTime;
    return totalRequestDuration;
  }

  function buildResponse(metadataId, startTime, xmlHttpRequest) {
    var totalRequestDuration = getTotalRequestDuration(metadataId, startTime);
    var xmlHttpResponseHeader = parseXmlHttpRequestHeader(
      xmlHttpRequest.getAllResponseHeaders()
    );
    var networkDuration =
      (totalRequestDuration || 0) -
      (xmlHttpResponseHeader.spclientservicerequestduration || 0) -
      (xmlHttpResponseHeader.splislatency || 0);
    var response = {
      response: xmlHttpRequest.responseText,
      metadata: {
        id: metadataId,
        httpResponseHeader: xmlHttpResponseHeader,
        "httpResponse.Status":
          xmlHttpRequest.status + " " + xmlHttpRequest.statusText,
        totalRequestDuration: totalRequestDuration,
        networkDuration: networkDuration
      }
    };
    return response;
  }

  function get(metadata, resolve) {

    //  metadata: {
    //    id:       "",
    //    restUri:  "",
    //    restUrl:  "",
    //    siteUrl:  ""
    //  }

    function xmlHttpRequestErrorListener() {
      getTotalRequestDuration(metadata.id, startTime);
      resolve(new Error(xmlHttpRequest.status), null);
    }

    function xmlHttpRequestLoadListener() {
      if (xmlHttpRequest.readyState == 4) {
        var response = buildResponse(metadata.id, startTime, xmlHttpRequest);
        resolve(null, response);
      }
    }

    var startTime = Date.now();
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.addEventListener("load", xmlHttpRequestLoadListener);
    xmlHttpRequest.addEventListener("error", xmlHttpRequestErrorListener);
    if (typeof metadata.restUrl != "undefined" && metadata.restUrl != "")
      xmlHttpRequest.open("GET", metadata.restUrl);
    else {
      var siteUrl =
        typeof metadata.siteUrl != "undefined"
          ? metadata.siteUrl
          : pageContext.webAbsoluteUrl;
      xmlHttpRequest.open("GET", siteUrl + "/" + metadata.restUri);
    }
    xmlHttpRequest.setRequestHeader(
      "Accept",
      "application/json; odata=verbose, */*;q=0.9"
    );
    xmlHttpRequest.send();
    return;
  }

  function addListItem (request, resolve) {

    function setFormDigest(resolve) {
      function hasExpired() {
        var timestamp = new Date(
          pageContext.formDigest.substring(pageContext.formDigest.indexOf(","))
        );
        if (Date.parse(timestamp) < Date.now()) return true;
      }
  
      if (pageContext.formDigest === "" || hasExpired()) {

        function parseResult(result) {
          try {
            var response = JSON.parse(result.response);
            return response[Object.keys(response)[0]].GetContextWebInformation
              .FormDigestValue;
          } catch (err) {
            console.error(err, { setFormDigest: "parsing result" });
          }
        }
  
        function xmlHttpRequestErrorListener() {
          getTotalRequestDuration(metadata.id, startTime);
          resolve(new Error(xmlHttpRequest.status), null);
        }
  
        function xmlHttpRequestListener() {
          if (xmlHttpRequest.readyState == 4) {
            var response = buildResponse(metadata.id, startTime, xmlHttpRequest);
            resolve(parseResult(response));
          }
        }
  
        try {
          var metadata = {
            id: "setFormDigest()",
            siteUrl: pageContext.webAbsoluteUrl,
            restUri: "_api/contextinfo",
            requestBody: ""
          };
          var startTime = Date.now();
          var xmlHttpRequest = new XMLHttpRequest();
          xmlHttpRequest.addEventListener(
            "readystatechange",
            xmlHttpRequestListener
          );
          xmlHttpRequest.addEventListener("error", xmlHttpRequestErrorListener);
          xmlHttpRequest.open(
            "POST",
            pageContext.webAbsoluteUrl + "/" + metadata.restUri
          );
          xmlHttpRequest.setRequestHeader(
            "accept",
            "application/json; odata=verbose, */*;q=0.9"
          );
          xmlHttpRequest.setRequestHeader(
            "content-type",
            "application/json; odata=verbose"
          );
          xmlHttpRequest.send(metadata.requestBody);
        } catch (err) {
          console.error(err, { setFormDigest: "request" });
        };
      } else resolve();
    }

    setFormDigest(function(result) {

      function parseResult(result) {
        var parsed
        try {
          var response = JSON.parse(result.response);
          if (response.error)
            throw new Error(JSON.stringify(response.error));
        } catch (err) {
          console.error(err, { setFormDigest: "parse result error" });
        }
      }

      function xmlHttpRequestErrorListener() {
        getTotalRequestDuration(metadata.id, startTime);
        resolve(new Error(xmlHttpRequest.status), null);
      }
  
    function xmlHttpRequestListener() {
      if (xmlHttpRequest.readyState == 4) {
      var response = buildResponse(metadata.id, startTime, xmlHttpRequest);
      resolve(parseResult(response));
    };
    }
  
    pageContext.formDigest = result;
      try {
        var metadata = {
          id: "addListItem()",
          siteUrl: request.siteUrl,
          restUri: "/_api/web/lists/getbytitle('" + config.spListName + "')/items",
          requestBody: "{ '__metadata': { 'type': '" + config.spMetadataType + "' }, 'data': '" + JSON.stringify(request.pageHitItem) + "'}"
        };
        var startTime = Date.now();
    var xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.addEventListener("readystatechange", xmlHttpRequestListener)
      xmlHttpRequest.addEventListener("error", xmlHttpRequestErrorListener);
      xmlHttpRequest.open("POST", metadata.siteUrl + metadata.restUri, true)
    xmlHttpRequest.setRequestHeader("accept", "application/json; odata=verbose")
    xmlHttpRequest.setRequestHeader("content-type", "application/json; odata=verbose")
      xmlHttpRequest.setRequestHeader("X-RequestDigest", pageContext.formDigest)
      xmlHttpRequest.send(metadata.requestBody)
    return
      } catch (err) {
        console.error(err, { addListItem: "request" });
      };
      });
  }

function getSpCurrentUserId(resolve) {

  get(
    {
      id: "getSpCurrentUserId()",
      siteUrl: pageContext.webAbsoluteUrl,
      restUri: "_api/web/CurrentUser"
    },
    function(error, result) {

      function parseResult(result) {
        var parsedResult;
        try {
          var response = JSON.parse(result.response);
          if (response.error)
            throw new Error(JSON.stringify(response.error));
          else
            parsedResult = response[Object.keys(response)[0]].Id;
          return parsedResult;
        } catch (err) {
          console.error(err, { getSpCurrentUserId: "parse result error" });
        };
      }

      if (error !== null) resolve(error, null);
      else {
        var currentUser = parseResult(result);
        resolve(null, currentUser);
      }
    }
  );
}

function getSpWebAbsoluteUrl(resolve) {

  function sliceSiteAbsoluteUrl() {
    var siteUrl = document.URL;
    if (document.URL.indexOf("sites") != -1) {
      var urlDomain = document.URL.slice(0, document.URL.indexOf("sites"));
      var siteUrlParts = document.URL.slice(
      document.URL.indexOf("sites")
    ).split("/");
      siteUrl = urlDomain + "sites/" + siteUrlParts[1];
    }
    return siteUrl;
  }

  var spWebAbsoluteUrl = "";
  var siteUrl = sliceSiteAbsoluteUrl();
  get(
    {
      id: "getSpWebAbsoluteUrl()",
      siteUrl: siteUrl,
      restUri: "_api/web/webs"
    },
    function(error, result) {

      function setHost(spWebAbsoluteUrl) {
        pageContext.host = spWebAbsoluteUrl.slice(
          0,
          spWebAbsoluteUrl.indexOf("sites")
        );
      }

      function parseResult(result) {
        var parsedResult;
        var response = JSON.parse(result.response);
        if (!response.error) {
          var responseResults = response[Object.keys(response)[0]].results;
          var resultList = [];

          for (var item = 0; item < responseResults.length; item++) {
            resultList.push({
              id: responseResults[item].Id,
              title: responseResults[item].Title,
              url: responseResults[item].Url
            });
          }

          parsedResult = resultList;
        } else parsedResult = response;
        return parsedResult;
      }

      if (error !== null) resolve(error, null);
      else {
        var siteList = parseResult(result);
        if (!siteList.error) {
          for (var item = 0; item < siteList.length; item++) {
            if (
              document.URL.substring(0, siteList[item].url.length) ===
              siteList[item].url
            ) {
              spWebAbsoluteUrl = siteList[item].url;
              break;
            }
          }

          if (spWebAbsoluteUrl == "")
            spWebAbsoluteUrl = siteUrl;
          setHost(spWebAbsoluteUrl);
          resolve(null, spWebAbsoluteUrl);
        } else {
          var error = new Error(siteList.error.message);
          error.name = siteList.error.code;
          resolve(error, null);
        }
      }
    }
  );
}

function windowClick (event) {

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
    var pageHitItem = PageHitItem(event);
    try {
      addListItem ( { "siteUrl": pageContext.webAbsoluteUrl, pageHitItem: pageHitItem }, function (data) {})
    } catch (err) {
      console.error(err, { isPageHitClickEvent: "adding List Item" })
    }
  }
}

  return {
    config: {
      get: function () { 
        return config
      },
      set: {
        spListName: function(spListName) {
            config.spListName = spListName;
            return config.spListName;
          },
        spMetadataType: function(spMetadataType) {
            config.spMetadataType = spMetadataType;
            return config.spMetadataType;
          },
        enabled: function(enabled) {
          config.enabled = enabled;
          return config.enabled;
        }
      }
    },
    formDigest: {
      get: function() {
        return pageContext.formDigest;
      },
      set: function(formDigest, resolve) {
        if (typeof formDigest != "undefined")
          pageContext.formDigest = formDigest;
        else
          if (typeof resolve == "function")
            setFormDigest(function(error, result) {
              if (error !== null) resolve(error, null);
              else {
                pageContext.formDigest = result;
                resolve(null, result);
              };
            });
        return pageContext.formDigest;
      }
    },
    pageContext: {
      get: function() {
        return pageContext;
      },
      set: function(spPageContextInfo, resolve) {
        if (typeof spPageContextInfo != "undefined") {
          pageContext.userId = spPageContextInfo.userId;
          pageContext.webAbsoluteUrl = spPageContextInfo.webAbsoluteUrl;
          return pageContext;
        } else
          //if (typeof resolve == "function") {
            getSpWebAbsoluteUrl(function(error, result) {
              if (error !== null) { 
                if (typeof resolve == "function")
                  resolve(error, null);
              } else { 
                pageContext.webAbsoluteUrl = result;
                getSpCurrentUserId(function(error, result) {
                  if (error !== null) { 
                    if (typeof resolve == "function")
                      resolve(error, null);
                  } else {
                    pageContext.userId = result;
                    if (typeof resolve == "function")
                      resolve(null, pageContext);
                  };
                });
              };
            });
          //};
      }
    },
    windowClick: function (event) {
      return windowClick(event);
    }
  };
};

module.exports = PageHit;
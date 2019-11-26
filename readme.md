# readme.md
Page-Hit is for the collection of basic requestor and navigation event data that is persisted for the aggregation and analysis of site activity.

The standard JSON format is simple and flat.  The format is easy to marshal into JavaScript as an object for browsers and apps.  Most source libraries also support JSON, such as [Drill] (https://drill.apache.org/) and [d3] (https://d3js.org).   Databases and spreadsheets may also import JSON.  

## Page-Hit Data Points
The Page-Hit data points are the following:

 * APM (Access Policy Manager) Session Identifier
 * Timestamp
 * User Id
 * Geo Location
 * Browser
 * Operating System
 * Platform
 * Context Hyperlink Reference
 * Click Target

### Mapping

  "apmSessionId":     Response.Cookie.MRHSession
  "timestamp":        Response.Header.Date
  "userId":           _spPageContextInfo.userId
  "geoLocation":      navigator.geolocation
  "browser":          navigator.userAgent
  "operatingSystem":  navigator.oscpu
  "platform":         navigator.platform
  "contextHref":      window.location.href
  "click":            document.event.target

### JSON sample

``` json
  {
    "apmSessionId": "89697491a1aaf0874004f2feaada52de",
    "timestamp": 1573256951923,
    "userId": 4139,
    "geoLocation": {
      "lat": "", 
      "long": ""
    },
    "browser": "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0",
    "operatingSystem": "Linux x86_64",
    "platform": "Linux x86_64",
    "contextHref": "/sites/MCTSSA/Development/Pages/Home.aspx",
    "click": {
      "id": "google",
      "href": "https://google.com/"
    }
  }
```

## Session Data Points
Session Data Points are derived from Page-Hit data that is consolidated and aggregated by Session.

A process is executed at a specified time to produce Session Data Points for a time interval.

Session Data Points are the following:

 * User
 * Location
 * Browser
 * Operating System
 * Platform
 * Start Time
 * End Time
 * Click Hyperlink Path

---
20191126

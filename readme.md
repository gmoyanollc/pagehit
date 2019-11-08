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
 * Context Url
 * Click Target

### Mapping

  "apmSessionId":     Response.Cookie.MRHSession
  "timestamp":        Response.Header.Date
  "userId":           _spPageContextInfo.userId
  "geoLocation":      navigator.geolocation
  "browser":          navigator.userAgent
  "operatingSystem":  navigator.oscpu
  "platform":         navigator.platform
  "contextUrl":       _spPageContextInfo.serverRequestPath
  "clickTarget":      document.event.target

### JSON

{
  "apmSessionId":   "",
  "timestamp":      "",
  "userId":         "",
  "geoLocation":    "",
  "browser":        "",
  "operatingSystem: "",
  "platform:        "",
  "contextUrl":     "",
  "click":
    {
      "id":         "",
      "href":     ""
    }
}

## Session Data Points
Session Data Points are for Page-Hit data consolidation and aggregation.

A process is executed at a specified time to produce Session Data Points for a time interval.

Session Data Points are the following:

 * User
 * Location
 * Browser
 * Operating System
 * Platform
 * Start Time
 * End Time
 * URL Click Path

---
20191106

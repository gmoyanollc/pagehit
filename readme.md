# readme.md
Page-Hit is for the collection of basic requestor data that is persisted for aggregation and analysis.

The standard JSON format is simple and flat.  The data is easy to marshal into JavaScript as an object for browsers and apps.  If needed, also easy to import into databases and spreadsheet.  Take it further and use the hottest open-source querying and graphing tools/APIs in the industry, such as, [Drill] (https://drill.apache.org/) and [d3] (https://d3js.org/).

## Data Point

 * APM (Access Policy Manager) Session Identifier
 * Timestamp
 * GeoLocation
 * Browser
 * Operating System
 * Platform
 * Url
 * UserId 

### Mapping
  "apmSessionId":     Response.Cookie.MRHSession
  "timestamp":        Response.Header.Date
  "geoLocation":      navigator.geolocation
  "browser":          navigator.userAgent
  "operatingSystem":  navigator.oscpu
  "platform":         navigator.platform
  "url":             _spPageContextInfo.serverRequestPath
  "userId":          _spPageContextInfo.userId

## JSON
{
  "apmSessionId":   "",
  "timestamp":      "",
  "geoLocation":    "",
  "browser":        "",
  "operatingSystem: "",
  "platform:        "",
  "url":            "",
  "userId":         ""
}

---
20191029
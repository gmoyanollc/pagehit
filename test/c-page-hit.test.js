const PageHit = require('../src/c-page-hit.js')

describe("c-page-hit html", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = `'<!DOCTYPE html>
<html lang="en">
  <head>
    <title>c-page-hit</title>
  <body>
  </body>
  <script sp-list-name="page_hit" sp-metadata-type="SP.Data.Page_x005f_hitListItem" enabled=true src="../src/c-page-hit.js" ></script>
</html>'`;
  });

  afterEach(() => {
    jest.resetModules();
  });

  test("script tag arguments", () => {
    expect(document.scripts[document.scripts.length - 1].getAttribute('sp-list-name')).toEqual("page_hit");
    expect(document.scripts[document.scripts.length - 1].getAttribute('sp-metadata-type')).toBeTruthy();
    expect(document.scripts[document.scripts.length - 1].getAttribute('enabled')).toEqual("true");
  });

});

describe("c-page-hit script", () => {

  test("get pageContext", () => {
    const pageHit = PageHit();
    expect(pageHit).toBeTruthy();
    expect(pageHit.pageContext.get()).toEqual(
      { 
        formDigest: "", 
        host: "", 
        userId: "",
        webAbsoluteUrl: "" 
      }
    );
  });

  test("set pageContext from _spPageContextInfo", () => {
    const _spPageContextInfo = {
      formDigest: "form-digest",
      host: "host",
      userId: "user-id",
      webAbsoluteUrl: "web-absolute-url"
    };
    const pageHit = PageHit();
    expect(pageHit.pageContext.set(_spPageContextInfo)).toEqual(
      { 
        formDigest: "", 
        host: "", 
        userId: "user-id",
        webAbsoluteUrl: "web-absolute-url" 
      }
    );
  } );

  /*test("get SpWebAbsoluteUrl from request", () => {
    const pageHit = PageHit();
    const mockGetSpWebAbsoluteUrl = (resolve) => {
      expect(resolve).toBeDefined()
      resolve(pageHitListItemCountResponse)
    }
    jest.spyOn(pageHit, "getSpWebAbsoluteUrl").mockImplementation(mockGetSpWebAbsoluteUrl)
  })

  test("set pageContext from request", (done) => {
    const pageHit = PageHit();
    expect(pageHit.pageContext.set(undefined, function (data) {
    })).toEqual(
      { 
        formDigest: "", 
        host: "", 
        userId: "user-id",
        webAbsoluteUrl: "web-absolute-url" 
      }
    );
    done();
  } )
  */
})
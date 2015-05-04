/**
 * # Zorro Docs Maker
 * 
 * 1. read `z-*`.html
 *   - put comment into entries
 *   - convert markdown to html
 *   - find `@element`, `@attribute`, `@property`, `@method`, `@event`
 * 2. read `demo.html` code samples
 *   - find `section[primary]`, `[title]`, `[demo]`
 * 3. generate docs
 *   - tag name
 *   - description
 *   - demo + code snippets
 *   - more description
 *     - attribute
 *     - property
 *     - method
 *     - event
 */




(function (global) {
  var inNode = typeof module !== 'undefined' && module.exports;

  if (typeof DocsParser === 'undefined') {
    DocsParser = require('../docs-parser/docs-parser');
  }

  function readFile(path, done) {

    function loadend(e) {
      done(null, this.response || '');
    }

    if (inNode) {
      require('fs').readFile(path, {encoding: 'utf8'}, done);
    }
    else {
      var request = new XMLHttpRequest();
      request.responseType = 'text';
      request.addEventListener('loadend', loadend);
      request.open("GET", path);
      request.send();
    }
  }

  function writeFile(path, data, done) {
    if (inNode) {
      require('fs').writeFile(path, data, {encoding: 'utf8'}, done);
    }
  }




  function ZorroInfo(name, path) {
    var encodedName = encodeURIComponent(name);
    this.name = name || '';
    this.path = path || '../' + encodedName + '/' + encodedName + '.html';
    this.init();
  };

  ZorroInfo.prototype.init = function() {
    this.readInfo(function (err, data) {
      if (data) {
        this.info = DocsParser.parse(data);
      }
      this.ready && this.ready();
    }.bind(this));
  };

  ZorroInfo.prototype.readInfo = function(done) {
    readFile(this.path, done);
  };

  ZorroInfo.prototype.genInfo = function () {
    return JSON.stringify(this.info);
  };

  ZorroInfo.prototype.genREADME = function () {
    var info = this.info;
    return info.readme;
  };

  ZorroInfo.prototype.genDemo = function () {
    var info = this.info;
    return JSON.stringify(info.demo);
  };




  global.ZorroInfo = ZorroInfo;
}(this));

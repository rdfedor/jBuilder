(function() {
  // Get any jquery=___ param from the query string.
  var jqversion = location.search.match(/[?&]jquery=(.*?)(?=&|$)/),
    jquiversion = location.search.match(/[?&]jqueryui=(.*?)(?=&|$)/);
  var path, csspath;
  if (jqversion) {
    // A version was specified, load that version from code.jquery.com.
    path = 'http://code.jquery.com/jquery-' + jqversion[1] + '.js';
  } else {
    // No version was specified, load the local version.
    path = '../libs/jquery/jquery.js';
  }
  // This is the only time I'll ever use document.write, I promise!
  document.write('<script src="' + path + '"></script>');
  
  // Load jQuery UI
  if (jquiversion) {
      path = 'http://code.jquery.com/ui/' + jqversion[1] + '/jquery-ui.js';
      csspath = 'http://code.jquery.com/ui/' + jqversion[1] + '/themes/base/jquery-ui.css';
  } else {
      path = '../libs/jqueryui/jquery-ui.js';
      csspath = '../libs/jqueryui/themes/smoothness/jquery-ui.css';
  }
  document.write('<script src="' + path + '"></script>');
  document.write('<link rel="stylesheet" href="' + csspath + '" />');
}());

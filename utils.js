// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(function () {

    window.launchalert = window.launchalert || {};

    /* Calculates the time difference from now. */
    launchalert.getTimeRemaining =
	function(endtime){
	    var t = Date.parse(endtime) - Date.parse(new Date());
	    var seconds = Math.floor( (t/1000) % 60 );
	    var minutes = Math.floor( (t/1000/60) % 60 );
	    var hours = Math.floor( (t/(1000*60*60)) % 24 );
	    var days = Math.floor( t/(1000*60*60*24) );
	    return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	    };
    }

    launchalert.requestURL =
        function (url, responseType, callback, cacheID,  opt_errorStatusCallback) {
	        console.log (url);
	    // console.log (cacheID);
            var xhr = new XMLHttpRequest();
            if (responseType == "json")
            // WebKit doesn't handle xhr.responseType = "json" as of Chrome 25.
                xhr.responseType = "text";
            else
                xhr.responseType = responseType;

            xhr.onreadystatechange = function (state) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var response =
                            (responseType == "json") ? JSON.parse(xhr.response) : xhr.response;
                        callback(cacheID, response);
                    } else {
                        if (opt_errorStatusCallback)
                            opt_errorStatusCallback(xhr.status);
                    }
                }
            };

            xhr.onerror = function (error) {
                console.log("xhr error:", error);
            };

            xhr.open("GET", url, true);
            xhr.send();
        };
    /* API Endponts */
    launchalert.queryNextLaunch = 'https://ll.thespacedevs.com/2.0.0/launch/upcoming/?limit=1&status=1';
    launchalert.queryAgencies = 'https://ll.thespacedevs.com/2.0.0/agencies/?limit=100';

    /* Cache IDs*/
    launchalert.cacheIDNextLaunch = 'nextLaunch';
    launchalert.cacheIDAgencies = 'agencies';

    /* Indexed DBs */
    launchalert.dbname = "launchalert";
    launchalert.db = null;
    
})();

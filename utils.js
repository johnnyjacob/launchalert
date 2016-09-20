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
        function (url, responseType, callback, opt_errorStatusCallback) {
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
                        callback(response);
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

})();

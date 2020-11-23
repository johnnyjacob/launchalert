// Copyright (c) 2016, Johnny Jacob <johnnyjacob@gmail.com>  All rights reserved.
// Copyrights licensed under the BSD 3 Clause License.
// See the accompanying LICENSE file for terms.

//Function that would go through a paginated API and 
//aggregate the data into a list using multiple calls.

onmessage = function (e) {
    console.log ("Worker recieved a message " + e.data[1] + " Cache ID : " + e.data[0]['id']);
    //FIXME:
    var responseType = "json";
    var url = e.data[1];
    var cacheID = e.data[0]['id'];
    var xhr = new XMLHttpRequest();
    if (responseType == "json")
        // WebKit doesn't handle xhr.responseType = "json" as of Chrome 25.
        xhr.responseType = "text";
    else
        xhr.responseType = responseType;

    xhr.onreadystatechange = function (state) {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
                var response = (responseType == "json") ? JSON.parse(xhr.response) : xhr.response;
                postMessage([e.data[0], response]);
        } else {
            console.log ("request-worker : HTTP Response code : " + xhr.status);
            if (opt_errorStatusCallback)
                opt_errorStatusCallback(xhr.status);
            }
        }
    }

    xhr.onerror = function (error) {
        console.log("xhr error:", error);
    };

    xhr.open("GET", url, true);
    xhr.send();

    //TODO : Post the aggregated response to the caller.
    //postMessage ("Worked completed (from worker)");
}
// Copyright (c) 2016, Johnny Jacob <johnnyjacob@gmail.com>  All rights reserved.
// Copyrights licensed under the BSD 3 Clause License.
// See the accompanying LICENSE file for terms.

(function () {
    var nextLaunchQuery = 'https://launchlibrary.net/1.2/launch/next/1';

    function updateBadge() {
        chrome.storage.sync.get('nextLaunch', function (items) {
            var launchData = items['nextLaunch'];
            var timeRemaining = launchalert.getTimeRemaining(launchData.launches[0].net);
            var badgeText = "N/A";

            if (timeRemaining.total > 0) {
                if (timeRemaining.days > 0)
                    badgeText = String (timeRemaining.days + "d");
                else if (timeRemaining.hours > 0) 
                    badgeText = String (timeRemaining.hours + "h");
                else if (timeRemaining.minutes > 0) 
                    badgeText = String (timeRemaining.minutes + "m");
                else if (timeRemaining.seconds > 0) 
                    badgeText = String (timeRemaining.seconds + "s");
                else
                    badgeText = "N/A";
            }

            console.log (badgeText);
            console.log ("Updating badge text..");
            chrome.browserAction.setBadgeText({text : badgeText});

            if (launchData.launches[0].status == 1)
                chrome.browserAction.setBadgeBackgroundColor ({color:"#3cba54"});
            else
                chrome.browserAction.setBadgeBackgroundColor ({color:"#db3236"});
        });
    }

    function fetchFailed(errorMessage) {
        //TODO : Print the right error message
        //TODO : Error handling
        console.log ("Query failed...");
    }

    function updateLocalCache(launchData) {
        console.log ("Updating launchdata in local cache...");
        chrome.storage.sync.set({'nextLaunch': launchData});
    }

    function refreshLaunchData() {
        console.log ("Fetching launch data from the web...");
        launchalert.requestURL(nextLaunchQuery, "json", updateLocalCache, fetchFailed);
    }

    function alarmHandler(alarm) {
        console.log ("Alarm handler invoked...");
        if (alarm.name == "LaunchDataRefresh") {
            refreshLaunchData();
            /* HACK : Not needed. Since we are already listening on storage.sync*/
            updateBadge();
        }
    }

    function agencies_create_db() {
        if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB');
            return;
        } else {
            console.log('This browser supports IndexedDB');

            var idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
            var agenciesDB = idb.open ("agencies", 1);

            agenciesDB.onupgradeneeded = function() {
                console.log ("IndexDB upgrade needed...");
                var db = agenciesDB.result;
                var store = db.createObjectStore("agenciesStore", {keyPath: "id"});
                var index = store.createIndex("AgencyIndex", ["agency.name", "agency.abbrev"]);
            }
        }
    }

    function agencies_download() {
        var getAllAgencyQuery = 'https://launchlibrary.net/1.4/agency?limit=-1';
        var idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        var agenciesDB = idb.open ("agencies", 1);

        launchalert.requestURL(getAllAgencyQuery, "json", 
                               function(agencyList) {
                                   var db = agenciesDB.result;
                                   var tx = db.transaction("agenciesStore", "readwrite");
                                   var store = tx.objectStore("agenciesStore");

                                   for (i = 0; i < (agencyList.agencies).length; i++) {
                                       console.log("Adding.. ");
                                       store.put(agencyList.agencies[i]);
                                   }

                                   tx.complete;
                               },
                               fetchFailed);
    }

    function agencies_update() {
        agencies_create_db();
        agencies_download();
    }

    function main() {
	console.log ("Background : Main started...");
        updateBadge();
        agencies_update();

        chrome.storage.onChanged.addListener(function(changes, namespace) {
            //TODO : Reuse the object from here instead of doing a get inside updateBadge.
            updateBadge();
        });

        //Fetch launch data from the web.
        refreshLaunchData();

        // Set a timer for every 30 minutes.
        //TODO : Read this value from the options page ?
        chrome.alarms.create ("LaunchDataRefresh", {periodInMinutes:15});
        chrome.alarms.onAlarm.addListener(alarmHandler);
    }

    // Run!
    main();

})();

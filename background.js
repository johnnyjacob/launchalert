// Copyright (c) 2016, Johnny Jacob <johnnyjacob@gmail.com>  All rights reserved.
// Copyrights licensed under the BSD 3 Clause License.
// See the accompanying LICENSE file for terms.

(function () {
    function updateBadge() {
        chrome.storage.sync.get('nextLaunch', function (items) {
            var launchData = items['nextLaunch'];
            var timeRemaining = launchalert.getTimeRemaining(launchData.net);
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

            console.log ("Updating badge text..");
            console.log (badgeText);

            chrome.browserAction.setBadgeText({text : badgeText});
        });
    }

    function fetchFailed(errorMessage) {
        //TODO : Print the right error message
        //TODO : Error handling
        console.log ("Query failed...");
    }

    function updateLocalCache(cacheID, data) {
        console.log ("Updating " + cacheID + " in local cache...");
        // Use the first result from the response.

	//Fixme : Find out the length of the results and append.
	var store = new Object();
	store[cacheID.toString()] = data['results'];

	chrome.storage.sync.set(store); 
   }

    function refreshData(remoteQuery, cacheID) {
	//TBD
    }

    function refreshLaunchData() {
        console.log ("Fetching launch data from the web...");
        launchalert.requestURL(launchalert.queryNextLaunch, "json", updateLocalCache, launchalert.cacheIDNextLaunch, fetchFailed);
    }

    function refreshAgencies() {
	console.log("Fetching agencies...");
        launchalert.requestURL(launchalert.queryAgencies, "json", updateLocalCache, launchalert.cacheIDAgencies, fetchFailed);
    }

    function alarmHandler(alarm) {
        console.log ("Alarm handler invoked...");
        if (alarm.name == "LaunchDataRefresh") {
            refreshLaunchData();
            /* HACK : Not needed. Since we are already listening on storage.sync*/
            updateBadge();
        }
    }

    function main() {
	console.log ("Background : Main started...");
        updateBadge();

        chrome.storage.onChanged.addListener(function(changes, namespace) {
            //TODO : Reuse the object from here instead of doing a get inside updateBadge.
            updateBadge();
        });

        //Fetch launch data from the web.
        refreshLaunchData();
	refreshAgencies();

        // Set a timer for every 30 minutes.
        //TODO : Read this value from the options page ?
        chrome.alarms.create ("LaunchDataRefresh", {periodInMinutes:15});
        chrome.alarms.onAlarm.addListener(alarmHandler);
    }

    // Run!
    main();

})();

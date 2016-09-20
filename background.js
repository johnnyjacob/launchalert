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

    function main() {
	console.log ("Background : Main started...");
        updateBadge();

        chrome.storage.onChanged.addListener(function(changes, namespace) {
            //TODO : Reuse the object from here instead of doing a get inside updateBadge.
            updateBadge();
        });

        launchalert.requestURL(nextLaunchQuery, "json", updateLocalCache, fetchFailed);
    }

    // Run!
    main();

})();

// Copyright (c) 2016, Johnny Jacob <johnnyjacob@gmail.com>  All rights reserved.
// Copyrights licensed under the BSD 3 Clause License.
// See the accompanying LICENSE file for terms.

(function(){
    var nextFiveLaunches = 'https://launchlibrary.net/1.2/launch/next/1';

    function renderLaunchTable (launchData) {
	var launchList = JSON.parse (launchData);

	document.getElementById('missionname').textContent = launchList.launches[0].name;
	document.getElementById('launchschedule').textContent = launchList.launches[0].net;
	document.getElementById('launchstatus').textContent = launchList.launches[0].status;

	chrome.browserAction.setBadgeText({text:"1d"});
	chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
    }

    function fetchFailed (errorMessage) {
	console.log (errorMessage);
    }

    function updateLaunchTable(launchData) {
	renderLaunchTable(launchData);
    }

    function main() {
	launchalert.requestURL(nextFiveLaunches, "text", updateLaunchTable);
    }
    main();
})();

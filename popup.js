// Copyright (c) 2016, Johnny Jacob <johnnyjacob@gmail.com>  All rights reserved.
// Copyrights licensed under the BSD 3 Clause License.
// See the accompanying LICENSE file for terms.
(function () {

    function renderLaunchTable(statusText) {
        document.getElementById('status').innerHTML = statusText;
    }

    function fetchFailed(errorMessage) {
    }

    function getLaunchStatus (status) {
        if (status == 1)
            return "Launch is Go";

        return "Launch is No Go!"
    }

    function getAgencyLogo(agencyname, defaultLogo) {
        if (agencyname == "ISRO") {
            return "/logos/isro.png";
        } else {
            return defaultLogo;
        }
    }

    function updateLaunchTable(launchData) {
        var defaultLaunch = launchData;

        var content = '<ul style="width: 90px;">'
            + '<li><img src="' + defaultLaunch.image + '" class="logo"></li>'
            + '</ul>'
            + '<ul style="width: 300px">'
            + '<li>' + defaultLaunch.name + '</li>'
            + '<li>' + defaultLaunch.net + '</li>'
            + '<li>' + defaultLaunch.status.name + '</li>'
            + '<li>' + defaultLaunch.mission.description + '</li>'
            + '</ul>';
        renderLaunchTable(content);
    }

    function main() {
        renderLaunchTable('<img src="/images/gears.gif" class="loader" />');

        // Pick from local storage.
        chrome.storage.sync.get('nextLaunch', function (items) {
            var launchData = items['nextLaunch'];
            updateLaunchTable (launchData);
        });
    }

    main();
})();

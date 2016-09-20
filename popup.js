// Copyright (c) 2016, Johnny Jacob <johnnyjacob@gmail.com>  All rights reserved.
// Copyrights licensed under the BSD 3 Clause License.
// See the accompanying LICENSE file for terms.
(function () {

    function renderLaunchTable(statusText) {
        document.getElementById('status').innerHTML = statusText;
    }

    function fetchFailed(errorMessage) {
    }

    function getAgencyLogo(agencyname, defaultLogo) {
        if (agencyname == "ISRO") {
            return "/logos/isro.png";
        } else {
            return defaultLogo;
        }
    }

    function updateLaunchTable(launchData) {
        var defaultLaunch = launchData.launches[0];

        var agencyLogo = getAgencyLogo(defaultLaunch.rocket.agencies[0].abbrev, defaultLaunch.rocket.imageURL);
        var content = '<ul style="width: 90px;">'
            + '<li><img src="' + agencyLogo + '" class="logo"></li>'
            + '</ul>'
            + '<ul style="width: 300px">'
            + '<li>' + defaultLaunch.name + '</li>'
            + '<li>' + defaultLaunch.net + '</li>'
            + '<li>' + defaultLaunch.status + '</li>'
            + '<li>' + defaultLaunch.missions[0].description + '</li>'
            + '</ul>';
        renderLaunchTable(content);
    }

    function main() {
        renderLaunchTable('<img src="/images/gears.gif" class="loader" />');

        // Pick from local storage.
        chrome.storage.local.get('nextLaunch', function (items) {
            var launchData = items['nextLaunch'];
            updateLaunchTable (launchData);
        });
    }

    main();
})();

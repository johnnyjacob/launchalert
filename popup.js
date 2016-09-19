(function () {
    var nextFiveLaunches = 'https://launchlibrary.net/1.2/launch/next/1';

    function renderStatus(statusText) {
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
            + '<li>' + defaultLaunch.missions[0].name + '</li>'
            + '<li>' + defaultLaunch.missions[0].description + '</li>'
            + '</ul>';
        renderStatus(content);
    }

    function main() {
        renderStatus('<img src="./gears.gif" class="loader" />');
        launchalert.requestURL(nextFiveLaunches, "json", updateLaunchTable);
    }

    main();
})();

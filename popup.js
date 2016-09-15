(function(){
    var nextFiveLaunches = 'https://launchlibrary.net/1.2/launch/next/1';

    function renderStatus(statusText) {
	document.getElementById('status').textContent = statusText;
    }

    function fetchFailed (errorMessage) {
    }

    function updateLaunchTable(launchData) {
	renderStatus (launchData);
    }

    function main() {
	renderStatus('Fetching...');
	launchalert.requestURL(nextFiveLaunches, "text", updateLaunchTable);
    }
    main();
})();

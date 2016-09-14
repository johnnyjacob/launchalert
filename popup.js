(function(){
    function renderStatus(statusText) {
	document.getElementById('status').textContent = statusText;
    }

    function main() {
	renderStatus('Nothing here yet! ');
    }
    main();
})();

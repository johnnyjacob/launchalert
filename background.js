// Copyright (c) 2016, Johnny Jacob <johnnyjacob@gmail.com>  All rights reserved.
// Copyrights licensed under the BSD 3 Clause License.
// See the accompanying LICENSE file for terms.

(function () {
    function updateBadge() {
        chrome.storage.sync.get('nextLaunch', function (items) {
            var launchData = items['nextLaunch'][0];
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

            if (launchData.status.id == 1)
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
    /**
     * 
     * @param {string} cacheID ID of the objectstore.
     * @param {JSON} data JSON objects to be added / updated.
     */
    function updateLocalDB(cache, data) {
        console.log ("Updating local db for " + cache['id'] );
        var agencyObjectStore = launchalert.db.transaction(cache['id'], "readwrite").objectStore(cache['id']);
        data['results'].forEach(function(agency) {
            console.log ("adding agency : " + agency['id']);
            agencyObjectStore.put(agency);
        });
        //If the API is paged, then download all the objects.
        if (data['next']!= null) {
            console.log ("API is paged. Calling next.")
            refreshData(cache, data['next']);
        } else {
            console.log ("API is not paged or we are at the end of it")
        }
    }
    
    function updateLocalCache(cache, data) {
        console.log ("Updating local sync cache for  " + cache['id']);
        // Use the first result from the response.
        if (data['next']!= null) {
            console.log ("API is paged. Should we call the rest?")
        }
        //Fixme : Find out the length of the results and append.
        var store = new Object();
        store[cache['id'].toString()] = data['results'];
        chrome.storage.sync.set(store); 
    }
    
    function refreshData (cache, query) {
        console.log ("Refresh Data : Fetching "+ cache['id'] +" from : " + query);
        var request_worker = new Worker(chrome.runtime.getURL('worker-requests.js'));
        //Send the cache config object.
        request_worker.postMessage ([cache, query]);
        request_worker.onmessage = function(event) {
            //Update the local cache here.
            console.log ("Refresh Data : Message recieved " + event.data[0]);
            if (cache.store == "db")
                updateLocalDB(event.data[0], event.data[1]);
            if (cache.store == "sync")
                updateLocalCache(event.data[0], event.data[1]);
            
        };
    }
    
    function alarmHandler(alarm) {
        console.log ("Alarm handler invoked...");
        if (alarm.name == "LaunchDataRefresh") {
            refreshData(launchalert.cache['nextLaunch'], launchalert.cache['nextLaunch']['query']);
            /* HACK : Not needed. Since we are already listening on storage.sync*/
            updateBadge();
        }
    }
    /**
     * Creates the indexedDB
     */
    function createDB () {
        console.log ("Creating DB");
        var request = indexedDB.open(launchalert.dbname, 2);
        
        request.onerror = function (event) {
            console.log ("DB Error.");
        }
        
        request.onupgradeneeded = function (event) {
            console.log ("On upgrade needed .. ");
            var db = event.target.result;
            if (!db.objectStoreNames.contains(launchalert.cacheIDAgencies)) {
                var objectStore = db.createObjectStore (launchalert.cacheIDAgencies, {keyPath: "id"});
                //Create any index if needed.
            }
        }
        request.onsuccess = function (e) {
            console.log ("DB Created or opened...");
            launchalert.db = e.target.result;
        }
        request.onerror = function(e) {
            console.log ("Unable to create or open the DB");
            console.dir(e);
        }
    }

function main() {
    console.log ("Background : Main started...");
    createDB();
    updateBadge();
    
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        //TODO : Reuse the object from here instead of doing a get inside updateBadge.
        updateBadge();
    });
    
    //Fetch launch data from the web.
    refreshData(launchalert.cache['agencies'], launchalert.cache['agencies']['query']);
    refreshData(launchalert.cache['nextLaunch'], launchalert.cache['nextLaunch']['query']);
    
    // Set a timer for every 30 minutes.
    //TODO : Read this value from the options page ?
    chrome.alarms.create ("LaunchDataRefresh", {periodInMinutes:15});
    chrome.alarms.onAlarm.addListener(alarmHandler);
}

// Run!
main();

})();

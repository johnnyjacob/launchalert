# launchalert - Chrome Extension

Displays the next rocket launch scheduled from planet earth.

Powered by [The Space Devs](https://thespacedevs.com/)

## Development

Checkout the code and follow the guide here : https://developer.chrome.com/extensions/getstarted#unpacked

## Todo

List of tasks to complete. Feel free to add your own.

### Background 
- [x] Fetch launch data in background.
- [x] Update the badge with "Remaining time to launch".
- [x] Store the launch data locally
- [ ] Handle fetch errors
- [x] Schedule refresh based on a refresh rate.
- [ ] Use the refresh rate set in the options page.
- [ ] Throttle refreshes based on how close we are to the launch
- [ ] Update based on launch status.

### Popup
- [x] Read data from local cache instead of online query.
- [ ] Calculate the time difference between now and T0.
- [ ] Start a countdown timer
- [ ] Add a "More.." link which would point to launchlibrary.net (or other similar service).
- [ ] Add a more info link to agency, payloads etc.. 
- [ ] Add a webcast URL if available.
- [ ] Handle error when data is not available.

### Options
- [ ] Add filters based on agency, type of mission
- [ ] Add refresh rate.
- [ ] Add what fields the user would like to see in the popup.
- [ ] Add the number of upcoming launches to display as an option. Limit to 5.

## Installation

To install from [Chrome Webstore, Click here](https://chrome.google.com/webstore/detail/launch-alert/lbkbijggplkjkbccgmhkahpfhjlleacd)

## License

BSD 3 Clause

# angular-simpleStorage

A simple to use HTML5 local and session storage system for AngularJS

Basic useful feature list:

 * Create stored, session (tab/window) based and flash storage for AngularJS apps
 * Add an expiration to stored information
 * Automatically checks to see if stored information is an object/json string (converts if needed).
 * Very small (1.7kb minified / 5kb)
 
This is my first AngularJS module created out of the need to have persistant data across sessions.

### Installation Instructions

 * Clone or download the repository
 * Load the script in the &lt;head> of your index.html -> &lt;script src="/dist/angular-simpleStorage.min.js">&lt;/script>
 * Add the requirement 'simpleStorage' to your application module dependencies
 * Inject the desired objects in the module or controller level of your app

### Bower Installation
 * bower install angular-simple-storage

Example

```javascript
angular.module('myModule', [
	'simpleStorage',
    'myController'
]):

angular.module('myModule')
	.controller('myController', myController);

angular.module('myModule').inject = ['$local', '$session', '$flash'];

function myController($local, $session, $flash) {
	
    var testData = ['one', 2, 'three'];
    
    // $local    
    // Set without an expiration    
    $local.set('myTestData', testData);	  // Sets the value
    
    // Set with an expiration
    // Sets a localStorage key/value with an expiration of 1 day
    // Acceptable values are [second, seconds], [minute, minutes], [hour, hours], [day, days], [month, months], [year, years]
    $local.set('myTestData', testData, '1 day');
    
    // Gets the expiration date of data
    $local.getExp('myTestData');
    
    // If there is an expiration associated with the stored data it will return null
    $local.get('myTestData');				// Gets the value
    
    $local.remove('myTestData'); 			// Removes the data from local storage
    
    $local.all();							// Returns all key/values in a JSON string
    
    $local.clear();						  // Clears all local storage data
    
    // $session
    // Exact same usage as $local
    
    // $flash
    // Flash will only store data until it is called
    // This will work across browser tabs
    
    $flash.set('myTestData', testData);
    
    $flash.get('myTestData');
    
    // In case you want to remove it before it is called
    $flash.remove('myTestData');
    
}
```

This is [on GitHub](https://github.com/billbsquared/angular-simpleStorage) so let me know if you found something wrong with it.

I am also horrible at documentation and putting notes in my code, so please forgive me.

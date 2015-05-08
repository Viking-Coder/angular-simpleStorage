/*
 The MIT License (MIT)
 Copyright (c) 2014 Muhammed Ashik
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

/*
 Author  : Bill Brady <bill@thevikingcoder.com>
 Version : 1.2
 */

'use strict';

angular.module('simpleStorage', [])
    .factory('$local',['$rootScope', '$window', function ($rootScope, $window) {

        var $localFactory = {},
            method = $window.localStorage,
            pre = 'sS.expire.';

        /**
         * Creates a localStorage variable
         * @param k
         * @param v
         * @param expire
         * @returns {boolean}
         */
        $localFactory.set = function (k, v, expire) {
            method && method.setItem(k, checkObj(v));

            if (typeof expire != "undefined") {
                k = pre + k;
                method && method.setItem(k, parseDate(expire));
            }

            return !!this.get(k);
        };

        /**
         * Returns a localStorage value
         * @param k
         * @returns {*}
         */
        $localFactory.get = function (k) {
            if (method && method.getItem(pre + k)) {
                var expDate = new Date(method && method.getItem(pre + k)).getTime(),
                    $now = new Date().getTime();

                if (expDate < $now) {
                    method && method.removeItem(k);
                    method && method.removeItem(pre + k);
                    return null;
                }
            }

            return checkJson(method && method.getItem(k));
        };

        /**
         * Removes a localStorage item by key
         * @param k
         */
        $localFactory.remove = function (k) {
            method && method.removeItem(k);
        };

        /**
         * Removes all localStorage items
         */
        $localFactory.clear = function () {
            method && method.clear();
        };

        /**
         * A json string of all items in localStorage
         * @returns {{}}
         */
        $localFactory.all = function () {
            var i = 0,
                oJson = {},
                sKey;
            for (; sKey = method.key(i); i++) {
                oJson[sKey] = method.getItem(sKey);
            }

            return oJson;
        };

        return $localFactory;

    }])
    .factory('$session',['$rootScope', '$window', function ($rootScope, $window) {

        var $sessionFactory = {},
            method = $window.sessionStorage,
            pre = 'sS.expire.';

        /**
         * Creates a sessionStorage
         * @param k
         * @param v
         * @param expire
         * @returns {boolean}
         */
        $sessionFactory.set = function (k, v, expire) {
            method && method.setItem(k, checkObj(v));

            if (typeof expire != "undefined") {
                k = pre + k;
                method && method.setItem(k, parseDate(expire));
            }

            return !!this.get(k);
        };

        /**
         * Returns a sessionStorage value by key
         * @param k
         * @returns {*}
         */
        $sessionFactory.get = function (k) {
            if (method && method.getItem(pre + k)) {
                var expDate = new Date(method && method.getItem(pre + k)).getTime(),
                    $now = new Date().getTime();

                if (expDate < $now) {
                    method && method.removeItem(k);
                    method && method.removeItem(pre + k);
                    return null;
                }
            }

            return checkJson(method && method.getItem(k));
        };

        /**
         * Removes a sessionStorage item by key
         * @param k
         */
        $sessionFactory.remove = function (k) {
            method && method.removeItem(k);
        };

        /**
         * Removes all sessionStorage items
         */
        $sessionFactory.clear = function () {
            method && method.clear();
        };

        /**
         * A json string of all items in sessionStorage
         * @returns {{}}
         */
        $sessionFactory.all = function () {
            var i = 0,
                oJson = {},
                sKey;
            for (; sKey = method.key(i); i++) {
                oJson[sKey] = method.getItem(sKey);
            }

            return oJson;
        };

        return $sessionFactory;

    }])
    .factory('$flash',['$rootScope', '$window', function ($rootScope, $window) {

        var $flashFactory = {},
            pre = 'sS.flash.',
            method = $window.localStorage;
        /**
         * Creates an item in flash storage
         * @param k
         * @param v
         */
        $flashFactory.set = function (k, v) {
            method && method.setItem(pre + k, checkObj(v));
        };

        /**
         * Retrieves a value stored in the flash storage
         * @param k
         * @returns {*}
         */
        $flashFactory.get = function (k) {
            var val = checkJson(method && method.getItem(pre + k));
            method && method.removeItem(pre + k);
            return val;
        };

        /**
         * Removes an item in flash storage
         * @param k
         */
        $flashFactory.remove = function (k) {
            method && method.removeItem(pre + k);
        };

        return $flashFactory;

    }]);

/**
 *
 * @param el
 * @returns {*}
 */
function checkObj(el) {
    if (typeof el == "object") {
        return angular.toJson(el);
    }

    return el;
}

/**
 *
 * @param el
 * @returns {*}
 */
function checkJson(el) {
    var response;

    try {
        response = JSON.parse(el);
    } catch (e) {
        response = el;
    }

    return response;
}

/**
 *
 * @param dt
 * @returns {Date}
 */
function parseDate(dt) {

    /**
     * Defaults to milliseconds
     */

    var dtX = dt.split(' '),
        lng = parseInt(dtX[0]),
        method = dtX.length > 1 ? dtX[1] : null,
        $today = new Date();

    if (['year', 'years'].indexOf(method) > -1) {
        $today.setDate($today.getDate() + lng);
    }
    else if (['month', 'months'].indexOf(method) > -1) {
        $today.setMonth($today.getMonth() + lng);
    }
    else if (['day', 'days'].indexOf(method) > -1) {
        $today.setDate($today.getDate() + lng);
    }
    else if (['hour', 'hours'].indexOf(method) > -1) {
        $today.setHours($today.getHours() + lng);
    }
    else if (['minute', 'minutes'].indexOf(method) > -1) {
        $today.setMinutes($today.getMinutes() + lng);
    }
    else if (['second', 'seconds'].indexOf(method) > -1) {
        $today.setSeconds($today.getSeconds() + lng);
    }
    else {
        $today.setMilliseconds($today.getMilliseconds() + lng);
    }

    return $today;

}

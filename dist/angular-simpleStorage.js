'use strict';

(function () {

    /**
     * @ngdoc overview
     * @name simpleStorage
     */

    angular.module('simpleStorage', []).

    /**
     * @ngdoc object
     * @name simpleStorage.$local
     * @requires $rootScope
     * @requires $window
     */

        factory('$local', _simpleStorage('local')).

    /**
     * @ngdoc object
     * @name simpleStorage.$session
     * @requires $rootScope,
     * @requires $window
     */

        factory('$session', _simpleStorage('session')).

    /**
     * @ngdoc object
     * @name simpleStorage.
     * @requires $rootScope
     * @requires @window
     */

        factory('$flash', _flashStorage());

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

    function checkJson(el) {

        var response;

        try {
            response = JSON.parse(el);
        }
        catch (e) {
            response = el;
        }

        return response;

    }

    function checkObj(el) {

        if (typeof el == "object") {
            return angular.toJson(el);
        }

        return el;

    }

    function _simpleStorage(method) {

        return [

            '$rootScope', '$window',

            function ($rootScope, $window) {

                var method = method == 'local' ? $window.localStorage : $window.sessionStorage,
                    pre = 'sS.expire.';

                return {

                    set: function (k, v, expire) {

                        method && method.setItem(k, checkObj(v));

                        if (typeof(expire) != 'undefined') {
                            k = pre + k;
                            method && method.setItem(k, parseDate(expire));
                        }

                        return this;

                    },
                    get: function (k) {

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

                    },
                    getExp: function (k) {

                        if (method && method.getItem(pre + k)) {
                            return method && method.getItem(pre + k);
                        }

                        return null;

                    },
                    remove: function (k) {
                        method && method.removeItem(k);
                    },
                    clear: function () {
                        method && method.clear();
                    },
                    all: function () {
                        var i = 0,
                            oJson = {},
                            sKey;
                        for (; sKey = method.key(i); i++) {
                            oJson[sKey] = method.getItem(sKey);
                        }
                        return oJson;
                    }

                }

            }

        ]

    }

    function _flashStorage() {

        return [

            '$rootScope', '$window',

            function ($rootScope, $window) {

                var pre = 'sS.flash.',
                    method = $window.localStorage;

                return {

                    set: function (k, v) {
                        k = pre + k;
                        method && method.setItem(k, checkObj(v));
                    },
                    get: function (k) {
                        k = pre + k;
                        var val = checkJson(method && method.getItem(k));
                        method && method.removeItem(k);
                        return val;
                    },
                    remove: function (k) {
                        k = pre + k;
                        method && method.remove(k);
                    }

                }

            }

        ]

    }

})();

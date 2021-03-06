/*!
 * angular-validation-match
 * Checks if one input matches another
 * @version v1.9.0
 * @link https://github.com/TheSharpieOne/angular-validation-match
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(t,a,e){"use strict";function n(t){return{require:"?ngModel",restrict:"A",link:function(e,n,i,r){function c(){var t=o(e);return a.isObject(t)&&t.hasOwnProperty("$viewValue")&&(t=t.$viewValue),t}if(r&&i.match){var o=t(i.match),u=t(i.matchCaseless),l=t(i.notMatch),s=t(i.matchIgnoreEmpty);e.$watch(c,function(){r.$$parseAndValidate()}),r.$validators.match=function(t,n){var i,r=t||n,o=c(),d=l(e);return s(e)&&!n?!0:(i=u(e)?a.lowercase(r)===a.lowercase(o):r===o,i^=d,!!i)}}}}}n.$inject=["$parse"],a.module("validation.match",[]),a.module("validation.match").directive("match",n)}(window,window.angular);
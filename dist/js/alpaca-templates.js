<<<<<<< HEAD
angular.module('alpacaTemplates', []).run(['$templateCache', function($templateCache) {$templateCache.put('alpaca-template-index','<div class="content-wrapper"><header class="cyan"><h1 class="white-text">Header</h1></header><main><alpaca-slides></alpaca-slides></main><footer class="grey darken-3"><h1 class="white-text">Footer</h1></footer></div>');
$templateCache.put('alpaca-template-likert_image_left','<div class="container"><div class="card"><div class="row"><div class="col s4"><img class="responsive-img" ng-src="{{slide.image}}"/></div><div class="col s8"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}" ng-click="fn.result(&quot;option&quot;, option, slide);fn.next(400)"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-likert_image_none','<div class="container"><div class="card"><div class="row"><div class="col s12"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}" ng-click="fn.result(&quot;option&quot;, option, slide);fn.next(400)"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-likert_image_right','<div class="container"><div class="card"><div class="row"><div class="col s8"><h3>{{slide.content}}</h3></div><div class="col s4"><img class="right responsive-img" ng-src="{{slide.image}}"/></div></div></div></div><div class="radioset"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}" ng-click="fn.result(&quot;option&quot;, option, slide);fn.next(400)"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-multiple_choice_image_left','<div class="container"><div class="card"><div class="row"><div class="col s4"><img class="responsive-img" ng-src="{{slide.image}}"/></div><div class="col s8"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset nobar"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}" ng-click="fn.result(&quot;option&quot;, option, slide);fn.next(400)"/><label for="radio-{{slide.id}}-{{$index}}" ng-class="{wrong: option.correct == false, correct: option.correct}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-multiple_choice_image_none','<div class="container"><div class="card"><div class="row"><div class="col s12"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset nobar"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}" ng-click="fn.result(&quot;option&quot;, option, slide);fn.next(400)"/><label for="radio-{{slide.id}}-{{$index}}" ng-class="{wrong: option.correct == false, correct: option.correct}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-multiple_choice_image_right','<div class="container"><div class="card"><div class="row"><div class="col s8"><h3>{{slide.content}}</h3></div><div class="col s4"><img class="right responsive-img" ng-src="{{slide.image}}"/></div></div></div></div><div class="radioset nobar"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}" ng-click="fn.result(&quot;option&quot;, option, slide);fn.next(400)"/><label for="radio-{{slide.id}}-{{$index}}" ng-class="{wrong: option.correct == false, correct: option.correct}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-text_image_left','<div class="container"><div class="card"><div class="row"><div class="col s4"><img class="responsive-img" ng-src="{{slide.image}}"/></div><div class="col s8"><h3>{{slide.content}}</h3></div></div></div></div>');
=======
angular.module('alpacaTemplates', []).run(['$templateCache', function($templateCache) {$templateCache.put('alpaca-template-index','<div class="content-wrapper"><header class="cyan"><!--h1.white-text Header--></header><main><alpaca-slides></alpaca-slides></main><footer class="grey darken-3"><!--h1.white-text Footer--></footer></div>');
$templateCache.put('alpaca-template-likert_image_left','<div class="container"><div class="card"><div class="row"><div class="col s4"><img class="responsive-img" ng-src="{{slide.image}}" style="padding:15px; margin-top:8px;"/></div><div class="col s8"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-likert_image_none','<div class="container"><div class="card"><div class="row"><div class="col s12"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-likert_image_right','<div class="container"><div class="card"><div class="row"><div class="col s8"><h3>{{slide.content}}</h3></div><div class="col s4"><img class="right responsive-img" ng-src="{{slide.image}}" style="padding:10px;margin-top:8px;"/></div></div></div></div><div class="radioset"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-multiple_choice_image_left','<div class="container"><div class="card"><div class="row"><div class="col s4"><img class="responsive-img" ng-src="{{slide.image}}" style="padding:15px; margin-top:8px;"/></div><div class="col s8"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset nobar"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-multiple_choice_image_none','<div class="container"><div class="card"><div class="row"><div class="col s12"><h3>{{slide.content}}</h3></div></div></div></div><div class="radioset nobar"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-multiple_choice_image_right','<div class="container"><div class="card"><div class="row"><div class="col s8"><h3>{{slide.content}}</h3></div><div class="col s4"><img class="right responsive-img" ng-src="{{slide.image}}" style="padding:10px;margin-top:8px;"/></div></div></div></div><div class="radioset nobar"><ul><li ng-repeat="option in slide.options"><input type="radio" name="radio-{{slide.id}}[]" id="radio-{{slide.id}}-{{$index}}"/><label for="radio-{{slide.id}}-{{$index}}"></label></li></ul></div><div class="text-labels"><div class="text-label" ng-repeat="option in slide.options">{{option.text}}</div></div>');
$templateCache.put('alpaca-template-text_image_left','<div class="container"><div class="card"><div class="row"><div class="col s4"><img class="responsive-img" ng-src="{{slide.image}}" style="padding:15px; margin-top:8px;"/></div><div class="col s8"><h3>{{slide.content}}</h3></div></div></div></div>');
>>>>>>> 43a20aeb5998bf4bdd814b82099eba00d9ff4bec
$templateCache.put('alpaca-template-text_image_none','<div class="container"><div class="card"><div class="row"><div class="col s12"><h3>{{slide.content}}</h3></div></div></div></div>');
$templateCache.put('alpaca-template-text_image_right','<div class="container"><div class="card"><div class="row"><div class="col s8"><h3>{{slide.content}}</h3></div><div class="col s4"><img class="right responsive-img" ng-src="{{slide.image}}" style="padding:10px;margin-top:8px;"/></div></div></div></div>');}]);
angular.module("alpacaTemplates")			.service("$templateList", function() { this.templates = [];this.templates.push("index");
this.templates.push("likert_image_left");
this.templates.push("likert_image_none");
this.templates.push("likert_image_right");
this.templates.push("multiple_choice_image_left");
this.templates.push("multiple_choice_image_none");
this.templates.push("multiple_choice_image_right");
this.templates.push("text_image_left");
this.templates.push("text_image_none");
this.templates.push("text_image_right");this.templates.splice(this.templates.indexOf("index"),1);});
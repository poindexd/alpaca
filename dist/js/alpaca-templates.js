angular.module('alpacaTemplates', []).run(['$templateCache', function($templateCache) {$templateCache.put('alpaca-template-green','<div class="container"><div class="card medium green"><h1>{{slide.title}}</h1><h2>{{slide.content}}</h2></div></div>');
$templateCache.put('alpaca-template-index','<div class="content-wrapper"><header class="cyan"><h1 class="white-text">Header</h1></header><main><alpaca-slides></alpaca-slides></main><footer class="grey darken-3"><h1 class="white-text">Footer</h1></footer></div>');
$templateCache.put('alpaca-template-orange','<div class="container"><div class="card medium orange"><h1>{{slide.title}}</h1><h2>{{slide.content}}</h2><img ng-src="{{slide.note}}"/></div></div>');}]);
angular.module("alpacaTemplates")			.service("$templateList", function() { this.templates = [];this.templates.push("green");
this.templates.push("index");
this.templates.push("orange");this.templates.splice(this.templates.indexOf("index"),1);});
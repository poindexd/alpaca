angular.module('alpacaTemplates', []).run(['$templateCache', function($templateCache) {$templateCache.put('alpaca-template-green','<div class="container"><div class="card medium green"><h1>{{slide.title}}</h1><h2>{{slide.content}}</h2></div></div>');
$templateCache.put('alpaca-template-index','<div class="content-wrapper"><header class="red"><h1>Header</h1></header><main><alpaca-slides></alpaca-slides></main><footer class="blue"><h1>Footer</h1></footer></div>');
$templateCache.put('alpaca-template-orange','<div class="container"><div class="card medium orange"><h1>{{slide.title}}</h1><h2>{{slide.content}}</h2></div></div>');}]);
angular.module("alpacaTemplates")			.service("$templateList", function() { this.templates = [];this.templates.push("green");
this.templates.push("index");
this.templates.push("orange");});
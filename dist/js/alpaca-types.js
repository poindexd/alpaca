angular.module('alpacaTypes', []).run(['$templateCache', function($templateCache) {$templateCache.put('alpaca-type-checkbox','<label>{{field.label}}</label><input class="filled-in" type="checkbox" ng-model="model"/>');
$templateCache.put('alpaca-type-file','<label>{{field.label}}</label><br/><div class="row" flow-init="flow-init" flow-files-submitted="fn.fileSuccess($file, $flow, slide, field, model)"><div class="col s12 center" ng-if="!model"><div class="btn" flow-btn="flow-btn" flow-drop="flow-drop">Upload<i class="material-icons left">cloud_upload</i></div></div><div class="col s12" ng-if="model"><div class="btn">{{$flow.files[0].name}}</div></div></div>');
$templateCache.put('alpaca-type-input','<label>{{field.label}}</label><input ng-model="model"/>');
$templateCache.put('alpaca-type-multiple','<label>{{field.label}}</label><div class="collection"><div class="collection-item" style="position: relative" ng-repeat="_model in model"><div ng-repeat="_field in field.fields"><alpaca-field model="_model[_field.key]" type="_field.type" field="_field" fn="fn[_field.type]" slide="selected"></alpaca-field></div><a href="#!" style="position: absolute; right: 10px; top:10px" ng-click="model.splice($index, 1);"><i class="material-icons">close</i></a></div><div class="collection-item center"><a href="#!" ng-click="model=model||[];model.push({});"><i class="material-icons">add</i></a></div></div>');
$templateCache.put('alpaca-type-tags','<label>{{field.label}}</label><tags-input ng-model="model" replace-spaces-with-dashes="false"><auto-complete source="fn.search($query);"></auto-complete></tags-input>');
$templateCache.put('alpaca-type-template','<label>{{field.label}}</label><br/><div class="row"><div class="col s12 center"><div class="btn" data-target="template-modal">Template<i class="material-icons left">code</i></div></div></div><div class="modal modal-fixed-footer" id="template-modal"><div class="modal-content"><div class="template-thumbnail" ng-repeat="template in templates" ng-class="{selected: slide.template == template}" ng-click="slide.template = template"><img class="responsive-img" ng-src="./thumbnails/{{template}}.png"/><label>{{template}}</label></div></div><div class="modal-footer"><div class="btn-flat modal-action modal-close">Close</div></div></div>');
$templateCache.put('alpaca-type-textarea','<label>{{field.label}}</label><textarea class="materialize-textarea" ng-model="model"></textarea>');}]);

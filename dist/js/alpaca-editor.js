/**
 * angular-drag-and-drop-lists v2.1.0
 *
 * Copyright (c) 2014 Marcel Juenemann marcel@juenemann.cc
 * Copyright (c) 2014-2017 Google Inc.
 * https://github.com/marceljuenemann/angular-drag-and-drop-lists
 *
 * License: MIT
 */
(function(dndLists) {

  // In standard-compliant browsers we use a custom mime type and also encode the dnd-type in it.
  // However, IE and Edge only support a limited number of mime types. The workarounds are described
  // in https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
  var MIME_TYPE = 'application/x-dnd';
  var EDGE_MIME_TYPE = 'application/json';
  var MSIE_MIME_TYPE = 'Text';

  // All valid HTML5 drop effects, in the order in which we prefer to use them.
  var ALL_EFFECTS = ['move', 'copy', 'link'];

  /**
   * Use the dnd-draggable attribute to make your element draggable
   *
   * Attributes:
   * - dnd-draggable      Required attribute. The value has to be an object that represents the data
   *                      of the element. In case of a drag and drop operation the object will be
   *                      serialized and unserialized on the receiving end.
   * - dnd-effect-allowed Use this attribute to limit the operations that can be performed. Valid
   *                      options are "move", "copy" and "link", as well as "all", "copyMove",
   *                      "copyLink" and "linkMove". The semantics of these operations are up to you
   *                      and have to be implemented using the callbacks described below. If you
   *                      allow multiple options, the user can choose between them by using the
   *                      modifier keys (OS specific). The cursor will be changed accordingly,
   *                      expect for IE and Edge, where this is not supported.
   * - dnd-type           Use this attribute if you have different kinds of items in your
   *                      application and you want to limit which items can be dropped into which
   *                      lists. Combine with dnd-allowed-types on the dnd-list(s). This attribute
   *                      must be a lower case string. Upper case characters can be used, but will
   *                      be converted to lower case automatically.
   * - dnd-disable-if     You can use this attribute to dynamically disable the draggability of the
   *                      element. This is useful if you have certain list items that you don't want
   *                      to be draggable, or if you want to disable drag & drop completely without
   *                      having two different code branches (e.g. only allow for admins).
   *
   * Callbacks:
   * - dnd-dragstart      Callback that is invoked when the element was dragged. The original
   *                      dragstart event will be provided in the local event variable.
   * - dnd-moved          Callback that is invoked when the element was moved. Usually you will
   *                      remove your element from the original list in this callback, since the
   *                      directive is not doing that for you automatically. The original dragend
   *                      event will be provided in the local event variable.
   * - dnd-copied         Same as dnd-moved, just that it is called when the element was copied
   *                      instead of moved, so you probably want to implement a different logic.
   * - dnd-linked         Same as dnd-moved, just that it is called when the element was linked
   *                      instead of moved, so you probably want to implement a different logic.
   * - dnd-canceled       Callback that is invoked if the element was dragged, but the operation was
   *                      canceled and the element was not dropped. The original dragend event will
   *                      be provided in the local event variable.
   * - dnd-dragend        Callback that is invoked when the drag operation ended. Available local
   *                      variables are event and dropEffect.
   * - dnd-selected       Callback that is invoked when the element was clicked but not dragged.
   *                      The original click event will be provided in the local event variable.
   * - dnd-callback       Custom callback that is passed to dropzone callbacks and can be used to
   *                      communicate between source and target scopes. The dropzone can pass user
   *                      defined variables to this callback.
   *
   * CSS classes:
   * - dndDragging        This class will be added to the element while the element is being
   *                      dragged. It will affect both the element you see while dragging and the
   *                      source element that stays at it's position. Do not try to hide the source
   *                      element with this class, because that will abort the drag operation.
   * - dndDraggingSource  This class will be added to the element after the drag operation was
   *                      started, meaning it only affects the original element that is still at
   *                      it's source position, and not the "element" that the user is dragging with
   *                      his mouse pointer.
   */
  dndLists.directive('dndDraggable', ['$parse', '$timeout', function($parse, $timeout) {
    return function(scope, element, attr) {
      // Set the HTML5 draggable attribute on the element.
      element.attr("draggable", "true");

      // If the dnd-disable-if attribute is set, we have to watch that.
      if (attr.dndDisableIf) {
        scope.$watch(attr.dndDisableIf, function(disabled) {
          element.attr("draggable", !disabled);
        });
      }

      /**
       * When the drag operation is started we have to prepare the dataTransfer object,
       * which is the primary way we communicate with the target element
       */
      element.on('dragstart', function(event) {
        event = event.originalEvent || event;

        // Check whether the element is draggable, since dragstart might be triggered on a child.
        if (element.attr('draggable') == 'false') return true;

        // Initialize global state.
        dndState.isDragging = true;
        dndState.itemType = attr.dndType && scope.$eval(attr.dndType).toLowerCase();

        // Set the allowed drop effects. See below for special IE handling.
        dndState.dropEffect = "none";
        dndState.effectAllowed = attr.dndEffectAllowed || ALL_EFFECTS[0];
        event.dataTransfer.effectAllowed = dndState.effectAllowed;

        // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
        // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
        var item = scope.$eval(attr.dndDraggable);
        var mimeType = MIME_TYPE + (dndState.itemType ? ('-' + dndState.itemType) : '');
        try {
          event.dataTransfer.setData(mimeType, angular.toJson(item));
        } catch (e) {
          // Setting a custom MIME type did not work, we are probably in IE or Edge.
          var data = angular.toJson({item: item, type: dndState.itemType});
          try {
            event.dataTransfer.setData(EDGE_MIME_TYPE, data);
          } catch (e) {
            // We are in Internet Explorer and can only use the Text MIME type. Also note that IE
            // does not allow changing the cursor in the dragover event, therefore we have to choose
            // the one we want to display now by setting effectAllowed.
            var effectsAllowed = filterEffects(ALL_EFFECTS, dndState.effectAllowed);
            event.dataTransfer.effectAllowed = effectsAllowed[0];
            event.dataTransfer.setData(MSIE_MIME_TYPE, data);
          }
        }

        // Add CSS classes. See documentation above.
        element.addClass("dndDragging");
        $timeout(function() { element.addClass("dndDraggingSource"); }, 0);

        // Try setting a proper drag image if triggered on a dnd-handle (won't work in IE).
        if (event._dndHandle && event.dataTransfer.setDragImage) {
          event.dataTransfer.setDragImage(element[0], 0, 0);
        }

        // Invoke dragstart callback and prepare extra callback for dropzone.
        $parse(attr.dndDragstart)(scope, {event: event});
        if (attr.dndCallback) {
          var callback = $parse(attr.dndCallback);
          dndState.callback = function(params) { return callback(scope, params || {}); };
        }

        event.stopPropagation();
      });

      /**
       * The dragend event is triggered when the element was dropped or when the drag
       * operation was aborted (e.g. hit escape button). Depending on the executed action
       * we will invoke the callbacks specified with the dnd-moved or dnd-copied attribute.
       */
      element.on('dragend', function(event) {
        event = event.originalEvent || event;

        // Invoke callbacks. Usually we would use event.dataTransfer.dropEffect to determine
        // the used effect, but Chrome has not implemented that field correctly. On Windows
        // it always sets it to 'none', while Chrome on Linux sometimes sets it to something
        // else when it's supposed to send 'none' (drag operation aborted).
        scope.$apply(function() {
          var dropEffect = dndState.dropEffect;
          var cb = {copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled'};
          $parse(attr[cb[dropEffect]])(scope, {event: event});
          $parse(attr.dndDragend)(scope, {event: event, dropEffect: dropEffect});
        });

        // Clean up
        dndState.isDragging = false;
        dndState.callback = undefined;
        element.removeClass("dndDragging");
        element.removeClass("dndDraggingSource");
        event.stopPropagation();

        // In IE9 it is possible that the timeout from dragstart triggers after the dragend handler.
        $timeout(function() { element.removeClass("dndDraggingSource"); }, 0);
      });

      /**
       * When the element is clicked we invoke the callback function
       * specified with the dnd-selected attribute.
       */
      element.on('click', function(event) {
        if (!attr.dndSelected) return;

        event = event.originalEvent || event;
        scope.$apply(function() {
          $parse(attr.dndSelected)(scope, {event: event});
        });

        // Prevent triggering dndSelected in parent elements.
        event.stopPropagation();
      });

      /**
       * Workaround to make element draggable in IE9
       */
      element.on('selectstart', function() {
        if (this.dragDrop) this.dragDrop();
      });
    };
  }]);

  /**
   * Use the dnd-list attribute to make your list element a dropzone. Usually you will add a single
   * li element as child with the ng-repeat directive. If you don't do that, we will not be able to
   * position the dropped element correctly. If you want your list to be sortable, also add the
   * dnd-draggable directive to your li element(s).
   *
   * Attributes:
   * - dnd-list             Required attribute. The value has to be the array in which the data of
   *                        the dropped element should be inserted. The value can be blank if used
   *                        with a custom dnd-drop handler that always returns true.
   * - dnd-allowed-types    Optional array of allowed item types. When used, only items that had a
   *                        matching dnd-type attribute will be dropable. Upper case characters will
   *                        automatically be converted to lower case.
   * - dnd-effect-allowed   Optional string expression that limits the drop effects that can be
   *                        performed in the list. See dnd-effect-allowed on dnd-draggable for more
   *                        details on allowed options. The default value is all.
   * - dnd-disable-if       Optional boolean expresssion. When it evaluates to true, no dropping
   *                        into the list is possible. Note that this also disables rearranging
   *                        items inside the list.
   * - dnd-horizontal-list  Optional boolean expresssion. When it evaluates to true, the positioning
   *                        algorithm will use the left and right halfs of the list items instead of
   *                        the upper and lower halfs.
   * - dnd-external-sources Optional boolean expression. When it evaluates to true, the list accepts
   *                        drops from sources outside of the current browser tab. This allows to
   *                        drag and drop accross different browser tabs. The only major browser
   *                        that does not support this is currently Microsoft Edge.
   *
   * Callbacks:
   * - dnd-dragover         Optional expression that is invoked when an element is dragged over the
   *                        list. If the expression is set, but does not return true, the element is
   *                        not allowed to be dropped. The following variables will be available:
   *                        - event: The original dragover event sent by the browser.
   *                        - index: The position in the list at which the element would be dropped.
   *                        - type: The dnd-type set on the dnd-draggable, or undefined if non was
   *                          set. Will be null for drops from external sources in IE and Edge,
   *                          since we don't know the type in those cases.
   *                        - dropEffect: One of move, copy or link, see dnd-effect-allowed.
   *                        - external: Whether the element was dragged from an external source.
   *                        - callback: If dnd-callback was set on the source element, this is a
   *                          function reference to the callback. The callback can be invoked with
   *                          custom variables like this: callback({var1: value1, var2: value2}).
   *                          The callback will be executed on the scope of the source element. If
   *                          dnd-external-sources was set and external is true, this callback will
   *                          not be available.
   * - dnd-drop             Optional expression that is invoked when an element is dropped on the
   *                        list. The same variables as for dnd-dragover will be available, with the
   *                        exception that type is always known and therefore never null. There
   *                        will also be an item variable, which is the transferred object. The
   *                        return value determines the further handling of the drop:
   *                        - falsy: The drop will be canceled and the element won't be inserted.
   *                        - true: Signalises that the drop is allowed, but the dnd-drop
   *                          callback already took care of inserting the element.
   *                        - otherwise: All other return values will be treated as the object to
   *                          insert into the array. In most cases you want to simply return the
   *                          item parameter, but there are no restrictions on what you can return.
   * - dnd-inserted         Optional expression that is invoked after a drop if the element was
   *                        actually inserted into the list. The same local variables as for
   *                        dnd-drop will be available. Note that for reorderings inside the same
   *                        list the old element will still be in the list due to the fact that
   *                        dnd-moved was not called yet.
   *
   * CSS classes:
   * - dndPlaceholder       When an element is dragged over the list, a new placeholder child
   *                        element will be added. This element is of type li and has the class
   *                        dndPlaceholder set. Alternatively, you can define your own placeholder
   *                        by creating a child element with dndPlaceholder class.
   * - dndDragover          Will be added to the list while an element is dragged over the list.
   */
  dndLists.directive('dndList', ['$parse', function($parse) {
    return function(scope, element, attr) {
      // While an element is dragged over the list, this placeholder element is inserted
      // at the location where the element would be inserted after dropping.
      var placeholder = getPlaceholderElement();
      placeholder.remove();

      var placeholderNode = placeholder[0];
      var listNode = element[0];
      var listSettings = {};

      /**
       * The dragenter event is fired when a dragged element or text selection enters a valid drop
       * target. According to the spec, we either need to have a dropzone attribute or listen on
       * dragenter events and call preventDefault(). It should be noted though that no browser seems
       * to enforce this behaviour.
       */
      element.on('dragenter', function (event) {
        event = event.originalEvent || event;

        // Calculate list properties, so that we don't have to repeat this on every dragover event.
        var types = attr.dndAllowedTypes && scope.$eval(attr.dndAllowedTypes);
        listSettings = {
          allowedTypes: angular.isArray(types) && types.join('|').toLowerCase().split('|'),
          disabled: attr.dndDisableIf && scope.$eval(attr.dndDisableIf),
          externalSources: attr.dndExternalSources && scope.$eval(attr.dndExternalSources),
          horizontal: attr.dndHorizontalList && scope.$eval(attr.dndHorizontalList)
        };

        var mimeType = getMimeType(event.dataTransfer.types);
        if (!mimeType || !isDropAllowed(getItemType(mimeType))) return true;
        event.preventDefault();
      });

      /**
       * The dragover event is triggered "every few hundred milliseconds" while an element
       * is being dragged over our list, or over an child element.
       */
      element.on('dragover', function(event) {
        event = event.originalEvent || event;

        // Check whether the drop is allowed and determine mime type.
        var mimeType = getMimeType(event.dataTransfer.types);
        var itemType = getItemType(mimeType);
        if (!mimeType || !isDropAllowed(itemType)) return true;

        // Make sure the placeholder is shown, which is especially important if the list is empty.
        if (placeholderNode.parentNode != listNode) {
          element.append(placeholder);
        }

        if (event.target != listNode) {
          // Try to find the node direct directly below the list node.
          var listItemNode = event.target;
          while (listItemNode.parentNode != listNode && listItemNode.parentNode) {
            listItemNode = listItemNode.parentNode;
          }

          if (listItemNode.parentNode == listNode && listItemNode != placeholderNode) {
            // If the mouse pointer is in the upper half of the list item element,
            // we position the placeholder before the list item, otherwise after it.
            var rect = listItemNode.getBoundingClientRect();
            if (listSettings.horizontal) {
              var isFirstHalf = event.clientX < rect.left + rect.width / 2;
            } else {
              var isFirstHalf = event.clientY < rect.top + rect.height / 2;
            }
            listNode.insertBefore(placeholderNode,
                isFirstHalf ? listItemNode : listItemNode.nextSibling);
          }
        }

        // In IE we set a fake effectAllowed in dragstart to get the correct cursor, we therefore
        // ignore the effectAllowed passed in dataTransfer. We must also not access dataTransfer for
        // drops from external sources, as that throws an exception.
        var ignoreDataTransfer = mimeType == MSIE_MIME_TYPE;
        var dropEffect = getDropEffect(event, ignoreDataTransfer);
        if (dropEffect == 'none') return stopDragover();

        // At this point we invoke the callback, which still can disallow the drop.
        // We can't do this earlier because we want to pass the index of the placeholder.
        if (attr.dndDragover && !invokeCallback(attr.dndDragover, event, dropEffect, itemType)) {
          return stopDragover();
        }

        // Set dropEffect to modify the cursor shown by the browser, unless we're in IE, where this
        // is not supported. This must be done after preventDefault in Firefox.
        event.preventDefault();
        if (!ignoreDataTransfer) {
          event.dataTransfer.dropEffect = dropEffect;
        }

        element.addClass("dndDragover");
        event.stopPropagation();
        return false;
      });

      /**
       * When the element is dropped, we use the position of the placeholder element as the
       * position where we insert the transferred data. This assumes that the list has exactly
       * one child element per array element.
       */
      element.on('drop', function(event) {
        event = event.originalEvent || event;

        // Check whether the drop is allowed and determine mime type.
        var mimeType = getMimeType(event.dataTransfer.types);
        var itemType = getItemType(mimeType);
        if (!mimeType || !isDropAllowed(itemType)) return true;

        // The default behavior in Firefox is to interpret the dropped element as URL and
        // forward to it. We want to prevent that even if our drop is aborted.
        event.preventDefault();

        // Unserialize the data that was serialized in dragstart.
        try {
          var data = JSON.parse(event.dataTransfer.getData(mimeType));
        } catch(e) {
          return stopDragover();
        }

        // Drops with invalid types from external sources might not have been filtered out yet.
        if (mimeType == MSIE_MIME_TYPE || mimeType == EDGE_MIME_TYPE) {
          itemType = data.type || undefined;
          data = data.item;
          if (!isDropAllowed(itemType)) return stopDragover();
        }

        // Special handling for internal IE drops, see dragover handler.
        var ignoreDataTransfer = mimeType == MSIE_MIME_TYPE;
        var dropEffect = getDropEffect(event, ignoreDataTransfer);
        if (dropEffect == 'none') return stopDragover();

        // Invoke the callback, which can transform the transferredObject and even abort the drop.
        var index = getPlaceholderIndex();
        if (attr.dndDrop) {
          data = invokeCallback(attr.dndDrop, event, dropEffect, itemType, index, data);
          if (!data) return stopDragover();
        }

        // The drop is definitely going to happen now, store the dropEffect.
        dndState.dropEffect = dropEffect;
        if (!ignoreDataTransfer) {
          event.dataTransfer.dropEffect = dropEffect;
        }

        // Insert the object into the array, unless dnd-drop took care of that (returned true).
        if (data !== true) {
          scope.$apply(function() {
            scope.$eval(attr.dndList).splice(index, 0, data);
          });
        }
        invokeCallback(attr.dndInserted, event, dropEffect, itemType, index, data);

        // Clean up
        stopDragover();
        event.stopPropagation();
        return false;
      });

      /**
       * We have to remove the placeholder when the element is no longer dragged over our list. The
       * problem is that the dragleave event is not only fired when the element leaves our list,
       * but also when it leaves a child element. Therefore, we determine whether the mouse cursor
       * is still pointing to an element inside the list or not.
       */
      element.on('dragleave', function(event) {
        event = event.originalEvent || event;

        var newTarget = document.elementFromPoint(event.clientX, event.clientY);
        if (listNode.contains(newTarget) && !event._dndPhShown) {
          // Signalize to potential parent lists that a placeholder is already shown.
          event._dndPhShown = true;
        } else {
          stopDragover();
        }
      });

      /**
       * Given the types array from the DataTransfer object, returns the first valid mime type.
       * A type is valid if it starts with MIME_TYPE, or it equals MSIE_MIME_TYPE or EDGE_MIME_TYPE.
       */
      function getMimeType(types) {
        if (!types) return MSIE_MIME_TYPE; // IE 9 workaround.
        for (var i = 0; i < types.length; i++) {
          if (types[i] == MSIE_MIME_TYPE || types[i] == EDGE_MIME_TYPE ||
              types[i].substr(0, MIME_TYPE.length) == MIME_TYPE) {
            return types[i];
          }
        }
        return null;
      }

      /**
       * Determines the type of the item from the dndState, or from the mime type for items from
       * external sources. Returns undefined if no item type was set and null if the item type could
       * not be determined.
       */
      function getItemType(mimeType) {
        if (dndState.isDragging) return dndState.itemType || undefined;
        if (mimeType == MSIE_MIME_TYPE || mimeType == EDGE_MIME_TYPE) return null;
        return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
      }

      /**
       * Checks various conditions that must be fulfilled for a drop to be allowed, including the
       * dnd-allowed-types attribute. If the item Type is unknown (null), the drop will be allowed.
       */
      function isDropAllowed(itemType) {
        if (listSettings.disabled) return false;
        if (!listSettings.externalSources && !dndState.isDragging) return false;
        if (!listSettings.allowedTypes || itemType === null) return true;
        return itemType && listSettings.allowedTypes.indexOf(itemType) != -1;
      }

      /**
       * Determines which drop effect to use for the given event. In Internet Explorer we have to
       * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
       * In those cases we rely on dndState to filter effects. Read the design doc for more details:
       * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
       */
      function getDropEffect(event, ignoreDataTransfer) {
        var effects = ALL_EFFECTS;
        if (!ignoreDataTransfer) {
          effects = filterEffects(effects, event.dataTransfer.effectAllowed);
        }
        if (dndState.isDragging) {
          effects = filterEffects(effects, dndState.effectAllowed);
        }
        if (attr.dndEffectAllowed) {
          effects = filterEffects(effects, attr.dndEffectAllowed);
        }
        // MacOS automatically filters dataTransfer.effectAllowed depending on the modifier keys,
        // therefore the following modifier keys will only affect other operating systems.
        if (!effects.length) {
          return 'none';
        } else if (event.ctrlKey && effects.indexOf('copy') != -1) {
          return 'copy';
        } else if (event.altKey && effects.indexOf('link') != -1) {
          return 'link';
        } else {
          return effects[0];
        }
      }

      /**
       * Small helper function that cleans up if we aborted a drop.
       */
      function stopDragover() {
        placeholder.remove();
        element.removeClass("dndDragover");
        return true;
      }

      /**
       * Invokes a callback with some interesting parameters and returns the callbacks return value.
       */
      function invokeCallback(expression, event, dropEffect, itemType, index, item) {
        return $parse(expression)(scope, {
          callback: dndState.callback,
          dropEffect: dropEffect,
          event: event,
          external: !dndState.isDragging,
          index: index !== undefined ? index : getPlaceholderIndex(),
          item: item || undefined,
          type: itemType
        });
      }

      /**
       * We use the position of the placeholder node to determine at which position of the array the
       * object needs to be inserted
       */
      function getPlaceholderIndex() {
        return Array.prototype.indexOf.call(listNode.children, placeholderNode);
      }

      /**
       * Tries to find a child element that has the dndPlaceholder class set. If none was found, a
       * new li element is created.
       */
      function getPlaceholderElement() {
        var placeholder;
        angular.forEach(element.children(), function(childNode) {
          var child = angular.element(childNode);
          if (child.hasClass('dndPlaceholder')) {
            placeholder = child;
          }
        });
        return placeholder || angular.element("<li class='dndPlaceholder'></li>");
      }
    };
  }]);

  /**
   * Use the dnd-nodrag attribute inside of dnd-draggable elements to prevent them from starting
   * drag operations. This is especially useful if you want to use input elements inside of
   * dnd-draggable elements or create specific handle elements. Note: This directive does not work
   * in Internet Explorer 9.
   */
  dndLists.directive('dndNodrag', function() {
    return function(scope, element, attr) {
      // Set as draggable so that we can cancel the events explicitly
      element.attr("draggable", "true");

      /**
       * Since the element is draggable, the browser's default operation is to drag it on dragstart.
       * We will prevent that and also stop the event from bubbling up.
       */
      element.on('dragstart', function(event) {
        event = event.originalEvent || event;

        if (!event._dndHandle) {
          // If a child element already reacted to dragstart and set a dataTransfer object, we will
          // allow that. For example, this is the case for user selections inside of input elements.
          if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
            event.preventDefault();
          }
          event.stopPropagation();
        }
      });

      /**
       * Stop propagation of dragend events, otherwise dnd-moved might be triggered and the element
       * would be removed.
       */
      element.on('dragend', function(event) {
        event = event.originalEvent || event;
        if (!event._dndHandle) {
          event.stopPropagation();
        }
      });
    };
  });

  /**
   * Use the dnd-handle directive within a dnd-nodrag element in order to allow dragging with that
   * element after all. Therefore, by combining dnd-nodrag and dnd-handle you can allow
   * dnd-draggable elements to only be dragged via specific "handle" elements. Note that Internet
   * Explorer will show the handle element as drag image instead of the dnd-draggable element. You
   * can work around this by styling the handle element differently when it is being dragged. Use
   * the CSS selector .dndDragging:not(.dndDraggingSource) [dnd-handle] for that.
   */
  dndLists.directive('dndHandle', function() {
    return function(scope, element, attr) {
      element.attr("draggable", "true");

      element.on('dragstart dragend', function(event) {
        event = event.originalEvent || event;
        event._dndHandle = true;
      });
    };
  });

  /**
   * Filters an array of drop effects using a HTML5 effectAllowed string.
   */
  function filterEffects(effects, effectAllowed) {
    if (effectAllowed == 'all') return effects;
    return effects.filter(function(effect) {
      return effectAllowed.toLowerCase().indexOf(effect) != -1;
    });
  }

  /**
   * For some features we need to maintain global state. This is done here, with these fields:
   * - callback: A callback function set at dragstart that is passed to internal dropzone handlers.
   * - dropEffect: Set in dragstart to "none" and to the actual value in the drop handler. We don't
   *   rely on the dropEffect passed by the browser, since there are various bugs in Chrome and
   *   Safari, and Internet Explorer defaults to copy if effectAllowed is copyMove.
   * - effectAllowed: Set in dragstart based on dnd-effect-allowed. This is needed for IE because
   *   setting effectAllowed on dataTransfer might result in an undesired cursor.
   * - isDragging: True between dragstart and dragend. Falsy for drops from external sources.
   * - itemType: The item type of the dragged element set via dnd-type. This is needed because IE
   *   and Edge don't support custom mime types that we can use to transfer this information.
   */
  var dndState = {};

})(angular.module('dndLists', []));
/**
 * @license MIT
 */
(function(window, document, undefined) {'use strict';
  // ie10+
  var ie10plus = window.navigator.msPointerEnabled;
  /**
   * Flow.js is a library providing multiple simultaneous, stable and
   * resumable uploads via the HTML5 File API.
   * @param [opts]
   * @param {number} [opts.chunkSize]
   * @param {bool} [opts.forceChunkSize]
   * @param {number} [opts.simultaneousUploads]
   * @param {bool} [opts.singleFile]
   * @param {string} [opts.fileParameterName]
   * @param {number} [opts.progressCallbacksInterval]
   * @param {number} [opts.speedSmoothingFactor]
   * @param {Object|Function} [opts.query]
   * @param {Object|Function} [opts.headers]
   * @param {bool} [opts.withCredentials]
   * @param {Function} [opts.preprocess]
   * @param {string} [opts.method]
   * @param {string|Function} [opts.testMethod]
   * @param {string|Function} [opts.uploadMethod]
   * @param {bool} [opts.prioritizeFirstAndLastChunk]
   * @param {bool} [opts.allowDuplicateUploads]
   * @param {string|Function} [opts.target]
   * @param {number} [opts.maxChunkRetries]
   * @param {number} [opts.chunkRetryInterval]
   * @param {Array.<number>} [opts.permanentErrors]
   * @param {Array.<number>} [opts.successStatuses]
   * @param {Function} [opts.initFileFn]
   * @param {Function} [opts.readFileFn]
   * @param {Function} [opts.generateUniqueIdentifier]
   * @constructor
   */
  function Flow(opts) {
    /**
     * Supported by browser?
     * @type {boolean}
     */
    this.support = (
        typeof File !== 'undefined' &&
        typeof Blob !== 'undefined' &&
        typeof FileList !== 'undefined' &&
        (
          !!Blob.prototype.slice || !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice ||
          false
        ) // slicing files support
    );

    if (!this.support) {
      return ;
    }

    /**
     * Check if directory upload is supported
     * @type {boolean}
     */
    this.supportDirectory = /Chrome/.test(window.navigator.userAgent);

    /**
     * List of FlowFile objects
     * @type {Array.<FlowFile>}
     */
    this.files = [];

    /**
     * Default options for flow.js
     * @type {Object}
     */
    this.defaults = {
      chunkSize: 1024 * 1024,
      forceChunkSize: false,
      simultaneousUploads: 3,
      singleFile: false,
      fileParameterName: 'file',
      progressCallbacksInterval: 500,
      speedSmoothingFactor: 0.1,
      query: {},
      headers: {},
      withCredentials: false,
      preprocess: null,
      method: 'multipart',
      testMethod: 'GET',
      uploadMethod: 'POST',
      prioritizeFirstAndLastChunk: false,
      allowDuplicateUploads: false,
      target: '/',
      testChunks: true,
      generateUniqueIdentifier: null,
      maxChunkRetries: 0,
      chunkRetryInterval: null,
      permanentErrors: [404, 413, 415, 500, 501],
      successStatuses: [200, 201, 202],
      onDropStopPropagation: false,
      initFileFn: null,
      readFileFn: webAPIFileRead
    };
    
    /**
     * Current options
     * @type {Object}
     */
    this.opts = {};

    /**
     * List of events:
     *  key stands for event name
     *  value array list of callbacks
     * @type {}
     */
    this.events = {};

    var $ = this;

    /**
     * On drop event
     * @function
     * @param {MouseEvent} event
     */
    this.onDrop = function (event) {
      if ($.opts.onDropStopPropagation) {
        event.stopPropagation();
      }
      event.preventDefault();
      var dataTransfer = event.dataTransfer;
      if (dataTransfer.items && dataTransfer.items[0] &&
        dataTransfer.items[0].webkitGetAsEntry) {
        $.webkitReadDataTransfer(event);
      } else {
        $.addFiles(dataTransfer.files, event);
      }
    };

    /**
     * Prevent default
     * @function
     * @param {MouseEvent} event
     */
    this.preventEvent = function (event) {
      event.preventDefault();
    };


    /**
     * Current options
     * @type {Object}
     */
    this.opts = Flow.extend({}, this.defaults, opts || {});

  }

  Flow.prototype = {
    /**
     * Set a callback for an event, possible events:
     * fileSuccess(file), fileProgress(file), fileAdded(file, event),
     * fileRemoved(file), fileRetry(file), fileError(file, message), 
     * complete(), progress(), error(message, file), pause()
     * @function
     * @param {string} event
     * @param {Function} callback
     */
    on: function (event, callback) {
      event = event.toLowerCase();
      if (!this.events.hasOwnProperty(event)) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    },

    /**
     * Remove event callback
     * @function
     * @param {string} [event] removes all events if not specified
     * @param {Function} [fn] removes all callbacks of event if not specified
     */
    off: function (event, fn) {
      if (event !== undefined) {
        event = event.toLowerCase();
        if (fn !== undefined) {
          if (this.events.hasOwnProperty(event)) {
            arrayRemove(this.events[event], fn);
          }
        } else {
          delete this.events[event];
        }
      } else {
        this.events = {};
      }
    },

    /**
     * Fire an event
     * @function
     * @param {string} event event name
     * @param {...} args arguments of a callback
     * @return {bool} value is false if at least one of the event handlers which handled this event
     * returned false. Otherwise it returns true.
     */
    fire: function (event, args) {
      // `arguments` is an object, not array, in FF, so:
      args = Array.prototype.slice.call(arguments);
      event = event.toLowerCase();
      var preventDefault = false;
      if (this.events.hasOwnProperty(event)) {
        each(this.events[event], function (callback) {
          preventDefault = callback.apply(this, args.slice(1)) === false || preventDefault;
        }, this);
      }
      if (event != 'catchall') {
        args.unshift('catchAll');
        preventDefault = this.fire.apply(this, args) === false || preventDefault;
      }
      return !preventDefault;
    },

    /**
     * Read webkit dataTransfer object
     * @param event
     */
    webkitReadDataTransfer: function (event) {
      var $ = this;
      var queue = event.dataTransfer.items.length;
      var files = [];
      each(event.dataTransfer.items, function (item) {
        var entry = item.webkitGetAsEntry();
        if (!entry) {
          decrement();
          return ;
        }
        if (entry.isFile) {
          // due to a bug in Chrome's File System API impl - #149735
          fileReadSuccess(item.getAsFile(), entry.fullPath);
        } else {
          readDirectory(entry.createReader());
        }
      });
      function readDirectory(reader) {
        reader.readEntries(function (entries) {
          if (entries.length) {
            queue += entries.length;
            each(entries, function(entry) {
              if (entry.isFile) {
                var fullPath = entry.fullPath;
                entry.file(function (file) {
                  fileReadSuccess(file, fullPath);
                }, readError);
              } else if (entry.isDirectory) {
                readDirectory(entry.createReader());
              }
            });
            readDirectory(reader);
          } else {
            decrement();
          }
        }, readError);
      }
      function fileReadSuccess(file, fullPath) {
        // relative path should not start with "/"
        file.relativePath = fullPath.substring(1);
        files.push(file);
        decrement();
      }
      function readError(fileError) {
        throw fileError;
      }
      function decrement() {
        if (--queue == 0) {
          $.addFiles(files, event);
        }
      }
    },

    /**
     * Generate unique identifier for a file
     * @function
     * @param {FlowFile} file
     * @returns {string}
     */
    generateUniqueIdentifier: function (file) {
      var custom = this.opts.generateUniqueIdentifier;
      if (typeof custom === 'function') {
        return custom(file);
      }
      // Some confusion in different versions of Firefox
      var relativePath = file.relativePath || file.webkitRelativePath || file.fileName || file.name;
      return file.size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, '');
    },

    /**
     * Upload next chunk from the queue
     * @function
     * @returns {boolean}
     * @private
     */
    uploadNextChunk: function (preventEvents) {
      // In some cases (such as videos) it's really handy to upload the first
      // and last chunk of a file quickly; this let's the server check the file's
      // metadata and determine if there's even a point in continuing.
      var found = false;
      if (this.opts.prioritizeFirstAndLastChunk) {
        each(this.files, function (file) {
          if (!file.paused && file.chunks.length &&
            file.chunks[0].status() === 'pending') {
            file.chunks[0].send();
            found = true;
            return false;
          }
          if (!file.paused && file.chunks.length > 1 &&
            file.chunks[file.chunks.length - 1].status() === 'pending') {
            file.chunks[file.chunks.length - 1].send();
            found = true;
            return false;
          }
        });
        if (found) {
          return found;
        }
      }

      // Now, simply look for the next, best thing to upload
      each(this.files, function (file) {
        if (!file.paused) {
          each(file.chunks, function (chunk) {
            if (chunk.status() === 'pending') {
              chunk.send();
              found = true;
              return false;
            }
          });
        }
        if (found) {
          return false;
        }
      });
      if (found) {
        return true;
      }

      // The are no more outstanding chunks to upload, check is everything is done
      var outstanding = false;
      each(this.files, function (file) {
        if (!file.isComplete()) {
          outstanding = true;
          return false;
        }
      });
      if (!outstanding && !preventEvents) {
        // All chunks have been uploaded, complete
        async(function () {
          this.fire('complete');
        }, this);
      }
      return false;
    },


    /**
     * Assign a browse action to one or more DOM nodes.
     * @function
     * @param {Element|Array.<Element>} domNodes
     * @param {boolean} isDirectory Pass in true to allow directories to
     * @param {boolean} singleFile prevent multi file upload
     * @param {Object} attributes set custom attributes:
     *  http://www.w3.org/TR/html-markup/input.file.html#input.file-attributes
     *  eg: accept: 'image/*'
     * be selected (Chrome only).
     */
    assignBrowse: function (domNodes, isDirectory, singleFile, attributes) {
      if (domNodes instanceof Element) {
        domNodes = [domNodes];
      }

      each(domNodes, function (domNode) {
        var input;
        if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
          input = domNode;
        } else {
          input = document.createElement('input');
          input.setAttribute('type', 'file');
          // display:none - not working in opera 12
          extend(input.style, {
            visibility: 'hidden',
            position: 'absolute',
            width: '1px',
            height: '1px'
          });
          // for opera 12 browser, input must be assigned to a document
          domNode.appendChild(input);
          // https://developer.mozilla.org/en/using_files_from_web_applications)
          // event listener is executed two times
          // first one - original mouse click event
          // second - input.click(), input is inside domNode
          domNode.addEventListener('click', function() {
            input.click();
          }, false);
        }
        if (!this.opts.singleFile && !singleFile) {
          input.setAttribute('multiple', 'multiple');
        }
        if (isDirectory) {
          input.setAttribute('webkitdirectory', 'webkitdirectory');
        }
        each(attributes, function (value, key) {
          input.setAttribute(key, value);
        });
        // When new files are added, simply append them to the overall list
        var $ = this;
        input.addEventListener('change', function (e) {
       	  if (e.target.value) {
            $.addFiles(e.target.files, e);
            e.target.value = '';
       	  }
        }, false);
      }, this);
    },

    /**
     * Assign one or more DOM nodes as a drop target.
     * @function
     * @param {Element|Array.<Element>} domNodes
     */
    assignDrop: function (domNodes) {
      if (typeof domNodes.length === 'undefined') {
        domNodes = [domNodes];
      }
      each(domNodes, function (domNode) {
        domNode.addEventListener('dragover', this.preventEvent, false);
        domNode.addEventListener('dragenter', this.preventEvent, false);
        domNode.addEventListener('drop', this.onDrop, false);
      }, this);
    },

    /**
     * Un-assign drop event from DOM nodes
     * @function
     * @param domNodes
     */
    unAssignDrop: function (domNodes) {
      if (typeof domNodes.length === 'undefined') {
        domNodes = [domNodes];
      }
      each(domNodes, function (domNode) {
        domNode.removeEventListener('dragover', this.preventEvent);
        domNode.removeEventListener('dragenter', this.preventEvent);
        domNode.removeEventListener('drop', this.onDrop);
      }, this);
    },

    /**
     * Returns a boolean indicating whether or not the instance is currently
     * uploading anything.
     * @function
     * @returns {boolean}
     */
    isUploading: function () {
      var uploading = false;
      each(this.files, function (file) {
        if (file.isUploading()) {
          uploading = true;
          return false;
        }
      });
      return uploading;
    },

    /**
     * should upload next chunk
     * @function
     * @returns {boolean|number}
     */
    _shouldUploadNext: function () {
      var num = 0;
      var should = true;
      var simultaneousUploads = this.opts.simultaneousUploads;
      each(this.files, function (file) {
        each(file.chunks, function(chunk) {
          if (chunk.status() === 'uploading') {
            num++;
            if (num >= simultaneousUploads) {
              should = false;
              return false;
            }
          }
        });
      });
      // if should is true then return uploading chunks's length
      return should && num;
    },

    /**
     * Start or resume uploading.
     * @function
     */
    upload: function () {
      // Make sure we don't start too many uploads at once
      var ret = this._shouldUploadNext();
      if (ret === false) {
        return;
      }
      // Kick off the queue
      this.fire('uploadStart');
      var started = false;
      for (var num = 1; num <= this.opts.simultaneousUploads - ret; num++) {
        started = this.uploadNextChunk(true) || started;
      }
      if (!started) {
        async(function () {
          this.fire('complete');
        }, this);
      }
    },

    /**
     * Resume uploading.
     * @function
     */
    resume: function () {
      each(this.files, function (file) {
        file.resume();
      });
    },

    /**
     * Pause uploading.
     * @function
     */
    pause: function () {
      each(this.files, function (file) {
        file.pause();
      });
    },

    /**
     * Cancel upload of all FlowFile objects and remove them from the list.
     * @function
     */
    cancel: function () {
      for (var i = this.files.length - 1; i >= 0; i--) {
        this.files[i].cancel();
      }
    },

    /**
     * Returns a number between 0 and 1 indicating the current upload progress
     * of all files.
     * @function
     * @returns {number}
     */
    progress: function () {
      var totalDone = 0;
      var totalSize = 0;
      // Resume all chunks currently being uploaded
      each(this.files, function (file) {
        totalDone += file.progress() * file.size;
        totalSize += file.size;
      });
      return totalSize > 0 ? totalDone / totalSize : 0;
    },

    /**
     * Add a HTML5 File object to the list of files.
     * @function
     * @param {File} file
     * @param {Event} [event] event is optional
     */
    addFile: function (file, event) {
      this.addFiles([file], event);
    },

    /**
     * Add a HTML5 File object to the list of files.
     * @function
     * @param {FileList|Array} fileList
     * @param {Event} [event] event is optional
     */
    addFiles: function (fileList, event) {
      var files = [];
      each(fileList, function (file) {
        // https://github.com/flowjs/flow.js/issues/55
        if ((!ie10plus || ie10plus && file.size > 0) && !(file.size % 4096 === 0 && (file.name === '.' || file.fileName === '.')) &&
          (this.opts.allowDuplicateUploads || !this.getFromUniqueIdentifier(this.generateUniqueIdentifier(file)))) {
          var f = new FlowFile(this, file);
          if (this.fire('fileAdded', f, event)) {
            files.push(f);
          }
        }
      }, this);
      if (this.fire('filesAdded', files, event)) {
        each(files, function (file) {
          if (this.opts.singleFile && this.files.length > 0) {
            this.removeFile(this.files[0]);
          }
          this.files.push(file);
        }, this);
        this.fire('filesSubmitted', files, event);
      }
    },


    /**
     * Cancel upload of a specific FlowFile object from the list.
     * @function
     * @param {FlowFile} file
     */
    removeFile: function (file) {
      for (var i = this.files.length - 1; i >= 0; i--) {
        if (this.files[i] === file) {
          this.files.splice(i, 1);
          file.abort();
          this.fire('fileRemoved', file);
        }
      }
    },

    /**
     * Look up a FlowFile object by its unique identifier.
     * @function
     * @param {string} uniqueIdentifier
     * @returns {boolean|FlowFile} false if file was not found
     */
    getFromUniqueIdentifier: function (uniqueIdentifier) {
      var ret = false;
      each(this.files, function (file) {
        if (file.uniqueIdentifier === uniqueIdentifier) {
          ret = file;
        }
      });
      return ret;
    },

    /**
     * Returns the total size of all files in bytes.
     * @function
     * @returns {number}
     */
    getSize: function () {
      var totalSize = 0;
      each(this.files, function (file) {
        totalSize += file.size;
      });
      return totalSize;
    },

    /**
     * Returns the total size uploaded of all files in bytes.
     * @function
     * @returns {number}
     */
    sizeUploaded: function () {
      var size = 0;
      each(this.files, function (file) {
        size += file.sizeUploaded();
      });
      return size;
    },

    /**
     * Returns remaining time to upload all files in seconds. Accuracy is based on average speed.
     * If speed is zero, time remaining will be equal to positive infinity `Number.POSITIVE_INFINITY`
     * @function
     * @returns {number}
     */
    timeRemaining: function () {
      var sizeDelta = 0;
      var averageSpeed = 0;
      each(this.files, function (file) {
        if (!file.paused && !file.error) {
          sizeDelta += file.size - file.sizeUploaded();
          averageSpeed += file.averageSpeed;
        }
      });
      if (sizeDelta && !averageSpeed) {
        return Number.POSITIVE_INFINITY;
      }
      if (!sizeDelta && !averageSpeed) {
        return 0;
      }
      return Math.floor(sizeDelta / averageSpeed);
    }
  };






  /**
   * FlowFile class
   * @name FlowFile
   * @param {Flow} flowObj
   * @param {File} file
   * @constructor
   */
  function FlowFile(flowObj, file) {

    /**
     * Reference to parent Flow instance
     * @type {Flow}
     */
    this.flowObj = flowObj;
    
    /**
     * Used to store the bytes read
     * @type {Blob|string}
     */
    this.bytes = null;

    /**
     * Reference to file
     * @type {File}
     */
    this.file = file;

    /**
     * File name. Some confusion in different versions of Firefox
     * @type {string}
     */
    this.name = file.fileName || file.name;

    /**
     * File size
     * @type {number}
     */
    this.size = file.size;

    /**
     * Relative file path
     * @type {string}
     */
    this.relativePath = file.relativePath || file.webkitRelativePath || this.name;

    /**
     * File unique identifier
     * @type {string}
     */
    this.uniqueIdentifier = flowObj.generateUniqueIdentifier(file);

    /**
     * List of chunks
     * @type {Array.<FlowChunk>}
     */
    this.chunks = [];

    /**
     * Indicated if file is paused
     * @type {boolean}
     */
    this.paused = false;

    /**
     * Indicated if file has encountered an error
     * @type {boolean}
     */
    this.error = false;

    /**
     * Average upload speed
     * @type {number}
     */
    this.averageSpeed = 0;

    /**
     * Current upload speed
     * @type {number}
     */
    this.currentSpeed = 0;

    /**
     * Date then progress was called last time
     * @type {number}
     * @private
     */
    this._lastProgressCallback = Date.now();

    /**
     * Previously uploaded file size
     * @type {number}
     * @private
     */
    this._prevUploadedSize = 0;

    /**
     * Holds previous progress
     * @type {number}
     * @private
     */
    this._prevProgress = 0;

    this.bootstrap();
  }

  FlowFile.prototype = {
    /**
     * Update speed parameters
     * @link http://stackoverflow.com/questions/2779600/how-to-estimate-download-time-remaining-accurately
     * @function
     */
    measureSpeed: function () {
      var timeSpan = Date.now() - this._lastProgressCallback;
      if (!timeSpan) {
        return ;
      }
      var smoothingFactor = this.flowObj.opts.speedSmoothingFactor;
      var uploaded = this.sizeUploaded();
      // Prevent negative upload speed after file upload resume
      this.currentSpeed = Math.max((uploaded - this._prevUploadedSize) / timeSpan * 1000, 0);
      this.averageSpeed = smoothingFactor * this.currentSpeed + (1 - smoothingFactor) * this.averageSpeed;
      this._prevUploadedSize = uploaded;
    },

    /**
     * For internal usage only.
     * Callback when something happens within the chunk.
     * @function
     * @param {FlowChunk} chunk
     * @param {string} event can be 'progress', 'success', 'error' or 'retry'
     * @param {string} [message]
     */
    chunkEvent: function (chunk, event, message) {
      switch (event) {
        case 'progress':
          if (Date.now() - this._lastProgressCallback <
            this.flowObj.opts.progressCallbacksInterval) {
            break;
          }
          this.measureSpeed();
          this.flowObj.fire('fileProgress', this, chunk);
          this.flowObj.fire('progress');
          this._lastProgressCallback = Date.now();
          break;
        case 'error':
          this.error = true;
          this.abort(true);
          this.flowObj.fire('fileError', this, message, chunk);
          this.flowObj.fire('error', message, this, chunk);
          break;
        case 'success':
          if (this.error) {
            return;
          }
          this.measureSpeed();
          this.flowObj.fire('fileProgress', this, chunk);
          this.flowObj.fire('progress');
          this._lastProgressCallback = Date.now();
          if (this.isComplete()) {
            this.currentSpeed = 0;
            this.averageSpeed = 0;
            this.flowObj.fire('fileSuccess', this, message, chunk);
          }
          break;
        case 'retry':
          this.flowObj.fire('fileRetry', this, chunk);
          break;
      }
    },

    /**
     * Pause file upload
     * @function
     */
    pause: function() {
      this.paused = true;
      this.abort();
    },

    /**
     * Resume file upload
     * @function
     */
    resume: function() {
      this.paused = false;
      this.flowObj.upload();
    },

    /**
     * Abort current upload
     * @function
     */
    abort: function (reset) {
      this.currentSpeed = 0;
      this.averageSpeed = 0;
      var chunks = this.chunks;
      if (reset) {
        this.chunks = [];
      }
      each(chunks, function (c) {
        if (c.status() === 'uploading') {
          c.abort();
          this.flowObj.uploadNextChunk();
        }
      }, this);
    },

    /**
     * Cancel current upload and remove from a list
     * @function
     */
    cancel: function () {
      this.flowObj.removeFile(this);
    },

    /**
     * Retry aborted file upload
     * @function
     */
    retry: function () {
      this.bootstrap();
      this.flowObj.upload();
    },

    /**
     * Clear current chunks and slice file again
     * @function
     */
    bootstrap: function () {
      if (typeof this.flowObj.opts.initFileFn === "function") {
        this.flowObj.opts.initFileFn(this);
      }

      this.abort(true);
      this.error = false;
      // Rebuild stack of chunks from file
      this._prevProgress = 0;
      var round = this.flowObj.opts.forceChunkSize ? Math.ceil : Math.floor;
      var chunks = Math.max(
        round(this.size / this.flowObj.opts.chunkSize), 1
      );
      for (var offset = 0; offset < chunks; offset++) {
        this.chunks.push(
          new FlowChunk(this.flowObj, this, offset)
        );
      }
    },

    /**
     * Get current upload progress status
     * @function
     * @returns {number} from 0 to 1
     */
    progress: function () {
      if (this.error) {
        return 1;
      }
      if (this.chunks.length === 1) {
        this._prevProgress = Math.max(this._prevProgress, this.chunks[0].progress());
        return this._prevProgress;
      }
      // Sum up progress across everything
      var bytesLoaded = 0;
      each(this.chunks, function (c) {
        // get chunk progress relative to entire file
        bytesLoaded += c.progress() * (c.endByte - c.startByte);
      });
      var percent = bytesLoaded / this.size;
      // We don't want to lose percentages when an upload is paused
      this._prevProgress = Math.max(this._prevProgress, percent > 0.9999 ? 1 : percent);
      return this._prevProgress;
    },

    /**
     * Indicates if file is being uploaded at the moment
     * @function
     * @returns {boolean}
     */
    isUploading: function () {
      var uploading = false;
      each(this.chunks, function (chunk) {
        if (chunk.status() === 'uploading') {
          uploading = true;
          return false;
        }
      });
      return uploading;
    },

    /**
     * Indicates if file is has finished uploading and received a response
     * @function
     * @returns {boolean}
     */
    isComplete: function () {
      var outstanding = false;
      each(this.chunks, function (chunk) {
        var status = chunk.status();
        if (status === 'pending' || status === 'uploading' || status === 'reading' || chunk.preprocessState === 1 || chunk.readState === 1) {
          outstanding = true;
          return false;
        }
      });
      return !outstanding;
    },

    /**
     * Count total size uploaded
     * @function
     * @returns {number}
     */
    sizeUploaded: function () {
      var size = 0;
      each(this.chunks, function (chunk) {
        size += chunk.sizeUploaded();
      });
      return size;
    },

    /**
     * Returns remaining time to finish upload file in seconds. Accuracy is based on average speed.
     * If speed is zero, time remaining will be equal to positive infinity `Number.POSITIVE_INFINITY`
     * @function
     * @returns {number}
     */
    timeRemaining: function () {
      if (this.paused || this.error) {
        return 0;
      }
      var delta = this.size - this.sizeUploaded();
      if (delta && !this.averageSpeed) {
        return Number.POSITIVE_INFINITY;
      }
      if (!delta && !this.averageSpeed) {
        return 0;
      }
      return Math.floor(delta / this.averageSpeed);
    },

    /**
     * Get file type
     * @function
     * @returns {string}
     */
    getType: function () {
      return this.file.type && this.file.type.split('/')[1];
    },

    /**
     * Get file extension
     * @function
     * @returns {string}
     */
    getExtension: function () {
      return this.name.substr((~-this.name.lastIndexOf(".") >>> 0) + 2).toLowerCase();
    }
  };

  /**
   * Default read function using the webAPI
   *
   * @function webAPIFileRead(fileObj, startByte, endByte, fileType, chunk)
   *
   */
  function webAPIFileRead(fileObj, startByte, endByte, fileType, chunk) {
    var function_name = 'slice';

    if (fileObj.file.slice)
      function_name =  'slice';
    else if (fileObj.file.mozSlice)
      function_name = 'mozSlice';
    else if (fileObj.file.webkitSlice)
      function_name = 'webkitSlice';

    chunk.readFinished(fileObj.file[function_name](startByte, endByte, fileType));
  }


  /**
   * Class for storing a single chunk
   * @name FlowChunk
   * @param {Flow} flowObj
   * @param {FlowFile} fileObj
   * @param {number} offset
   * @constructor
   */
  function FlowChunk(flowObj, fileObj, offset) {

    /**
     * Reference to parent flow object
     * @type {Flow}
     */
    this.flowObj = flowObj;

    /**
     * Reference to parent FlowFile object
     * @type {FlowFile}
     */
    this.fileObj = fileObj;

    /**
     * File offset
     * @type {number}
     */
    this.offset = offset;

    /**
     * Indicates if chunk existence was checked on the server
     * @type {boolean}
     */
    this.tested = false;

    /**
     * Number of retries performed
     * @type {number}
     */
    this.retries = 0;

    /**
     * Pending retry
     * @type {boolean}
     */
    this.pendingRetry = false;

    /**
     * Preprocess state
     * @type {number} 0 = unprocessed, 1 = processing, 2 = finished
     */
    this.preprocessState = 0;

    /**
     * Read state
     * @type {number} 0 = not read, 1 = reading, 2 = finished
     */
    this.readState = 0;


    /**
     * Bytes transferred from total request size
     * @type {number}
     */
    this.loaded = 0;

    /**
     * Total request size
     * @type {number}
     */
    this.total = 0;

    /**
     * Size of a chunk
     * @type {number}
     */
    this.chunkSize = this.flowObj.opts.chunkSize;

    /**
     * Chunk start byte in a file
     * @type {number}
     */
    this.startByte = this.offset * this.chunkSize;

    /**
      * Compute the endbyte in a file
      *
      */
    this.computeEndByte = function() {
      var endByte = Math.min(this.fileObj.size, (this.offset + 1) * this.chunkSize);
      if (this.fileObj.size - endByte < this.chunkSize && !this.flowObj.opts.forceChunkSize) {
        // The last chunk will be bigger than the chunk size,
        // but less than 2 * this.chunkSize
        endByte = this.fileObj.size;
      }
      return endByte;
    }

    /**
     * Chunk end byte in a file
     * @type {number}
     */
    this.endByte = this.computeEndByte();

    /**
     * XMLHttpRequest
     * @type {XMLHttpRequest}
     */
    this.xhr = null;

    var $ = this;

    /**
     * Send chunk event
     * @param event
     * @param {...} args arguments of a callback
     */
    this.event = function (event, args) {
      args = Array.prototype.slice.call(arguments);
      args.unshift($);
      $.fileObj.chunkEvent.apply($.fileObj, args);
    };
    /**
     * Catch progress event
     * @param {ProgressEvent} event
     */
    this.progressHandler = function(event) {
      if (event.lengthComputable) {
        $.loaded = event.loaded ;
        $.total = event.total;
      }
      $.event('progress', event);
    };

    /**
     * Catch test event
     * @param {Event} event
     */
    this.testHandler = function(event) {
      var status = $.status(true);
      if (status === 'error') {
        $.event(status, $.message());
        $.flowObj.uploadNextChunk();
      } else if (status === 'success') {
        $.tested = true;
        $.event(status, $.message());
        $.flowObj.uploadNextChunk();
      } else if (!$.fileObj.paused) {
        // Error might be caused by file pause method
        // Chunks does not exist on the server side
        $.tested = true;
        $.send();
      }
    };

    /**
     * Upload has stopped
     * @param {Event} event
     */
    this.doneHandler = function(event) {
      var status = $.status();
      if (status === 'success' || status === 'error') {
        delete this.data;
        $.event(status, $.message());
        $.flowObj.uploadNextChunk();
      } else {
        $.event('retry', $.message());
        $.pendingRetry = true;
        $.abort();
        $.retries++;
        var retryInterval = $.flowObj.opts.chunkRetryInterval;
        if (retryInterval !== null) {
          setTimeout(function () {
            $.send();
          }, retryInterval);
        } else {
          $.send();
        }
      }
    };
  }

  FlowChunk.prototype = {
    /**
     * Get params for a request
     * @function
     */
    getParams: function () {
      return {
        flowChunkNumber: this.offset + 1,
        flowChunkSize: this.flowObj.opts.chunkSize,
        flowCurrentChunkSize: this.endByte - this.startByte,
        flowTotalSize: this.fileObj.size,
        flowIdentifier: this.fileObj.uniqueIdentifier,
        flowFilename: this.fileObj.name,
        flowRelativePath: this.fileObj.relativePath,
        flowTotalChunks: this.fileObj.chunks.length
      };
    },

    /**
     * Get target option with query params
     * @function
     * @param params
     * @returns {string}
     */
    getTarget: function(target, params){
      if(target.indexOf('?') < 0) {
        target += '?';
      } else {
        target += '&';
      }
      return target + params.join('&');
    },

    /**
     * Makes a GET request without any data to see if the chunk has already
     * been uploaded in a previous session
     * @function
     */
    test: function () {
      // Set up request and listen for event
      this.xhr = new XMLHttpRequest();
      this.xhr.addEventListener("load", this.testHandler, false);
      this.xhr.addEventListener("error", this.testHandler, false);
      var testMethod = evalOpts(this.flowObj.opts.testMethod, this.fileObj, this);
      var data = this.prepareXhrRequest(testMethod, true);
      this.xhr.send(data);
    },

    /**
     * Finish preprocess state
     * @function
     */
    preprocessFinished: function () {
      // Re-compute the endByte after the preprocess function to allow an
      // implementer of preprocess to set the fileObj size
      this.endByte = this.computeEndByte();

      this.preprocessState = 2;
      this.send();
    },

    /**
     * Finish read state
     * @function
     */
    readFinished: function (bytes) {
      this.readState = 2;
      this.bytes = bytes;
      this.send();
    },


    /**
     * Uploads the actual data in a POST call
     * @function
     */
    send: function () {
      var preprocess = this.flowObj.opts.preprocess;
      var read = this.flowObj.opts.readFileFn;
      if (typeof preprocess === 'function') {
        switch (this.preprocessState) {
          case 0:
            this.preprocessState = 1;
            preprocess(this);
            return;
          case 1:
            return;
        }
      }
      switch (this.readState) {
        case 0:
          this.readState = 1;
          read(this.fileObj, this.startByte, this.endByte, this.fileObj.file.type, this);
          return;
        case 1:
          return;
      }
      if (this.flowObj.opts.testChunks && !this.tested) {
        this.test();
        return;
      }

      this.loaded = 0;
      this.total = 0;
      this.pendingRetry = false;

      // Set up request and listen for event
      this.xhr = new XMLHttpRequest();
      this.xhr.upload.addEventListener('progress', this.progressHandler, false);
      this.xhr.addEventListener("load", this.doneHandler, false);
      this.xhr.addEventListener("error", this.doneHandler, false);

      var uploadMethod = evalOpts(this.flowObj.opts.uploadMethod, this.fileObj, this);
      var data = this.prepareXhrRequest(uploadMethod, false, this.flowObj.opts.method, this.bytes);
      this.xhr.send(data);
    },

    /**
     * Abort current xhr request
     * @function
     */
    abort: function () {
      // Abort and reset
      var xhr = this.xhr;
      this.xhr = null;
      if (xhr) {
        xhr.abort();
      }
    },

    /**
     * Retrieve current chunk upload status
     * @function
     * @returns {string} 'pending', 'uploading', 'success', 'error'
     */
    status: function (isTest) {
      if (this.readState === 1) {
        return 'reading';
      } else if (this.pendingRetry || this.preprocessState === 1) {
        // if pending retry then that's effectively the same as actively uploading,
        // there might just be a slight delay before the retry starts
        return 'uploading';
      } else if (!this.xhr) {
        return 'pending';
      } else if (this.xhr.readyState < 4) {
        // Status is really 'OPENED', 'HEADERS_RECEIVED'
        // or 'LOADING' - meaning that stuff is happening
        return 'uploading';
      } else {
        if (this.flowObj.opts.successStatuses.indexOf(this.xhr.status) > -1) {
          // HTTP 200, perfect
		      // HTTP 202 Accepted - The request has been accepted for processing, but the processing has not been completed.
          return 'success';
        } else if (this.flowObj.opts.permanentErrors.indexOf(this.xhr.status) > -1 ||
            !isTest && this.retries >= this.flowObj.opts.maxChunkRetries) {
          // HTTP 413/415/500/501, permanent error
          return 'error';
        } else {
          // this should never happen, but we'll reset and queue a retry
          // a likely case for this would be 503 service unavailable
          this.abort();
          return 'pending';
        }
      }
    },

    /**
     * Get response from xhr request
     * @function
     * @returns {String}
     */
    message: function () {
      return this.xhr ? this.xhr.responseText : '';
    },

    /**
     * Get upload progress
     * @function
     * @returns {number}
     */
    progress: function () {
      if (this.pendingRetry) {
        return 0;
      }
      var s = this.status();
      if (s === 'success' || s === 'error') {
        return 1;
      } else if (s === 'pending') {
        return 0;
      } else {
        return this.total > 0 ? this.loaded / this.total : 0;
      }
    },

    /**
     * Count total size uploaded
     * @function
     * @returns {number}
     */
    sizeUploaded: function () {
      var size = this.endByte - this.startByte;
      // can't return only chunk.loaded value, because it is bigger than chunk size
      if (this.status() !== 'success') {
        size = this.progress() * size;
      }
      return size;
    },

    /**
     * Prepare Xhr request. Set query, headers and data
     * @param {string} method GET or POST
     * @param {bool} isTest is this a test request
     * @param {string} [paramsMethod] octet or form
     * @param {Blob} [blob] to send
     * @returns {FormData|Blob|Null} data to send
     */
    prepareXhrRequest: function(method, isTest, paramsMethod, blob) {
      // Add data from the query options
      var query = evalOpts(this.flowObj.opts.query, this.fileObj, this, isTest);
      query = extend(query, this.getParams());

      var target = evalOpts(this.flowObj.opts.target, this.fileObj, this, isTest);
      var data = null;
      if (method === 'GET' || paramsMethod === 'octet') {
        // Add data from the query options
        var params = [];
        each(query, function (v, k) {
          params.push([encodeURIComponent(k), encodeURIComponent(v)].join('='));
        });
        target = this.getTarget(target, params);
        data = blob || null;
      } else {
        // Add data from the query options
        data = new FormData();
        each(query, function (v, k) {
          data.append(k, v);
        });
        data.append(this.flowObj.opts.fileParameterName, blob, this.fileObj.file.name);
      }

      this.xhr.open(method, target, true);
      this.xhr.withCredentials = this.flowObj.opts.withCredentials;

      // Add data from header options
      each(evalOpts(this.flowObj.opts.headers, this.fileObj, this, isTest), function (v, k) {
        this.xhr.setRequestHeader(k, v);
      }, this);

      return data;
    }
  };

  /**
   * Remove value from array
   * @param array
   * @param value
   */
  function arrayRemove(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  /**
   * If option is a function, evaluate it with given params
   * @param {*} data
   * @param {...} args arguments of a callback
   * @returns {*}
   */
  function evalOpts(data, args) {
    if (typeof data === "function") {
      // `arguments` is an object, not array, in FF, so:
      args = Array.prototype.slice.call(arguments);
      data = data.apply(null, args.slice(1));
    }
    return data;
  }
  Flow.evalOpts = evalOpts;

  /**
   * Execute function asynchronously
   * @param fn
   * @param context
   */
  function async(fn, context) {
    setTimeout(fn.bind(context), 0);
  }

  /**
   * Extends the destination object `dst` by copying all of the properties from
   * the `src` object(s) to `dst`. You can specify multiple `src` objects.
   * @function
   * @param {Object} dst Destination object.
   * @param {...Object} src Source object(s).
   * @returns {Object} Reference to `dst`.
   */
  function extend(dst, src) {
    each(arguments, function(obj) {
      if (obj !== dst) {
        each(obj, function(value, key){
          dst[key] = value;
        });
      }
    });
    return dst;
  }
  Flow.extend = extend;

  /**
   * Iterate each element of an object
   * @function
   * @param {Array|Object} obj object or an array to iterate
   * @param {Function} callback first argument is a value and second is a key.
   * @param {Object=} context Object to become context (`this`) for the iterator function.
   */
  function each(obj, callback, context) {
    if (!obj) {
      return ;
    }
    var key;
    // Is Array?
    // Array.isArray won't work, not only arrays can be iterated by index https://github.com/flowjs/ng-flow/issues/236#
    if (typeof(obj.length) !== 'undefined') {
      for (key = 0; key < obj.length; key++) {
        if (callback.call(context, obj[key], key) === false) {
          return ;
        }
      }
    } else {
      for (key in obj) {
        if (obj.hasOwnProperty(key) && callback.call(context, obj[key], key) === false) {
          return ;
        }
      }
    }
  }
  Flow.each = each;

  /**
   * FlowFile constructor
   * @type {FlowFile}
   */
  Flow.FlowFile = FlowFile;

  /**
   * FlowFile constructor
   * @type {FlowChunk}
   */
  Flow.FlowChunk = FlowChunk;

  /**
   * Library version
   * @type {string}
   */
  Flow.version = '2.11.2';

  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    // Expose Flow as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports = Flow;
  } else {
    // Otherwise expose Flow to the global object as usual
    window.Flow = Flow;

    // Register as a named AMD module, since Flow can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase flow is used because AMD module names are
    // derived from file names, and Flow is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of Flow, it will work.
    if ( typeof define === "function" && define.amd ) {
      define( "flow", [], function () { return Flow; } );
    }
  }
})(window, document);

/**
 * @description
 * var app = angular.module('App', ['flow.provider'], function(flowFactoryProvider){
 *    flowFactoryProvider.defaults = {target: '/'};
 * });
 * @name flowFactoryProvider
 */
angular.module('flow.provider', [])
.provider('flowFactory', function() {
  'use strict';
  /**
   * Define the default properties for flow.js
   * @name flowFactoryProvider.defaults
   * @type {Object}
   */
  this.defaults = {};

  /**
   * Flow, MaybeFlow or NotFlow
   * @name flowFactoryProvider.factory
   * @type {function}
   * @return {Flow}
   */
  this.factory = function (options) {
    return new Flow(options);
  };

  /**
   * Define the default events
   * @name flowFactoryProvider.events
   * @type {Array}
   * @private
   */
  this.events = [];

  /**
   * Add default events
   * @name flowFactoryProvider.on
   * @function
   * @param {string} event
   * @param {Function} callback
   */
  this.on = function (event, callback) {
    this.events.push([event, callback]);
  };

  this.$get = function() {
    var fn = this.factory;
    var defaults = this.defaults;
    var events = this.events;
    return {
      'create': function(opts) {
        // combine default options with global options and options
        var flow = fn(angular.extend({}, defaults, opts));
        angular.forEach(events, function (event) {
          flow.on(event[0], event[1]);
        });
        return flow;
      }
    };
  };
});
angular.module('flow.init', ['flow.provider'])
  .controller('flowCtrl', ['$scope', '$attrs', '$parse', 'flowFactory',
  function ($scope, $attrs, $parse, flowFactory) {

    var options = angular.extend({}, $scope.$eval($attrs.flowInit));

    // use existing flow object or create a new one
    var flow  = $scope.$eval($attrs.flowObject) || flowFactory.create(options);

    var catchAllHandler = function(eventName){
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      var event = $scope.$broadcast.apply($scope, ['flow::' + eventName, flow].concat(args));
      if ({
        'progress':1, 'filesSubmitted':1, 'fileSuccess': 1, 'fileError': 1, 'complete': 1
      }[eventName]) {
        $scope.$apply();
      }
      if (event.defaultPrevented) {
        return false;
      }
    };

    flow.on('catchAll', catchAllHandler);
    $scope.$on('$destroy', function(){
        flow.off('catchAll', catchAllHandler);
    });

    $scope.$flow = flow;

    if ($attrs.hasOwnProperty('flowName')) {
      $parse($attrs.flowName).assign($scope, flow);
      $scope.$on('$destroy', function () {
        $parse($attrs.flowName).assign($scope);
      });
    }
  }])
  .directive('flowInit', [function() {
    return {
      scope: true,
      controller: 'flowCtrl'
    };
  }]);
angular.module('flow.btn', ['flow.init'])
.directive('flowBtn', [function() {
  return {
    'restrict': 'EA',
    'scope': false,
    'require': '^flowInit',
    'link': function(scope, element, attrs) {
      var isDirectory = attrs.hasOwnProperty('flowDirectory');
      var isSingleFile = attrs.hasOwnProperty('flowSingleFile');
      var inputAttrs = attrs.hasOwnProperty('flowAttrs') && scope.$eval(attrs.flowAttrs);
      scope.$flow.assignBrowse(element, isDirectory, isSingleFile, inputAttrs);
    }
  };
}]);
angular.module('flow.dragEvents', ['flow.init'])
/**
 * @name flowPreventDrop
 * Prevent loading files then dropped on element
 */
  .directive('flowPreventDrop', function() {
    return {
      'scope': false,
      'link': function(scope, element, attrs) {
        element.bind('drop dragover', function (event) {
          event.preventDefault();
        });
      }
    };
  })
/**
 * @name flowDragEnter
 * executes `flowDragEnter` and `flowDragLeave` events
 */
  .directive('flowDragEnter', ['$timeout', function($timeout) {
    return {
      'scope': false,
      'link': function(scope, element, attrs) {
        var promise;
        var enter = false;
        element.bind('dragover', function (event) {
          if (!isFileDrag(event)) {
            return ;
          }
          if (!enter) {
            scope.$apply(attrs.flowDragEnter);
            enter = true;
          }
          $timeout.cancel(promise);
          event.preventDefault();
        });
        element.bind('dragleave drop', function (event) {
          $timeout.cancel(promise);
          promise = $timeout(function () {
            scope.$eval(attrs.flowDragLeave);
            promise = null;
            enter = false;
          }, 100);
        });
        function isFileDrag(dragEvent) {
          var fileDrag = false;
          var dataTransfer = dragEvent.dataTransfer || dragEvent.originalEvent.dataTransfer;
          angular.forEach(dataTransfer && dataTransfer.types, function(val) {
            if (val === 'Files') {
              fileDrag = true;
            }
          });
          return fileDrag;
        }
      }
    };
  }]);

angular.module('flow.drop', ['flow.init'])
.directive('flowDrop', function() {
  return {
    'scope': false,
    'require': '^flowInit',
    'link': function(scope, element, attrs) {
      if (attrs.flowDropEnabled) {
        scope.$watch(attrs.flowDropEnabled, function (value) {
          if (value) {
            assignDrop();
          } else {
            unAssignDrop();
          }
        });
      } else {
        assignDrop();
      }
      function assignDrop() {
        scope.$flow.assignDrop(element);
      }
      function unAssignDrop() {
        scope.$flow.unAssignDrop(element);
      }
    }
  };
});

!function (angular) {'use strict';
  var module = angular.module('flow.events', ['flow.init']);
  var events = {
    fileSuccess: ['$file', '$message'],
    fileProgress: ['$file'],
    fileAdded: ['$file', '$event'],
    filesAdded: ['$files', '$event'],
    filesSubmitted: ['$files', '$event'],
    fileRetry: ['$file'],
    fileError: ['$file', '$message'],
    uploadStart: [],
    complete: [],
    progress: [],
    error: ['$message', '$file']
  };

  angular.forEach(events, function (eventArgs, eventName) {
    var name = 'flow' + capitaliseFirstLetter(eventName);
    if (name == 'flowUploadStart') {
      name = 'flowUploadStarted';// event alias
    }
    module.directive(name, [function() {
      return {
        require: '^flowInit',
        controller: ['$scope', '$attrs', function ($scope, $attrs) {
          $scope.$on('flow::' + eventName, function () {
            var funcArgs = Array.prototype.slice.call(arguments);
            var event = funcArgs.shift();// remove angular event
            // remove flow object and ignore event if it is from parent directive
            if ($scope.$flow !== funcArgs.shift()) {
              return ;
            }
            var args = {};
            angular.forEach(eventArgs, function(value, key) {
              args[value] = funcArgs[key];
            });
            if ($scope.$eval($attrs[name], args) === false) {
              event.preventDefault();
            }
          });
        }]
      };
    }]);
  });

  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}(angular);
angular.module('flow.img', ['flow.init'])
.directive('flowImg', [function() {
  return {
    'scope': false,
    'require': '^flowInit',
    'link': function(scope, element, attrs) {
      var file = attrs.flowImg;
      scope.$watch(file, function (file) {
        if (!file) {
          return ;
        }
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file.file);
        fileReader.onload = function (event) {
          scope.$apply(function () {
            attrs.$set('src', event.target.result);
          });
        };
      });
    }
  };
}]);
angular.module('flow.transfers', ['flow.init'])
.directive('flowTransfers', [function() {
  return {
    'scope': true,
    'require': '^flowInit',
    'link': function(scope) {
      scope.transfers = scope.$flow.files;
    }
  };
}]);
angular.module('flow', ['flow.provider', 'flow.init', 'flow.events', 'flow.btn',
  'flow.drop', 'flow.transfers', 'flow.img', 'flow.dragEvents']);
angular.module('angularResizable', [])
    .directive('resizable', function() {
        var toCall;
        function throttle(fun) {
            if (toCall === undefined) {
                toCall = fun;
                setTimeout(function() {
                    toCall();
                    toCall = undefined;
                }, 100);
            } else {
                toCall = fun;
            }
        }
        return {
            restrict: 'AE',
            scope: {
                rDirections: '=',
                rCenteredX: '=',
                rCenteredY: '=',
                rWidth: '=',
                rHeight: '=',
                rFlex: '=',
                rGrabber: '@',
                rDisabled: '@',
                rNoThrottle: '='
            },
            link: function(scope, element, attr) {
                var flexBasis = 'flexBasis' in document.documentElement.style ? 'flexBasis' :
                    'webkitFlexBasis' in document.documentElement.style ? 'webkitFlexBasis' :
                    'msFlexPreferredSize' in document.documentElement.style ? 'msFlexPreferredSize' : 'flexBasis';

                // register watchers on width and height attributes if they are set
                scope.$watch('rWidth', function(value){
                    element[0].style[scope.rFlex ? flexBasis : 'width'] = scope.rWidth + 'px';
                });
                scope.$watch('rHeight', function(value){
                    element[0].style[scope.rFlex ? flexBasis : 'height'] = scope.rHeight + 'px';
                });

                element.addClass('resizable');

                var style = window.getComputedStyle(element[0], null),
                    w,
                    h,
                    dir = scope.rDirections || ['right'],
                    vx = scope.rCenteredX ? 2 : 1, // if centered double velocity
                    vy = scope.rCenteredY ? 2 : 1, // if centered double velocity
                    inner = scope.rGrabber ? scope.rGrabber : '<span></span>',
                    start,
                    dragDir,
                    axis,
                    info = {};

                var updateInfo = function(e) {
                    info.width = false; info.height = false;
                    if(axis === 'x')
                        info.width = parseInt(element[0].style[scope.rFlex ? flexBasis : 'width']);
                    else
                        info.height = parseInt(element[0].style[scope.rFlex ? flexBasis : 'height']);
                    info.id = element[0].id;
                    info.evt = e;
                };

                var getClientX = function(e) {
                    return e.touches ? e.touches[0].clientX : e.clientX;
                };

                var getClientY = function(e) {
                    return e.touches ? e.touches[0].clientY : e.clientY;
                };

                var dragging = function(e) {
                    var prop, offset = axis === 'x' ? start - getClientX(e) : start - getClientY(e);
                    switch(dragDir) {
                        case 'top':
                            prop = scope.rFlex ? flexBasis : 'height';
                            element[0].style[prop] = h + (offset * vy) + 'px';
                            break;
                        case 'bottom':
                            prop = scope.rFlex ? flexBasis : 'height';
                            element[0].style[prop] = h - (offset * vy) + 'px';
                            break;
                        case 'right':
                            prop = scope.rFlex ? flexBasis : 'width';
                            element[0].style[prop] = w - (offset * vx) + 'px';
                            break;
                        case 'left':
                            prop = scope.rFlex ? flexBasis : 'width';
                            element[0].style[prop] = w + (offset * vx) + 'px';
                            break;
                    }
                    updateInfo(e);
                    function resizingEmit(){
                        scope.$emit('angular-resizable.resizing', info);
                    }
                    if (scope.rNoThrottle) {
                        resizingEmit();
                    } else {
                        throttle(resizingEmit);
                    }
                };
                var dragEnd = function(e) {
                    updateInfo();
                    scope.$emit('angular-resizable.resizeEnd', info);
                    scope.$apply();
                    document.removeEventListener('mouseup', dragEnd, false);
                    document.removeEventListener('mousemove', dragging, false);
                    document.removeEventListener('touchend', dragEnd, false);
                    document.removeEventListener('touchmove', dragging, false);
                    element.removeClass('no-transition');
                };
                var dragStart = function(e, direction) {
                    dragDir = direction;
                    axis = dragDir === 'left' || dragDir === 'right' ? 'x' : 'y';
                    start = axis === 'x' ? getClientX(e) : getClientY(e);
                    w = parseInt(style.getPropertyValue('width'));
                    h = parseInt(style.getPropertyValue('height'));

                    //prevent transition while dragging
                    element.addClass('no-transition');

                    document.addEventListener('mouseup', dragEnd, false);
                    document.addEventListener('mousemove', dragging, false);
                    document.addEventListener('touchend', dragEnd, false);
                    document.addEventListener('touchmove', dragging, false);

                    // Disable highlighting while dragging
                    if(e.stopPropagation) e.stopPropagation();
                    if(e.preventDefault) e.preventDefault();
                    e.cancelBubble = true;
                    e.returnValue = false;

                    updateInfo(e);
                    scope.$emit('angular-resizable.resizeStart', info);
                    scope.$apply();
                };

                dir.forEach(function (direction) {
                    var grabber = document.createElement('div');

                    // add class for styling purposes
                    grabber.setAttribute('class', 'rg-' + direction);
                    grabber.innerHTML = inner;
                    element[0].appendChild(grabber);
                    grabber.ondragstart = function() { return false; };

                    var down = function(e) {
                        var disabled = (scope.rDisabled === 'true');
                        if (!disabled && (e.which === 1 || e.touches)) {
                            // left mouse click or touch screen
                            dragStart(e, direction);
                        }
                    };
                    grabber.addEventListener('mousedown', down, false);
                    grabber.addEventListener('touchstart', down, false);
                });
            }
        };
    });
angular.module('alpacaEditor', ['dndLists', 'swiperRepeat', 'flow', 'angularResizable', 'alpacaViewer', 'alpacaSchemas', 'alpacaTypes']);


angular.module('alpacaEditor').directive('alpacaForm', [
	'$compile', 
	'$templateRequest',
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {

				$templateRequest($scope.model.template).then(function(tpl){
					var template = angular.element(tpl);
					element.after(template);
					$compile(template)($scope);
				});

		}

		return {
			restrict: 'E',
			link: link,
			scope:{
				model: '=',
				schema: '='
			}
		};
}]);

angular.module('alpacaEditor').controller('alpacaEditorController', [
	'$scope',
	'$templateList',
	'$schemas',
	'$timeout',
	function($scope, $templateList, $schemas, $timeout){


	$scope.templates = $templateList.templates;
	console.log($templateList);
	
	$scope.survey = {

		slides: {
			1: {
				id: 1, title: 'Slide 1', content: 'Foo', template: 'green'
			},
			2: {
				id: 2, title: 'Slide 2', content: 'Bar', template: 'orange'
			},
			3: {
				id: 3, title: 'Slide 3', content: 'Fluf', template: 'orange'
			}
		},


		nodes: {
			1: {
				id: 1, title: 'Slide 1', content: 'Foo', template: 'green'
			},
			2: {
				kind: 'folder', title: 'Smoking'
			},
			3: {
				id: 3, title: 'Slide 3', content: 'Fluf', template: 'orange'
			}
		}

	};
	$scope.selected = $scope.survey.slides[1];
	$scope.schemas = $schemas.schemas;

	$scope.maximized = false;

	$scope.maximizePreview = function(maximized){
		/*$('.resizable-section.white').animate({
			flex: '0 0 0px'
		}, 1000, function(){
			maximized = !maximized;
		})*/
		$('.resizable-wrapper').toggleClass('minimized');
		$scope.maximized = !$scope.maximized;
	}

	/*
	$scope.schema = [
		{
			key: 'title',
			type: 'input'
		},
		{
			key: 'content',
			type: 'textarea'
		}

	];*/

  $scope.devices = {
    iphone: {
      name: 'iPhone',
      width: 480,
      height: 720,
      material_icon: 'smartphone'
    },
    desktop: {
      name: 'Desktop',
      width: 1920,
      height: 1080,
      material_icon: 'desktop_windows'
    },
    tablet: {
      name: 'Tablet',
      width: 800,
      height: 400,
      material_icon: 'tablet'
    }
  };

  $scope.setDevice = function(device) {
    $scope.device = device;
    console.log('set device:', device);
  }

  $scope.setSlide = function(slide){
  	$scope.selected = slide;
  	console.log(slide);
  }

  $scope.loading = true;

  $scope.search = function(){
  	$scope.searching = true;
  	
  	$timeout(function(){$('#search').focus()});
  }

  $scope.$on('device-ready', function(){
  	$scope.setDevice($scope.devices.tablet);
  	$scope.loading = false;
  	
  });

  $scope.fn = {
  	tags: {
	  	init: function(){
	  		$('.chips').material_chip();
	  		console.log('loaded chips');
	  	}
		}
  };
  
}]);

angular.module('alpacaEditor').directive('alpacaForm', [
	'$compile', 
	'$templateRequest', 
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {
			
			$templateRequest('alpaca-type-' + $scope.slide.template).then(function(tpl){
				var template = angular.element(tpl);
				element.after(template);
				$compile(template)($scope);
			});
		}

		return {
			restrict: 'E',
			link: link
		};
}]);

angular.module('alpacaEditor').directive('alpacaField', [
	'$compile', 
	'$templateRequest', 
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {
			console.log($scope.type)
			$templateRequest('alpaca-type-' + $scope.type).then(function(tpl){
				var template = angular.element(tpl);
				element.after(template);
				$compile(template)($scope);
			});
		}

		return {
			restrict: 'E',
			link: link,
			scope: {
				model: '=',
				type: '=',
				field: '=',
				fn: '='
			}
		};
}]);
/*  Todo:
 *  *remove jquery dep
 *  *combine directives
 *  *on window resize
 *  *support iframe templates
 *  *clean up
 *  *publish to github
 *  *publish to npm
 */

angular.module('alpacaEditor').directive('devicePreview', function() {

  var link = function($scope, el, attrs) {

    //console.log($scope.$parent);
    var parent = angular.element(el).parent();


    console.log('device-size', $scope.$parent.frame_size);

    var child = angular.element(el);
/*function(){

      return {
        frame_size: $scope.$parent.frame_size
        device: $scope.device
      }

    },*/

    $scope.$watch('device',
     function() {

      var device = $scope.device;

      if (!angular.element(el).parent()[0])
        return false;

      parent.width = $scope.$parent.frame_size.width;
      parent.height = $scope.$parent.frame_size.height;

      console.log($scope.device);
      
      /*$scope.$watch(
        function(){
          return {
            width: parent.width,
            height: parent.height
          }
        },
        function(){
          $scope.$apply();
        }
      )*/

      var fit = (parent.width / parent.height > device.width / device.height);
      var scale = fit ? parent.height / device.height : parent.width / device.width;
      var width = fit ? device.width * parent.height / device.height : parent.width;
      var height = fit ? parent.height : device.height * parent.width / device.width;
      
      child.css({
        'background': 'white',
      })
      
      parent.css({
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
      });

      child.css({
        'zoom': scale,
        'width': width / scale + 'px',
        'height': height / scale + 'px',
      });

      var translate = {
        x: -1 * ((Math.max(device.width, width) - parent.width) / 2),
        y: -1 * ((Math.max(device.height, height) - parent.height) / 2)
      };

      $scope.$parent.iframe.css({
        'width': Math.max(device.width, width),
        'height': Math.max(device.height, height),
        'transform': 'translate(' + translate.x + 'px,' + translate.y + 'px)'
      })

      console.log('device', device.width, device.height);
      console.log('parent', parent.width, parent.height);
      console.log('scale', scale);
      console.log('new', width, height);
    });
  };

  return {
    restrict: 'E',
    link: link,
    scope: {
      'device': '='
    }
  }
});

//http://plnkr.co/edit/KRfAyc5haHyFq7FyCnxg?p=preview
angular.module('alpacaEditor').directive("wrapInFrame", [
  '$compile',
  '$timeout',
  function($compile, $timeout) {
  return {
    restrict: "E",
    scope: {},
    transclude: true,
    replace: false,
    link: function($scope, $directiveElement, $attrs, $controller, $transclude) {
      

      /*$scope.$watch(
          function () { 
              return {
                 width: $directiveElement.parent().width(),
                 height: $directiveElement.parent().height(),
              }
         },
         function (data) {
          $scope.$parent.frame_size = data;
          //alert('size changed!');
         }, //listener 
         true //deep watch
      );*/
      
      $scope.$parent.frame_size = {
        width: $directiveElement.parent().width(),
        height: $directiveElement.parent().height()
      }
      
      $transclude($scope.$parent, function($children, otherScope) {

        $directiveElement.html("<iframe width='100%' height='100%'>");
        var iframe = $directiveElement.find("iframe")[0];

        $scope.$parent.iframe = angular.element(iframe);

        iframe.onload = function() {

          $scope.$parent.linked = true;
          
          var iframeBody = angular.element(iframe.contentWindow.document.body);

          $("link[rel='stylesheet'], link[type='text/css'], link[href$='.css']").clone().appendTo($("iframe").contents().find("head"));
          $('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>').appendTo($("iframe").contents().find("head"));

          $compile($children)($scope.$parent, function(elem) {
            iframeBody.append(elem);
            $scope.$parent.$emit('device-ready');
          });
        };

        iframe.src = '';
      });
    }
  };
}]);
/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function ($) {
    var dragging, placeholder;
    $.extend($.fn, {
        sortable: function (options) {
            var method = String(options);
            options = $.extend({
                items: '*',
                handle: '*',
                connectWith: false
            }, options);
            return this.each(function () {
                if (/^enable|disable|destroy$/.test(method)) {
                    var items = $(this).children(JSON.parse($(this).data('options')).items).attr('draggable', method == 'enable');
                    if (method == 'destroy') {
                        $(this).removeData('options').off('mousedown mouseup selectstart dragstart dragend dragover dragenter drop');
                    }
                    return;
                }
                var isHandle, index, items;
                $(this).data('options', JSON.stringify(options));
                $(this).on('mousedown', function () {
                    items = $(this).children(options.items).attr('draggable', 'true');
                    placeholder = $('<' + items[0].tagName + ' class="sortable-placeholder">');
                }).on('mousedown', options.handle, function () {
                    isHandle = true;
                }).on('mouseup', options.handle, function () {
                    isHandle = false;
                }).on('selectstart', options.items + ':not(a[href], img)', function (e) {
                    e.currentTarget.dragDrop && e.currentTarget.dragDrop();
                    return false;
                }).on('dragstart', options.items, function (e) {
                    if (options.handle && !isHandle) return false;
                    isHandle = false;
                    index = (dragging = $(e.currentTarget)).index();
                    var dt = e.originalEvent ? e.originalEvent.dataTransfer : e.dataTransfer;
                    dt.effectAllowed = 'move';
                    dt.setData('text', 'ff');
                }).on('dragend', options.items, function () {
                    dragging.show();
                    if (index != dragging.index()) {
                        $(this).trigger('sortupdate', { item: dragging });
                    }
                    placeholder.remove();
                    dragging = null;
                }).on('dragover dragenter drop', options.items, function (e) {
                    if ((!items || items.index(dragging) === -1) && (options.connectWith !== JSON.parse($(dragging).parent().data('options')).connectWith || !options.connectWith)) {
                        return true;
                    }
                    if (e.type === 'dragenter') {
                        if (!items || items.index(e.currentTarget) != -1) {
                            dragging.hide();
                            $(e.currentTarget)[placeholder.index() < $(e.currentTarget).index() ? 'after' : 'before'](placeholder);
                        }
                    }
                    if (e.type == 'drop') {
                        e.stopPropagation();
                        placeholder.after(dragging);
                    }
                    return false;
                });
            });
        }
    });
})(this.jQuery || this.Zepto);

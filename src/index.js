/**
 * Created by zhy on 2017/4/1.
 */
'use strict';

/**
 * mavonEditor
 * @author hinesboy
 */
import mavonEditor from './mavon-editor.vue';
import mavonRender from './mavon-render.vue';
import {renderMarkdownPreview, renderMarkdownHtml} from './lib/markdown/markdown';

const VueMavonEditor = {
    mavonEditor: mavonEditor,
    LeftToolbar: require('./components/md-toolbar-left'),
    RightToolbar: require('./components/md-toolbar-right'),
    install: function(Vue) {
        Vue.prototype.$mavonPreview = renderMarkdownPreview;
        Vue.prototype.$mavonRender = renderMarkdownHtml;
        Vue.component('mavon-editor', mavonEditor);
        Vue.component('mavon-render', mavonRender);
    }
};

module.exports = VueMavonEditor;

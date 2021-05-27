/**
 * Created by zhy on 2017/4/1.
 */
'use strict';

/**
 * mavonEditor
 * @author hinesboy
 */
import mavonEditor from './mavon-editor.vue';
const VueMavonEditor = {
    mavonEditor: mavonEditor,
    LeftToolbar: require('./components/md-toolbar-left'),
    RightToolbar: require('./components/md-toolbar-right'),
    install: function(Vue) {
        Vue.component('mavon-editor', mavonEditor);
    }
};

module.exports = VueMavonEditor;

<template>
    <div v-html="htmlContent" class="markdown-body"></div>
</template>

<script>
import {renderMarkdownHtml} from './lib/markdown/markdown';

export default {
    props: {
        value: {
            type: String,
            required: true
        }, 
        noSanitize: {
            type: Boolean,
            default: () => false
        }
    },

    computed: {
        htmlContent() {
            return renderMarkdownHtml(this.value, this.noSanitize);
        }
    }
}
</script>

<style lang="css" scoped>
    @import "lib/css/md.css";
    @import "lib/css/github-markdown.css";
    @import "lib/css/prism-ghcolors.css";
</style>
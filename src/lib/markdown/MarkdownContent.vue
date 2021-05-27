<template>
    <div v-html="htmlContent"></div>
</template>

<script>
import renderMarkdownHtml from './markdown';

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

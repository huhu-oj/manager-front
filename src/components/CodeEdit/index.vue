<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import './settings'

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'java',
      require: false
    }
  },
  data() {
    return {
      editor: false,
      languageMap: {
        JavaScript: 'javascript',
        TypeScript: 'text/typescript',
        Python: 'python',
        Java: 'text/x-java',
        CPP: 'text/x-c++src',
        CSharp: 'text/x-csharp',
        Go: 'text/x-go',
        PHP: 'application/x-httpd-php',
        HTML: 'htmlmixed',
        CSS: 'css',
        SQL: 'text/x-sql',
        Markdown: 'markdown'
      }
    }
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue()
      if (value !== editorValue) {
        this.editor.setValue(this.value)
      }
    },
    height(value) {
      this.editor.setSize('auto', this.height)
    },
    language() {
      const languageKey = this.lookLanguageMode()
      this.editor.setOption('mode', this.languageMap[languageKey])
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: this.lookLanguageMode(),
      lineNumbers: true,
      lint: true,
      lineWrapping: true,
      tabSize: 2,
      cursorHeight: 0.9,
      // 替换主题这里需修改名称
      theme: 'idea',
      highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
      matchBrackets: true,
      autoCloseBrackets: true // 自动补全括号
      // readOnly: false
    })
    this.editor.setSize('auto', this.height)
    this.editor.setValue(this.value)
    this.editor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.editor.getValue()
    },
    lookLanguageMode() {
      for (const key in this.languageMap) {
        if (!this.languageMap.hasOwnProperty(key)) {
          continue
        }
        if (key.toLowerCase() === this.language.toLowerCase()) {
          return key
        }
      }
      return 'text/x-java'
    }
  }
}
</script>

<style scoped>
  .json-editor{
    height: 100%;
    margin-bottom: 10px;
  }
  .json-editor >>> .CodeMirror {
    font-size: 14px;
    font-weight:normal
  }
  .json-editor >>> .CodeMirror-scroll{
  }
  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
  }
</style>

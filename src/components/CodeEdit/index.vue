<template>
  <div class="json-editor">
    <el-select
      v-model="languageId"
      default-first-option
      :reserve-keyword="false"
      placeholder="选择语言"
    >
      <el-option
        v-for="item in knowledgeList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import './settings'
import { listAllKnowledge } from '@/api/knowledge'

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
      require: true
    },
    languageId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      editor: false,
      knowledgeList: []
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
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: `text/x-${this.language}`,
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
  created() {
    this.getKnowledgeList()
  },
  methods: {
    getValue() {
      return this.editor.getValue()
    },
    getKnowledgeList() {
      listAllKnowledge().then(data => {
        this.knowledgeList = data
      })
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
    font-size: 13px;
    overflow-y:auto;
    font-weight:normal
  }
  .json-editor >>> .CodeMirror-scroll{
  }
  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
  }
</style>

<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">标题</label>
        <el-input v-model="query.title" clearable placeholder="标题" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="80%">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-steps :active="step" finish-status="success" simple style="margin-bottom: 20px">
            <el-step title="基本信息" />
            <el-step title="提示" />
            <el-step title="题解" />
            <el-step title="输入输出" />
            <el-step v-if="false" title="测试" />
          </el-steps>
          <div v-show="step+1 === 1">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <mavon-editor ref="md" :value="form.description" @change="savePaperInfo" />
            </el-form-item>
            <el-form-item label="标签" prop="label">
              <el-select
                v-model="form.labels"
                value-key="id"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="关联标签"
              >
                <el-option
                  v-for="item in labelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="知识点">
              <el-table size="small" :data="form.knowledges">
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="weight" label="权重">
                  <template #default="scope">
                    <!--                <el-input-number v-model="scope.row.weight" :min="1" :max="10" />-->
                    <el-input v-model="scope.row.weight" type="number" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150px" align="center">
                  <template #default="scope">
                    <el-popconfirm title="取消该知识点的关联？" @confirm="cancelKnowledge(scope.row)">
                      <template #reference>
                        <el-button>删除</el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
              <el-popover placement="bottom" :width="200" trigger="click">
                <template #reference>
                  <el-button>添加知识点</el-button>
                </template>
                <el-table size="small" :data="knowledgeList" @row-click="selectOneKnowledge">
                  <el-table-column prop="name" label="名称" />
                </el-table>
              </el-popover>
            </el-form-item>
          </div>
          <div v-show="step+1 === 2">
            <el-tabs
              v-if="crud.status.cu > 0"
              v-model="activeHint"
              type="card"
              editable
              @edit="editHintTab"
            >
              <el-tab-pane
                v-for="item in form.hints"
                :key="item.name"
                :label="item.name"
                :name="item.name"
                lazy
              >
                <mavon-editor :value="item.description" @change="saveHintInfo" />
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-show="step+1 === 3">
            <el-tabs
              v-if="crud.status.cu > 0"
              v-model="activeSolution"
              type="card"
              editable
              @edit="editSolutionTab"
            >
              <el-tab-pane
                v-for="item in form.solutions"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                lazy
              >
                <el-form-item label="标题">
                  <el-input v-model="item.title" />
                </el-form-item>
                <el-form-item label="描述">
                  <mavon-editor :value="item.description" @change="saveSolutionInfo" />
                </el-form-item>
                <el-form-item label="标签">
                  <el-select
                    v-model="item.labels"
                    value-key="id"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    :reserve-keyword="false"
                    placeholder="关联标签"
                  >
                    <el-option
                      v-for="item1 in labelList"
                      :key="item1.id"
                      :label="item1.name"
                      :value="item1"
                    />
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-show="step+1 === 4">
            <el-table size="small" :data="form.standardIos">
              <el-table-column prop="input" label="输入">
                <template #default="scope">
                  <el-input v-model="scope.row.input" :autosize="{ minRows: 2 }" type="textarea" />
                </template>
              </el-table-column>
              <el-table-column prop="output" label="输出">
                <template #default="scope">
                  <el-input v-model="scope.row.output" :autosize="{ minRows: 2 }" type="textarea" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150px" align="center">
                <template #default="scope">
                  <el-popconfirm title="删除该条输入输出？" @confirm="cancelStandardIo(scope.row)">
                    <template #reference>
                      <el-button>删除</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-button @click="plusOneStandardIo">添加</el-button>
          </div>
          <div v-if="step+1 === 5 && false">
            <el-tabs
              v-if="crud.status.cu > 0"
              v-model="activeSolution"
              type="card"
              editable
              @edit="editSolutionTab"
            >
              <el-tab-pane
                v-for="item in form.solutions"
                :key="item.name"
                :label="item.name"
                :name="item.name"
                lazy
              >
                <!--                <code-edit :value="solution" :height="height" :language="'java'" :language-id="item.language.id" />-->
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">

          <el-button-group>
            <el-button type="primary" :disabled="step === 0" @click="plusStep(false,count)"><svg-icon icon-class="left" />上一步</el-button>
            <el-button type="primary" :disabled="step+1 === count" @click="plusStep(true,count)">
              下一步<svg-icon icon-class="right" />
            </el-button>
          </el-button-group>
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button v-if="step+1 === count" :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','problem:edit','problem:del'])" label="操作" width="150px" align="center">
          <template #default="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudProblem from '@/api/problem'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

import 'mavon-editor/dist/css/index.css'
import { mavonEditor } from 'mavon-editor'
import { listAllLabel } from '@/api/label'
import { listAllKnowledge } from '@/api/knowledge'

const defaultForm = { id: null, title: null, description: '', createTime: null, updateTime: null, descriptionHtml: null, labels: [], labelIds: [], knowledges: [], hints: [], solutions: [], standardIos: [] }
export default {
  name: 'Problem',
  components: { mavonEditor, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '问题', url: 'api/problem', idField: 'id', sort: 'id,desc', crudMethod: { ...crudProblem }})
  },
  data() {
    return {
      activeSolution: '',
      solutionIndex: 0,
      activeHint: '',
      hintIndex: 0,
      step: 0,
      count: 4,
      labelList: [],
      knowledgeList: [],
      permission: {
        add: ['admin', 'problem:add'],
        edit: ['admin', 'problem:edit'],
        del: ['admin', 'problem:del']
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'title', display_name: '标题' }
      ]
    }
  },
  created() {
    this.getLabelList()
    this.getKnowledgeList()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.afterToEdit]() {
      this.form.labelIds = this.form.labels.map(label => label.id)
    },
    [CRUD.HOOK.afterToCU]() {
      // 表单应该重置到第一页
      this.step = 0
      this.hintIndex = 0
      if (this.form.hints.length === 0) {
        this.editHintTab('hint', 'add')
      } else {
        this.form.hints.forEach(hint => {
          hint.name = `提示 ${++this.hintIndex}`
        })
        this.activeHint = this.form.hints[0].name
      }
      // 题解
      this.solutionIndex = 0
      if (this.form.solutions.length === 0) {
        this.editSolutionTab('solution', 'add')
      } else {
        this.form.solutions.forEach(solution => {
          solution.name = `${++this.solutionIndex}`
        })
        this.activeSolution = this.form.solutions[0].name
      }
    },
    // [CRUD.HOOK.beforeSubmit]() {
    //   this.form.labels = this.form.labelIds.map(label => { return { 'id': label } })
    // },
    savePaperInfo(markdown, render) {
      this.form.description = markdown
      this.form.descriptionHtml = render
    },
    saveHintInfo(markdown, render) {
      this.form.hints.forEach(hint => {
        if (hint.name === this.activeHint) {
          hint.description = markdown
          hint.descriptionHtml = render
        }
      })
    },
    saveSolutionInfo(markdown, render) {
      this.form.solutions.forEach(solution => {
        if (solution.name === this.activeSolution) {
          solution.description = markdown
          solution.descriptionHtml = render
        }
      })
    },
    getLabelList() {
      listAllLabel().then(data => {
        this.labelList = data
      })
    },
    getKnowledgeList() {
      listAllKnowledge().then(data => {
        this.knowledgeList = data
      })
    },
    selectOneKnowledge(row) {
      row.weight = 1
      this.form.knowledges.push(row)
      this.form.knowledges = Array.from(new Set(this.form.knowledges))
    },
    cancelKnowledge(row) {
      this.form.knowledges.splice(row.$index, 1)
    },
    cancelStandardIo(row) {
      this.form.standardIos.splice(row.$index, 1)
    },
    plusStep(bool, count) {
      if (bool) {
        this.step = (this.step + 1) % count
      } else {
        const tempStep = (this.step - 1) % count
        tempStep < 0 ? this.step = 0 : this.step = tempStep
      }
    },
    plusOneStandardIo() {
      this.form.standardIos.push({})
    },
    editHintTab(targetName, action) {
      if (action === 'add') {
        const newTabName = `提示 ${++this.hintIndex}`
        this.form.hints.push({
          title: newTabName,
          name: newTabName,
          description: '',
          descriptionHtml: ''
        })
        this.activeHint = newTabName
      } else if (action === 'remove') {
        const tabs = this.form.hints
        let activeName = this.activeHint
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.activeHint = activeName
        this.form.hints = tabs.filter((tab) => tab.name !== targetName)
      }
    },
    editSolutionTab(targetName, action) {
      if (action === 'add') {
        const newTabName = `${++this.solutionIndex}`
        this.form.solutions.push({
          title: newTabName,
          name: newTabName,
          language: {},
          description: '',
          descriptionHtml: ''
        })
        this.activeSolution = newTabName
      } else if (action === 'remove') {
        const tabs = this.form.solutions
        let activeName = this.activeSolution
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.activeSolution = activeName
        this.form.solutions = tabs.filter((tab) => tab.name !== targetName)
      }
    }
  }
}
</script>

<style scoped>

</style>

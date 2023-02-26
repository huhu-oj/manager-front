<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">id</label>
        <el-input v-model="query.id" clearable placeholder="id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.name" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="80%">
        <el-steps :active="step" finish-status="success" simple style="margin-bottom: 20px">
          <el-step title="基本信息" />
          <el-step title="设置题目和分值" />
          <el-step title="题解" />
          <el-step title="输入输出" />
        </el-steps>
        <div v-if="title_active===1">
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="描述">
              <mavon-editor ref="md" :value="form.description" @change="savePaperInfo" />
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-transfer
            :value="problemIds"
            filterable
            filter-placeholder="题目名"
            :data="problems"
          />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="title_active=2">下一步</el-button>
          <el-button type="text" @click="title_active=1">上一步</el-button>
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="updateTime" label="updateTime" />
        <el-table-column v-if="checkPer(['admin','examinationPaper:edit','examinationPaper:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
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
import crudExaminationPaper from '@/api/examinationPaper'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation.vue'
import crudOperation from '@crud/CRUD.operation.vue'
import udOperation from '@crud/UD.operation.vue'
import pagination from '@crud/Pagination.vue'
import 'mavon-editor/dist/css/index.css'
import { mavonEditor } from 'mavon-editor'

const defaultForm = { id: null, name: null, description: '', descriptionHtml: null, createTime: null, updateTime: null }
export default {
  name: 'ExaminationPaper',
  components: { mavonEditor, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '试卷', url: 'api/examinationPaper', idField: 'id', sort: 'id,desc', crudMethod: { ...crudExaminationPaper }})
  },
  data() {
    return {
      step: 1,
      permission: {
        add: ['admin', 'examinationPaper:add'],
        edit: ['admin', 'examinationPaper:edit'],
        del: ['admin', 'examinationPaper:del']
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: 'id' },
        { key: 'name', display_name: '名称' }
      ]
    }
  },
  created() {

  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    savePaperInfo(markdown, render) {
      this.form.description = markdown
      this.form.descriptionHtml = render
    },
    getProblems() {
      // crudProblem.

    }
  }
}
</script>

<style scoped>

</style>

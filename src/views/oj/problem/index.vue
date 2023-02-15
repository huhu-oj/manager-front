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
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <mavon-editor ref="md" :value="form.description" @change="savePaperInfo" />
          </el-form-item>
          <el-form-item label="标签" prop="label">
            <el-select
              v-model="form.extra.label"
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="Choose tags for your article"
            >
              <el-option
                v-for="item in labelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
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
import crudProblem from '@/api/problem'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

import 'mavon-editor/dist/css/index.css'
import { mavonEditor } from 'mavon-editor'
import { listAllLabel } from '@/api/label'
const defaultForm = { id: null, title: null, description: '', createTime: null, updateTime: null, descriptionHtml: null, extra: {}}
export default {
  name: 'Problem',
  components: { mavonEditor, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '问题', url: 'api/problem', idField: 'id', sort: 'id,desc', crudMethod: { ...crudProblem }})
  },
  data() {
    return {
      labelList: [],
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
    getLabelList() {
      listAllLabel().then(data => {
        this.labelList = data
      })
    }
  }
}
</script>

<style scoped>

</style>

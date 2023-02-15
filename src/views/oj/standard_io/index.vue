<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">所属题目</label>
        <el-input v-model="query.problemId" clearable placeholder="所属题目" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="输入" prop="input">
            <el-input v-model="form.input" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="输出" prop="output">
            <el-input v-model="form.output" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属题目" prop="problemId">
            <el-select v-model="form.problemId" filterable placeholder="Select">
              <el-option
                v-for="item in problemList"
                :key="item.id"
                :label="item.title"
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
        <el-table-column prop="input" label="输入" />
        <el-table-column prop="output" label="输出" />
        <el-table-column prop="problemId" label="所属题目" />
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="updateTime" label="updateTime" />
        <el-table-column v-if="checkPer(['admin','standardIo:edit','standardIo:del'])" label="操作" width="150px" align="center">
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
import { listAllProblem } from '@/api/problem'
import crudStandardIo from '@/api/standardIo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, input: null, output: null, problemId: null, createTime: null, updateTime: null }
export default {
  name: 'StandardIo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '标准输入输出', url: 'api/standardIo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStandardIo }})
  },
  data() {
    return {
      problemList: [],
      permission: {
        add: ['admin', 'standardIo:add'],
        edit: ['admin', 'standardIo:edit'],
        del: ['admin', 'standardIo:del']
      },
      rules: {
        input: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        output: [
          { required: true, message: '输出不能为空', trigger: 'blur' }
        ],
        problemId: [
          { required: true, message: '所属题目不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'problemId', display_name: '所属题目' }
      ]
    }
  },
  created() {
    this.setProblemList()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    setProblemList() {
      listAllProblem().then(data => {
        this.problemList = data
      })
    }
  }
}
</script>

<style scoped>

</style>

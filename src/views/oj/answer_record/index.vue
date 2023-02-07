<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">所属题目</label>
        <el-input v-model="query.problemId" clearable placeholder="所属题目" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">所属用户</label>
        <el-input v-model="query.userId" clearable placeholder="所属用户" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">所属语言</label>
        <el-input v-model="query.languageId" clearable placeholder="所属语言" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">执行结果</label>
        <el-input v-model="query.executeResultId" clearable placeholder="执行结果" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="所属题目" prop="problemId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="所属用户" prop="userId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="代码" prop="code">
            <el-input v-model="form.code" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="执行时间" prop="executeTime">
            <el-input v-model="form.executeTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属语言" prop="languageId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="日志" prop="log">
            <el-input v-model="form.log" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="错误日志" prop="error">
            <el-input v-model="form.error" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="通过数" prop="passNum">
            <el-input v-model="form.passNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="未通过数" prop="notPassNum">
            <el-input v-model="form.notPassNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="执行结果" prop="executeResultId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="form.note" :rows="3" type="textarea" style="width: 370px;" />
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
        <el-table-column prop="problemId" label="所属题目" />
        <el-table-column prop="userId" label="所属用户" />
        <el-table-column prop="code" label="代码" />
        <el-table-column prop="executeTime" label="执行时间" />
        <el-table-column prop="languageId" label="所属语言" />
        <el-table-column prop="log" label="日志" />
        <el-table-column prop="error" label="错误日志" />
        <el-table-column prop="passNum" label="通过数" />
        <el-table-column prop="notPassNum" label="未通过数" />
        <el-table-column prop="executeResultId" label="执行结果" />
        <el-table-column prop="note" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','answerRecord:edit','answerRecord:del'])" label="操作" width="150px" align="center">
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
import crudAnswerRecord from '@/api/answerRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation.vue'
import crudOperation from '@crud/CRUD.operation.vue'
import udOperation from '@crud/UD.operation.vue'
import pagination from '@crud/Pagination.vue'

const defaultForm = { id: null, problemId: null, userId: null, code: null, executeTime: null, languageId: null, log: null, error: null, passNum: null, notPassNum: null, executeResultId: null, note: null, createTime: null, updateTime: null }
export default {
  name: 'AnswerRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '做题记录', url: 'api/answerRecord', idField: 'id', sort: 'id,desc', crudMethod: { ...crudAnswerRecord }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'answerRecord:add'],
        edit: ['admin', 'answerRecord:edit'],
        del: ['admin', 'answerRecord:del']
      },
      rules: {
        problemId: [
          { required: true, message: '所属题目不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '所属用户不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '代码不能为空', trigger: 'blur' }
        ],
        executeTime: [
          { required: true, message: '执行时间不能为空', trigger: 'blur' }
        ],
        languageId: [
          { required: true, message: '所属语言不能为空', trigger: 'blur' }
        ],
        log: [
          { required: true, message: '日志不能为空', trigger: 'blur' }
        ],
        error: [
          { required: true, message: '错误日志不能为空', trigger: 'blur' }
        ],
        passNum: [
          { required: true, message: '通过数不能为空', trigger: 'blur' }
        ],
        notPassNum: [
          { required: true, message: '未通过数不能为空', trigger: 'blur' }
        ],
        executeResultId: [
          { required: true, message: '执行结果不能为空', trigger: 'blur' }
        ],
        note: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'problemId', display_name: '所属题目' },
        { key: 'userId', display_name: '所属用户' },
        { key: 'languageId', display_name: '所属语言' },
        { key: 'executeResultId', display_name: '执行结果' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>

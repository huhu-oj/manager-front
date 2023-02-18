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
        <label class="el-form-item-label">是否启动</label>
        <el-input v-model="query.enabled" clearable placeholder="是否启动" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">语言id</label>
        <el-input v-model="query.languageId" clearable placeholder="语言id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="主机地址" prop="url">
            <el-input v-model="form.url" :rows="3" type="textarea" style="width: 370px;" />
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
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="url" label="主机地址" />
        <el-table-column prop="enabled" label="是否启动">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="updateTime" label="updateTime" />
        <el-table-column prop="supportLanguage" label="支持的语言" />
        <el-table-column v-if="checkPer(['admin','judgeMachine:edit','judgeMachine:del'])" label="操作" width="150px" align="center">
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
import crudJudgeMachine from '@/api/judgeMachine'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, username: null, password: null, url: null, enabled: 1, createTime: null, updateTime: null, supportLanguage: null }
export default {
  name: 'JudgeMachine',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['judge_machine_status'],
  cruds() {
    return CRUD({ title: '判题机管理接口', url: 'api/judgeMachine', idField: 'id', sort: 'id,desc', crudMethod: { ...crudJudgeMachine }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'judgeMachine:add'],
        edit: ['admin', 'judgeMachine:edit'],
        del: ['admin', 'judgeMachine:del']
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '主机账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '主机地址不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '是否启动不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: 'id' },
        { key: 'name', display_name: '名称' },
        { key: 'enabled', display_name: '是否启动' },
        { key: 'languageId', display_name: '语言id' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.judge_machine_status[val] + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudJudgeMachine.edit(data).then(res => {
          this.crud.notify(this.dict.label.judge_machine_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style scoped>

</style>

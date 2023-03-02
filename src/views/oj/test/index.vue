<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">标题</label>
        <el-input v-model="query.title" clearable placeholder="标题" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">开始时间</label>
        <!--        <el-input v-model="query.startTime" clearable placeholder="开始时间" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <el-date-picker
          v-model="query.startTime"
          type="date"
          value-format="yyyy-MM-dd hh:mm:ss"
          placeholder="选择一个日期"
          :shortcuts="shortcuts"
          size="small"
        />
        <label class="el-form-item-label">结束时间</label>
        <!--        <el-input v-model="query.endTime" clearable placeholder="结束时间" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <el-date-picker
          v-model="query.endTime"
          type="date"
          value-format="yyyy-MM-dd hh:mm:ss"
          placeholder="选择一个日期"
          :shortcuts="shortcuts"
          size="small"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input v-model="form.description" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="试卷" prop="examinationPaperId">
            <!--/*            <el-input v-model="form.examinationPaperId" style="width: 370px;" />*/-->
            <el-select v-model="form.examinationPaper.id" filterable placeholder="Select">
              <el-option
                v-for="item in examinationPaperList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="form.startTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="form.endTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <!--          <el-form-item label="是否启用" prop="enabled">-->
          <!--            <el-switch v-model="form.enabled" />-->
          <!--          </el-form-item>-->
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
        <el-table-column prop="description" label="备注" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="enabled" label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','test:edit','test:del'])" label="操作" width="150px" align="center">
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
import { listAllExaminationPaper } from '@/api/examinationPaper'
import crudTest from '@/api/test'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, title: null, description: null, examinationPaper: { id: null, name: null }, startTime: Date.now(), endTime: null, enabled: true }
export default {
  name: 'Test',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['judge_machine_status'],
  cruds() {
    return CRUD({ title: '测验', url: 'api/test', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTest }})
  },
  data() {
    return {
      examinationPaperList: [],
      shortcuts: [
        {
          text: '今天',
          value: new Date()
        },
        {
          text: '昨天',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          }
        },
        {
          text: '一周前',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          }
        }
      ],
      permission: {
        add: ['admin', 'test:add'],
        edit: ['admin', 'test:edit'],
        del: ['admin', 'test:del']
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        // description: [
        //   { required: true, message: '备注不能为空', trigger: 'blur' }
        // ],
        examinationPaperId: [
          { required: true, message: '试卷不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '是否启用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'title', display_name: '标题' },
        { key: 'startTime', display_name: '开始时间' },
        { key: 'endTime', display_name: '结束时间' }
      ]
    }
  },
  created() {
    this.setPaperList()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    setPaperList() {
      listAllExaminationPaper().then(data => {
        this.examinationPaperList = data
      })
    },
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.judge_machine_status[val] + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudTest.edit(data).then(res => {
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

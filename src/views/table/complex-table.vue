<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div class="filter-container">
      <!-- 标题搜索 -->
      <el-input v-model="listQuery.title" :placeholder="$t('table.title')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- 重要性 -->
      <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px;margin-left: 10px;" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 类型 -->
      <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <!-- 排序方式 -->
      <!--      <el-select v-model="listQuery.sort" style="width: 140px;margin-left: 10px;" class="filter-item" @change="handleFilter" >-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <!-- 添加按钮 -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!-- 导出 -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
    </div>

    <!-- 表格表头 -->
    <el-tabs type="border-card">
      <el-tab-pane label="产品线关系t_system_product">
        <el-table
          :data="list"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="indexMethod"
          />
          <el-table-column
            prop="eventClassificationLevel2"
            label="系统分类二层"
            width="300"
          />
          <el-table-column
            prop="eventClassificationLevel3"
            label="系统分类三层"
            width="300"
          />
          <el-table-column
            prop="productLine"
            label="产品线"
            width="300"
          />
          <el-table-column
            prop="productTag"
            label="产品标签"
            width="300"
          />
          <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!-- 编辑按钮 -->
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <!-- 删除按钮 -->
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页-->
        <el-pagination
          :current-page="listQuery.page"
          :page-sizes="[20, 50, 100]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
      <el-tab-pane label="处理级别t_dspatch_level">
        <el-table
          :data="tableDataDspatchLevel"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="indexMethod"
          />
          <el-table-column
            prop="assignedLevel3Department"
            label="受派三级部门"
            width="300"
          />
          <el-table-column
            prop="assignedPerson"
            label="受派人"
            width="300"
          />
          <el-table-column
            prop="level"
            label="分派级别"
            width="300"
          />
          <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!-- 编辑按钮 -->
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <!-- 删除按钮 -->
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="事件分类t_event_type">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="address"
            label="地址"
          />
          <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!-- 编辑按钮 -->
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <!-- 删除按钮 -->
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="标准SLA时长t_sla">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="address"
            label="地址"
          />
          <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!-- 编辑按钮 -->
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <!-- 删除按钮 -->
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="来源t_report_source">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="address"
            label="地址"
          />
          <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!-- 编辑按钮 -->
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <!-- 删除按钮 -->
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="日历t_day">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="address"
            label="地址"
          />
          <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!-- 编辑按钮 -->
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <!-- 删除按钮 -->
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加、编辑页面 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- 类型 -->
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <!-- 标题 -->
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <!-- 状态 -->
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- 重要性 -->
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <!-- 点评 -->
        <el-form-item :label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 取消按钮 -->
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <!-- 确定按钮 -->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { fetch } from '../../../fetch' // secondary package based on el-pagination

// 类型
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  // components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      tableDataSystemProduct: [],
      tableDataDspatchLevel: []
    }
  },
  created() {
    this.getSystemProductAllData()
    this.getDspatchLevelAllData()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    getSystemProductAllData() {
      const _this = this
      fetch.get({ url: '/cleanRelation/getSystemProductAllData' }, res => {
        console.log(res)
        res.data.forEach(function(val) {
          _this.tableDataSystemProduct.push(val)
        })
        for (let i = 0; i < 20; i++) {
          this.list.push(this.tableDataSystemProduct[i])
        }
        this.total = res.data.length
      })
    },
    handleSizeChange(limit) {
      console.log(`每页 ${limit} 条`)
      this.currentChangePage(this.listQuery.page, limit)
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page}`)
      this.currentChangePage(page, this.listQuery.limit)
    },
    currentChangePage(page, limit) {
      // 清空list
      this.list = []
      // 分页开始的下标
      let i = (page - 1) * limit// 当前页面选中的分页下标-1 * 展示的数据的条数
      // 分页结束的下标
      let sum = page * limit
      if (sum > this.total) {
        sum = this.total
      }
      for (; i < sum; i++) {
        this.list.push(this.tableDataSystemProduct[i])
      }
    },
    getDspatchLevelAllData() {
      const _this = this
      fetch.get({ url: '/cleanRelation/getDspatchLevelAllData' }, res => {
        console.log(res)
        res.data.forEach(function(val) {
          _this.tableDataDspatchLevel.push(val)
        })
        // for(let i=0; i < 20; i++){
        //   this.list.push(this.tableDataDspatchLevel[i])
        // }
        // this.total = res.data.length
      })
    },

    //
    getList1() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // 只是为了模拟请求的时间
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

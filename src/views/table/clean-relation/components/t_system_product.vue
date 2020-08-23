<template>
  <div>
    <!-- 搜索框 -->
    <div class="filter-container">
      <!-- 标题搜索 -->
      <span class="demonstration">系统分类二层</span>
      <el-input v-model="temp.eventClassificationLevel2" placeholder="系统分类二层" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">系统分类三层</span>
      <el-input v-model="temp.eventClassificationLevel3" placeholder="系统分类三层" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">产品线</span>
      <el-input v-model="temp.productLine" placeholder="产品线" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">产品标签</span>
      <el-input v-model="temp.productTag" placeholder="产品标签" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <!-- 搜索按钮 -->
      <el-button v-waves class="demonstration" type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <!-- 添加按钮 -->
      <el-button class="demonstration" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!-- 导出 -->
      <el-button v-waves :loading="downloadLoading" class="demonstration" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
    </div>
    <!-- 表格主体-->
    <el-table
      v-loading="listLoading"
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
        prop="id"
        label="ID"
        width="70"
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
    <div class="filter-container">
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
    </div>
    <!-- 添加、编辑弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="系统分类二层" :label-width="formLabelWidth" prop="eventClassificationLevel2">
          <el-input v-model="temp.eventClassificationLevel2" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="系统分类三层" :label-width="formLabelWidth" prop="eventClassificationLevel3">
          <el-input v-model="temp.eventClassificationLevel3" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="产品线" :label-width="formLabelWidth" prop="productLine">
          <el-input v-model="temp.productLine" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="产品标签" :label-width="formLabelWidth" prop="productTag">
          <el-input v-model="temp.productTag" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetch } from '../../../../../fetch'
import { createArticle, updateArticle } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    /* typeFilter(type) {
          return calendarTypeKeyValue[type]
        }*/
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      // importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        eventClassificationLevel2: '',
        eventClassificationLevel3: '',
        productLine: '',
        productTag: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogStatus: '',
      textMap: {
        update: '编辑数据',
        create: '新增数据'
      },
      rules: {
        eventClassificationLevel2: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        eventClassificationLevel3: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        productLine: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        productTag: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }]
      },
      downloadLoading: false,
      tableDataSystemProduct: []
    }
  },
  created() {
    this.getSystemProductAllData()
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
    handleFilter() {
      this.listLoading = true
      // 模拟请求时间
      setTimeout(() => {
        this.listLoading = false
      }, 1000)
      this.listQuery.page = 1
      this.list = []
      this.getSystemProductAllData()
    },
    handleCreate() {
      // this.resetTemp()
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
      // this.temp.timestamp = new Date(this.temp.timestamp)
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
    }

  }
}
</script>

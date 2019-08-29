<template>
    <div class="list">
        <!-- 搜索栏 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入搜索内容"
        v-model="goodsobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @input.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="$router.push({name:'add'})">添加商品</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="goodsList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50" label="编号"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500px"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="success" plain icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="审核" placement="top">
            <el-button type="warning" plain icon="el-icon-check"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="goodsobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    </div>
</template>
<script>
import { getCategories } from '@/api/goods_index.js'
export default {
  data () {
    return {
      // 商品列表数据
      total: 0,
      goodsList: [],
      goodsobj: {
        // 查询参数
        query: '',
        // 页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 分页
    // 一个现实几条数据
    handleSizeChange (val) {
      // console.log(val)
      this.goodsobj.pagesize = val
      this.init()
    },
    // 当前页
    handleCurrentChange (val) {
      // console.log(val)
      this.goodsobj.pagenum = val
      this.init()
    },
    // 获取商品列表数据
    init () {
      // 获取商品列表数据
      getCategories(this.goodsobj).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
        }
      })
    }
  }
}
</script>
<style scoped>

</style>

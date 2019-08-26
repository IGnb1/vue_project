<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表 -->
    <el-table :data="rightList" style="width: 70%" :border="true">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
              <span>{{scope.row.level | levelFormat}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRight } from '@/api/right_index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat (level) {
      switch (level) {
        case '0':
          return '一级'
        //   break
        case '1':
          return '二级'
        //   break
        case '2':
          return '三级'
        //   break
      }
    }
  },
  mounted () {
    getAllRight('list')
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rightList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less">
.el-breadcrumb {
  margin: 0;
  line-height: 45px;
}
</style>

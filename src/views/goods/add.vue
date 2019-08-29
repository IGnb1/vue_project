<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="+activeName" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs v-model="activeName" :tab-position="'left'" style="height: 200px;">
    <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
  </el-tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 步骤条的当前步骤数
      activeName: ''
    }
  },
  mounted () {
    // console.log(this.activeName)
  }
}
</script>
<style scoped>
</style>

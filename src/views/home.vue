<template>
  <div class="home">
    <el-container>
      <el-aside width="200px" class="aside">
        <img src="../assets/logo.png" alt class="logo" />
        <el-menu
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened='true'
        >
          <el-submenu :index="''+item.id" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+ Item.path" v-for="Item in item.children" :key="Item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{Item.authName}}</span>
            </el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="1-1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/home/rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
            <el-menu-item index="/home/roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <i class="myicon-menu toggle-btn"></i>
          <h1 class="system-title">电商后台管理系统</h1>
          <a href="#" class="welcome">退出</a>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getRightMenu } from '@/api/right_index.js'
export default {
  data () {
    return {
      menuList: []
    }
  },
  mounted () {
    getRightMenu()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.menuList = res.data.data
        }
      })
  }
}
</script>
<style lang='less' scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-submenu {
    width: 200px;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #989898;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>

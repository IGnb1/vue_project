<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="success" class="sucBtn" @click="addDialogFormVisible = true">添加角色</el-button>
    <!-- 列表 -->
    <el-table :data="roleList" style="width: 100%;margin-top:15px" :border="true">
      <!-- 分栏 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级 -->
          <el-row
            v-for="one in scope.row.children"
            :key="one.id"
            style="margin:10px 0;border-bottom:1px dashed #eee"
          >
            <el-col :span="4">
              <el-tag
                type="info"
                closable
                :disable-transitions="false"
                @close="delRight(scope.row,one.id)"
              >{{one.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级 -->
              <el-row v-for="two in one.children" :key="two.id">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    :disable-transitions="false"
                    @close="cut=0;delRight(scope.row,two.id)"
                  >{{two.authName}}</el-tag>
                </el-col>
                <!-- 三级 -->
                <el-col :span="20">
                  <el-tag
                    style="margin-bottom:10px;margin-right:10px"
                    v-for="three in two.children"
                    :key="three.id"
                    type="danger"
                    closable
                    :disable-transitions="false"
                    @close="delRight(scope.row,three.id)"
                  >{{three.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">{{'还没有数据'}}</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" plain icon="el-icon-edit" @click="showEditRole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button
              type="success"
              plain
              icon="el-icon-share"
              @click="showGrantDialog(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" plain icon="el-icon-delete" @click="delRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addroleobj">
        <el-form-item label="角色名称" :label-width="'120px'">
          <el-input v-model="addroleobj.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'120px'">
          <el-input v-model="addroleobj.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 树形列表 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <el-tree
        ref="tree"
        :data="rightlist"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRight">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editroleobj">
        <el-form-item label="角色名称" :label-width="'120px'">
          <el-input v-model="editroleobj.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'120px'">
          <el-input v-model="editroleobj.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoleList,
  delRightById,
  addrole,
  grantRightById,
  editRoleById,
  delRoleById
} from '@/api/role_index.js'
import { getAllRight } from '@/api/right_index.js'
export default {
  data () {
    return {
      // 编辑角色
      editDialogFormVisible: false,
      editroleobj: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // -------------
      cut: 0,
      // 树形列表
      grantdialogFormVisible: false,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      rightlist: [],
      chkedArr: [],
      // --------------
      // 添加角色数据
      addDialogFormVisible: false,
      addroleobj: {
        roleName: '',
        roleDesc: ''
      },
      // -------
      roleList: [],
      // 角色授权
      roleId: ''
    }
  },
  mounted () {
    this.init()
    this.getAllReight()
  },
  methods: {
    getAllReight () {
      getAllRight('tree')
        .then(res => {
        // console.log(res)
          if (res.data.meta.status === 200) {
            this.rightlist = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    delRight (row, rightId) {
      delRightById(row.id, rightId)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            if (this.cut === 0) {
              this.$message.success(res.data.meta.msg)
              this.cut++
            }

            row.children = res.data.data
            // 遍历row.children,如果一级权限下没有二级权限，那么一级权限也会被删除
            row.children.forEach((v1, i1) => {
              if (v1.children.length === 0) {
                // 证明一级权限下没有二级权限
                this.delRight(row, v1.id)
              } else {
                // 说明一级权限下至少有一个二级权限
                // 那么就遍历二级权限，如果二级权限下没有至少一个三级权限，那么也会被删除
                v1.children.forEach((v2, i2) => {
                  if (v2.children.length === 0) {
                    // 说明二级权限下没有三级权限
                    this.delRight(row, v2.id)
                  }
                })
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加角色
    addRole () {
      addrole(this.addroleobj)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 201) {
            this.addDialogFormVisible = false
            this.$message.success(res.data.meta.msg)
            this.init()
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 重新获取数据
    init () {
      getAllRoleList()
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.roleList = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 角色授权
    async grantRight () {
      // console.log(this.$refs.tree.getCheckedNodes())
      let arr = this.$refs.tree.getCheckedNodes()
      let temp = []
      arr.forEach(e => {
        temp.push(e.id + ',' + e.pid)
      })
      // console.log(temp)//["109,107,102", "154,107,102"]
      temp = temp.join(',').split(',')
      // console.log(temp)//["109", "107", "102", "154", "107", "102"]
      // 输出去重，新语法
      // console.log(new Set(temp))
      temp = [...new Set(temp)]
      // console.log(temp)
      let res = await grantRightById(this.roleId, temp.join(','))
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success('授权成功')
        this.grantdialogFormVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 打开编辑角色表格
    showEditRole (row) {
      // console.log(index, row)
      this.editroleobj = row
      this.editDialogFormVisible = true
      // console.log(this.editroleobj)
    },
    // 编辑角色
    async editRole () {
      let res = await editRoleById(this.editroleobj)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.editDialogFormVisible = false
        this.$message.success('编辑成功')
      } else {
        this.$message.error('编辑失败')
      }
    },
    // 树状表的默认选中
    showGrantDialog (row) {
      this.grantdialogFormVisible = true
      this.roleId = row.id
      // console.log(row)
      // 重新获取一次权限树状表
      this.getAllReight()
      this.chkedArr.length = 0
      row.children.forEach(one => {
        if (one.children.length > 0) {
          one.children.forEach(two => {
            if (two.children.length > 0) {
              two.children.forEach(three => {
                // console.log(three)
                this.chkedArr.push(three.id)
                // console.log(this.chkedArr)
              })
            }
          })
        }
      })
    },
    // 删除角色
    async delRole (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRoleById(row.id)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success('删除成功!')
              this.init()
            } else {
              this.$message.success('删除失败!')
            }
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>
<style lang="less">
.el-breadcrumb {
  margin: 0;
  line-height: 45px;
}
.sucBtn {
  margin-top: 15px;
}
</style>

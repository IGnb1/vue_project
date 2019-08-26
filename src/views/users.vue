<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @input.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" @click="adduser">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeStatu(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
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
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" plain icon="el-icon-share" @click="showRole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" plain icon="el-icon-delete" @click="showDel(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 编辑 -->
    <el-dialog title="编辑信息" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="姓名" :label-width="'80px'" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled style="width:80px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'80px'" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="'80px'" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名" :label-width="'80px'" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="'80px'" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'80px'" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="'80px'" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog title="角色分配" :visible.sync="grantDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名：">
          <span>{{grantForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllUsers,
  edituser,
  add,
  grantUserRole,
  delUserById,
  changestate
} from '@/api/user_index.js'
import { getAllRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      // 角色分配
      grantDialogFormVisible: false,
      roleList: [],
      grantForm: {
        username: '',
        // 用户id
        id: '',
        // 角色id
        rid: ''
      },
      // 添加
      addDialogFormVisible: false,
      addForm: {
        username: '',
        email: '',
        mobile: '',
        password: ''
      },
      // 编辑
      editDialogFormVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // -------
      total: 0,
      userkey: '',
      statu: true,
      userList: [],
      userobj: {
        // 查询参数
        query: '',
        // 页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            // 添加正则表达式
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            // 添加正则表达式
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      //   console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      //   console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    },
    init () {
      getAllUsers(this.userobj)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            this.$router.push('/login')
          }
        })
        .catch(err => {
          console.l(err)
        })
    },
    handleEdit (index, row) {
      // console.log(indexx, row);
      this.editDialogFormVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    handleDelete (index, row) {
      // console.log(index, row);
    },
    // 编辑用户
    editUser () {
      // console.log(this.editForm)
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // alert('submit!')
          edituser(this.editForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.init()
                this.editDialogFormVisible = false
              }
            })
            .catch(() => {
              // console.log(err)
              this.$message.warning('用户编辑失败')
            })
        } else {
          // console.log('error submit!!')
          this.$message.error('请输入合法的信息')
          return false
        }
      })
    },
    // 添加用户
    adduser () {
      this.addDialogFormVisible = true
    },
    addUser () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // alert('submit!')
          add(this.addForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.addDialogFormVisible = false
                this.init()
                this.$message.success(res.data.meta.msg)
                this.$refs.addForm.resetFields()
              }
            })
            .catch(() => {
              this.$message.warning('添加用户失败')
            })
        } else {
          // console.log('error submit!!')
          this.$message.error('请输入合法的信息')
          return false
        }
      })
    },
    // 角色分配
    showRole (row) {
      // console.log(row)
      this.grantDialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      this.grantForm.rid = row.rid
    },
    grantRole () {
      // console.log(this.grantForm)
      if (this.grantForm.rid) {
        grantUserRole(this.grantForm)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.grantDialogFormVisible = false
              this.init()
            }
          })
          .catch(() => {
            this.$message.warning('设置角色失败')
          })
      } else {
        this.$message.error('请选择角色')
      }
    },
    // 弹出删除提示框
    showDel (id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id).then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success('删除成功!')
              this.userobj.pagenum = Math.ceil((this.total - 1) / this.userobj.pagesize)
              this.init()
            } else {
              this.$message.warning('删除失败!')
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 修改状态
    changeStatu (uid, type) {
      // console.log(row)
      changestate(uid, type)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(() => {
          // console.log(err)
          this.$message.error('系统出错')
        })
    }
  },
  mounted () {
    this.init()
    // 获取角色列表
    getAllRoleList()
      .then(res => {
        // console.log(res)
        this.roleList = res.data.data
      })
      .catch(() => {})
  }
}
</script>
<style scoped>
.el-breadcrumb {
  margin: 0;
  line-height: 45px;
}
.input-with-select {
  widows: 300px;
}
</style>

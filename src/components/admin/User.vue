<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主题部分 -->
    <el-card>
        <el-row :gutter="25">
            <el-col :span="10">
                <!-- 搜索添加 -->
                <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 用户列表 border边框 stripe隔行变色-->
        <el-table :data="userList" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column prop="state" label="状态">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                    <!-- 每一行的数据 -->
                    <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUpdateDialog(scope.row.id)"></el-button>
                    <!-- 删除 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                    <!-- 权限 -->
                    <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 size-change 每页最大变化 current-change 当前页最大变化 layout功能组件-->
        <div>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1, 2, 5, 100]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userCounts">
            </el-pagination>
        </div>
    </el-card>

    <!-- 新增用户区域 -->
    <el-dialog title="新增用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" width="50%" @close="updateDialogClosed">
        <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="updateForm.username" disabled></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
                <el-input v-model="updateForm.password"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="updateForm.email"></el-input>
            </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateUserInfo">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询信息实体
            queryInfo: {
                query: '',
                pageNum: 1,
                pageSize: 5,
            },
            // 用户列表
            userList: [],
            // 总记录数
            userCounts: 0,
            // 添加用户对话框
            addDialogVisible: false,
            // 添加表单信息
            addForm: {
                username:'',
                password:'',
                email:'',
            },
            // 修改用户信息
            updateForm: {
                username:'',
                password:'',
                email:'',
            },
            // 显示/隐藏修改用户栏
            updateDialogVisible: false,
            // 添加表单验证
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
            },
            // 修改表单验证
            updateFormRules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
            },
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            const {data:res} = await this.$http.get("alluser",{params:this.queryInfo});
            this.userList = res.data;
            this.userCounts = res.userCounts;
        },
        async showUpdateDialog(id) {
            const {data:res} = await this.$http.get("getupdateuser?id="+id);
            this.updateForm = res;
            this.updateDialogVisible = true;
        },
        updateDialogClosed() {
            this.$refs.updateFormRef.resetFields();
        },
        updateUserInfo() {
            this.$refs.updateFormRef.validate(async valid => {
                if (!valid) return;
                const {data:res} = await this.$http.post("updateuser",this.updateForm);
                if (res != "success") {
                return this.$message.error("操作失败！！！");
                }
                this.$message.success("操作成功！！！");
                this.updateDialogVisible = false;
                this.getUserList();
            })
        },
        // 根据主键删除信息
        async deleteUser(id) {
            const confirmResult = await this.$confirm("此操作将永久删除用户，是否继续？","提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).catch(err => err);
            if (confirmResult != "confirm") {
                return this.$message.info("已取消删除");
            }
            const {data:res} = await this.$http.delete("deleteuser?id="+id);
            if (res != "success") {
                return this.$message.error("删除失败！！！");
            }
            this.$message.success("删除成功！！！");
            this.getUserList();
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const {data:res} = await this.$http.post("adduser",this.addForm);
                if (res != "success") {
                return this.$message.error("操作失败！！！");
            }
            this.$message.success("操作成功！！！");
            this.addDialogVisible = false;
            this.getUserList();
            })
        },
        // 最大数
        handleSizeChange(newSize) {
            thsi.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        // pageNum的触发动作
        handleCurrentChange(newPage) {
            thsi.queryInfo.pageNum = newPage;
            this.getUserList();
        },
        async userStateChanged(val) {
            const {data:res} = await this.$http.put(`updateuserstate?id=${val.id}&state=${val.state}`);
            if (res != "success") {
                val.state = !val.state;
                return this.$message.error("操作失败！！！");
            }
            this.$message.success("操作成功！！！");
        },
    },
}
</script>

<style>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 17px;
}
</style>
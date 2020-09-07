<template>
    <div class="login_container">
        <!-- 登录窗口 -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form class="login_from" :rules="loginRules" :model="loginFrom" ref="loginFromRef" label-width="0px">
                <el-form-item prop="username">
                    <el-input v-model="loginFrom.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginFrom.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">提交</el-button>
                    <el-button type="info" @click="resetLoginFrom()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 表单数据对象
            loginFrom:{
                username:"admin",
                password:"123456"
            },
            // 验证对象
            // 校验分为3步：1添加校验属性，2添加校验规则，3将规则和元素的prop绑定
            loginRules:{
                // 校验用户名 
                username:[
                    { required: true, message: '用户名为必填项', trigger: 'blur' },// 必填项验证
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }// 长度验证
                ],
                // 校验密码
                password:[
                    { required: true, message: '密码为必填项', trigger: 'blur' },// 必填项验证
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }// 长度验证    
                ],
            },
        };
    },
    methods:{
        // 重置表单内容
        resetLoginFrom() {
            this.$refs.loginFromRef.resetFields();
        },
        // 登录方法
        login() {
            // 1.验证校验规则
            this.$refs.loginFromRef.validate(async valid => {
               if (!valid) return;// 验证失败
               const{data:res} = await this.$http.post("login",this.loginFrom);// 访问后台
               if(res.flag == "ok") {
                   window.sessionStorage.setItem("user",res.user) // 存储user对象到session
                   this.$message.success("操作成功！！！");// 信息提示
                   this.$router.push({path:"/home"});// 页面路由跳转
                   console.log(res.user);   
               } else {
                   this.$message.error("操作失败！！！");// 错误提示
               }
            })
        }
    }
}
</script>

<style lang="less" scoped>
// 根节点样式
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 5px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #eee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_from{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>
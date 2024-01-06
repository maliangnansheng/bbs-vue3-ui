<template>
  <div>
    <a-modal v-model:visible="$store.state.registerVisible" @ok="handleOk" :footer="null" :width="'320px'">
      <a-form ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" id="register-form-content">
        <h1 class="title">{{ $t("common.userRegister") }}</h1>
        <a-form-item has-feedback name="username">
          <a-input v-model:value="ruleForm.username"
                   autocomplete="off"
                   :maxLength="$store.state.userMaxLength"
                   :suffix="userNameNum + '/' + $store.state.userMaxLength"
                   @change="usernameChange"
                   :placeholder="$t('common.pleaseInputYourUsername')"
                   size="large">
            <!-- <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/> -->
            <template #prefix>
              <UserOutlined style="color: rgba(0,0,0,.25)"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item has-feedback name="password">
          <a-input v-model:value="ruleForm.password" type="password" autocomplete="off" :placeholder="$t('common.password')"
                   size="large">
            <!-- <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/> -->
            <template #prefix>
              <LockOutlined style="color: rgba(0,0,0,.25)"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item has-feedback name="confirmPassword">
          <a-input v-model:value="ruleForm.confirmPassword" type="password" autocomplete="off"
                   :placeholder="$t('common.confirmPassword')" size="large">
            <!-- <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/> -->
            <template #prefix>
              <LockOutlined style="color: rgba(0,0,0,.25)"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item style="padding-top: 5px;">
          <a-button type="primary" html-type="submit" class="login-form-button" size="large" @click="submitForm('ruleForm')">
            {{ $t("common.register") }}
          </a-button>
          Or
          <a @click="login">
            {{ $t("common.loginNow") }}
          </a>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>

<script>
  import loginService from "@/service/loginService";
  import userService from "@/service/userService";
  import { LockOutlined,UserOutlined } from '@ant-design/icons-vue';
  export default {
    data() {
      // 验证用户名
      let validateUsername = async (rule, value, callback) => {
        if (value === '') {
          // callback(new Error(this.$t('common.pleaseInputYourUsername')));
          return Promise.reject(this.$t('common.pleaseInputYourUsername'));
        } else {
          await this.isValidUser(value)
              .then(() => {
                // callback();
                return Promise.resolve();
              })
              .catch(err => {
                // callback(err.desc);
                return Promise.reject(err.desc);
              });
        }
      };
      // 验证密码
      let validatePassword = async (rule, value, callback) => {
        if (value === '') {
          // callback(new Error(this.$t('common.pleaseInputYourPassword')));
          return Promise.reject(this.$t('common.pleaseInputYourPassword'));
        } else {
          // callback();
          return Promise.resolve();
        }
      };
      // 验证确认密码
      let validateConfirmPassword = async (rule, value, callback) => {
        if (value !== this.ruleForm.password) {
          // callback(new Error(this.$t('common.passwordNotMatch')));
          return Promise.reject(this.$t('common.passwordNotMatch'));
        } else if (value === '') {
          // callback(new Error(this.$t('common.pleaseInputYourPassword')));
          return Promise.reject(this.$t('common.pleaseInputYourPassword'));
        } else {
          // callback();
          return Promise.resolve();
        }
      };

      return {
        userNameNum: 0,
        ruleForm: {
          username: '',
          password: '',
          confirmPassword: '',
        },
        rules: {
          username: [{validator: validateUsername, trigger: 'change'}],
          password: [{validator: validatePassword, trigger: 'change'}],
          confirmPassword: [{validator: validateConfirmPassword, trigger: 'change'}],
        },
        layout: {
          labelCol: {span: 0},
          wrapperCol: {span: 24},
        },
      };
    },
    components: {
      LockOutlined,
      UserOutlined,
    },
    methods: {
      usernameChange(value) {
        this.userNameNum = value.target.value.length;
      },

      // 隐藏登录框
      handleOk() {
        this.$store.state.registerVisible = false;
      },

      async submitForm(formName) {
        console.log("form", this.$refs.ruleForm,formName);
        try {
          await this.$refs[formName].validate()
        } catch (error) {
          console.log("error", error);
          // return
        }
        //   .then(valid => {
        //   console.log("valid", valid);
        //   // if (valid) {
        //     loginService.register({name:this.ruleForm.username, password: this.ruleForm.password})
        //         .then(res => {
        //           // 刷新当前页面
        //           this.$router.go(0);
        //         })
        //         .catch(err => {
        //           this.$message.error(err.desc);
        //         });
        //   // } else {
        //   //   return false;
        //   // }
        // });

        loginService.register({name:this.ruleForm.username, password: this.ruleForm.password})
          .then(res => {
            // 刷新当前页面
            this.$router.go(0);
          })
          .catch(err => {
            this.$message.error(err.desc);
          });
      },

      // 直接登录
      login() {
        this.$store.state.registerVisible = false;
        this.$store.state.loginVisible = true;
      },

      // 用户判重
      isValidUser(username) {
        return new Promise((resolve, reject) => {
          userService.isValidUser({username: username})
              .then(res => {
                if (res.code === 0) {
                  resolve(res);
                } else {
                  throw res;
                }
              })
              .catch(err => {
                reject(err);
              });
        });
      },

    },

  }
</script>

<style>
  #register-form-content .title {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 15px;
  }

  #register-form-content .ant-input-affix-wrapper .ant-input {
    font-size: 14px;
  }

  #register-form-content .login-form-forgot {
    float: right;
  }

  #register-form-content .login-form-button {
    width: 100%;
  }

  #register-form-content .ant-form-item {
    margin-bottom: 10px;
  }
</style>
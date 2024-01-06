<template>
  <div>
    <a-modal v-model:visible="$store.state.emailResetPasswordVisible" @ok="handleOk" :footer="null" :width="'320px'">
      <a-form ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" id="emailResetPassword-form-content">
        <h1 class="title">{{ $t("common.emailResetPassword") }}</h1>
        <a-form-item has-feedback name="email">
          <a-input v-model:value="ruleForm.email"
                   :placeholder="$t('common.email')"
                   size="large">
            <!-- <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)"/> -->
            <MailOutlined fill="rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item name="code">
          <a-input-search v-model:value="ruleForm.code" :placeholder="$t('common.validateCode')" size="large" @search="onSearch">
            <template #enterButton>
              <a-button slot="enterButton">
                {{ $t('common.getValidateCode') }}
              </a-button>
            </template>
            <!-- <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0,0,0,.25)"/> -->
            <SafetyCertificateOutlined fill="rgba(0,0,0,.25)"/>
          </a-input-search>
        </a-form-item>
        <a-form-item has-feedback name="newPassword">
          <a-input v-model:value="ruleForm.newPassword" type="password"
                   :placeholder="$t('common.newPassword')" size="large">
            <!-- <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/> -->
            <LockOutlined fill="rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item style="padding-top: 5px;">
          <a-button type="primary" html-type="submit" class="login-form-button" size="large" @click="submitForm('ruleForm')">
            {{ $t("common.saveChanges") }}
          </a-button>
          <a @click="mobileResetPassword">
            {{ $t("common.mobileResetPassword") }}
          </a>
          <a @click="login" style="float: right;">
            {{ $t("common.loginNow") }}
          </a>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>

<script>
  import userService from "@/service/userService";
  import { MailOutlined,SafetyCertificateOutlined,LockOutlined } from '@ant-design/icons-vue';

  export default {
    data() {
      // 验证邮箱地址
      let validateEmail = async (rule, value, callback) => {
        if (value === '') {
          // callback(new Error(this.$t('common.pleaseInputYourEmail')));
          return Promise.reject(this.$t('common.pleaseInputYourEmail'));
        } else {
          if (!this.emailReg.test(value)) {
            // callback(this.$t("common.emailInvalid"));
            return Promise.reject(this.$t('common.emailInvalid'));
          } else {
            // callback();
            return Promise.resolve();
          }
        }
      };

      // 验证验证码
      let validateCode = async (rule, value, callback) => {
        if (value === '') {
          // callback(new Error(this.$t('common.needVerifyCode')));
          return Promise.reject(this.$t('common.needVerifyCode'));
        } else {
          // callback();
          return Promise.resolve();
        }
      };

      // 验证密码
      let validateNewPassword = async (rule, value, callback) => {
        if (value === '') {
          // callback(new Error(this.$t('common.pleaseInputYourNewPassword')));
          return Promise.reject(this.$t('common.pleaseInputYourNewPassword'));
        } else {
          // callback();
          return Promise.resolve();
        }
      };

      return {
        emailReg: /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
        ruleForm: {
          email: '',
          code: '',
          newPassword: '',
        },
        rules: {
          email: [{validator: validateEmail, trigger: 'change'}],
          code: [{validator: validateCode, trigger: 'change'}],
          newPassword: [{validator: validateNewPassword, trigger: 'change'}],
        },
        layout: {
          labelCol: {span: 0},
          wrapperCol: {span: 24},
        },
      };
    },
    components: {
      MailOutlined,
      SafetyCertificateOutlined,
      LockOutlined,
    },
    methods: {
      onSearch(value) {
        if (this.emailReg.test(this.ruleForm.email)) {
          this.isEmailExist(this.ruleForm.email);
        } else {
          this.$message.warning(this.$t("common.emailInvalid"));
        }
      },

      // 判断邮箱是否已经绑定
      isEmailExist(email) {
        return userService.isEmailExist(email)
            .then((res) => {
              if (res.data) {
                // 发送验证码
                this.sendEmailVerifyCode(email);
              } else {
                this.$message.warning(this.$t("common.emailNumberNotBound"));
              }
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      },

      // 发送验证码
      sendEmailVerifyCode(email) {
        userService.sendEmailVerifyCode({ email: email })
            .then(() => {
              this.$message.success(this.$t("common.verifyCodeSendSuccessed"));
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      },

      // 隐藏登录框
      handleOk() {
        this.$store.state.emailResetPasswordVisible = false;
      },

      submitForm(formName) {
        console.log("form", this.$refs[formName]);
        this.$refs[formName].validate().then(valid => {
          if (valid) {
            userService.emailResetPassword({email:this.ruleForm.email, code: this.ruleForm.code, newPassword: this.ruleForm.newPassword})
                .then(res => {
                  if (res.data) {
                    // 密码重置成功，请重新登录
                    this.$message.success(this.$t("common.pleaseLoginAgain"));
                    this.login();
                  } else {
                    this.$message.warning(err.desc);
                  }
                })
                .catch(err => {
                  this.$message.error(err.desc);
                });
          } else {
            return false;
          }
        });
      },

      // 手机重置密码
      mobileResetPassword() {
        this.$store.state.emailResetPasswordVisible = false;
        this.$store.state.mobileResetPasswordVisible = true;
        this.$store.state.loginVisible = false;
      },

      // 直接登录
      login() {
        this.$store.state.emailResetPasswordVisible = false;
        this.$store.state.mobileResetPasswordVisible = false;
        this.$store.state.loginVisible = true;
      },
    },

  }
</script>

<style>
  #emailResetPassword-form-content .title {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 15px;
  }

  #emailResetPassword-form-content .ant-input-affix-wrapper .ant-input {
    font-size: 14px;
  }

  #emailResetPassword-form-content .login-form-forgot {
    float: right;
  }

  #emailResetPassword-form-content .login-form-button {
    width: 100%;
  }

  #emailResetPassword-form-content .ant-form-item {
    margin-bottom: 10px;
  }
</style>
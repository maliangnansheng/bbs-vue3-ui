<template>
  <a-modal
      :centered="true"
      :destroyOnClose="true"
      :maskClosable="true"
      width="360px"
      :confirmLoading="loading"
      @cancel="handleCancel"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okText="$t('common.bind')"
      @ok="handleOk"
      :bodyStyle="{ padding: '5px 24px' }"
      :visible="visible"
  >
    <div class="ant-modal-header" style="padding-left:0;padding-right:0"><div id="rcDialogTitle0" class="ant-modal-title">{{ $t('common.bindEmail') }}</div></div>
    <a-form :model="form" :rules="rule" ref="form">
      <a-form-item class="user-config-form-item" name="email">
        <a-input
            :placeholder="$t('common.email')"
            v-model:value="form.email"
        ></a-input>
        <a-button @click="sendEmailVerifyCode">{{ $t("common.getValidateCode") }}</a-button>
      </a-form-item>
    </a-form>
    <a-form v-show="sentVerifyCode" :rules="verifyRules" :model="verifyForm" ref="verifyForm">
      <a-form-item class="user-config-form-item" name="code">
        <a-input
            :placeholder="$t('common.validateCode')"
            v-model:value="verifyForm.code"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import userService from "@/service/userService";

  export default {
    props: {
      visible: {type: Boolean, default: false},
    },

    data() {
      return {
        form: {},
        loading: false,
        // sentVerifyCode 标志位,验证码是否发送成功
        sentVerifyCode: false,
        emailReg: /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
        rules: {
          email: [{validator: this.validator, trigger: 'blur'}],
        },
        verifyRules: {
          code: [{required: true, message: this.$t('common.needVerifyCode'), trigger: 'blur'}],
        },
        verifyForm:{}
      };
    },

    methods: {
      // 用户点击确定后先校验，校验通过在发送请求绑定邮箱
      handleOk() {
        let email, code;
        this.$refs.form.validateFields().then(values => {
          // 输入正确就拿到用户输入的邮箱
          email = this.form.email;
        });
        this.$refs.verifyForm.validateFields().then(values => {
           // 输入正确就拿到验证码
          code = this.verifyForm.code;
        });

        if (!email) {
          return;
        }
        // 如果用户还没有点击发送验证码也需要提示用户
        if (!this.sentVerifyCode) {
          this.$message.warning(this.$t("common.sendVerifyCodeFirst"));
          return;
        }
        if (!code) {
          return;
        }
        // 校验成功后发送请求绑定邮箱
        userService.bindEmail({email, code})
            .then(() => {
              this.$message.success(this.$t("common.bindEmailSuccessed"));
              this.$emit("refresh");
              this.handleCancel();
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      },

      // 点击取消需要重置数据
      handleCancel() {
        console.log("this.$refs.form", this.$refs.form);
        this.$refs.form.resetFields();
        this.$refs.verifyForm.resetFields();
        this.sentVerifyCode = false;
        this.$emit("closeModal");
      },

      // 发送验证码
      sendEmailVerifyCode() {
        this.$refs.form.validateFields().then(values => {
          userService
                .sendEmailVerifyCode(values)
                .then(() => {
                  this.$message.success(this.$t("common.verifyCodeSendSuccessed"));
                  this.sentVerifyCode = true;
                })
                .catch(err => {
                  this.$message.error(err.desc);
                });
        });
      },

      // 自定义校验规则
      async validator(rule, value, callback) {
        if (!value) {
          // callback(this.$t("common.email") + this.$t("common.required"));
          // return;
          return Promise.reject(this.$t("common.email") + this.$t("common.required"));
        }
        if (!this.emailReg.test(value)) {
          // callback(this.$t("common.emailInvalid"));
          // return;
          return Promise.reject(this.$t("common.emailInvalid"));
        }
        const email = {email: value};
        this.isValidEmail(email)
            .then(() => {
              // callback();
              return Promise.resolve();
            })
            .catch(reason => {
              if (reason.desc) {
                // callback(reason.desc);
                return Promise.reject(this.$t(reason.desc));
              }
              // callback();
              return Promise.resolve();
            });
      },

      // 发送数据判断该邮箱是否已经被绑定
      isValidEmail(email) {
        return new Promise((resolve, reject) => {
          userService.isValidEmail(email)
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
      }
    },

    beforeCreate() {
      // this.form = this.$form.createForm(this){};
      // this.verifyForm = this.$form.createForm(this, "verify") { };
      this.form = {};
      this.verifyForm = {};
    }
  };
</script>

<style scoped>
  .input-item:first-child {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  input {
    width: 200px;
  }

  button {
    margin-left: 10px;
  }
</style>
<style>
  .bind-email-title .ant-form-item-children {
    display: flex;
  }
</style>

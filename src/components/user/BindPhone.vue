<template>
  <a-modal
      :centered="true"
      :destroyOnClose="true"
      :maskClosable="true"
      width="360px"
      :confirmLoading="loading"
      @cancel="handleCancel"
      :cancel-button-props="{ style: { display: 'none' } }"
      :okText="$t('common.bind')"
      :bodyStyle="{ padding: '5px 24px' }"
      @ok="handleOk"
      :visible="visible"
  >
  <div class="ant-modal-header" style="padding-left:0;padding-right:0"><div id="rcDialogTitle0" class="ant-modal-title">{{ $t('common.bindPhone') }}</div></div>
    <a-form :model="form" :rules="rule" ref="form">
      <a-form-item class="user-config-form-item" name="phone">
        <a-input
            :placeholder="$t('common.phone')"
            v-model:value="form.phone"
        ></a-input>
        <a-button @click="sendSmsVerifyCode">{{ $t("common.getValidateCode") }}</a-button>
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
        form:  {},
        loading: false,
        // sentVerifyCode 标志位,验证码是否发送成功
        sentVerifyCode: false,
        phoneReg: /^((13[0-9])|(15[^4,\D])|(14[57])|(17[0])|(17[7])|(18[0,0-9]))\d{8}$/,
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
      handleOk() {
        // 请求前先做校验  校验合法再做请求
        let phone, code;
        this.$refs.form.validateFields().then(values => {
          phone = values.phone;
        });
        this.$refs.verifyForm.validateFields().then(values => {
          code = values.code;
        });
        if (!this.form.phone) {
          return;
        }
        if (!this.sentVerifyCode) {
          this.$message.warning(this.$t("common.sendVerifyCodeFirst"));
          return;
        }
        if (!this.verifyForm.code) {
          return;
        }
        console.log("code",code,"phone",phone)
        // 校验通过后发送请求绑定手机
        userService.bindPhone({phone:this.form.phone, code:this.verifyForm.code})
            .then(() => {
              this.$message.success(this.$t("common.bindPhoneSuccessed"));
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
      sendSmsVerifyCode() {
        this.$refs.form.validateFields().then(values => {
          userService.sendSmsVerifyCode(values)
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
          // callback(this.$t("common.phone") + this.$t("common.required"));
          // return;
          return Promise.reject(this.$t("common.phone") + this.$t("common.required"));
        }
        if (!this.phoneReg.test(value)) {
          // callback(this.$t("common.phoneInvalid"));
          // return;
          return Promise.reject(this.$t("common.phoneInvalid"));
        }
        const phone = {phone: value};
        this.isValidPhone(phone)
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

      // 发送数据判断该手机号是否已经被绑定
      isValidPhone(phone) {
        return new Promise((resolve, reject) => {
          userService.isValidPhone(phone)
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
      // this.form = this.$form.createForm(this);
      // this.verifyForm = this.$form.createForm(this, "verify");
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

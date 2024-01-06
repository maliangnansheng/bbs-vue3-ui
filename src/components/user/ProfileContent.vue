<template>
  <div id="profile-content" v-if="!spinning">
    <a-row>
      <a-col :span="$store.state.collapsed ? 24 :18" style="background: #fff;">
        <div class="left">
          <a-form ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" labelAlign="left">
            <p>{{ $t('common.personalInformation') }}</p>
            <a-divider/>
            <!-- 用户名 -->
            <a-form-item has-feedback name="username" :label="$t('common.username2')">
              <a-input v-model:value="ruleForm.username"
                      :maxLength="$store.state.userMaxLength"
                      :suffix="ruleForm.userNameNum + '/' + $store.state.userMaxLength"
                      @change="usernameChange"
                      autocomplete="off"
                      :placeholder="$t('common.fillInYourUsername')"/>
            </a-form-item>
            <!-- 职位 -->
            <a-form-item has-feedback name="position" :label="$t('common.position')">
              <a-input v-model:value="ruleForm.position"
                      :suffix="ruleForm.positionNum + '/50'"
                      @change="commonChange"
                      :maxLength="50"
                      :placeholder="$t('common.fillInYourPosition')"/>
            </a-form-item>
            <!-- 公司 -->
            <a-form-item has-feedback name="company" :label="$t('common.company')">
              <a-input v-model:value="ruleForm.company"
                      :suffix="ruleForm.companyNum + '/50'"
                      @change="commonChange"
                      :maxLength="50"
                      :placeholder="$t('common.fillInYourCompany')"/>
            </a-form-item>
            <!-- 个人主页 -->
            <a-form-item has-feedback name="homePage" :label="$t('common.homePage')">
              <a-input v-model:value="ruleForm.homePage"
                      :suffix="ruleForm.homePageNum + '/100'"
                      @change="commonChange"
                      :maxLength="100"
                      :placeholder="$t('common.fillInYourHomePage')"
                      class="homePage"/>
            </a-form-item>
            <!-- 个人介绍 -->
            <a-form-item has-feedback name="intro" :label="$t('common.selfIntro')">
              <a-textarea v-model:value="ruleForm.intro"
                          :suffix="ruleForm.introNum + '/150'"
                          @change="commonChange"
                          :maxLength="150"
                          :placeholder="$t('common.fillInYour7788')"
                          :auto-size="{ minRows: 5, maxRows: 8 }"
                          class="intro"/>
            </a-form-item>
            <!-- 按钮 -->
            <a-form-item>
              <a-divider style="margin: 10px 0;"></a-divider>
              <a-form-item class="form-item-submit">
                <a-button type="primary" html-type="submit" @click="submitForm('ruleForm')">
                  {{ $t('common.saveChanges') }}
                </a-button>
              </a-form-item>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
      <a-col :span="$store.state.collapsed ? 24 :6" style="background: #fff;">
        <div class="right">
          <a-col class="avatar-col">
            <div class="avatar">
              <div @click="openUploadModal" class="avatar-container">
                <a-avatar
                    v-if="true"
                    style="cursor: pointer" :size="120" icon="user"
                    :src="$store.state.picture ? $store.state.picture : require('@/assets/img/default_avatar.png')"/>
                <img
                    v-else
                    src="@/assets/img/default_avatar.png"
                    width="120"
                    style="border-radius: 50%"/>
                <div class="avatar-wrapper">
                  <!-- <a-icon style="font-size: 38px" type="plus-circle"/> -->
                  <PlusCircleOutlined style="font-size: 38px"/>
                  <span style="line-height: 40px">{{
                      $t("common.clickToChangeAvatar")
                    }}</span>
                </div>
              </div>
            </div>
            <div class="avatar-tip">
              <div>{{ $t("common.avatarTip")[0] }}</div>
              <div>{{ $t("common.avatarTip")[1] }}</div>
            </div>
          </a-col>
          <UploadModal
              :visible="visible"
              @closeModal="closeModal"
              @refresh="refresh"/>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import UploadModal from "@/components/user/UploadModal";
  import userService from "@/service/userService";
  import loginService from "@/service/loginService";
  import { PlusCircleOutlined } from '@ant-design/icons-vue';

  export default {
    name: "ProfileContent",

    components: {UploadModal,PlusCircleOutlined},

    data() {
      // 验证用户名
      let validateUsername = async (rule, value, callback) => {
        if (value === '') {
          // callback(new Error(this.$t('common.pleaseInputYourUsername')));
          return Promise.reject(this.$t('common.pleaseInputYourUsername'));
        } else {
          this.isValidUser(value)
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

      // 验证个人主页地址
      let validateHomePage = async (rule, value, callback) => {
        if (value !== '' && !this.urlReg.test(value)) {
          // callback(new Error(this.$t('common.homePageUrl')));
          return Promise.reject(this.$t('common.homePageUrl'));
        } else {
          // callback();
          return Promise.resolve();
        }
      };

      return {
        urlReg: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/,
        // 加载中...
        spinning: true,
        visible: false,

        ruleForm: {
          userId: this.$store.state.userId,
          username: '',
          userNameNum: 0,
          // 职业
          position: '',
          positionNum: 0,
          // 公司
          company: '',
          companyNum: 0,
          // 个人主页
          homePage: '',
          homePageNum: 0,
          // 个人介绍
          intro: '',
          introNum: 0,
          // 组织架构id
          orgId: Number,
        },
        rules: {
          username: [{validator: validateUsername, trigger: 'change'}],
          homePage: [{validator: validateHomePage, trigger: 'change'}],
        },
        layout: {
          labelCol: {span: this.$store.state.collapsed ? 24 : 3},
          wrapperCol: {span: this.$store.state.collapsed ? 24 : 21},
        },
      }
    },

    methods: {
      // 获取用户信息
      getUserInfo() {
        userService.getUserInfo({userId: this.ruleForm.userId})
            .then(res => {
              this.spinning = false;
              this.ruleForm.username = res.data.name,
              this.ruleForm.userNameNum = res.data.name.length;

              this.ruleForm.position = res.data.position ? res.data.position : '';
              this.ruleForm.positionNum = res.data.position ? res.data.position.length : 0;

              this.ruleForm.company = res.data.company ? res.data.company : '';
              this.ruleForm.companyNum = res.data.company ? res.data.company.length : 0;

              this.ruleForm.homePage = res.data.homePage ? res.data.homePage : '';
              this.ruleForm.homePageNum = res.data.homePage ? res.data.homePage.length : 0;

              this.ruleForm.intro = res.data.intro;
              this.ruleForm.introNum = res.data.intro ? res.data.intro.length : 0;

              this.ruleForm.orgId = res.data.orgId;
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      },

      // 更新用户基本信息
      updateUserBasicInfo(data) {
        userService.updateUserBasicInfo(data)
            .then(res => {
              this.$message.success(this.$t('common.saveSuccessed'));
              this.getUserInfo();
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      },

      async submitForm(formName) {

        try {
          await this.$refs[formName].validate()
        } catch (error) {
          console.log("error", error);
          // return
        }

        // this.$refs[formName].validate(valid => {
        //   if (valid) {
        //     const data = {
        //       // id: this.ruleForm.userId,
        //       name: this.ruleForm.username,
        //       position: this.ruleForm.position,
        //       company: this.ruleForm.company,
        //       homePage: this.ruleForm.homePage,
        //       intro: this.ruleForm.intro,
        //       orgId: this.ruleForm.orgId,
        //     };
        //     this.updateUserBasicInfo(data);
        //   } else {
        //     return false;
        //   }
        // });
        const data = {
          // id: this.ruleForm.userId,
          name: this.ruleForm.username,
          position: this.ruleForm.position,
          company: this.ruleForm.company,
          homePage: this.ruleForm.homePage,
          intro: this.ruleForm.intro,
          orgId: this.ruleForm.orgId,
        };
        this.updateUserBasicInfo(data);
      },

      usernameChange(value) {
        this.ruleForm.userNameNum = value.target.value.length;
      },
      commonChange() {
        this.ruleForm.positionNum = this.ruleForm.position.length;
        this.ruleForm.companyNum = this.ruleForm.company.length;
        this.ruleForm.homePageNum = this.ruleForm.homePage.length;
        this.ruleForm.introNum = this.ruleForm.intro.length;
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

      refresh() {
        this.getUserInfo();
      },

      // 打开上传头像窗口
      openUploadModal() {
        this.visible = true;
      },

      // 关毕上传头像窗口
      closeModal() {
        this.visible = false;
      },

      // 路由到首页页面
      routerFrontPage() {
        this.$router.push("/");
      },
    },

    mounted() {
      if (this.ruleForm.userId) {
        this.getUserInfo();
      } else {
        this.routerFrontPage();
      }
    }

  }
</script>

<style lang="less">
  #profile-content {
    background: #fff;

    .left {
      padding: 30px;

      p {
        font-weight: 600;
        font-size: 20px;
        line-height: 18px;
        color: #333;
      }
    }
  }

  #profile-content .avatar-col {
    .avatar {
      margin-top: 60px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;

      .avatar-container {
        cursor: pointer;
        position: relative;
        height: 120px;
        width: 120px;
        text-align: center;

        .avatar-wrapper {
          display: none;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: white;
          position: absolute;
          top: 0;
          border-radius: 50%;
          width: 120px;
          height: 120px;
          background-color: rgba(29, 33, 41, 0.5);
        }
      }

      .avatar-container:hover {
        .avatar-wrapper {
          display: flex;
        }
      }
    }

    .avatar-tip {
      text-align: center;
      padding: 24px 0;
      color: #86909c;
    }
  }

  #profile-content .ant-input {
    padding-right: 50px;
  }
  #profile-content .homePage .ant-input {
    padding-right: 70px;
  }
  #profile-content textarea.intro.ant-input {
    padding-right: 0!important;
  }
</style>
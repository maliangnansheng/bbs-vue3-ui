<template>
  <div class="profile-view">
    <a-spin :spinning="loading">
      <a-row :gutter="0">
        <a-col :span="app.collapsed ? 24 : 18">
          <div class="profile-form">
            <p class="section-title">{{ $t('common.personalInformation') }}</p>
            <a-divider />

            <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-item name="username" :label="$t('common.username2')">
                <a-input
                  v-model:value="form.username"
                  :maxlength="app.userMaxLength"
                  :placeholder="$t('common.fillInYourUsername')"
                  autocomplete="off"
                >
                  <template #suffix>
                    <span class="field-counter">{{ form.username.length }}/{{ app.userMaxLength }}</span>
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item name="position" :label="$t('common.position')">
                <a-input v-model:value="form.position" :maxlength="50" :placeholder="$t('common.fillInYourPosition')">
                  <template #suffix><span class="field-counter">{{ form.position.length }}/50</span></template>
                </a-input>
              </a-form-item>

              <a-form-item name="company" :label="$t('common.company')">
                <a-input v-model:value="form.company" :maxlength="50" :placeholder="$t('common.fillInYourCompany')">
                  <template #suffix><span class="field-counter">{{ form.company.length }}/50</span></template>
                </a-input>
              </a-form-item>

              <a-form-item name="homePage" :label="$t('common.homePage')">
                <a-input v-model:value="form.homePage" :maxlength="100" :placeholder="$t('common.fillInYourHomePage')">
                  <template #suffix><span class="field-counter">{{ form.homePage.length }}/100</span></template>
                </a-input>
              </a-form-item>

              <a-form-item name="intro" :label="$t('common.selfIntro')">
                <a-textarea
                  v-model:value="form.intro"
                  :maxlength="150"
                  :placeholder="$t('common.fillInYour7788')"
                  :auto-size="{ minRows: 5, maxRows: 8 }"
                />
                <div class="field-counter textarea-counter">{{ form.intro.length }}/150</div>
              </a-form-item>

              <a-divider style="margin: 10px 0" />
              <div class="form-actions">
                <a-button type="primary" :loading="saving" @click="submit">{{ $t('common.saveChanges') }}</a-button>
              </div>
            </a-form>
          </div>
        </a-col>

        <a-col :span="app.collapsed ? 24 : 6">
          <div class="avatar-panel">
            <div class="avatar-wrapper" @click="avatarOpen = true">
              <a-avatar :size="120" :src="user.picture || defaultAvatar" />
              <div class="avatar-mask">
                <PlusCircleOutlined />
                <span>{{ $t('common.clickToChangeAvatar') }}</span>
              </div>
            </div>
            <div class="avatar-tip">
              <div>{{ $t('common.avatarTip')[0] }}</div>
              <div>{{ $t('common.avatarTip')[1] }}</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>

    <AvatarUploadModal v-model:open="avatarOpen" @refresh="load" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import AvatarUploadModal from '@/components/user/AvatarUploadModal.vue'
import userApi from '@/api/user'
import { message, toastError } from '@/utils/feedback'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { translate as t } from '@/i18n'
import defaultAvatar from '@/assets/img/default_avatar.png'

const URL_REG = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/

const app = useAppStore()
const user = useUserStore()

const formRef = ref(null)
const loading = ref(true)
const saving = ref(false)
const avatarOpen = ref(false)
const orgId = ref(null)

const form = reactive({
  username: '',
  position: '',
  company: '',
  homePage: '',
  intro: ''
})

const labelCol = computed(() => ({ span: app.collapsed ? 24 : 4 }))
const wrapperCol = computed(() => ({ span: app.collapsed ? 24 : 19 }))

const rules = computed(() => ({
  username: [
    { required: true, message: t('common.pleaseInputYourUsername'), trigger: 'blur' },
    {
      validator: async (_rule, value) => {
        if (!value) throw new Error(t('common.pleaseInputYourUsername'))
        try {
          await userApi.isValidUser({ username: value })
        } catch (error) {
          throw new Error(error.desc || t('common.pleaseInputYourUsername'), { cause: error })
        }
      },
      trigger: 'blur'
    }
  ],
  homePage: [
    {
      validator: async (_rule, value) => {
        if (value && !URL_REG.test(value)) throw new Error(t('common.homePageUrl'))
      },
      trigger: 'blur'
    }
  ]
}))

async function load() {
  await user.ensureUser()
  if (!user.userId) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await userApi.getUserInfo({ userId: user.userId })
    const data = res.data || {}
    form.username = data.name || ''
    form.position = data.position || ''
    form.company = data.company || ''
    form.homePage = data.homePage || ''
    form.intro = data.intro || ''
    orgId.value = data.orgId ?? null
    user.picture = data.picture || user.picture
  } catch (error) {
    toastError(error, '用户信息加载失败')
  } finally {
    loading.value = false
  }
}

async function submit() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    await userApi.updateUserBasicInfo({
      name: form.username.trim(),
      position: form.position,
      company: form.company,
      homePage: form.homePage,
      intro: form.intro,
      orgId: orgId.value
    })
    message.success(t('common.saveSuccessed'))
    await load()
  } catch (error) {
    toastError(error, '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style lang="less" scoped>
.profile-form {
  padding: 20px 24px;
}

.section-title {
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 600;
}

.field-counter {
  color: #bfbfbf;
  font-size: 12px;
}

.textarea-counter {
  margin-top: 4px;
  text-align: right;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.avatar-panel {
  padding: 24px 16px;
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;

  .avatar-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 13px;
    opacity: 0;
    transition: opacity 0.2s;

    .anticon {
      font-size: 28px;
      margin-bottom: 4px;
    }
  }

  &:hover .avatar-mask {
    opacity: 1;
  }
}

.avatar-tip {
  margin-top: 12px;
  color: #8a919f;
  font-size: 12px;
}
</style>

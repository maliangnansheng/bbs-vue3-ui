<template>
  <a-modal
    :open="open"
    :title="isEdit ? $t('common.resourceEdit') : $t('common.resourceAdd')"
    :width="520"
    centered
    :confirm-loading="submitting"
    :ok-text="$t('common.sureAndAdd')"
    @ok="submit"
    @cancel="close"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
      <a-form-item name="resourceName" :label="$t('common.resourceName')">
        <a-input v-model:value="form.resourceName" :placeholder="$t('common.pleaseResource')" :maxlength="50" />
      </a-form-item>
      <a-form-item name="category" :label="$t('common.resourceCategory')">
        <a-input v-model:value="form.category" :placeholder="$t('common.pleaseCategory')" :maxlength="20" />
      </a-form-item>
      <a-form-item name="desc" :label="$t('common.resourceDesc')">
        <a-input v-model:value="form.desc" :placeholder="$t('common.pleaseDesc')" :maxlength="100" />
      </a-form-item>
      <a-form-item name="link" :label="$t('common.resourceLink')">
        <a-input v-model:value="form.link" :placeholder="$t('common.pleaseLink')" :maxlength="200" />
      </a-form-item>
      <a-form-item :label="$t('common.resourceLogo')">
        <LogoUploader v-model:url="form.logo" :uploader="resourceApi.uploadResourceLogo" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import LogoUploader from '@/components/common/LogoUploader.vue'
import resourceApi from '@/api/resource'
import { message, toastError } from '@/utils/feedback'
import { translate as t } from '@/i18n'

const props = defineProps({
  open: { type: Boolean, default: false },
  resource: { type: Object, default: null }
})
const emit = defineEmits(['update:open', 'saved'])

const formRef = ref(null)
const submitting = ref(false)
const form = reactive({ resourceName: '', category: '', desc: '', link: '', logo: '' })

const isEdit = computed(() => Boolean(props.resource && props.resource.id))
const rules = computed(() => ({
  resourceName: [{ required: true, message: t('common.pleaseResource'), trigger: 'blur' }],
  category: [{ required: true, message: t('common.pleaseCategory'), trigger: 'blur' }],
  desc: [{ required: true, message: t('common.pleaseDesc'), trigger: 'blur' }],
  link: [{ required: true, message: t('common.pleaseLink'), trigger: 'blur' }]
}))

watch(
  () => props.open,
  (value) => {
    if (!value) return
    form.resourceName = props.resource?.resourceName || ''
    form.category = props.resource?.category || ''
    form.desc = props.resource?.desc || ''
    form.link = props.resource?.link || ''
    form.logo = props.resource?.logo || ''
  }
)

function close() {
  emit('update:open', false)
}

async function submit() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  if (!form.logo) {
    message.warning('请上传资源 Logo')
    return
  }
  submitting.value = true
  try {
    const data = {
      resourceName: form.resourceName.trim(),
      category: form.category.trim(),
      desc: form.desc.trim(),
      link: form.link.trim(),
      logo: form.logo
    }
    if (isEdit.value) {
      data.id = props.resource.id
      await resourceApi.update(data)
    } else {
      await resourceApi.create(data)
    }
    message.success(isEdit.value ? '更新成功' : '添加成功')
    emit('saved')
    close()
  } catch (error) {
    toastError(error, isEdit.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}
</script>

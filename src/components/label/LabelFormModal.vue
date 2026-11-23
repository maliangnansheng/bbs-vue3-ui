<template>
  <a-modal
    :open="open"
    :title="isEdit ? $t('common.labelEdit') : $t('common.labelAdd')"
    :width="480"
    centered
    :confirm-loading="submitting"
    :ok-text="$t('common.sureAndAdd')"
    @ok="submit"
    @cancel="close"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
      <a-form-item name="labelName" :label="$t('common.labelName')">
        <a-input v-model:value="form.labelName" :placeholder="$t('common.pleaseLabel')" :maxlength="20" />
      </a-form-item>
      <a-form-item :label="$t('common.labelLogo')">
        <LogoUploader v-model:url="form.logo" :uploader="labelApi.uploadLabelLogo" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import LogoUploader from '@/components/common/LogoUploader.vue'
import labelApi from '@/api/label'
import { message, toastError } from '@/utils/feedback'
import { translate as t } from '@/i18n'

const props = defineProps({
  open: { type: Boolean, default: false },
  // 传入待编辑的标签，为空表示新增
  label: { type: Object, default: null }
})
const emit = defineEmits(['update:open', 'saved'])

const formRef = ref(null)
const submitting = ref(false)
const form = reactive({ labelName: '', logo: '' })

const isEdit = computed(() => Boolean(props.label && props.label.id))
const rules = computed(() => ({
  labelName: [{ required: true, message: t('common.pleaseLabel'), trigger: 'blur' }]
}))

watch(
  () => props.open,
  (value) => {
    if (!value) return
    form.labelName = props.label?.labelName || ''
    form.logo = props.label?.logo || ''
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
    message.warning('请上传标签 Logo')
    return
  }
  submitting.value = true
  try {
    const data = { labelName: form.labelName.trim(), logo: form.logo }
    if (isEdit.value) {
      data.id = props.label.id
      await labelApi.update(data)
    } else {
      await labelApi.create(data)
    }
    message.success(isEdit.value ? '标签更新成功' : '标签添加成功')
    emit('saved')
    close()
  } catch (error) {
    toastError(error, isEdit.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}
</script>

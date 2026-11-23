<template>
  <div class="cover-upload">
    <label :for="inputId" class="cover-upload-label">
      <img v-if="preview" :src="preview" alt="文章封面" class="cover-image" />
      <img v-else src="@/assets/img/avatar-bg.png" alt="上传封面" class="cover-placeholder" />
    </label>
    <input :id="inputId" type="file" accept=".jpg, .jpeg, .png" class="cover-input" @change="onChange" />
    <p class="cover-tip">{{ $t('common.avatarTip')[0] }}，{{ $t('common.avatarTip')[1] }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'change'])

const inputId = `cover-${Math.random().toString(36).slice(2, 9)}`
const preview = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    preview.value = value
  }
)

function onChange(event) {
  const file = event.target.files && event.target.files[0]
  if (!file) return
  preview.value = URL.createObjectURL(file)
  emit('update:modelValue', preview.value)
  emit('change', file)
}
</script>

<style lang="less" scoped>
.cover-upload-label {
  display: block;
  width: 100%;
  cursor: pointer;
}

.cover-image,
.cover-placeholder {
  display: block;
  width: 100%;
  border-radius: 4px;
}

/* .ant-form input[type='file'] 会覆盖 display:none，这里提高优先级 */
.cover-upload .cover-input {
  display: none;
}

.cover-tip {
  margin: 4px 0 0;
  color: #8a919f;
  font-size: 12px;
}
</style>

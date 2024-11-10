<script setup lang="ts">

interface Props {
  modelValue?: boolean
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: 'default',
  disabled: false
})

const emit = defineEmits<Emits>()

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}
</script>

<template>
  <label
      class="switch"
      :class="[
      `switch--${size}`,
      { 'switch--disabled': disabled }
    ]"
  >
    <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
    />
    <span class="slider"/>
  </label>
</template>

<style scoped lang="scss">
.switch {
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;

  // 尺寸变体
  &--small {
    font-size: 14px;
  }

  &--default {
    font-size: 17px;
  }

  &--large {
    font-size: 20px;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .slider {
      cursor: not-allowed;
    }
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f4f4f5;
  transition: .4s;
  border-radius: 30px;

  &:before {
    position: absolute;
    content: "";
    height: 1.2em;
    width: 1.2em;
    border-radius: 40%;
    left: 0.45em;
    bottom: 0.4em;
    background: radial-gradient(circle at center,
        #fff1c1 0%,
        #ffd33d 35%,
        #ffb340 60%,
        #ff9900 100%);
    box-shadow: 0 0 5px #ff9900,
    0 0 8px rgba(255, 153, 0, 0.5);
    transition: .4s;
  }
}

input:checked + .slider {
  background-color: #303136;

  &:before {
    transform: translateX(1.5em);
    background: #303136;
    box-shadow: inset -3px -2px 5px -2px #8983f7,
    inset -6px -5px 0 0 #a3dafb;
  }
}
</style>
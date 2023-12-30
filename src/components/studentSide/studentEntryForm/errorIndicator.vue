<template>
    <div v-if="isVisible" class="error-indicator" :style="{ top: errorPosition + 'px' }" @click="jumpToError">
      <v-icon>mdi-alert-circle</v-icon>
      <span>{{ errorMessage }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: "ErrorIndicator",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        type: String,
        default: ''
      },
      errorPosition: {
        type: Number,
        default: 0
      }
    },
    methods: {
      jumpToError() {
        this.$emit('jumpToError');
      }
    }
  };
  </script>
  
  <style scoped>
  .error-indicator {
    position: fixed;
    right: 20px;
    background-color: #B00020;
    color: white;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  </style>
  
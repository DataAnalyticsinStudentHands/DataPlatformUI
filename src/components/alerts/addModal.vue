<template>
  <Transition name="bounce">
    <v-container v-if="isVisible" class="alert-container">
      <v-row justify="end">
        <v-col cols="auto">
          <v-alert type="success" dense elevation="2" @click:close="closeModal">
            <h4 class="alert-heading">{{ title }}</h4>
            <p>{{ message }}</p>
            <div class="decreasing-bar"></div>
            <template v-slot:append>
              <v-btn icon small class="close-btn" @click.stop="closeModal">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </Transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Alert"
    },
    message: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isVisible: true
    };
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    startTimer() {
      setTimeout(() => {
        this.isVisible = false;
        this.$emit("close");
      }, 5000);
    },
    closeModal() {
      this.isVisible = false;
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.decreasing-bar {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: green;
  animation: decrease-width 5s linear forwards;
}

.close-btn {
  background-color: transparent !important;
  padding: 0 !important;
}

@keyframes decrease-width {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

.alert-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: auto;
  max-width: 400px; /* You can adjust this value based on your preference */
  z-index: 1000; /* Ensures the alert is on top of other elements */
}

.bounce-enter-active {
  transform: translate(-50%, -50%);
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  transform: translate(-50%, -50%);
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: translate(0, 0) scale(0);
  }
  50% {
    transform: translate(0, 0) scale(1.25);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
</style>

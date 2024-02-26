<template>
  <div class="timer">
    <h3>{{ index }}. {{ timer.title }}</h3>
    <h3>{{ formattedTime }}</h3>
    <div class="timer__controls" v-if="isActiveTimer || isPaused">
      <button class="timer__btn timer__btn--pause" @click="togglePause">Resume/Pause</button>
      <button class="timer__btn timer__btn--stop" @click="stopTimer">Stop</button>
    </div>
    <span  v-if="isStopped">
      Start: {{ formatedDates.createdAt }}
      <br>
      End: {{ formatedDates.stoppedAt }}
    </span>
  </div>
</template>

<script>
import moment from 'moment';
import axiosInstance from '../plugins/axiosInstance';

export default {
  timerStatuses: {
    STOPPED: 'STOPPED',
    PAUSED: 'PAUSED',
    ACTIVE: 'ACTIVE',
  },
  props: {
    timer: Object,
    index: Number,
  },
  data() {
    return {
      totalTime: 0,
      timerInterval: null,
      isLoading: false,
    };
  },
  watch: {
    totalTime() {
      if (this.totalTime > +process.env.VUE_APP_TIMER_TIMEOUT) {
        this.totalTime = +process.env.VUE_APP_TIMER_TIMEOUT;
        this.stopTimer();
      }
    },
  },
  computed: {
    formatedDates() {
      return {
        createdAt: moment(this.timer.createdAt).format('HH:mm:ss'),
        stoppedAt: moment(this.timer.stoppedAt).format('HH:mm:ss'),
      };
    },
    formattedTime() {
      if (this.isActiveTimer) {
        return moment.utc(this.totalTime).format('HH:mm:ss');
      }
      const { timerValue } = this.timer;
      return moment.utc(timerValue).format('HH:mm:ss');
    },
    isActiveTimer() {
      return this.timer.status === this.$options.timerStatuses.ACTIVE;
    },
    isPaused() {
      return this.timer.status === this.$options.timerStatuses.PAUSED;
    },
    isStopped() {
      return this.timer.status === this.$options.timerStatuses.STOPPED;
    },
  },
  methods: {
    startTimer() {
      this.timerInterval = setInterval(this.updateTime, 1000);
    },
    updateTime() {
      this.totalTime = Date.now() - this.timer.startedAt + this.timer.timerValue;
    },
    async togglePause() {
      if (this.isLoading) {
        return;
      }
      let changedTimer = null;
      try {
        this.isLoading = true;
        if (!this.isPaused) {
          clearInterval(this.timerInterval);
          changedTimer = await axiosInstance.put(
            `timers/${this.timer.id}`,
            {
              startedAt: Date.now(),
              status: this.$options.timerStatuses.PAUSED,
              timerValue: this.totalTime,
            },
          );
        } else {
          this.startTimer();
          changedTimer = await axiosInstance.put(
            `timers/${this.timer.id}`,
            {
              startedAt: Date.now(),
              status: this.$options.timerStatuses.ACTIVE,
            },
          );
        }
      } catch {
        alert('Что-то пошло не так');
      } finally {
        this.isLoading = false;
      }
      this.timerChanged(changedTimer.data);
    },
    async stopTimer() {
      if (this.isLoading) {
        return;
      }
      try {
        this.isLoading = true;
        clearInterval(this.timerInterval);
        const stoppedTimer = await axiosInstance.put(
          `timers/${this.timer.id}`,
          {
            startedAt: this.timer.startedAt,
            status: this.$options.timerStatuses.STOPPED,
            timerValue: this.totalTime,
            stoppedAt: Date.now(),
          },
        );
        this.timerChanged(stoppedTimer.data);
      } catch {
        this.startTimer();
        alert('Что-то пошло не так');
      } finally {
        this.isLoading = false;
      }
    },
    timerChanged(timer) {
      this.$emit('timerChanged', timer);
    },
  },
  mounted() {
    if (this.isActiveTimer) {
      this.startTimer();
    }
  },
  beforeDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
};
</script>

<style lang="scss" scoped>
.timer {
  color: #fff;
  background: #6666f5;
  padding: 25px;
  border-radius: 5%;
  &__controls {
    display: flex;
    flex-direction: column;
  }
  &__btn {
    color: #fff;
    padding: 5px;
    border: 0;
    &--pause{
       background: #bab035;
       &:hover {
        background: #d5c83c;
       }
    }
    &--stop {
      background: #ec5e5e;
      &:hover {
        background: #ef8080;
       }
    }
  }
}
h3 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style>

<template>
  <div class="timers">
    <div class="timers__create">
      <label for="timerTitle">
        Timer title
        <input id="timerTitle" type="text" v-model="timerTitle">
      </label>
      <button class="timers__btn" @click="createTimer" :disabled="hasActiveTimer">
        Create
      </button>
    </div>
    <div class="timers__listing" v-for="(groupedTimers, date) in timersGroupedByDate" :key="date">
      <h3>{{ date }}</h3>
      <div class="timers__wrapper">
        <TimerDefault
        v-for="(timer, idx) in groupedTimers"
        @timerChanged="updateTimer"
        :index="idx + 1"
        :key="timer.id"
        :timer="timer"
      />
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import axiosInstance from '../plugins/axiosInstance';

import TimerDefault from './TimerDefault.vue';

export default {
  name: 'TimersList',
  components: {
    TimerDefault,
  },
  data() {
    return {
      timers: [],
      timerTitle: '',
      isLoading: false,
    };
  },
  mounted() {
    this.fetchAlltimers();
  },
  computed: {
    hasActiveTimer() {
      return this.timers.some((timer) => timer.status === 'ACTIVE' || timer.status === 'PAUSED');
    },
    timersGroupedByDate() {
      const groupedByDate = {};
      this.timers.forEach((timer) => {
        const date = moment(timer.startedAt).format('DD - MM - YYYY');
        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }
        groupedByDate[date].push(timer);
      });
      return groupedByDate;
    },
  },
  methods: {
    async fetchAlltimers() {
      const timers = await axiosInstance.get('timers');
      this.timers = timers.data;
      this.timers.sort((timer, nextTimer) => nextTimer.startedAt - timer.startedAt);
    },
    async updateTimer(updatedTimer) {
      const updatedTimerIdx = this.timers.findIndex((timer) => timer.id === updatedTimer.id);
      if (updatedTimerIdx !== -1) {
        this.timers.splice(updatedTimerIdx, 1, updatedTimer);
      }
    },
    async createTimer() {
      if (this.isLoading) {
        return;
      }
      try {
        this.isLoading = true;
        const createdTimer = await axiosInstance.post('timers', {
          startedAt: Date.now(),
          title: this.timerTitle,
          status: 'ACTIVE',
          timerValue: 0,
          createdAt: Date.now(),
        });
        this.timers.unshift(createdTimer.data);
      } catch {
        alert('Что-то пошло не так');
      } finally {
        this.timerTitle = '';
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.timers{
  padding: 0 20%;
  &__wrapper {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
  }

}
input {
  height: 100%;
}
h3 {
  font-size: 50px;
}
</style>

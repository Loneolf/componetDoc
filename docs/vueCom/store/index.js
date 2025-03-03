import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      count: 0
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    addNumber(state, num) {
      state.count += num;
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    }
  }
});

export default store;
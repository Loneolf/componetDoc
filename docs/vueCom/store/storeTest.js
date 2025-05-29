import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();

const count = computed(() => store.state.count);
const doubleCount = computed(() => store.getters.doubleCount);

const increment = () => {
    store.commit('increment');
};
const addNumber = () => {
    store.commit('addNumber', 10);
};

const incrementAsync = () => {
    store.dispatch('incrementAsync');
};


const html = `
<div>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
<div>
    <br />
    <button @click="addNumber">addNumber</button>
</div>
`

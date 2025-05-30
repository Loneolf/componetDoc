<template>
    <div class="todo-container" v-loading="loading" element-loading-text="数据同步中">
        <div class="todo-tabs">
            <button @click="filterTodos('all')" :class="{ active: filter === 'all' }">全部</button>
            <button @click="filterTodos('pending')" :class="{ active: filter === 'pending' }">待完成</button>
            <button @click="filterTodos('completed')" :class="{ active: filter === 'completed' }">已完成</button>
        </div>
        <input 
            class="todo-input" 
            v-if="filter !== 'completed'" 
            v-model="newTodo" 
            placeholder="输入待办事项" 
            @keyup.enter="addTodo" 
        />
        <ul>
            <li
                v-for="(todo, index) in filteredTodos"
                :key="index + todo.text"
                :class="{ completed: todo.completed }"
            >
                <input type="checkbox" :value="todo.completed" @input="toggleTodo(todo)" />
                <span>{{ todo.text }}</span>
                <button @click="deleteTodo(index)">删除</button>
            </li>
        </ul>
    </div>
</template>
  
<script setup>
    import { ref, computed, onMounted } from "vue";
    import COS from 'cos-js-sdk-v5'
    import { COSSECRET } from '../../upcdn/myConfig'

    const cos = new COS({
        SecretId: COSSECRET.id,
        SecretKey: COSSECRET.key,
    });

    // 存储所有待办事项的数组，每个事项是一个包含text和completed属性的对象
    const todos = ref([]);
    // 用于绑定输入框中输入的新待办事项内容
    const newTodo = ref("");
    // 用于控制显示不同状态待办事项的筛选条件
    const filter = ref("all");
    // 加载状态
    const loading = ref(false)

    onMounted(() => {
        getData()
    });

    const getData = () => {
        loading.value = true
        cos.getObject({
            Bucket: 'qing-1258827329', // 填入您自己的存储桶，必须字段
            Region: 'ap-beijing',  // 存储桶所在地域，例如 ap-beijing，必须字段
            Key: 'test.json',  // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
            DataType: 'blob',        // 非必须
            onProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            }
        }, function(err, data) {
            loading.value = false
            parseBlob(data.Body).then((res) => {
                todos.value = res
            })
        console.log(err || data.Body);
    });
	}

    const handleFileInUploading = () => {
        loading.value = true
        const blob = new Blob([JSON.stringify(todos.value)], { type: "application/json" });
        console.log('aaasave', blob)
        cos.uploadFile({
            Bucket: 'qing-1258827329', /* 填写自己的 bucket，必须字段 */
            Region: 'ap-beijing',     /* 存储桶所在地域，必须字段 */
            Key: 'test.json',              /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
            Body: blob, // 上传文件对象
            SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData));
            }
        }, function(err, data) {
            loading.value = false
            if (err) {
                console.log('上传失败', err);
            } else {
                console.log('上传成功');
            }
        });
    }

    const parseBlob = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                if (event.target.readyState === FileReader.DONE) {
                    const text = event.target.result;
                    try {
                        const jsonData = JSON.parse(text);
                        console.log(resolve);
                        resolve(jsonData);
                    } catch (error) {
                        resolve([])
                        console.error('解析JSON数据出错:', error);
                    }
                }
            };
            reader.readAsText(blob);
        })
	}

    // 切换待办事项完成状态的函数
    const toggleTodo = (item) => {
        item.completed = !item.completed;
    };

    // 添加待办事项的函数
    const addTodo = () => {
        let text = newTodo.value.trim()
        if (text) {
            todos.value.push({ text, completed: false });
        }
        newTodo.value = "";
        handleFileInUploading()
    };

    // 删除待办事项的函数
    const deleteTodo = (index) => {
        todos.value.splice(index, 1);
        handleFileInUploading()
    };

    // 根据筛选条件过滤待办事项的计算属性
    const filteredTodos = computed(() => {
        if (filter.value === "all") {
            return todos.value;
        } else if (filter.value === "pending") {
            return todos.value.filter((todo) => !todo.completed);
        } else {
            return todos.value.filter((todo) => todo.completed);
        }
    });

    // 根据点击的筛选按钮更新筛选条件的函数
    const filterTodos = (type) => {
        filter.value = type;
    };
    
</script>
  
<style lang="less" scoped>
    .todo-container {
        width: 600px;
        margin-top: 100px;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 5px;
        .todo-input {
            width: 100%;
        }
        .todo-tabs {
            display: flex;
            justify-content: space-around;
            margin-bottom: 10px;
            button {
                padding: 5px 10px;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
            }
            button.active {
                background-color: #007bff;
                color: white;
            }
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #ccc;
            span{
                flex: 1;
                display: inline-block;
                text-align: left;
                padding: 0 10px;
            }
        }
        .completed span {
            text-decoration: line-through;
            color: #888;
        }
        button {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        }
    }
</style>
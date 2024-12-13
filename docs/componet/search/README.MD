#### 搜索组件

原html片段如下，如要修改改片段，可以使用ES6的字符串片段进行修改，并使用在线ES6转ES5进行转换，例如[在线转换](https://www.gongjuhao.com/jsconvert/),[在线转换2](https://jstool.gitlab.io/zh-cn/babel-es6-to-es5/)
请保持该片段与index.js中的转换一致，利于后续的正常维护
```
`
<div class="searchcomBox">
    <div class="searchInput">
        <img class="seachIcon" src="./img/seachIcon.png"/>
        <input 
            v-model="searchValue" 
            @click="inputClick" 
            :placeholder="placeholder"
        />
        <img v-if="searchValue" class="clear" src="./img/clear.png" @click.stop="clearSeach">
    </div>
    <van-popup
        v-model="isShowSeachPop"
        position="bottom"
        :close-on-click-overlay="false"
        @click-overlay="onCancel"
    >
        <div class="search-box" ref="searchbox">
            <div class="width-center vantSearchBox">
                <van-search
                    v-model="searchValue"
                    :placeholder="placeholder"
                    @input="onInput"
                    shape="round"
                    clearable
                    ref="searchRef"
                    :maxlength="maxLen"
                ></van-search>
                <div class="close" @click="onCancel">关闭</div>
            </div>
        </div>
        <div class="search-list width-center">
            <div class="empty" v-show="isEmpty && searchValue != ''">
                <img src="./img/noData.png" alt="" />
                <div class="empty-text">未找到搜索结果</div>
                <div
                    class="empty-button"
                    v-show="searchValue.length === 6 && !isNaN(searchValue)"
                    @click="useCode"
                >
                    直接使用此代码
                </div>
            </div>
            <div v-show="!isEmpty && searchValue">
                <div
                    class="search-list-item"
                    v-for="(item, i) in searchList"
                    :key="i"
                    @click.stop="itemClick(item)"
                >
                    <div class="badge" :style="{ color: item.label.color,background: item.label.bgColor}">
                        {{ item.label.value }}
                    </div>
                    <span v-html="item.stockCode" class="stock-code"></span>
                    <span v-html="item.stockName" class="stock-name"></span>
                </div>
            </div>
        </div>
        <van-popup v-model="confrimPopUp">
            <div class='confirmContent'>
                <div 
                    class='confirmItem'
                    v-for='item in searchList' 
                    @click='itemClick(item, true)'
                    :key='item.rawName'
                >
                    <span class='code'>{{item.rawCode}}</span>
                    <span class='name'>{{item.rawName}}</span>
                </div>
            </div>
        </van-popup>
    </van-popup>
    
</div>
`
```
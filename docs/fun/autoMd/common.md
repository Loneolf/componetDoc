## Functions

<dl>
<dt><a href="#formateDateToString">formateDateToString(dateObject, split)</a></dt>
<dd><p>日期转字符串</p>
</dd>
<dt><a href="#formateStringToDate">formateStringToDate(YYYYMMDD)</a></dt>
<dd><p>字符串转日期</p>
</dd>
<dt><a href="#dateCount">dateCount(expireNum, nowNum)</a></dt>
<dd><p>倒计时</p>
</dd>
<dt><a href="#accAdd">accAdd()</a></dt>
<dd><ul>
<li>加法函数，用来得到精确的加法结果</li>
<li>说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。</li>
<li>调用：accAdd(arg1,arg2)</li>
<li>返回值：arg1加上arg2的精确结果</li>
</ul>
</dd>
<dt><a href="#accSub">accSub()</a></dt>
<dd><ul>
<li>减法函数，用来得到精确的减法结果</li>
<li>说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。</li>
<li>调用：accSub(arg1,arg2)</li>
<li>返回值：arg1加上arg2的精确结果</li>
</ul>
</dd>
<dt><a href="#accMul">accMul()</a></dt>
<dd><ul>
<li>乘法函数，用来得到精确的乘法结果</li>
<li>说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。</li>
<li>调用：accMul(arg1,arg2)</li>
<li>返回值：arg1乘以 arg2的精确结果</li>
</ul>
</dd>
<dt><a href="#accDiv">accDiv()</a></dt>
<dd><ul>
<li>除法函数，用来得到精确的除法结果</li>
<li>说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。</li>
<li>调用：accDiv(arg1,arg2)</li>
<li>返回值：arg1除以arg2的精确结果</li>
</ul>
</dd>
<dt><a href="#isTradeDate">isTradeDate(dateObject, ])</a> ⇒</dt>
<dd><p>前端判断是否为交易日期</p>
</dd>
<dt><a href="#abbreviation">abbreviation(字符串)</a></dt>
<dd><p>字符串超长缩写</p>
</dd>
<dt><a href="#compare">compare(pro)</a></dt>
<dd><p>比较函数</p>
</dd>
<dt><a href="#getDiffDays">getDiffDays(date1Str, date2Str)</a></dt>
<dd><p>计算两个日期的间隔</p>
</dd>
<dt><a href="#getLastTradingDay">getLastTradingDay(nonTradingDays, serverTime)</a> ⇒ <code>string</code></dt>
<dd></dd>
</dl>

<a name="formateDateToString"></a>

## formateDateToString(dateObject, split)
日期转字符串

**Kind**: global function  

| Param | Type |
| --- | --- |
| dateObject | <code>Date</code> | 
| split | <code>String</code> | 

<a name="formateStringToDate"></a>

## formateStringToDate(YYYYMMDD)
字符串转日期

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| YYYYMMDD | <code>String</code> | dateString |

<a name="dateCount"></a>

## dateCount(expireNum, nowNum)
倒计时

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| expireNum | <code>\*</code> | 倒计时时间戳 |
| nowNum | <code>\*</code> | 现在时间戳 |

<a name="accAdd"></a>

## accAdd()
* 加法函数，用来得到精确的加法结果
* 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
* 调用：accAdd(arg1,arg2)
* 返回值：arg1加上arg2的精确结果

**Kind**: global function  
<a name="accSub"></a>

## accSub()
* 减法函数，用来得到精确的减法结果
* 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
* 调用：accSub(arg1,arg2)
* 返回值：arg1加上arg2的精确结果

**Kind**: global function  
<a name="accMul"></a>

## accMul()
* 乘法函数，用来得到精确的乘法结果
* 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
* 调用：accMul(arg1,arg2)
* 返回值：arg1乘以 arg2的精确结果

**Kind**: global function  
<a name="accDiv"></a>

## accDiv()
* 除法函数，用来得到精确的除法结果
* 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
* 调用：accDiv(arg1,arg2)
* 返回值：arg1除以arg2的精确结果

**Kind**: global function  
<a name="isTradeDate"></a>

## isTradeDate(dateObject, ]) ⇒
前端判断是否为交易日期

**Kind**: global function  
**Returns**: Boolean  

| Param | Type | Description |
| --- | --- | --- |
| dateObject | <code>Date</code> |  |
| ] | <code>Array</code> | nonTradingDate |

<a name="abbreviation"></a>

## abbreviation(字符串)
字符串超长缩写

**Kind**: global function  

| Param | Type |
| --- | --- |
| 字符串 | <code>string</code> | 

<a name="compare"></a>

## compare(pro)
比较函数

**Kind**: global function  

| Param | Type |
| --- | --- |
| pro | <code>\*</code> | 

<a name="getDiffDays"></a>

## getDiffDays(date1Str, date2Str)
计算两个日期的间隔

**Kind**: global function  

| Param | Type |
| --- | --- |
| date1Str | <code>String</code> | 
| date2Str | <code>String</code> | 

<a name="getLastTradingDay"></a>

## getLastTradingDay(nonTradingDays, serverTime) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| nonTradingDays | <code>Array</code> | 
| serverTime | <code>Array</code> | 


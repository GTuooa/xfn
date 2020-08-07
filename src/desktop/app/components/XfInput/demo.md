
---
模块：XfInput
---

## 用处
文本或金额或数量输入框


## API
属性说明如下：

mode: 'text', 'number', 'amount' 3种, 默认值是 ‘text’
negativeAllowed: false, // 是否允许负数，mode 为 'number' 或 'amount' 时有效
tipTit: '',  // mode 为 number 时的提示语头部，tipTit='单价' 时，输入非数字，会提示“单价只能输入小于14位数四位小数的数字“


## 情况分析

mode={'text'}
普通的文本输入框，封装了获取到焦点时全选文字；
使用到的地方如：文本输入框

mode={'amount'}
关联属性： negativeAllowed
金额输入框，只能输出 14位的2位小数， negativeAllowed 用来控制是否能填负数；
封装了获取到焦点时全选金额，失去焦点时显示格式化金额；
使用到的地方如：存货的金额

mode={'number'}
关联属性： negativeAllowed
金额输入框，只能输出 14位的4位小数， negativeAllowed 用来控制是否能填负数；
封装了获取到焦点时全选数字，失去焦点时显示格式化数字；
使用到的地方如：存货的数量、单价


## 基础调用
```html
<XfInput
    placeholder={placeholderText}
    value={remark}
    onChange={e => changeInventoryCardContent(e.target.value))}
/>

```
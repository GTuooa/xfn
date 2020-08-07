---
category: Components
chinese: 单选框
english: SinglePicker
---

分钉钉环境和浏览器环境，自动检测处于哪种环境后调用对应的组件

## 参数说明

disabled       是否禁用           bool
extra          占位显示           string
district       可选选项           Array          [{key: '23', value: '23'}]
value          值（浏览器环境有用） string
onOk           确定回调           Func
chilren        Htlm或组件        


## 调用示例

```
import { SinglePicker } from 'app/components'

<SinglePicker
    extra="请选择(可选)"
    lableName="账套选择"
    value={defaultsobid}
    district={soblist.map(v => {return {key: v.get('sobname'), value: v.get('sobid')}}).toJS()}
    onOk={value => dispatch(homeActions.modifyDefaultSobIdFetch(value))}
>
</SinglePicker>
```

或者

```

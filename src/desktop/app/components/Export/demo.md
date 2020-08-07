
---
category: export
chinese: 导出modal模块
---

## 用处
点击导出按钮后跳出的选择框，可以选择下载至本地或以钉钉消息形式推送


## API
属性说明如下：

属性           |  说明     |  类型  | 默认值
--------------|----------|-------|------
ddCallback    | 通过钉钉选人组件获取到接收者名字列表后要调用到方法 | function | 无
exportDisable | 导出不能使用时设为true | bool | false
hrefUrl       | 下载至本地的下载地址 | string | 无
type          | 下载可选选项     | string  | 无

## 调用者
明细表、辅助核算明细表


```html

```

## 情况分析

1. 最平常的状态     type: common  ->  ‘’ 或 无
    Excel
    PDF                                                         
    表： 利润表、 资产负债表、 现金流量表、 应交税费表、 辅助核算余额表、 资产余额表、 外币余额表、 数量余额表、 资产明细表、 外币明细表、

2. 阿米巴 ：        type: first
    Excel

3. 科目余额表       type: second
    Excel   
    Pdf:  科目余额表、 凭证汇总表

4. 科目明细表       type: third
    Excel： 当前明细、 所有明细   
    Pdf: 当前明细
         所有明细   一级科目 二级科目
         总账    一级科目 二级科目

5. 数量明细表， 辅助核算明细表    type: fourth
    Excel： 当前明细、 所有明细   
    Pdf:  当前明细

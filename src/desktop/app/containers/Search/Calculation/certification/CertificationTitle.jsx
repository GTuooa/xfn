import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Checkbox } from 'antd'
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class invoicingTitle extends React.Component {
  render() {
    const {className, onClick, selectAcAll} = this.props

    return (<div className="table-title-wrap">
      <ul className={className
          ? `${className} table-title`
          : "table-title"}>
        <li onClick={onClick}>
          <Checkbox checked={selectAcAll}/>
        </li>
        <li>
          <span>日期</span>
        </li>
        <li>
          <span>流水号</span>
        </li>
        <li>
          <span>流水类别</span>
        </li>
        <li>
          <span>摘要</span>
        </li>
        <li>
          <span>类型</span>
        </li>
        <li>
          <span>价税合计</span>
        </li>
        <li>
          <span>税率</span>
        </li>
        <li>
          <span>税额</span>
        </li>
        <li>
          <span>认证</span>
        </li>
      </ul>
    </div>)
  }
}

import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Checkbox, Popover} from 'antd'
import { Icon } from 'app/components'
import { toJS } from 'immutable'
const CheckboxGroup = Checkbox.Group;

@immutableRenderDecorator
export default
class PayManageTitle extends React.Component {
  render() {
    const {className, onClick, selectAcAll, ass} = this.props

    const content = (<div style={{
        width: '150px'
      }}>
      <CheckboxGroup options={[
          '全部收',
          '全部付',
          '部分收',
          '部分付',
          '未收款',
          '未付款'
        ]} defaultValue={['全部收']} onChange={(checkedValues) => {
          console.log('checkboxGroup', checkedValues)

        }}/>
    </div>)

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
        <li className="amountlsye-title-cell">
          <div className="amountlsye-item-first">
            未处理金额
          </div>
          <div className="amountlsye-item-second-two">
            <span>预收/应收</span>
            <span>预付/应付</span>
          </div>
        </li>
        <li className="amountlsye-title-cell">
          <div className="amountlsye-item-first">
            总金额
          </div>
          <div className="amountlsye-item-second-two">
            <span>预收/应收</span>
            <span>预付/应付</span>
          </div>
        </li>
      <li>
        <span>核账对象</span>
      </li>
        <li>
          <span>
            状态
            <Popover content={content} title="" trigger="click">
              <Icon type="filter"/>
            </Popover>
          </span>
        </li>
      </ul>
    </div>)
  }
}

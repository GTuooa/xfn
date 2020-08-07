import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

// import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as zhyeActions from 'app/redux/Yeb/ZhYeb/zhYeb.action'
import * as xmmxActions from 'app/redux/Mxb/XmMxb/xmMxb.action'

@immutableRenderDecorator
export default
class ItemPR extends React.Component {

  render() {
    const {
        item,
        dispatch,
        className,
        issuedate,
        endissuedate,
        categoryUuid,
        isTop,
        leve,
        runningCategoryUuid,
        propertyCost,
        runningType,
        xmType,
        line
    } = this.props

    // 工资支出及内部转账大类的复选框置灰、不可删除
    const name = item.get('name')
    const code = item.get('code')
    return (
      <TableItem className={className} line={line}>
      <TableOver textAlign="left" className={'table-item-with-triangle'}>
        <span className='table-item-name table-item-cur'>
          <span
            style={{
                  paddingLeft: `${leve * 10}px`
            }}
            onClick={() => {
                sessionStorage.setItem('isXmYEJump', 'TRUE')
                dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'categoryName'], runningType))
                dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'xmType'], xmType))
                dispatch(xmmxActions.getFirstProjectDetailList(issuedate,endissuedate,1,'DETAIL_AMOUNT_TYPE_HAPPEN',categoryUuid,item.get('uuid'),isTop,runningCategoryUuid,propertyCost))
            }}
            style={{'textDecoration':'underline','cursor':'pointer'}}
            >
            {`${code}_${name}`}
          </span>
        </span>
      </TableOver>
      <li>
          <div className='xmyeb-item-divide'>
              <Amount className='amount-right'>{item.get('incomeAmount')}</Amount>
              <Amount className='amount-right'>{item.get('expenseAmount')}</Amount>
              <Amount className='amount-right'>{item.get('balanceAmount')}</Amount>
          </div>
      </li>
      <li>
          <div className='xmyeb-item-divide'>
              <Amount className='amount-right'>{item.get('realIncomeAmount')}</Amount>
              <Amount className='amount-right'>{item.get('realExpenseAmount')}</Amount>
              <Amount className='amount-right'>{item.get('realBalanceAmount')}</Amount>
          </div>
      </li>
    </TableItem>
  )
  }
}

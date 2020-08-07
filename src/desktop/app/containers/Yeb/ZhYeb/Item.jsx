import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

// import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as zhyeActions from 'app/redux/Yeb/ZhYeb/zhYeb.action'
import * as zhmxActions from 'app/redux/Mxb/ZhMxb/zhMxb.action'

@immutableRenderDecorator
export default
class Item extends React.Component {

  render() {
    const {
        item,
        dispatch,
        line,
        className,
        haveChild,
        showChild,
        issuedate,
        leve,
        upperArr,
        // checked,
        runningTemp,
        endissuedate
    } = this.props

    // 工资支出及内部转账大类的复选框置灰、不可删除
    const name = item.get('name')
    const leveHolder = ({
      1: () => '',
      2: () => '-',
      3: () => '--',
      4: () => '---'
    }[leve])()

    const accountType = {
        "cash" : '现金',
        "general" : '一般户',
        "basic" : '基本户',
        "Alipay" : '支付宝',
        "WeChat" : '微信',
        "other" : '其它',
    }
    // const canNoChild = ['LB_CQZC', 'LB_JK', 'LB_TZ', 'LB_ZB']
    const canNoChild = [] //测试全开

    return (
      <TableItem line={line} className={className}>

      <TableOver textAlign="left" className={haveChild
          ? "table-item-with-triangle trianglePointer"
          : 'table-item-with-triangle'}>
        <span className='table-item-name table-item-cur' style={{
            paddingLeft: `${leve * 10}px`
          }}>
          <span
            onClick={() => {
                sessionStorage.setItem('isAccountYEJump', 'TRUE')
                dispatch(zhmxActions.getBusinessDetail(item,issuedate,endissuedate))
            }}
            >
            {`${leveHolder} ${name}`}
          </span>
        </span>
        {
          haveChild
            ? <span className="table-item-triangle-account-wrap" onClick={() => dispatch(zhyeActions.accountBalanceTriangleSwitch(showChild, item.get('categoryUuid')))}>
                <Icon className="table-item-triangle-account"
                  // onClick={() => dispatch(accountConfActions.accountConfRunningTriangleSwitch(showChild, item.get('uuid')))}
                  type={showChild
                    ? 'up'
                    : 'down'}></Icon>
              </span>
            : ''
        }
      </TableOver>

      <TableOver textAlign="center">
        {accountType[item.get('type')]}
      </TableOver>
      <TableOver textAlign="right">
        <Amount>{item.get('beginAmount')}</Amount>
      </TableOver>
      <TableOver textAlign="right">
        <Amount>{item.get('monthIncomeAmount')}</Amount>
      </TableOver>
      <TableOver textAlign="right">
        <Amount>{item.get('monthExpenseAmount')}</Amount>
      </TableOver>
      <TableOver textAlign="right">
        <Amount>{item.get('monthBalanceAmount')}</Amount>
      </TableOver>
    </TableItem>
  )
  }
}

import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

import * as wlmxActions from 'app/redux/Mxb/WlMxb/wlMxb.action'

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
        isTop,
        typeUuid,
        wlType,
        line,
        leve
    } = this.props

    // 工资支出及内部转账大类的复选框置灰、不可删除
    const name = item.get('name')


    return (
      <TableItem className={className} line={line}>
      <TableOver textAlign="left" className={'table-item-with-triangle'}>
        <span className='table-item-name table-item-cur' style={{
            paddingLeft: `${leve * 10}px`
          }}>
          <span
            onClick={() => {
                sessionStorage.setItem('isContactsYEJump', 'TRUE')
                dispatch(wlmxActions.getBusinessDetail(item,issuedate,endissuedate,typeUuid,wlType))
                dispatch(wlmxActions.getContactsTypeList(issuedate,endissuedate,'true'))
                dispatch(wlmxActions.getContactsCardList(issuedate,endissuedate,isTop,typeUuid,'',1,true,item.get('uuid')))


            }}
            >
            {item.get('code') ? `${item.get('code')}_${item.get('name')}` : item.get('name')}
          </span>
        </span>
      </TableOver>
      <TableOver className="amountwlye-title-cell">
        <div className="amountwlye-item-second-two">
          <span><Amount>{item.get('beginIncomeAmount')}</Amount></span>
          <span><Amount>{item.get('beginExpenseAmount')}</Amount></span>
        </div>
      </TableOver>
      <TableOver className="amountwlye-title-cell">
        <div className="amountwlye-item-second-two">
          <span><Amount>{item.get('happenIncomeAmount')}</Amount></span>
          <span><Amount>{item.get('happenExpenseAmount')}</Amount></span>
        </div>
      </TableOver>
      <TableOver className="amountwlye-title-cell">
        <div className="amountwlye-item-second-two">
          <span><Amount>{item.get('paymentIncomeAmount')}</Amount></span>
          <span><Amount>{item.get('paymentExpenseAmount')}</Amount></span>
        </div>
      </TableOver>
      <TableOver className="amountwlye-title-cell">
        <div className="amountwlye-item-second-two">
          <span><Amount>{item.get('balanceIncomeAmount')}</Amount></span>
          <span><Amount>{item.get('balanceExpenseAmount')}</Amount></span>
        </div>
      </TableOver>
    </TableItem>
  )
  }
}

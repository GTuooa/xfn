import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount, Icon } from 'app/components'

import * as wlmxActions from 'app/redux/Mxb/WlMxb/wlMxb.action'
import * as wlyeActions from 'app/redux/Yeb/WlYeb/wlYeb.action'

@immutableRenderDecorator
export default
class TitleItem extends React.Component {

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
        endissuedate,
        wlOnlyRelate
    } = this.props
    const name = item.get('name')

    return (
      <TableItem line={line} className={`${className} wlye-table-type-title`}>
      <TableOver textAlign="left" className={haveChild
          ? "table-item-with-triangle trianglePointer"
          : 'table-item-with-triangle'}>
          <span className='table-item-name' style={{
              paddingLeft: `${leve * 10}px`
            }}>
            <span onClick={() => {
                sessionStorage.setItem('isContactsYEJump', 'TRUE')
                dispatch(wlmxActions.getPeriodDetailList(issuedate,endissuedate,'false',item.get('uuid'),'',true))


            }}>
                {`${name}`}
            </span>
          </span>
        {
          haveChild
            ? <span className="table-item-triangle-account-wrap" onClick={() => dispatch(wlyeActions.contactsBalanceTriangleSwitch(showChild, item.get('uuid')))}>
                <Icon className="table-item-triangle-account"
                  type={showChild
                    ? 'up'
                    : 'down'}></Icon>
              </span>
            : ''
        }
      </TableOver>
      <TableOver className="amountwlye-title-cell">
          {
              wlOnlyRelate == '1' || wlOnlyRelate == '2' ?
              <span> <Amount>
              {
                  wlOnlyRelate == '2' ? item.get('beginIncomeAmount') : item.get('beginExpenseAmount')
              }
              </Amount></span> :
              <div className="amountwlye-item-second-two">
                <span><Amount>{item.get('beginIncomeAmount')}</Amount></span>
                <span><Amount>{item.get('beginExpenseAmount')}</Amount></span>
              </div>
          }

      </TableOver>
      <TableOver className="amountwlye-title-cell">
          {
              wlOnlyRelate == '1' || wlOnlyRelate == '2' ?
              <span> <Amount>
               {
                   wlOnlyRelate == '2' ? item.get('happenIncomeAmount') : item.get('happenExpenseAmount')
               }
               </Amount> </span> :
              <div className="amountwlye-item-second-two">
                <span><Amount>{item.get('happenIncomeAmount')}</Amount></span>
                <span><Amount>{item.get('happenExpenseAmount')}</Amount></span>
              </div>
          }
      </TableOver>
      <TableOver className="amountwlye-title-cell">
          {
              wlOnlyRelate == '1' || wlOnlyRelate == '2' ?
              <span><Amount>
              {
                  wlOnlyRelate == '2' ? item.get('paymentIncomeAmount') : item.get('paymentExpenseAmount')
              }
              </Amount> </span> :
              <div className="amountwlye-item-second-two">
                <span><Amount>{item.get('paymentIncomeAmount')}</Amount></span>
                <span><Amount>{item.get('paymentExpenseAmount')}</Amount></span>
              </div>
          }
      </TableOver>
      <TableOver className="amountwlye-title-cell">
          {
              wlOnlyRelate == '1' || wlOnlyRelate == '2' ?
              <span><Amount>
              {
                  wlOnlyRelate == '2' ? item.get('balanceIncomeAmount') : item.get('balanceExpenseAmount')
              }
              </Amount> </span> :
              <div className="amountwlye-item-second-two">
                <span><Amount>{item.get('balanceIncomeAmount')}</Amount></span>
                <span><Amount>{item.get('balanceExpenseAmount')}</Amount></span>
              </div>
          }
      </TableOver>

    </TableItem>
  )
  }
}

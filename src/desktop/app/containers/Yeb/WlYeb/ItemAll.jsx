import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'

import * as wlmxActions from 'app/redux/Mxb/WlMxb/wlMxb.action'

@immutableRenderDecorator
export default
class ItemAll extends React.Component {

  render() {
    const {
        item,
        dispatch,
        className,
        issuedate,
        wlRelate,
        endissuedate,
        isTop,
        typeUuid,
        wlType,
        wlOnlyRelate,
        line,
        leve
    } = this.props
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
          <TableOver textAlign="right">
              <Amount>
              {
                  wlRelate == '2' || wlOnlyRelate == '2' ? item.get('beginIncomeAmount') : item.get('beginExpenseAmount')
              }
              </Amount>
          </TableOver>
          <TableOver textAlign="right">
              <Amount>
              {
                  wlRelate == '2' || wlOnlyRelate == '2' ? item.get('happenIncomeAmount') : item.get('happenExpenseAmount')
              }
              </Amount>
          </TableOver>
          <TableOver textAlign="right">
              <Amount>
              {
                  wlRelate == '2' || wlOnlyRelate == '2' ? item.get('paymentIncomeAmount') : item.get('paymentExpenseAmount')
              }
              </Amount>
          </TableOver>
          <TableOver textAlign="right">
              <Amount>
              {
                  wlRelate == '2' || wlOnlyRelate == '2' ? item.get('balanceIncomeAmount') : item.get('balanceExpenseAmount')
              }
              </Amount>
          </TableOver>
    </TableItem>
  )
  }
}

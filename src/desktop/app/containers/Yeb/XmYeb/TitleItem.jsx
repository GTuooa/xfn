import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount, Icon } from 'app/components'

// import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as xmyeActions from 'app/redux/Yeb/XmYeb/xmYeb.action'
import * as xmmxActions from 'app/redux/Mxb/XmMxb/xmMxb.action'
import * as homeActions from 'app/redux/Home/home.action.js'

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
        // checked,
        runningTemp,
        endissuedate,
        runningShowChild,
        runningCategoryUuid,
        propertyCost,
        runningType
    } = this.props
    // 工资支出及内部转账大类的复选框置灰、不可删除
    const name = item.get('name')
    const code = item.get('code')
    const uuid = item.get('uuid')
    // const leveHolder = ({
    //   1: () => '',
    //   2: () => ' ',
    //   3: () => '  ',
    //   4: () => '    '
    // }[leve])()

    return (
      <TableItem line={line} className={`${className}`}>
      <li
        onClick={() =>
              dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','runningShowChild'], showChild?runningShowChild.update(v => v.filter(w => w !== uuid)):runningShowChild.update(v => v.push(uuid))))
          }
        style={{'cursor':'pointer'}}
      >
          <span
              className={haveChild
                  ? "table-item-with-triangle trianglePointer over-ellipsis"
                  : 'table-item-with-triangle over-ellipsis'}
              style={{textAlign: 'left', padding: '0 0 0 4px'}}
              >
              <span>
                  <span className='table-item-name' style={{paddingLeft: `${leve * 10}px`}}>
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            sessionStorage.setItem('isXmYEJump', 'TRUE')
                            dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'categoryName'], runningType))
                            dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'xmType'], name))
                            dispatch(xmmxActions.getFirstProjectDetailList(issuedate,endissuedate,1,'DETAIL_AMOUNT_TYPE_HAPPEN',uuid,'','false',runningCategoryUuid,propertyCost))
                            dispatch(homeActions.addPageTabPane('MxbPanes', 'XmMxb', 'XmMxb', '项目明细表'))
                            dispatch(homeActions.addHomeTabpane('Mxb', 'XmMxb', '项目明细表'))
                        }}
                        style={{'textDecoration':'underline'}}
                    >
                      {`${name}`}
                    </span>
                  </span>
                  {
                    haveChild
                      ? <span className="table-item-triangle-account-wrap">
                          <Icon className="table-item-triangle-account"
                            type={showChild
                              ? 'up'
                              : 'down'}></Icon>
                        </span>
                      : ''
                  }
              </span>
          </span>
      </li>
        <li >
            <div className='xmyeb-item-divide'>
                <Amount>{item.get('incomeAmount')}</Amount>
                <Amount>{item.get('expenseAmount')}</Amount>
                <Amount>{item.get('balanceAmount')}</Amount>
            </div>

        </li>
        <li >
            <div className='xmyeb-item-divide'>
                <Amount>{item.get('realIncomeAmount')}</Amount>
                <Amount>{item.get('realExpenseAmount')}</Amount>
                <Amount>{item.get('realBalanceAmount')}</Amount>
            </div>
        </li>
    </TableItem>
  )
  }
}

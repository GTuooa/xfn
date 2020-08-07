import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'
import { numberCalculate } from 'app/utils'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as accountYebActions from 'app/redux/Yeb/AccountYeb/accountYeb.action.js'
import * as accountMxbActions from 'app/redux/Mxb/AccountMxb/accountMxb.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

    render() {
        const {
            item,
            dispatch,
            line,
            className,
            issuedate,
            endissuedate,
            chooseValue,
        } = this.props

        const accountType = {
            "cash" : '现金',
            "general" : '一般户',
            "basic" : '基本户',
            "Alipay" : '支付宝',
            "WeChat" : '微信',
            "other" : '其它',
            "spare": '备用金',
        }

        return (
            <TableItem line={line} className={className}>
                <TableOver
                    textAlign="left"
                    isLink={true}
                    onClick={() => {
						sessionStorage.setItem('previousPage', 'accountMx')
						// dispatch(homeActions.addTabpane('AssetsMx'))
                        dispatch(homeActions.addPageTabPane('MxbPanes', 'AccountMxb', 'AccountMxb', '账户明细表'))
                        dispatch(homeActions.addHomeTabpane('Mxb', 'AccountMxb', '账户明细表'))

                        dispatch(accountMxbActions.getAccountMxbBalanceListFromAccountYeb(issuedate, endissuedate, item.get('uuid')))
                        dispatch(accountMxbActions.getAccountMxbTree(issuedate, endissuedate, item.get('uuid')))
                        dispatch(accountMxbActions.changeAccountMxbChooseValue(chooseValue))
					}}
                >
                    {item.get('name')}
                </TableOver>
                <TableOver textAlign="center">
                    {accountType[item.get('type')]}
                </TableOver>
                <li>
					<span><Amount>{numberCalculate(item.get('openDebit'),item.get('openCredit'),2,'subtract')}</Amount></span>
                </li>
                <li>
					<span><Amount>{item.get('currentDebit')}</Amount></span>
					<span><Amount>{item.get('currentCredit')}</Amount></span>
					<span><Amount>{item.get('yearDebit')}</Amount></span>
					<span><Amount>{item.get('yearCredit')}</Amount></span>
				</li>
                <li>
					<span><Amount>{numberCalculate(item.get('closeDebit'),item.get('closeCredit'),2,'subtract')}</Amount></span>
                </li>
            </TableItem>
        )
    }
}

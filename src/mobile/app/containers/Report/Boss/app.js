import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { fromJS, toJS, Map } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import './boss.less'
import '../sheet.less'
import { Amount } from 'app/components'

import { Icon, ButtonGroup, Button, Container, ScrollView, Row, SinglePicker } from 'app/components'
import { TopMonthPicker } from 'app/containers/components'
import * as bossActions from 'app/redux/Report/Boss/boss.action'
import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'

@connect(state => state)
export default
class Boss extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({
            title: '老板表'
        })
        thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({show: false})
        if (sessionStorage.getItem('prevPage') == 'home') {
            sessionStorage.removeItem('prevPage')
            this.props.dispatch(bossActions.getPeriodAndBossSheetFetch())
            // this.props.dispatch(acAllActions.getAcListandAsslistFetch())
        } else {
            this.props.dispatch(bossActions.getBossSheetFetch(this.props.bossState.get('issuedate'), this.props.bossState.get('bossSelectAssIndex')))
        }
    }

    render() {
        const {
            allState,
            bossState,
            dispatch,
            history
        } = this.props

        const issues = allState.get('issues')
        const issuedate = bossState.get('issuedate')
        const bosssheet = bossState.get('bosssheet')
        const bossSelectAssIndex = bossState.get('bossSelectAssIndex')
        const bossAssList = bossState.get('bossAssList')

        const itemList = {
            'cash': [],
            'deposit': [],
            'inventory': [],
            'income': [],
            'otherincome': [],
            'cost': [],
            'othercost': [],
            'businesstax': [],
            'salesExpenses': [],
            'manageExpenses': [],
            'financeExpenses': [],
            'investment': [],
            'receivables': [],
            'payables': []
        }

        if (bosssheet) {
            bosssheet.forEach(v => {
                itemList[
                    ({
                        '1001': 'cash', //现金
                        '1002': 'deposit', //存款
                        '1405': 'inventory', //库存
                        '5001': 'income', //主营收入
                        '5051': 'otherincome', //其它业务收入
                        '5401': 'cost', //主营成本
                        '5402': 'othercost', //其它业务成本
                        '5403': 'businesstax', //营业税金
                        '5601': 'salesExpenses', //销售费用
                        '5602': 'manageExpenses', //管理费用
                        '5603': 'financeExpenses', //财务费用
                        '5111': 'investment', //投资收益
                        '1122': 'receivables', //应收账款
                        '2202': 'payables' //应付账款
                    })[v.get('acid')]
                ].push(v)
            })
        }
        const balaList = fromJS(itemList)

        // 提取通过传入等名称获取各项等closingbalance
        function amount(item) {
            if (balaList.get(item).size) {
                return balaList.get(item).getIn(['0', 'balance'])
            } else {
                return '0'
            }
        }

        const totolIncome = bossState.get('income')
        const totolOutpay = bossState.get('expenditure')
        const operatingProfit = totolIncome - totolOutpay
        // 从boss表跳到明细表
        function jumpMxb(acid) {
            if (!balaList.get(acid).size)
                return
            sessionStorage.setItem('previousPage', 'kmyeb')
            const _acid = balaList.get(acid).getIn(['0', 'acid'])
            dispatch(kmmxbActions.getMxbAclistFetch(issuedate, issuedate, _acid))
            dispatch(kmmxbActions.changeAcMxbChooseValue('ISSUE'))
            history.push('/kmmxb')
        }
        const bossStyleName = bossAssList.size > 1 ? 'boss-lr-ass' : 'boss-lr'
        const bossListStyle = bossAssList.size > 1 ? 'boss-icon-list-ass' : 'boss-icon-list'

        const bossSource = bossAssList.map((v, i) => {return {value: `${i}`, key: v.get('assname')}})

        return (
			<Container className="boss">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => dispatch(bossActions.getBossSheetFetch(value, bossSelectAssIndex.toString()))}
					onOk={(result) => dispatch(bossActions.getBossSheetFetch(result.value, bossSelectAssIndex.toString()))}
				/>
				<ScrollView className="boss">
					<div className={bossAssList.size > 1 ? "boss-top-ass" : "boss-top"}>
						<div className="asset">
                            <div className="asset-item" onClick={() => jumpMxb('receivables')}>
								<Icon className="asset-icon" color="#FF943E" size="24" type="receivables"/>
								<Amount showZero className="amount">{amount('receivables')}</Amount>
                                <span className="label text-underline">应收账款</span>
							</div>
							<div className="asset-item" onClick={() => jumpMxb('deposit')}>
								<Icon className="asset-icon" color="#F65E5E" size="24" type="batchpaytobank"/>
								<Amount showZero className="amount">{amount('deposit')}</Amount>
                                <span className="label text-underline">银行存款</span>
							</div>
							<div className="asset-item" onClick={() => jumpMxb('inventory')}>
								<Icon className="asset-icon" color="#13B5B1" size="24" type="inventory"/>
								<Amount showZero className="amount">{amount('inventory')}</Amount>
                                <span className="label text-underline">库存商品</span>
							</div>
                            <div className="asset-item" onClick={() => jumpMxb('payables')}>
								<Icon className="asset-icon" color="#78919D" size="24" type="payable"/>
								<Amount showZero className="amount">{amount('payables') ? amount('payables') : 0}</Amount>
                                <span className="label text-underline">应付账款</span>
							</div>
						</div>
					</div>
                    <SinglePicker
                        district={bossSource}
                        onOk={(result) => dispatch(bossActions.getBossSheetFetch(issuedate, result.value))}
                        style={{display: bossAssList.size > 1 ? '' : 'none'}}
                    >
                        <Row
                            className="bassselect"
                            // onClick={() => {
                            //     thirdparty.chosen({
                            //         source: bossSource,
                            //         onSuccess: (result) => dispatch(bossActions.getBossSheetFetch(issuedate, result.value)),
                            //         onFail: (err) => alert(err)
                            //     })
                            // }}
                        >
                            <span className="lrbselect-assmane">{bossAssList.size > 1 ? bossAssList.getIn([bossSelectAssIndex, 'assname']) : ''}</span>
                            <Icon className="lrbselect-icon" type="triangle" size="11"></Icon>
                        </Row>
                    </SinglePicker>
                    <div className="boss-botton">
						<div className={operatingProfit > 0 ? `${bossStyleName} boss-lrbg-kaixin` : `${bossStyleName} boss-lrbg-kuqi`}>
                            <p className={`${bossStyleName}-tip`}>{operatingProfit <= 0 ? '汲取教训，不妨先来定个小目标！' : '报告老板，离小目标又进一步啦！'}</p>
                            <div className={`${bossStyleName}-main`}>
                                <span>营业利润</span>
                                <span><Amount showZero style={{color: '#fff'}}>{operatingProfit}</Amount></span>
                            </div>
                        </div>

						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left" onClick={() => jumpMxb('income')}>
                                <Amount showZero className="amount-item">{amount('income')}</Amount>
                                <span className="boss-icon-list-tip text-underline">主营收入</span>
                            </li>
							<li className="boss-icon-list-icon icon-first"><Icon color="#fff" style={{background:'#F29B76'}} type="income"/></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('cost')}>
                                <span className="boss-icon-list-tip text-underline">主营成本</span>
                                <Amount showZero className="amount-item">{amount('cost')}</Amount>
							</li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left" onClick={() => jumpMxb('otherincome')}>
                                <Amount showZero className="amount-item">{amount('otherincome')}</Amount>
                                <span className="boss-icon-list-tip text-underline">其它收入</span>
                            </li>
							<li className="boss-icon-list-icon"><Icon color="#fff" style={{background:'#E9CE88'}} type="expenses"/></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('othercost')}>
                                <span className="boss-icon-list-tip text-underline">其他成本</span>
                                <Amount showZero className="amount-item">{amount('othercost')}</Amount>
							</li>
						</ul>
						<ul className={bossListStyle}>
							<li className="boss-icon-list-left"></li>
							<li className="boss-icon-list-icon"><Icon color="#fff" style={{background:'#AFC3C4'}} type="business-tax"/></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('businesstax')}>
                                <span className="boss-icon-list-tip text-underline">营业税金</span>
                                <Amount showZero className="amount-item">{amount('businesstax')}</Amount>
                            </li>
						</ul>
						<ul className={bossListStyle}>
							<li className="boss-icon-list-left"></li>
							<li className="boss-icon-list-icon"><Icon color="#fff" style={{background:'#94D7C9'}} size='17' type="selling-expenses"/></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('salesExpenses')}>
                                <span className="boss-icon-list-tip text-underline">销售费用</span>
                                <Amount showZero className="amount-item">{amount('salesExpenses')}</Amount>
                            </li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left"></li>
							<li className="boss-icon-list-icon"><Icon color="#fff" style={{background:'#FDB79A'}} type="management-feet"/></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('manageExpenses')}>
                                <span className="boss-icon-list-tip text-underline">管理费用</span>
                                <Amount showZero className="amount-item">{amount('manageExpenses')}</Amount>
                            </li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left"></li>
							<li className="boss-icon-list-icon"><Icon color="#fff" style={{background:'#8DC9D4'}} type="financial-expenses"/></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('financeExpenses')}>
                                <span className="boss-icon-list-tip text-underline">财务费用</span>
                                <Amount showZero className="amount-item">{amount('financeExpenses')}</Amount>
                            </li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left" onClick={() => jumpMxb('investment')}>
                                <Amount showZero className="amount-item">{amount('investment')}</Amount>
                                <span className="boss-icon-list-tip text-underline">投资收益</span>
                            </li>
							<li className="boss-icon-list-icon"><Icon color="#fff" style={{background:'#FFADAD'}} type="income-from-investment"/></li>
                            <li className="boss-icon-list-right"></li>
						</ul>
					</div>
				</ScrollView>
                <div className="boss-botton-sobmoney">
                    <div className="boss-botton-sobmoney-money-left">
                        <Amount showZero className="boss-botton-sobmoney-money-txt">{totolIncome}</Amount>
                        <span>&nbsp;收入合计</span>
                    </div>
                    <div className="boss-botton-sobmoney-money-right">
                        <span>支出合计&nbsp;</span>
                        <Amount showZero className="boss-botton-sobmoney-money-txt">{totolOutpay}</Amount>
                    </div>
                </div>
			</Container>
		)
	}
}

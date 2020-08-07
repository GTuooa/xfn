import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { fromJS, toJS, Map } from 'immutable'
import thirdParty from 'app/thirdParty'
import './boss.less'
import '../sheet.less'
import { Amount } from 'app/components'

import { Icon, ButtonGroup, Button, Container, ScrollView, Row, SinglePicker } from 'app/components'
import { TopMonthPicker } from 'app/containers/components'
import * as jrBossActions from 'app/redux/Report/JrBoss/jrBoss.action'
import * as runningTypeMxbActions from 'app/redux/Mxb/RunningTypeMxb/runningTypeMxb.action.js'

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
            if (sessionStorage.getItem('prevPage') === 'home') {
                this.props.dispatch(jrBossActions.getPeriodAndJrBossSheetFetch())
            }
            sessionStorage.removeItem('prevPage')
            //
    }

    render() {
        const {
            allState,
            jrBossState,
            dispatch,
            history
        } = this.props

        const issues = allState.get('issues')
        const issuedate = jrBossState.get('issuedate')
        const bosssheet = jrBossState.get('bosssheet')
        const bossSelectAssIndex = jrBossState.get('bossSelectAssIndex')
        const bossAssList = jrBossState.get('bossAssList')
        const balaList = fromJS({})
        // 提取通过传入等名称获取各项等closingbalance
        // function amount(item) {
        //     if (balaList.get(item).size) {
        //         return balaList.get(item).getIn(['0', 'balance'])
        //     } else {
        //         return '0'
        //     }
        // }
        function amount(name) {
            const item = bosssheet.find(v => v.get('linename') === name) || fromJS({})
            return item.get('accumulation')
        }
        // 从boss表跳到明细表
        function jumpMxb(name) {
            const item = bosssheet.find(v => v.get('linename') === name) || fromJS({})
            const acId = item.get('childList') && item.get('childList').size ? item.get('childList').map(v => v.get('acId')).join(',') : item.get('acId')
            const direction = item.get('direction')
            sessionStorage.setItem('previousPage', 'runningTypeMxb')
            dispatch(runningTypeMxbActions.changeRunningTypeMxbCommonState('views','fromPage','boss'))
            dispatch(runningTypeMxbActions.getJrRunningTypeList(issuedate, issuedate,acId,direction,1,true))
            dispatch(runningTypeMxbActions.getJrAcList(issuedate, issuedate,acId))
            // dispatch(kmmxbActions.getMxbAclistFetch(issuedate, issuedate, _acid))
            // dispatch(kmmxbActions.changeAcMxbChooseValue('ISSUE'))
            history.push('/runningTypeMxb')
        }
        const bossStyleName = bossAssList.size > 1 ? 'boss-lr-ass' : 'boss-lr'
        const bossListStyle = bossAssList.size > 1 ? 'boss-icon-list-ass' : 'boss-icon-list'

        const bossSource = bossAssList.map((v, i) => {return {value: `${i}`, key: v.get('assname')}})
        return (
			<Container className="jr-boss">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => dispatch(jrBossActions.getJrBossSheetFetch(value))}
					onOk={(result) => dispatch(jrBossActions.getJrBossSheetFetch(result.value))}
				/>
				<ScrollView className="boss">
					<div className={bossAssList.size > 1 ? "boss-top-ass" : "boss-top"}>
						<div className="asset">
                            <div className="asset-item" onClick={() => jumpMxb('应收业务款')}>
                                <span className="boss-img"><div className='img-ywk'></div></span>
								<Amount showZero className="amount">{amount('应收业务款')}</Amount>
                                <span className="label text-underline">应收业务款</span>
							</div>
							<div className="asset-item" onClick={() => jumpMxb('货币资金')}>
                                <span className="boss-img"><div className='img-hbzj'></div></span>
								<Amount showZero className="amount">{amount('货币资金')}</Amount>
                                <span className="label text-underline">货币资金</span>
							</div>
							<div className="asset-item" onClick={() => jumpMxb('存货')}>
                                <span className="boss-img"><div className='img-ch'></div></span>
								<Amount showZero className="amount">{amount('存货')}</Amount>
                                <span className="label text-underline">存货</span>
							</div>
                            <div className="asset-item" onClick={() => jumpMxb('应付业务款')}>
                                <span className="boss-img"><div className='img-yfk'></div></span>
								<Amount showZero className="amount">{amount('应付业务款') ? amount('应付业务款') : 0}</Amount>
                                <span className="label text-underline">应付业务款</span>
							</div>
						</div>
					</div>
                    <SinglePicker
                        district={bossSource}
                        // onOk={(result) => dispatch(jrBossActions.getBossSheetFetch(issuedate, result.value))}
                        style={{display: bossAssList.size > 1 ? '' : 'none'}}
                    >
                        <Row
                            className="bassselect"
                            // onClick={() => {
                            //     thirdparty.chosen({
                            //         source: bossSource,
                            //         onSuccess: (result) => dispatch(jrBossActions.getBossSheetFetch(issuedate, result.value)),
                            //         onFail: (err) => alert(err)
                            //     })
                            // }}
                        >
                            <span className="lrbselect-assmane">{amount('净利润')> 0 ? bossAssList.getIn([bossSelectAssIndex, 'assname']) : ''}</span>
                            <Icon className="lrbselect-icon" type="triangle" size="11"></Icon>
                        </Row>
                    </SinglePicker>
                    <div className="boss-botton">
						<div className={amount('净利润')> 0 ? `${bossStyleName} boss-lrbg-kaixin` : `${bossStyleName} boss-lrbg-kuqi`}>
                            <div className={`${bossStyleName}-main`}>
                                <span>净利润</span>
                                <span><span style={{fontSize:'0.1rem',marginRight:'0.05rem'}}>¥</span><Amount showZero style={{color: '#fff'}} isBillion>{amount('净利润')}</Amount></span>
                            </div>
                            <p className={`${bossStyleName}-tip`}>{amount('净利润') <= 0 ? '汲取教训，不妨先来定个小目标！' : '报告老板，离小目标又进一步啦！'}</p>
                        </div>

						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left" onClick={() => jumpMxb('主营收入')}>
                                <Amount isBillion showZero className="amount-item">{amount('主营收入')}</Amount>
                                <span className="boss-icon-list-tip text-underline">营业收入</span>
                            </li>
                            <li className="boss-img"><div className='img-money'></div></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('主营成本')}>
                                <span className="boss-icon-list-tip text-underline">营业成本</span>
                                <Amount isBillion showZero className="amount-item">{amount('主营成本')}</Amount>
							</li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left"></li>
                            <li className="boss-img img-line"><div className='img-sj'></div></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('营业税金')}>
                                <span className="boss-icon-list-tip text-underline">营业税金</span>
                                <Amount isBillion showZero className="amount-item">{amount('营业税金')}</Amount>
							</li>
						</ul>
						<ul className={bossListStyle}>
							<li className="boss-icon-list-left"></li>
                            <li className="boss-img img-line"><div className='img-xsfy'></div></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('销售费用')}>
                                <span className="boss-icon-list-tip text-underline">销售费用</span>
                                <Amount isBillion showZero className="amount-item">{amount('销售费用')}</Amount>
                            </li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left"></li>
                            <li className="boss-img img-line"><div className='img-people'></div></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('管理费用')}>
                                <span className="boss-icon-list-tip text-underline">管理费用</span>
                                <Amount isBillion showZero className="amount-item">{amount('管理费用')}</Amount>
                            </li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left"></li>
                            <li className="boss-img img-line"><div className='img-cw'></div></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('财务费用')}>
                                <span className="boss-icon-list-tip text-underline">财务费用</span>
                                <Amount isBillion showZero className="amount-item">{amount('财务费用')}</Amount>
                            </li>
						</ul>
						<ul className={bossListStyle}>
                            <li className="boss-icon-list-left" onClick={() => jumpMxb('其他收益')}>
                                <Amount isBillion showZero className="amount-item">{amount('其他收益')}</Amount>
                                <span className="boss-icon-list-tip text-underline">其他收益</span>
                            </li>
                            <li className="boss-img img-line"><div className='img-loss'></div></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('其他损失')}>
                                <span className="boss-icon-list-tip text-underline">其他损失</span>
                                <Amount isBillion showZero className="amount-item">{amount('其他损失')}</Amount>
                            </li>
						</ul>
                        <ul className={bossListStyle}>
                            <li className="boss-icon-list-left"></li>
                            <li className="boss-img img-line"><div className='img-sds'></div></li>
                            <li className="boss-icon-list-right" onClick={() => jumpMxb('所得税费用')}>
                                <span className="boss-icon-list-tip text-underline">所得税费</span>
                                <Amount isBillion showZero className="amount-item">{amount('所得税费用')}</Amount>
                            </li>
						</ul>
					</div>
				</ScrollView>
                <div className="boss-botton-sobmoney">
                    <div className="boss-botton-sobmoney-money-left">
                        <Amount showZero isBillion className="boss-botton-sobmoney-money-txt">{amount('收入合计')}</Amount>
                        <span className='boss-icon-list-tip'>&nbsp;收入合计</span>
                    </div>
                    <div className="boss-botton-sobmoney-money-right">
                        <span className='boss-icon-list-tip'>支出合计&nbsp;</span>
                        <Amount isBillion showZero className="boss-botton-sobmoney-money-txt">{amount('支出合计')}</Amount>
                    </div>
                </div>
			</Container>
		)
	}
}

import React, { PropTypes } from 'react'
import { Map,List } from 'immutable'
import { connect } from 'react-redux'

import * as jzActions from 'app/redux/Config/Jz/jz.action'
import * as allActions from 'app/redux/Home/All/all.action'

import { Button, Tooltip, Input } from 'antd'
import { toJS } from 'immutable'
import { TableWrap, TableBody, TableTitle, TableItem, TableOver, TableAll, TableTree, Icon } from 'app/components'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import RateItem from './RateItem.jsx'
import { judgePermission } from 'app/utils'
import './style/index.less'

@connect(state => state)
export default
class Jz extends React.Component {

	componentDidMount() {
		if (!this.props.jzState.getIn(['flags', 'circleStatus'])) {
			this.props.dispatch(jzActions.getCurrencyListFetch())
			// this.props.dispatch(allActions.getAcListFetch())
		}
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.jzState != nextprops.jzState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { dispatch, allState, jzState, homeState } = this.props

		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const detailList = homeState.getIn(['data', 'userInfo', 'pageController', 'MANAGER', 'preDetailList', 'CLOSE_SOB', 'detailList'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const period = allState.get('period')
		const openedyear = period.get('openedyear')
		const openedmonth = period.get('openedmonth')
		const closedyear = period.get('closedyear')
		const closedmonth = period.get('closedmonth')
		const periodStartMonth = period.get('periodStartMonth')

		// 结账页日期显示原则为：首先显示period的openedyear，如果其为空则显示closedyear
		const showyear = openedyear || closedyear
		const showmonth = openedmonth || closedmonth

		//调汇
		const titleList = ['编码', '名称', '默认汇率', '调整汇率']
		const acList = allState.get('aclist')
		const circleStatus = jzState.getIn(['flags', 'circleStatus'])
		const fcList = jzState.get('fcList')
		const acItem = acList.filter(v => v.get('acid') == 560303)

		return (
			<ContainerWrap type="config-one">
				<FlexTitle>
					<div className="flex-title-left">
						<span className="jz-title-date">
							<span>{showyear}年{showmonth}月</span>
						</span>
					</div>
					<div className="flex-title-right">
						<Tooltip placement="bottom" title={judgePermission(detailList.get('OPENING')).disabled ? '当前角色无该权限' : (!closedyear ? '没有可反结账的账期' : '')}>
							<Button
								disabled={judgePermission(detailList.get('OPENING')).disabled || !closedyear}
								className="title-right three-word-btn" type="ghost"
								onClick={() => dispatch(jzActions.openSobFetch(closedyear, closedmonth))}
								>
								反结账
							</Button>
						</Tooltip>
						<Tooltip placement="bottom" title={judgePermission(detailList.get('CLOSING')).disabled ? '当前角色无该权限' : (!openedyear ? '没有可结账的账期' : '')}>
							<Button
								disabled={judgePermission(detailList.get('CLOSING')).disabled || !openedyear}
								className="title-right" type="ghost"
								onClick={() => dispatch(jzActions.closeSobFetch(openedyear, openedmonth, fcList, circleStatus))}
								>
								结账
							</Button>
						</Tooltip>
						<Button className="title-right" type="ghost"
							onClick={() => {
								dispatch(jzActions.getBalanceStatus())
								if (!circleStatus) { //获取期末调汇
									dispatch(jzActions.getCurrencyListFetch())
								}
								dispatch(allActions.closeConfigPage('结账'))
							}}
							>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<div className="jzlayer">
					<div className="jz-list">
						<div className="jz-list-left">利润结转至:</div>
						<div className="jz-list-right">3103_本年利润</div>
					</div>
					<div className="jz-list">
						<div className="jz-list-left">全年利润结转至:</div>
						<div className="jz-list-right">310405_未分配利润</div>
					</div>
				</div>
				<ul className="uses-tip jz-uses-tip">
					<li>结账将自动生成收益凭证及损失凭证；</li>
					{/* <li>若收益为零，则生成 3103_本年利润 至 3103_本年利润 的空收益凭证；</li>
					<li>若损失为零，则生成 3103_本年利润 至 3103_本年利润 的空损失凭证；</li>
					<li>结账第十二期，将自动将 3103_本年利润 结转至 310405_未分配利润。</li> */}
					<li>{periodStartMonth == 1 ? 12 : periodStartMonth-1}月结账，将自动将 3103_本年利润 结转至 310405_未分配利润。</li>
					<li className="uses-tip-blod">请确保3103，310405科目存在，否则将不能正常结账</li>
				</ul>
				{
					moduleInfo && moduleInfo.indexOf('CURRENCY') > -1 ?
					<div className="jz-rate">
						<span onClick={() => {
							if (acItem) {
								// dispatch(jzActions.getCurrencyListFetch())
								if (circleStatus) {
									dispatch(jzActions.getCurrencyListFetch())
								}
								dispatch(jzActions.changeIcon())
							}
						}}>
							{
								circleStatus ?
								<b className="jz-rate-circle"/> :
								<Icon type="check-circle" style={{fontSize:'17px', color:'#ff6767', margin: '0 5px'}}/>
							}
							<span>期末调汇</span>
						</span>
						<span>（结账操作后，外币的期末余额将按调整汇率进行折算生成汇兑损益凭证，请确保560303科目存在）</span>
					</div> : ''
				}
				<div className="jzlayer" style={{display: circleStatus ? 'none' : ''}}>
					<div className="jz-list">
						<div className="jz-list-left">汇兑损益科目：</div>
						<div className="jz-list-right">560303_汇兑损益</div>
						{/* <div className="jz-list-right">{`${acItem.getIn([0, 'acid'])}_${acItem.getIn([0, 'acname'])}`}</div> */}
					</div>
				</div>
				{
					circleStatus ? null :
					<TableWrap className="table-jz-wrap" notPosition={true}>
						<TableAll>
							<TableTitle
								className="rate-tabel-width"
								hasCheckbox={false}
								titleList={titleList}
								onClick={() => true}
							/>
							<TableBody>
								{
									fcList.map((u,i) => (
										<RateItem
											key={i}
											idx={i}
											line={i}
											item={u}
											dispatch={dispatch}
										/>
									))
								}

							</TableBody>
						</TableAll>
					</TableWrap>
				}
			</ContainerWrap>
		)
	}
}
// 获取当前年月
// const today = new Date()
// const todayis = new DateLib(today).toString()
// const year = todayis.substr(0,4)
// const month = todayis.substr(5,2)

// 结账页日期显示原则为：首先显示period的openedyear，如果其为空则显示closedyear，如果两者都为空则显示当前年月
// const showyear = openedyear || closedyear || year
// const showmonth = openedmonth || closedmonth || month
{/*<Button	style={{display: 'none'}}
	onClick={() => {
		global.Proxy = Proxy
		global.Reflect = Reflect
		var target = function () { return 'I am the target'; };
		var handler = {
			apply: function () {
				return 'I am the proxy';
			}
		}
		var p = new Proxy(target, handler)
		console.log('start testing')
		console.log(target())
		console.log(p())
	}}>
	test
</Button>*/}

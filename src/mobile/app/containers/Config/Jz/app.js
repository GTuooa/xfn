import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import './jz.less'
import * as jzActions from 'app/redux/Config/Jz/jz.action'
import * as thirdParty from 'app/thirdParty'
import { Container, Row, Column, Icon, ButtonGroup , Button, ScrollView, TipWrap } from 'app/components'
import { DateLib } from 'app/utils'
import RateItem from './RateItem.jsx'

@connect(state => state)
export default
class Jz extends React.Component {

	componentDidMount() {
        thirdParty.setTitle({title: '结账'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})
        this.props.dispatch(jzActions.getBalanceStatus())
    }

	constructor() {
		super()
		this.state = {
			circleStatus: false
		}
	}

	render() {
        const {
            allState,
            dispatch,
			jzState,
			homeState
        } = this.props
		const { circleStatus } = this.state

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])

		const period = allState.get('period')

		const openedyear = period.get('openedyear')
		const openedmonth = period.get('openedmonth')
		const closedyear = period.get('closedyear')
		const closedmonth = period.get('closedmonth')
		// 获取当前年月
		const today = new Date()
		const todayis = new DateLib(today).toString()
		const year = todayis.substr(0,4)
		const month = todayis.substr(5,2)
		//会计年度
		const periodStartMonth = allState.getIn(['period', 'periodStartMonth'])
		// 结账页日期显示原则为：首先显示period的openedyear，如果其为空则显示closedyear，如果两者都为空则显示当前年月
		const showyear = openedyear || closedyear || year
		const showmonth = openedmonth || closedmonth || month

		//调汇
		const titleList = ['编码', '名称', '默认汇率', '调整汇率']
		const acList = allState.get('aclist')
		const fcList = jzState.get('fcList')
		const acItem = acList.filter(v => v.get('acid') == 560303)
// console.log(fcList.toJS())


		return (
			<Container className="jz ass-config">
				<Row className="header">
					<span>{showyear}/{showmonth}</span>
				</Row>
				<ScrollView className="content" flex='1'>
					<div className="jzlist">
						<div className="jzlist-item"><span>当前可结账账期</span><span>{`: ${openedyear ? openedyear + '年' + openedmonth + '月' : '无'}`}</span></div>
						<div className="jzlist-item"><span>当前可反结账账期</span><span>{`: ${closedyear ? closedyear + '年' + closedmonth + '月' : '无'}`}</span></div>
					</div>
					<ul className="form-tip">
						<li className="form-tip-item">
							结账将自动生成收益凭证及损失凭证；
						</li>
					</ul>
					<div className="jzlist-second">
						<div className="jzlist-item"><span>利润结转至</span><span>: 3103_本年利润 </span></div>
						<div className="jzlist-item"><span>全年利润结转至</span><span>: 310405_未分配利润</span></div>
					</div>
					{/* <ul className="form-tip"> */}
					<TipWrap>
						{/* <li className="form-tip-item">
							若收益为零，则生成 3103_本年利润 至 3103_本年利润 的空收益凭证；
						</li>
						<li className="form-tip-item">
							若损失为零，则生成 3103_本年利润 至 3103_本年利润 的空损失凭证；
						</li>
						<li className="form-tip-item">
							结账第十二期，将自动将 3103_本年利润 结转至 310405_未分配利润。
						</li> */}
						{/* <li className="form-tip-item">年末结账，将自动将 3103_本年利润 结转至 310405_未分配利润。</li>  */}
						<li className="form-tip-item">{periodStartMonth == 1 ? 12 : periodStartMonth-1}月结账，将自动将 3103_本年利润 结转至 310405_未分配利润。</li>
						<li className="form-tip-item">请确保3103，310405科目存在，否则将不能正常结账</li>

					</TipWrap>
					{
						moduleInfo && moduleInfo.indexOf('CURRENCY') > -1 ?
						<div
							className="jz-rate"
							onClick={() => {
								if (acItem) {
									dispatch(jzActions.getCurrencyListFetch())
									this.setState({circleStatus: !circleStatus})
								}
							}}
							>
							<p className="jz-rate-icon">
								<span className="jz-rate-icon-circle" style={{display: circleStatus ? 'none' : ''}}></span>
								<Icon type="xuanze" color="#FF6767" style={{display: circleStatus ? '' : 'none'}}></Icon>
							</p>
							<p className="jz-rate-info">
								<span>期末调汇</span>
								<span>（结账操作后，外币的期末余额将按调整汇率进行折 算生成汇兑损益凭证，请确保 560303 科目存在）</span>
							</p>
						</div> : ''
					}
					<div className="jzlist rate-acid" style={{display: circleStatus ? '' : 'none'}}>
						<div className="jzlist-item"><span>汇兑损益科目</span><span>: 560303_汇兑损益 </span></div>
					</div>
					<div className="rate-wrap" style={{display: circleStatus ? '' : 'none'}}>
						<div className='rate-item rate-title'>
							<span>编码</span>
							<span>名称</span>
							<span>当前默认汇率</span>
							<span>调整汇率</span>
						</div>
						<div className="rate-table">
							{fcList.map((u,i) =>
								<RateItem
									key={i}
									idx={i}
									item={u}
									dispatch={dispatch}
								/>
							)}
						</div>
					</div>

				</ScrollView>
				<Row className="footer">
					<ButtonGroup style={{height: 50}}>
						<Button disabled={!editPermission || !openedyear} onClick={() => dispatch(jzActions.closeSobFetch(openedyear, openedmonth, fcList, circleStatus))}><Icon type="settlement"></Icon><span>结账</span></Button>
						<Button disabled={!editPermission || !closedyear} onClick={() => dispatch(jzActions.openSobFetch(closedyear, closedmonth))}><Icon type="anti-settlement"></Icon><span>反结账</span></Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}

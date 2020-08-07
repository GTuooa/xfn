import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Tabs, Modal, Button, Icon } from 'antd'
const TabPane = Tabs.TabPane
import AmbLineChar from './AmbLineChar'
import AmbBarChar from './AmbBarChar'
import AmbsybInnerNone from './AmbsybInnerNone'

@immutableRenderDecorator
export default
class SecondSection extends React.Component {

	constructor() {
		super()
		this.state = {activeKey: '收入', showModal: false}
	}

	render() {

		const { activeKey, showModal } = this.state
		const { incomeBigger, detailDrawing, trendMap, issuedate, endissuedate, didMount, hide, onClick } = this.props

		// 折线图
		const lineData = ({
			'收入': () => trendMap.get('incomeForMonth'),
			'支出': () => trendMap.get('payForMonth'),
			'损益': () => trendMap.get('ginAndLossForMonth')
		}[activeKey])()

		let isCutLineData = lineData.size === 12 ? true : false

		lineData.size === 12 && lineData.forEach((v, i) => {
			if (i < 6 && v.get('amount') !== 0) {
				isCutLineData = false
			}
		})

		// 柱状图
		const barData = ({
			'收入': () => detailDrawing.get('incomeForMonth'),
			'支出': () => detailDrawing.get('payForMonth'),
			'损益': () => detailDrawing.get('ginAndLossForMonth') ? detailDrawing.get('ginAndLossForMonth') : fromJS([])
		}[activeKey])()

		// const beginDate = lineData.size ? lineData.getIn([isCutLineData ? 6 : 0, 'name']) : ''
		//统一显示12个月
		const beginDate = lineData.size ? lineData.getIn([ 0, 'name']) : ''
		const endData = lineData.size ? lineData.getIn([-1, 'name']) : ''

		return (
			<div className={"ambsyb-secondsection"}>
				<div className="ambsyb-secondsection-title">
					<Tabs
						onChange={(key) => this.setState({activeKey: key})}
						type="card"
						activeKey={activeKey}
						>
						<TabPane tab="收入" key="收入"></TabPane>
						<TabPane tab="支出" key="支出"></TabPane>
						<TabPane tab="损益" key="损益"></TabPane>
					</Tabs>
				</div>
				<div className="ambsyb-secondsection-main">
					<div className="ambsyb-secondsection-left">
						<div className="ambsyb-secondsection-chartitle">
							<h4>
								{activeKey}走势图

								<span className="ambsyb-secondsection-chartitle-date">
									{issuedate ?
										`（${beginDate.substr(0,4)}.${beginDate.substr(4,2)}～${endData.substr(0,4)}.${endData.substr(4,2)}）` :
										''
									}
								</span>
							</h4>
						</div>
						{
							didMount ?
							<AmbLineChar
								status={activeKey}
								incomeBigger={incomeBigger}
								isCutLineData={isCutLineData}
								lineData={lineData}
							/> : ''
						}
					</div>
					<div className="ambsyb-secondsection-right">
						<div className="ambsyb-secondsection-chartitle">
							<h4>
								{activeKey}比较图
								<span className="ambsyb-secondsection-chartitle-date">
								{issuedate ? (issuedate === endissuedate ?
									`（${issuedate.substr(0,4)}.${issuedate.substr(6,2)})`:
									`（${issuedate.substr(0,4)}.${issuedate.substr(6,2)}～${endissuedate.substr(0,4)}.${endissuedate.substr(6,2)}）`) : ''}</span>
							</h4>
							<Button style={{display: barData.size > 6 ? '' : 'none'}} type="ghost" onClick={() => this.setState({showModal: true})}>查看全部</Button>
						</div>
						{
							didMount ? (
								!barData.size && activeKey === '损益' ?
								<AmbsybInnerNone/> :
								<AmbBarChar
									className="ambsyb-char"
									incomeBigger={true}
									status={activeKey}
									incomeBigger={incomeBigger}
									barData={barData}
									sliceSix={true}
								/>
							) : ''
						}
					</div>
				</div>
				<Modal
					okText="保存"
					visible={showModal}
					maskClosable={false}
					title='查看全部'
					onCancel={() => this.setState({showModal: false})}
					footer={[
						<Button key="cancel" type="ghost" onClick={() => this.setState({showModal: false})}>
							关 闭
						</Button>
					]}
					>
					<AmbBarChar
						incomeBigger={incomeBigger}
						status={activeKey}
						assId={'1'}
						barData={barData}
					/>
				</Modal>

			</div>
		)
	}
}

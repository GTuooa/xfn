import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Row, Icon, ScrollView, Amount } from 'app/components'
import { ylProject } from 'app/containers/Edit/Lrls/components'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Jzsy extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false,
		}
    }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList } = this.state

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const categoryName = data.get('categoryName')
		const hxList = data.get('businessList')

		const amount = data.getIn(['acAssets', 'cleaningAmount'])//列表的合计
		const originalAssetsAmount = data.getIn(['acAssets', 'originalAssetsAmount'])
		const depreciationAmount = data.getIn(['acAssets', 'depreciationAmount'])
		let totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let showName = `${projectCard.getIn([0, 'code'])} ${projectCard.getIn([0, 'name'])}`
			if (projectCard.getIn([0, 'name']) == '项目公共费用') {
				showName = '项目公共费用'
			}
			ProjectCom = <div className='ylls-padding'>项目： {showName} </div>
		}

		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>长期资产处置损益</div>
						<div></div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						{/* <div>{runningDate}</div> */}
					</div>
					<div className='ylls-padding'>处理类别： {categoryName} </div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					{ ProjectCom }
					<div className='ylls-padding'>
						{totalAmount >= 0 ? '净收益金额：' : '净损失金额：'}
						<Amount showZero>{Math.abs(totalAmount)}</Amount>
					</div>
					<div className='ylls-padding'>资产原值： <Amount showZero>{originalAssetsAmount}</Amount> </div>
					<div className='ylls-padding'>累计折旧摊销： <Amount showZero>{depreciationAmount}</Amount> </div>
				</Row>

				<Row className='ylls-card'>
					<div className='ylls-item' onClick={() => this.setState({'showList': !showList})}>
						<div>金额合计：<Amount showZero>{amount}</Amount></div>
						<div>
							{showList ? '收起' : '展开'}
							<Icon style={showList ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/>
						</div>
					</div>
					<div style={{display: showList ? '' : 'none'}}>
						{
							hxList.map((v,i) => {
								return (<div key={i} className='ylls-top-line'>
											<div className='ylls-item ylls-padding'>
												<div className='overElli'>{v.get('categoryName')}</div>
												<div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
											</div>
											<div className='ylls-item'>
												<span className='ylls-blue'></span>
												<div><Amount className='ylls-bold' showZero>{v.get('amount')-v.get('tax')}</Amount></div>
											</div>
										</div>)
								}
							)
						}
					</div>
				</Row>
				{
					data.get('enclosureList') && data.get('enclosureList').size ?
					<Ylfj
						enclosureList={data.get('enclosureList')}
						label={data.get('label')}
						dispatch={dispatch}
						history={history}
					/> : ''
				}
			</ScrollView>
		)
	}
}

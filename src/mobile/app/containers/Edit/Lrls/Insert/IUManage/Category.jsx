import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import {  Checkbox, Row, Icon, Button, ButtonGroup, Container, ScrollView } from 'app/components'
import { DateLib, configCheck } from 'app/utils'
import * as thirdParty from 'app/thirdParty'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

@connect(state => state)
export default
class Relation extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: [],//需要展示下级的uuid 列表
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '选择类别'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({
            showIcon: false
        })
    }


	render () {
		const { dispatch, homeAccountState, history } = this.props
		const { showList } = this.state


		const treeIdx = homeAccountState.getIn(['iuManage', 'treeIdx'])
		const cardTypeTree = homeAccountState.getIn(['iuManageTreeList', treeIdx, 'value'])

		const loop = (data, paddingLeft) => data.map((item, i) => {
			if (item.get('childList') && item.get('childList').size) {
				const showChild = showList.some(v => v === item.get('uuid'))

				return (
					<div key={item.get('uuid')} style={{backgroundColor: '#fff'}}>
						<div
							className='type-list'
							style={{paddingLeft: `${paddingLeft}rem`}}
							onClick={() => {
								let arr = showList
								if (showChild) {
									let idx = arr.findIndex(v => v === item.get('uuid'))
									arr.splice(idx, 1)
								} else {
									arr.push(item.get('uuid'))
								}
								this.setState({showList: arr})
							}}
						>
							<div className='touch-range-name' style={{color:'#999'}}>
								<span className="high-type-name">{item.get('name')}</span>
							</div>
							<div className="touch-range-icon">
								<Icon type="arrow-down"
									style={showChild ? {transform: 'rotate(180deg)'} : ''}
								/>
							</div>
						</div>
						{showChild ? loop(item.get('childList'), paddingLeft + 0.1) : ''}
					</div>
				)
			} else {
				return (
					<div key={item.get('uuid')}
						className='type-list'
						style={{paddingLeft: `${paddingLeft}rem`, backgroundColor: '#fff'}}
						onClick={() => {
							dispatch(homeAccountActions.changeLrlsData(['iuManage', 'psiData', 'categoryTypeList', treeIdx, 'subordinateUuid'], item.get('uuid')))
							dispatch(homeAccountActions.changeLrlsData(['iuManage', 'psiData', 'categoryTypeList', treeIdx, 'subordinateName'], item.get('name')))
							history.goBack()
						}}
					>
						{item.get('name')}
					</div>
				)
			}
		})

		return(
			<Container className="iuManage-config iuManage-lrls">
				<ScrollView flex="1" className='border-top'>
					{loop(cardTypeTree, 0.1)}
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						history.goBack()
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

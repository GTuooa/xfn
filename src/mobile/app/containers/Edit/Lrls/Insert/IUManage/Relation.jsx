import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import {  Checkbox, Row, Icon, Button, ButtonGroup, Container, ScrollView } from 'app/components'
import { DateLib, configCheck } from 'app/utils'
import thirdParty from 'app/thirdParty'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

@connect(state => state)
export default
class Relation extends React.Component {
	componentDidMount() {
		thirdParty.setTitle({title: '选择分类'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })
	}

	render () {
		const { dispatch, homeAccountState, history } = this.props

		const psiData = homeAccountState.getIn(['iuManage', 'psiData'])
		const categoryTypeList =  psiData.get('categoryTypeList')

		return(
			<Container className="iuManage-config iuManage-lrls">
				<div className='iuManage-padding border-top'>所属分类</div>
				<ScrollView flex="1">
					<div>
						{
							categoryTypeList.map((v, i) => {
								const checked = v.get('checked')
								return (
									<Row key={i}
										className='iuManage-item'
										onClick={()=> {
											dispatch(homeAccountActions.changeLrlsData(['iuManage', 'psiData', 'categoryTypeList', i, 'checked'], !checked))
											if (!checked) {//变为选中时
												dispatch(homeAccountActions.changeManageCardRelation(v.get('ctgyUuid'), i))
											}
										}}
									>
										<div className='overElli'>{v.get('name')}</div>
										<Checkbox checked={checked}/>
									</Row>
								)
							})
						}
					</div>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						history.goBack()
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

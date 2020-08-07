import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import thirdParty from 'app/thirdParty'

import { Checkbox, TextListInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, TextareaItem } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { configCheck } from 'app/utils'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import '../index.less'

@connect(state => state)
export default
class InsertIUManage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false
		}
    }
	componentDidMount() {
		thirdParty.setTitle({title: '新增往来单位'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })

		sessionStorage.setItem('lrlsInsertCard', 'lrlsIUManage')
	}

	render () {
		const { dispatch, homeAccountState, history } = this.props
		const { showList } = this.state

		const psiData = homeAccountState.getIn(['iuManage', 'psiData'])
		const iuManageTitleList = homeAccountState.get('iuManageTitleList')
		const code =  psiData.get('code')
		const name =  psiData.get('name')
		const isPayUnit =  psiData.get('isPayUnit')
		const isReceiveUnit =  psiData.get('isReceiveUnit')
		const categoryTypeList =  psiData.get('categoryTypeList')
		const enableAdvanceAc =  psiData.get('enableAdvanceAc')//启用预收
		const enablePrepaidAc =  psiData.get('enablePrepaidAc')//启用预付

		return(
			<Container className="iuManage-config">
				<ScrollView flex="1" className='border-top'>
					<div className="iuManage-card-base">
						<div className="iuManage-card-base-row">
							<label>编码: </label>
							<TextListInput
								textAlign="right"
								placeholder="必填，支持数字和大小写英文"
								value={code}
								onChange={value => configCheck.inputCheck('code', value, () => {
									dispatch(homeAccountActions.changeLrlsData(['iuManage', 'psiData', 'code'], value))
								})}
							/>
						</div>

						<div className="iuManage-card-base-row">
							<label>名称</label>
							<TextListInput
								textAlign="right"
								placeholder="必填（最长20个字符）"
								value={name}
								onChange={value => dispatch(homeAccountActions.changeLrlsData(['iuManage', 'psiData', 'name'], value))}
							/>
						</div>

						<div className="iuManage-card-base-row"
							style={{'height':'auto'}}
							onClick={() => {
								history.push('/lrls-iuManage-relation')
							}}
						>
							<label>所属分类</label>
							<div className="select-check-box">
								{
									categoryTypeList.map((item,index) => {
										if (item.get('checked')) {
											return (
												<span key={item.get('categoryUuid')} className='lrls-paddingRight'>
													{item.get('name')}
												</span>
											)
										}
                                    })
                                }
								<Icon type="arrow-right"/>
                            </div>
                        </div>

						{
							categoryTypeList.map((item, index) =>{
								if (item.get('checked')) {
									return (
										<div key={index}
											className="iuManage-card-base-row"
											onClick={() => {
												dispatch(homeAccountActions.changeLrlsData(['iuManage', 'treeIdx'], index))
												history.push('/lrls-iuManage-category')
											}}
										>
											<label>{item.get('categoryName')}类别</label>
											<div className="select-check-box">
												<span className="text-flow">{item.get('subordinateName')}</span>
												<Icon type="arrow-right" />
											</div>
										</div>
									)
								}
							})
						}
					</div>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						history.goBack()
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(homeAccountActions.saveIUManage(history))
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

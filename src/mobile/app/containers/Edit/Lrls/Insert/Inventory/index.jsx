import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'

import { Checkbox, TextListInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, TextareaItem, SinglePicker } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { configCheck } from 'app/utils'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import '../index.less'

@connect(state => state)
export default
class InsertInventory extends React.Component {
	componentDidMount() {
		thirdParty.setTitle({title: '新增存货'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })

		sessionStorage.setItem('lrlsInsertCard', 'lrlsInventory')
	}

	render () {
		const { dispatch, homeAccountState, history } = this.props

		const psiData = homeAccountState.getIn(['inventory', 'psiData'])
		const code =  psiData.get('code')
		const name =  psiData.get('name')
		const isPayUnit =  psiData.get('isPayUnit')
		const isReceiveUnit =  psiData.get('isReceiveUnit')
		const categoryTypeList =  psiData.get('categoryTypeList')
		const inventoryNature = psiData.get('inventoryNature')

		return(
			<Container className="inventory-config">
				<ScrollView flex="1" className="border-top">
					<div className="inventory-card-base">
						<div className="inventory-card-base-row">
							<label>编码: </label>
							<TextListInput
								textAlign="right"
								placeholder="必填，支持数字和大小写英文"
								value={code}
								onChange={value => configCheck.inputCheck('code', value, () => {
									dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData', 'code'], value))
								})}
							/>
						</div>

						<div className="inventory-card-base-row">
							<label>名称</label>
							<TextListInput
								textAlign="right"
								placeholder="必填（最长20个字符）"
								value={name}
								onChange={value => dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData', 'name'], value))}
							/>
						</div>

						<div className="inventory-card-base-row">
							<label>存货性质</label>
							<SinglePicker
								// district={[{key: '原材料', value: 1}, {key: '半成品', value: 2}, {key: '产品', value: 3}]}
								district={[{key: '库存商品', value: 5}, {key: '原材料', value: 6}]}
								value={inventoryNature}
								onOk={value => {
									dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData', 'inventoryNature'], value.value))
									if (value.value === 6) {
										dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData','inventoryAcId'], '1403'))
										dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData','inventoryAcName'], '原材料'))
									} else {
										dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData','inventoryAcId'], '1405'))
										dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData','inventoryAcName'], '库存商品'))
									}
									// if (value.value == 1) {
									// 	dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData', 'isAppliedPurchase'], true))
									// }
									// if (value.value == 3) {
									// 	dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData', 'isAppliedSale'], true))
									// }
								}}
							>
								<div className="select-input-placeholder">
									{['','原材料', '半成品', '产品','','库存商品','原材料'][inventoryNature]}
									<Icon type="arrow-right" />
								</div>
							</SinglePicker>
						</div>

						<div className="inventory-card-base-row"
							style={{'height':'auto'}}
							onClick={() => {
								history.push('/lrls-inventory-relation')
							}}
						>
							<label>所属分类</label>
							<div className="select-check-box">
								{
									categoryTypeList.map((item,index) => {
										if (item.get('checked')) {
											return (
												<span key={item.get('ctgyUuid')} className='lrls-paddingRight'>
													{item.get('categoryName')}
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
											className="inventory-card-base-row"
											onClick={() => {
												dispatch(homeAccountActions.changeLrlsData(['inventory', 'treeIdx'], index))
												history.push('/lrls-inventory-category')
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
						dispatch(homeAccountActions.saveInventory(history))
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

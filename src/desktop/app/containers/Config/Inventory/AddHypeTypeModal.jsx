import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Switch, Input, Select, Checkbox, Button, Modal, message } from 'antd'
import { Icon } from 'app/components'
const Option = Select.Option
const confirmModal = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
import { jxcConfigCheck } from 'app/utils'
import { SelectAc, Tab } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'

@immutableRenderDecorator
export default
class AddHypeTypeModal extends React.Component {

	static displayName = 'InventoryConfAddHypeTypeModal'

	constructor() {
		super()
		this.state = {
            deleteModal : false
        }
	}

	render() {
		const {
			dispatch,
            showModal,
            closeModal,
			editPermission,
			originTags,
			activeTapKey,
			activeTapKeyUuid,
			anotherTabName,
			activeInventoryType,
			inventoryHighTypeTemp
		} = this.props
        const { deleteModal } = this.state


		const reserveTags = originTags.delete(0)
		// const categoryNameDisabled = activeInventoryType === '采购类' || activeInventoryType === '销售类'
		// const deleteBtnShow = activeInventoryType === '采购类' || activeInventoryType === '销售类' || activeInventoryType === ''

		const name = inventoryHighTypeTemp.get('name')
		const isAppliedSale = inventoryHighTypeTemp.get('isAppliedSale')
		const isAppliedPurchase = inventoryHighTypeTemp.get('isAppliedPurchase')
		const isAppliedProduce = inventoryHighTypeTemp.get('isAppliedProduce')
		const isAppliedWater = inventoryHighTypeTemp.get('isAppliedWater')
		const isAppliedInvoicing = inventoryHighTypeTemp.get('isAppliedInvoicing')
		const styleMask = deleteModal ? {backgroundColor:'rgba(0, 0, 0, 0.2)'} : ''
		let currentIndex = reserveTags.findIndex((data,index)=>{
			return data.get("name")===name
		})
		let tagsLength =reserveTags.size

		return (
            <Modal
				maskStyle={styleMask}
				visible={showModal}
				maskClosable={false}
				title={'存货管理'}
                footer={null}
                onCancel={() => closeModal()}
				footer={[
					<Button
						type="ghost"
						disabled={activeInventoryType=="" ? true : currentIndex===0? true:false}
						onClick={() => {
							let preMoveCategoryUuid = reserveTags.toJS()[currentIndex] ? reserveTags.toJS()[currentIndex].uuid : ''
							let nextMoveCategoryUuid = reserveTags.toJS()[currentIndex-1] ? reserveTags.toJS()[currentIndex-1].uuid : ''
							let request = {
								preMoveCategoryUuid,
								nextMoveCategoryUuid,
								type:"CARD4STUFF"
							}
							dispatch(inventoryConfActions.adjustCategoryOrder(request))
						}}
					>
						 前移
					</Button>,
					<Button
						type="ghost"
						disabled={activeInventoryType==""?true :currentIndex===tagsLength-1? true:false}
						onClick={() => {
							let preMoveCategoryUuid = reserveTags.toJS()[currentIndex+1] ? reserveTags.toJS()[currentIndex+1].uuid : ''
							let nextMoveCategoryUuid = reserveTags.toJS()[currentIndex] ? reserveTags.toJS()[currentIndex].uuid : ''
							let request = {
								preMoveCategoryUuid,
								nextMoveCategoryUuid,
								type:"CARD4STUFF"
							}
							dispatch(inventoryConfActions.adjustCategoryOrder(request))
						}}
					>
						后移
					</Button>,
					<Button
						type="ghost"
						disabled={!editPermission || activeInventoryType==""}
						onClick={() => {
							this.setState({
								deleteModal : true
							})
						}}
						// style={{display:deleteBtnShow ? 'none' : ''}}
					>
						删除
					</Button>,
					<Button
						type="ghost"
						disabled={!editPermission}
						onClick={() => {
							// if (!isAppliedSale && !isAppliedPurchase) {
							// 	message.info('存货用途至少勾选一个')
							// 	return
							// }
							// if (!isAppliedWater && !isAppliedInvoicing) {
							// 	message.info('适用范围至少勾选一个')
							// 	return
							// }
							if (name === Limit.ALL_TAB_NAME_STR) { // 类别名称不能为‘全部’
								message.info(`类别名称不能为${Limit.ALL_TAB_NAME_STR}`)
								return
							}

							const checkList = [{
								type: 'topestName',
								value: name
							}]
							jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(inventoryConfActions.saveInventoryHighType()))
						}}
					>
						保存
					</Button>
				]}
            >
				<div className="jxc-config-modal-wrap inven-config-modal" style={{overflow:'hidden'}}>
					<div className="iuManage-top-title-btn">
						<div className="iuManage-high-type-title">
							<Tab
								addButton={editPermission}
								tabList={reserveTags.toJS().map(v => ({key:v.name,value:v.name,item:v}))}
								activeKey={activeInventoryType}
								tabFunc={(v,item) => {
									dispatch(inventoryConfActions.changeInventoryModalActiveHighType(fromJS(item)))
								}}
								addFunc={() => {
									dispatch(inventoryConfActions.beforeAddInventoryHighType())
								}}
								addKey={'plus'}
							/>
						</div>
					</div>

                    <div className="jxc-manage-content">
                        <div>
                            <label>类别名称：</label>
                            <span>
                                <Input
									type="text"
									value={name}
									onFocus={(e) => e.target.select()}
									onChange={(e) => dispatch(inventoryConfActions.changeInventoryHighTypeContent('name', e.target.value))}
									// disabled={categoryNameDisabled}
								/>
                            </span>
                        </div>
                        {/* <div>
                            <label>存货用途：</label>
                            <span>
								<label>
									<Checkbox
										checked={isAppliedPurchase}
										onChange={(e) => {
											if (activeInventoryType === '采购类') {
												return ;
											}
											dispatch(inventoryConfActions.changeInventoryHighTypeContent('isAppliedPurchase', e.target.checked))
										}}
									/>
									&nbsp;
									采购
								</label>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<label>
									<Checkbox
										checked={isAppliedSale}
										onChange={(e) => {
											if (activeInventoryType === '销售类') {
												return ;
											}
											dispatch(inventoryConfActions.changeInventoryHighTypeContent('isAppliedSale', e.target.checked))
										}}
									/>
									&nbsp;
									销售
								</label>
								&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                        </div> */}
						{/*<div className="iuManage-high-type-btn-wrap iuManage-high-type-btn" style={{marginTop:'30px'}}>

						</div>*/}
                    </div>
                    <div className={'modalBomb'} style={{display: deleteModal ? '' : 'none'}}></div>
                    <Modal
						maskStyle={{backgroundColor: 'transparent'}}
						title={'删除类别'}
						visible={deleteModal}
						onCancel={()=> this.setState({deleteModal: false})}
						footer={[
                            <Button
                                key="cancel"
                                type="ghost"
                                onClick={() => this.setState({deleteModal: false})}
							>
                                取 消
                            </Button>,
                            <Button
                                key="ok"
                                type={'primary'}
								disabled={!editPermission}
                                onClick={() => {
									const deleteModal = () =>{
										this.setState({deleteModal: false})
									}
                                    dispatch(inventoryConfActions.deleteInventoryHighType(deleteModal))
                                }}
                            >
                                确 定
                            </Button>,
                        ]}
                    >
                        确认删除{activeInventoryType}类别吗？
					</Modal>
                </div>
			</Modal>
		)
	}
}

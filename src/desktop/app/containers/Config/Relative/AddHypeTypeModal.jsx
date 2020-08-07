import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS ,size} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Switch, Input, Select, Checkbox, Button, Modal, message, Icon } from 'antd'
const Option = Select.Option
const confirmModal = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
import { jxcConfigCheck } from 'app/utils'
import { SelectAc, Tab } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import * as relativeConfActions from 'app/redux/Config/Relative/relative.action.js'

@immutableRenderDecorator
export default
class InventoryModal extends React.Component {

	static displayName = 'RelativeConfInventoryModal'

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
			activeRelativeType,
			relativeHighTypeTemp
		} = this.props
        const { deleteModal } = this.state

		// const categoryNameDisabled = activeRelativeType === '客户' || activeRelativeType === '供应商'
		// const deleteBtnShow = activeRelativeType === '客户' || activeRelativeType === '供应商' || activeRelativeType === ''
		const reserveTags = originTags.delete(0)
		const isPayUnit = relativeHighTypeTemp.get('isPayUnit')
		const isReceiveUnit = relativeHighTypeTemp.get('isReceiveUnit')
		const isAppliedWater = relativeHighTypeTemp.get('isAppliedWater')
		const name = relativeHighTypeTemp.get('name')

		const checkList = [
			{
				type: 'topestName',
				value: name
			}
		]
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
				title={'往来关系管理'}
                footer={null}
                onCancel={() => closeModal()}
				footer={[
					<Button
						type="ghost"
						disabled={activeRelativeType === ''?true:currentIndex===0? true:false}
						onClick={() => {
							let preMoveCategoryUuid = reserveTags.toJS()[currentIndex] ? reserveTags.toJS()[currentIndex].uuid : ''
							let nextMoveCategoryUuid = reserveTags.toJS()[currentIndex-1] ? reserveTags.toJS()[currentIndex-1].uuid : ''
							let request = {
								preMoveCategoryUuid,
								nextMoveCategoryUuid,
								type:"CARD4PERSON"
							}
							dispatch(relativeConfActions.adjustCategoryOrder(request))
						}}
					>
						 前移
					</Button>,
					<Button
						type="ghost"
						disabled={activeRelativeType === '' ?true:currentIndex===tagsLength-1? true:false}
						onClick={() => {
							let preMoveCategoryUuid = reserveTags.toJS()[currentIndex+1] ? reserveTags.toJS()[currentIndex+1].uuid : ''
							let nextMoveCategoryUuid = reserveTags.toJS()[currentIndex] ? reserveTags.toJS()[currentIndex].uuid : ''
							let request = {
								preMoveCategoryUuid,
								nextMoveCategoryUuid,
								type:"CARD4PERSON"
							}
							dispatch(relativeConfActions.adjustCategoryOrder(request))
						}}
					>
						后移
					</Button>,
					<Button
						type="ghost"
						disabled={!editPermission || activeRelativeType === ''}
						onClick={() => {
							this.setState({
								deleteModal : true
							})
						}}
							// style={{display: deleteBtnShow ? 'none' :''}}
					>
						删除
					</Button>,
					<Button
						type="ghost"
						disabled={!editPermission}
						onClick={() => {
							// if (!(isPayUnit || isReceiveUnit)) {
							// 	message.info('往来性质至少勾选一个')
							// 	return
							// }
							if (name === '全部') {
								message.info('类别名称不能为‘全部’')
								return
							}
							jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(relativeConfActions.saveRelativeHighType(closeModal)))
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
								activeKey={activeRelativeType}
								tabFunc={(v,item) => {
									dispatch(relativeConfActions.changeRelativeHighTypeActiveHighType(fromJS(item)))
								}}
								addFunc={() => {
									dispatch(relativeConfActions.beforeAddRelativeHighType())
								}}
								addKey={'plus'}
							/>
							{/* {reserveTags.map((v,i) =>
								<span
									key={v.get('uuid')}
									className={`title-conleft ${activeRelativeType === v.get('name') ? 'title-selectd' : ''}`}
									onClick={() => dispatch(relativeConfActions.changeRelativeHighTypeActiveHighType(v))}
									>
									{v.get('name')}
								</span>
							)}
							<span
								key={'addType'}
								className={`title-conleft ${activeRelativeType === '' ? 'title-selectd' : ''}`}
								onClick={() => dispatch(relativeConfActions.beforeAddRelativeHighType())}
							>
								<Icon type="plus" />
							</span> */}
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
									onChange={(e) => dispatch(relativeConfActions.changeRelativeHighTypeContent('name', e.target.value))}
									// disabled={categoryNameDisabled}
								/>
                            </span>
                        </div>
						{/* <div>
                            <label>往来关系：</label>
                            <span>
								<label>
									<Checkbox
										checked={isPayUnit}
										onChange={(e)=> {
											if(name === '供应商' && categoryNameDisabled){
												return
											}
											dispatch(relativeConfActions.changeRelativeHighTypeContent('isPayUnit', e.target.checked))
										}}
									/>
									<span>向他付款</span>
								</label>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<label>
									<Checkbox
										checked={isReceiveUnit}
										onChange={(e)=> {
											if(name === '客户' && categoryNameDisabled){
												return ;
											}
											dispatch(relativeConfActions.changeRelativeHighTypeContent('isReceiveUnit', e.target.checked))
										}}
									/>
									<span>向他收款</span>
								</label>
                            </span>
                        </div> */}
                    </div>
					{/*<div className="iuManage-high-type-btn iuManage-high-type-btn-wrap" style={{marginTop:'30px'}}>
					</div>*/}
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
                                    dispatch(relativeConfActions.deleteRelativeHighType(deleteModal))
                                }}
                            >
                                确 定
                            </Button>,
                        ]}
                    >
                        确认删除{activeRelativeType}类别吗？
					</Modal>
                </div>
			</Modal>
		)
	}
}

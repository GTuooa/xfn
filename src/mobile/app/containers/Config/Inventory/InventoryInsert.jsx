import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, XfInput, Single, Checkbox, Switch, Form, Multiple, Amount, SwitchText } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'
const { Label, Item } = Form
import 'app/containers/Config/common/style/listStyle.less'
import TypeTreeSelect from 'app/containers/components/TypeTreeSelect'
import AssistItem from './Assist/AssistItem.jsx'
import BatchItem from './Batch/BatchItem.jsx'
import Quantity from './Quantity/Quantity.jsx'

@connect(state => state)
export default
class InventoryInsert extends React.Component {

    static displayName = 'InventoryInsert'

	static propTypes = {
		dispatch: PropTypes.func
	}

    constructor(props) {
		super(props)
		this.state = {
            showTypeModal: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '存货卡片'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {

        const {
			dispatch,
			history,
			homeState,
            inventoryConfState
		} = this.props
        const { showTypeModal } = this.state

        const highTypeList = inventoryConfState.get('highTypeList')
        const insertOrModify = inventoryConfState.getIn(['views','insertOrModify'])
        const fromPage = inventoryConfState.getIn(['views','fromPage'])
        // const saleOrPurchase = inventoryConfState.getIn(['views', 'saleOrPurchase'])
        const isFromOtherPage = fromPage !== 'inventory' ? true : false
        const hideStyle = {display: isFromOtherPage ? 'none' : ''}

        const inventoryCardTemp = inventoryConfState.get('inventoryCardTemp')
        const code = inventoryCardTemp.get('code')
        const name = inventoryCardTemp.get('name')
        const inventoryNature = inventoryCardTemp.get('inventoryNature')
        const inventoryNatureName = inventoryCardTemp.get('inventoryNatureName')
        // const inventoryAcName = inventoryCardTemp.get('inventoryAcName')
        // const inventoryAcId = inventoryCardTemp.get('inventoryAcId')
        const opened = inventoryCardTemp.get('opened')
        const remark = inventoryCardTemp.get('remark')
        const isAppliedSale = inventoryCardTemp.get('isAppliedSale')
        const isAppliedPurchase = inventoryCardTemp.get('isAppliedPurchase')
        // const isAppliedProduce = inventoryCardTemp.get('isAppliedProduce')
        const categoryTypeList = inventoryCardTemp.get('categoryTypeList')
        const isCheckOut = inventoryCardTemp.get('isCheckOut')
        // const contacterInfo = inventoryCardTemp.get('contacterInfo')
        const used = inventoryCardTemp.get('used')
        const uuid = inventoryCardTemp.get('uuid')
        const typeList = inventoryConfState.get('typeList')
        // const inventoryNatureInfo = {key:inventoryNatureName,value:inventoryNature}

        //仓库数量等
        const openQuantity = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('QUANTITY')//开启数量管理的灰度
        const psiOpen = homeState.getIn(['data', 'userInfo', 'moduleInfo', 'PSI'])//进销存权益 false 到期
        const isOpenedQuantity = inventoryCardTemp.get('isOpenedQuantity')//是否启用数量管理
        const isOpenedWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
        const openedQuantity = inventoryCardTemp.get('openedQuantity')//仓库数量余额
        const unit = inventoryCardTemp.get('unit')//计量单位
        const unitName = unit.get('fullName')
        const purchasePriceList = inventoryConfState.get('purchasePriceList')//采购价列表
        const salePriceList = inventoryConfState.get('salePriceList')//销售价列表
        const warehousePriceMode = inventoryCardTemp.get('warehousePriceMode')//是否为统一单价
        const warehousePriceModeName = {'U': '全部仓库同一单价', 'T': '一级仓库不同单价', 'E': '不同仓库不同单价'}

        //组装单
        const assemblyState = inventoryCardTemp.get('assemblyState')
        const assemblySheet = inventoryCardTemp.get('assemblySheet')
        const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
        const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false
        const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])

        //辅助属性
        const moduleAssist = moduleInfo.includes('ASSIST')//权限是否开启了辅助属性管理
        const moduleBatch = moduleInfo.includes('BATCH')//权限是否开启批次管理
        const moduleShelfLife = moduleInfo.includes('SHELF_LIFE')//权限是否开启保质期管理
        const moduleSerial = moduleInfo.includes('SERIAL')//权限是否开启了序列号管理
        const openAssist = inventoryCardTemp.getIn(['financialInfo', 'openAssist'])
        const assistClassificationList = inventoryCardTemp.getIn(['financialInfo', 'assistClassificationList'])
        const openBatch = inventoryCardTemp.getIn(['financialInfo', 'openBatch'])//批次管理
        const openSerial = inventoryCardTemp.getIn(['financialInfo', 'openSerial'])//序列号

        const canOpenedInput = !isOpenedWarehouse && (!(openAssist || openBatch))//期初值是否可直接输入
        const canQuantityInput = !isOpenedWarehouse && (!(openAssist || openBatch || openSerial))//期初数量是否可直接输入

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        if (isFromOtherPage) {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}
console.log(inventoryCardTemp.toJS());
        const beforeSave = (flag,closeModal) => {
			const checkList = [
				{
					type: 'code',
                    value: code,
                }, {
					type: 'name',
                    value: name,
				}, {
					type: 'remark',
					value: remark
				}, {
					type: 'opened',
					value: opened
				},
			]

			const success = (flag,closeModal) => {
				if(inventoryNature === ''){
					thirdParty.Alert('存货性质必选')
					return ;
				}

				let noCategoryChecked = true
				highTypeList.map((item,index) =>{
					if(item.get('checked')){
						noCategoryChecked = false
					}
				})
				if(noCategoryChecked){
					thirdParty.Alert('所属分类必选一项')
					return ;
				}
				let typeChoosed = false
				categoryTypeList.map((item,index) =>{
					if(item.get('ctgyUuid') === '' || item.get('subordinateUuid') === ''){
						typeChoosed = true
					}
				})
				if(typeChoosed){
					thirdParty.Alert('类别需要填写完整')
					return ;
				}

				dispatch(inventoryConfAction.saveCard(fromPage, flag, closeModal, ))
			}
			configCheck.beforeSaveCheck(checkList, () => success(flag,closeModal))
		}

        let highTypeMultipleList = [], highTypeSelectList = []
        highTypeList.map(v => {
            if ((isAppliedPurchase && v.get('isAppliedPurchase')) || (isAppliedSale && v.get('isAppliedSale'))) {
                highTypeMultipleList.push({
                    key: v.get('name'),
                    value: v.get('uuid')
                })
            }
            if (v.get('checked')) {
                highTypeSelectList.push(v.toJS())
            }
        })

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="编码" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="支持数字大小写和英文"
                                value={code}
                                onChange={value => configCheck.inputCheck('code', value, () => {dispatch(inventoryConfAction.changeCardContent('code',value))})}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="名称" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="最长32个中文字符或64个英文字符"
                                value={name}
                                onChange={value => dispatch(inventoryConfAction.changeCardContent('name',value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="存货性质" showAsterisk>
                            <Single
                                district={[{key: '库存商品', value: 5}, {key: '原材料', value: 6}]}
                                value={inventoryNature}
                                onOk={value => {
                                    dispatch(inventoryConfAction.changeCardNature('inventoryNature', value))
                                }}
                            >
                                <Row className={inventoryNatureName ? 'config-form-item-select-item' : 'config-form-item-select-item config-form-item-select-item-holder'}>
                                    {inventoryNatureName ? inventoryNatureName : '请选择'}
                                </Row>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>

                        <Multiple
                            district={highTypeMultipleList}
                            value={highTypeSelectList.map(v => v['uuid'])}
                            title={'所属分类'}
                            className={'config-form-item-auto-heigth-row'}
                            onOk={(value) => {
                                const valueArr = value.map(v => v.value)
                                highTypeList.map(v => {
                                    if (valueArr.includes(v.get('uuid'))) {
                                        dispatch(inventoryConfAction.changeCardCategoryStatus(v, true))
                                    } else {
                                        dispatch(inventoryConfAction.changeCardCategoryStatus(v, false))
                                    }
                                })

                            }}
                        >
                            <Label showAsterisk>所属分类</Label>
                            <div className="config-form-item-auto-height-row-item">
                                {
                                    highTypeSelectList.map((item,index) => {
                                        return (
                                            <span
                                                key={index}
                                                className="config-form-item-type-choose-lable"
                                                style={{'paddingLeft': '8px'}}
                                            >
                                                {item['name']}
                                            </span>
                                        )
                                    })
                                }
                            </div>
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Multiple>
                        {
                            highTypeList.map((item,index) => {
                                if (item.get('checked')) {
                                    return (
                                        <Item label={`${item.get('name')}类别`} showAsterisk key={index} onClick={() => {
                                            dispatch(inventoryConfAction.addCardShowType(item))
                                            this.setState({showTypeModal: true})
                                        }}>
                                            <Row className='config-form-item-select-item'>
                                                <span className="text-flow">{item.get('selectName')}</span>
                                            </Row>
                                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                                        </Item>
                                    )
                                }
                            })
                        }
                        <TypeTreeSelect
                            visible={showTypeModal}
                            dispatch={dispatch}
                            typeList={typeList}
                            isSelectEnd={true}
                            onCancel={() => this.setState({showTypeModal: false})}
                            onChange={(item) => {
                                const uuid = item.key
                                const name = item.label
                                dispatch(inventoryConfAction.changeCardCategoryType(uuid, name))
                                this.setState({showTypeModal: false})
                            }}
                        >
                            <span></span>
                        </TypeTreeSelect>
                        <Item label="备注" className="config-form-item-input-style">
                            <XfInput
                                placeholder="请输入备注"
                                value={remark}
                                onChange={value => dispatch(inventoryConfAction.changeCardContent('remark',value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <div className="config-form-sub-title" style={hideStyle}>财务信息</div>
                        {
                            (newJr && openQuantity) ? <Quantity
                                history={history}
                                dispatch={dispatch}
                                inventoryCardTemp={inventoryCardTemp}
                                purchasePriceList={purchasePriceList}
                                salePriceList={salePriceList}
                                moduleSerial={moduleSerial}
                            /> : null
                        }

                        <Item label="仓库核算" className="margin-top" style={{display: isOpenedWarehouse ? '' : 'none'}}>
                            <div onClick={() => thirdParty.toast.info('账套已启用仓库核算')}>
                                <span className='gray'>已开启</span>
                            </div>
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="单价模式" showAsterisk  style={{display: isOpenedQuantity && isOpenedWarehouse ? '' : 'none'}}>
                            <Single
                                district={[{key: '全部仓库同一单价', value: 'U'}, {key: '一级仓库不同单价', value: 'T'}, {key: '不同仓库不同单价', value: 'E'}]}
                                value={warehousePriceMode}
                                onOk={value => {
                                    dispatch(inventoryConfAction.changeCardContent('warehousePriceMode', value.value))
                                }}
                            >
                                <Row className= 'config-form-item-select-item'>
                                    {warehousePriceMode ? warehousePriceModeName[warehousePriceMode]: '请选择单价模式'}
                                </Row>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>

                        {
                            moduleAssist && isOpenedQuantity ? <AssistItem
                                history={history}
                                dispatch={dispatch}
                                openAssist={openAssist}
                                assistClassificationList={assistClassificationList}
                            /> : null
                        }
                        {
                            moduleBatch && isOpenedQuantity ? <BatchItem
                                history={history}
                                dispatch={dispatch}
                                financialInfo={inventoryCardTemp.get('financialInfo')}
                                isModify={insertOrModify=='modify'}
                            /> : null
                        }

                        <Item label={(isOpenedWarehouse || isOpenedQuantity) ? '期初余额' : "期初值"}
                            className="config-form-item-input-style margin-top"
                            style={hideStyle}
                        >
                            <div className='inventory-opened'
                                style={{display: canOpenedInput ? 'none' : ''}}
                                onClick={()=>{
                                    if (isOpenedQuantity && (!isOpenedWarehouse)) {//只开启数量
                                        history.push('/config/inventory/quantityOnly')
                                        return
                                    }
                                    //只开启仓库 或都开启
                                    history.push('/config/inventory/inventoryOpened')
                                }}
                            >
                                <Amount decimalPlaces={2}>{opened}</Amount>
                            </div>
                            {
                                (!canOpenedInput) ? null :
                                <XfInput
                                    mode='amount'
                                    negativeAllowed={true}
                                    placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                    value={opened}
                                    disabled={isCheckOut}
                                    onChange={value => {
                                        if (openSerial) {
                                            dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', 0, 'openedAmount'], value))
                                        }
                                        dispatch(inventoryConfAction.changeCardContent('opened',value))
                                    }}
                                />
                            }

                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>

                        <Item label='期初数量' style={{display: !isFromOtherPage && isOpenedQuantity ? '' : 'none'}}
                            className="config-form-item-input-style"
                        >
                            <div className='inventory-opened' style={{display: canQuantityInput ? 'none' : ''}}
                                onClick={()=>{
                                    if (isOpenedWarehouse) {
                                        history.push('/config/inventory/inventoryOpened')
                                    } else {
                                        if (openAssist || openBatch) {
                                            history.push('/config/inventory/quantityOnly')
                                        } else {
                                            const usedOpenSerial = inventoryConfState.getIn(['views','usedOpenSerial'])

                                            let serialList = inventoryCardTemp.getIn(['openList', 0, 'serialList'])
                                            serialList = serialList ? serialList : fromJS([])
                                            let openedQuantity = inventoryCardTemp.getIn(['openList', 0, 'openedQuantity'])
                                            openedQuantity = openedQuantity ? openedQuantity : ''

                                            if (openedQuantity && serialList.size==0 && usedOpenSerial) {
                                                dispatch(inventoryConfAction.changeData('serial', fromJS({
                                                    serialList,
                                                    type: 'OPENLIST_SERIAL',
                                                    idx: 0,
                                                }), true))

                                                const inventoryUuid = inventoryConfState.getIn(['inventoryCardTemp','uuid'])
                                                let openUuid = inventoryCardTemp.getIn(['openList', 0, 'openUuid'])
                                                openUuid = openUuid ? openUuid : ''
                                                dispatch(inventoryConfAction.getSerialList(inventoryUuid, openUuid))
                                            } else {
                                                dispatch(inventoryConfAction.changeData('serial', fromJS({
                                                    serialList,
                                                    type: 'OPENLIST_SERIAL',
                                                    idx: 0,
                                                }), true))
                                            }
                                            history.push('/config/inventory/serial')
                                        }
                                    }
                                }}
                            >
                                <Amount decimalPlaces={4} decimalZero={false}>{openedQuantity}</Amount>
                            </div>
                            {
                                (!canQuantityInput) ? null :
                                <XfInput
                                    mode='number'
                                    negativeAllowed={true}
                                    placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                                    value={openedQuantity}
                                    disabled={isCheckOut}
                                    onChange={value => dispatch(inventoryConfAction.changeCardContent('openedQuantity', value))}
                                />
                            }
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>

                        <Item label="启用组装"
                            style={{
                                display:(newJr && openQuantity && psiOpen && isOpenedQuantity) ? '' : 'none',
                                marginTop: '.1rem'
                            }}
                        >
                            <span className="noTextSwitch" style={{opacity: ['INVALID', 'INVALID_DELETE'].includes(assemblyState) ? '.4' : ''}}>
                                {
                                    ['INVALID', 'INVALID_DELETE'].includes(assemblyState) ? <SwitchText
                                        checked={true}
                                        checkedChildren='失效'
                                        unCheckedChildren=''
                                        onChange={() => {
                                            //dispatch(inventoryConfAction.changeCardContent('assemblyState','OPEN'))
                                        }}
                                    /> : <Switch
                                        checked={assemblyState=='OPEN' ? true : false}
                                        onClick={()=> {
                                            if (assemblyState=='OPEN') {
                                                if (assemblySheet.get('materialList').size) {
                                                    thirdParty.Confirm({
                                                        message: `关闭组装后，组装单设置内容将被清空`,
                                                        title: '提示',
                                                        buttonLabels: ['取消', '确定'],
                                                        onSuccess : (result) => {
                                                            if (result.buttonIndex==1) {
                                                                dispatch(inventoryConfAction.changeCardContent('assemblyState','CLOSE'))
                                                                dispatch(inventoryConfAction.changeCardContent('assemblySheet', fromJS({
                                                                    unitUuid: '',
                                                                    unitName: '',
                                                                    quantity: '',
                                                                    materialList: []
                                                                })))
                                                            }
                                                        },
                                                        onFail : (err) => {}
                                                   })
                                               } else {
                                                   dispatch(inventoryConfAction.changeCardContent('assemblyState','CLOSE'))
                                               }
                                            }
                                            if (['CLOSE', 'DISABLE'].includes(assemblyState)) {
                                                if (!isOpenedQuantity) {
                                                    return thirdParty.toast.info('未开启数量核算,无法启用组装')
                                                }
                                                if (!unitName) {
                                                    return thirdParty.toast.info('请先选择计量单位')
                                                }
                                                dispatch(inventoryConfAction.changeCardContent('assemblyState','OPEN'))
                                            }

                                        }}
                                    />
                                }

                            </span>
                        </Item>
                        <Item label="组装单设置" style={{display: ['OPEN', 'INVALID_DELETE', 'INVALID'].includes(assemblyState) && psiOpen ? '' : 'none'}}>
                            <span className='gray' onClick={() => { history.push('/config/inventory/assembly') }}>
                                {insertOrModify === 'insert' ? '点击设置组装单' : '点击修改组装单'}
                            </span>
                            <Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>


                        <Item label="启用/停用"
                            style={{
                                display:insertOrModify === 'insert' ? 'none' : '',
                                marginTop: '.1rem'
                            }}
                        >
                            <span className="noTextSwitch">
                                <Switch
                                    checked={used}
                                    onClick={()=> {
                                        dispatch(inventoryConfAction.modifyCardUsedStatus(uuid,!used))
                                    }}
                                />
                            </span>
                        </Item>
                    </Form>

                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => history.goBack()}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                            const closeModal = () => history.goBack();
                            beforeSave('insert',closeModal)
                        }}
                    >
                        <Icon type="save" />
                        <span>保存</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => beforeSave('insertAndNew')} style={isFromOtherPage ? {display: 'none'} : {display : insertOrModify === 'insert' ? '' : 'none'}}
                        >
                        <Icon type="new" />
                        保存并新增
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}

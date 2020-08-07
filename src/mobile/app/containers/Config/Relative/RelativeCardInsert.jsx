import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import 'app/containers/Config/common/style/listStyle.less'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Tabs, XfInput, SinglePicker, Checkbox, Switch, Form, Multiple } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
const { Label, Item } = Form
import TypeTreeSelect from 'app/containers/components/TypeTreeSelect'

import * as relativeConfAction from 'app/redux/Config/Relative/relativeConf.action.js'

@connect(state => state)
export default
class RelativeCardInsert extends React.Component {

	static displayName = 'RelativeCardInsert'

	static propTypes = {
		// allState: PropTypes.instanceOf(Map),
		// relativeConfState: PropTypes.instanceOf(Map),
		// homeState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

    constructor(props) {
		super(props)
		this.state = {
            showTypeModal: false,
			typeTreeValue: ''
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '往来卡片'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {

        const {
			dispatch,
			history,
			homeState,
            relativeConfState
		} = this.props
        const { showTypeModal, typeTreeValue } = this.state

        const reserveTags = relativeConfState.get('tags').delete(0)
		const typeTree = relativeConfState.get('typeTree')
        const fromPage = relativeConfState.getIn(['views', 'fromPage'])
        const isFromOtherPage = fromPage !== 'relative' ? true : false
        const hideStyle = {display: isFromOtherPage ? 'none' : ''}

		const relativeCardTemp = relativeConfState.get('relativeCardTemp')
		const code = relativeCardTemp.get('code')
		const name = relativeCardTemp.get('name')
        const uuid = relativeCardTemp.get('uuid')
        const used = relativeCardTemp.get('used')
		const isPayUnit = relativeCardTemp.get('isPayUnit')
		const isReceiveUnit = relativeCardTemp.get('isReceiveUnit')
		// const payableAcName = relativeCardTemp.get('payableAcName')
		// const receivableAcName = relativeCardTemp.get('receivableAcName')
		// const advanceAcName = relativeCardTemp.get('advanceAcName')
		// const prepaidAcName = relativeCardTemp.get('prepaidAcName')
		// const payableAcId = relativeCardTemp.get('payableAcId')
		// const receivableAcId = relativeCardTemp.get('receivableAcId')
		// const advanceAcId = relativeCardTemp.get('advanceAcId')
		// const prepaidAcId = relativeCardTemp.get('prepaidAcId')
		const companyAddress = relativeCardTemp.get('companyAddress')
		const companyTel = relativeCardTemp.get('companyTel')
		const financeName = relativeCardTemp.get('financeName')
		const financeTel = relativeCardTemp.get('financeTel')
		const remark = relativeCardTemp.get('remark')
		const receivableOpened = relativeCardTemp.get('receivableOpened')
		const advanceOpened = relativeCardTemp.get('advanceOpened')
		const payableOpened = relativeCardTemp.get('payableOpened')
		const prepaidOpened = relativeCardTemp.get('prepaidOpened')
		const categoryTypeList = relativeCardTemp.get('categoryTypeList')
		const enablePrepaidAc = relativeCardTemp.get('enablePrepaidAc')
		const enableAdvanceAc = relativeCardTemp.get('enableAdvanceAc')
		const contacterInfo = relativeCardTemp.get('contacterInfo')
		const isCheckOut = relativeCardTemp.get('isCheckOut')
        const insertOrModify = relativeCardTemp.get('insertOrModify')

        // const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
        // const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		if (isFromOtherPage) {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}

        const beforeSave = (flag,closeModal) => {
			const checkList = [
				{
					type: 'name',
					value: name,
				}, {
					type: 'code',
					value: code
				}, {
					type: 'remark',
					value: remark
				}, {
					type: 'companyAddress',
					value: companyAddress
				}, {
					type: 'financeName',
					value: financeName
				}, {
                    type: 'opened',
                    value: receivableOpened
                }, {
                    type: 'opened',
                    value: advanceOpened
                }, {
                    type: 'opened',
                    value: payableOpened
                }, {
                    type: 'opened',
                    value: prepaidOpened
                }, {
                    type: 'tel',
                    value : companyTel
                }, {
                    type: 'tel',
                    value : financeTel
                }
			]

			const success = () =>{
				let size = 0;
				reserveTags.map((item,index) =>{
					if(item.get('checked')){
						size++
					}
				})

				if(size === 0){
					thirdParty.toast.info('所属分类必选一项')
					return ;
				}

				if(categoryTypeList.size > 0){
					let allSelect = true
					categoryTypeList.map((item,index) =>{
						if(item.get('subordinateUuid') === undefined || item.get('subordinateUuid') === ''){
							allSelect = false
							return ;
						}
					})
					if(!allSelect){
						thirdParty.toast.info('请选择所属分类子级类别')
						return ;
					}
				}else{
					thirdParty.toast.info('请选择所属分类子级类别')
					return ;
				}

				dispatch(relativeConfAction.saveRelativeTypeCard(fromPage, closeModal,flag))
			}
			configCheck.beforeSaveCheck(checkList, () => success())

		}

		let reserveTagsList = [], reserveTagsSelectList = []
		reserveTags.map(v => {
			if ((isPayUnit && v.get('isPayUnit')) || (isReceiveUnit && v.get('isReceiveUnit'))) {
				reserveTagsList.push({
					key: v.get('name'),
					value: v.get('uuid')
				})
			}
			if (v.get('checked')) {
				reserveTagsSelectList.push(v.toJS())
			}
		})

        return(
            <Container className="iuManage-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="编码" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="支持数字大小写和英文"
                                value={code}
                                onChange={value => configCheck.inputCheck('code', value, () => {dispatch(relativeConfAction.changeRelativeCardContent('code',value))})}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="名称" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="填写名称"
                                value={name}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('name',value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        {/* <Item label="往来关系" showAsterisk onClick={() => {
                            dispatch(relativeConfAction.changeRelativeData(['views', 'relation'], 'card'))
                            history.push('/config/relative/relativeCardRelation')
                        }} style={hideStyle}>
                            <div>
                                <span style={{'paddingLeft': '8px','display': isPayUnit ? '' : 'none'}}>向他付款</span>
                                <span style={{'paddingLeft': '8px','display': isReceiveUnit ? '' : 'none'}}>向他收款</span>
                            </div>
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item> */}
                        {/* {
                            isPayUnit || isReceiveUnit ? */}
							<Multiple
								district={reserveTagsList}
								value={reserveTagsSelectList.map(v => v['uuid'])}
								title={'所属分类'}
								className={'config-form-item-auto-heigth-row'}
								onOk={(value) => {
									const valueArr = value.map(v => v.value)
									reserveTags.map(v => {
										if (valueArr.includes(v.get('uuid'))) {
											dispatch(relativeConfAction.changeManageCardRelative(v, true))
										} else {
											dispatch(relativeConfAction.changeManageCardRelative(v, false))
										}
									})
							}}
							>
                                <Label showAsterisk>所属分类</Label>
                                <div className="config-form-item-auto-height-row-item">
                                    {
                                        reserveTagsSelectList.map((item, index) => {
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
                            {/* : null
                        } */}
                        {
                            reserveTags.map((item,index) => {
                                if (item.get('checked')) {
                                    return (
                                        <Item label={`${item.get('name')}类别`} showAsterisk key={index} onClick={() => {
                                            dispatch(relativeConfAction.addCardShowType(item.get('uuid')))
                                            this.setState({showTypeModal: true, typeTreeValue: item.get('selectUuid')})
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
                            typeList={typeTree}
							isSelectEnd={true}
							value={typeTreeValue}
                            onCancel={() => this.setState({showTypeModal: false})}
                            onChange={(item) => {
                                const uuid = item.key
                                const name = item.label
								dispatch(relativeConfAction.changeManageCardRelativeType(uuid, name))
                                this.setState({showTypeModal: false})
                            }}
                        >
                            <span></span>
                        </TypeTreeSelect>
                        <Item label="备注" className="config-form-item-input-style">
                            <XfInput
                                placeholder="请输入备注"
                                value={remark}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('remark',value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>

                        <div className="config-form-sub-title" style={{display: isPayUnit || isReceiveUnit ? '' : 'none'}}>财务信息</div>

                        <Item label="应付期初值" className="config-form-item-input-style" style={{display: isPayUnit ? '' : 'none'}}>
                            <XfInput
                                mode='amount'
                                value={payableOpened}
								disabled={isCheckOut}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('payableOpened',value))}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="应收期初值" className="config-form-item-input-style" style={{display: isReceiveUnit ? '' : 'none'}}>
                            <XfInput
                                mode='amount'
                                value={receivableOpened}
								disabled={isCheckOut}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('receivableOpened',value))}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="预付期初值" className="config-form-item-input-style" style={{display: enablePrepaidAc ? '' : 'none'}}>
                            <XfInput
                                mode='amount'
                                value={prepaidOpened}
								disabled={isCheckOut}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('prepaidOpened',value))}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="预收期初值" className="config-form-item-input-style" style={{display: enableAdvanceAc ? '' : 'none'}}>
                            <XfInput
                                mode='amount'
                                value={advanceOpened}
								disabled={isCheckOut}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('advanceOpened',value))}
                                placeholder={isCheckOut ? "已结账，不可更改" : "选填"}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>

                        {/* <div className="config-form-sub-title" style={isFromOtherPage ? {display: 'none'} : {display: isPayUnit || isReceiveUnit ? '' : 'none'}}>财务信息</div> */}

                        <Item label="联系信息" className="config-form-item-input-style">
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={contacterInfo}
                                    onClick={()=> {
                                        dispatch(relativeConfAction.changeRelativeCardContent('contacterInfo',!contacterInfo))
                                    }}
                                />
                            </span>
                        </Item>
                        <Item label="单位地址" className="config-form-item-input-style" style={{display: contacterInfo ? '' : 'none'}}>
                            <XfInput
                                value={companyAddress}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('companyAddress',value))}
                                placeholder="选填，最长40个字符"
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="单位电话" className="config-form-item-input-style" style={{display: contacterInfo ? '' : 'none'}}>
                            <XfInput
                                value={companyTel}
                                onChange={value => configCheck.inputCheck('tel', value, () => dispatch(relativeConfAction.changeRelativeCardContent('companyTel',value)))}
                                placeholder="选填"
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="财务联系人" className="config-form-item-input-style" style={{display: contacterInfo ? '' : 'none'}}>
                            <XfInput
                                value={financeName}
                                onChange={value => dispatch(relativeConfAction.changeRelativeCardContent('financeName',value))}
                                placeholder="选填，最长20个字符"
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="联系电话" className="config-form-item-input-style" style={{display: contacterInfo ? '' : 'none'}}>
                            <XfInput
                                value={financeTel}
                                onChange={value => configCheck.inputCheck('tel', value, () => dispatch(relativeConfAction.changeRelativeCardContent('financeTel',value)))}
                                placeholder="选填"
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="启用/停用" className="config-form-item-input-style" style={{display:(insertOrModify === 'insert')? 'none' : ''}}>
                            <span className="ac-wrap noTextSwitchShort">
                                <Switch
                                    checked={used}
                                    onClick={()=> {
                                        dispatch(relativeConfAction.switchCardStatus(uuid,!used))
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
                        disabled={!editPermission && fromPage !== 'approval'}
                        onClick={() => {
                        const closeModal = () => history.goBack();
                        beforeSave('insert',closeModal)
                    }}>
                        <Icon type="save" />
                        <span>保存</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => beforeSave('insertAndNew')}
                        style={isFromOtherPage ? {display: 'none'} : {display : insertOrModify === 'insert' ? '' : 'none'}}
                    >
                        <Icon type="new" />
                        <span>保存并新增</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}

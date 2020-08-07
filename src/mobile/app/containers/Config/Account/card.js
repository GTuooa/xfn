import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import 'app/containers/Config/common/style/listStyle.less'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, XfInput, Single, Switch, Form } from 'app/components'
import thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
const { Item } = Form

import { accountConfigActions } from 'app/redux/Config/Account/index.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class AccountConfigOption extends React.Component {

	static displayName = 'AccountConfigOption'

    static propTypes = {
        homeState: PropTypes.instanceOf(Map),
		accountConfigState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func,
		history: PropTypes.object,
	}

    componentDidMount() {
		if (this.props.accountConfigState.getIn(['views', 'flags']) === 'insert') {
			thirdParty.setTitle({title: '新增账户'})
		} else {
			thirdParty.setTitle({title: '修改账户'})
		}
        thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({show: false})
    }

    render() {

        const { dispatch, accountConfigState, homeState, allState, history } = this.props

		console.log('AccountConfigOption');

        //权限校验
        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const flags = accountConfigState.getIn(['views', 'flags'])
        const fromPage = accountConfigState.getIn(['views', 'fromPage'])
        const isFromOtherPage = fromPage !== 'account' ? true : false
        const hideStyle = {display: isFromOtherPage ? 'none' : ''}
		if (isFromOtherPage) {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}

        const data = accountConfigState.get('data')
		const isCheckOut = allState.getIn(['views', 'isCheckOut'])

        const typeList = [
            {key: '现金', value: 'cash'}, {key: '一般户', value: 'general'},
            {key: '基本户', value: 'basic'}, {key: '备用金', value: 'spare'},
			{key: '支付宝', value: 'Alipay'}, {key: '微信', value: 'WeChat'}, {key: '其它', value: 'other'}
        ]

        const type = data.get('type')
        const typeName = {cash: '现金', general: '一般户', basic: '基本户', Alipay: '支付宝', 'WeChat': '微信', other: '其它', spare: '备用金'}[type]
        const openInfo = data.get('openInfo')
		const canUse = data.get('canUse')
		const needPoundage = data.get('needPoundage')
		const poundage = data.get('poundage')
		const poundageRate = data.get('poundageRate')
		const typeDidsabled = flags=='modify' && isCheckOut && data.get('beginAmount')

        return(
            <Container className="account-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="账户名称" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder='填写账户名称'
                                value={data.get('name')}
                                onChange={(value) => {
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'name'], value))
                                }}
                            />
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="账户类型" showAsterisk>
                            <Single
								disabled={typeDidsabled}
                                district={typeList}
                                value={type}
                                onOk={value => {
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'type'], value.value))
                                    if (['cash', 'spare'].includes(value.value)) {
                                        dispatch(accountConfigActions.changeAccountSettingData(['data', 'openInfo'], false))
										dispatch(accountConfigActions.changeAccountSettingData(['data', 'needPoundage'], false))
                                    }
                                }}
                            >
                                <Row onClick={(e) => {
									if (typeDidsabled) {
										e.stopPropagation()
										return thirdParty.Alert('账套已结账且存在期初值，请通过反悔模式进行修改')
									}
								}}
									className={typeDidsabled ? 'config-form-item-select-item config-form-item-disabled' : 'config-form-item-select-item'}>
                                    {typeName}
                                </Row>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="期初余额" className="config-form-item-input-style">
                            <XfInput
                                mode='amount'
                                negativeAllowed={true}
                                placeholder={isCheckOut ? '已结账，不可更改' : '填写期初余额'}
								disabled={isCheckOut}
                                value={data.get('beginAmount')}
                                onChange={(value) => {
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'beginAmount'], value))
                                }}
                            />
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
						<Item label="启用账户手续费" style={{display: ['spare', 'cash'].includes(type) ? 'none' : ''}}>
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={needPoundage}
                                    onClick={()=> {
                                        dispatch(accountConfigActions.changeAccountSettingData(['data', 'needPoundage'], !needPoundage))
                                    }}
                                />
                            </span>
                        </Item>
						<Item label="费用比率" className="poundageRate" style={{display: needPoundage ? '' : 'none'}}>
							<span className="left"></span>
                            <XfInput.BorderInputItem
                                mode='amount'
                                value={poundageRate}
                                onChange={(value) => {
									if (value=='-' || value < 0) {
										return thirdParty.Alert('费用比率不能为负')
									}
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'poundageRate'], value))
                                }}
                            />
                            &nbsp;‰
                        </Item>
						<Item label="费用上限" className="config-form-item-input-style" style={{display: needPoundage ? '' : 'none'}}>
                            <XfInput
                                mode='amount'
                                placeholder='请输入手续费金额上限'
                                value={poundage==-1 ? '' : poundage}
                                onChange={(value) => {
									if (value=='-') {
										return thirdParty.Alert('费用上限不能为负')
									}
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'poundage'], value))
                                }}
                            />
							&nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="账户信息" className="form-offset-up" style={{display: ['cash', 'spare'].includes(type) ? 'none' : ''}}>
                            <div className='noTextSwitchShort'>
                                <Switch
                                    checked={openInfo}
                                    onClick={() => {
                                        if (openInfo) {
                                            dispatch(accountConfigActions.changeAccountSettingData(['data', 'openInfo'], false))
                                        } else {
                                            dispatch(accountConfigActions.changeAccountSettingData(['data', 'openInfo'], true))
                                        }
                                    }}
                                />
                            </div>
                        </Item>
                        <Item label="账号" className="config-form-item-input-style" style={{display: openInfo ? '' : 'none'}}>
                            <XfInput
                                placeholder='请输入账户号码'
                                value={data.get('accountNumber')}
                                onChange={(value) => {
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'accountNumber'], value))
                                }}
                            />
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="开户名" className="config-form-item-input-style" style={{display: openInfo ? '' : 'none'}}>
                            <XfInput
                                placeholder='请输入账户的开户名称'
                                value={data.get('openingName')}
                                onChange={(value) => {
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'openingName'], value))
                                }}
                            />
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <Item label="开户行/机构" className="config-form-item-input-style" style={{display: openInfo ? '' : 'none'}}>
                            <XfInput
                                placeholder='请输入开户行或支付机构名称'
                                value={data.get('openingBank')}
                                onChange={(value) => {
                                    dispatch(accountConfigActions.changeAccountSettingData(['data', 'openingBank'], value))
                                }}
                            />
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
						<Item label="启用/停用" style={{display: flags == 'insert' ? 'none' : ''}}>
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={canUse}
                                    onClick={()=> {
                                        dispatch(accountConfigActions.changeAccountSettingData(['data', 'canUse'], !canUse))
                                    }}
                                />
                            </span>
                        </Item>
                    </Form>
                </ScrollView>
                <ButtonGroup>
                    <Button
						onClick={() => {
							history.goBack()
						}}
					>
                        <Icon type='cancel' size='15' />
                        <span>取消</span>
                    </Button>
                    <Button
						onClick={() => {
                            const checkList = [
								{
									type: 'name',
									value: data.get('name'),
								}
                            ]
                            configCheck.beforeSaveCheck(checkList, () => dispatch(allRunningActions.saveAccountSetting(fromPage, history)))
							
						}}
					>
                        <Icon type='save' size='15' />
                        <span>保存</span>
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}

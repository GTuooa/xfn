import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Checkbox, TextListInput, SinglePicker, Switch } from 'app/components'
import thirdParty from 'app/thirdParty'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
// import * as acAllActions from 'app/redux/Home/All/aclist.actions'
import * as Limit from 'app/constants/Limit.js'

import 'app/containers/Config/Account/index.less'


@connect(state => state)
export default
class InsertAccount extends React.Component {
    componentDidMount() {
        // this.props.dispatch(acAllActions.getAcListFetch())
        this.props.dispatch(homeAccountActions.initLrlsData('accountData'))
        thirdParty.setTitle({title: '新增账户'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
        sessionStorage.setItem('lrlsInsertCard', 'lrlsAccount')
    }

    render() {
        const { dispatch, homeAccountState, history } = this.props
        //allState
        const data = homeAccountState.get('accountData')

        // 库存现金、银行存款、其他货币资金
        // const availAcId = ['1001', '1002', '1012']
        // const availAclist = allState.get('lrAclist').filter(v => availAcId.some(w => v.get('acid').indexOf(w) === 0) && v.get('asscategorylist').size === 0)
        // let accountAclist = []
        // availAclist.forEach(v => {
        //     accountAclist.push({
        //         key: `${v.get('acid')}_${v.get('acfullname')}`,
        //         value: `${v.get('acid')}${Limit.TREE_JOIN_STR}${v.get('acfullname')}`
        //     })
        // })

        const typeList = [
            {key: '现金', value: 'cash'}, {key: '一般户', value: 'general'},
            {key: '基本户', value: 'basic'}, {key: '支付宝', value: 'Alipay'},
            {key: '微信', value: 'WeChat'}, {key: '其它', value: 'other'}
        ]

        const type = data.get('type')
        const typeName = {cash: '现金', general: '一般户', basic: '基本户', Alipay: '支付宝', 'WeChat': '微信', other: '其它'}[type]
        const openInfo = data.get('openInfo')
        const acId = data.get('acId')
        const acFullName = data.get('acFullName')


        return(
            <Container className="account-setting">
                <ScrollView flex='1' className="border-top">
                    <Row className="account-setting-item">
                        <span>账户名称</span>
                        <div>
                            <TextListInput
                                placeholder='填写账户名称'
                                value={data.get('name')}
                                onChange={(value) => {
                                    dispatch(homeAccountActions.changeLrlsData(['accountData', 'name'], value))
                                }}
                            />
                        </div>
                    </Row>
                    {/* <Row className="account-setting-item" style={{display: simplifyStatus ? '' : 'none'}}>
                        <span>关联科目</span>
                        <SinglePicker
                            district={accountAclist}
                            value={`${data.get('acId')}${Limit.TREE_JOIN_STR}${data.get('acFullName')}`}
                            onOk={value => {
                                let arr = value.value.split(Limit.TREE_JOIN_STR)
                                dispatch(homeAccountActions.changeLrlsData(['accountData', 'acId'], arr[0]))
                                dispatch(homeAccountActions.changeLrlsData(['accountData', 'acFullName'], arr[1]))
                            }}
                        >
                            <Row className='account-setting-single-item'>
                                <div className='overElli' style={{color: acId ? '' : '#999'}}>
                                    {data.get('acId') ? `${acId}_${acFullName}` : '请选择关联科目'}
                                </div>
                                <Icon type="arrow-right"/>
                            </Row>
                        </SinglePicker>
                    </Row> */}
                    <Row className="account-setting-item">
                        <span>账户类型</span>
                        <SinglePicker
                            district={typeList}
                            value={type}
                            onOk={value => {
                                dispatch(homeAccountActions.changeLrlsData(['accountData', 'type'], value.value))
                                if (value.value == 'cash') {
                                    dispatch(homeAccountActions.changeLrlsData(['accountData', 'openInfo'], false))
                                }
                            }}
                        >
                            <Row className='account-setting-single-item'>
                                <div className='overElli'>
                                    {typeName}
                                </div>
                                <Icon type="arrow-right"/>
                            </Row>
                        </SinglePicker>
                    </Row>
                    <Row className="account-setting-item">
                        <span>期初余额</span>
                        <div>
                            <TextListInput
                                placeholder='填写期初余额'
                                value={data.get('beginAmount')}
                                onChange={(value) => {
                                    if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                        dispatch(homeAccountActions.changeLrlsData(['accountData', 'beginAmount'], value))
                                    }
                                }}
                            />
                        </div>
                    </Row>
                    <Row className="account-setting-item" style={{display: type == 'cash' ? 'none' : ''}}>
                        <span>账户信息</span>
                        <div className='noTextSwitchShort'>
                            <Switch
                                checked={openInfo}
                                onClick={() => {
                                    if (openInfo) {
                                        dispatch(homeAccountActions.changeLrlsData(['accountData', 'openInfo'], false))
                                    } else {
                                        dispatch(homeAccountActions.changeLrlsData(['accountData', 'openInfo'], true))
                                    }
                                }}
                            />
                        </div>
                    </Row>
                    <Row className="account-setting-item" style={{display: openInfo ? '' : 'none'}}>
                        <span>账号</span>
                        <div>
                            <TextListInput
                                placeholder='请输入账户号码'
                                value={data.get('accountNumber')}
                                onChange={(value) => {
                                    dispatch(homeAccountActions.changeLrlsData(['accountData', 'accountNumber'], value))
                                }}
                            />
                        </div>
                    </Row>
                    <Row className="account-setting-item" style={{display: openInfo ? '' : 'none'}}>
                        <span>开户名</span>
                        <div>
                            <TextListInput
                                placeholder='请输入账户的开户名称'
                                value={data.get('openingName')}
                                onChange={(value) => {
                                    dispatch(homeAccountActions.changeLrlsData(['accountData', 'openingName'], value))
                                }}
                            />
                        </div>
                    </Row>
                    <Row className="account-setting-item" style={{display: openInfo ? '' : 'none'}}>
                        <span>开户行/机构</span>
                        <div>
                            <TextListInput
                                placeholder='请输入开户行或支付机构名称'
                                value={data.get('openingBank')}
                                onChange={(value) => {
                                    dispatch(homeAccountActions.changeLrlsData(['accountData', 'openingBank'], value))
                                }}
                            />
                        </div>
                    </Row>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => {
                        history.goBack()
                    }}>
                        <Icon type='cancel' size='15'/>
                        <span>取消</span>
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(homeAccountActions.saveAccountSetting(history))
                    }}>
                        <Icon type='save' size='15'/>
                        <span>保存</span>
                    </Button>
                </ButtonGroup>

            </Container>

        )
    }
}

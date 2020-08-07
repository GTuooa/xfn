import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import 'app/containers/Config/common/style/listStyle.less'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, ChosenPicker, Single, Form, PopUp } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
const { Item } = Form

import { accountConfigActions } from 'app/redux/Config/Account/index.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class Regret extends React.Component {

    componentDidMount() {
		thirdParty.setTitle({title: '反悔模式'})
        thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({show: false})
        this.props.dispatch(accountConfigActions.getRegretList())
    }

    state={
        name: '',
        uuid: '',
        oriType: '',
        newType: '',
        modifyJudge: {
            hasJrData: false,
            billAndOpenBalance: false,
        },
        showModal: false
    }

    render() {

        const { dispatch, accountConfigState, history } = this.props
        const { name, uuid, oriType, newType, modifyJudge, showModal } = this.state


        const regretList = accountConfigState.getIn(['regret', 'regretList']).toJS()
        const typeObject = {cash: '现金', general: '一般户', basic: '基本户', Alipay: '支付宝', 'WeChat': '微信', other: '其它', spare: '备用金'}

        let typeList = [
            {key: '现金', value: 'cash'}, {key: '一般户', value: 'general'}, {key: '基本户', value: 'basic'}, {key: '备用金', value: 'spare'},
			{key: '支付宝', value: 'Alipay'}, {key: '微信', value: 'WeChat'}, {key: '其它', value: 'other'}
        ]
        typeList.forEach((v, i) => { if (v['value']==oriType) { typeList.splice(i, 1) } })

        return(
            <Container className="account-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="账户">
                            <Single
                                district={regretList}
                                value={uuid}
                                onOk={value => {
                                    this.setState({
                                        name: value['name'],
                                        uuid: value['uuid'],
                                        oriType: value['type'],
                                        newType: '',
                                        modifyJudge: value['modifyJudge']
                                    })
                                }}
                            >
                                <Row className='config-form-item-select-item'>
                                    {name ? name : '请选择账户'}
                                </Row>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                        <div className="account-regret-modal-text"><div className='text'>已有数据的账户修改账户类型</div></div>
                        <div style={{display: uuid ? '' : 'none'}}>
                            <div className='account-regret-item'>
                                <div>・原账户类型： {typeObject[oriType]}</div>
                                <div>
                                    <span>・该账户已有数据：</span>
                                    {modifyJudge['hasJrData'] ? <div className='text'>（1）流水数据</div> : null}
                                    {modifyJudge['billAndOpenBalance'] ? <div className='text'>
                                        {`${modifyJudge['hasJrData']} ? （2）: （1）`}已结账且存在期初值
                                    </div> : null}
                                </div>
                            </div>
                            <div className="account-regret-modal-text"><div className='text'>以上数据将转移至修改后的账户类型中</div></div>
                        </div>
                        <Item label="账户类型" style={{display: uuid ? '' : 'none'}}>
                            <Single
                                district={typeList}
                                value={newType}
                                onOk={value => { this.setState({ newType: value['value'] }) }}
                            >
                                <Row className={newType ? '' : 'gray'}>
                                    {typeObject[newType]?typeObject[newType]:'账户类型'}
                                </Row>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>
                    </Form>
                </ScrollView>

                <PopUp
					title={'信息确认'}
					visible={showModal}
					footerVisible={true}
					onCancel={() => { this.setState({showModal:false}) }}
					onOk={() => { dispatch(accountConfigActions.accountRegret({uuid, newType}, history)) }}
				>
					<div className="">
						{`「${name}」原账户类型「${typeObject[oriType]}」将修改为「${typeObject[newType]}」.调整数据如下：`}
                        <div className='gray'>
                            {modifyJudge['hasJrData'] ? <div className='text'>・流水数据</div> : null}
                            {modifyJudge['billAndOpenBalance'] ? <div className='text'>・已结账且存在期初值</div> : null}
                        </div>
					</div>
				</PopUp>

                <ButtonGroup>
                    <Button onClick={() => { history.goBack() }}>
                        <Icon type='cancel' size='15' />
                        <span>取消</span>
                    </Button>
                    <Button onClick={() => {
                        if (!uuid) { return thirdParty.Alert('请选择账户')}
                        if (!newType) { return thirdParty.Alert('请选择账户类型')}
                        this.setState({showModal: true})
                    }}>
                        <Icon type='confirm' size='15' />
                        <span>信息确认</span>
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}

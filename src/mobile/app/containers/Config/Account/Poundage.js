import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import 'app/containers/Config/common/style/listStyle.less'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, ChosenPicker, Switch, Form } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
const { Item } = Form

import { accountConfigActions } from 'app/redux/Config/Account/index.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

@connect(state => state)
export default
class Poundage extends React.Component {

	static displayName = 'AccountPoundage'

    componentDidMount() {
		thirdParty.setTitle({title: '手续费设置'})
        thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({show: false})
		this.props.dispatch(accountConfigActions.getAccountPoundage())
        this.props.dispatch(allRunningActions.getRunningSettingInfo())
    }

    render() {

        const { dispatch, accountConfigState, homeState, allState, history } = this.props

        //权限校验
        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const poundageData = accountConfigState.get('poundageData')
		const categoryUuid = poundageData.get('categoryUuid')
		const categoryName = poundageData.get('categoryName')
		const beProject = poundageData.get('beProject')
		const poundageNeedProject = poundageData.get('poundageNeedProject')
		const contactsManagement = poundageData.get('contactsManagement')
		const poundageNeedCurrent = poundageData.get('poundageNeedCurrent')

		const lastCategory = allState.get('oriCategory').toJS()
		let categoryList = []
		lastCategory.map(v => {
			if (v['categoryType']=='LB_FYZC') {
				v['childList'].map(w => {
					if (w['propertyCostList'][0]=='XZ_FINANCE') {//财务费用
						categoryList.push(w)
					}
				})
			}
		})
		loop(categoryList)

        return(
            <Container className="account-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="处理类别">
							<ChosenPicker
								district={categoryList}
								value={categoryUuid}
								onChange={(item) => {
									dispatch(accountConfigActions.getCardDetail(item['uuid']))
								}}
							>
								<Row>
									<span style={{color: categoryName == '请选择处理类别' ? '#ccc' : ''}}>{categoryName}</span>
									<Icon type="arrow-right" size="14"/>
								</Row>
							</ChosenPicker>
                        </Item>
						<Item label="关联项目" style={{display: beProject ? '' : 'none'}}>
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={poundageNeedProject}
                                    onClick={()=> {
                                        dispatch(accountConfigActions.changeAccountSettingData(['poundageData', 'poundageNeedProject'], !poundageNeedProject))
                                    }}
                                />
                            </span>
                        </Item>
						<Item label="关联往来" style={{display: contactsManagement ? '' : 'none'}}>
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={poundageNeedCurrent}
                                    onClick={()=> {
                                        dispatch(accountConfigActions.changeAccountSettingData(['poundageData', 'poundageNeedCurrent'], !poundageNeedCurrent))
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
							if (categoryUuid=='') {
								return thirdParty.toast.info('请选择处理类别')
							}
							dispatch(accountConfigActions.saveAccountPoundage(history))
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

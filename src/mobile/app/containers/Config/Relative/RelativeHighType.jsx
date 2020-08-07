import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Checkbox } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
import * as relativeConfAction from 'app/redux/Config/Relative/relativeConf.action.js'

@connect(state => state)
export default
class RelativeHighType extends React.Component {

    static displayName = 'RelativeHighType'

    constructor(props) {
		super(props)
		this.state = {
            showCheckBox:false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '类别管理'})
        thirdParty.setRight({show: false })
        thirdParty.setIcon({showIcon: false })
    }

    render() {
        const { dispatch, history, relativeConfState, homeState } = this.props
        const { showCheckBox } = this.state

        const reserveTags = relativeConfState.get('tags').delete(0)

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        return(
            <Container className="relative-config">
                <ScrollView flex='1' className="border-top">
                    {
                        reserveTags.map((v,i) =>
                            <div key={v.get('uuid')} className="config-list-item-wrap-style">
                                <div
                                    className="config-list-item-style"
                                    onClick={() => {
                                        if (!showCheckBox) {
                                            const toEdit = () => history.push('/config/relative/relativeType')
                                            dispatch(relativeConfAction.getRelativeHighType(v, toEdit))
                                        } else {
                                            dispatch(relativeConfAction.changeHighTypeBoxStatus(!v.get('checked'), v.get('uuid')))
                                        }
                                    }}
                                >
                                    <span className="config-list-item-checkbox-style" style={{display: showCheckBox ? '' : 'none'}}>
                                        <Checkbox checked={v.get('checked')}/>
                                    </span>
                                    <span className='config-list-item-info-style'>
                                        {v.get('name')}
                                    </span>
                                    <span className="config-list-item-arrow-style">
                                        <Icon type="arrow-right" />
                                    </span>
                                </div>
                            </div>
						)
                    }
                </ScrollView>

                <ButtonGroup style={{display:showCheckBox ? 'none' : 'flex'}}>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                            dispatch(relativeConfAction.beforeAddNewManageType())
                            thirdParty.Prompt({
                                title: '新增主类别',
                                message: '请输入类别名称:',
                                buttonLabels: ['取消', '确认'],
                                onSuccess: (result) => {
                                    if (result.buttonIndex === 1) {
                                        const checkList = [{type: 'topestName', value: result.value}]
                                        configCheck.beforeSaveCheck(checkList, () => {
                                            dispatch(relativeConfAction.changeRelativeHighTypeContent('name',result.value))
                                            dispatch(relativeConfAction.saveRelativeHighTypeContent())
                                        })
                                    }
                                }
                            })
                        }}>
                        <Icon type="add-plus"/>
                        <span>新增</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => this.setState({showCheckBox:true})}
                        >
                        <Icon type="select" />
                        <span>选择</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display:showCheckBox ? 'flex' : 'none'}}>
                    <Button onClick={() => {
                        this.setState({showCheckBox: false})
                        dispatch(relativeConfAction.clearCardSelectList('relativeHighType'))
                    }}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                        const closeModal = () => this.setState({showCheckBox:false})
                        dispatch(relativeConfAction.deleteHighType(closeModal))
                    }}>
                        <Icon type="select" />
                        <span>删除</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}

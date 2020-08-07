import React from 'react'
import { connect } from 'react-redux'
import '../style.less'

import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import PageSwitch from 'app/containers/components/PageSwitch'
import { Button, Checkbox, Switch, message, Icon, Modal } from 'antd'
import * as thirdParty from 'app/thirdParty'
import { TableWrap, TableAll, TableTitle, TableBody, TableItem, TableOver, Tab } from 'app/components'
import { hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'

import TemplateModal from './TemplateModal'

import * as homeActions from 'app/redux/Home/home.action.js'
import { approvalActions } from 'app/redux/Config/Approval/index.js'
import * as approvalTemplateActions from 'app/redux/Config/Approval/ApprovalTemplate/approvalTemplate.action.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
    class ApprovalTemplate extends React.Component {

    static displayName = 'ApprovalTemplate'

    constructor() {
        super()
        this.state = {
            checkList: [],
            showApprovalTempModal: false,
            showDeleteModal: false,
        }
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.approvalState !== nextprops.approvalState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
    }

    render() {

        const { approvalState, homeState, dispatch } = this.props
        const { checkList, showApprovalTempModal, showDeleteModal } = this.state

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const modelList = approvalState.get('modelList')
        const basicComponentList = approvalState.get('basicComponentList')

        const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])

        const reserveTags = ['审批模板', '审批明细']

        return (
            <ContainerWrap type="config-five" className="approval-template">
                <FlexTitle>
                    <div className="flex-title-left">
                        {isSpread ? '' :
                            <PageSwitch
                                pageItem={pageList.get('Config')}
                                onClick={(page, name, key) => {
                                    dispatch(homeActions.addPageTabPane('ConfigPanes', key, key, name))
                                    dispatch(homeActions.addHomeTabpane(page, key, name))
                                }}
                            />
                        }
                        <Tab
                            tabList={reserveTags.map(v => ({key:v,value:v,item:v}))}
                            activeKey={'审批模板'}
                            tabFunc={(v,item) => {
                                if (v.key === '审批明细') {
                                    dispatch(approvalActions.switchApprovalActivePage('ApprovalCard'))
                                }
                            }}
                        />
                    </div>
                    <div className="flex-title-right">
                        <Button
                            disabled={!editPermission}
                            className="title-right"
                            type="ghost"
                            onClick={() => {
                                dispatch(approvalTemplateActions.beforInsertOrModifyApprovalTemplate('insert', {}, () => this.setState({ showApprovalTempModal: true })))
                            }}
                        >
                            新增
                        </Button>
                        <Button
                            className="title-right"
                            type="ghost"
                            disabled={!checkList.length || !editPermission}
                            onClick={() => {
                                this.setState({ showDeleteModal: true })
                            }}
                        >
                            删除
                        </Button>
                        <Modal
                            visible={showDeleteModal}
                            title="温馨提示"
                            onCancel={() => this.setState({ showDeleteModal: false })}
                            footer={[
                                <Button key="back" type="ghost" onClick={() => this.setState({ showDeleteModal: false })}>
                                    取消
                                </Button>,
                                <Button key="submit" type="primary"
                                    onClick={() => {
                                        dispatch(approvalTemplateActions.deleteApprovalTemplate(checkList, () => this.setState({ checkList: [], showDeleteModal: false })))
                                    }}>
                                    确定
                                </Button>
                            ]}
                        >
                            <div>「工作台-审批」中该模版相关设置将被清除、审批数据将无法对接小番财务。确定删除吗？</div>
                        </Modal>
                        <Button
                            // disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
                            className="title-right"
                            type="ghost"
                            onClick={() => {
                                dispatch(approvalActions.getProcessSelectModel())
                                dispatch(allRunningActions.getRunningCategory())
                            }}
                        >
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
                <TableWrap notPosition={true}>
                    <TableAll>
                        <TableTitle
                            className="approval-template-table-width"
                            titleList={['审批名称', '明细范围', '关联流水', '更新模版', '状态']}
                            hasCheckbox={true}
                            selectAcAll={checkList.length === modelList.size && modelList.size !== 0}
                            onClick={() => {
                                if (checkList.length === modelList.size && modelList.size !== 0) {
                                    this.setState({ checkList: [] })
                                } else {
                                    const newArr = modelList.map(v => v.get('modelCode'))
                                    this.setState({ checkList: newArr.toJS() })
                                }
                            }}
                        />
                        <TableBody>
                            {
                                modelList.map((v, i) => {
                                    return (
                                        <TableItem className="approval-template-table-width approval-template-table-style" key={i} line={i + 1}>
                                            <li onClick={() => {
                                                let newArr = checkList
                                                const post = newArr.findIndex(w => w === v.get('modelCode'))
                                                if (post === -1) {
                                                    newArr.push(v.get('modelCode'))
                                                    this.setState({ checkList: newArr })
                                                } else {
                                                    newArr.splice(post, 1)
                                                    this.setState({ checkList: newArr })
                                                }
                                            }}><Checkbox checked={checkList.indexOf(v.get('modelCode')) > -1} /></li>
                                            <li>
                                                <span>
                                                    {
                                                        // <Icon
                                                        //     type="edit"
                                                        //     className="approval-card-table-click-icon"
                                                        //     onClick={() => {

                                                        //     }}
                                                        // />
                                                    }
                                                    <span className='approval-card-table-click' onClick={() => {
                                                        const parameter = {
                                                            jrCategoryType: v.get('jrCategoryType'),
                                                            modelCode: v.get('modelCode'),
                                                            jrCategoryUuid: v.get('jrCategoryId'),
                                                        }

                                                        if (hideCategoryCanSelect.indexOf(v.get('jrCategoryType')) > -1) {
                                                            dispatch(approvalTemplateActions.beforInsertOrModifyApprovalhideCategoryTemp('modify', parameter, () => this.setState({ showApprovalTempModal: true })))
                                                        } else {
                                                            dispatch(approvalTemplateActions.beforInsertOrModifyApprovalTemplate('modify', parameter, () => this.setState({ showApprovalTempModal: true })))
                                                        }
                                                        // if (v.get('modelStatus') === 'ENABLE') {
                                                        //     thirdParty.openSlidePanel(`https://aflow.dingtalk.com/dingtalk/pc/query/pchomepage.htm?corpid=${sessionStorage.getItem('corpId')}#/custom?processCode=${v.get('processCode')}&swfrom=xfannix`, '审批')
                                                        // } else {
                                                        //     message.info('请先启用审批模板')
                                                        // }
                                                    }}>
                                                        {v.get('modelName')}
                                                    </span>
                                                </span>
                                            </li>
                                            <TableOver textAlign={'left'}>{v.get('detailScope')}</TableOver>
                                            <TableOver textAlign={'left'}>{v.get('jrCategoryName')}</TableOver>
                                            <li>
                                                <Icon
                                                    type="reload"
                                                    style={{fontSize: '14px'}}
                                                    onClick={() => {
                                                        dispatch(approvalTemplateActions.getApprovalModelSync(v.get('modelCode')))
                                                    }}
                                                />
                                            </li>
                                            <li>
                                                <Switch
                                                    className="use-unuse-style"
                                                    disabled={!editPermission}
                                                    checked={v.get('modelStatus') === 'ENABLE'}
                                                    onChange={(value) => {
                                                        if (v.get('modelStatus') === 'ENABLE') {
                                                            dispatch(approvalTemplateActions.changeApprovalModelState(v.get('modelCode'), 'DISABLE', i))
                                                        } else {
                                                            dispatch(approvalTemplateActions.changeApprovalModelState(v.get('modelCode'), 'ENABLE', i))
                                                        }
                                                    }}
                                                />
                                            </li>
                                        </TableItem>
                                    )
                                })
                            }
                        </TableBody>
                    </TableAll>
                </TableWrap>
                {
                    showApprovalTempModal ?
                        <TemplateModal
                            basicComponentList={basicComponentList}
                            onCancel={() => {
                                this.setState({ showApprovalTempModal: false })
                            }}
                        /> : null
                }
            </ContainerWrap>
        )
    }
}

// <Button
//     // disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
//     className="title-right"
//     type="ghost"
//     onClick={() => {
//         const id = '2685b076-4980-4751-a35f-a9d07de3665b'
//         thirdParty.openSlidePanel(`https://aflow.dingtalk.com/dingtalk/pc/query/pchomepage.htm?corpid=${sessionStorage.getItem('corpId')}#/approval?procInstId=${id}`, '查看审批')
//     }}
// >
//     查看审批详情
// </Button>

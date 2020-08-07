import React from 'react'
import { connect } from 'react-redux'

import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import PageSwitch from 'app/containers/components/PageSwitch'
import { Button, Checkbox, Modal, message } from 'antd'
import { TableWrap, TableAll, TableTitle, TableBody, TableItem, TableOver, Tab } from 'app/components'

import CardModal from './CardModal'

import * as homeActions from 'app/redux/Home/home.action.js'
import { approvalActions } from 'app/redux/Config/Approval/index.js'
import * as approvalCardActions from 'app/redux/Config/Approval/ApprovalCard/approvalCard.action.js'

import '../style.less'

@connect(state => state)
export default
    class ApprovalCard extends React.Component {

    constructor() {
        super()
        this.state = {
            checkList: [],
            showCardmodal: false,
            showDeleteModal: false,
        }
    }

    componentDidMount() {

    }
    //
    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.approvalState !== nextprops.approvalState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
    }

    render() {

        const { approvalState, homeState, approvalCardState, dispatch } = this.props
        const { checkList, showCardmodal, showDeleteModal } = this.state

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const detailList = approvalState.get('detailList')
        const basicComponentList = approvalState.get('basicComponentList')

        const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])

        const reserveTags = ['审批模板', '审批明细']

        return (
            <ContainerWrap type="config-five" className="approval-card">
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
                            activeKey={'审批明细'}
                            tabFunc={(v,item) => {
                                if (v.key === '审批模板') {
                                    dispatch(approvalActions.switchApprovalActivePage('ApprovalTemplate'))
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
                                dispatch(approvalCardActions.beforeInsertOrModifyDetail('insert', () => this.setState({ showCardmodal: true })))
                            }}>
                            新增
                        </Button>
                        <Button
                            className="title-right"
                            type="ghost"
                            disabled={!checkList.length || !editPermission}
                            onClick={() => {
                                this.setState({ showDeleteModal: true })
                            }}>
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
                                        dispatch(approvalCardActions.deleteApprovalCard(checkList, () => this.setState({ checkList: [], showDeleteModal: false })))
                                    }}>
                                    确定
                                </Button>
                            ]}
                        >
                            <div>确定删除？</div>
                        </Modal>
                        <Button
                            // disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
                            className="title-right"
                            type="ghost"
                            onClick={() => {
                                dispatch(approvalActions.getProcessSelectModel())
                            }}>
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
                <TableWrap notPosition={true}>
                    <TableAll>
                        <TableTitle
                            className="approval-card-table-width"
                            titleList={['明细名称', '模板范围']}
                            hasCheckbox={true}
                            selectAcAll={checkList.length === detailList.size && detailList.size !== 0}
                            onClick={() => {
                                if (checkList.length === detailList.size && detailList.size !== 0) {
                                    this.setState({ checkList: [] })
                                } else {
                                    const newArr = detailList.map(v => v.get('detailCode'))
                                    this.setState({ checkList: newArr.toJS() })
                                }
                            }}
                        />
                        <TableBody>
                            {
                                detailList.map((v, i) => {
                                    return (
                                        <TableItem className="approval-card-table-width approval-card-table-style" key={i} line={i + 1}>
                                            <li onClick={() => {
                                                let newArr = checkList
                                                const post = newArr.findIndex(w => w === v.get('detailCode'))
                                                if (post === -1) {
                                                    newArr.push(v.get('detailCode'))
                                                    this.setState({ checkList: newArr })
                                                } else {
                                                    newArr.splice(post, 1)
                                                    this.setState({ checkList: newArr })
                                                }
                                            }}><Checkbox checked={checkList.indexOf(v.get('detailCode')) > -1} /></li>
                                            <TableOver
                                                isLink={v.get('canModify')}
                                                className={v.get('canModify') ? '' : "approval-card-table-click-disabled"}
                                                textAlign={'left'}
                                                liOnClice={() => {
                                                    if (v.get('canModify')) {
                                                        dispatch(approvalCardActions.beforeInsertOrModifyDetail(v.get('detailCode'), () => this.setState({ showCardmodal: true })))
                                                    } else {
                                                        message.info('系统明细，暂不支持修改')
                                                    }
                                                }}
                                            >{v.get('label')}</TableOver>
                                            <TableOver textAlign={'left'}>{v.get('modelScope')}</TableOver>
                                        </TableItem>
                                    )
                                })
                            }
                        </TableBody>
                    </TableAll>
                </TableWrap>
                {
                    showCardmodal ?
                        <CardModal
                            basicComponentList={basicComponentList}
                            onCancel={() => {
                                this.setState({ showCardmodal: false })
                            }}
                        /> : null
                }
            </ContainerWrap>
        )
    }
}

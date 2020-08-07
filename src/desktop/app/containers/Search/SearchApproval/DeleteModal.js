import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'

import { message, Input, Modal, Tree, Button, Checkbox, Tooltip } from 'antd'
const TreeNode = Tree.TreeNode
import { TableBody, CxpzTableItem, JxcTableAll, TableTitle, TableItem, Icon } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import { showAccountState, showToolTipAccountState } from 'app/containers/Search/SearchApproval/common/common.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
class DeleteModal extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			selectList: [],
		}
	}
    render() {

        const {
            onCloseModal,
            canDeleteIdList,
            clearSelectList,
            approvalList,
            editLrAccountPermission,
            dispatch,
        } = this.props
        const { selectList } = this.state

        const disabledState = ['PROCESS_PAYING', 'PROCESS_ACCOUNTING', 'PROCESS_INCOME', 'PROCESS_BOOK_KEEPING']
        const showList = approvalList.filter(v => canDeleteIdList.indexOf(v.get('id')) > -1)
        const isSelectAll = canDeleteIdList.size ? showList.every(v => v.get('detailList').every(w => disabledState.indexOf(w.get('dealState')) === -1) ? selectList.indexOf(v.get('id')) > -1 : true) : false

        return (
            <Modal
                title={"删除审批"}
                visible={true}
                width='600px'
                maskClosable={false}
                onCancel={() => {
                    onCloseModal()
                }}
                // width="800px"
                // height="319px"
                footer={[
                    <Button
                        type="ghost"
                        onClick={() => {
                            onCloseModal()
                        }}
                    >
                        取消
                    </Button>,
                    <Button
                        type="primary"
                        onClick={() => { 
                            if (selectList.length) {
                                dispatch(searchApprovalActions.deleteApprovalProcess(selectList, () => {
                                    this.setState({selectList: []})
                                }))
                            } else {
                                message.info('请选择要删除的审批')
                            }
                        }}
                    >
                        确定
                    </Button>
                ]}
            >
                <div className="search-approval-delete-modal-wrap">
                    <ul className="uses-tip">
                        <li>为了保证您的数据安全，仅当审批在钉钉管理后台被删除，且审批的“记账状态”为空，才可在小番内删除记录，<span className="search-approval-delete-modal-guid-text" onClick={() => {
                           
                            thirdParty.openLink({
                                url: 'https://h5.dingtalk.com/group-live-share/index.htm?encCid=0c4dfbc084b288589cd227ac22aedd01&liveUuid=0ab574fb-853d-4ce7-9b0f-c7e4aabd75dd'
                            })
                        }}>点击查看操作视频</span>；</li>
                        <li>审批删除以后，无法恢复，请谨慎操作；</li>
                    </ul>
                    <div>可删除的审批列表</div>
                    <JxcTableAll>
                        <TableTitle
                            className="search-approval-delete-table-width"
                            titleList={['提交日期', '完成日期', '审批名称', '明细类型', '记账状态']}
                            hasCheckbox={true}
                            disabled={!canDeleteIdList.size}
                            selectAcAll={isSelectAll}
                            onClick={() => {
                                if (isSelectAll) {
                                    this.setState({selectList: []})
                                } else {
                                    let newSelect = []
                                    showList.forEach(v => {
                                        if (v.get('detailList').every(w => disabledState.indexOf(w.get('dealState')) === -1)) {
                                            newSelect.push(v.get('id'))
                                        }
                                    })
                                    this.setState({selectList: newSelect})
                                }
                            }}
                        />
                        <TableBody>
                            {
                                canDeleteIdList.size ? showList.map((v, i) => {
                                    return (
                                        <CxpzTableItem className="search-approval-delete-table-width" key={i}>
                                            <li>
                                                <Checkbox
                                                    checked={selectList.indexOf(v.get('id')) > -1}
                                                    disabled={v.get('detailList').some(w => disabledState.indexOf(w.get('dealState')) > -1)}
                                                    onClick={() => {
                                                        if (selectList.indexOf(v.get('id')) > -1) {
                                                            let oriSelectList = selectList.filter(w => w !== v.get('id'))
                                                            this.setState({selectList: oriSelectList})
                                                        } else {
                                                            selectList.push(v.get('id'))
                                                            this.setState({selectList: selectList})
                                                        }
                                                    }}
                                                />
                                            </li>
                                            <li>{v.get('createTime').substr(0, 10)}</li>
                                            <li>{v.get('finishTime').substr(0, 10)}</li>
                                            <li>
                                                <span className="table-item-line-mutil-line">
                                                    <Tooltip
                                                        placement="top"
                                                        title={(
                                                            <div className="table-item-line-tooltip">
                                                                <div>{v.get('processTitle')}</div>
                                                                <div>{`(单号:${v.get('processBusinessCode')})`}
                                                                </div>
                                                            </div>)}
                                                    >
                                                        <p className="table-item-line-click">
                                                            {v.get('processTitle')}
                                                        </p>
                                                    </Tooltip>
                                                </span>
                                            </li>
                                            <li>
                                                {v.get('detailList').map((v,i) => {
                                                    return (
                                                        <p className="table-item-line search-approval-table-line" key={i}> 
                                                            {v.get('detailType')}
                                                        </p>
                                                    )
                                                })}
                                            </li>
                                            <li>
                                            {v.get('detailList').map((v, i) => 
                                                <p className="table-item-line search-approval-table-line" key={i}>
                                                    <span className="search-approval-table-frist-child">{showAccountState[v.get('dealState')] ? showAccountState[v.get('dealState')] : ''}</span>
                                                    {
                                                        v.get('dealState') ? <span className={"table-item-line-click"} onClick={e => {
                                                            if (editLrAccountPermission) {
                                                                dispatch(searchApprovalActions.cancelApprovalProcessDetailInfo([v.get('id')], () => clearSelectList()))
                                                            }
                                                        }}>
                                                            <Tooltip
                                                                placement="top"
                                                                title={`反${showToolTipAccountState[v.get('dealState')]}`}
                                                            >
                                                                <Icon type="rollback" style={{color: editLrAccountPermission ? '#333' : '#ccc'}}/>
                                                            </Tooltip>
                                                        </span> : ''
                                                    }
                                                </p>
                                            )}
                                            </li>
                                        </CxpzTableItem>
                                    ) 
                                }) : 
                                <TableItem className="search-approval-delete-table-width">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </TableItem>
                            }
                        </TableBody>
                    </JxcTableAll>
                </div>
            </Modal>
        )
    }
}

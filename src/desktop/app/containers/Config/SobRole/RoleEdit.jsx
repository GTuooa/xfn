import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Button, Radio, Modal, Input, message }	from 'antd'
import { Icon } from 'app/components'
import thirdParty from 'app/thirdParty'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

@immutableRenderDecorator
export default
class RoleEdit extends React.Component {

    constructor() {
		super()
		this.state = {
            roleInputName: '',
            showEditModal: false,
            index: '',
            deleteModal: false,
            deleteErr: false,
		}
	}

	render() {

        const { dispatch, roleList, roleTemp, haveChanged, insertOrModify, sobName } = this.props
        const { roleInputName, showEditModal, deleteModal, deleteErr, index } = this.state

        // roleId: "1237293152777539584"
		// roleInfo: "admin"
        // roleName: "账套管理员" 
        const isMidify = insertOrModify === 'modify'

        const beforeSave = (ok) => {
            if (haveChanged) {
                thirdParty.Confirm({
                    title: '提示',
                    message: '是否保存本次修改？',
                    buttonLabels: ['取消', '确认'],
                    onSuccess : (result) => {
                        if (result.buttonIndex === 1) {
                            dispatch(sobRoleActions.modifySobRoleModule(ok))
                        } else {
                            ok()
                        }
                    }
                })
            } else {
                ok()
            }
        }

		return (
			<div className="sob-role-list-wrap">
                <ul className="sob-role-list">
                    {
                        roleList.map((v, i) => {
                            const isCurrent = v.get('roleId') == roleTemp.get('roleId')
                            return (
                                <li className={isCurrent ? "sob-role-item-current" : "sob-role-item"} key={i} onClick={() => {
                                    if (!isCurrent) {
                                        beforeSave(() => dispatch(sobRoleActions.switchSobRoleCurrentRole(v)))
                                    }
                                }}>
                                    <span className="sob-role-item-name">{v.get('roleName')}</span>
                                    <Icon
                                        style={{display: isCurrent && v.get('roleInfo') !== 'admin' ? '' : 'none'}}
                                        type="edit"
                                        theme="twoTone"
                                        onClick={e => {
                                            e.stopPropagation();
                                            dispatch(sobRoleActions.beforeEditSobRole('modify'))
                                            this.setState({showEditModal: true, roleInputName: v.get('roleName'), index: i})
                                        }} 
                                    />
                                </li>
                            )
                        })
                    }
                    {
                        // roleTemp.get('roleId') ? null :
                        // <li className={"sob-role-item-current"} key={'new'}>
                        //     <span className="sob-role-item-name">{roleTemp.get('roleName')}</span>
                        //     <Icon type="edit" theme="twoTone" />
                        // </li>    
                    }
                </ul>
                <div
                    className="sob-role-new-wrap"
                    onClick={() => {
                        beforeSave(() => {
                            dispatch(sobRoleActions.beforeEditSobRole('insert'))
                            this.setState({showEditModal: true})
                        })
                    }}
                >
                    <span className="sob-role-new-btn"><Icon type="plus-circle" />&nbsp;新增自定义角色</span>
                </div>
                <Modal
					title={isMidify ? '编辑角色' : '新增自定义角色'}
                    visible={showEditModal}
					onCancel={() => this.setState({showEditModal: false, roleInputName: ''})}
					footer={[
                        <Button key="cancel" type="ghost" onClick={() => {this.setState({showEditModal: false, roleInputName: ''})}}>
                            取消
                        </Button>,
                        <Button key="delete" type="danger" style={{display: isMidify ? '' : 'none'}} onClick={() => {
                            this.setState({showEditModal: false, deleteModal: true})
                        }}>
                            删除
                        </Button>,
                        <Button key="ok" type="primary" onClick={() => {
                            if (roleInputName) {
                                dispatch(sobRoleActions.saveSobRole(roleInputName, roleTemp, insertOrModify, index))
                                this.setState({showEditModal: false, roleInputName: ''})
                            } else {
                                message.info('请输入角色名称')
                            }            
                        }}>
                            确定
                        </Button>
                    ]}
				> 
                    <div className="sob-role-edit-wrap">
                        <spna className="sob-role-edit-lable">角色名称:</spna>
                        <span className="sob-role-edit-input">
                            <Input
                                value={roleInputName}
                                onChange={e => {
                                    this.setState({
                                        roleInputName: e.target.value
                                    })
                                }}
                            />
                        </span>
                    </div>
                </Modal>					
                <Modal
					title={'删除角色'}
                    visible={deleteModal}
					onCancel={() => this.setState({deleteModal: false, deleteErr: false})}
					footer={[
                        <Button key="cancel" type="ghost" style={{display: deleteErr ? 'none' : ''}} onClick={() => {this.setState({deleteModal: false, deleteErr: false})}}>
                            取消
                        </Button>,
                        <Button key="delete" type="primary" style={{display: deleteErr ? 'none' : ''}} onClick={() => {
                            dispatch(sobRoleActions.deleteSobRole(roleTemp, (json) => {
                                if (json.code === 0) {
                                    this.setState({deleteModal: false})
                                } else if (json.code === 3004) {
                                    this.setState({deleteErr: true})
                                } else {
                                    this.setState({deleteModal: false})
                                }
                            }))      
                        }}>
                            删除
                        </Button>,
                        <Button key="ok" type="primary" style={{display: deleteErr ? '' : 'none'}}  onClick={() => {
                            this.setState({deleteModal: false, deleteErr: false})   
                        }}>
                            确定
                        </Button>
                    ]}
				> 
                    <div className="sob-role-edit-wrap">
                        {
                            deleteErr ? 
                            <ul>
                                <li>{`”${sobName}“账套中，“${roleTemp.get('roleName')}”角色正在使用中；`}</li>
                                <li>{`可以前往“账套设置”中删除角色中的人员，再进行删除操作。`}</li>
                            </ul>
                            :
                            <div>
                                {`确认删除”${sobName}“账套中的“${roleTemp.get('roleName')}”角色吗？` }  
                            </div>
                        }
                    </div>
                </Modal>					
            </div>
		)
	}
}

import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import { Button, Icon } from 'antd'
import * as thirdParty from 'app/thirdParty'

import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

function chooseLib(list, callback) {

	if (global.isplayground)
		return

	thirdParty.choose({
		// startWithDepartmentId: 0,
		multiple: true,
		users: list.map(v => v.get('emplId')).toJS(),
		max: 1500,
		onSuccess: (resultlist) => {
			// 点击取消时的 resultlist 返回为 []，此时不要重置已有的人员，正常情况下resultlist不可能为[]，所以直接用长度判断
			if (resultlist.length) {
				resultlist = resultlist.map(v => {
					v.emplId = v.emplId.toString()
					const openReview = list.find(w => w.get('emplId') === v.emplId.toString())
					v.openReview = openReview ? openReview.get('openReview') : false
					return v
				})
				callback(resultlist)
			}
		},
		onFail: (err) => {
			console.log('err', err);
			
			// thirdParty.Alert('获取钉钉通讯录失败，请刷新后重试')
		}
	})
}

@immutableRenderDecorator
export default
class RolePick extends React.Component {

	constructor(props) {
		super(props)
		this.state = {showRoleList: false}
	}

	render() {

		const {
			adminlist,
			observerlist,
			operatorlist,
			vcObserverList,
			cashierList,
			flowObserverList,
			reviewList,
			vcReviewList,
			flowReviewList,
			dispatch,
            running,
            gl,
			sobid,
			sobname,
			sobType,
			accountingRoleInfo,
			smartRoleInfo,
			canModify,
        } = this.props
		const { showRoleList } = this.state

		const roleList = sobType === 'SMART' ? smartRoleInfo : accountingRoleInfo
		const listName = sobType === 'SMART' ? 'smartRoleInfo' : 'accountingRoleInfo'

		const roleArr = []
		for(let i = 0; i < roleList.size; i += 3){
			roleArr.push(roleList.slice(i,i+3));
		}

		return (
            <div className="sob-option-list">
				<div className="sob-option-show-hide-tip" onClick={() => this.setState({showRoleList: !showRoleList})} style={{display: sobid ? 'none' : ''}}>
					<span>{showRoleList ? '收起更多' : '展开更多'}</span>
					<Icon type={showRoleList ? 'up' : 'down'}/>
					&nbsp;<span style={{display: showRoleList ? '' : 'none'}}>······································································································································································································································</span>
				</div>
				<div style={{display: sobid ? '' : (showRoleList ? '' : 'none')}} className="sob-option-row-role">
					<label className="sob-option-row-role-lable">
						<div>
							角色权限：
						</div>
						<div
							className="sob-option-row-role-set-btn"
							style={{display: sobid && canModify ? '' : 'none'}}
							onClick={() => {
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'SobRole', 'SobRole', '角色编辑'))
								dispatch(homeActions.addHomeTabpane('Config', 'SobRole', '角色编辑'))
								dispatch(sobRoleActions.getSobRoleListFromSobConfig(sobid, sobType, sobname))
							}}
						>
							<span>设置</span><Icon type="edit" />
						</div>
					</label>
	                <div className="role-limit-box">
						{
							roleArr.map((itemArr, i) => {
								return (
									<div className="role-limit-item-wrap">
										{
											itemArr.map((v, j)=> {
												const pos = i*3+j
												
												return (
													<div className="role-limit" key={pos}>
														<p className="role-title">{v.get('roleName')}</p>
														<div className="role-list-name">
															{
																v.get('userList').map((item, index) =>{
																	return (
																		<p key={item.get('emplId')} className="span-hide">
																			{item.get('name')}
																			&nbsp;
																			<i onClick={() => dispatch(sobConfigActions.sobOptionRoleDelete(listName, pos, index))}>×</i>
																		</p>
																	)
																})
															}
														</div>
														<Button
															className="add-role-btn"
															onClick={() => {
																chooseLib(v.get('userList'), (resultlist) => {
																	dispatch(sobConfigActions.changeSobPermissionList(listName, pos, resultlist))
																})
															}}
														>
															<Icon
																type="plus"
																style={{color:'#a90202'}}
															/>
															添加
														</Button>
													</div>
												)
											})
										}
									</div>
								)
							})
						}
	                </div>
				</div>
				<div style={{display: sobid ? '' : (showRoleList ? '' : 'none')}} className="sob-option-show-hide-tip-bottom">
					<span onClick={() => {
						if (sobType === 'SMART') {
							thirdParty.openLink({
								url: 'https://www.xfannix.com/support/desktop/app/index.html?id=3.2#/sysczn'
							})
						} else {
							thirdParty.openLink({
								url: 'https://www.xfannix.com/support/desktop/app/index.html?id=3.2#/sysc'
							})
						}
					}}>
						前往查看权限说明文档 >>
					</span>
				</div>
            </div>
		)
	}
}

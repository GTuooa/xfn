import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'

import { Drawer, Icon } from 'antd'
// import Enclosure from './Enclosure'

import * as lsItemComponents from './LsItem'
import * as calLsItemComponents from './CalLsItem'
import ButtonBar from './ButtonBar'
import Journal from './Journal'
import Enclosure from './Enclosure'
import ProcessInfo from './ProcessInfo'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class ChildDrawer extends React.Component {
	state = {
		page:'detail'
	}
	render() {
        const {
			relatedJrOri,
			relatedCategory,
			relatedProcessInfo,
			lsItemNameJson,
			calLsItemJson,
			relatedActiveKey,
			relatedRunningShow,
			onClose,
			onChangeRelatedActiveKey,
			dispatch,
			runningPreviewState,
			editLrAccountPermission,
			oriStateName,
			searchRunningState,
			accountList,
			intelligentStatus,
			enableWarehouse,
			placement,
			jrOri,
			refreshList,
			lrPermissionInfo,
			pageActive,
			reviewLrAccountPermission,
		} = this.props

		const oriState = relatedJrOri.get('oriState')
		const categoryType = relatedCategory.get('categoryType')
		const beBusiness = relatedJrOri.get('beBusiness')
		const oriAbstract = relatedJrOri.get('oriAbstract')
		const uuidList = relatedJrOri.get('uuidList') || fromJS([])
		let deleteVcId = [], deleteYear, deleteMonth
		relatedJrOri && relatedJrOri.get('vcList') && relatedJrOri.get('vcList').map((u, i) => {
			deleteVcId.push({
				vcIndex: u.get('vcIndex')
			})
			deleteYear = u.get('year')
			deleteMonth = u.get('month')
		})
		// 所有流水部分
		const mainContain = (name) => {
			const Component = name ? lsItemComponents[name] : lsItemComponents['Other']
			return (
				<Component
					jrOri={relatedJrOri}
					category={relatedCategory}
					lsItemData={relatedJrOri.update(v => v.concat(relatedCategory))}
					oriState={oriState}
					activeKey={relatedActiveKey}
					isCurrentRunning={false}
					onChangeActiveKey={onChangeRelatedActiveKey}
					enableWarehouse={enableWarehouse}
				/>
			)
		}

		// 核算管理主体部分
		const calLsMainContain = (name) => {
			const Component = categoryType === 'LB_JZCB'? calLsItemComponents['Jzcb'] : calLsItemComponents[name]

			return (
				Component?
				<Component
					jrOri={relatedJrOri}
					category={relatedCategory}
					lsItemData={relatedJrOri.update(v => v.concat(relatedCategory))}
					oriState={oriState}
					activeKey={relatedActiveKey}
					isCurrentRunning={false}
					onChangeActiveKey={onChangeRelatedActiveKey}
					enableWarehouse={enableWarehouse}
				/>:''
			)
		}

		return (
            <Drawer
                className="ylls-wrap"
                width={479}
                closable={false}
                onClose={onClose}
				visible={relatedRunningShow}
				placement={placement}
            >
				<div>
					<div className="ylls-title">
						<span className="ylls-title-text">查看流水</span>
						<span
							onClick={onClose}
							className="ylls-title-icon"
						>
							<Icon type="close" />
						</span>
					</div>
					<ButtonBar
						dispatch={dispatch}
						isClose={false} // 是否已结账
						lsItemData={relatedJrOri.update(v => v.concat(relatedCategory))}
						editLrAccountPermission={editLrAccountPermission}
						beBusiness={beBusiness}
						oriState={oriState}
						currentItem={relatedJrOri.update(v => v.concat(relatedCategory))}
						categoryType={categoryType}
						fromPage={'ylls'}
						uuidList={uuidList}
						uuid={relatedJrOri.get('oriUuid')}
						currentOri={jrOri}
						isCurrentRunning={false}
						refreshList={refreshList}
						onClose={onClose}
						deleteYear={deleteYear}
						deleteMonth={deleteMonth}
						deleteVcId={deleteVcId}
						pageActive={pageActive}
						showRelatedRunning={() => this.setState({relatedRunningShow: true, showMask: true})}
						reviewLrAccountPermission={reviewLrAccountPermission}
						refreshList={() => {
							dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(relatedJrOri.get('oriUuid'),uuidList))
						}}
					/>
					<div className={'ylls-drawer-content'}>
						<div
							className="pcxls-account"
							style={{display: relatedJrOri.get('beCertificate') ? 'block' : 'none'}}
							>
							已审核
						</div>
						<ul className='ylls-item-detail'>
							<li className='ylls-category-name'>
								<div className='ylls-category-name-word'>
									{relatedJrOri.get('categoryFullName')}
									<div className='ylls-bulebtn' style={{display:categoryType === 'LB_JZCB' || oriStateName[oriState]?'':'none'}}>{categoryType === 'LB_JZCB'?{STATE_YYSR_ZJ:'直接结转',STATE_YYSR_XS:'销售成本结转',STATE_YYSR_TS:'退销转回成本'}[oriState]:oriStateName[oriState]}</div>
								</div>
							</li>
							<li><span>流水号：</span><span style={{display:relatedJrOri.get('jrIndex')?'':'none'}}>{relatedJrOri.get('jrIndex')}号</span></li>
							<li><span>流水日期：</span><span>{relatedJrOri.get('oriDate')}</span></li>
							<li style={{lineHeight:'150%'}}><span>摘要：</span><span>{oriAbstract}</span></li>
						</ul>
						<div className='ylls-detail-menu'>
							<span
								onClick={() => {
									this.setState({page:'detail'})
								}}
								className={this.state.page === 'detail'?'ylls-detail-menu-active':''}

							>流水详情</span>
							<span
								onClick={() => {
									this.setState({page:'other'})
								}}
								className={this.state.page === 'other'?'ylls-detail-menu-active':''}
							>流水分录</span>
							<span>
								制单人：{`${relatedJrOri.get('createUserName')} ${relatedJrOri.get('createTime')}`}
							</span>
						</div>
						{
							this.state.page === 'detail'?
							calLsMainContain(calLsItemJson[oriState],categoryType) || mainContain(lsItemNameJson[categoryType])
							:
							<Journal
								dispatch={dispatch}
								lsItemData={relatedJrOri.update(v => v.concat(relatedCategory))}
								categoryType={categoryType}
								editLrAccountPermission={editLrAccountPermission}
								searchRunningState={searchRunningState}
								accountList={accountList}
								intelligentStatus={intelligentStatus}
								isCurrentRunning={false}
								showRelatedRunning={() => this.setState({relatedRunningShow: true, showMask: true})}
								lrPermissionInfo={lrPermissionInfo}
							/>
						}
						{
							this.state.page === 'detail'?
							<Enclosure
								dispatch={dispatch}
								enclosureList={relatedJrOri.get('enclosureList')}
								editLrAccountPermission={editLrAccountPermission}
							/>:''
						}
						{
							relatedProcessInfo ?
							<ProcessInfo
								processInfo={relatedProcessInfo}
							/>
							: null
						}
						<div className='ylls-end-content'>
							<span style={{visibility:relatedJrOri.get('auditUserName')?'':'hidden'}}>审核人：{`${relatedJrOri.get('auditUserName')} ${relatedJrOri.get('auditTime')}`}</span>
							<span style={{visibility:relatedJrOri.get('modifyUserName')?'':'hidden'}}>修改人：{`${relatedJrOri.get('modifyUserName')} ${relatedJrOri.get('modifyTime')}`}</span>
						</div>
					</div>
				</div>
            </Drawer>
        )
    }
}

import React from 'react'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as fjglActions from 'app/redux/Search/Fjgl/fjgl.action.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as exportRecordingActions from 'app/redux/Search/ExportRecording/exportRecording.action'

import { debounce } from 'app/utils'
import { Button, Menu, Dropdown, Icon, Select, Input, Modal, Tooltip, Progress } from 'antd'
import {  message as msg  } from 'antd'
import { ROOT } from 'app/constants/fetch.constant.js'
import { ImportModal, ExportModal } from 'app/components'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { decimal, judgePermission} from 'app/utils'
// const ProgressLine = Progress.Line
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class Title extends React.Component {

	constructor() {
		super()
		this.state = { modalVisible: false, download: false, needCreatedby: '1' }
	}

	render() {

		const {
			issuedate,
			allState,
			onChange,
			onMaskClick,
			issues,
			dispatch,
			vclist,
			fjglState,
			closeby,
			year,
			month,
			firstyear,
			havVc,
			vclistExist,
			detailList,
			// PzPermissionInfo,
			receiveAble,
			cancelReceiveAble,
			inputValue,
			changeInputValue,
			changeSearchValue,
			onChangeLabel,
			intelligentStatus
		} = this.props
		const { modalVisible, download, needCreatedby } = this.state

		const showMessageMask = fjglState.getIn(['flags','showMessageMask'])
		const iframeload = fjglState.getIn(['flags','iframeload'])
		const importresponlist = fjglState.get('importresponlist')
		const failJsonList = importresponlist.get('failJsonList')
		const successJsonList = importresponlist.get('successJsonList')
		const message = fjglState.get('message')

		const jvyear = issuedate.substr(0, 4)
		const jvmonth = issuedate.substr(6, 2)
		const selectVc = vclist.filter(v => v.get('checkboxDisplay'))
		const vcIndexList = selectVc.map(v => v.get('vcindex'))
		const vcIndexurl = vcIndexList.reduce((v, pre) => pre + '&vcIndex=' + v)

		const needDownLoad = fjglState.get('needDownLoad').toJS()
		const label=fjglState.get('label')
		const labelValue=fjglState.get('labelValue')
		const totalSize=fjglState.get('totalSize')
		const useSizeBySob=fjglState.get('useSizeBySob')
		const useSizeByCorp=fjglState.get('useSizeByCorp')
		let hasChecked=false;
		let hasCheckedAndReviewed=false;
		let checkEnclosureLength = 0
		vclist.forEach((v)=>{
			if(v.get('enclosureList').some(w => w.get('checkboxFjDisplay'))){
				hasChecked=true;
				if(hasChecked&&v.get('reviewedby')){
					hasCheckedAndReviewed=true
				}
				return
			}
		})

		const corpPercent=((useSizeByCorp/(totalSize*1024))*100).toFixed(2);
		const sobPercent=((useSizeBySob/(totalSize*1024))*100).toFixed(2);

		return (
			<FlexTitle>
				<div className="flex-title-left">
					<Select
						className="title-date"
						value={issuedate}
						onChange={onChange}
						disabled={havVc ? false : true}
						>
						{issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
					</Select>
					<Select
						className="title-date fj-title-label"
						value={labelValue}
						onChange={onChangeLabel}
						>
						{label.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
					</Select>
					<span className='fj-progress'>
						<div>剩余容量：{decimal(totalSize*1024-useSizeByCorp)}Mb/{totalSize}G （本账套已使用：{(useSizeBySob).toFixed(2)}Mb）</div>
						<Progress percent={corpPercent} strokeWidth={5} showInfo={false}
						status={corpPercent>90 ? 'exception' :''}/>
					</span>
				</div>
				<div className="flex-title-right">
					<Button
						type="ghost"
						className="title-right"
						disabled={judgePermission(detailList.get('EXPORT_AND_RECORD')).disabled}
						style={{display:intelligentStatus?'none':''}}
						onClick={()=>{
						if( !judgePermission(detailList.get('EXPORT_AND_RECORD')).disabled ){
							dispatch(exportRecordingActions.getEnclosureExportRecordingList(issuedate))
							dispatch(homeActions.addPageTabPane('SearchPanes', 'ExportRecording', 'ExportRecording', '导出记录'))
							dispatch(homeActions.addHomeTabpane('Search', 'ExportRecording', '导出记录'))
						}else{
							msg.info('当前角色无该请求权限')
						}
					}}>导出记录</Button>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							dispatch(homeActions.addPageTabPane('SearchPanes', 'Cxpz', 'Cxpz', '查询凭证'))
							dispatch(homeActions.addHomeTabpane('Search', 'Cxpz', '查询凭证'))
						}}>
						返回
					</Button>
					{/* <Tooltip placement="bottom" title="附件系统升级中，当前仅支持单个文件下载。批量下载功能，敬请期待">
						<Button
							className="title-right"
							type="ghost"
							// disabled={!PzPermissionInfo.getIn(['edit', 'permission']) || !(PzPermissionInfo.getIn(['edit', 'permission']) && hasChecked)}
							disabled={true}
							onClick={() => {
								dispatch(fjglActions.getDownloadData())
								this.setState({modalVisible: true})
							}}>
							下载
						</Button>
					</Tooltip> */}
					<Tooltip placement="bottom" title={hasChecked && needDownLoad.length>1 ? "附件系统升级中，当前仅支持单个文件下载。" : ''}>
						<Button
							className="title-right"
							type="ghost"
							disabled={!hasChecked || (hasChecked && needDownLoad.length != 1)}
							onClick={() => {
								// dispatch(fjglActions.getDownloadData())
								// this.setState({modalVisible: true})
								if( !judgePermission(detailList.get('EXPORT_AND_RECORD')).disabled ){
									dispatch(allDownloadEnclosure(needDownLoad[0]['url'], needDownLoad[0]['fileName']))
								}else{
									msg.info('当前角色无该请求权限')
								}
							}}>
							下载
						</Button>
					</Tooltip>
					<Tooltip placement="bottom" title={closeby ? '已结账不能删除附件' :
						// (!PzPermissionInfo.getIn(['edit', 'permission']) ? '观察者不能删除附件' : (!hasChecked ? '请选择附件' : (hasCheckedAndReviewed ? '已审核不能删除' : '')))}>
						(judgePermission(detailList.get('BATCH_DELETE')).disabled ? '当前角色无该权限' : (!hasChecked ? '请选择附件' : (hasCheckedAndReviewed ? '已审核不能删除' : '')))}>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => dispatch(fjglActions.deleteFjItemFetch())}
							// disabled={!PzPermissionInfo.getIn(['edit', 'permission']) || !hasChecked || hasCheckedAndReviewed || closeby}
							disabled={judgePermission(detailList.get('BATCH_DELETE')).disabled || !hasChecked || hasCheckedAndReviewed || closeby}
							>
							删除
						</Button>
					</Tooltip>
					<Button
						className="title-right"
						type="ghost"
						onClick={() => debounce(() => {
							dispatch(fjglActions.getFjListFetch())
						})()}
						>
						刷新
					</Button>
					<div
						className="fjgl-account"
						style={{display: closeby ? 'block' : 'none'}}
						>
						已结账
					</div>
					<Modal
	                    visible={modalVisible}
	                    title={'温馨提示'}
	                    onCancel={() => this.setState({modalVisible: false})}
	                    footer={[
	                        // <a
	                        //     className='export-download'
	                        //     key="cancel"
							// 	download
	                        //     style={{display: needDownLoad.length==1 && !download ? '' : 'none'}}
	                        //     href="javascript:void(0);"
	                        //     onClick={() => {
							// 		dispatch(fjglActions.fjglDownloadEnclosure(needDownLoad[0]['url'], needDownLoad[0]['fileName']))
	                        //         this.setState({download: true})
	                        //         setTimeout(() => this.setState({download: false}), 15000)
	                        //     }}
	                        //     >
	                        //     下载至本地
	                        // </a>,
							// 后端下载
	                        <a
	                            className='export-download'
	                            key="cancel"
								download
	                            style={{display: needDownLoad.length==1 && !download ? '' : 'none'}}
	                            href={needDownLoad.length==1 ? needDownLoad[0]['url'] : ''}
	                            onClick={() => {
									// dispatch(fjglActions.fjglDownloadEnclosure(needDownLoad[0]['url'], needDownLoad[0]['fileName']))
	                                this.setState({download: true})
	                                setTimeout(() => this.setState({download: false}), 15000)
	                            }}
	                            >
	                            下载至本地
	                        </a>,
	                        <a
	                            className='export-download export-download-wait'
	                            style={{display: needDownLoad.length==1 && download ? '' : 'none'}}
	                            key="wait"
	                            >
	                            请等待
	                        </a>,
	                        <a
	                            key="ok"
	                            // type='ghost'
								className='export-download'
								// style={{display: needDownLoad.length>1 ? '' : 'none'}}
	                            onClick={() => {
									let needDownLoadArr=needDownLoad;
										if(needDownLoad.length>9){
											needDownLoadArr=needDownLoad.slice(0,9);
										}
										dispatch(fjglActions.download(needDownLoadArr))
										this.setState({modalVisible: false})
									}
								}
							>
	                            发至我的“工作通知”
	                        </a>
	                    ]}
	                    >
	                    <ul className="export-tiplist">
	                        <li>单次下载最多支持九个附件，超过九个后默认选择前九个，附件将以消息的形式发送给您。</li>
	                    </ul>
	                </Modal>
				</div>
			</FlexTitle>
		)
	}
}

import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Menu, Dropdown, Icon, Spin, Upload, message,Progress, Modal } from 'antd'

// import thirdparty from 'app/utils/thirdparty'
import * as thirdParty from 'app/thirdParty'
// import '../components/common.less'
import { ROOT } from 'app/constants/fetch.constant.js'
import { Pagination, Tooltip } from 'antd'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class ImportInitialValue extends React.Component{
	constructor() {
		super()
		this.state = { inputContent:'',download: false, currentPage: 1, pageSize: 50, exportvalue: ''}
	}
	onSubmit() {
		const files = this.refs['fileInput'].files
		if (files.length == 0) {
			return
		}
		if (files[0].size == 0) {
			return message.warn('此文件已不存在，请重新选择')
		}
		let form = new FormData()
		// const url = this.props.actionPath //服务器上传地址
		const file = files[0]
		form.append('file', file)
		this.props.beforCallback()
		this.props.onSubmitCallBack(form)
	}
	// onSubmitInitial() {
	// 	const files = this.refs['fileInput'].files
	// 	if (files.length == 0) {
	// 		return
	// 	}
	// 	let form = new FormData()
	// 	// const url = this.props.actionPath //服务器上传地址
	// 	const file = files[0]
	// 	form.append('file', file)
	// 	this.props.beforCallback()
	// 	this.props.onSubmitInitialCallBack(form)
	// }

	render() {
		const {
			tip,
			alertStr,
			message,
			dispatch,
			iframeload=true,
			iframeName,
			// actionPath,
			exportDisable,
			failJsonList,
			beforCallback,
			// afterCallback,
			closeCallback,
			showMessageMask,
			successJsonList,
			onClickCallback,
			importLogAction,
			inputLogAction,
			onSubmitCallBack,
			onSubmitInitialCallBack,
			ddImportCallBack,
			totalNumber,
			curNumber,
			importList,
			errorList,
			successSize,
			hrefUrl,
			InitialExporthrefUrl,
			downloadUrl,
			importKey,
			openQuantity,
			enableWarehouse,
			hrefUrlexport,
			showall,
			returnBackFun,
			closeShow,
			importTitle,
		} = this.props
		const { inputContent,download, currentPage, pageSize, exportvalue } = this.state
		const wlDealSchedule = totalNumber  ? (curNumber * 100 / totalNumber ).toFixed(2) : 0
		const exportDisableColor = exportDisable ? '#ccc' : '#222'
		const allSize = importList.size + errorList.size
		const allList = errorList.concat(importList)
		const showList = allList.slice((currentPage-1)*pageSize, currentPage*pageSize)

		const detaillist = (
			<div>
				<div>
					{showList.map(v => {
						return (
							<div>
								<span className="import-mask-main-message-item">{v.get('exchange')}</span>
							</div>
						)
					})}
				</div>
			</div>
		)

		return (
			<div className="running-import-mask import-mask" style={{display: showall ? 'block' : 'none'}}>
				<div className="import-mask-title">
					<span>{importTitle ? importTitle : '批量导入存货'}</span>
					<Button
						className="running-import-mask-btn"
						onClick={() => {
							returnBackFun()
							this.setState({inputContent:''})
						}}>
						返回
					</Button>
				</div>
				<div className="import-mask-main">
					<div className="import-mask-content">
						<div style={{display: showMessageMask ? 'block' : 'none'}} className="import-mask-main-message">

								{/* <div className="import-mask-main-message-title">
									<span>导入结果</span>
									<Icon type="close" className="import-mask-main-message-cross" onClick={() => {
										if(!iframeload)
											return
										closeCallback()
									}}/>
									<textarea style={{position:'fixed',left:'-1000px'}} ref="copy" value={allList.toJS().reduce((pre,cur) => pre += cur.exchange+'\n','')}/>
								</div> */}
								<Modal
									visible={showMessageMask}
									title='导入结果'
									className='import-mask-modal'
									footer={[
										<Button
											type='primary'
											onClick={() => {
												if(!iframeload)
													return
												closeCallback()
												returnBackFun()
												this.setState({inputContent:''})
											}}
											>
												完成
										</Button>
									]}
									onCancel={() => {
										if(!iframeload)
											return
										closeCallback()
									}}
									>
									<div  className='running-mask-modal'>
										<div className="message-detail-progress">
											<Progress percent={iframeload?100:0} size="small" />
										</div>
										<div className="import-mask-main-message-btn">
											<div>提示信息共<p>{allSize}</p>条，成功导入记录<p>{importList.size}</p>条，错误记录<p>{errorList.size}</p>条</div>
											{
												errorList.size?
												<span className="import-mask-main-message-onload-send">
													<span>导入失败汇总.xls</span>
													<a
														className='export-download'
														key="cancel"
														disabled={download}
														href={`${InitialExporthrefUrl}&importKey=${importKey}&needDownload=true` }
														download='导入失败汇总'
														onClick={() => {
															this.setState({download: true})
															setTimeout(() => this.setState({download: false}), 15000)
														}}
														>
														立即下载
													</a>
												</span>

												: ''
											}
											<textarea style={{position:'fixed',left:'-1000px'}} ref="copy" value={allList.toJS().reduce((pre,cur) => pre += cur.exchange+'\n','')}/>
										</div>
										<div className="import-mask-main-message-detail">
											<div>
												提示信息：

											</div>
											{
												iframeload ? detaillist :
												''
											}

										</div>
										<div className='impot-footer'>
											<Pagination current={currentPage} total={allSize} pageSize={pageSize} size={'small'} onChange={(page) => {
												this.setState({currentPage: page})
											}} />
											<Button
												type="primary"
												className="import-mask-main-message-copy"
												onClick={() => {
													if (iframeload) {
														this.refs['copy'] && this.refs['copy'].select() // 选择对象
														document.execCommand("Copy") // 执行浏览器复制命令
														thirdParty.Alert("已复制好，可贴粘")
													}
												}}>
												复制提示信息
											</Button>
										</div>

									</div>
								</Modal>

						</div>
						{/* {tip} */}
						<div>
							<div>操作步骤：1.下载模版 > 2.导入Excel > 3.导入完毕</div>
							<div className="running-onload"><a href={downloadUrl} className='running-download'><Icon type='download'/>下载模版</a></div>
						</div>
						<div>请选择要导入的Excel文件：</div>
						<div style={{margin:'10px 0'}}>
							<div className="fileexport">
								<span className="filetext">{inputContent}</span>
								<span className="filecontent" onClick={() => inputLogAction && inputLogAction()}>
									<span className='upload-btn-1'><Icon type='upload'/>选择文件</span>
									<input
										type="file"
										className="fileinput"
										name="pic"
										ref="fileInput"
										accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
										value={inputContent}
										onChange={(e) => {
											this.setState({inputContent: e.target.value})
										}}
									/>
								</span>
								<span className='upload-btn-2' onClick={inputContent ? this.onSubmit.bind(this) : () => thirdParty.Alert(alertStr)}>
									确定导入
								</span>
							</div>
							<div>温馨提示:</div>
							<div className='upload-tips'>1.导入模版后，原添加的存货将被覆盖；</div>
							<div className='upload-tips'>2.导入数据上限为180行；超过180行，仅导入前180行内容；</div>
							<div className='upload-tips'>3.请下载统一的模版，并按相应的格式在Excel软件中填写业务数据，然后再导入到系统中。</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

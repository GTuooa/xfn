import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Menu, Dropdown, Icon, Spin, Upload, message,Progress, Modal } from 'antd'

// import thirdparty from 'app/utils/thirdparty'
import * as thirdParty from 'app/thirdParty'
import '../components/common.less'
import { ROOT } from 'app/constants/fetch.constant.js'
import { Pagination } from 'antd'
import { fromJS } from 'immutable'

@immutableRenderDecorator
export default
class ImportInitialValue extends React.Component{
	constructor() {
		super()
		this.state = {showall: false, inputContent:'',download: false, currentPage: 1, pageSize: 50, exportvalue: ''}
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
	onSubmitInitial() {
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
		this.props.onSubmitInitialCallBack(form)
	}

	render() {
		const {
			tip,
			alertStr,
			message,
			dispatch,
			iframeload,
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
			allSize,
			errorSize,
			successSize,
			hrefUrl,
			InitialExporthrefUrl,
			importKey,
			openQuantity,
			enableWarehouse,
			hrefUrlexport
		} = this.props
		const { showall, inputContent,download, currentPage, pageSize, exportvalue } = this.state
		const wlDealSchedule = totalNumber  ? (curNumber * 100 / totalNumber ).toFixed(2) : 0
		const exportDisableColor = exportDisable ? '#ccc' : '#222'
		const more = (
			<Menu>
				<Menu.Item key='1' disabled={exportDisable}>
					<span
						className="export-button-text setting-common-ant-dropdown-menu-item"
						style={{color: `${exportDisableColor}`}}
						onClick={() => {
							if (!exportDisable) {
								if(onClickCallback){
									onClickCallback()
								}
								if(importLogAction){
									importLogAction()
								}
								this.setState({showall: !showall, exportvalue: true})
							}
						}
						// }>导入存货</span>
						}>{openQuantity || enableWarehouse ?'导入存货':'导入'}</span>
				</Menu.Item>
				{
					openQuantity || enableWarehouse ?
					<Menu.Item key='2' disabled={exportDisable}>
						<span
							className="export-button-text setting-common-ant-dropdown-menu-item"
							style={{color: `${exportDisableColor}`}}
							onClick={() => {
								if (!exportDisable) {
									if(onClickCallback){
										onClickCallback()
									}
									if(importLogAction){
										importLogAction()
									}
									this.setState({showall: !showall, exportvalue: false})
								}
							}
							}>导入期初值</span>
					</Menu.Item>:''
				}
				{/* <Menu.Item key='2' disabled={exportDisable}>
					<span
						className="export-button-text setting-common-ant-dropdown-menu-item"
						style={{color: `${exportDisableColor}`}}
						onClick={() => {
							if (!exportDisable) {
								if(onClickCallback){
									onClickCallback()
								}
								if(importLogAction){
									importLogAction()
								}
								this.setState({showall: !showall, exportvalue: false})
							}
						}
						}>导入期初值</span>
				</Menu.Item> */}
				{this.props.children}
			</Menu>
		)

		// const failStr = failJsonList.size > 0 ? failJsonList.reduce((v, pre) => v + '\r\n' + pre) : ''
		// const succStr = successJsonList.size > 0 ? successJsonList.reduce((v, pre) => v + '\r\n' + pre) : ''
		// const copyStr = failStr && succStr ? (failStr + '\r\n' + succStr) : (failStr || succStr || '')
		const allList = failJsonList.concat(successJsonList)
		const showList = allList.slice((currentPage-1)*pageSize, currentPage*pageSize)
		const detaillist = (
			<div>
				<div>
					{showList.map(v => {
						return (
							<div>
								<span className="import-mask-main-message-item">{v}</span>
							</div>
						)
					})}
				</div>
			</div>
		)

		return (
			<div className="title-right">
				<span className="title-right title-dropdown" style={{margin: 0}}>
					<Dropdown overlay={more}>
						<span>更多 <Icon className="title-dropdown-icon" type="down"/></span>
					</Dropdown>
				</span>
				<div className="import-mask" style={{display: showall ? 'block' : 'none'}}>
					<div className="import-mask-title">
						<span>{'导入存货'}</span>
						<Button
							className="import-mask-btn"
							onClick={() => {
								if(onClickCallback){
									onClickCallback()
								}
								this.setState({showall: !showall, inputContent: ''})}
						}>
							返回
						</Button>
					</div>
					<div className="import-mask-main">
						<div className="import-mask-content">
						<div style={{display: showMessageMask ? 'block' : 'none'}} className="import-mask-main-message">
							<Modal
								visible={showMessageMask}
								className='import-mask-modal'
								title='导入结果'
								footer={[
									<Button
										type='primary'
										onClick={() => {
											if(!iframeload)
												return
											closeCallback()
											if(onClickCallback){
												onClickCallback()
											}
											this.setState({showall: !showall, inputContent: ''})
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
								<div  className='mask-modal'>
									<div className="message-detail-progress">
										<Progress percent={iframeload?100:0} size="small" />
									</div>
									<div className="import-mask-main-message-btn">
										<textarea style={{position:'fixed',left:'-1000px'}} ref="copy" value={(allList || fromJS([])).toJS().reduce((pre,cur) => pre += cur+'\n','')}/>
										<div>提示信息共<p>{allSize}</p>条，成功导入记录<p>{successSize}</p>条，错误记录<p>{errorSize}</p>条</div>
										{
											errorSize?
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
							{
								openQuantity || enableWarehouse ?
								exportvalue === true?
								<div className="onload"><a href={`https://xfn-ddy-website.oss-cn-hangzhou.aliyuncs.com/utils/template/%E5%AD%98%E8%B4%A7%E8%AE%BE%E7%BD%AE%E6%A8%A1%E7%89%88-%E5%90%AF%E7%94%A8%E6%95%B0%E9%87%8F%E4%BB%93%E5%BA%93-%E8%BE%85%E5%8A%A9..xls`}>1.下载模版</a></div>
								:
								<div className="onload"><a href={`https://xfn-ddy-website.oss-cn-hangzhou.aliyuncs.com/utils/template/%E5%AD%98%E8%B4%A7%E6%9C%9F%E5%88%9D%E5%80%BC%E6%A8%A1%E7%89%88-%E8%BE%85%E5%8A%A9.xls`}>1.下载模版</a></div>
								:
								<div className="onload"><a href={`https://www.xfannix.com/utils/template/%E5%AD%98%E8%B4%A7%E8%AE%BE%E7%BD%AE%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xls`} className='download'><Icon type='download'/>下载模版</a></div>
							}
							{/* {
								exportvalue === true?
								<div className="onload"><a href={`https://www.xfannix.com/utils/template/%E5%AD%98%E8%B4%A7%E8%AE%BE%E7%BD%AE%E6%A8%A1%E7%89%88-%E5%90%AF%E7%94%A8%E6%95%B0%E9%87%8F%E4%BB%93%E5%BA%93.xls`}>1.下载模版</a></div>
								:
								<div className="onload"><a href={`https://xfn-ddy-website.oss-cn-hangzhou.aliyuncs.com/utils/template/%E5%AD%98%E8%B4%A7%E6%9C%9F%E5%88%9D%E5%80%BC%E6%A8%A1%E7%89%88-%E8%BE%85%E5%8A%A9.xls`}>1.下载模版</a></div>
							} */}
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
								{
									exportvalue === false?
									inputContent ? <span className="upload-btn-2" onClick={this.onSubmitInitial.bind(this)}>上传Excel</span> :
									<span className="upload-btn-2" onClick={() => thirdParty.Alert(alertStr)}>上传Excel</span>:
									inputContent ? <span className="upload-btn-2" onClick={this.onSubmit.bind(this)}>上传Excel</span> :
									<span className="upload-btn-2" onClick={() => thirdParty.Alert(alertStr)}>上传Excel</span>
								}
							</div>
							<div>温馨提示:</div>
							<div className='upload-tips'>1.导入模版后，原添加的存货将被覆盖；</div>
							<div className='upload-tips'>2.导入数据上限为180行；超过180行，仅导入前180行内容；</div>
							<div className='upload-tips'>3.请下载统一的模版，并按相应的格式在Excel软件中填写业务数据，然后再导入到系统中。</div>
						</div>

					</div>
				</div>
				</div>
			</div>
		)
	}
}

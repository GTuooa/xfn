import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Menu, Dropdown, Spin, Upload, message,Progress } from 'antd'

// import thirdparty from 'app/utils/thirdparty'
import thirdParty from 'app/thirdParty'
import './common.less'
import { ROOT } from 'app/constants/fetch.constant.js'
import { Pagination } from 'antd'
import { Icon } from 'app/components'

@immutableRenderDecorator
export default
class ImportModal extends React.Component{
	constructor() {
		super()
		this.state = {showall: false, inputContent:'',download: false, currentPage: 1, pageSize: 50}
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
			ddImportCallBack,
			totalNumber,
			curNumber,
			allSize,
			errorSize,
			successSize,
			hrefUrl,
			importKey
		} = this.props

		const { showall, inputContent,download, currentPage, pageSize } = this.state
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
								this.setState({showall: !showall})
							}
						}
						}>导入</span>
				</Menu.Item>
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
					<Button
						className="import-mask-btn"
						onClick={() => {
							if(onClickCallback){
								onClickCallback()
							}
							this.setState({showall: !showall})}
					}>
						返回
					</Button>
					<div className="import-mask-main">
						<div style={{display: showMessageMask ? 'block' : 'none'}} className="import-mask-main-message">
							<div className="import-mask-main-message-content">
								<div className="import-mask-main-message-title">
									<span>导入结果</span>
									<Icon type="close" className="import-mask-main-message-cross" onClick={() => {
										if(!iframeload)
											return
										closeCallback()
									}}/>
									{
										// <Button
										// 	// type="primary"
										// 	className="import-mask-main-message-copy"
										// 	onClick={() => {
										// 		if (iframeload) {
										// 			this.refs['copy'] && this.refs['copy'].select() // 选择对象
										// 			document.execCommand("Copy") // 执行浏览器复制命令
										// 			thirdParty.Alert("已复制好，可贴粘")
										// 		}
										// 	}}>
										// 	提示信息复制
										// </Button>
									}
								</div>
								<div className="import-mask-main-message-btn">
									<div>提示信息共{allSize}条，成功导入记录{successSize}条，错误记录{errorSize}条</div>
									{
										errorSize ?
										<span className="import-mask-main-message-onload-send">
											<span>导入失败汇总.xls</span>
											<a
												className='export-download'
												key="cancel"
												disabled={download}
												href={`${hrefUrl}&importKey=${importKey}&needDownload=true`}
												download='导入失败汇总'
												onClick={() => {
													this.setState({download: true})
													setTimeout(() => this.setState({download: false}), 15000)
												}}
												>
												下载至本地
											</a>
										</span>

										: ''
									}
								</div>
								<div className="import-mask-main-message-detail">
									<div>提示信息：{message}</div>
									{
										iframeload ? detaillist :
										<div className="message-detail-progress">
											<Progress percent={wlDealSchedule} size="small" status="active"/>
										</div>
									}
								</div>
								<Pagination current={currentPage} total={allSize} pageSize={pageSize} onChange={(page) => {
									this.setState({currentPage: page})
								}} />
							</div>
						</div>
						{tip}
						<div>
							<div className="fileexport">
								<span className="filetip">2.请选择要导入的Excel文件：</span>
								<span className="filetext">{inputContent}</span>
								<span className="filecontent" onClick={() => inputLogAction && inputLogAction()}>
									<span>浏览</span>
									<input
										type="file"
										className="fileinput"
										name="pic"
										ref="fileInput"
										accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
										onChange={(e) => {
											this.setState({inputContent: e.target.value})
										}}
									/>
									{/* <input name="file" className="fileinput" type="file" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => this.setState({inputContent: e.target.value})}/> */}
								</span>
							</div>
							{
								inputContent ? <Button className="export-btn" onClick={this.onSubmit.bind(this)}>上传Excel</Button> :
								<Button className="export-btn" onClick={() => thirdParty.Alert(alertStr)}>上传Excel</Button>
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

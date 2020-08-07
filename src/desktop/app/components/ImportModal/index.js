import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Menu, Dropdown, Icon, Spin, Upload, message,Progress } from 'antd'
// import thirdparty from 'app/utils/thirdparty'
import * as thirdParty from 'app/thirdParty'
import './style.less'
import ImportProgress from './ImportProgress'
import { Pagination } from 'antd'

@immutableRenderDecorator
export default
class ImportModal extends React.Component{
	constructor() {
		super()
		this.state = {showall: false, inputContent:'', currentPage: 1, pageSize: 50}
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

		if (this.props.importHaveProgress) {
			const openModal = () => this.props.beforCallback()
			this.props.onSubmitCallBack(form,openModal)
		} else {
			this.props.beforCallback()
			this.props.onSubmitCallBack(form)
		}
	}
	componentWillUnmount(){
		if(this.props.importHaveProgress){
			this.props.clearProgress()
		}
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
			mediaId,
			ddImportCallBack,
			importHaveProgress,
			importProgressInfo,
			getProgress,
			clearProgress,
			errorSize,
			errorExlDown,
			errorUrl,
		} = this.props

		// console.log('errorUrl',errorUrl);

		const { showall, inputContent, currentPage, pageSize } = this.state

		let percent = '';
		let successList = [];
		let failList = [];
		let importProgressInfoMessage = '';


		if(importHaveProgress){
			percent = importProgressInfo.get('progress')
			successList = importProgressInfo.get('successList')
			failList = importProgressInfo.get('failList')
			importProgressInfoMessage = importProgressInfo.get('message')
		}

		const more = (
			<Menu>
				<Menu.Item key='1' disabled={exportDisable}>
					<span
						className={`${exportDisable ? 'export-text-disable' : "export-button-text"} setting-common-ant-dropdown-menu-item`}
						onClick={() => {
							if (!exportDisable) {
								if(onClickCallback){
									onClickCallback()
								}
								if(importLogAction){
									importLogAction()
								}
								this.setState({showall: !showall})}
							}
						}>导入</span>
				</Menu.Item>
				{this.props.children}
			</Menu>
		)

		let failStr = '';
		let succStr = '';
		let copyStr = '';
		let detaillist = '';

		if(importHaveProgress){
			// failStr = failList.size > 0 ? failList.reduce((v, pre) => v + '\r\n' + pre) : ''
			// succStr = successList.size > 0 ? successList.reduce((v, pre) => v + '\r\n' + pre) : ''
			// copyStr = failStr && succStr ? (failStr + '\r\n' + succStr) : (failStr || succStr || '')
			const allList = failList.concat(successList)
			const showList = allList.slice((currentPage-1)*pageSize, currentPage*pageSize)
			// const copyStr = showList.join('\r\n')
			// detaillist = (
			// 	<div>
			// 		<div>
			// 			{failList.map((v,i) => {
			// 				return (
			// 					<div key={i}>
			// 						<span className="import-mask-main-message-item">{v}</span>
			// 					</div>
			// 				)
			// 			})}
			// 		</div>
			// 		<div>
			// 			{successList.map((v,i) => {
			// 				return (
			// 					<div key={i}>
			// 						<span className="import-mask-main-message-item">{v}</span>
			// 					</div>
			// 				)
			// 			})}
			// 		</div>
			// 		<textarea style={{width: 0, height: 0, marginLeft: '-13px'}} ref="copy" value={copyStr}/>
			// 	</div>
			// )
			detaillist = (
				<div>
					<div>
						{showList.map((v,i) => {
							return (
								<div key={i}>
									<span className="import-mask-main-message-item">{v}</span>
								</div>
							)
						})}
					</div>
				</div>
			)
		}
		else{
				// failStr = failJsonList.size > 0 ? failJsonList.reduce((v, pre) => v + '\r\n' + pre) : ''
				// succStr = successJsonList.size > 0 ? successJsonList.reduce((v, pre) => v + '\r\n' + pre) : ''
				// copyStr = failStr && succStr ? (failStr + '\r\n' + succStr) : (failStr || succStr || '')
				const allList = failJsonList.concat(successJsonList)
				const showList = allList.slice((currentPage-1)*pageSize, currentPage*pageSize)
				// const copyStr = showList.join('\r\n')

				detaillist = (
					<div>
						<div>
							{showList.map((v,i) => {
								return (
									<div key={i}>
										<span className="import-mask-main-message-item">{v}</span>
									</div>
								)
							})}
						</div>
					</div>
				)
				// detaillist = (
				// 	<div>
				// 		<div>
				// 			{failJsonList.map((v,i) => {
				// 				return (
				// 					<div key={i}>
				// 						<span className="import-mask-main-message-item">{v}</span>
				// 					</div>
				// 				)
				// 			})}
				// 		</div>
				// 		<div>
				// 			{successJsonList.map((v,i) => {
				// 				return (
				// 					<div key={i}>
				// 						<span className="import-mask-main-message-item">{v}</span>
				// 					</div>
				// 				)
				// 			})}
				// 		</div>
				// 	</div>
				// )
			}

		return (
			<div className="title-right">
				<span className="title-right title-dropdown" style={{margin: 0}}>
			{/* <div>
				<span className="title-right title-dropdown"> */}
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
										this.setState({currentPage: 1})
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
										// 	当前提示信息复制
										// </Button>
									}
								</div>
								{
									importHaveProgress ?
										<div className="import-progress">
											<Progress percent={percent} />
											{
												percent < 100 ? ''
												:
												<div>
													<div className="import-mask-main-message-btn">
														<div>提示信息共{successList.size + failList.size}条，成功导入记录{successList.size}条，错误记录{failList.size}条</div>
														{
															errorSize ?
															<span className="import-mask-main-message-onload-send">
																<span>导入失败汇总.xls</span>
																&nbsp;
																<a href={errorUrl}>
																	立即下载
																</a>
															</span>

															: ''
														}
														{
															mediaId ?
															<span className="import-mask-main-message-onload-send">
																<span>导入失败凭证汇总.xls</span>
																<span className="import-mask-main-message-onload" onClick={() => ddImportCallBack('')}>导出至自己</span>
															</span>
															: ''
														}
													</div>
													<div className="import-mask-main-message-detail">
														<div>提示信息：{message}</div>
														{
															iframeload ? detaillist : <Spin/>
														}
													</div>
													<Pagination current={currentPage} total={successList.size + failList.size} pageSize={pageSize} onChange={(page) => {
														this.setState({currentPage: page})
													}} />
												</div>
											}
									</div>
									:
										<div>
					                        <div className="import-mask-main-message-btn">
					                            <div>提示信息共{successJsonList.size + failJsonList.size}条，成功导入记录{successJsonList.size}条，错误记录{failJsonList.size}条</div>
					                            {
					                                mediaId ?
					                                <span className="import-mask-main-message-onload-send">
					                                    <span>导入失败凭证汇总.xls</span>
					                                    <span className="import-mask-main-message-onload" onClick={() => ddImportCallBack('')}>导出至自己</span>
					                                </span>
					                                : ''
					                            }
					                        </div>
					                        <div className="import-mask-main-message-detail">
					                            <div>提示信息：{message}</div>
					                            {
													iframeload ? detaillist : <Spin/>
												}
											</div>
											<Pagination current={currentPage} total={successList.size + failList.size} pageSize={pageSize} onChange={(page) => {
												this.setState({currentPage: page})
											}} />
				                    	</div>
								}
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
										onChange={(e) => this.setState({inputContent: e.target.value})}
									/>
									{/* <input name="file" className="fileinput" type="file" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => this.setState({inputContent: e.target.value})}/> */}
								</span> 
							</div>
							{
								inputContent ? <Button className="export-btn" onClick={this.onSubmit.bind(this)}>上传Excel</Button> :
								<Button className="export-btn" onClick={() => thirdParty.Alert(alertStr)}>上传Excel</Button>
							}
						</div>
						<div>
							<a style={{textDecoration: 'underline'}} target="_blank" href='https://www.xfannix.com/support/desktop/app/index.html?id=8.5#/sysc'>
								帮助中心
							</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS }	from 'immutable'
import './style.less'

import { Container, Row, ScrollView, Icon, Button } from 'app/components'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { showImg, EXIF } from 'app/utils'
import { ImagePicker, Modal, InputItem } from 'antd-mobile'
import { SwitchText, SinglePicker } from 'app/components'
import { getFileNameNoExt } from 'app/utils'
const alert = Modal.alert

import UploadEnclosure from './UploadEnclosure'

// import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { previewEnclosureActions } from 'app/redux/Edit/PreviewEnclosure/index.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action'

@immutableRenderDecorator
export default
class Enclosure extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isChoose: false, //是否选择过
			isCompression: true,
		}
	}

	render() {
		const {
			formPage,
			className,
            dispatch,
            enCanUse,
            editPermission,
            enclosureList,
            // showPzfj,
            checkMoreFj,
            label,
            enclosureCountUser,
            previewImageList,
            showckpz,
            uploadFiles,
            getUploadGetTokenFetch,
            deleteUploadImgUrl,
			getLabelFetch,
            changeTagName,
			uploadKeyJson,
			history
        } = this.props

		const { isChoose, isCompression } = this.state

		const preview = (i,v) => {//附件预览
			if (v.get('imageOrFile')==='TRUE') {
				const imageList = enclosureList.filter((w, j) => j < i && w.get('imageOrFile') === 'TRUE')
				const preIdx = imageList.size

				thirdParty.previewImage({
					urls: previewImageList, //图片地址列表
					current: previewImageList[preIdx], //当前显示的图片链接
					onSuccess : function(result) {},
					onFail : function() {}
				})
			} else if (v.get('mimeType') === 'application/pdf') {
				if (v.get('size') > 8*1024) {
					return thirdParty.toast.info('文件过大，暂不支持预览。')
				}
				let previewUrl = v.get('signedUrl')
				dispatch(previewEnclosureActions.getCxpzUploadEnclosure(previewUrl, () => {
					if (formPage == 'oldRunning') {
						sessionStorage.setItem('ylFj', 'TRUE')
					}
					history.push('/previewpdf')
				}))
				
			} else {
				thirdParty.Alert('文件格式暂不支持预览')
			}
		}

		let deleteAndLabel = false
		if (editPermission) {
			deleteAndLabel = true //出现
		}

		return(
			<div
				className={['enclosure-part', className].join(' ')}
				style={{display: enCanUse ? '' : 'none'}}
			>
				<div className="enclosure-part-wrap">
					<div
						className="enclosure-part-title"
						style={{display: deleteAndLabel && checkMoreFj ? '' : 'none'}}
					>
						<span className="enclosure-part-tips">
                            附件 <span>(最多选择9个文件)</span>
                        </span>
						<UploadEnclosure
                            enclosureList={enclosureList}
                            showckpz={showckpz}
                            uploadFiles={uploadFiles}
                            getUploadGetTokenFetch={getUploadGetTokenFetch}
							isCompression={isCompression}
							uploadKeyJson={uploadKeyJson}
                        />
						<span className="enclosure-part-switch-text" style={{display: showckpz ? 'none' : ''}}>
							<SwitchText
								checked={isCompression}
								checkedChildren='压缩'
								unCheckedChildren='原图'
								className='topBarSwitch'
								onChange={() => {
									this.setState({isCompression: !isCompression})
								}}
							/>
						</span>
					</div>

					<div>
						{(enclosureList||[]).map((v, i) =>
							<div className='enclosure-part-upload' key={i}>
								<span
									className='enclosure-part-close'
									style={{'display': (!showckpz && deleteAndLabel) ? '' : 'none'}}
									onClick={() => deleteUploadImgUrl(i)}
								>
                                    删除
                                </span>
								<img
                                    src={showImg(v.get('imageOrFile'),v.get('fileName'))}
                                    onClick={()=> preview(i,v)}
                                />
								{/* <ul onClick={()=> preview(i,v)}> */}
								<ul>
									<li>{v.get('fileName')}</li>
									<li>
										<span>{v.get('size')+'kb'}</span>
										<span
											className='enclosure-part-label-download'
											onClick={() => {
												thirdParty.saveFile({
													corpId: sessionStorage.getItem('corpId'),
													url: v.get('signedUrl'),
													name: v.get('fileName'),
													onSuccess: function(data) {
														// alert(JSON.stringify(data));
														// /* data结构
														// {"data":
														// [
														// {
														// "spaceId": "" //空间id
														// "fileId": "", //文件id
														// "fileName": "", //文件名
														// "fileSize": 111111, //文件大小
														// "fileType": "", //文件类型
														// }
														// ]
														// }
														// */
													},
													onFail: function(err) {
														// thirdParty.Alert(JSON.stringify(err));
													}
												})
											}}
										>下载至钉盘</span>
									</li>
								</ul>
								<SinglePicker
                                    district={label}
                                    disabled={showckpz}
                                    value=''
                                    onOk={(result) => {
                                        changeTagName(i, result.key)
                                    }}
                                >
									<span
										className='enclosure-part-label'
										style={{display: deleteAndLabel ? '' : 'none'}}
										onClick={() => getLabelFetch()}
									>
										{v.get('label')==='无标签'?
										<span>添加标签</span> :
										<span className='enclosure-part-label-have'>{v.get('label')}</span>}
									</span>
								</SinglePicker>
							</div>
						)}
					</div>
				</div>
				<ul className="form-tip" style={{display: !showckpz && enCanUse && checkMoreFj && deleteAndLabel ? '' : 'none'}}>
					<li className="form-tip-item">
						建议不要选择上传“原图”，手机端操作上传单个附件超过200KB，图片格式会被自动压缩。
					</li>
				</ul>
			</div>
		)
	}
}

import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as fjglActions from 'app/redux/Search/Fjgl/fjgl.action.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'

import { previewEnclosureActions } from 'app/redux/Edit/PreviewEnclosure/index.js'

import { Checkbox, Icon, Button,SinglePicker } 	from 'app/components'
import { Amount } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { showImg } from 'app/utils'

@immutableRenderDecorator
export default
class Vc extends React.Component {

	render() {
		const {
			allCheckboxDisplay,
			idx,
			vcitem,
			dispatch,
			fjLabel,
			editPermission,
			vclist,
			history
		} = this.props

		const closedby = vcitem.get('closedby')
		const reviewedby = vcitem.get('reviewedby')
		const preview = (w) =>{
			if(w.get('imageOrFile')==='TRUE'){
				let previewImgArr = []//所有附件的图片地址 ['','']
				let previewImgList = []//所有附件的图片列表[{},{}]
				vclist.forEach(v => v.get('enclosureList').forEach(h =>{
					if (h.get('imageOrFile') === 'TRUE'){
						previewImgArr.push(h.get('signedUrl'))
						previewImgList.push(h)
					}
				}))
				let preIdx = 0//当前点击的图片在图片列表的下表
				previewImgList.forEach((d,j)=>{
					if( d.get('enclosureKey') == w.get('enclosureKey')){
						preIdx = j
						return
					}
				})
				thirdParty.previewImage({
					urls: previewImgArr,//图片地址列表
					current: previewImgArr[preIdx],//当前显示的图片链接
					onSuccess : function(result) {},
					onFail : function() {}
				})
			} else if (w.get('mimeType') === 'application/pdf') {
				if (w.get('size') > 8*1024) {
					return thirdParty.toast.info('文件过大，暂不支持预览。')
				}
				let previewUrl = w.get('signedUrl')
				dispatch(previewEnclosureActions.getCxpzUploadEnclosure(previewUrl, () => {
					history.push('/previewpdf')
				}))
				
			} else {
				thirdParty.Alert('文件格式暂不支持预览')
			}
		}
		return (
			<div className="vc">
				<Icon style={{display: closedby ? '' : 'none'}} className="fjgl-shenhe-icon " color="#DE4646" type="the-invosing" size="50"/>
				<Icon style={{display: closedby ? 'none' :  (reviewedby ? '' : 'none')}} className="fjgl-shenhe-icon" color="#ff943e" type="yishenhe" size="45"/>
				<div className="vc-info" onClick={() => {
					if (allCheckboxDisplay) {
						dispatch(fjglActions.selectFjVcItem(idx))
					} else {
						sessionStorage.setItem('lrpzHandleMode', 'modify')
						history.push('/lrpz')
						sessionStorage.setItem('router-from', 'cxpz')
						// dispatch(lrpzExportActions.setCkpzIsShow(true))
						dispatch(lrpzExportActions.getFjFetch(vcitem))
					}
				}}>
					<span>
						<Checkbox
							style={{'paddingRight': '10px', 'display': allCheckboxDisplay ? 'inline-block' : 'none'}} checked={vcitem.get('checkboxDisplay')}
						/>
						<span className="text-underline">记 {vcitem.get('vcindex')} 号</span>
					</span>
					<span className="vc-info-date">{vcitem.get('vcdate').replace(/-/g,'/')}</span>
				</div>
				<div className="vc-jv-list">
					{vcitem.get('enclosureList').map((w, j) => {
						return (
							<div className="vc-fj" key={j}>
								<Checkbox
									className='fjCheck'
									style={{'display': allCheckboxDisplay ? 'inline-block' : 'none'}} checked={w.get('checkboxFjDisplay')}
									onChange={()=>dispatch(fjglActions.selectFjItem(idx,j))}
								/>
								<img src={showImg(w.get('imageOrFile'),w.get('fileName'))}
									onClick={() => preview(w) }/>
								<ul onClick={() => preview(w) }>
									<li>{w.get('fileName')}</li>
									<li>{w.get('size')+'kb'}</li>
								</ul>
								<SinglePicker district={fjLabel} className='fj-label' disabled={vcitem.get('reviewedby')||vcitem.get('closedby')||!editPermission} value='' onOk={(result) => {
									dispatch(fjglActions.updateLabel(w.get('enclosureKey'),result.value))
								}}>
									<span onClick={() => dispatch(fjglActions.openLabelModal(idx,j))}>{w.get('label')}</span>
								</SinglePicker>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

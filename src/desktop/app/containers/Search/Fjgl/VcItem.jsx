import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as fjglActions from 'app/redux/Search/Fjgl/fjgl.action.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { Checkbox, Icon, message, Button } from 'antd'
import { Amount } from 'app/components'
import jsonifyDate	from 'app/utils/jsonifyDate'
import * as allActions from 'app/redux/Home/All/all.action'
import { showImg } from 'app/utils'
import { TableOver, CxpzTableItem } from 'app/components'

@immutableRenderDecorator
export default
class VcItem extends React.Component {

	render() {

		const { idx, vcitem, dispatch, vcindexList, selectVcAll, issuedate, showItem, line, PzPermissionInfo, className } = this.props

		const issueDateJson = jsonifyDate(issuedate)

		return (
            <CxpzTableItem className={className} line={line}>
                <li onClick={() => {
					dispatch(fjglActions.selectFjVcItem(idx))
					dispatch(fjglActions.getDownloadData())
				}}>
                    <Checkbox checked={vcitem.get('checkboxDisplay')}/>
                </li>
                <TableOver>{vcitem.get('vcdate')}</TableOver>
                <TableOver onClick={() => {
						sessionStorage.setItem('lrpzHandleMode', 'modify')
						dispatch(lrpzActions.getVcFetch([issueDateJson.year, issueDateJson.month].join('-'), vcitem.get('vcindex'), idx, vcindexList))
						// dispatch(homeActions.addTabpane('Lrpz'))
						dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
						dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))
					}}>
					记 {vcitem.get('vcindex')} 号
				</TableOver>
                <li>
					{vcitem.get('enclosureList').map((w, j) => {
						return (
							<p key={j} className="table-item-line">
								<Checkbox checked={w.get('checkboxFjDisplay')} onChange={()=> {
									dispatch(fjglActions.selectFjItem(idx,j))
									dispatch(fjglActions.getDownloadData())
								}}/>
								<img src={showImg(w.get('imageOrFile'),w.get('fileName'))} onClick={()=>{
									if(w.get('imageOrFile')==='TRUE' || w.get('mimeType') === 'application/pdf'){
										dispatch(fjglActions.previewImage(idx,j))
									}else{
										message.warn('仅图片及PDF格式支持预览')
									}
								}}/>
								<span onClick={()=> {
									if(w.get('imageOrFile')==='TRUE' || w.get('mimeType') === 'application/pdf'){
										dispatch(fjglActions.previewImage(idx,j))
									}else{
										message.warn('仅图片及PDF格式支持预览')
									}}
								}>{w.get('fileName')}</span>
							</p>
						)
					})}
                </li>
                <li>
					{vcitem.get('enclosureList').map((w, j) => <p className="table-item-line" key={j}>{w.get('size')+'Kb'}</p>)}
                </li>
                <li>
					{vcitem.get('enclosureList').map((w, j) => <p className="table-item-line" key={j}>
						<Button
							type="ghost"
							disabled={vcitem.get('reviewedby')||vcitem.get('closedby')||!PzPermissionInfo.getIn(['review', 'permission'])}
							onClick={()=>dispatch(fjglActions.openLabelModal(idx,j))}>
							{w.get('label')}
						</Button>
					</p>)}
                </li>
                <TableOver>{vcitem.get('createdby')}</TableOver>
				<TableOver>{vcitem.get('reviewedby')}</TableOver>
            </CxpzTableItem>
		)
	}
}

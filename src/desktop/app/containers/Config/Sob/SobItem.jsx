import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import { ROOT } from 'app/constants/fetch.constant.js'
import logGetformatDate from './logGetformatDate'
import { Tooltip } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { ExportModal,XfnIcon } from 'app/components'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as sobLogActions from 'app/redux/Config/SobLog/sobLog.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'

import './style.less'

@immutableRenderDecorator
export default
class SobItem extends React.Component {

	render() {

		const { item, dispatch, isAdmin, emplID, beforeDeleteSob, URL_POSTFIX, isPlay } = this.props

        const adminlist = item.get('adminlist')
        const isSobAdmin = adminlist.find(v => v.get('emplId') === emplID)
		const haveRight = isAdmin
		const EditRight = isAdmin || isSobAdmin
		const logDisable = (haveRight || isSobAdmin)

		return (
            <div>
                 <div className="sob-info">
                    <p className="company-name">{item.get('sobname')}</p>
                    <p className="sob-time">起始账期：{item.get('firstyear')}-{item.get('firstmonth')}</p>
                    <p className="sob-admin">
                    总管理员：{
                                adminlist.map((v,i) => {
                                    return (<span key={i}>{v.get('name')}{i===item.get('adminlist').size-1 ? '':'、'}</span>)
                                })
                            }
                    </p>
                    <p className="sob-fun">功能模块：</p>
                    <p className="sob-fun-list">
                        {
                            item.getIn(['moduleInfo','nameList']).toJS().splice(0, 8).map((v,i) =>{
                                return (
                                    <label key={i}>
                                        <span className="red-circle"></span>
                                        {v}
                                    </label>
                                )
                            })
                        }
                    </p>
                </div>
                <div className="sob-btn">
                    <div className={EditRight ? '' : 'not-limit'}>
                        {
							EditRight ?
							<Tooltip placement="right" title={'删除'}>
								<XfnIcon type={'sob-delete'} style={{fontSize: '20px'}} onClick={() => {
									beforeDeleteSob(item.get('sobid'), item.get('sobname'))
								}} />
							</Tooltip> :
							<Tooltip placement="right" title={'联系账套管理员或超级管理员删除'}>
								<XfnIcon type={'sob-delete'} style={{fontSize: '20px'}}/>
							</Tooltip>
                        }
                    </div>
                    <div
						className={EditRight ? '' : 'not-limit'}
                        // className={permission ? '' : 'not-limit'}
                        onClick={() => {
                            if (EditRight) {
                                const init = () => {
                                    dispatch(homeActions.addPageTabPane('ConfigPanes', 'SobOption', 'SobOption', '账套编辑'))
                                    dispatch(homeActions.addHomeTabpane('Config', 'SobOption', '账套编辑'))
                                }
                                dispatch(middleActions.sobOptionInit(item.get('sobid'),init))
							}
                        }}>
							<Tooltip placement="right" title={'编辑'}>
								<XfnIcon type={'sob-edit'} style={{fontSize: '20px'}}/>
							</Tooltip>
                    </div>
                    <div className={(EditRight) && !isPlay ? '' : 'not-limit'}>
                        {
							isPlay ?
							<Tooltip placement="right" title={'体验模式下不能进行备份操作'}>
								<XfnIcon type='sob-download' style={{fontSize: '20px'}}/>
							</Tooltip> :
                            (EditRight ?
								<ExportModal
									className="sob-btn-download"
									title="一键备份"
									tip="导出内容为：科目、辅助核算、凭证、期初值"
									// exportDisable={!permission}
									hrefUrl={`${ROOT}/excel/export/all?${URL_POSTFIX}&sobid=${item.get('sobid')}`}
									ddCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelsendall', {sobid: item.get('sobid')}))}
								>
									<Tooltip placement="right" title={'备份'}>
										<XfnIcon type='sob-download' style={{fontSize: '20px'}}/>
									</Tooltip>
								</ExportModal> :
								<Tooltip placement="right" title={'备份'}>
									<XfnIcon type='sob-download' style={{fontSize: '20px'}}/>
								</Tooltip>
							)
                        }
                    </div>
                    <div className={logDisable ? '' : 'not-limit'}>
                        {
                            logDisable ?
								<Tooltip placement="right" title={'查看日志'}>
									<XfnIcon
										type="log"
										onClick={() => {
											const date = logGetformatDate()
											dispatch(sobLogActions.getLogListFetch({ begin: date.formatDayBegin, end: date.format, searchType: 'SEARCH_TYPE_ALL', searchContent: '', backSobId: item.get('sobid'), currentPage: 1}, 'init'))
											dispatch(sobLogActions.getLogListSelectListFetch(item.get('sobid')))

											dispatch(homeActions.addPageTabPane('ConfigPanes', 'SobLog', 'SobLog', '账套日志'))
											dispatch(homeActions.addHomeTabpane('Config', 'SobLog', '账套日志'))
										}}
									/>
								</Tooltip> :
								<Tooltip placement="right" title={'近期日志服务调整，暂不提供服务'}>
									<XfnIcon type="log"/>
								</Tooltip>
                        }
                    </div>
                </div>
            </div>
		)
	}
}

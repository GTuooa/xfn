import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as thirdParty from 'app/thirdParty'
import { Button, Tooltip } from 'antd'
import { XfnIcon } from 'app/components'

import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import { feeActions } from 'app/redux/Fee'

@immutableRenderDecorator
export default
class EquityList extends React.Component {

	render() {
        const {
			invalidEquityList,
            dispatch
		} = this.props

		const iconType = {
			'阿米巴': 'amiba-line',
			'附件': 'fujian1-line',
			'智能流水': 'zhinengban-line',
			'账套数': 'zhangtaoshu-line',
            '资产管理': 'zichanguanli-line',
            '智能审批': 'shenpi-line',
            '智能仓管': 'jinxiaocun-line',
            '生产项目': 'shengchanxiangmu-line',
            '总账': 'zongzhang-line',
            '施工项目': 'shigongxiangmu-line',
		}

		return (
            <ul className="tcxq-invalid-equity-list">
                {
                    invalidEquityList.map((v, i) => {

                        const buttonList = v.get('buttonList')
                        const expireInfo = v.get('expireInfo')

                        let trialButton = ''
                        let buyButton = ''

                        if (expireInfo && expireInfo.indexOf('到期') === -1) {
                            trialButton = <span className="tcxq-invalid-equity-item-button-disabled">
                                {expireInfo.split('：')[0]}<br/>{expireInfo.split('：')[1]}
                            </span>
                        } else if (expireInfo) {
                            trialButton = <Button className="tcxq-invalid-equity-item-button-trail-expire" disabled>
                                {expireInfo}
                            </Button>
                        }

                        if (buttonList.size) {  // 可购买
                            buyButton = buttonList.map(w => {
                                // color blue red grey
                                return <Tooltip title={w.get('function') === 'XFN' ? 'PC端暂不支持购买，如需续费/升级请前往安卓手机端。' : ''} ><Button className={`tcxq-invalid-equity-item-button-trail-${w.get('color').toLowerCase()}`} onClick={() => {
                                    if (w.get('function') === 'XFN') {
                                        // dispatch(feeActions.switchFeeActivePage('Tcgm'))
                                        // dispatch(tcgmActions.fromTcxqJumpToTcgm(v.get('name').split('(')[0]))
                                    } else if (w.get('function') === 'DD') {
                                        // thirdParty.Confirm({
                                        // 	title: '提示',
                                        // 	message: '前往钉钉应用中心购买',
                                        // 	buttonLabels: ['取消', '立即前往'],
                                        // 	onSuccess : (result) => {
                                        // 		if (result.buttonIndex === 1) {
                                        // 			window.location.href = `https://h5.dingtalk.com/appcenter/index-pc.html?source=appstore_button&corpId=${sessionStorage.getItem('corpId')}`
                                        // 		}
                                        // 	}
                                        // })
                                        thirdParty.openSlidePanel(
                                            `https://h5.dingtalk.com/open-market/skuDetail.html?corpId=${sessionStorage.getItem('corpId')}&articleCode=FW_GOODS-1000302451&source=STORE_HOMEPAGE`,
                                            '小番财务购买',
                                            () => {},
                                            () => {},
                                        )
                                    } else if (w.get('function') === 'TRIAL') {
                                        dispatch(tcxqActions.getTrailEquityFetch(v.get('trialCode')))
                                    } else if (w.get('function') === 'NO') {
                                        return
                                    }
                                }}>
                                    {w.get('label')}
                                </Button></Tooltip>
                            })
                        }

                        return (
                            <li className="tcxq-invalid-equity-item" key={i}>
								<div className="tcxq-invalid-equity-item-icon-wrap">
									<span className="tcxq-invalid-equity-item-icon">
										<XfnIcon type={iconType[v.get('name').split('(')[0]]} size="26" />
									</span>
									<span className="tcxq-invalid-equity-item-title">{v.get('name')}</span>
								</div>
                                <div className="tcxq-invalid-equity-item-content">
                                    {v.get('content')}
                                </div>
                                <div className="tcxq-invalid-equity-item-button">
                                    {trialButton}
                                    {buyButton}
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
		)
	}
}

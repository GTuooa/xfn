import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import thirdParty from 'app/thirdParty'
import { Icon } from 'app/components'

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

		return (
            <ul className="tcxq-invalid-equity-list">
                {
                    invalidEquityList.map((v, i) => {

                        const buttonList = v.get('buttonList')
                        const expireInfo = v.get('expireInfo')

                        let trialButton = null
                        let buyButton = null

                        if (expireInfo.indexOf('到期') > -1) {
                            trialButton = <span className="tcxq-invalid-equity-item-button-disabled tcxq-item-button">
                                {expireInfo}
                            </span>
                        }

                        if (buttonList.size) {  // 可购买
                            buyButton = buttonList.map(w => {
                                return <span className={`tcxq-item-button tcxq-invalid-equity-item-button-buy-${w.get('color').toLowerCase()}`} onClick={() => {
                                    if (w.get('function') === 'XFN') {
                                        // dispatch(feeActions.switchFeeActivePage('Tcgm'))
                                        // dispatch(tcgmActions.fromTcxqJumpToTcgm(v.get('name').split('(')[0]))
                                        if (w.get('goodsCode')) {
                                            dispatch(tcxqActions.getDingIapPageUrl(w.get('goodsCode')))
                                        }
                                        // thirdParty.toast.info('功能升级中暂不支持购买，如需续费/升级请点击“帮助中心”联系客服。')
                                    } else if (w.get('function') === 'DD') {
                                        thirdParty.openLink({
                                            // url: `https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&goodsCode=FW_GOODS-1000302451&corpId=${sessionStorage.getItem('corpId')}`
                                            url: `https://h5.dingtalk.com/open-market/skuDetail.html?showmenu=false&dd_share=false&corpId=${sessionStorage.getItem('corpId')}&articleCode=FW_GOODS-1000302451&source=STORE_HOMEPAGE`
                                        })
                                    } else if (w.get('function') === 'TRIAL') {
                                        dispatch(tcxqActions.getTrailEquityFetch(v.get('trialCode')))
                                    }
                                }}>
                                    {w.get('label')}
                                </span>
                            })
                        }

                        // let trialButton = ''
                        // let buyButton = ''

                        // if (canBuy) {
                        //     buyButton = <span className="tcxq-invalid-equity-item-button-buy tcxq-item-button" onClick={() => {
						// 		if (beXfn) {
						// 			dispatch(feeActions.switchFeeActivePage('Tcgm'))
                        //             dispatch(tcgmActions.fromTcxqJumpToTcgm('buy', v.get('equityName')))
                        //         } else {
						// 			thirdParty.openLink({
						// 				url: `https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&goodsCode=FW_GOODS-1000302451&corpId=${sessionStorage.getItem('corpId')}`
						// 			})
                        //         }
                        //     }}>
                        //         购买
                        //     </span>
                        // }

                        // if (canTrial) {
                        //     trialButton = <span className="tcxq-invalid-equity-item-button-trail tcxq-item-button" onClick={() => {
                        //         dispatch(tcxqActions.getTrailEquityFetch(v.get('equityCode')))
                        //     }}>
                        //         开启试用
                        //     </span>
                        // } else {
						// 	if (canBuy && beExpire) {
						// 		trialButton = <span className="tcxq-invalid-equity-item-button-disabled tcxq-item-button">
						// 			已到期
						// 		</span>
						// 	} else if (!canBuy) {
						// 		trialButton = <span className="tcxq-invalid-equity-item-button-disabled tcxq-item-button">
						// 			敬请期待
						// 		</span>
						// 	}
                        // }

                        return (
                            <li className="tcxq-invalid-equity-item" key={i}>
								<div className="tcxq-invalid-equity-item-detail">
									<span className="tcxq-main-font">{v.get('name')}</span>
									<span className="tcxq-sub-font">{v.get('content')}</span>
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

import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import thirdParty from 'app/thirdParty'

import { feeActions } from 'app/redux/Fee'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'

@immutableRenderDecorator
export default
class EquityList extends React.Component {

	render() {
        const {
			equityList,
			dispatch
		} = this.props

		return (
            <ul className="tcxq-equity-list">
                {
                    equityList.map((v, i) => {
                        const buttonList = v.get('buttonList')
                        let button = null
                        
                        if (buttonList.size) {  // 可购买
                            button = buttonList.map(w => {
                                return <span className={`tcxq-item-button tcxq-equity-item-button-${w.get('color').toLowerCase()}`} onClick={() => {
                                    if (w.get('function') === 'XFN') {
                                        // dispatch(feeActions.switchFeeActivePage('Tcgm'))
                                        // dispatch(tcgmActions.fromTcxqJumpToTcgm(v.get('name').split('(')[0]))
                                        if (w.get('goodsCode')) {
                                            dispatch(tcxqActions.getDingIapPageUrl(w.get('goodsCode')))
                                        }

                                        // thirdParty.toast.info('功能升级中暂不支持购买，如需续费/升级请点击“帮助中心”联系客服。')
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
                                        thirdParty.openLink({
                                            // url: `https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&goodsCode=FW_GOODS-1000302451&corpId=${sessionStorage.getItem('corpId')}`
                                            url: `https://h5.dingtalk.com/open-market/skuDetail.html?showmenu=false&dd_share=false&corpId=${sessionStorage.getItem('corpId')}&articleCode=FW_GOODS-1000302451&source=STORE_HOMEPAGE`
                                        })
                                    }
                                }}>
                                    {w.get('label')}
                                </span>
                            })
                        }
                        // if (canBuy) {  // 可购买
                        //     button = <span className="tcxq-item-button tcxq-equity-item-button" onClick={() => {
                        //         if (beXfn) {
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
                        // } else if (canRenew || canUpgrade) {  // 不可购买，可升级或续费

                        //     let name = canRenew ? '续费' : ''
                        //     if (canUpgrade) {
                        //         name = name ? name + '/升级' : '升级'
                        //     }

                        //     button = <span className="tcxq-item-button tcxq-equity-item-button" onClick={() => {
                        //         if (beXfn) {
                        //             dispatch(feeActions.switchFeeActivePage('Tcgm'))
						// 			dispatch(tcgmActions.fromTcxqJumpToTcgm('upgrade', v.get('equityName')))
                        //         } else {
						// 			thirdParty.openLink({
						// 				url: `https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&goodsCode=FW_GOODS-1000302451&corpId=${sessionStorage.getItem('corpId')}`
						// 			})
                        //         }
                        //     }}>
                        //         {name}
                        //     </span>
                        // }

                        return (
                            <li className="tcxq-equity-item" key={i}>
                                <div className="tcxq-equity-item-title">
                                    <span className="tcxq-main-font">{v.get('name')}</span>
									<span className="tcxq-sub-font">{v.get('expireInfo')}</span>
                                </div>
                                <div>
                                    {button}
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
		)
	}
}

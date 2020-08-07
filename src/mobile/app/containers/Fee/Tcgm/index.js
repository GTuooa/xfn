import React from 'react'
import { connect }	from 'react-redux'

import Title from '../components/Title'
import { Icon, Button, ButtonGroup, Container, Row, ScrollView } from 'app/components'

import { feeActions } from 'app/redux/Fee'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import thirdParty from 'app/thirdParty'

import OrderBuy from '../components/OrderBuy'
import OrderUpgrade from '../components/OrderUpgrade'
import Buy from './Buy'
import UntreatedOrder from './UntreatedOrder'
import Upgrade from '../Tcsj/Upgrade'

import '../style.less'

@connect(state => state)
export default
class Tcgm extends React.Component {

    componentDidMount() {
        this.props.dispatch(tcgmActions.getPayProductFetch())
	}
    constructor() {
		super()
		this.state = {
            readContractStatus: false,
            agree: false
        }
	}

    shouldComponentUpdate(nextprops, nextstate) {
		return this.props.tcgmState != nextprops.tcgmState || this.state != nextstate
	}

    render() {

        const { tcgmState, tcxqState, feeState, dispatch, homeState, history } = this.props
        const { readContractStatus, agree } = this.state

        const currentPage = feeState.getIn(['views', 'currentPage'])

        const corpName = tcgmState.getIn(['data', 'payInfo', 'corpName'])
        const corpId = tcgmState.getIn(['data', 'payInfo', 'corpId'])
        const equityTcxq = tcxqState.getIn(['data', 'corpInfo', 'equityInfoList'])
        const equityList = tcgmState.getIn(['data', 'payInfo', 'equityList'])
        const packageList = tcgmState.getIn(['data', 'payInfo', 'packageList'])
        const expireDate = tcgmState.getIn(['data', 'payInfo', 'expireDate'])

        const views = tcgmState.get('views')
        const orderWindowShow = views.get('orderWindowShow')
        const orderNumber = views.get('orderNumber')
        const buyOrUpgrade = views.get('buyOrUpgrade')
        const upgradeStatu = views.get('upgradeStatu')
        const buyStatu = views.get('buyStatu')
        const agreeGm = views.get('agreeGm')
        const agreeSj = views.get('agreeSj')
        const untreatedOrderVisible = views.get('untreatedOrderVisible')
        const untreatedOrderMessage = views.get('untreatedOrderMessage')
        const untreatedOrderList = views.get('untreatedOrderList')
        const untreatedOrderNo = views.get('untreatedOrderNo')
        const untreatedOrderSize = untreatedOrderList ? untreatedOrderList.length : ''

        const ddUserId = homeState.getIn(['data', 'userInfo', 'dduserid'])

        const equityName = buyStatu.get('equityName')
        const index = buyStatu.get('index')

        let subjectName = ''
        let amount = 0
        let goodsCode = []
        upgradeStatu.forEach(v => {
            const upgrade = packageList.getIn([v.get('productName'), v.get('index')])
            subjectName = subjectName ? subjectName + '+' + upgrade.get('productName') : upgrade.get('productName')
            amount = amount + upgrade.get('payFee')
            goodsCode.push(upgrade.get('productCode'))
        })

        return (
            <Container className="fee">
                <Title
                    activeTab={currentPage}
                    onClick={(value) => {
                        dispatch(feeActions.switchFeeActivePage(value))
                    }}
                />

                {
                    <OrderUpgrade
                        corpName={corpName}
                        dispatch={dispatch}
                        orderWindowShow={orderWindowShow}
                        orderNumber={orderNumber}
                        amount={amount}
                        subjectName={subjectName}
                    />
                }

                <UntreatedOrder
                    dispatch={dispatch}
                    untreatedOrderMessage={untreatedOrderMessage}
                    untreatedOrderVisible={untreatedOrderVisible}
                    untreatedOrderList={untreatedOrderList}
                    untreatedOrderSize={untreatedOrderSize}
                    untreatedOrderNo={untreatedOrderNo}
                />

                <ScrollView flex='1'>
                    <div className="fee-title">
                        <span className="fee-title-label"> 企业名称：</span>
                        <span className="fee-title-text">{corpName}</span>
                    </div>
                    {
                        equityList.size ?
                        <div className="tcgm-equity">
                            <span className="tcxq-label">当前功能：</span>
                            <ul className="tcgm-equity-list">
                                {
                                    equityList.map((v, i) => {
                                        return (
                                            <li className="tcgm-equity-item" key={i}>
                                                <span className="tcxq-main-font">
                                                    {v.get('name')}{v.get('relateNumber')}
                                                </span>
                                                <span className="tcxq-sub-font">
                                                    {v.get('expireInfo')}
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        : null
                    }
                    <div>
                        <div className="tcxq-label">增值模块：</div>
                        <div className="tcgm-upgrade-buy-title">
                            <span className="main-font-variable">选择</span>
                            <div className="tcgm-upgrade-buy-title-switch">
                                <span className={"tcgm-upgrade-buy-title-switch"}>续费/升级</span>
                            </div>
                        </div>
                        <div>
                            {
                                <Upgrade
                                    packageList={packageList}
                                    upgradeStatu={upgradeStatu}
                                    dispatch={dispatch}
                                    corpName={corpName}
                                    orderWindowShow={orderWindowShow}
                                    orderNumber={orderNumber}
                                    history={history}
                                    corpId={corpId}
                                    ddUserId={ddUserId}
                                    agree={agree}
                                    onAgree={() => this.setState({agree: !agree})}
                                    showContract={() => this.setState({readContractStatus: true})}
                                    agreeSj={agreeSj}
                                    expireDate={expireDate}
                                />
                            }
                        </div>
                    </div>
                </ScrollView>
                <ButtonGroup type='ghost' height={50}>
                    <Button disabled={!(amount > 0 && agreeSj)} onClick={() => {
                        if (amount > 0) {
                            if (agreeSj) {
                                dispatch(tcgmActions.submitOrderTcsj(subjectName, amount, goodsCode))
                            } else {
                                thirdParty.Alert('请阅读并同意《用户服务协议》')
                            }
                        } else {
                            thirdParty.Alert('请选择要升级的套餐')
                        }
                    }}><Icon type="save"/>提交订单</Button>
                </ButtonGroup>
            </Container>
        )
    }
}

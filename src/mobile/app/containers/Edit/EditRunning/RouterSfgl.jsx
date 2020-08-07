import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, XfInput } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

import { decimal, DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'


@connect(state => state)
export default
class RouterSfgl extends React.Component {
    scrollerHeight = 0//滚动容器的高度
    listHeight = 154//一条卡片的高度
    totalAmount = 0
    moedAmount = 0

    state = {
        currentPage: 1,
	}

    componentDidMount() {
        thirdParty.setTitle({title: '手动核销'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })
        sessionStorage.setItem('routerPage', 'routerSfgl')
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
        const listHtml = document.getElementsByClassName('jr-card')[0]
        this.listHeight = listHtml ? Number(window.getComputedStyle(listHtml).height.replace('px','')) : 154
    }

    componentWillUnmount () {
        this.props.dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], decimal(Math.abs(this.totalAmount))))
        this.props.dispatch(editRunningActions.changeLrlsData(['oriTemp', 'allHandleAmount'], this.totalAmount))
        this.props.dispatch(editRunningActions.changeLrlsData(['oriTemp', 'moedAmount'], decimal(this.moedAmount)))
    }

	render () {
		const { dispatch, history, editRunningState } = this.props
		const { currentPage } = this.state

		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])
		const insertOrModify = editRunningState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

        const oriTemp = editRunningState.get('oriTemp')
        const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
        const oriState = oriTemp.get('oriState')
        const beMoed = oriTemp.get('beMoed')

		let creditAmount = 0, debitAmount = 0, allHandleAmount = 0, allMoedAmount = 0
        let creditNumber = 0, debitNumber = 0
		let filterPendingStrongList = pendingStrongList.filter(v => {
			if (v.get('beSelect')) {
                const handleAmount = Number(v.get('handleAmount')) ? Number(v.get('handleAmount')) : 0
                const moedAmount = Number(v.get('moedAmount')) ? Number(v.get('moedAmount')) : 0

				if (v.get('direction')=='debit') {//借方发生金额
					//totalAmount += Number(v.get('amount'))
                    debitAmount += Number(v.get('amount'))
                    allHandleAmount += Number(handleAmount)
                    allMoedAmount += Number(moedAmount)
                    debitNumber++
				} else {//贷方发生金额
					//totalAmount -= Number(v.get('amount'))
                    creditAmount += Number(v.get('amount'))
                    allHandleAmount -= Number(handleAmount)
                    allMoedAmount -= Number(moedAmount)
                    creditNumber++
				}
                return true
			}
		})

        creditAmount = decimal(creditAmount)
        debitAmount = decimal(debitAmount)
        allHandleAmount = decimal(allHandleAmount)
        allMoedAmount = decimal(allMoedAmount)

        this.totalAmount = allHandleAmount
        this.moedAmount = allMoedAmount
        if (isModify && oriState=='STATE_SFGL_ML') {
            this.totalAmount = allMoedAmount
        }

		let titleName = allHandleAmount >= 0 ? '核销收款金额：' : '核销付款金额：'
        let modeName = allMoedAmount >= 0 ? '核销收款抹零：' : '核销付款抹零：'

        const pageSize = 50//滑动一次加载50个
        const pageCount = Math.ceil(filterPendingStrongList.size/pageSize)

		return(
			<Container className="edit-running">
                <TopDatePicker
					value={oriDate}
					onChange={date => {
                        return
						//dispatch(editRunningActions.changeHomeAccountOriDate(new DateLib(date).valueOf(), isModify))
					}}
					callback={(value) => {
                        return
						//dispatch(editRunningActions.changeHomeAccountOriDate(value, isModify))
					}}
				/>

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll"
                    onScroll={(e) => {
                        const scrollY = e.target.scrollTop
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*pageSize && currentPage < pageCount) {
                            this.setState({currentPage: currentPage+1})
                        }
                    }}
                >
					{
						filterPendingStrongList.slice(0,currentPage*pageSize).map((v, i) => {
							const beOpened = v.get('beOpened')
							const beCard = v.get('beCard')//true 往来卡片期初值需要获取类别
                            const handleAmount = Number(v.get('handleAmount')) ? Number(v.get('handleAmount')) : 0
                            const moedAmount = Number(v.get('moedAmount')) ? Number(v.get('moedAmount')) : 0
                            const amount = v.get('amount')

                            let reg = /^\d*\.?\d{0,2}$/g
                            let errMessage = '请输入正数'
                            if (amount < 0) {
                                reg = /^-\d*\.?\d{0,2}$/g
                                errMessage = '请输入负数'
                            }

                            const idx = pendingStrongList.findIndex(item=> item.get('uuid')==v.get('uuid'))

							return (
								<Row key={i} className='jr-card lrls-bottom'>
									<div className='jr-item jr-line'>
										<span>{beOpened ? '期初值' : `${v.get('jrIndex')}号`}</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>

									<div className='jr-item'>
										<div className='overElli'>{v.get('categoryName')}</div>
										<span></span>
									</div>

									<div className='jr-item'>
										<span className='overElli'>
											{v.get('oriAbstract')}
										</span>
									</div>
									<div className='jr-item lrls-bottom-line'>
										<span className=''>
											{v.get('direction') == 'credit' ? '贷方发生' : '借方发生'}
										</span>
										<Amount showZero className='hx-bold'>{v.get('amount')}</Amount>
									</div>
                                    <Row className='lrls-more-card'>
                                        <Row className='lrls-more-card sfgl-input sfgl-input-left'
                                            style={{display: oriState=='STATE_SFGL_ML' ? 'none' : ''}}
                                        >
                                            <label>核销金额： </label>
                                            <XfInput.BorderInputItem
                                                mode='amount'
                                                value={v.get('handleAmount')}
                                                onChange={(value) => {
                                                    if (reg.test(value) || value == '') {

                                                        if (value == '-') {
                                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList', idx, 'handleAmount'], value))
                                                            return
                                                        } else {
                                                            if (Math.abs(moedAmount)+Math.abs(value)>Math.abs(amount)) {
                                                                return thirdParty.toast.info('金额不能大于待处理金额')
                                                            }
                                                        }

                                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList', idx, 'handleAmount'], value))

                                                    } else {
                                                        return thirdParty.toast.info(errMessage)
                                                    }
                                                }}
                                            />
                                        </Row>
                                        <Row className='lrls-more-card sfgl-input sfgl-input-right'
                                            style={{display: oriState=='STATE_SFGL_ML' || beMoed ? '' : 'none'}}
                                        >
                                            <label>抹零金额： </label>
                                            <XfInput.BorderInputItem
                                                mode='amount'
                                                value={v.get('moedAmount')}
                                                onChange={(value) => {
                                                    if (reg.test(value) || value == '') {

                                                        if (value == '-') {
                                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList', idx, 'moedAmount'], value))
                                                            return
                                                        } else {
                                                            if (Math.abs(handleAmount)+Math.abs(value)>Math.abs(amount)) {
                                                                return thirdParty.toast.info('金额不能大于待处理金额')
                                                            }
                                                        }

                                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList', idx, 'moedAmount'], value))
                                                    } else {
                                                        return thirdParty.toast.info(errMessage)
                                                    }

                                                }}
                                            />
                                        </Row>
                                    </Row>
								</Row>
							)
						})
					}

				</ScrollView>
				<div className='jr-card hx-top-line'>
					<div className='jr-item'>
						<span className='jr-item-item'>
                            借方合计：<Amount showZero>{debitAmount}</Amount>
                        </span>
						{
                            isModify ? null : <span className='jr-item-item'>
                                {titleName}<Amount showZero>{Math.abs(allHandleAmount)}</Amount>
                            </span>
                        }
					</div>
                    <div className='jr-item'>
						<span className='jr-item-item'>
                            贷方合计：<Amount showZero>{creditAmount}</Amount>
                        </span>
                        {
                            isModify && oriState=='STATE_SFGL' ? <span className='jr-item-item'>
                                {titleName}<Amount showZero>{Math.abs(allHandleAmount)}</Amount>
                            </span> : null
                        }
                        {
                            isModify && oriState=='STATE_SFGL_ML' ? <span className='jr-item-item'>
                                {modeName}<Amount showZero>{Math.abs(allMoedAmount)}</Amount>
                            </span> : null
                        }
						{
                            !isModify && beMoed ? <span className='jr-item-item'>
                                {modeName}<Amount showZero>{Math.abs(allMoedAmount)}</Amount>
                            </span> : null
                        }
					</div>
				</div>

				<ButtonGroup>
					<Button onClick={() => {history.goBack()}}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}

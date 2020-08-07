import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox, Multiple, XfInput } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import { decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class Zfkx extends React.Component {
	scrollerHeight = 0//滚动容器的高度
    componentDidMount() {
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[1]
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
    }
	state = {
		isSearch: false,
		searchValue: '',
        currentPage: 1,
	}

	render () {
		const { dispatch, editRunningState } = this.props
		const { isSearch, searchValue, currentPage } = this.state

		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])
		const insertOrModify = editRunningState.getIn(['views', 'insertOrModify'])
		const isInsert = insertOrModify === 'modify' ? false : true

		let currentNametList = [], currentUuidList = []
		if (isInsert) {
			const currentCardList =  editRunningState.getIn(['oriTemp', 'currentCardList'])
			currentCardList.map(v => {
				currentNametList.push(v.get('name'))
				currentUuidList.push(v.get('uuid'))
			})
		}

		const currentList = editRunningState.get('currentList') ? editRunningState.get('currentList') : fromJS([])
		let newCurrentList = currentList.toJS()
		newCurrentList.forEach(v => {
			v['value']=v['uuid']
		})

		let countNumber = 0
		let totalAmount = 0
		pendingStrongList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += v.get('notHandleAmount')
			}
		})

		let filterPendingStrongList = pendingStrongList
		if (isSearch && searchValue) {
            filterPendingStrongList = pendingStrongList.filter(v => {
				let shouldReturn = false
				if (v.get('oriAbstract').toString().includes(searchValue)) {
					shouldReturn = true
				}
				if (v.get('notHandleAmount').toString().includes(searchValue)) {
					shouldReturn = true
				}
				return shouldReturn
			})
        }
        const pageCount = Math.ceil(filterPendingStrongList.size/20)

		return(
			<Container className="edit-running">
				{
					isInsert ?
					<div>
						<div className='sfgl' style={{display: isSearch ? 'none' : ''}}>
							<Multiple
								className='sfgl-item zszf-single'
								district={newCurrentList}
								value={currentUuidList}
								onOk={value => {
									let valueList = []
									value.forEach(v => {
										valueList.push({name: v['name'], uuid: v['uuid']})
									})

									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentCardList'], fromJS(valueList)))
									dispatch(editRunningActions.getZskxPaymentList())

								}}
							>
								<Row className='lrls-padding sfgl-name'>
									{
										currentNametList.length ? <span className='overElli'> {currentNametList.join('、')} </span>
										: <span className='overElli lrls-placeholder'>筛选往来单位...</span>
									}
									<Icon type="triangle"/>
								</Row>
							</Multiple>
							<div className='sfgl-search' onClick={() => this.setState({isSearch: true})}>
								<Icon type='search'/>
							</div>
						</div>
						<div className='sfgl sfgl-search-item' style={{display: isSearch ? '' : 'none'}}>
							<Icon type='search'/>
							<XfInput
								className='xfn-multiple-input'
								placeholder='搜索摘要、金额...'
								value={searchValue}
								onChange={(value) => this.setState({searchValue: value})}
							/>
							<span className='xfn-multiple-cancel' onClick={() => this.setState({
                                searchValue: '',
                                isSearch: false,
                                currentPage: 1,
                            })}>
								取消
							</span>
						</div>


					</div> : null
				}
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition
					onScroll={(e) => {
                        const scrollY = e.target.scrollTop
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*1660 && currentPage < pageCount) {
                            this.setState({currentPage: currentPage+1})
                        }
                    }}
				>
					{
						filterPendingStrongList.slice(0,currentPage*20).map((v, i) => {
							return (
								<Row
									key={i}
									className='jr-card'
									onClick={() => {
										let index = 0
										pendingStrongList.map((w,j)=>{
											if (w.get('uuid')==v.get('uuid')) {
												index=j
											}
										})
										if (v.get('beSelect')) {
											dispatch(editRunningActions.pendingStrongListBeSelect(index, false))
										} else {
											dispatch(editRunningActions.pendingStrongListBeSelect(index, true))
										}
									}}
								>
									<div className='jr-item jr-line'>
										<span>
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('beSelect') ? true : false}
											/>
											{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}
										</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>
									<div className='jr-item'>
										<span className='overElli'>
											摘要：{v.get('oriAbstract')}
										</span>
									</div>
									<div className='jr-item'>
										<span>其他应收</span>
										<Amount showZero className='hx-bold'>{v.get('notHandleAmount')}</Amount>
									</div>
								</Row>
							)
						})
					}
				</ScrollView>
				<div className='jr-card hx-top-line' style={{display: countNumber > 0 ? '' : 'none'}}>
					<div className='jr-item'>
						<span>已勾选流水：{countNumber}条</span>
						<span>合计金额：<Amount showZero>{totalAmount}</Amount></span>
					</div>
				</div>

				<ButtonGroup>
					<Button onClick={() => {
						if (countNumber > 160) { return thirdParty.Alert('勾选的核销流水不能超过160条') }
						totalAmount = decimal(totalAmount)
						dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], false))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], totalAmount))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrAmount'], totalAmount))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { decimal, throttle } from 'app/utils'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class Ggfyft extends React.Component {
	scrollerHeight = 0//滚动容器的高度
	listHeight = 107//一条卡片的高度
	pageSize = 20//滑动一次加载50个
	throttleFn = throttle((e,currentPage,  pageCount) => {
		const scrollY = e.target.scrollTop
        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*this.pageSize && currentPage < pageCount) {
            this.setState({currentPage: currentPage+1})
        }
	})
	state = {
		currentPage: 1
	}
	componentDidMount() {
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[1]
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
        const listHtml = document.getElementsByClassName('jr-card')[0]
        this.listHeight = listHtml ? Number(window.getComputedStyle(listHtml).height.replace('px','')) : 107
    }

	render () {
		const { dispatch, editRunningState } = this.props
		const { currentPage } = this.state
		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])
		const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
		const shareType = editRunningState.getIn(['oriTemp', 'shareType'])
		const insertOrModify = editRunningState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		
		let countNumber = 0
		let totalAmount = 0
		let hasBeSelect = false
		pendingStrongList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += v.get('notHandleAmount')
				hasBeSelect = true
			}
		})
		const pageCount = Math.ceil(pendingStrongList.size/this.pageSize)

		
		return(
			<Container className="edit-running">
				{oriState=='STATE_GGFYFT' ? <Row className='lrls-category hx-top-line ggfyft'>
					<span className={shareType==='0' ? 'item active' : 'item'} 
					    onClick={() => {
							if (isModify) { return }
						    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'shareType'], '0'))
						    dispatch(editRunningActions.getGgfyftList())
					    }}>
							<span className={isModify ? 'lrls-placeholder' : ''}>分摊支出</span>
					</span>
					<span className={shareType==='1' ? 'item active' : 'item'}
					    onClick={() => {
							if (isModify) { return }
							dispatch(editRunningActions.changeLrlsData(['oriTemp', 'shareType'], '1'))
							dispatch(editRunningActions.getGgfyftList())
						}}>
							<span className={isModify ? 'lrls-placeholder' : ''}>分摊收入</span>
					</span>
				</Row> : null}
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition  
				    onScroll={(e) => {
                        this.throttleFn(e, currentPage, pageCount)
                    }}>
					{
						pendingStrongList.slice(0,currentPage*this.pageSize).map((v, i) => {
							let disabled = false
							if (hasBeSelect && totalAmount * v.get('notHandleAmount') < 0) {//同正同负可以被选中
								disabled = true
							}
							return (
								<Row
									key={i}
									className='jr-card'
									onClick={() => {
										if (disabled) {
											return
										}
										if (v.get('beSelect')) {
											dispatch(editRunningActions.pendingStrongListBeSelect(i, false))
										} else {
											dispatch(editRunningActions.pendingStrongListBeSelect(i, true))
										}
									}}
								>
									<div className='jr-item jr-line'>
										<span>
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('beSelect') ? true : false}
												onChange={() => {}}
												disabled={disabled}
											/>
											{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}
										</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>
									<div className='jr-item'>
										<span className='overElli'>
											{v.get('categoryName')}
										</span>

									</div>
									<div className='jr-item'>
										<span className='overElli'>
											摘要：{v.get('oriAbstract')}
										</span>
									</div>
									<div className='jr-item'>
										<span>
											{v.get('jrJvTypeName')}
										</span>
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
						dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], false))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrAmount'], decimal(totalAmount)))
						dispatch(editRunningActions.autoCalculate())
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}

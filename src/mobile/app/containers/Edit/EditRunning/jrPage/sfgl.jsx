import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox, TreeSelect, ChosenPicker, Multiple, XfInput } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

import { decimal } from 'app/utils'
const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
            v['childList'].unshift({
                key: v['uuid'],
                label: '全部',
                uuid: v['uuid'],
                name: v['name'],
                childList: [],
            })
        }
    })
}

@connect(state => state)
export default
class Sfgl extends React.Component {
    scrollerHeight = 0//滚动容器的高度
    listHeight = 107//一条卡片的高度
    componentDidMount() {
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[1]
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
        const listHtml = document.getElementsByClassName('jr-card')[0]
        this.listHeight = listHtml ? Number(window.getComputedStyle(listHtml).height.replace('px','')) : 107
    }
	state = {
		visible: false,
		disabled: true,
		idx: 0,
		isSearch: false,
		searchValue: '',
        currentPage: 1,
	}

	render () {
		const { dispatch, editRunningState } = this.props
		const { visible, disabled, idx, isSearch, searchValue, currentPage } = this.state

		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])
		const categoryList = pendingStrongList.getIn([idx, 'categoryList']) ? pendingStrongList.getIn([idx, 'categoryList']) : fromJS([])
		const categoryUuid = pendingStrongList.getIn([idx, 'categoryUuid']) ? pendingStrongList.getIn([idx, 'categoryUuid']) : ''
		const insertOrModify = editRunningState.getIn(['views', 'insertOrModify'])
		const isInsert = insertOrModify === 'modify' ? false : true
		const topCategoryList = editRunningState.get('categoryList').toJS()
		const usedAccounts = editRunningState.getIn(['oriTemp', 'usedAccounts'])

		let topCategoryName = [], topCategoryUuid = [], currentNametList = [], currentUuidList = []
		if (isInsert) {
			loop(topCategoryList)
			const categoryUuid =  editRunningState.getIn(['oriTemp', 'pendingManageDto', 'categoryUuid'])
			categoryUuid.map(v => {
				topCategoryName.push(v.get('name'))
				topCategoryUuid.push({key:v.get('uuid'), label: v.get('name')})
			})

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
        let selectCategory = false
		pendingStrongList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				if (v.get('direction')=='debit') {
					totalAmount += Number(v.get('amount'))
				} else {
					totalAmount -= Number(v.get('amount'))
				}
                if (v.get('beSelect') && !v.get('categoryUuid')) {
                    selectCategory = true//未选择类别
                }
			}
		})

		let titleName = totalAmount >= 0 ? '待核销收款金额：' : '待核销付款金额：'

        let filterPendingStrongList = pendingStrongList
		if (isSearch && searchValue) {
            filterPendingStrongList = pendingStrongList.filter(v => {
				let shouldReturn = false
				if (v.get('oriAbstract').toString().includes(searchValue)) {
					shouldReturn = true
				}
				if (v.get('amount').toString().includes(searchValue)) {
					shouldReturn = true
				}
				return shouldReturn
			})
        }

        const pageSize = 50//滑动一次加载50个
        const pageCount = Math.ceil(filterPendingStrongList.size/pageSize)

		return(
			<Container className="edit-running">
				{
					isInsert ?
					<div>
						<div className='sfgl' style={{display: isSearch ? 'none' : ''}}>
							<ChosenPicker
								className='sfgl-item'
								multiSelect={true}
								district={topCategoryList}
								value={topCategoryUuid}
								onOk={(item) => {
									let valueList = []
									item.forEach(v => {
										valueList.push({uuid:v['uuid'], name: v['name']})
									})
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingManageDto', 'categoryUuid'], fromJS(valueList)))
									dispatch(editRunningActions.getSfglList())
								}}
							>
								<Row className='lrls-padding sfgl-name'>
                                    {
										topCategoryName.length ? <span className='overElli'> {topCategoryName.join('、')} </span>
										: <span className='overElli lrls-placeholder'>筛选流水类别...</span>
									}
									<Icon type="triangle"/>
								</Row>
							</ChosenPicker>
							<Multiple
								className='sfgl-item lrls-single'
								district={newCurrentList}
								value={currentUuidList}
								onOk={value => {
									let valueList = []
									value.forEach(v => {
										valueList.push({name: v['name'], uuid: v['uuid']})
									})

									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentCardList'], fromJS(valueList)))
									dispatch(editRunningActions.getSfglList())

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

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll"
                    onScroll={(e) => {
                        const scrollY = e.target.scrollTop
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*pageSize && currentPage < pageCount) {
                            this.setState({currentPage: currentPage+1})
                        }
                    }}
                >
					<TreeSelect
						visible={visible}
                        district={categoryList.toJS()}
                        value={categoryUuid}
                        disabled={disabled}
                        onChange={(item) => {
                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList', idx, 'categoryUuid'], item['uuid']))
							dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList', idx, 'categoryName'], item['name']))
							this.setState({visible: false})
                        }}
						onCancel={() => this.setState({visible: false})}
                    >
						<div></div>
                    </TreeSelect>
					{
						filterPendingStrongList.slice(0,currentPage*pageSize).map((v, i) => {
							const beOpened = v.get('beOpened')
							const beCard = v.get('beCard')//true 往来卡片期初值需要获取类别
							return (
								<Row
									key={i}
									className='jr-card'
								>
									<div className='jr-item jr-line'
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
												if (beCard) {
													if (!v.get('categoryList')) {
														dispatch(editRunningActions.getSfglQcCategoryList(index, v.get('uuid')))
													}
													this.setState({
														visible: true,
														disabled: false,
														idx: index
													})
												}
											}
										}}
									>
										<span>
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('beSelect') ? true : false}
											/>
											{beOpened ? '期初值' : `${v.get('jrIndex')}号`}
										</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>

									<div className='jr-item'>
										{
											beCard ?
												<Row className={v.get('beSelect') ? 'overElli' : 'overElli lrls-placeholder'}
													onClick={() => {
                                                        let index = 0
                                                        pendingStrongList.map((w,j)=>{
                                                            if (w.get('uuid')==v.get('uuid')) {
                                                                index=j
                                                            }
                                                        })
														if (v.get('beSelect')) {
															this.setState({
																visible: true,
																disabled: false,
																idx: index
															})
														}
													}}
												>
													{v.get('categoryName') ? v.get('categoryName') : '点击选择类别'}
												</Row>
											: <div className='overElli'>
												{v.get('categoryName')}
											</div>
										}
										<span></span>
									</div>
									<div className='jr-item'>
										<span className='overElli'>
											{v.get('oriAbstract')}
										</span>
									</div>
									<div className='jr-item'>
										<span className=''>
											{v.get('direction') == 'credit' ? '贷方发生' : '借方发生'}
										</span>
										<Amount showZero className='hx-bold'>{v.get('amount')}</Amount>
									</div>


								</Row>
							)
						})
					}

				</ScrollView>
				<div className='jr-card hx-top-line' style={{display: countNumber > 0 ? '' : 'none'}}>
					<div className='jr-item'>
						<span>已勾选流水：{countNumber}条</span>
						<span>{titleName}<Amount showZero>{Math.abs(Number(totalAmount))}</Amount></span>
					</div>
				</div>

				<ButtonGroup>
					<Button onClick={() => {
                        if (selectCategory) { return thirdParty.Alert('请选择需要核算的流水的类别') }
						if (countNumber > 160) { return thirdParty.Alert('勾选的核销流水不能超过160条') }
						dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], false))
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], decimal(Math.abs(totalAmount))))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrAmount'], decimal(totalAmount)))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'allHandleAmount'], decimal(totalAmount)))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedAccounts'], usedAccounts ? countNumber==1 : false))
					}}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}

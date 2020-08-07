import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox, ChosenPicker, Multiple, XfInput } from 'app/components'
import { decimal } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import thirdParty from 'app/thirdParty'

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

const categoryLoop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

@connect(state => state)
export default
class JzcbLs extends React.Component {
	scrollerHeight = 0//滚动容器的高度
    listHeight = 0//一条卡片的高度
    componentDidMount() {
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[1]
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
        const listHtml = document.getElementsByClassName('jr-card')[0]
        this.listHeight = listHtml ? Number(window.getComputedStyle(listHtml).height.replace('px','')) : 82
    }
	state = {
		isSearch: false,
		searchValue: '',
        currentPage: 1,
        isAll: true,
        categoryValue: 'ALL',
	}

	render () {
		const { dispatch, editRunningState } = this.props
		const { isSearch, searchValue, currentPage, isAll, categoryValue } = this.state

		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])
		const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
		const titleName = oriState === 'STATE_YYSR_XS' ? '收入金额合计：' : '退销金额合计：'
		const isInsert = editRunningState.getIn(['views', 'insertOrModify']) == 'insert' ? true : false
		const topCategoryList = editRunningState.get('categoryList').toJS()
        const warehouseList = editRunningState.getIn(['cardAllList', 'warehouseList']).toJS()
        const stockCategoryList = editRunningState.get('stockCategoryList')//卡片类别列表
        const stockList = editRunningState.get('stockList')//存货卡片列表
        const commonCardList = editRunningState.get('commonCardList').toJS()
        const stockCardList = editRunningState.getIn(['cardAllList', 'stockCardList'])
        const stockCardNameList = stockCardList.map(v => `${v.get('code')} ${v.get('name')}`)

		let topCategoryName = [], topCategoryUuid = [], warehouseNameList = [], warehouseUuidList = []
        let categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
        let stockListArr = isAll ? stockList.toJS() : commonCardList

		if (isInsert) {
			loop(topCategoryList)
			const categoryUuid =  editRunningState.getIn(['oriTemp', 'relationCategoryUuid'])
			categoryUuid && categoryUuid.map(v => {
				topCategoryName.push(v.get('name'))
				topCategoryUuid.push({key:v.get('uuid'), label: v.get('name')})
			})

			const warehouseCardList =  editRunningState.getIn(['cardAllList', 'warehouseCardList'])
			warehouseCardList.map(v => {
				warehouseNameList.push(v.get('name'))
				warehouseUuidList.push(v.get('uuid'))
			})

            //卡片列表信息
            stockCategoryList.map(v => { categoryList.push(v.toJS()) })
            categoryLoop(categoryList)

            stockListArr.map(v => {
                v['name'] = v['key']
                v['uuid'] = v['cardUuid']
            })
		}


		let countNumber = 0
		let totalAmount = 0
		pendingStrongList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += Math.abs(v.get('amount'))
			}
		})

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
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryUuid'], fromJS(valueList)))
									dispatch(editRunningActions.getJzcbList(true))
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
                            <ChosenPicker
                                className='sfgl-item left-line'
                                type='card'
                                multiSelect={true}
                                title='请选择存货'
                                district={categoryList}
                                cardList={stockListArr}
                                value={categoryValue}
                                onChange={(value) => {
                                    this.setState({categoryValue: value.key})
                                    if (value.key=='ALL') {
                                        this.setState({isAll: true})
                                        return
                                    }
                                    this.setState({isAll: false})
                                    dispatch(editRunningActions.getCostStockByCategory(value.key, value['top'], 'commonCardJzcbList'))
                                }}
                                onOk={value => {
                                    dispatch(editRunningActions.changeLrlsData(['cardAllList', 'stockCardList'], fromJS(value.map(v => ({
                                        cardUuid: v['uuid'],
                                        code: v['code'],
                                        name: v['oriName'],
                                    })))))
                                    dispatch(editRunningActions.getJzcbList(true))
                                }}
                                onCancel={()=> { this.setState({visible: false}) }}
                            >
                                <Row className='lrls-padding sfgl-name'>
                                    {
										stockCardNameList.size ? <span className='overElli'> {stockCardNameList.join('、')} </span>
										: <span className='overElli lrls-placeholder'>筛选卡片...</span>
									}
									<Icon type="triangle"/>
								</Row>
                            </ChosenPicker>
							<Multiple
								className='sfgl-item left-line'
								district={warehouseList}
								value={warehouseUuidList}
								onOk={value => {
									let valueList = []
									value.forEach(v => {
										valueList.push({name: v['name'], uuid: v['uuid']})
									})

									dispatch(editRunningActions.changeLrlsData(['cardAllList', 'warehouseCardList'], fromJS(valueList)))
									dispatch(editRunningActions.getJzcbList(true))

								}}
							>
								<Row className='lrls-padding sfgl-name'>
									{
										warehouseNameList.length ? <span className='overElli'> {warehouseNameList.join('、')} </span>
										: <span className='overElli lrls-placeholder'>筛选仓库...</span>
									}
									<Icon type="triangle"/>
								</Row>
							</Multiple>
							<div className='sfgl-search left-line' onClick={() => this.setState({isSearch: true})}>
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
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*pageSize && currentPage < pageCount) {
                            this.setState({currentPage: currentPage+1})
                        }
                    }}
                >
					{
						filterPendingStrongList.slice(0,currentPage*pageSize).map((v, i) => {
							const isOpenedQuantity = v.get('isOpenedQuantity')
							const unitCardName = v.get('unitCardName') ? v.get('unitCardName') : ''
							const quantity = v.get('quantity') ? v.get('quantity') : 0
							const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])
							const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
							const batch = v.get('batch') ? v.get('batch') : ''
							const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
							const batchName = expirationDate ? `${batch}(${expirationDate})` : batch
							const storeCardName = v.get('storeCardName') ? v.get('storeCardName') : ''//仓库
							return (
								<Row
									key={i}
									className='jr-card'
									onClick={() => {
										let index = pendingStrongList.findIndex((w) => w.get('jrJvUuid')==v.get('jrJvUuid'))
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
												onChange={() => {}}
											/>
											{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}
										</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>
									{/* <div className='jr-item'>
										<span className='overElli'>
											{v.get('categoryName')}
										</span>
									</div> */}
									<div className='jr-item'>
										<span className='overElli'>
											摘要：{v.get('oriAbstract')}
										</span>
									</div>
									<div className='jr-item'>
										<span>
											{`${v.get('stockCardCode')} ${v.get('stockCardName')}`} {quantity ? `(数量:${quantity}${unitCardName})` : null}
										</span>
										<Amount showZero className='hx-bold'>{Math.abs(v.get('amount'))}</Amount>
									</div>
									{ (storeCardName) ? 
										<div className='jr-item'>
											<span>{`仓库: ${storeCardName}`}</span>
										</div> : null
									}
									{ (assistName || batchName ) ? 
										<div className='jr-item'>
											<span>{`属性: ${assistName} ${batchName}`}</span>
										</div> : null
									}
								</Row>
							)
						})
					}

				</ScrollView>
				<div className='jr-card hx-top-line' style={{display: countNumber > 0 ? '' : 'none'}}>
					<div className='jr-item'>
						<span>已勾选流水：{countNumber}条</span>
						<span>{titleName}<Amount showZero>{totalAmount}</Amount></span>
					</div>
				</div>

				<ButtonGroup>
					<Button onClick={() => {
						// if (countNumber > 160) { return thirdParty.Alert('勾选的核销流水不能超过80条') }
						dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], false))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrAmount'], decimal(totalAmount)))
						if (['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState)) {
							dispatch(editRunningActions.setJzcbPrice())
						}

					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}

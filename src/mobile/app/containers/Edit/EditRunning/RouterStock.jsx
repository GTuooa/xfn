import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Button, ButtonGroup, Container, Row, ScrollView, Single, Icon, Amount, TextListInput, ChosenPicker } from 'app/components'


import Chdb from './RouterStock/Chdb.js'
import Jzcb from './RouterStock/Jzcb.js'
import Chtrxm from './RouterStock/Chtrxm.js'
import StockCom from './RouterStock/StockCom.js'
import Chzz from './RouterStock/Chzz.js'
import ChzzZzd from './RouterStock/ChzzZzd.js'
import Chye from './RouterStock/Chye.js'
import Xmjz from './RouterStock/Xmjz.js'
import AssistSelect from './RouterStock/AssistSelect.jsx'
import thirdParty from 'app/thirdParty'
import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'


const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

const filterSerialList  = (cardUuid, serialMultipleList, stockCardList, idx) => {//相同存货的相同序列号不出现
    let serialUuidList = []//相同存货用过的序列号uuid
    let newSerialList = []
    stockCardList.forEach((v, i) => {
        if (i != idx && v.get('cardUuid')==cardUuid && v.get('serialList')) {
            v.get('serialList').map(item => {
                serialUuidList.push(item.get('serialUuid'))
            })
        }
    })
    serialMultipleList.forEach(v => {
        const serialUuid = v['serialUuid']
        if (!serialUuidList.includes(serialUuid)) {
            newSerialList.push(v)
        }
    })

    return newSerialList
}


@connect(state => state)
export default
class RouterStock extends React.Component {
    state = {
        isAll: true,
        visible: false,
        categoryValue: 'ALL',
        assistVisible: false,//是否显示属性选择
    }

    componentDidMount() {
        thirdParty.setTitle({title: '存货明细'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })

        sessionStorage.setItem('routerPage', 'routerStock')
    }

	render () {
		const { dispatch, history, homeState, editRunningState } = this.props
		const { isAll, visible, categoryValue, assistVisible } = this.state

        const isOpenedWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理

        const views = editRunningState.get('views')
        const idx = views.get('idx')
        const insertOrModify = views.get('insertOrModify')
        const isModify = insertOrModify === 'modify' ? true : false

        const oriTemp = editRunningState.get('oriTemp')
        const categoryType = oriTemp.get('categoryType')
        const oriUuid = oriTemp.get('oriUuid')
        const oriState = oriTemp.get('oriState')
		const stockCardList = oriTemp.get('stockCardList')//选择的存货卡片
        let stockRange = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'stockRange'])
        stockRange = stockRange ? stockRange : []
        const pendingStrongList = oriTemp.get('pendingStrongList') ? oriTemp.get('pendingStrongList') : fromJS([])

        const stockList = editRunningState.get('stockList')//所有存货卡片列表
        const commonCardList = editRunningState.get('commonCardList').toJS()//按类别查询的存货卡片列表
        const stockCategoryList = editRunningState.get('stockCategoryList')//卡片类别列表
        const cardAllList = editRunningState.get('cardAllList')
        const batchList = cardAllList.get('batchList').toJS()//批次列表
        const serialMultipleList = cardAllList.get('serialList').toJS()//所有的序列号列表

        const warehouseList = oriState == 'STATE_CHYE_TYDJ' ? editRunningState.get('warehouseListTydj') : editRunningState.get('warehouseList')//仓库卡片列表

        let categoryList = [{uuid: 'ALL', name: '全部', childList: []}]//存货类别列表
        let stockListArr = isAll ? stockList.toJS() : commonCardList
        let chosenPickerOnOk = null//选择卡片时的回调
        let onChange = null//选择存货类别的回调
        let component = null
        let canInsertCard = false//能否新增存货卡片
        let cardSize = stockCardList.size
        let assistClassificationList = []//卡片属性列表
        let oriAssistList = [] //当前选中的属性
        let openSerial = false //卡片是否开启序列号

        switch (categoryType) {
            case 'LB_YYSR':
            case 'LB_YYZC': {
                stockCategoryList.map(v => {
                    if (stockRange.includes(v.get('uuid'))) {
                        categoryList.push(v.toJS())
                    }
                })
                stockListArr.map(v => { v['name'] = v['key'] })
                canInsertCard = true
                chosenPickerOnOk = (dataType, value) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx))
                onChange = (value) => dispatch(editRunningActions.getStockListByCategory(value))

                const beCarryover = oriTemp.get('beCarryover')//货物结转成本
                const cardDisabled = (isModify && beCarryover) ? true : false
                const cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                openSerial = cardData.getIn(['financialInfo', 'openSerial'])

                component = <StockCom
                    idx={idx}
                    cardData={cardData}
                    dispatch={dispatch}
                    oriState={oriState}
                    cardDisabled={cardDisabled}
                    stockCardList={stockCardList}
                    stockListArr={stockListArr}
                    warehouseList={warehouseList}
                    isOpenedWarehouse={isOpenedWarehouse}
                    onClick={()=> {
                        if (cardDisabled) { return }
                        this.setState({ visible: true })
                    }}
                    assistClick={() => {
                        if (cardDisabled) { return }
                        this.setState({assistVisible: true})
                    }}
                    batchList={batchList}
                    serialMultipleList={filterSerialList(cardData.get('cardUuid'), serialMultipleList, stockCardList, idx)}
                    isModify={isModify}
                    oriUuid={oriUuid}
                />
                break
            }
            case 'LB_CHDB': {
                const stockCardUuidList = stockCardList.map(v => v.get('cardUuid'))
                categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
                stockCategoryList.map(v => {
                    categoryList.push(v.toJS())
                })
                stockListArr.map(v => {
                    v['name'] = v['key']
                })

                const onOk = (dataType, value, idx) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, 'CHDB'))
                onChange = (value) => dispatch(editRunningActions.getStockListByCategory(value))
                chosenPickerOnOk = (dataType, value, idx) => {
                    onOk('card', value, idx)
                    dispatch(editRunningActions.getChdbPrice(idx, value, 'stockCardList'))
                }

                const cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                const warehouseCardList = oriTemp.get('warehouseCardList')
                const warehouseOne = warehouseCardList.get(0) ? warehouseCardList.get(0) : fromJS({})
                const warehouseCardUuid = warehouseOne.get('cardUuid')
                assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                openSerial = cardData.getIn(['financialInfo', 'openSerial'])

                component = <Chdb
                    idx={idx}
                    cardData={cardData}
                    dispatch={dispatch}
                    warehouseCardUuid={warehouseCardUuid}
                    onClick={()=> {this.setState({ visible: true })}}
                    stockListArr={stockListArr}
                    assistClick={() => {this.setState({assistVisible: true})}}
                    batchList={batchList}
                    serialMultipleList={filterSerialList(cardData.get('cardUuid'), serialMultipleList, stockCardList, idx)}
                    isModify={isModify}
                    oriUuid={oriUuid}
                />

                break
            }
            case 'LB_JZCB': {
                const stockCardUuidList = stockCardList.map(v => v.get('cardUuid'))
                const isJz = oriState=='STATE_YYSR_ZJ' ? true : false//是否是直接结转
                categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
                stockCategoryList.map(v => {
                    categoryList.push(v.toJS())
                })
                if (isModify && !isJz) {
                    categoryList = [{key: 'ALL', label: '全部', top: true, childList: []}]
                }
                stockListArr.map(v => {
                    v['name'] = v['key']
                    v['uuid'] = v['cardUuid']
                    if (['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState) && stockCardUuidList.includes(v['cardUuid'])) {
                        v['disabled'] = true
                    }
                })

                onChange = (value) => dispatch(editRunningActions.getCostStockByCategory(value.key, value['top'], 'commonCardJzcbList'))
                chosenPickerOnOk = (dataType, value, idx) => {
                    dispatch(editRunningActions.changeYysrStockCard('card', value, idx, 'JZCB'))
                    // if (!isModify && oriState != 'STATE_YYSR_ZJ') {
                    //     dispatch(editRunningActions.getJzcbList(true))
                    //     dispatch(editRunningActions.getJzcbCategoryList())
                    //     if (isOpenedWarehouse) {
                    //         dispatch(editRunningActions.getJzcbWarehouseList())
                    //     }
                    // }
                    if (oriState == 'STATE_YYSR_ZJ') {
                        dispatch(editRunningActions.getJzcbListPrice(idx, value))
                    }
                    if (isModify) {//筛选单据
                        dispatch(editRunningActions.filterJzcbList())
                    }
                }

                const cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                if (isJz) {
                    assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                    assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                    oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                    openSerial = cardData.getIn(['financialInfo', 'openSerial'])
                }

                component = <Jzcb
                    idx={idx}
                    cardData={cardData}
                    dispatch={dispatch}
                    oriState={oriState}
                    stockList={stockList}
                    warehouseList={warehouseList}
                    pendingStrongList={pendingStrongList}
                    isOpenedWarehouse={isOpenedWarehouse}
                    onClick={()=> {this.setState({ visible: true })}}
                    assistClick={() => {this.setState({assistVisible: true})}}
                    batchList={batchList}
                    serialMultipleList={filterSerialList(cardData.get('cardUuid'), serialMultipleList, stockCardList, idx)}
                    isModify={isModify}
                    oriUuid={oriUuid}
                />

                break
            }
            case 'LB_CHTRXM': {
                categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
                stockCategoryList.map(v => {
                    categoryList.push(v.toJS())
                })

                stockListArr.map(v => {
                    v['name'] = v['key']
                })

                onChange = (value) => dispatch(editRunningActions.getStockListByCategory(value))
                chosenPickerOnOk = (dataType, value, idx) => {
                    dispatch(editRunningActions.changeYysrStockCard('card', value, idx, 'CHTRXM'))
                    dispatch(editRunningActions.getChzzListPrice(idx, value))
                }

                const cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                openSerial = cardData.getIn(['financialInfo', 'openSerial'])

                component = <Chtrxm
                    idx={idx}
                    cardData={cardData}
                    dispatch={dispatch}
                    stockList={stockList}
                    warehouseList={warehouseList}
                    isOpenedWarehouse={isOpenedWarehouse}
                    onClick={()=> {this.setState({ visible: true })}}
                    assistClick={() => {this.setState({assistVisible: true})}}
                    batchList={batchList}
                    serialMultipleList={filterSerialList(cardData.get('cardUuid'), serialMultipleList, stockCardList, idx)}
                    isModify={isModify}
                    oriUuid={oriUuid}
                />

                break
            }
            case 'LB_CHZZ': {
                canInsertCard = true
                if (oriState=='STATE_CHZZ_ZZCX') {
                    categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
                    stockCategoryList.map(v => { categoryList.push(v.toJS()) })

                    const cardType = views.get('cardType')
                    const stockCardOtherList = oriTemp.get('stockCardOtherList')//成品明细
                    const stockCardUuidList = stockCardList.map(v => v.get('cardUuid'))
                    const stockCardOtherUuidList = stockCardOtherList.map(v => v.get('cardUuid'))

                    stockListArr.map(v => {
                        v['name'] = v['key']
                        if (cardType=='stockCardList' && stockCardOtherUuidList.includes(v['uuid'])) {
                            v['disabled'] = true
                        }
                        if (cardType=='stockCardOtherList' && stockCardUuidList.includes(v['uuid'])) {
                            v['disabled'] = true
                        }
                    })

                    onChange = (value) => dispatch(editRunningActions.getStockListByCategory(value))
                    chosenPickerOnOk = (dataType, value, idx) => {
                        dispatch(editRunningActions.changeYysrStockCard('card', value, idx, 'CHZZ', cardType))
                        dispatch(editRunningActions.getChzzListPrice(idx, value, cardType))
                    }

                    let cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                    if (cardType=='stockCardOtherList') {
                        cardData = stockCardOtherList.get(idx) ? stockCardOtherList.get(idx) : fromJS({})
                        cardSize = stockCardOtherList.size
                    }
                    assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                    assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                    oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                    openSerial = cardData.getIn(['financialInfo', 'openSerial'])

                    component = <Chzz
                        idx={idx}
                        cardData={cardData}
                        cardType={cardType}
                        dispatch={dispatch}
                        stockList={stockList}
                        warehouseList={warehouseList}
                        isOpenedWarehouse={isOpenedWarehouse}
                        onClick={()=> {this.setState({ visible: true })}}
                        assistClick={() => {this.setState({assistVisible: true})}}
                        batchList={batchList}
                        serialMultipleList={filterSerialList(cardData.get('cardUuid'), serialMultipleList, cardType=='stockCardList' ? stockCardList : stockCardOtherList, idx)}
                        isModify={isModify}
                        oriUuid={oriUuid}
                    />
                }

                if (oriState=='STATE_CHZZ_ZZD') {
                    categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
                    stockCategoryList.map(v => { categoryList.push(v.toJS()) })

                    onChange = (value) => dispatch(editRunningActions.chzzAssemblyList(value))
                    chosenPickerOnOk = (dataType, value, idx) => {
                        dispatch(editRunningActions.changeYysrStockCard('card', value, idx, 'CHZZ_ZZD'))
                    }

                    const cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                    const assemblyList = cardAllList.get('assemblyList').toJS()
                    const commonAssemblyList = cardAllList.get('commonAssemblyList').toJS()
                    stockListArr = isAll ? assemblyList : commonAssemblyList

                    assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                    assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                    oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                    openSerial = cardData.getIn(['financialInfo', 'openSerial'])

                    component = <ChzzZzd
                        idx={idx}
                        isModify={isModify}
                        cardData={cardData}
                        dispatch={dispatch}
                        stockList={stockList}
                        commonCardList={commonCardList}
                        stockCategoryList={stockCategoryList}
                        assemblyList={assemblyList}
                        warehouseList={warehouseList}
                        isOpenedWarehouse={isOpenedWarehouse}
                        onClick={()=> {this.setState({ visible: true })}}
                        assistClick={() => {this.setState({assistVisible: true})}}
                        batchList={batchList}
                        serialMultipleList={serialMultipleList}
                        oriUuid={oriUuid}
                    />
                }

                break
            }

            case 'LB_CHYE': {
                const warehouseCardList = oriTemp.get('warehouseCardList')
                const stockCardUuidList = stockCardList.map(v => v.get('cardUuid'))
                categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
                stockCategoryList.map(v => {
                    categoryList.push(v.toJS())
                })

                stockListArr.map(v => { v['name'] = v['key'] })

                onChange = (value) => dispatch(editRunningActions.getStockListByCategory(value))
                chosenPickerOnOk = (dataType, value, idx) => {
                    dispatch(editRunningActions.changeYysrStockCard('card', value, idx, 'CHYE'))
                    if (oriState!='STATE_CHYE_CH') {
                        dispatch(editRunningActions.getChyePrice(value, idx, 'stock'))
                    }
                }

                const cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                openSerial = cardData.getIn(['financialInfo', 'openSerial'])

                component = <Chye
                    idx={idx}
                    cardData={cardData}
                    dispatch={dispatch}
                    oriState={oriState}
                    stockList={stockList}
                    warehouseList={warehouseList}
                    isOpenedWarehouse={isOpenedWarehouse}
                    onClick={()=> {this.setState({ visible: true })}}
                    assistClick={() => {this.setState({assistVisible: true})}}
                    batchList={batchList}
                    serialMultipleList={filterSerialList(cardData.get('cardUuid'), serialMultipleList, stockCardList, idx)}
                    isModify={isModify}
                    oriUuid={oriUuid}
                />                        

                break
            }
            case 'LB_XMJZ': {
                categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
                stockCategoryList.map(v => { categoryList.push(v.toJS()) })
                canInsertCard = true

                stockListArr.map(v => {
                    v['name'] = v['key']
                })

                onChange = (value) => dispatch(editRunningActions.getStockListByCategory(value))
                chosenPickerOnOk = (dataType, value, idx) => {
                    dispatch(editRunningActions.changeYysrStockCard('card', value, idx, 'XMJZ'))
                    dispatch(editRunningActions.getChzzListPrice(idx, value))
                }

                const cardData = stockCardList.get(idx) ? stockCardList.get(idx) : fromJS({})
                assistClassificationList = cardData.getIn(['financialInfo', 'assistClassificationList'])
                assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                oriAssistList= cardData.get('assistList') ? cardData.get('assistList').toJS(): []
                openSerial = cardData.getIn(['financialInfo', 'openSerial'])

                component = <Xmjz
                    idx={idx}
                    cardData={cardData}
                    dispatch={dispatch}
                    stockList={stockList}
                    warehouseList={warehouseList}
                    isOpenedWarehouse={isOpenedWarehouse}
                    onClick={()=> {this.setState({ visible: true })}}
                    assistClick={() => {this.setState({assistVisible: true})}}
                    batchList={batchList}
                    serialMultipleList={filterSerialList(cardData.get('cardUuid'), serialMultipleList, stockCardList, idx)}
                    isModify={isModify}
                    oriUuid={oriUuid}
                />

                break
            }
            default: null
        }

        loop(categoryList)
        const preIdx = idx - 1
		const nextIdx = idx + 1

		return(
			<Container className="edit-running">
                <ChosenPicker
                    visible={visible}
                    type='card'
                    title='请选择存货'
                    icon={{
                            type: 'inventory-add',
                            onClick: () => {
                                if (!canInsertCard) { return }
                                dispatch(editRunningConfigActions.beforeAddInventoryCardFromEditRunning(stockRange, history))
                            }
                        }}
                    district={categoryList}
                    cardList={stockListArr}
                    value={categoryValue}
                    onChange={(value) => {
                        this.setState({categoryValue: value.key})
                        if (value.key=='ALL') {
                            return this.setState({isAll: true})
                        }
                        this.setState({isAll: false})
                        onChange(value)
                    }}
                    onOk={value => {
                        if (value.length) {
                            chosenPickerOnOk('card', value, idx)
                        }
                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                    <span></span>
                </ChosenPicker>

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll">
					{ component }
				</ScrollView>

                <AssistSelect
                    assistVisible={assistVisible}
                    assistClassificationList={assistClassificationList}
                    oriAssistList={oriAssistList}
                    onOk={(assistList) => {
                        let cardType='stockCardList'
                        if (oriState=='STATE_CHZZ_ZZCX') {
                            cardType = views.get('cardType')
                        }
                        dispatch(editRunningActions.changeYysrStockCard('assistList', fromJS(assistList), idx, undefined, cardType))
                        if (openSerial) {
                            dispatch(editRunningActions.changeYysrStockCard('quantity', '', idx, undefined, cardType))
                            dispatch(editRunningActions.changeYysrStockCard('serialList', fromJS([]), idx, undefined, cardType))
                        }
                        this.setState({assistVisible: false})
                    }}
                    addClick={(data) => {
                        let cardType='stockCardList'
                        if (oriState=='STATE_CHZZ_ZZCX') {
                            cardType = views.get('cardType')
                        }
                        dispatch(editRunningActions.addInventoryAssist(data, cardType, oriState))
                        this.setState({categoryValue: 'ALL', isAll: true})
                    }}
                    onCancel={()=> { this.setState({assistVisible: false}) }}
                />

				<ButtonGroup>
                    <Button
                        disabled={preIdx <= -1 ? true : false}
                        onClick={() => {
                            dispatch(editRunningActions.changeLrlsData(['views', 'idx'], preIdx))
                        }}
                    >
						<Icon type="arrow-right" style={{transform: 'rotate(180deg)'}}/>
                        <span>上一明细</span>
					</Button>
					<Button onClick={() => {history.goBack()}}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>
                    <Button
                        disabled={nextIdx == cardSize ? true : false}
                        onClick={() => dispatch(editRunningActions.changeLrlsData(['views', 'idx'], nextIdx))}
                    >
                        <span>下一明细</span>
						<Icon type="arrow-right"/>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

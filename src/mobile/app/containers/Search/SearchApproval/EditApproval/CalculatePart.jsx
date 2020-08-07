import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'

import { Container, Row, ScrollView, Icon, Single, ButtonGroup, Button, Amount, ChosenPicker, TextListInput, TextareaItem } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
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
const amountProps = {decimalZero: false, decimalPlaces: 4}

@immutableRenderDecorator
export default
	class CalculatePart extends React.Component {

    // static contextTypes = { router: PropTypes.object }    

	constructor(props) {
		super(props)
		this.state = {
            showCardModal: false,
            isAll: true,
            visible: false,
            idx: -1,
            categoryValue: 'ALL',
		}
	}

	render() {

		const {
			dispatch,
            editRunningModalState,
            accountSource,
        } = this.props
        const { isAll, visible, idx, categoryValue } = this.state
        // const { router } = this.context

        const editRunningModalTemp = editRunningModalState.get('editRunningModalTemp')
        const warehouseList = editRunningModalState.get('warehouseSourceCategoryList')  // 可选类别列表
        const categoryData = editRunningModalState.get('categoryData')
        const jrCategoryType = editRunningModalTemp.get('jrCategoryType')
        const jrDate = editRunningModalTemp.get('jrDate')

        // 明细类型可选列表
        const canChoseDetailList = editRunningModalTemp.get('canChoseDetailList')
        let detaileSource = []
        canChoseDetailList.forEach(v => detaileSource.push({
            key: v.get('label'),
            value: v.get('id') + Limit.TREE_JOIN_STR + v.get('label')
        }))

        const jrAbstract = editRunningModalTemp.get('jrAbstract')
        const inputAccount = editRunningModalTemp.get('inputAccount')
        const outputAccount = editRunningModalTemp.get('outputAccount')
        const inputDepot = editRunningModalTemp.get('inputDepot')
        const outputDepot = editRunningModalTemp.get('outputDepot')

        const invetorySourceCategoryList = editRunningModalState.get('invetorySourceCategoryList')  // 可选类别列表
        const invetorySourceCardList = editRunningModalState.get('invetorySourceCardList')  // 可选类别列表
        const stockList = editRunningModalTemp.get('stockList')  // 可选类别列表


        const isOne = stockList.size == 1 ? true : false
        const showSwitch = false

        let categoryList = [{ uuid: 'ALL', name: '全部', childList: [] }]
        invetorySourceCategoryList && invetorySourceCategoryList.map(v => {
            // if (stockRange.includes(v.get('uuid'))) {
                categoryList.push(v.toJS())
            // }
        })
        loop(categoryList)

        let stockListArr = invetorySourceCardList ? invetorySourceCardList.toJS() : []
        stockListArr.map(v => {
            v['cardName'] = v['name']
            v['key'] = `${v['code']} ${v['name']}`
            v['name'] = v['key']
        })


		return (
			<div>
                <Row className='lrls-card'>
                    <div className='lrls-line'>
                        <label>摘要：</label>
                        <TextareaItem
                            name='running-textarea'
                            placeholder='摘要填写'
                            value={jrAbstract}
                            onChange={(value) => {
                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrAbstract', value))
                            }}
                        />
                    </div>
                </Row>

                {
                    jrCategoryType === 'LB_ZZ' ?
                    <Row className='lrls-card'>
                        <Row className='lrls-more-card lrls-margin-top'>
                            <label>转出账户:</label>
                            <Single
                                className='lrls-single'
                                district={accountSource}
                                value={outputAccount && outputAccount.size ? `${outputAccount.get('accountName')}` : ''}
                                onOk={value => {
                                    const valueList = value.value.split(Limit.TREE_JOIN_STR)
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('outputAccount', fromJS({
                                        "accountName": valueList[1],
                                        "accountUuid": valueList[0]
                                    })))
                                }}
                            >
                                <Row className='lrls-category lrls-padding'>
                                    {
                                        outputAccount && outputAccount.size ? <span> {`${outputAccount.get('accountName')}`} </span>
                                            : <span className='lrls-placeholder'>点击选择明细账户</span>
                                    }
                                    {
                                        outputAccount && outputAccount.size ?
                                            <Icon
                                                type="preview"
                                                theme='filled'
                                                style={{ color: '#666' }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('outputAccount', null))
                                                }}
                                            /> :
                                            <Icon type="triangle" style={{ color: '#666' }} />
                                    }
                                </Row>
                            </Single>
                        </Row>
                        <Row className='lrls-more-card lrls-margin-top'>
                            <label>转入账户:</label>
                            <Single
                                className='lrls-single'
                                district={accountSource}
                                value={inputAccount && inputAccount.size ? `${inputAccount.get('accountName')}` : ''}
                                onOk={value => {
                                    const valueList = value.value.split(Limit.TREE_JOIN_STR)
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('inputAccount', fromJS({
                                        "accountName": valueList[1],
                                        "accountUuid": valueList[0]
                                    })))
                                }}
                            >
                                <Row className='lrls-category lrls-padding'>
                                    {
                                        inputAccount && inputAccount.size ? <span> {`${inputAccount.get('accountName')}`} </span>
                                            : <span className='lrls-placeholder'>点击选择明细账户</span>
                                    }
                                    {
                                        inputAccount && inputAccount.size ?
                                            <Icon
                                                type="preview"
                                                theme='filled'
                                                style={{ color: '#666' }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('inputAccount', null))
                                                }}
                                            /> :
                                            <Icon type="triangle" style={{ color: '#666' }} />
                                    }
                                </Row>
                            </Single>
                        </Row>
                    </Row>
                    : null
                }

                {
                    jrCategoryType === 'LB_CHDB' ?
                        <div className='lrls-card'>
                            <div className='lrls-more-card lrls-bottom'>
                                <label>调出仓库:</label>
                                <Single
                                    className='lrls-single'
                                    district={warehouseList.toJS()}
                                    value={outputDepot.get('uuid')}
                                    onOk={value => {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('outputDepot', fromJS(value)))
                                        // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'warehouseCardList', 0, 'cardUuid'], value['uuid']))
                                        // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'warehouseCardList', 0, 'code'], value['code']))
                                        // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'warehouseCardList', 0, 'name'], value['name']))
                                        dispatch(searchApprovalActions.getSearchApprovalChdbPriceAll(jrDate, value['uuid']))
                                    }}
                                >
                                    <Row className='lrls-category lrls-padding'>
                                        {
                                            outputDepot.get('uuid') ? <span> {`${outputDepot.get('code')} ${outputDepot.get('name')}`} </span>
                                            : <span className='lrls-placeholder'>点击选择调出仓库</span>
                                        }
                                        <Icon type="triangle" />
                                    </Row>
                                </Single>
                            </div>
                            <div className='lrls-more-card'>
                                <label>调入仓库:</label>
                                <Single
                                    className='lrls-single'
                                    district={warehouseList.toJS()}
                                    value={inputDepot.get('uuid')}
                                    onOk={value => {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('inputDepot', fromJS(value)))
                                        // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'warehouseCardList', 1, 'cardUuid'], value['uuid']))
                                        // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'warehouseCardList', 1, 'code'], value['code']))
                                        // dispatch(editRunningActions.changeLrlsData(['oriTemp', 'warehouseCardList', 1, 'name'], value['name']))
                                    }}
                                >
                                    <Row className='lrls-category lrls-padding'>
                                        {
                                            inputDepot.get('uuid') ? <span> {`${inputDepot.get('code')} ${inputDepot.get('name')}`} </span>
                                            : <span className='lrls-placeholder'>点击选择调入仓库</span>
                                        }
                                        <Icon type="triangle" />
                                    </Row>
                                </Single>
                            </div>
                        </div>
                    : null
                }
                {
                    jrCategoryType === 'LB_CHDB' ?
                    <div className='lrls-card'>
                        <ChosenPicker
                            visible={visible}
                            type='card'
                            multiSelect={true}
                            title='请选择存货'
                            icon={{
                                type: 'inventory-add',
                                onClick: () => {
                                    // if (stockRange.size) {
                                        dispatch(editRunningConfigActions.beforeAddInventoryCardFromEditRunning([], '', 'searchApproval'))
                                    // } else {
                                    //     thirdParty.toast.info('请选择存货范围')
                                    // }
                                }
                            }}
                            district={categoryList}
                            cardList={stockListArr}
                            value={categoryValue}
                            onChange={(value) => {

                                this.setState({ categoryValue: value.key })
                                if (value.key == 'ALL') {
                                    dispatch(searchApprovalActions.getStockAllCardList([], 'hidecategory', true))
                                    this.setState({ isAll: true })
                                    return
                                }
                                this.setState({ isAll: false })
                                dispatch(searchApprovalActions.getStockSomeCardList(value.key, value.top === true ? 1 : ''))
                            }}
                            onOk={value => {
                                if (value.length) {
                                    dispatch(searchApprovalActions.changeSearchApprovalCommonChargeInvnetory(stockList, value))

                                    dispatch(searchApprovalActions.getSearchApprovalChdbPrice(idx, value))
                                }
                            }}
                            onCancel={()=> { this.setState({visible: false}) }}
                        >
                            <span></span>
                        </ChosenPicker>
                        {
                            stockList.map((v, i) => {
                                const isOpenedQuantity = v.get('isOpenedQuantity')
                                // const cardUuid = v.get('cardUuid')
                                // const isUniformPrice = v.get('isUniformPrice')
                                // const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
                                // const price = v.get('price') ? Number(v.get('price')) : 0
                                // const amount = v.get('amount') ? Number(v.get('amount')) : 0

                                const cardUuid = v.get('stockUuid')
                                // const warehouseCardUuid = v.get('depotUuid')
                                const quantity = v.get('number') ? Number(v.get('number')) : 0
                                const price = v.get('unitPrice') ? Number(v.get('unitPrice')) : 0
                                const amount = v.get('amount') ? Number(v.get('amount')) : 0
                                

                                return (
                                    <div key={i} className='lrls-bottom-line lrls-card-bottom'>
                                        <div className='lrls-more-card lrls-placeholder lrls-card-bottom'>
                                            <span>存货明细({i+1})</span>
                                            <span
                                                className='lrls-blue'
                                                style={{display: isOne ? 'none' : ''}}
                                                onClick={() => {
                                                    dispatch(searchApprovalActions.deleteSearchApprovalStock(stockList, i))
                                                }}
                                            >
                                                删除
                                            </span>
                                        </div>
                                        <div className='lrls-more-card' onClick={() => {
                                            // dispatch(editRunningActions.changeLrlsData(['views', 'idx'], i))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('', 'currentEditInvetoryIndex', i))
                                            dispatch(push('/searchapproval/hidegategorystockcomedit'))
                                        }}>
                                            <div className='lrls-single'>
                                                <Row className='lrls-more-card lrls-card-bottom'>
                                                    <div className='lrls-single overElli lrls-padding-right'>
                                                        <span>存货:</span>
                                                        <span className={cardUuid ? '' : 'lrls-placeholder'}>
                                                            { cardUuid ? `${v.get('stockCode')} ${v.get('stockName')}` : ' 未选择' }
                                                        </span>
                                                    </div>
                                                </Row>
                                                <Row className='lrls-more-card lrls-card-bottom'>
                                                    <div style={{display: isOpenedQuantity ? '' : 'none'}}
                                                    className='lrls-padding-right lrls-one-third'
                                                    >
                                                        <span>数量:</span>
                                                        <Amount {...amountProps}>{quantity}</Amount>
                                                        <span>{ v.get('unitUuid') ? v.get('unitName') : null }</span>
                                                    </div>
                                                    <div style={{display: isOpenedQuantity ? '' : 'none'}}
                                                    className='lrls-single overElli lrls-padding-right'
                                                    >
                                                        <span>单价:</span>
                                                        <Amount {...amountProps}>{price}</Amount>
                                                    </div>
                                                    <div className='lrls-padding-right lrls-one-third'>
                                                        <span>金额:</span>
                                                        <Amount>{amount}</Amount>
                                                </div>
                                            </Row>
                                            </div>
                                            <Icon type="arrow-right"/>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className='lrls-more-card' style={{fontWeight: 'bold'}}>
                            <div></div>
                            <div className='lrls-blue'
                                onClick={() => {
                                    this.setState({ visible: true, idx: stockList.size, cardType: 'stockCardList' })
                                }}
                            >
                                +添加存货明细
                            </div>
                        </div>
                    </div>
                    : null
                }
			</div>
		)
	}
}

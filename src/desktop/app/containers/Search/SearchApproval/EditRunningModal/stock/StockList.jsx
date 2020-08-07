import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'

import { Select, Divider, Button, Modal,Tooltip, message } from 'antd'
import XfnSelect from 'app/components/XfnSelect'
import { Icon } from 'app/components'
import { numberCalculate, formatMoney,formatFour, numberFourTest } from 'app/utils'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { XfInput } from 'app/components'

import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
class StockList extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
            warehouseModal:false,
            warehouseCards:{
                warehouseCardUuid:'',
                warehouseCardCode:'',
                warehouseCardName:''
            },
            showModal:false,
            showInventoryModal: false,
		}
	}

    render() {

        const {
            dispatch,
            stockCardList,
            stockList,
            warehouseList,
            stockRange,
            categoryTypeObj,
            enableWarehouse,
            openQuantity,
            stockTitleName,
            oriState,
            oriDate,
            stockTemplate,
            sectionTemp,
            isCardUuid,
            assemblyNumber, //组装单数量
            needHidePrice, //多单位选择单位前不默认填入金额
            selectStockFun,//选择存货调用函数
            deleteStockFun,//删除存货调用函数
            needTooltip,
            changeTotalAmount,
            warehouseUuid,//存货调拨调出仓库Uuid
            noPrice,
            notFoundContent,
            showAddCardModal
        } = this.props
        // const { showCardModal, warehouseModal, warehouseCards, showInventoryModal } = this.state

        const cardUuidName = isCardUuid ? 'cardUuid' : 'uuid'
        const cardNameString = oriState === 'STATE_CHZZ_ZZD' ? (stockTitleName === '物料' ? 'materialUuid': 'productUuid') : 'cardUuid'

        const saleOrPurchase = {
            acBusinessIncome: 'sale',
            acBusinessExpense: 'purchase'
        }
        let NegativeAllowed = false
        if(oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK'){
            NegativeAllowed = true
        }

        const type = stockTitleName === '物料' || stockTitleName === '存货' ? 'notFinish' : 'finish'

        // amount: 458
            // depotCode: null
            // depotName: null
            // depotUuid: null
            // isOpenedQuantity: null
            // number: 0
            // stockCode: "0023"
            // stockName: "存货卡片11"
            // stockUuid: "639508105759031296"
            // unitName: null
            // unitPrice: null
            // unitUuid: null

        return (
            <div>
                {
                    stockCardList.map((v,i) =>{
                        const curItem = stockList.find(w => w.get(cardUuidName) === v.get('stockUuid')) || fromJS([])
                        const mergeOpenQuantity = oriState === 'STATE_CHDB' ? new Boolean(v.get('isOpenQuantity')) : openQuantity

                        let className = ''
                        if (enableWarehouse && mergeOpenQuantity) {
                            if(noPrice){
                                className = 'inventory-content-area-warehouse-no-price'
                            }else{
                                className = 'inventory-content-area-warehouse'
                            }
                        } else if (enableWarehouse && !mergeOpenQuantity) {
                            className = 'inventory-content-area-warehouse-no-open'
                        } else if (!enableWarehouse && mergeOpenQuantity) {
                            className = 'inventory-content-area'
                        } else {
                            className = 'inventory-content-area-no-open'
                        }


                        return (
                            <Tooltip
                                    title={
                                        needTooltip ?
                                        (stockList.find(w => w.get(cardUuidName) === v.get(cardNameString)) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false) ?
                                        <div>
                                            <p>仓库数量：{v.get('referenceQuantity') ? formatFour(v.get('referenceQuantity')) : 0}</p>
                                            {
                                                // Number(v.get('referencePrice')) > 0 ?
                                                    oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS' ?
                                                        (<p>参考单价：{v.get('unitName') ? `${formatFour(v.get('referencePrice'))}元 / ${v.get('unitName')}` : formatFour(v.get('referencePrice')) }</p>) :
                                                        (
                                                            <p>
                                                                {
                                                                    v.get('isUniformPrice') && oriState === 'STATE_CHDB' ? '统一' : '参考'}单价：
                                                                    {curItem.getIn(['unit','name']) ? `${formatFour(v.get('referencePrice'))}元 / ${curItem.getIn(['unit','name'])}` : formatFour(v.get('referencePrice'))
                                                                }
                                                            </p>
                                                        )
                                                // : null
                                            }
                                        </div> : '' : ''
                                    }
                                    placement="right"
                                >
                                    <div key={i} className={className}>
                                        <span>
                                            {
                                                <XfnSelect
                                                    combobox
                                                    showSearch
                                                    placeholder={`请选择${stockTitleName}`}
                                                    value={v.get('stockCode') ?`${ v.get('stockCode')?v.get('stockCode'):''} ${v.get('stockName') ? v.get('stockName'):''}`:undefined}
                                                    notFoundContent={notFoundContent ? <span><Icon type="info-circle" theme="filled" style={{color:'#1890ff'}}/> {notFoundContent}</span> : undefined}
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{ margin: '4px 0'}} />
                                                                <div
                                                                    style={{ padding: '8px', cursor: 'pointer' }}
                                                                    onMouseDown={() => {
                                                                        dispatch(configCallbackActions.beforeRunningAddInventoryCard(showAddCardModal))
                                                                    }}
                                                                >
                                                                    <Icon type="plus" /> 新增存货
                                                                </div>
                                                        </div>
                                                    )}
                                                    onChange={(value,options) => {
                                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                                        const stockUuid = valueList[0]
                                                        const stockCode = valueList[1]
                                                        const stockName = valueList[2]
                                                        const isOpenedQuantity = valueList[3] === 'true' ? true : false
                                                        const isUniformPrice = valueList[4] === 'true' ? true : false
                                                        const amount = v.get('amount')
                                                        const depotUuid = v.get('depotUuid')
                                                        const depotCode = v.get('depotCode')
                                                        const depotName = v.get('depotName')

                                                        const obj = {
                                                            stockUuid,
                                                            stockName,
                                                            stockCode,
                                                            amount,
                                                            isOpenedQuantity,
                                                            isUniformPrice,
                                                            depotUuid,
                                                            depotCode,
                                                            depotName
                                                        }

                                                        // if (isOpenedQuantity === 'true' && options.props.unit && !options.props.unit.get('unitList').size ) {
                                                        //     dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                        //         ...obj,
                                                        //         // unitPrice:options.props.priceList.getIn([0,'defaultPrice']),
                                                        //         unitUuid:options.props.unit.get('uuid'),
                                                        //         unitName:options.props.unit.get('name')
                                                        //     })))

                                                        // } else {
                                                        //     dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                        //         ...obj
                                                        //     })))
                                                        // }


                                                        if (options.props.priceList && options.props.priceList.size) {
                                                            let unitUuid = '', unitName = ''
                                                            if (options.props.unit.get('uuid') === options.props.priceList.getIn([0,'unitUuid'])) {
                                                                unitName = options.props.unit.get('name')
                                                                unitUuid = options.props.unit.get('uuid')
                                                            } else {
                                                                options.props.unit.get('unitList').map(v => {
                                                                    if (v.get('uuid') === options.props.priceList.getIn([0,'unitUuid'])) {
                                                                        unitName = v.get('name')
                                                                        unitUuid = v.get('uuid')
                                                                    }
                                                                })
                                                            }
                                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                                ...obj,
                                                                unitPrice:options.props.priceList.getIn([0,'defaultPrice']),
                                                                unitUuid:unitUuid,
                                                                unitName:unitName
                                                            })))
                                                        } else {
                                                            if (options.props.unit && !options.props.unit.get('unitList').size) {
                                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                                    ...obj,
                                                                    unitUuid:options.props.unit.get('uuid'),
                                                                    unitName:options.props.unit.get('name')
                                                                })))
                                                            } else {
                                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                                    ...obj
                                                                })))
                                                            }
                                                        }
                                                        

                                                        let noNeedPrice = false,moreUnit = false
                                                        // if (needHidePrice) {
                                                        //     noNeedPrice = true
                                                        //     moreUnit = oriState !== 'STATE_CHYE_CH' ? (!(isOpenedQuantity === 'true' && options.props.unit && !options.props.unit.get('unitList').size) ) : true
                                                        // }
                                                        selectStockFun && selectStockFun(stockUuid,i)


                                                        if (oriState !== 'STATE_YYSR_XS' && oriState !== 'STATE_YYSR_TS') {
                                                            dispatch(searchApprovalActions.getApprovalStockBuildUpPrice(oriDate, [{cardUuid:stockUuid, storeUuid: oriState === 'STATE_CHDB' ? warehouseUuid : depotUuid, noNeedPrice,moreUnit}],i,sectionTemp,type))
                                                        }
                                                    }}
                                                    >
                                                    {
                                                        stockList.map((v, i) => {
                                                            return (
                                                                <Option
                                                                    key={v.get(cardUuidName)} value={`${v.get(cardUuidName)}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${v.get('isUniformPrice')}`}
                                                                    unit={v.get('unit')}
                                                                >
                                                                    {`${v.get('code')} ${v.get('name')}`}
                                                                </Option>
                                                            )
                                                        })
                                                    }
                                                </XfnSelect>
                                            }

                                        </span>
                                        {
                                            // enableWarehouse?
                                            // <span className='warehouse-select'>
                                            //     <XfnSelect
                                            //         placeholder='请选择'
                                            //         combobox
                                            //         showSearch
                                            //         value={v.get('depotName') ?`${v.get('depotCode') ? v.get('depotCode'):''} ${v.get('depotName') ? v.get('depotName') : ''}`:undefined}
                                            //         dropdownRender={menu => (
                                            //             <div>
                                            //                 {menu}
                                            //             </div>
                                            //         )}
                                            //         onChange={value => {
                                            //             const valueList = value.split(Limit.TREE_JOIN_STR)
                                            //             const cardUuid = valueList[0]
                                            //             const code = valueList[1]
                                            //             const name = valueList[2]
                                            //             const amount = v.get('amount')
                                            //             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'warehouseCardUuid'], cardUuid))
                                            //             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'warehouseCardCode'], code))
                                            //             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'warehouseCardName'], name))
                                            //             let noNeedPrice = false,moreUnit = false
                                            //             if(needHidePrice){
                                            //                 noNeedPrice = true
                                            //                 moreUnit = oriState !== 'STATE_CHYE_CH' ?  (!(v.get('isOpenedQuantity') === 'true' && !v.getIn(['unit','unitList']).size)) : true
                                            //             }

                                            //             // if(insertOrModify === 'insert' || (insertOrModify === 'modify' && oriStockTemplate.indexOf(`${v.get('cardUuid')}+${cardUuid}`) === -1)){
                                            //                 v.get('stockUuid') && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [{cardUuid:v.get('stockUuid'), storeUuid:cardUuid, noNeedPrice,moreUnit}],i,sectionTemp,type))
                                            //             // }else{
                                            //             //     oriStockTemplate && oriStockTemplate.map(item => {
                                            //             //         if(item.get('cardUuid') === cardUuid){
                                            //             //             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp,['stockCardList',i],item))
                                            //             //         }
                                            //             //     })
                                            //             // }
                                            //         }}
                                            //         >
                                            //         {
                                            //             warehouseList.map((v, i) => {
                                            //                 return (
                                            //                     <Option
                                            //                         key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                            //                     >
                                            //                         {`${v.get('code')} ${v.get('name')}`}
                                            //                     </Option>
                                            //                 )
                                            //             })
                                            //         }
                                            //     </XfnSelect>
                                            // </span>
                                            // :''
                                        }
                                        {
                                            mergeOpenQuantity?
                                            <span>
                                                {
                                                    (stockList.find(w => w.get(cardUuidName) === v.get(cardNameString)) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                                    oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS' ?
                                                    <span>{Number(v.get('number')) ? formatFour(Number(v.get('number'))) : 0}</span>:
                                                    <XfInput
                                                        mode="number"
                                                        tipTit="数量"
                                                        negativeAllowed={NegativeAllowed}
                                                        placeholder='输入数量'
                                                        value={v.get('number')}
                                                        onChange={(e) => {
                                                            // numberFourTest(e, (value) => {
                                                                let value = e.target.value
                                                                if(oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK'){
                                                                    // if(numberCalculate(value,v.get('amount'),4,'multiply') < 0 ){
                                                                    //     message.info('金额数量必须同正或同负')
                                                                    // }else{
                                                                    //     dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'number'], value))
                                                                    //     if(!noPrice){
                                                                    //         if (v.get('unitPrice') > 0) {
                                                                    //             const amount = numberCalculate(value,v.get('unitPrice'),4,'multiply')
                                                                    //             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], amount))

                                                                    //         }
                                                                    //     }
                                                                    // }
                                                                } else {
                                                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'number'], value))

                                                                    if(!noPrice){
                                                                        if (v.get('unitPrice') > 0) {
                                                                            const amount = numberCalculate(value,v.get('unitPrice'),4,'multiply')
                                                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], amount))

                                                                        }
                                                                    }
                                                                }


                                                            // },NegativeAllowed)
                                                        }}
                                                    />:''
                                                }

                                                    {
                                                        (stockList.find(w => w.get(cardUuidName) === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                                        (() => {
                                                            return(
                                                                oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS'  ?
                                                                <span style={{display: 'flex',alignItems:'center',paddingLeft: '5px'}}>{oriState !== 'STATE_CHDB' ? (v.get('unitName') ? ` ${v.get('unitName') ? v.get('unitName') : ''}`:'') : v.getIn(['unit','name'])}</span> :
                                                                <Select
                                                                    placeholder='单位'
                                                                    style={{marginLeft:'8px',alignSelf:'flex-end'}}
                                                                    dropdownClassName='auto-width'
                                                                    value={v.get('unitName') && v.get('unitUuid') ?`${v.get('unitCode') ? v.get('unitCode'):''} ${v.get('unitName') ? v.get('unitName') : ''}`:undefined}
                                                                    onChange={(value) => {
                                                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                                                        const uuid = valueList[0]
                                                                        const name = valueList[1]
                                                                        const basicUnitQuantity = JSON.parse(valueList[2]) ? JSON.parse(valueList[2]) : 1
                                                                        const oldBasicUnitQuantity = v.get('basicUnitQuantity') ? v.get('basicUnitQuantity') : 1
                                                                        const gap = basicUnitQuantity/oldBasicUnitQuantity

                                                                        const price = v.get('unitPrice') ? numberCalculate(v.get('unitPrice'),gap,4,'multiply',4) : numberCalculate(v.get('referencePrice'),gap,4,'multiply',4)
                                                                        const amount = numberCalculate(v.get('number'),price,4,'multiply')

                                                                        dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitUuid'], uuid))
                                                                        dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitName'], name))

                                                                        if (!noPrice) {
                                                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'basicUnitQuantity'], basicUnitQuantity))
                                                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], amount))
                                                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], price))
                                                                            v.get('stockUuid') && dispatch(searchApprovalActions.getApprovalStockBuildUpPrice(oriDate, [{cardUuid:v.get('stockUuid'), storeUuid:oriState === 'STATE_CHDB' ? warehouseUuid : v.get('warehouseCardUuid')}],i,sectionTemp,type))
                                                                        }
                                                                    }}
                                                                >
                                                                    {
                                                                        curItem.getIn(['unit','uuid'])?
                                                                        <Option key={curItem.getIn(['unit','uuid'])} value={
                                                                            `${curItem.getIn(['unit','uuid'])}${Limit.TREE_JOIN_STR}${curItem.getIn(['unit','name'])}${Limit.TREE_JOIN_STR}1`
                                                                        }>
                                                                            {curItem.getIn(['unit','name'])}
                                                                        </Option>:''
                                                                    }

                                                                    {
                                                                        (curItem.getIn(['unit','unitList']) || []).map(v =>
                                                                            <Option key={v.get('uuid')} value={
                                                                                `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('basicUnitQuantity')}`
                                                                            }>
                                                                                {v.get('name')}
                                                                            </Option>
                                                                        )
                                                                    }
                                                                </Select>
                                                            )
                                                        })():''
                                                    }
                                            </span>
                                            :''
                                        }
                                        {
                                            mergeOpenQuantity && !noPrice?
                                            <span>
                                                {
                                                    (stockList.find(w => w.get(cardUuidName) === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                                    // oriState === 'STATE_CHDB' && v.get('isUniformPrice') ?
                                                    // <span>{Number(v.get('price')) ?formatFour(Number(v.get('price'))) : ''}</span>:
                                                    <XfInput
                                                        mode="number"
                                                        tipTit="单价"
                                                        placeholder='请输入单价'
                                                        value={v.get('unitPrice')}
                                                        onChange={(e) => {
                                                            let value = e.target.value
                                                            // numberFourTest(e, (value) => {
                                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], value))
                                                                const amount = numberCalculate(value, v.get('number'),2,'multiply')
                                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], amount))
                                                            // })
                                                        }}
                                                    />:''
                                                }
                                            </span>:''
                                        }

                                        <span>
                                              
                                                <XfInput
                                                    mode="amount"
                                                    negativeAllowed={NegativeAllowed}
                                                    placeholder='请输入金额'
                                                    value={v.get('amount')}
                                                    onChange={(e) => {
                                                        // numberTest(e, (value) => {
                                                        let value = e.target.value   
                                                            if (oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK') {
                                                                if (numberCalculate(value,v.get('number'),4,'multiply') < 0 ) {
                                                                    message.info('金额数量必须同正或同负')
                                                                } else {
                                                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], value))
                                                                    if (v.get('number') > 0 && !noPrice) {
                                                                        const price = ((value || 0) / v.get('number')).toFixed(4)
                                                                        dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], price))
                                                                    }
                                                                }
                                                            } else {
                                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], value))
                                                                if (v.get('number') > 0 && !noPrice) {
                                                                    const price = ((value || 0) / v.get('number')).toFixed(4)
                                                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], price))
                                                                }
                                                            }

                                                        // },NegativeAllowed)
                                                    }}
                                                />

                                        </span>
                                        <span>

                                        {
                                            stockCardList.size > 1 && oriState !== 'STATE_CHZZ_ZZD'?
                                                <XfIcon
                                                    type="bigDel"
                                                    theme="outlined"
                                                    onClick={() => {
                                                        // dispatch(editCalculateActions.deleteStockList(stockCardList, i, 'delete',sectionTemp,stockTemplate))
                                                        // dispatch(searchApprovalActions.deleteSearchApprovalStock(stockCardList, i, taxRate))
                                                        dispatch(searchApprovalActions.deleteSearchApprovalStock(stockCardList, i))
                                                        // deleteStockFun && deleteStockFun(i)
                                                    }}
                                                />
                                             : ''
                                        }
                                        </span>
                                    </div>
                            </Tooltip>
                        )
                    })
                }
            </div>
        )
    }
}

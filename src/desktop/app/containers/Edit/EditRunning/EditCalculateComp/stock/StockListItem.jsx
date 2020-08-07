import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS ,fromJS } from 'immutable'

import { Select, Divider, Icon, Button, Modal,Tooltip, message, Radio } from 'antd'
import Input from 'app/components/Input'
import { XfnSelect, XfInput } from 'app/components'
import { numberCalculate, formatMoney,formatFour, numberFourTest } from 'app/utils'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import {  numberTest } from '../component/numberTest'
import SerialModal  from '../../SerialModal'
import CommonAssist  from '../stockAssistFile/CommonAssist'
import AdjustWayModal  from '../stockAssistFile/AdjustWayModal'
import InventorySerialModal from 'app/containers/Config/Inventory/SerialModal.jsx'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
class StockListItem extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
            showSerial: false,
            showEditSerial: false,
            showAdjustWayModal: false,
            curStockItem:[],
            curStockIndex: -1,
            adjustWay:''
		}
	}

    render() {

        const {
            dispatch,
            stockCardList,
            stockList,
            warehouseList,
            enableWarehouse,
            openQuantity,
            stockTitleName,
            oriState,
            oriDate,
            oriUuid,
            stockTemplate,
            sectionTemp,
            needHidePrice, //多单位选择单位前不默认填入金额
            selectStockFun,//选择存货调用函数
            deleteStockFun,//删除存货调用函数
            needTooltip,
            warehouseUuid,//存货调拨调出仓库Uuid
            noPrice,
            notFoundContent,
            showAddCardModal,
            insertOrModify,

            v,
            i,
            cardUuidName,
            curItem,
            className,
            type,
            mergeOpenQuantity,
            inOrOut,
            assistList,
            cardNameString,
            NegativeAllowed,
            propsSerialList,
            serialList,
            selectedList,
            amountOnKeyDown,


        } = this.props
        const { showSerial, showEditSerial, showAdjustWayModal, curStockItem, curStockIndex, adjustWay } = this.state

        let isClearSerialList = false
        if(insertOrModify === 'modify'){
            isClearSerialList = true
        }else if(oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK'|| oriState === 'STATE_YYSR_ZJ'){
            isClearSerialList = adjustWay === 'add' ? false : true
        }else if((oriState === 'STATE_CHZZ_ZZCX' && stockTitleName ==='成品') || oriState === 'STATE_XMJZ_JZRK' || oriState === 'STATE_XMJZ_XMJQ' || oriState === 'STATE_XMJZ_QRSRCB'){
            isClearSerialList = false
        }else{
            isClearSerialList = true
        }
        return (
            <Tooltip
                    title={
                        needTooltip ?
                        (stockList.find(w => w.get(cardUuidName) === v.get('cardUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false) ?
                        <div>
                            <p>仓库数量：{v.get('referenceQuantity') ? formatFour(v.get('referenceQuantity')) : 0}</p>
                            {
                                // Number(v.get('referencePrice')) > 0 ?
                                    oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS' ?
                                        (<p>参考单价：{v.get('unitName') ? `${formatFour(v.get('referencePrice'))}元 / ${v.get('unitName')}` : formatFour(v.get('referencePrice')) }</p>) :
                                        (
                                            oriState === 'STATE_CHZZ_ZZD' ?
                                                curItem.getIn(['unitList',0,'name']) ? `${formatFour(v.get('referencePrice'))}元 / ${curItem.getIn(['unitList',0,'name'])}` : formatFour(v.get('referencePrice')) :
                                                (
                                                    <p>
                                                        {
                                                            v.get('isUniformPrice') && oriState === 'STATE_CHDB' ? '统一' : '参考'}单价：
                                                            {curItem.getIn(['unit','name']) ? `${formatFour(v.get('referencePrice'))}元 / ${curItem.getIn(['unit','name'])}` : formatFour(v.get('referencePrice'))
                                                        }
                                                    </p>
                                                )
                                        )

                                // : null
                            }
                        </div> : '' : ''
                    }
                    placement="right"
                >
                    <div key={i} className={className}>
                        <span className="stock-serial-number" style={{lineHeight: '27px'}}>
                            ({i+1})
                        </span>

                        <CommonAssist
                            item={v}
                            index={i}
                            oriDate={oriDate}
                            stockList={stockList}
                            dispatch={dispatch}

                            stockTitleName={stockTitleName}
                            notFoundContent={notFoundContent}
                            stockTemplate={stockTemplate}
                            sectionTemp={sectionTemp}
                            needHidePrice={needHidePrice}
                            selectStockFun={selectStockFun}
                            oriState={oriState}
                            warehouseUuid={warehouseUuid}
                            cardUuidName={cardUuidName}
                            type={type}
                            isClearSerialList={isClearSerialList}
                            noPrice={noPrice}
                            showModalFun={showAddCardModal}

                        />
                        {
                            enableWarehouse?
                            <span className='warehouse-select'>
                                <XfnSelect
                                    placeholder='请选择'
                                    combobox
                                    showSearch
                                    value={v.get('warehouseCardName') && v.get('warehouseCardUuid')  ?`${v.get('warehouseCardCode') ? v.get('warehouseCardCode'):''} ${v.get('warehouseCardName') ? v.get('warehouseCardName') : ''}`:undefined}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                        </div>
                                    )}
                                    onChange={value => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const cardUuid = valueList[0]
                                        const code = valueList[1]
                                        const name = valueList[2]
                                        const amount = v.get('amount')
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'warehouseCardUuid'], cardUuid))
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'warehouseCardCode'], code))
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'warehouseCardName'], name))
                                        let noNeedPrice = false,moreUnit = false
                                        if(needHidePrice){
                                            noNeedPrice = true
                                            moreUnit = oriState !== 'STATE_CHYE_CH' ?  (!(v.get('isOpenedQuantity') === 'true' && !v.getIn(['unit','unitList']).size)) : true
                                        }

                                        // if(insertOrModify === 'insert' || (insertOrModify === 'modify' && oriStockTemplate.indexOf(`${v.get('cardUuid')}+${cardUuid}`) === -1)){
                                            v.get('cardUuid') && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
                                                {
                                                    cardUuid:v.get('cardUuid'),
                                                    storeUuid:cardUuid,
                                                    assistList: v.get('assistList'),
                                                    batchUuid: v.get('batchUuid'),
                                                    noNeedPrice,
                                                    moreUnit
                                                }
                                            ],i,sectionTemp,type))
                                        // }else{
                                        //     oriStockTemplate && oriStockTemplate.map(item => {
                                        //         if(item.get('cardUuid') === cardUuid){
                                        //             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp,['stockCardList',i],item))
                                        //         }
                                        //     })
                                        // }
                                    }}
                                    >
                                    {
                                        warehouseList.map((v, i) => {
                                            return (
                                                <Option
                                                    key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                                >
                                                    {`${v.get('code')} ${v.get('name')}`}
                                                </Option>
                                            )
                                        })
                                    }
                                </XfnSelect>
                            </span>
                            :''
                        }
                        {
                            mergeOpenQuantity?
                            <span>
                                {
                                    v.getIn(['financialInfo','openSerial'])?
                                    <span
                                        onClick={() => {
                                            this.setState({
                                                curStockIndex: i,
                                            })
                                            if(oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK' || oriState === 'STATE_YYSR_ZJ'){
                                                this.setState({
                                                    showAdjustWayModal:true,
                                                    curStockItem: v.toJS(),
                                                    curStockIndex: i,
                                                })
                                            }else if((oriState === 'STATE_CHZZ_ZZCX' && stockTitleName ==='成品') || oriState === 'STATE_XMJZ_JZRK' || oriState === 'STATE_XMJZ_XMJQ' || oriState === 'STATE_XMJZ_QRSRCB'){

                                                if (insertOrModify === 'modify' && !v.get('isModify')) {
                                                    dispatch(innerCalculateActions.getSerialList(v,i,inOrOut,(data) => {
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'serialList'], fromJS(data)))
                                                        this.setState({ showEditSerial:true})
                                                    }))
                                                }else{
                                                    this.setState({ showEditSerial:true})
                                                }
                                                // this.setState({showSerial:true}) //测试用
                                            }else{
                                                if (enableWarehouse && !v.get('warehouseCardUuid')) {
                                                    message.info('请先填写仓库')
                                                    return
                                                } else if (v.getIn(['financialInfo','openAssist']) && (assistList.some(v => !v.get('propertyName')) || v.getIn(['financialInfo','assistClassificationList']).size !== assistList.size)) {
                                                    message.info('请先填写辅助属性')
                                                    return
                                                } else if (v.getIn(['financialInfo','openBatch']) && !v.get('batchUuid')) {
                                                    message.info('请先填写批次')
                                                    return
                                                }
                                                if (insertOrModify === 'modify' && !v.get('isModify')) {
                                                    dispatch(innerCalculateActions.getSerialList(v,i,inOrOut,(data) => {
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'serialList'], fromJS(data)))
                                                        this.setState({showSerial:true})
                                                    }))
                                                } else {
                                                    this.setState({showSerial:true})
                                                }

                                            }

                                        }}
                                        className={v.getIn(['financialInfo','openSerial'])?'serial-count':''}
                                        >
                                        {Number(v.get('quantity')) ? formatFour(Number(v.get('quantity'))) : '点击输入'}
                                        <XfIcon type='edit-pen'/>
                                    </span> :
                                    (
                                        (stockList.find(w => w.get(cardUuidName) === v.get(cardNameString)) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                        oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS' ?
                                            <span>{Number(v.get('quantity')) ? formatFour(Number(v.get('quantity'))) : 0}</span>:
                                            <XfInput
                                                mode="number"
                                                tipTit="数量"
                                                negativeAllowed={NegativeAllowed}
                                                placeholder='输入数量'
                                                value={v.get('quantity')}
                                                onChange={(e) => {
                                                    let value = e.target.value
                                                    if(oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK' || oriState === 'STATE_YYSR_ZJ'){
                                                        if(numberCalculate(value,v.get('amount'),4,'multiply') < 0 ){
                                                            message.info('金额数量必须同正或同负')
                                                        }else{
                                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'quantity'], value))
                                                            if(!noPrice){
                                                                if (v.get('price') > 0) {
                                                                    const amount = numberCalculate(value,v.get('price'),4,'multiply')
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], amount))

                                                                }
                                                            }
                                                        }
                                                    }else{
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'quantity'], value))
                                                        if(!noPrice){
                                                            if (v.get('price') > 0) {
                                                                const amount = numberCalculate(value,v.get('price'),4,'multiply')
                                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], amount))

                                                            }
                                                        }
                                                    }
                                                }}
                                            />:''
                                    )
                                }
                                {
                                        (stockList.find(w => w.get(cardUuidName) === v.get(cardNameString)) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                        (() => {
                                            // const curItem = stockList.find(w => w.get(cardUuidName) === v.get('cardUuid')) || fromJS([])
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

                                                        const price = v.get('price') ? numberCalculate(v.get('price'),gap,4,'multiply',4) : numberCalculate(v.get('referencePrice'),gap,4,'multiply',4)
                                                        const amount = numberCalculate(v.get('quantity'),price,4,'multiply')

                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'unitUuid'], uuid))
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'unitName'], name))

                                                        if(!noPrice){
                                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'basicUnitQuantity'], basicUnitQuantity))
                                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], amount))
                                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'price'], price))
                                                            v.get('cardUuid') && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
                                                                {
                                                                    cardUuid:v.get('cardUuid'),
                                                                    storeUuid:oriState === 'STATE_CHDB' ? warehouseUuid : v.get('warehouseCardUuid'),
                                                                    assistList: v.get('assistList'),
                                                                    batchUuid: v.get('batchUuid'),
                                                                }
                                                            ],i,sectionTemp,type))
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
                                    {
                                        showSerial && curStockIndex === i ?
                                        <SerialModal
                                            visible={true}
                                            dispatch={dispatch}
                                            oriUuid={oriUuid}
                                            serialList={propsSerialList}
                                            curSerialList={serialList.toJS()}
                                            item={oriState === 'STATE_CHDB' ? fromJS({...(v.toJS()),warehouseCardUuid: warehouseUuid}) : v}
                                            onClose={()=>{this.setState({showSerial: false})}}
                                            selectedList={selectedList}
                                            onOK={(curSerialList)=>{
                                                const list = curSerialList.filter(v => v.serialNumber)
                                                const quantity = (oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK') ? -list.length  : list.length
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'serialList'],fromJS(list) ))
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'quantity'],quantity ))
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'isModify'],true ))
                                                if(!noPrice){
                                                    if (v.get('price') > 0) {
                                                        const amount = numberCalculate(quantity,v.get('price'),4,'multiply')
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], amount))

                                                    }
                                                }
                                            }}
                                        /> : ''
                                    }
                                    {
                                        showEditSerial  && curStockIndex === i  ?
                                        <InventorySerialModal
                                            visible={true}
                                            dispatch={dispatch}
                                            serialList={serialList}
                                            item={v}
                                            onClose={()=>{this.setState({showEditSerial: false})}}
                                            onOk={curSerialList => {
                                                const list = curSerialList.filter(v => v.serialNumber)
                                                const quantity = oriState === 'STATE_YYSR_ZJ' ? -list.length  : list.length
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'serialList'],fromJS(list) ))
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'quantity'],quantity))
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'isModify'],true ))
                                                if(!noPrice){
                                                    if (v.get('price') > 0) {
                                                        const amount = numberCalculate(list.length,v.get('price'),4,'multiply')
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], amount))

                                                    }
                                                }
                                            }}
                                        /> : ''
                                    }
                            </span>
                            : (oriState === 'STATE_CHDB' ? <span></span> : '')
                        }
                        {
                            mergeOpenQuantity && !noPrice?
                            <span>
                                {
                                    (stockList.find(w => w.get(cardUuidName) === v.get(cardNameString)) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                    // oriState === 'STATE_CHDB' && v.get('isUniformPrice') ?
                                    // <span>{Number(v.get('price')) ?formatFour(Number(v.get('price'))) : ''}</span>:
                                    <XfInput
                                        mode="number"
                                        tipTit="单价"
                                        placeholder='请输入单价'
                                        value={v.get('price')}
                                        onChange={(e) => {
                                            // numberFourTest(e, (value) => {
                                                let value = e.target.value
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'price'], value))
                                                // if (v.get('quantity') > 0) {
                                                    const amount = numberCalculate(value, v.get('quantity'),2,'multiply')
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], amount))
                                                    // dispatch(editRunningActions.autoCalculateStockAmount())
                                                    // taxRate && dispatch(editRunningActions.changeAccountTaxRate())

                                                // }
                                            // })
                                        }}
                                    />:''
                                }
                            </span>:(oriState === 'STATE_CHDB' ? <span></span> : '')
                        }

                        <span>
                            {
                                // oriState === 'STATE_CHDB' && v.get('isUniformPrice') ?
                                // <span>{formatMoney(v.get('amount'))}</span>:
                                <XfInput
                                    mode="amount"
                                    negativeAllowed={NegativeAllowed}
                                    placeholder='请输入金额'
                                    value={v.get('amount')}
                                    onChange={(e) => {
                                        // numberTest(e, (value) => {
                                            let value = e.target.value
                                            if(oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK' || oriState === 'STATE_YYSR_ZJ'){
                                                if(numberCalculate(value,v.get('quantity'),4,'multiply') < 0 ){
                                                    message.info('金额数量必须同正或同负')
                                                }else{
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], value))
                                                    if (v.get('quantity') > 0 && !noPrice) {
                                                        const price = ((value || 0) / v.get('quantity')).toFixed(4)
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'price'], price))
                                                    }
                                                }
                                            }else{
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'amount'], value))
                                                if (v.get('quantity') > 0 && !noPrice) {
                                                    const price = ((value || 0) / v.get('quantity')).toFixed(4)
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,i,'price'], price))
                                                }
                                            }

                                        // },NegativeAllowed)
                                    }}
                                    onKeyDown={(e)=>{
                                        amountOnKeyDown && amountOnKeyDown({
                                            keyCode: e.keyCode,
                                            curAmount: v.get('amount'),
                                            curQuantity: v.get('quantity'),
                                            curIndex: i,
                                        })
                                    }}
                                />
                            }

                        </span>
                        <span>

                        {
                            stockCardList.size > 1 && oriState !== 'STATE_CHZZ_ZZD'?
                                <XfIcon
                                    type="bigDel"
                                    theme="outlined"
                                    onClick={() => {
                                        dispatch(editCalculateActions.deleteStockList(stockCardList, i, 'delete',sectionTemp,stockTemplate))
                                        deleteStockFun && deleteStockFun(i)
                                    }}
                                />
                             : ''
                        }
                        </span>
                    </div>
                    <AdjustWayModal
                        showAdjustWayModal={showAdjustWayModal && curStockIndex === i }
                        clearSerialList={()=>{
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,curStockIndex,'serialList'], fromJS([])))
                        }}
                        onOk={(adjustWay)=>{
                            this.setState({
                                showAdjustWayModal: false,
                                adjustWay: adjustWay
                            })
                            if(adjustWay === 'add'){ //录入序列号
                                if (insertOrModify === 'modify' && !curStockItem.isModify) {
                                    dispatch(innerCalculateActions.getSerialList(fromJS(curStockItem),curStockIndex,'in',(data) => {
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,curStockIndex,'serialList'], fromJS(data)))
                                        this.setState({ showEditSerial:true})
                                    }))
                                }else{
                                    this.setState({ showEditSerial:true})
                                }
                            }else{ //选择序列号
                                const assistList = curStockItem.assistList || []
                                if (enableWarehouse && !curStockItem.warehouseCardUuid) {
                                    message.info('请先填写仓库')
                                    return
                                } else if (curStockItem['financialInfo','openAssist'] && (assistList.some(v => !v.get('propertyName')) || curStockItem['financialInfo','assistClassificationList'].length !== assistList.size)) {
                                    message.info('请先填写辅助属性')
                                    return
                                } else if (curStockItem['financialInfo','openBatch'] && !curStockItem.batchUuid) {
                                    message.info('请先填写批次')
                                    return
                                }else{
                                    if (insertOrModify === 'modify' && !curStockItem.isModify) {
                                        dispatch(innerCalculateActions.getSerialList(fromJS(curStockItem),curStockIndex,'out',(data) => {
                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,curStockIndex,'serialList'], fromJS(data)))
                                            this.setState({showSerial:true})
                                        }))
                                    } else {
                                        this.setState({showSerial:true})
                                    }
                                }

                            }
                        }}
                        onCancel={()=>{
                            this.setState({ showAdjustWayModal: false})
                        }}
                    />
            </Tooltip>
        )
    }
}

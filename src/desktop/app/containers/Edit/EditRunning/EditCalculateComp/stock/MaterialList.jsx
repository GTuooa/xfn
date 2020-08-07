import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import { connect }	from 'react-redux'
import moment from 'moment'

import { Select, Divider, Icon, Button, Modal, message, Tooltip, DatePicker } from 'antd'
import Input from 'app/components/Input'
import XfnSelect from 'app/components/XfnSelect'
import { numberCalculate, formatMoney,formatFour, numberFourTest, DateLib } from 'app/utils'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import {  numberTest } from '../component/numberTest'

import CommonAssist  from '../stockAssistFile/CommonAssist'
import InputFour from 'app/components/InputFour'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
class MaterialList extends React.Component {

    constructor(props) {
		super(props)
		this.state = {

		}
	}
    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.v !== nextprops.v || this.props.item.get('materialList').size !== nextprops.item.get('materialList').size || this.props.allMaterialAmount !== nextprops.allMaterialAmount

    }
    render() {

        const {
            dispatch,
            oriDate,
            stockList,
            warehouseList,
            sectionTemp,
            enableWarehouse,
            openQuantity,
            assistList,
            allMaterialList,
            allMaterialAmount,

            materialItem,
            oldAmount,
            assemblyOldItem,
            oldBasicUnitQuantity,
            insertOrModify,


            item,
            index,
            v,
            i,
            className,
            serialOnClick,



        } = this.props


        return (
            <Tooltip
                    title={JSON.parse(v.get('isOpenQuantity') || false) ? <div><p>仓库数量：{v.get('referenceQuantity') ? formatFour(v.get('referenceQuantity')) : 0}</p>{Number(v.get('referencePrice')) > 0 ? <p>参考单价：{formatFour(v.get('referencePrice'))}</p> : null}</div> : ''}
                    placement="right"
                >
                    <div key={i} className={`${className} material-content-box`}>
                        <span style={{lineHeight: '27px'}}>({i+1})</span>

                        {
                            <CommonAssist
                                item={v}
                                index={index}
                                oriDate={oriDate}
                                materIndex={i}
                                stockList={stockList}
                                dispatch={dispatch}

                                stockTitleName={'存货'}
                                stockTemplate={'material'}
                                sectionTemp={sectionTemp}
                                cardUuidName={'uuid'}
                                isAssemblySheet={true}
                                onSelectChange={(value,options) => {
                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                    const cardUuid = valueList[0]
                                    const code = valueList[1]
                                    const name = valueList[2]
                                    const isOpenQuantity = valueList[3]
                                    const amount = item.get('amount')
                                    const warehouseCardUuid = item.get('warehouseCardUuid')
                                    const warehouseCardCode = item.get('warehouseCardCode')
                                    const warehouseCardName = item.get('warehouseCardName')
                                    const unit = item.get('unit')
                                    const financialInfo = options.props.financialInfo
                                    const obj = {
                                        unit: options.props.unit ? options.props.unit.toJS() : null,
                                        cardUuid,
                                        materialUuid: cardUuid,
                                        name,
                                        code,
                                        amount,
                                        isOpenQuantity,
                                        warehouseCardUuid,
                                        warehouseCardCode,
                                        warehouseCardName,
                                        financialInfo,
                                    }
                                    if (isOpenQuantity === 'true' && options.props.unit ) {
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i], fromJS({
                                            ...obj,
                                            unitUuid:options.props.unit.get('uuid'),
                                            unitName:options.props.unit.get('name')
                                        })))
                                    } else {
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i], fromJS({
                                            ...obj
                                        })))
                                    }
                                    dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
                                        {
                                            cardUuid:cardUuid,
                                            storeUuid:warehouseCardUuid,
                                            assistList: item.get('assistList'),
                                            batchUuid: item.get('batchUuid'),
                                            index,
                                            materialIndex:i
                                        }
                                    ],i,sectionTemp,'assemblySheet'))

                                }}
                            />
                        }

                        {
                            enableWarehouse?
                            <span className='warehouse-select'>
                                <XfnSelect
                                    placeholder='请选择'
                                    combobox
                                    showSearch
                                    value={v.get('warehouseCardUuid') ?`${v.get('warehouseCardCode') ? v.get('warehouseCardCode'):''} ${v.get('warehouseCardName') ? v.get('warehouseCardName') : ''}`:undefined}
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
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'warehouseCardUuid'], cardUuid))
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'warehouseCardCode'], code))
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'warehouseCardName'], name))

                                        v.get('materialUuid') && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
                                            {
                                                cardUuid:v.get('materialUuid'),
                                                storeUuid:cardUuid,
                                                assistList: v.get('assistList'),
                                                batchUuid: v.get('batchUuid'),
                                                index: index,
                                                materialIndex: i
                                            }
                                        ],i,sectionTemp,'assemblySheet'))

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
                            openQuantity?
                            <span>
                                {
                                    v.getIn(['financialInfo','openSerial']) ?
                                    <span
                                        className='chzz-assembly-sheet'
                                        onClick={() => {
                                            if (enableWarehouse && !v.get('warehouseCardUuid')) {
                                                message.info('请先填写仓库')
                                                return
                                            } else if (v.getIn(['financialInfo','openAssist']) && (assistList.some(v => !v.get('propertyName')) || v.getIn(['financialInfo','assistClassificationList']).size !== assistList.size)) {
                                                message.info('请先填写辅助属性')
                                                return
                                            } else if (v.getIn(['financialInfo','openBatch']) && !v.get('batchUuid')) {
                                                message.info('请先填写批次')
                                                return
                                            }else{
                                                if (insertOrModify === 'modify' && !v.get('isModify')) {
                                                    dispatch(innerCalculateActions.getSerialList(v,i,'out',(data) => {
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'serialList'], fromJS(data)))
                                                        serialOnClick(v,i,data)
                                                    }))
                                                } else {
                                                    serialOnClick(v,i)
                                                }

                                            }


                                        }}
                                        style={{color: '#1790ff'}}
                                        // className={''}
                                        >
                                        {Number(v.get('quantity')) ? formatFour(Number(v.get('quantity'))) : '点击输入'}
                                        <XfIcon type='edit-pen'/>
                                    </span> :
                                    (
                                        JSON.parse(v.get('isOpenQuantity') || false)  ?
                                        <InputFour
                                            placeholder='输入数量'
                                            value={v.get('quantity')}
                                            onChange={(e) => {
                                                numberFourTest(e, (value) => {
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'quantity'], value))
                                                    if (v.get('price') > 0) {
                                                        const amount = numberCalculate(value,v.get('price'),2,'multiply')
                                                        // const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
                                                        const newTotalAmount = numberCalculate(allMaterialAmount,amount)

                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'amount'], amount))
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))
                                                    }

                                                })
                                            }}
                                        />:''
                                    )
                                }

                                    {
                                        JSON.parse(v.get('isOpenQuantity') || false) ?
                                        (() => {
                                            const curItem = v
                                            return(
                                                <Select
                                                    placeholder='单位'
                                                    style={{marginLeft:'8px',alignSelf:'flex-end'}}
                                                    dropdownClassName='auto-width'
                                                    value={v.get('unitName') ?`${v.get('unitCode') ? v.get('unitCode'):''} ${v.get('unitName') ? v.get('unitName') : ''}`:undefined}
                                                    onChange={(value) => {
                                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                                        const uuid = valueList[0]
                                                        const name = valueList[1]
                                                        const basicUnitQuantity = JSON.parse(valueList[2]) ? JSON.parse(valueList[2]) : 1
                                                        // const oldBasicUnitQuantity = assemblySheet.getIn([index,'materialList',i,'basicUnitQuantity']) ? assemblySheet.getIn([index,'materialList',i,'basicUnitQuantity']) : 1
                                                        const gap = basicUnitQuantity/oldBasicUnitQuantity

                                                        const price = numberCalculate(v.get('price'),gap,4,'multiply',4)
                                                        const amount = numberCalculate(v.get('quantity'),price,2,'multiply')

                                                        // const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
                                                        const newTotalAmount = numberCalculate(allMaterialAmount,amount)

                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))

                                                        // const materialListItem = assemblySheet.getIn([index,'materialList',i]).toJS()
                                                        const newItem = {
                                                            ...materialItem,
                                                            unitUuid: uuid,
                                                            unitName: name,
                                                            basicUnitQuantity,
                                                            price,
                                                            amount
                                                        }
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i], fromJS(newItem)))


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

                                                    {
                                                        (curItem.get('unitList') || []).map(v =>
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
                            openQuantity?
                            <span>
                                {
                                    JSON.parse(v.get('isOpenQuantity') || false) ?
                                    <InputFour
                                        placeholder='请输入单价'
                                        value={v.get('price')}
                                        onChange={(e) => {
                                            numberFourTest(e, (value) => {
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'price'], value))
                                                if (v.get('quantity') > 0) {
                                                    const amount =((value || 0) * v.get('quantity')).toFixed(2)
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'amount'], amount))
                                                    // const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
                                                    const newTotalAmount = numberCalculate(allMaterialAmount,amount)
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))

                                                    // let assemblySheetItem = assemblyOldItem
                                                    // assemblySheetItem['materialList'][i]['amount'] = amount
                                                    // assemblySheetItem['materialList'][i]['price'] = value
                                                    //
                                                    // const newItem = {
                                                    //     ...assemblySheetItem,
                                                    //     amount: newTotalAmount,
                                                    //     price: numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)
                                                    // }
                                                    //
                                                    // dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index], fromJS(newItem)))

                                                }
                                            })
                                        }}
                                    />:''
                                }
                            </span>:''
                        }

                        <span>
                            {
                                <Input
                                    placeholder='请输入金额'
                                    value={v.get('amount')}
                                    onChange={(e) => {
                                        numberTest(e, (value) => {
                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'amount'], value))
                                            // const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
                                            const newTotalAmount = numberCalculate(allMaterialAmount,value)
                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
                                            if (v.get('quantity') > 0) {
                                                const price = ((value || 0) / v.get('quantity')).toFixed(4)
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'price'], price))
                                            }
                                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))
                                        })
                                    }}
                                />
                            }

                        </span>
                        <span>

                        <XfIcon
                            type='smallAdd'
                            onClick={() => {
                                dispatch(editCalculateActions.changeMaterialList(index, i, item.get('materialList'), 'add'))
                            }}
                        />
                        {
                            item.get('materialList') && item.get('materialList').size > 1 ?
                            <XfIcon
                                type='smallDel'
                                onClick={() => {
                                    dispatch(editCalculateActions.changeMaterialList(index, i, item.get('materialList'), 'delete'))
                                    const curItemAmount = item.getIn(['materialList',i,'amount'])
                                    const curQuantity = item.get('curQuantity')
                                    const productAmount = item.get('amount')
                                    const amount = numberCalculate(productAmount,curItemAmount,2,'subtract')


                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'],amount ))
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'],numberCalculate(amount,curQuantity,2,'divide') ))
                                }}
                            /> : null
                        }

                        </span>

                    </div>
                </Tooltip>
        )
    }
}

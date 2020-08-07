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
import MaterialList  from './MaterialList'
import InputFour from 'app/components/InputFour'
import BatchModal from 'app/containers/Config/Inventory/BatchModal.jsx'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class AssemblySheetList extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
            productFocus:false,
			chooseIndex: -1,
			addBatch: false,
            batchNumber:'',
			batchDate: '',
			expirationDate:'',
			assistModal: false,
			asssistName:'',
			classificationUuid:'',
			assIndex: -1,
			batchModal: false,
            addBatchChange: false,

		}
	}
    closeFocus = e => {
        let t = e.target || e.srcElement, list = [];
        let i = 1
        while(t.parentNode && i < 20) {
            if (t.parentNode.className && typeof t.parentNode.className === 'string' && t.parentNode.className.indexOf(`assembly-are-for-dom`) > -1) {
                // this.setState({focus:true})
                return
            }
            t = t.parentNode
            i++
        }
        this.setState({productFocus:false,addBatch: false,assistModal: false})
    }
    componentDidMount() {
        const body = document.getElementsByTagName("body")[0]
        body.addEventListener('click',this.closeFocus)
    }
    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.item !== nextprops.item ||
                this.props.index !== nextprops.index ||
                this.state !== nextstate


    }
    componentWillUnmount() {
        const body = document.getElementsByTagName("body")[0]
        body.removeEventListener('click',this.closeFocus)
    }


    render() {

        const {
            dispatch,
            stockList,
            warehouseList,
            insertOrModify,
            enableWarehouse,
            openQuantity,
            oriDate,
            sectionTemp,
            assemblySheet,

            allMaterialList,

            item,
            index,
            className,
            assemblyOnclick,
            assemblyNumberOnClick,
            assemblySerialOnclick,
            showModal,
            serialOnClick,
            showEditSerialFun,
        } = this.props

        const {
            productFocus,
            chooseIndex,
            addBatch,

            batchNumber,
            batchDate,
            expirationDate,
            assistModal,
            classificationUuid,
            asssistName,
            assIndex,
            batchModal,
            addBatchChange,
        } = this.state

        let totalAmount = 0
        let cardValue = ''
        const assistList = item.get('assistList') || fromJS([])
        const openBatch = item.getIn(['financialInfo','openBatch'])
        const openAssist = item.getIn(['financialInfo','openAssist'])
        const openShelfLife = item.getIn(['financialInfo','openShelfLife'])
        const assistClassificationList = item.getIn(['financialInfo','assistClassificationList']) || fromJS([])
        const batchItem = (item.get('batchList') || fromJS([])).find(z => z.get('batchUuid') === item.get('batchUuid') || z.get('batch') === item.get('batch')) || fromJS({})
        const batchValue = batchItem.get('batch') || item.get('batch')? `${batchItem.get('batch') || item.get('batch')}${openShelfLife && (batchItem.get('expirationDate') && batchItem.get('expirationDate') !== 'undefined' || item.get('expirationDate') && item.get('expirationDate') !== 'undefined') ?`(${batchItem.get('expirationDate') || item.get('expirationDate')})`:''}`:undefined

        if (openAssist && openBatch) {
            cardValue = `${assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'} | ${item.get('batch')?batchValue:'批次'}`
        } else if (openAssist || openBatch) {
            cardValue =  openAssist ?
            assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'
            :item.get('batch')?batchValue:'批次'
        } else {
            cardValue = item.get('code') ?`${ item.get('code')?item.get('code'):''} ${item.get('name') ? item.get('name'):''}`:undefined
        }

        return (
            <div key={`${item.get('productUuid')}+${index}`}>
                        <section className='product-content '>
                            <div>组装成品({index+1})</div>
                            <div className={className}>
                                <span></span>
                                <span
                                    className='chzz-assembly-sheet-product assembly-are-for-dom'
                                    style={{
                                        overflow:!item.getIn(['financialInfo','openAssist']) && !item.getIn(['financialInfo','openBatch']) || !productFocus || !item.get('code')?'hidden':'visible',
                                        marginLeft: '-30px'
                                    }}
                                 >
                                    <span
                                        onClick={(e)=>{
                                            assemblyOnclick()
                                            dispatch(editCalculateActions.getStockBuildUpAssembly('',1,true,1))
                                        }}
                                    >{`${item.get('code')} ${item.get('name')}`}<XfIcon type='edit-pen'/></span>
                                    {
                                        item.getIn(['financialInfo','openAssist']) || item.getIn(['financialInfo','openBatch'])?
                                        <span
                                            onClick={(e)=>{
                                                this.setState({
                                                    productFocus: true,
                                                    chooseIndex: index,
                                                })
                                            }}
                                        >
                                            {cardValue}
                                        </span> : null
                                    }
                                    {
                                        <div
                                            className='assembly-produce-drop-content'
                                            style={{display:productFocus && chooseIndex == index ?'':'none'}}
                                            onClick={(e)=>{
                                                e.stopPropagation()
                                                addBatchChange && this.setState({addBatch: false,addBatchChange:false})
                                            }}
                                        >
                                            {
                                                openAssist ?
                                                <div style={{display:openAssist?'':'none'}}>
                                                    <span>属性:</span>
                                                    {
                                                        assistClassificationList.map((w,i) =>
                                                            <Select
                                                                key={w.get('uuid')}
                                                                dropdownClassName={`assembly-are-for-dom${i}`}
                                                                value={((assistList || fromJS([])).find(z => z.get('classificationUuid') === w.get('uuid')) || fromJS({})).get('propertyName') || undefined}
                                                                dropdownRender={menu => (
                                                                    <div>
                                                                        {menu}
                                                                        <Divider style={{ margin: '4px 0' }} />
                                                                        <div
                                                                            style={{ padding: '4px 8px', cursor: 'pointer' }}
                                                                            onMouseDown={e => e.preventDefault()}
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    assistModal:true,
                                                                                    classificationUuid:w.get('uuid'),
                                                                                    assIndex: i,
                                                                                })
                                                                            }}
                                                                        >
                                                                            <Icon type="plus" /> 新增
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                onChange={(value) => {
                                                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                                                    const propertyUuid = valueList[0]
                                                                    const propertyName = valueList[1]
                                                                    const size = assistList.size
                                                                    const childIndex = assistList.findIndex(z => z.get('classificationUuid') === w.get('uuid'))
                                                                    if (size === 0) {
                                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'assistList'],fromJS([{
                                                                            classificationUuid:w.get('uuid'),
                                                                            classificationName:w.get('name'),
                                                                            propertyUuid,
                                                                            propertyName
                                                                        }])))
                                                                    } else if (childIndex === -1) {
                                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'assistList',size],fromJS({
                                                                            classificationUuid:w.get('uuid'),
                                                                            classificationName:w.get('name'),
                                                                            propertyUuid,
                                                                            propertyName
                                                                        })))

                                                                    } else {
                                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'assistList',i,'propertyUuid'],propertyUuid))
                                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'assistList',i,'propertyName'],propertyName))
                                                                    }
                                                                }}
                                                            >
                                                                {
                                                                    w.get('propertyList').map(z =>
                                                                        <Option key={z.get('uuid')} value={`${z.get('uuid')}${Limit.TREE_JOIN_STR}${z.get('name')}`}>
                                                                            {z.get('name')}
                                                                        </Option>
                                                                    )
                                                                }
                                                            </Select>
                                                        )
                                                    }
                                                </div>:''
                                            }
                                            {
                                                openBatch ?
                                                <div style={{position: 'relative'}}>
                                                    <span>批次:</span>
                                                    <Fragment>
                                                        <Select
                                                            showSearch
                                                            key={item.get('uuid')}
                                                            dropdownClassName={`assembly-are-for-dom${index}`}
                                                            dropdownRender={menu => (
                                                                <div>
                                                                    {menu}
                                                                    <Divider style={{ margin: '4px 0' }} />
                                                                    <div
                                                                        style={{ padding: '4px 8px', cursor: 'pointer' }}
                                                                        onMouseDown={e => e.preventDefault()}
                                                                        onClick={() => this.setState({batchModal:true})}
                                                                    >
                                                                        <XfIcon type='edit-pen'/>修改批次信息
                                                                    </div>
                                                                </div>
                                                            )}
                                                            showArrow={false}
                                                            placeholder='请选择/新增批次'
                                                            onDropdownVisibleChange={(open)=> {
                                                                open && dispatch(innerCalculateActions.getStockBatchList({
                                                                    inventoryUuid:item.get('uuid'),
                                                                    sectionTemp,
                                                                    stockTemplate: 'assemblySheet',
                                                                    index
                                                                }))
                                                            }}
                                                            value={batchValue}
                                                            onChange={(value,options) => {
                                                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                                                const batchUuid = options.props.batchUuid
                                                                const batch = valueList[0] || ''
                                                                const expirationDate = valueList[1]
                                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'batch'], batch))
                                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'batchUuid'], batchUuid))
                                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'expirationDate'], expirationDate))
                                                            }}
                                                        >
                                                            {
                                                                item.get('batchList') && item.get('batchList').map(w =>
                                                                    <Option
                                                                        key={w.get('batchUuid')}
                                                                        value={`${w.get('batch')}${Limit.TREE_JOIN_STR}${w.get('productionDate')}`}
                                                                        batchUuid={w.get('batchUuid')}
                                                                        >
                                                                        {`${w.get('batch')}${w.get('productionDate') ? `(${ w.get('productionDate')})` : ''}`}
                                                                    </Option>
                                                                )
                                                            }
                                                        </Select>
                                                        {
                                                            <span className='add-button' onClick={e => {
                                                                e.preventDefault()
                                                                this.setState({addBatch:true})
                                                            }}>新增</span>
                                                        }
                                                    </Fragment>
                                                <div className={`ls-batch-select-frame`} style={{display: addBatch ? '' : 'none'}} onClick={(e)=>{e.stopPropagation()}} >
                                                    <div >
                                                        <span><span style={{color:'red'}}>*</span>批次号：</span>
                                                        <Input
                                                            value={batchNumber}
                                                            onChange={e => {
                                                                e.preventDefault()
                                                                const reg =  /^[0-9a-zA-Z]{0,16}$/
                                                                if (reg.test(e.target.value)) {
                                                                    this.setState({batchNumber:e.target.value})
                                                                } else {
                                                                    message.info('批次只支持输入16位以内的数字或字母')
                                                                }
                                                            }}
                                                            placeholder='请输入批次号'

                                                        />
                                                    </div>
                                                    {
                                                        openShelfLife?
                                                        <div>
                                                            <span>截止日期：</span>
                                                            <DatePicker
                                                                placeholder='请选择生产日期'
                                                                allowClear={false}
                                                                size='small'
                                                                value={expirationDate ? moment(expirationDate) : ''}
                                                                onChange={value => {
                                                                    const date = value.format('YYYY-MM-DD')
                                                                    this.setState({expirationDate:date})
                                                                }}
                                                            />
                                                        </div>:''
                                                    }
                                                    {
                                                        openShelfLife ?
                                                        <div>
                                                            <span>生产日期：</span>
                                                            <DatePicker
                                                                placeholder='请选择生产日期'
                                                                allowClear={false}
                                                                size='small'
                                                                value={batchDate ? moment(batchDate) : ''}
                                                                onChange={value => {
                                                                    const date = value.format('YYYY-MM-DD')
                                                                    this.setState({batchDate:date})
                                                                }}
                                                            />
                                                        </div> : ''
                                                    }

                                                    <div>
                                                        <Button onClick={() => this.setState({addBatch:false})}>取消</Button>
                                                        <Button
                                                            type='primary'
                                                            onClick={() => {
                                                                dispatch(editRunningActions.insertBatch(batchNumber,batchDate,expirationDate,item.get('cardUuid'),(json)=>{
                                                                    const batchUuid = json.batchUuid
                                                                    const batch = json.batch
                                                                    const expirationDate = json.expirationDate
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'batch'], batch))
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'batchUuid'], batchUuid))
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'expirationDate'], expirationDate))

                                                                    this.setState({addBatch:false,batchNumber:'',batchDate:'',expirationDate: ''})
                                                                }))
                                                            }}
                                                        >新增</Button>
                                                    </div>
                                                </div>
                                                </div>:''
                                            }
                                        </div>
                                    }

                                </span>
                                {
                                    enableWarehouse?
                                    <span className='warehouse-select'>
                                        <XfnSelect
                                            placeholder='请选择'
                                            combobox
                                            showSearch
                                            value={item.get('warehouseCardUuid') ?`${item.get('warehouseCardCode') ? item.get('warehouseCardCode'):''} ${item.get('warehouseCardName') ? item.get('warehouseCardName') : ''}`:undefined}
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
                                                const amount = item.get('amount')
                                                const assemblySheetItem = assemblySheet.get(index).toJS()
                                                const newItem = {
                                                    ...assemblySheetItem,
                                                    warehouseCardUuid: cardUuid,
                                                    warehouseCardCode: code,
                                                    warehouseCardName: name
                                                }
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index], fromJS(newItem)))

                                            }}
                                            style={{color: '#1790ff'}}
                                            // className={''}
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
                                <span className='chzz-assembly-number'>
                                {
                                        item.getIn(['financialInfo','openSerial']) ?
                                        <span
                                            className='chzz-assembly-sheet'
                                            onClick={() => {
                                                if (insertOrModify === 'modify' && !item.get('isModify')) {
                                                    dispatch(innerCalculateActions.getSerialList(item,index,'in',(data) => {
                                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'serialList'], fromJS(data)))
                                                        assemblySerialOnclick(data)
                                                    }))
                                                }else{
                                                    assemblySerialOnclick()
                                                }

                                            }}
                                            style={{color: '#1790ff'}}
                                            // className={''}
                                            >
                                            {Number(item.get('curQuantity')) ? formatFour(Number(item.get('curQuantity'))) : '点击输入'}
                                            <XfIcon type='edit-pen'/>
                                        </span> :
                                        <span
                                            className='chzz-assembly-sheet'
                                            onClick={()=>{
                                                assemblyNumberOnClick()

                                                dispatch(editCalculateActions.getAssemblyListByProduct([item.get('productUuid')],index))
                                            }}
                                        >{formatFour(item.get('curQuantity'))}<XfIcon type='edit-pen'/>
                                        </span>
                                }
                                    <div>
                                        {item.get('unitName') ?`${item.get('unitCode') ? item.get('unitCode'):''} ${item.get('unitName') ? item.get('unitName') : ''}`:undefined}
                                    </div>
                                </span>

                                <span className='chzz-assembly-price'>
                                    {formatFour(item.get('price'))}
                                </span>
                                <span className='chzz-assembly-amount'>
                                    {formatMoney(item.get('amount'))}
                                </span>
                                <span>
                                {
                                    assemblySheet && assemblySheet.size > 1 ?
                                    <XfIcon
                                        type='smallDel'
                                        onClick={() => {
                                            dispatch(editCalculateActions.deleteStockList(assemblySheet, index, 'delete','StockBuildUp','assemblySheet'))
                                        }}
                                    /> : null
                                }

                                </span>
                            </div>
                            {
                                assistModal?
                                    <Modal
                                        visible
                                        title='新增属性'
                                        className='inventory-are-for-dom'
                                        onCancel={() => this.setState({assistModal:false})}
                                        onOk={() => {
                                            // const index = assistClassificationList.findIndex(z => z.get('uuid') === classificationUuid)
                                            dispatch(innerCalculateActions.insertAssist({
                                                classificationUuid,
                                                name: asssistName,
                                                inventoryUuid: item.get('cardUuid'),
                                                sectionTemp,
                                                isAssembly: true,
                                                isProduct: true,
                                                index,
                                                assIndex
                                            },(data,name) => {
                                                const curAssistItem = data.filter( v => v.name === name)
                                                const size = assistList.size
                                                const childIndex = assistList.findIndex(z => z.get('classificationUuid') === classificationUuid)
                                                const propertyUuid = curAssistItem[0].uuid
                                                const propertyName = curAssistItem[0].name
                                                if (childIndex === -1) {
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'assistList',size],fromJS({
                                                        classificationUuid: classificationUuid,
                                                        propertyUuid,
                                                        propertyName
                                                    })))

                                                } else {
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'assistList',assIndex,'propertyUuid'],propertyUuid))
                                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'assistList',assIndex,'propertyName'],propertyName))
                                                }

                                                this.setState({assistModal:false,asssistName:'',assIndex:-1})
                                            }
                                        ))
                                        }}
                                    >
                                        <div style={{display:'flex'}}
                                            >
                                            <span style={{width:'72px',lineHeight:'28px'}}>属性名称：</span>
                                            <Input
                                                value={asssistName}
                                                onChange={e => {
                                                    e.preventDefault()
                                                    this.setState({asssistName:e.target.value})
                                            }}/>
                                        </div>
                                    </Modal>:''
                            }
                            {
                                batchModal?
                                <BatchModal
                                    className='inventory-are-for-dom'
                                    visible={true}
                                    onClose={() => {
                                        this.setState({batchModal:false})
                                    }}
                                    onOk={(modifyBatch,modifyBatchUuid,modifyBatchDate,modifyExpirationDate) => {
                                        dispatch(innerCalculateActions.modifyBatch({
                                            inventoryUuid: item.get('uuid'),
                                            sectionTemp,
                                            index,
                                            batch: modifyBatch,
                                            batchUuid: modifyBatchUuid,
                                            productionDate: openShelfLife?modifyBatchDate:'',
                                            expirationDate: openShelfLife?modifyExpirationDate:'',
                                            isAssembly: true,
                                            isProduct: true,
                                        },() => {
                                            this.setState({batchModal:false})
                                        }))
                                    }}
                                    saveAndNewForbidden={true}
                                    batchList={item.get('batchList')}
                                    openShelfLife={openShelfLife}
                                />:''
                            }
                        </section>
                        <section className='materialList-content'>
                            <div>物料详情</div>
                            {
                                item.get('materialList') && item.get('materialList').map((v,i) =>{
                                    const curItem = stockList.find(w => w.get('uuid') === v.get('materialUuid')) || fromJS([])
                                    totalAmount = numberCalculate(totalAmount,v.get('amount'))
                                    const assistList = v.get('assistList') || fromJS([])


                                    const materialItem = assemblySheet.getIn([index,'materialList',i]).toJS()
                                    const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
                                    const assemblyOldItem = assemblySheet.get(index).toJS()
                                    const oldBasicUnitQuantity = assemblySheet.getIn([index,'materialList',i,'basicUnitQuantity']) ? assemblySheet.getIn([index,'materialList',i,'basicUnitQuantity']) : 1

                                    const allMaterialAmount = numberCalculate(item.get('amount'),oldAmount,2,'subtract')

                                    return <MaterialList
                                                dispatch={dispatch}
                                                oriDate={oriDate}
                                                stockList={stockList}
                                                warehouseList={warehouseList}
                                                sectionTemp={sectionTemp}
                                                enableWarehouse={enableWarehouse}
                                                openQuantity={openQuantity}
                                                assistList={assistList}
                                                allMaterialList={allMaterialList}
                                                allMaterialAmount={allMaterialAmount}
                                                materialItem={materialItem}
                                                oldAmount={oldAmount}
                                                assemblyOldItem={assemblyOldItem}
                                                oldBasicUnitQuantity={oldBasicUnitQuantity}

                                                item={item}
                                                index={index}
                                                v={v}
                                                i={i}
                                                className={className}
                                                serialOnClick={serialOnClick}
                                                curItem={curItem}
                                    />

                                })
                            }
                        </section>
                    </div>
        )
    }
}

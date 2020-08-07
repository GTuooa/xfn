import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Switch, Checkbox } from 'app/components'

import * as thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class Serial extends React.Component {
    scrollerHeight = 0//滚动容器的高度
    listHeight = 46.6//一条卡片的高度
    listHtml = ''//一条卡片的html
    pageSize = 50

    state={
        batchSortType: true,//批次号正序
        dateSortType: true,//日期倒序
        canUseSortType: true, //启停用
        showCheckBox: false,
        currentPage: 1,
    }

    componentDidMount() {
        thirdParty.setTitle({title: '批次管理'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})

        const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        this.scrollViewHtml = scrollViewHtml
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
    }

    componentDidUpdate () {
        if (!this.listHtml) {
            const listHtml = document.getElementsByClassName('list-html')[0]
            if (listHtml) {
                this.listHtml = listHtml
                this.listHeight = listHtml ? Number(window.getComputedStyle(listHtml).height.replace('px','')) : 50
            }
        }
    }



    render() {
        const { dispatch, history, inventoryConfState } = this.props
        const { batchSortType,  dateSortType, canUseSortType, showCheckBox, currentPage} = this.state

        const isModify = inventoryConfState.getIn(['views','insertOrModify']) == 'modify'
        const usedOpenBatch = inventoryConfState.getIn(['views','usedOpenBatch'])//原卡片是否开启批次

        const inventoryCardTemp = inventoryConfState.get('inventoryCardTemp')
        const inventoryUuid = inventoryCardTemp.get('uuid')
        const openShelfLife = inventoryCardTemp.getIn(['financialInfo', 'openShelfLife'])//开启保质期
        const shelfLife = inventoryCardTemp.getIn(['financialInfo', 'shelfLife'])//保质期天数

        const batch = inventoryConfState.get('batch')
        let allBatchList = isModify && usedOpenBatch  ? batch.get('allBatchList') : inventoryCardTemp.getIn(['financialInfo', 'batchList'])
        allBatchList = allBatchList ? allBatchList : fromJS([])
        const pageCount = Math.ceil(allBatchList.size/this.pageSize)//总共多少页


        return(
            <Container className="inventory-config border-top">
                <div className="batch batch-title">
                    <div className='batch-left' 
                        onClick={() => {
                            if (!isModify) { return }
                            dispatch(inventoryConfAction.getBatchList({inventoryUuid, needPage: false, orderBy: 'BATCH', isAsc: batchSortType}))
                            this.setState({batchSortType: !batchSortType, currentPage: 1,})
                            this.scrollViewHtml.scrollTop = 0
                        }}
                    >
                        批次号{isModify ? <Icon type='sort'/> : null }
                    </div>
                    <div className='batch-right' style={{flex: openShelfLife ? '' : 'none'}}>
                        <span className='item' 
                            onClick={() => {
                            if (!isModify) { return }
                            openShelfLife && dispatch(inventoryConfAction.getBatchList({inventoryUuid, needPage: false, orderBy: 'PRODUCTION_DATE', isAsc: dateSortType}))
                            this.setState({dateSortType: !dateSortType, currentPage: 1})
                            this.scrollViewHtml.scrollTop = 0
                        }}>
                           { openShelfLife ? <span>生产日期{isModify ? <Icon type='sort'/> : null } </span> : null}
                        </span>
                        <span className='item' 
                            onClick={() => {
                            if (!isModify) { return }
                            openShelfLife && dispatch(inventoryConfAction.getBatchList({inventoryUuid, needPage: false, orderBy: 'EXPIRATION_DATE', isAsc: dateSortType}))
                            this.setState({dateSortType: !dateSortType, currentPage: 1})
                            this.scrollViewHtml.scrollTop = 0
                        }}>
                           { openShelfLife ? <span>截止日期{isModify ? <Icon type='sort'/> : null } </span> : null}
                        </span>
                        <span style={{display: isModify ? '' : 'none'}}
                            onClick={() => {
                                dispatch(inventoryConfAction.getBatchList({inventoryUuid, needPage: false, orderBy: 'CAN_USE', isAsc: canUseSortType}))
                                this.setState({canUseSortType: !canUseSortType, currentPage: 1})
                                this.scrollViewHtml.scrollTop = 0
                            }}>
                            启/停用<Icon type='sort'/>
                        </span>
                    </div>
                </div>

                <ScrollView flex='1' 
                    onScroll={(e) => {
                        const scrollY = e.target.scrollTop
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*this.pageSize && currentPage < pageCount) {
                            this.setState({currentPage: currentPage+1})
                        }
                    }}
                >
                        
                    {
                        allBatchList.map((v,i) => {
                            const batch = v.get('batch')
                            const productionDate = v.get('productionDate') ? v.get('productionDate') : ''
                            const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                            const batchUuid = v.get('batchUuid')
                            const canUse = v.get('canUse')
                            const checked = v.get('checked') ? v.get('checked') : false

                            const editClick = () => {
                                let batch = {batchList: allBatchList, openShelfLife, shelfLife, editPage: 'inventoryBatchList'}
                                batch['batchType'] = isModify && usedOpenBatch ? 'MODIFY-MODIFY' : 'INSERT-MODIFY'
                                batch['inventoryUuid'] = inventoryUuid
                                batch['batch'] = v.get('batch')
                                batch['productionDate'] = productionDate
                                batch['expirationDate'] = expirationDate
                                batch['batchUuid'] = batchUuid
                                dispatch(inventoryConfAction.changeData('batch', inventoryConfState.get('batch').merge(fromJS(batch)), true))
                                history.push('/config/inventory/batchSet')
                            }
                            

                            return (
                                <div key={i} className={i==0 ? "batch list-html" : 'batch'}>
                                    <div className='batch-left underline blue overElli' onClick={() => !showCheckBox && editClick() }>
                                        <span className='margin-right' style={{display: showCheckBox ? '' : 'none'}}>
                                            <Checkbox
                                                checked={checked}
                                                onChange={(e)=> {
                                                    e.stopPropagation()
                                                    if (isModify) {
                                                        dispatch(inventoryConfAction.changeData(['batch', 'allBatchList', i, 'checked'], !checked))
                                                    } else {
                                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'batchList', i, 'checked'], !checked))
                                                    }
                                                }}
                                            />
                                        </span>
                                        {batch}
                                    </div>
                                    <div className='batch-right' style={{flex: openShelfLife ? '' : 'none'}}>
                                        <span className='underline blue item'  onClick={() => !showCheckBox && editClick() }>
                                            {openShelfLife ? productionDate : null}
                                        </span>
                                        <span className='underline blue item'  onClick={() => !showCheckBox && editClick() }>
                                            {openShelfLife ? expirationDate : null}
                                        </span>                                    
                                        <span className='noTextSwitch' style={{display: isModify ? '' : 'none'}}>
                                            <Switch
                                                checked={canUse}
                                                onClick={() => {
                                                    dispatch(inventoryConfAction.modifyBatchStatus({inventoryUuid, batchUuid, canUse: !canUse}))
                                                }}
                                            />                            
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </ScrollView>

                <ButtonGroup style={{display:showCheckBox ? 'none' : 'flex'}}>
                    <Button
                        onClick={() => {
                            let batch = {batchList: allBatchList, openShelfLife, shelfLife, editPage: 'inventoryBatchList'}
                            batch['batchType'] = isModify && usedOpenBatch ? 'MODIFY-INSERT' : 'INSERT-INSERT'
                            batch['inventoryUuid'] = inventoryUuid
                            dispatch(inventoryConfAction.changeData('batch', inventoryConfState.get('batch').merge(fromJS(batch)), true))
                            history.push('/config/inventory/batchSet')
                        }}
                    >
                        <Icon type="add-plus"/>
                        <span>新增</span>
                    </Button>
                    <Button
                        onClick={() => this.setState({showCheckBox:true})}
                        >
                        <Icon type="select" />
                        <span>选择</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display:showCheckBox ? 'flex' : 'none'}}>
                    <Button
                        onClick={() => {
                            this.setState({showCheckBox:false})
                        }}
                    >
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button onClick={() => {
                        
                        const deleteList = []
                        allBatchList.map(v => { if (v.get('checked')) { deleteList.push(v.get('batchUuid')) }})
                        if (deleteList.length==0) { return thirdParty.Alert('请选择要删除的批次') }

                        thirdParty.Confirm({
                            message: `确认删除选中的批次号吗？`,
                            title: '提示',
                            buttonLabels: ['取消', '确定'],
                            onSuccess : (result) => {
                                if (result.buttonIndex==1) {
                                    if (isModify) {
                                        dispatch(inventoryConfAction.deleteBatchList({inventoryUuid, deleteList, needPage: false,}))
                                    } else {
                                        const batchList = allBatchList.filter(v => !v.get('checked'))
                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'batchList'], batchList))
                                    }
            
                                    this.setState({currentPage: 1,})
                                    this.scrollViewHtml.scrollTop = 0
                                }
                            },
                            onFail : (err) => {}
                       })

                        
                    }}>
                        <Icon type="select" />
                        <span>删除</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}

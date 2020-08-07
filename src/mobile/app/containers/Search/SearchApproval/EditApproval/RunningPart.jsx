import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Container, Row, ScrollView, Icon, Single, ButtonGroup, Button, ChosenPicker, TextListInput, TextareaItem } from 'app/components'
import { getCategorynameByType, numberTest, receiptList, getSelectJrCategoryList } from 'app/containers/Config/Approval/components/common.js'
// import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'

import CurrentCom from './CurrentCom'
import ProjectCom from './ProjectCom'
import StockCom from './StockCom'
import BillCom from './BillCom'


import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
// import { systemProJectCodeCommon } from 'app/containers/Config/Approval/components/common.js'

const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

@immutableRenderDecorator
export default
	class RunningPart extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
		}
	}

	render() {

		const {
			dispatch,
            editRunningModalState,
            scale,
            payableRate,
            outputRate,
            accountList,
            runningCategory,
            enableWarehouse,
            openQuantity,

            showContact,
            showProject,
            currentbillType,
            accountSource,
            rateOptionList,
        } = this.props
        
        

        const editRunningModalTemp = editRunningModalState.get('editRunningModalTemp')
        const categoryData = editRunningModalState.get('categoryData')
        const jrCategoryType = editRunningModalTemp.get('jrCategoryType')

        
        // 类别是收还是付
        const payOrReceive = jrCategoryType ? (receiptList.indexOf(jrCategoryType) > -1 ? 'RECEIPT' : 'PAYMENT') : ''
        // 是否是存货套件
        const detailType = editRunningModalTemp.get('detailType')
        const isStock = detailType === '销售存货套件' || detailType === '采购存货套件'
        const isDJ = detailType === '预付账款' || detailType === '预收账款'
        
        // 明细类型可选列表
        const canChoseDetailList = editRunningModalTemp.get('canChoseDetailList')
        let detaileSource = []
        canChoseDetailList.forEach(v => detaileSource.push({
            key: v.get('label'),
            value: v.get('id') + Limit.TREE_JOIN_STR + v.get('label')
        }))
        // 账户选泽
        // const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([])
        // let accountSource = []
        // accountSelectList.forEach(v => accountSource.push({
        //     key: v.get('name'),
        //     value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`
        // }))
        // 类别可选
        const propertyCarryover = categoryData.get('propertyCarryover')
        const jrCategoryList = getSelectJrCategoryList(runningCategory, null, true, {jrCategoryType, payOrReceive, isStock, isDJ})
        loop(jrCategoryList)
        // 费用性质可选
        const propertyCostList = categoryData.get('propertyCostList')
        const showType = {
            'GLFY': '管理费用',
            'XSFY': '销售费用',
            'XZ_MANAGE': '管理费用',
            'XZ_SALE': '销售费用',
            'FZSCCB': '辅助生产成本',
            'ZZFY': '制造费用',
            'SCCB': '生产成本',
            'JJFY': '间接费用',
            'JXZY': '机械作业',
            'HTCB': '合同成本',
        }
        const specialProperty = ['FZSCCB', 'ZZFY', 'SCCB', 'HTCB', 'JJFY', 'JXZY']
        let propertyCostListSource = []
        propertyCostList.forEach(v => {
            propertyCostListSource.push({
                value: v,
                key: showType[v]
            })
        })

        // const processTitle = editRunningModalTemp.get('processTitle')
        // const jrDate = editRunningModalTemp.get('jrDate')
        // const jrId = editRunningModalTemp.get('id')
        const jrAmount = editRunningModalTemp.get('jrAmount')
        const categoryName = editRunningModalTemp.get('categoryName')
        const jrAbstract = editRunningModalTemp.get('jrAbstract')
        // const account = editRunningModalTemp.get('account')
        const contactList = editRunningModalTemp.get('contactList')
        const projectList = editRunningModalTemp.get('projectList')
        const stockList = editRunningModalTemp.get('stockList')
        const beContact = editRunningModalTemp.get('beContact')
        const beProject = editRunningModalTemp.get('beProject')
        // const propertyPay = editRunningModalTemp.get('propertyPay')
        const billList = editRunningModalTemp.get('billList')
        const currentTaxRate = billList.getIn([0, 'taxRate'])
        const jrCostType = editRunningModalTemp.get('jrCostType')

        const { categoryTypeObj } = jrCategoryType ? getCategorynameByType(jrCategoryType) : { categoryTypeObj: '' }
        const openProject = categoryData.get('beProject')
        const projectRange = categoryData.get('projectRange')
        const contactsRange = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'contactsRange']) : fromJS([])
        const stockRange = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'stockRange']) : fromJS([])

        const contactSourceCategoryList = editRunningModalState.get('contactSourceCategoryList')  // 可选类别列表
        const contactSourceCardList = editRunningModalState.get('contactSourceCardList')  // 可选类别列表
        const projectSourceCategoryList = editRunningModalState.get('projectSourceCategoryList')  // 可选类别列表
        const projectSourceCardList = editRunningModalState.get('projectSourceCardList')  // 可选类别列表
        const invetorySourceCategoryList = editRunningModalState.get('invetorySourceCategoryList')  // 可选类别列表
        const invetorySourceCardList = editRunningModalState.get('invetorySourceCardList')  // 可选类别列表

        const directionJson = {
            'LB_YYSR': 'debit',
            'LB_YYZC': 'credit',
            'LB_FYZC': 'credit',
            'LB_YYWSR': 'debit',
            'LB_YYWZC': 'credit',
        }
      

		return (
			<div>
                <Row className='lrls-card'>
                    <Row className='lrls-type'>
                        <label>流水类别:</label>
                        <ChosenPicker
                            disabled={false}
                            district={jrCategoryList}
                            onChange={(item) => {
                                if (item) {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCategory(item.uuid, item.categoryType, item.name, editRunningModalTemp))
                                }
                            }}
                            onCancel={() => { }}
                        >
                            <Row>
                                <span >{categoryName ? categoryName : ''}</span>
                                &nbsp;
                                <Icon type="triangle" style={{ color: '#666' }} />
                            </Row>
                        </ChosenPicker>
                    </Row>
                </Row>

                {
                    propertyCostList.size > 1 && !isDJ ?
                        <Row className='lrls-card'>
                            <Row className='lrls-more-card'>
                                <label>费用性质:</label>
                                <Single
                                    className='lrls-single'
                                    district={propertyCostListSource}
                                    value={jrCostType ? showType[jrCostType] : ''}
                                    disabled={specialProperty.indexOf(jrCostType) > -1}
                                    onOk={value => {

                                        const str = {
                                            XZ_MANAGE: 'GLFY',
                                            XZ_SALE: 'XSFY'
                                        }
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', str[value.value]))
                                    }}
                                >
                                    <Row className='lrls-category lrls-padding'>
                                        {
                                            jrCostType ? <span className={specialProperty.indexOf(jrCostType) === -1 ? '' : 'lrls-placeholder'}> {showType[jrCostType]} </span>
                                                : <span className='lrls-placeholder'>点击选择费用性质</span>
                                        }
                                        <Icon type="triangle" style={{ color: '#666' }} />
                                    </Row>
                                </Single>
                            </Row>
                        </Row>
                        : null
                }

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
                    showContact ?
                        <CurrentCom
                            history={history}
                            dispatch={dispatch}
                            beContact={beContact}
                            categoryType={jrCategoryType}
                            contactsRange={contactsRange}
                            currentCardList={contactList}
                            contactSourceCategoryList={contactSourceCategoryList}
                            contactSourceCardList={contactSourceCardList}
                        />
                        : null
                }

                {
                    showProject ?
                        <ProjectCom
                            history={history}
                            dispatch={dispatch}
                            projectList={projectList}
                            projectRange={projectRange}
                            beProject={beProject}
                            propertyCarryover={propertyCarryover}
                            categoryType={jrCategoryType}
                            openProject={openProject}
                            // propertyPay={propertyPay}
                            jrCostType={jrCostType}
                            propertyCostList={propertyCostList}
                            projectSourceCategoryList={projectSourceCategoryList}
                            projectSourceCardList={projectSourceCardList}
                        />
                        : null
                }

                {
                    isStock ?
                        <StockCom
                            dispatch={dispatch}
                            stockList={stockList}
                            stockRange={stockRange}
                            openQuantity={openQuantity}
                            usedStock={true}
                            invetorySourceCategoryList={invetorySourceCategoryList}
                            invetorySourceCardList={invetorySourceCardList}
                            cardDisabled={false}
                            taxRate={currentTaxRate}
                            propertyCarryover={propertyCarryover}
                            isOpenedWarehouse={enableWarehouse}
                            amount={jrAmount}
                        />
                        : null
                }

                {
                    scale == 'isEnable' ? null : <BillCom
                        dispatch={dispatch}
                        categoryType={jrCategoryType}
                        oriState={''}
                        billList={billList}
                        amount={jrAmount}
                        scale={scale}
                        payableRate={payableRate}
                        isModify={true}
                        oriBillType={currentbillType}
                        handleType={''}
                        direction={directionJson[jrCategoryType]}
                        rateOptionList={rateOptionList}
                        isDJ={isDJ}
                    />
                }
			</div>
		)
	}
}

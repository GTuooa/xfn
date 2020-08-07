import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import * as thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'
import { Container, Row, ScrollView, Icon, Single, ButtonGroup, Button, ChosenPicker, XfInput, TextareaItem } from 'app/components'
import { getCategorynameByType, numberTest, receiptList, hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'
import { DateLib } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import { suitTypeList } from 'app/containers/Search/SearchApproval/common/common.js'

import RunningPart from './RunningPart'
import CalculatePart from './CalculatePart'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

// const loop = (data) => {
//     data.forEach(v => {
//         v['key'] = v['uuid']
//         v['label'] = v['name']
//         if (v['childList'].length) {
//             loop(v['childList'])
//         }
//     })
// }

@connect(state => state)
export default
    class EditApproval extends React.Component {

    static displayName = 'EditApproval'

    constructor(props) {
        super(props)
        const editRunningModalTemp = this.props.editRunningModalState.get('editRunningModalTemp')
        const categoryData = this.props.editRunningModalState.get('categoryData')
        const { categoryTypeObj } = editRunningModalTemp.get('jrCategoryType') ? getCategorynameByType(editRunningModalTemp.get('jrCategoryType')) : { categoryTypeObj: '' }

        this.state = {
            showContact: categoryTypeObj && categoryData.getIn([categoryTypeObj, 'contactsManagement']) || editRunningModalTemp.get('beContact'),
            showProject: categoryData.get('beProject') || editRunningModalTemp.get('beProject'),
            currentbillType: editRunningModalTemp.getIn(['billList', 0, 'billType'])
        }
    }

    componentDidMount() {
        thirdParty.setTitle({ title: '调整明细' })
        thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({ show: false })
    }

    componentWillReceiveProps(nextprops) {

        if (this.props.editRunningModalState.getIn(['editRunningModalTemp', 'jrCategoryUuid']) !== nextprops.editRunningModalState.getIn(['editRunningModalTemp', 'jrCategoryUuid'])) {
            const editRunningModalTemp = nextprops.editRunningModalState.get('editRunningModalTemp')
            const categoryData = nextprops.editRunningModalState.get('categoryData')
            const { categoryTypeObj } = editRunningModalTemp.get('jrCategoryType') ? getCategorynameByType(editRunningModalTemp.get('jrCategoryType')) : { categoryTypeObj: '' }

            this.setState({
                showContact: categoryTypeObj && categoryData.getIn([categoryTypeObj, 'contactsManagement']) || editRunningModalTemp.get('beContact'),
                showProject: categoryData.get('beProject') || editRunningModalTemp.get('beProject')
            })
        }
    }

    render() {
        const {
            allState,
            dispatch,
            homeState,
            history,
            editRunningModalState,
        } = this.props

        const { showContact, showProject, currentbillType } = this.state

        const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

        const editRunningModalTemp = editRunningModalState.get('editRunningModalTemp')
        const categoryData = editRunningModalState.get('categoryData')
        const jrCategoryType = editRunningModalTemp.get('jrCategoryType')

        const scale = allState.getIn(['taxRate', 'scale'])
        const payableRate = allState.getIn(['taxRate', 'payableRate'])//小规模默税率
        const outputRate = allState.getIn(['taxRate', 'outputRate'])//一般纳税人默税率
        const rateOptionList = allState.getIn(['taxRate', 'rateOptionList'])//税率列表
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
        const accountList = allState.get('accountList')
        const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([])
        let accountSource = []
        accountSelectList.forEach(v => accountSource.push({
            key: v.get('name'),
            value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`
        }))
        // 类别可选
        const runningCategory = allState.get('runningCategory')
        const jrDate = editRunningModalTemp.get('jrDate')
        const jrId = editRunningModalTemp.get('id')
        const jrAmount = editRunningModalTemp.get('jrAmount')
        const account = editRunningModalTemp.get('account')

        const enableWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).indexOf('WAREHOUSE') > -1
        const openQuantity = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).indexOf('QUANTITY') > -1

        return (
            <Container className="edit-running search-approval">
                <TopDatePicker
                    value={jrDate}
                    callback={value => {
                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrDate', value))
                    }}
                    onChange={value => {
                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrDate', new DateLib(value).valueOf()))
                    }}
                />
                <ScrollView flex='1'>
                    <Row className='lrls-card'>
                        <Row className='lrls-more-card'>
                            <label>明细类型:</label>
                            <Single
                                className='lrls-single'
                                district={detaileSource}
                                value={detailType ? detailType : ''}
                                disabled={suitTypeList.indexOf(detailType) > -1}
                                onOk={value => {
                                    const valueList = value.value.split(Limit.TREE_JOIN_STR)
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('detailId', valueList[0]))
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('detailType', valueList[1]))
                                }}
                            >
                                <Row className='lrls-category lrls-padding'>
                                    {
                                        detailType ? <span> {detailType} </span>
                                            : <span className='lrls-placeholder'>点击选择明细类型</span>
                                    }
                                    <Icon type="triangle" style={{ color: '#666' }} />
                                </Row>
                            </Single>
                        </Row>
                        {
                            isStock || detailType === '存货调拨套件' ? null :
                                <Row className='lrls-more-card lrls-margin-top'>
                                    <label>明细金额:</label>
                                    <XfInput.BorderInputItem
                                        mode="amount"
                                        placeholder='填写金额'
                                        value={jrAmount}
                                        negativeAllowed={jrCategoryType === 'LB_ZZ' || isDJ ? false : true}
                                        onChange={(value) => {
                                            // numberTest(value, (value) => {
                                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrAmount', value))
                                            // }, jrCategoryType === 'LB_YYWSR' || jrCategoryType === 'LB_YYWZC' || jrCategoryType === 'LB_ZZ' ? false : true)
                                            // }, true)
                                        }}
                                    />
                                </Row>
                        }
                        {
                            payOrReceive === 'RECEIPT' ?
                                <Row className='lrls-more-card lrls-margin-top'>
                                    <label>明细账户:</label>
                                    <Single
                                        className='lrls-single'
                                        district={accountSource}
                                        value={account && account.size ? `${account.get('accountName')}` : ''}
                                        onOk={value => {
                                            const valueList = value.value.split(Limit.TREE_JOIN_STR)
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('account', fromJS({
                                                "accountName": valueList[1],
                                                "accountUuid": valueList[0]
                                            })))
                                        }}
                                    >
                                        <Row className='lrls-category lrls-padding'>
                                            {
                                                account && account.size ? <span> {`${account.get('accountName')}`} </span>
                                                    : <span className='lrls-placeholder'>点击选择明细账户</span>
                                            }
                                            {
                                                account && account.size ?
                                                    <Icon
                                                        type="preview"
                                                        theme='filled'
                                                        style={{ color: '#666' }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('account', null))
                                                        }}
                                                    /> :
                                                    <Icon type="triangle" style={{ color: '#666' }} />
                                            }
                                        </Row>
                                    </Single>
                                </Row>
                                : null
                        }
                    </Row>

                    {
                        hideCategoryCanSelect.indexOf(jrCategoryType) > -1 ? 
                        <CalculatePart
                            dispatch={dispatch}
                            editRunningModalState={editRunningModalState}
                            accountSource={accountSource}
                        />
                        :
                        <RunningPart
                            dispatch={dispatch}
                            editRunningModalState={editRunningModalState}
                            scale={scale}
                            payableRate={payableRate}
                            outputRate={outputRate}
                            accountList={accountList}
                            runningCategory={runningCategory}
                            enableWarehouse={enableWarehouse}
                            openQuantity={openQuantity}
                            showProject={showProject}
                            showContact={showContact}
                            currentbillType={currentbillType}
                            accountSource={accountSource}
                            rateOptionList={rateOptionList}
                        />
                    }    
                </ScrollView>
                <Row className="footer">
                    <ButtonGroup style={{ height: 50 }}>
                        <Button onClick={() => {
                            dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, () => { history.goBack() }, 'switch'))
                        }}><Icon type="cancel"></Icon><span>取消</span></Button>
                        <Button disabled={!editLrAccountPermission} onClick={() => {
                            dispatch(searchApprovalActions.modifyApprovalProcessDetailInfo(editRunningModalTemp, () => {
                                dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, () => { history.goBack() }, 'switch'))
                            }))
                        }}><Icon type="save"></Icon><span>保存</span></Button>
                    </ButtonGroup>
                </Row>
            </Container>
        )
    }
}
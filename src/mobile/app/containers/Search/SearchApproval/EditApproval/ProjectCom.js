import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'

import * as thirdParty from 'app/thirdParty'
import { Row, Icon, Single, Switch, ChosenPicker } from 'app/components'
import { systemProJectCodeCommon } from 'app/containers/Config/Approval/components/common.js'

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

//项目组件
export default class ProjectCom extends Component {
    static contextTypes = { router: PropTypes.object }
    state = {
        isAll: true,
        categoryValue: 'ALL',
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.categoryType != nextProps.categoryType) {
            this.setState({ categoryValue: 'ALL', isAll: true, })
        }
    }

    render() {
        const {
            dispatch,
            categoryType,
            beProject,
            projectRange,
            projectList,
            propertyCostList,
            // propertyPay,
            propertyCarryover,
            oriState,
            openProject,
            jrCostType,
            projectSourceCategoryList,
            projectSourceCardList,
        } = this.props

        const { isAll, categoryValue } = this.state
        const { router } = this.context
        
        // showCommon 是否显示项目公共费用 true 显示
        let showCommon = false//是否显示项目公共费用 true 显示
        let canInsert = true//是否允许新增
        let showAssist = false//是否显示辅助生产成本或制造费用 true 显示
        let showSgxm = false//是否显示施工项目下的间接费用或机械作业 true 显示
        let showSwitch = true// 是否显示开关按钮 true 显示
        let disabled = false//项目是够允许修改

        switch (categoryType) {
            case 'LB_YYZC': {
                showAssist = propertyCarryover == 'SX_FW' ? true : false
                showSgxm = propertyCarryover == 'SX_FW' ? true : false
                break
            }
            // case 'LB_JK': {
            //     showCommon = true
            //     showAssist = handleType == 'JR_HANDLE_CHLX' ? true : false
            //     break
            // }
            case 'LB_FYZC': {
                // showCommon = oriState == 'STATE_FY_DJ' ? false : true
                showCommon = true
                showAssist = true
                showSgxm = true
                break
            }
            case 'LB_XCZC': {
                // ({
                //     'SX_GZXJ': () => {
                //         showCommon = true
                //     },
                //     'SX_SHBX': () => {
                //         showCommon = true
                //     },
                //     'SX_ZFGJJ': () => {
                //         showCommon = true
                //     },
                //     'SX_FLF': () => {
                //         showCommon = true
                //     },
                //     'SX_QTXC': () => {
                //         // showCommon = oriState == 'STATE_XC_JT' ? true : false
                //         showCommon = true // 调整的其他薪酬相当于都是计提
                //     }
                // }[propertyPay] || (() => null))()

                showCommon = true
                showAssist = true
                showSgxm = true
                break
            }

            // case 'LB_ZJTX': {
            //     showCommon = true
            //     canInsert = false
            //     showAssist = true
            //     break
            // }
            // case 'LB_JZSY': {
            //     canInsert = false
            //     break
            // }
            // case 'LB_JZCB': {
            //     canInsert = false
            //     break
            // }
            // case 'LB_JXSEZC': {
            //     canInsert = false
            //     break
            // }
            // case 'LB_CHTRXM': {
            //     canInsert = false
            //     showSwitch = false
            //     showAssist = true
            //     break
            // }
            // case 'LB_XMJZ': {
            //     canInsert = false
            //     showSwitch = false
            //     showAssist = false
            //     disabled = isModify ? true : false
            //     if (!showXmjz) {
            //         return null
            //     }
            //     break
            // }

            default: null
        }


        let categoryList = [{uuid: 'ALL', name: '全部', childList: []}]
        projectSourceCategoryList && projectSourceCategoryList.map(v => {
            if (projectRange.includes(v.get('uuid'))) {
                if (['LB_CQZC', 'LB_JZSY'].includes(categoryType) && ['生产项目', '施工项目'].includes(v.get('name'))) {
                    return
                }
                if (['LB_JZCB'].includes(categoryType) && ['生产项目'].includes(v.get('name'))) {
                    return
                }
                categoryList.push(v.toJS())
            }
            if (['LB_CHTRXM', 'LB_XMJZ'].includes(categoryType)) {
                categoryList.push(v.toJS())
            }
        })
        loop(categoryList)

        let cardArr = projectSourceCardList ? projectSourceCardList.toJS() : []
        cardArr.map(v => {
            v['cardName'] = v.name
            // v['key'] = `${v['code']} ${v['name']}`
            v['key'] = `${v['code']} ${v['name']}`
            v['name'] = systemProJectCodeCommon.indexOf(v['code']) > -1 ? v['name'] : `${v['code']} ${v['name']}`
            v['value'] = v['key']
        })

        cardArr = cardArr.filter(v => {
            let shouldReturn = true
            
            if (!showCommon && v['value'].includes('COMNCRD')) {
                shouldReturn = false
            }
            if (!showAssist && (v['value'].includes('ASSIST') || v['value'].includes('MAKE'))) {
                shouldReturn = false
            }
            if (!showSgxm && (v['value'].includes('INDIRECT') || v['value'].includes('MECHANICAL'))) {
                shouldReturn = false
            }
            if (['LB_CQZC', 'LB_JZSY'].includes(categoryType) && ['XZ_PRODUCE', 'XZ_CONSTRUCTION'].includes(v['projectProperty'])) {
                shouldReturn = false
            }
            if (['LB_JZCB'].includes(categoryType) && ['XZ_PRODUCE'].includes(v['projectProperty'])) {
                shouldReturn = false
            }
            return shouldReturn
        })

        const cardUuid = projectList && projectList.getIn([0, 'uuid'])
        const code = projectList && projectList.getIn([0, 'code'])
        const name = projectList && projectList.getIn([0, 'name'])

        let showName = `${code} ${name}`
        if (systemProJectCodeCommon.includes(code)) {
            showName = name
        }

        return (
            <Row className={'lrls-card lrls-more-card'}
                style={{ height: '.45rem' }}
            >
                <label>{beProject ? '项目:' : '项目'}</label>
                {
                    beProject ? <ChosenPicker
                        className='lrls-single'
                        type='card'
                        disabled={disabled}
                        title='请选择项目'
                        icon={canInsert ? {
                            type: 'project-add',
                            onClick: () => {
                                if (projectRange.size) {
                                    dispatch(editRunningConfigActions.beforeAddProjectCardFromEditRunning(router.history, projectRange, 'searchApproval'))
                                } else {
                                    thirdParty.toast.info('请选择项目范围')
                                }
                            }
                        } : null}
                        district={categoryList}
                        cardList={cardArr}
                        value={categoryValue}
                        cardValue={[cardUuid]}
                        onChange={(value) => {
                            this.setState({ categoryValue: value.key })
                            if (value.key == 'ALL') {  // 全部
                                dispatch(searchApprovalActions.getProjectAllCardList(projectRange, 'project', true))
                                this.setState({ isAll: true })
                                return
                            }
                            this.setState({ isAll: false })
                            dispatch(searchApprovalActions.getProjectSomeCardList(value.key, value.top === true ? 1 : ''))
                        }}
                        onOk={value => {
                            if (value.length == 0) { return }
                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('projectList', fromJS([{
                                uuid: value[0].uuid,
                                code: value[0].code,
                                type: "XM",
                                name: value[0].cardName,
                            }])))

                            const projectProperty = value[0]['projectProperty']

                            if (projectProperty === 'XZ_PRODUCE') {
                                if (value[0].code === 'ASSIST') {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'FZSCCB'))
                                } else if (value[0].code === 'MAKE') {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'ZZFY'))
                                } else {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'SCCB'))
                                }
                            } else if (projectProperty=='XZ_CONSTRUCTION') {
                                let propertyCost = 'HTCB'

                                if (value[0].code=='INDIRECT') {
                                    propertyCost = 'JJFY'
                                }
                                if (value[0].code=='MECHANICAL') {
                                    propertyCost = 'JXZY'
                                }
                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', propertyCost))
                            } else {
                                if (jrCostType !== 'GLFY' || jrCostType !== 'XSFY' || jrCostType !== 'CWFY') {
									if (propertyCostList.size) {
										const str = {
											XZ_MANAGE: 'GLFY',
											XZ_SALE: 'XSFY',
											XZ_FINANCE: 'CWFY'
										}
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', str[propertyCostList.get(0)]))
									} else {
										dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', ''))
									}
								}
                            }
                        }}
                    >
                        <Row className='lrls-category lrls-padding'>
                            {
                                cardUuid ? <span className={disabled ? 'lrls-placeholder' : ''}> {showName} </span>
                                    : <span className='lrls-placeholder'>点击选择项目卡片</span>
                            }
                            <Icon type="triangle" style={{ color: disabled ? '#ccc' : '#666' }} />
                        </Row>
                    </ChosenPicker> : null
                }
                <div className='noTextSwitch' style={{ marginLeft: '6px', display: showSwitch ? '' : 'none' }}>
                    <Switch
                        checked={beProject}
                        onClick={() => {
                            if (openProject) {
                                if (!beProject == false) {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('projectList', fromJS([])))
    
                                    if (jrCostType !== 'GLFY' || jrCostType !== 'XSFY' || jrCostType !== 'CWFY') {
                                        if (propertyCostList.size) {
                                            const str = {
                                                XZ_MANAGE: 'GLFY',
                                                XZ_SALE: 'XSFY',
                                                XZ_FINANCE: 'CWFY'
                                            }
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', str[propertyCostList.get(0)]))
                                        } else {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', ''))
                                        }
                                    }
                                }
                            }
                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('beProject', !beProject))
                        }}
                    />
                </div>
            </Row>
        )
    }
}

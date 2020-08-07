import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Row, Single, Icon, Switch, ChosenPicker } from 'app/components'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { systemProJectCodeCommon, propertyCostNameJson } from 'app/containers/Config/Approval/components/common.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

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
    class ZeroInventory extends React.Component {

    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         oriTemp: fromJS({}),
    //     }
    // }    

    render() {

        const {
            oriDate,
            beCarryoverOut,
            dispatch,
            carryoverCategoryList,
            carryoverCategoryItem,
            usedCarryoverProject,
            carryoverProjectCardList,
            carryoverProjectList,
            propertyCost,
            propertyCostList,
        } = this.props
        // const { oriTemp } = this.state

        let categoryListTree = carryoverCategoryList.toJS()
        loop(categoryListTree)

        let propertyList = []
        propertyCostList.forEach(v => {
            if (v == 'XZ_SALE') {
                propertyList.push({ key: '销售费用', value: 'XZ_SALE' })
            } else if (v == 'XZ_MANAGE') {
                propertyList.push({ key: '管理费用', value: 'XZ_MANAGE' })
            } else if (v == 'XZ_FINANCE') {
                propertyList.push({ key: '财务费用', value: 'XZ_FINANCE' })
            }
        })

        // let showCommon = false//是否显示项目公共费用 true 显示
        // let showAssist = false//是否显示辅助生产成本或制造费用 true 显示
        // let showSgxm = false//是否显示施工项目下的间接费用或机械作业 true 显示

        // switch (oriTemp.get('categoryType')) {
            // case 'LB_YYZC': {
            //     showAssist = oriTemp.get('propertyCarryover') == 'SX_FW' ? true : false
            //     showSgxm = oriTemp.get('propertyCarryover') == 'SX_FW' ? true : false
            //     break
            // }
            // case 'LB_JK': {
            //     showCommon = true
            //     showAssist = handleType == 'JR_HANDLE_CHLX' ? true : false
            //     break
            // }
            // case 'LB_FYZC': {
            //     // showCommon = oriState == 'STATE_FY_DJ' ? false : true
            //     showCommon = true
            //     showAssist = true
            //     showSgxm = true
            //     break
            // }
            // case 'LB_XCZC': {
            //     // ({
            //     //     'SX_GZXJ': () => {
            //     //         showCommon = true
            //     //     },
            //     //     'SX_SHBX': () => {
            //     //         showCommon = true
            //     //     },
            //     //     'SX_ZFGJJ': () => {
            //     //         showCommon = true
            //     //     },
            //     //     'SX_FLF': () => {
            //     //         showCommon = true
            //     //     },
            //     //     'SX_QTXC': () => {
            //     //         // showCommon = oriState == 'STATE_XC_JT' ? true : false
            //     //         showCommon = true // 调整的其他薪酬相当于都是计提
            //     //     }
            //     // }[propertyPay] || (() => null))()

            //     showCommon = true
            //     showAssist = true
            //     showSgxm = true
            //     break
            // }

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

            // default: null
        // }

        let carryoverProjectListSource = []
        carryoverProjectList.toJS().forEach(v => {
            // if (v['projectProperty'] == 'XZ_LOSS' || v['projectProperty'] == 'XZ_CONSTRUCTION') {
                v['key'] = `${v['code']} ${v['name']}`
                v['oriName'] = v['name']
                v['value'] = `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`      
                if (systemProJectCodeCommon.indexOf(v['code']) > -1) {
                    v['key'] = v['name']
                }
                carryoverProjectListSource.push(v)
            // }
        })

        // carryoverProjectListSource = carryoverProjectListSource.filter(v => {
        //     let shouldReturn = true
            
        //     if (!showCommon && v['code'] == 'COMNCRD') {
        //         shouldReturn = false
        //     }
        //     if (!showAssist && (v['code'] == 'ASSIST' || v['code'] == 'MAKE')) {
        //         shouldReturn = false
        //     }
        //     if (!showSgxm && (v['code'] == 'INDIRECT' || v['code'] == 'MECHANICAL')) {
        //         shouldReturn = false
        //     }
        //     // if (['LB_CQZC', 'LB_JZSY'].includes(oriTemp.get('categoryType')) && ['XZ_PRODUCE', 'XZ_CONSTRUCTION'].includes(v['projectProperty'])) {
        //     //     shouldReturn = false
        //     // }
        //     // if (['LB_JZCB'].includes(oriTemp.get('categoryType')) && ['XZ_PRODUCE'].includes(v['projectProperty'])) {
        //     //     shouldReturn = false
        //     // }
        //     return shouldReturn
        // })

        const projectCard = carryoverProjectCardList.get(0) ? carryoverProjectCardList.get(0) : fromJS([{}])

        let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
        if (systemProJectCodeCommon.indexOf(projectCard.get('code')) > -1) {
            showName = projectCard.get('name')
        }

        const initPropertyCost = () => {
            if (propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE' && propertyCost !== 'XZ_FINANCE') {
                if (propertyCostList.size) {
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', propertyCostList.get(0)))
                } else {
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost',  ''))
                }
            }
        }

        return (
            <div className='lrls-card'>
                <Row className='lrls-more-card'>
                    <span>直接成本结转</span>
                    <div className='noTextSwitch'>
                        <Switch
                            checked={beCarryoverOut}
                            onClick={() => {
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', !beCarryoverOut))
                                dispatch(searchApprovalActions.getSearchApprovalCarryoverCategory(oriDate))

                                if (beCarryoverOut) {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
                                }
                            }}
                        />
                    </div>
                </Row>
                {
                    beCarryoverOut ?
                        <Row className='lrls-more-card lrls-margin-top'>
                            <label>处理类别: </label>
                            <div className='antd-single-picker'>
                                <ChosenPicker
                                    district={categoryListTree}
                                    parentDisabled={true}
                                    value={carryoverCategoryItem && carryoverCategoryItem.size ? carryoverCategoryItem.getIn([0, 'relationCategoryName']) : ''}
                                    onChange={(item) => {

                                        const beProjectBollen = item['beProject'] === true ? true : false
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', fromJS([{
                                            relationCategoryUuid: item['uuid'],
                                            relationCategoryName: item['name'],
                                            relationBeProject: beProjectBollen
                                        }])))

                                        this.setState({oriTemp: fromJS({
                                            categoryType: item['categoryType'],
                                            handleType: '',
                                            oriState: item['categoryType'] === 'LB_FYZC' ? 'STATE_FY' : '',
                                            propertyCarryover: item['propertyCarryover']
                                        })})

                                        const projectRange = item['projectRange']
                                        const propertyCostList = item['propertyCostList']

                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS(propertyCostList)))

                                        if (propertyCostList.length === 1) {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', propertyCostList[0]))
                                        }
                                        if (beProjectBollen) {
                                            dispatch(searchApprovalActions.getSearchApprovalCarrayProjectCardList(projectRange))
                                        } else {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
                                        }
                                    }}
                                >
                                    <Row className='lrls-padding lrls-category'
                                        onClick={(e) => {
                                            if (carryoverCategoryList.size == 0) {
                                                e.stopPropagation()
                                                return thirdParty.toast.info('无匹配的处理类别', 2)
                                            }
                                        }}
                                    >
                                        <span className={carryoverCategoryItem && carryoverCategoryItem.size ? '' : 'lrls-placeholder'}>
                                            {carryoverCategoryItem && carryoverCategoryItem.size ? carryoverCategoryItem.getIn([0, 'relationCategoryName']) : '请选择处理类别'}
                                        </span>
                                        <Icon type="triangle" />
                                    </Row>
                                </ChosenPicker>
                            </div>
                        </Row>
                        :
                        null
                }
                {
                    beCarryoverOut && propertyCostList.size > 1 ?
                        <Row className='lrls-more-card lrls-margin-top'>
                            <label>费用性质: </label>
                            <Single
                                className='lrls-single'
                                district={propertyList}
                                value={propertyCost}
                                disabled={propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE' && propertyCost !== 'XZ_FINANCE' && propertyCost !== ''}
                                onOk={value => {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', value.value))
                                }}
                            >
                                <Row className='lrls-padding lrls-category'>
                                    <span className={propertyCost ? (propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE' && propertyCost !== 'XZ_FINANCE' ? 'lrls-placeholder' : '') : 'lrls-placeholder'}>
                                        {propertyCost ? propertyCostNameJson[propertyCost] : '请选择费用性质'}
                                    </span>
                                    <Icon type="triangle" />
                                </Row>
                            </Single>
                        </Row>
                        : null
                }
                {
                    carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationBeProject']) ?
                        <div className='lrls-more-card lrls-margin-top'>
                            <label>项目:</label>
                            {
                                usedCarryoverProject ?
                                    <Single
                                        className='lrls-single'
                                        district={carryoverProjectListSource}
                                        value={carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'code']) ? `${systemProJectCodeCommon.indexOf(carryoverProjectCardList.getIn([0, 'code'])) === -1 ? carryoverProjectCardList.getIn([0, 'code']) + ' ' + carryoverProjectCardList.getIn([0, 'name']) : carryoverProjectCardList.getIn([0, 'name'])}` : ''}
                                        onOk={value => {

                                            const valueList = value.value.split(Limit.TREE_JOIN_STR)
                                            const cardUuid = valueList[0]
                                            const code = valueList[1]
                                            const name = valueList[2]
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([{
                                                cardUuid,
                                                name,
                                                code,
                                            }])))

                                            const projectProperty = value.projectProperty
                                            if (projectProperty === 'XZ_CONSTRUCTION') {
                                                if (code === 'INDIRECT') {
                                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', 'XZ_JJFY'))
                                                } else if (code === 'MECHANICAL') {
                                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', 'XZ_JXZY'))
                                                } else {
                                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', 'XZ_HTCB'))
                                                }
                                            } else if (projectProperty === 'XZ_PRODUCE') {
                                                if (code === 'ASSIST') {
                                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', 'XZ_FZSCCB'))
                                                } else if (code === 'MAKE') {
                                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', 'XZ_ZZFY'))
                                                } else {
                                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', 'XZ_SCCB'))
                                                }
                                            } else { // 损益项目
                                                initPropertyCost()
                                            }

                                        }}
                                    >
                                        <Row className='lrls-category lrls-padding'>
                                            {
                                                projectCard.get('cardUuid') ? <span> {showName} </span>
                                                    : <span className='lrls-placeholder'>点击选择项目卡片</span>
                                            }
                                            <Icon type="triangle" />
                                        </Row>
                                    </Single> : null
                            }

                            <div className='noTextSwitch' style={{ marginLeft: '6px' }}>
                                <Switch
                                    checked={usedCarryoverProject}
                                    onClick={() => {
                                        if (!usedCarryoverProject) {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
                                        } else {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([{}])))

                                            initPropertyCost()
                                        }
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', !usedCarryoverProject))
                                    }}
                                />
                            </div>
                        </div>
                        : null
                }
            </div>
        )
    }
}
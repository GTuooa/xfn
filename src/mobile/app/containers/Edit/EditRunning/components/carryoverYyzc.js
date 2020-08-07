import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Amount, Switch, ChosenPicker } from 'app/components'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

//营业收入存货卡片
export default class CarryoverYyzc extends Component {
    componentDidMount () {
        const routerPage = sessionStorage.getItem('routerPage')
        if (['routerStock'].includes(routerPage)) {//从选择页面返回不需要重新获取
			return
        }
        this.props.dispatch(editRunningActions.getJzcbCategoryList(true))
    }

    array_includes (arr1, arr2) {
        let temp = new Set([...arr1, ...arr2])
        return arr1.length === temp.size
    }

    render () {
        const {
            dispatch,
            beCarryover,
            categoryList,
            relationCategoryUuid,
            relationCategoryName,
            relationObj,
            usedCarryoverProject,
            carryoverProject,
            carryoverProjectCardList,
            propertyCost,
            usedProject,
            projectCardList,
            projectRange
        } = this.props

        let categoryListTree = categoryList.toJS()
        loop(categoryListTree)

        let propertyList = [], propertyCostName = '请选择费用性质'
        const propertyCostList = relationObj['propertyCostList']
        const beProject = relationObj['beProject']
        propertyCostList.forEach(v => {
            if (v == 'XZ_SALE') {
                propertyList.push({key: '销售费用', value: 'XZ_SALE'})
            } else if (v == 'XZ_MANAGE') {
                propertyList.push({key: '管理费用', value: 'XZ_MANAGE'})
            } else if (v == 'XZ_FINANCE') {
                propertyList.push({key: '财务费用', value: 'XZ_FINANCE'})
            }
        })

        if (propertyCost) {
            propertyCostName = {'XZ_SALE': '销售费用', 'XZ_MANAGE': '管理费用', 'XZ_FINANCE': '财务费用', 'XZ_SCCB': '生产成本', 'XZ_FZSCCB': '辅助生产成本', 'XZ_ZZFY': '制造费用', 'XZ_HTCB': '合同成本', 'XZ_JJFY': '间接费用', 'XZ_JXZY': '机械作业',}[propertyCost]
        }

        let carryoverProjectList = []
        carryoverProject.toJS().forEach(v => {
            if (relationObj['relationCategoryType']!='LB_FYZC' && (v['value'].includes('INDIRECT') || v['value'].includes('MECHANICAL'))) {
                return
            }
            // if ( relationObj['relationCategoryType']=='LB_YYSR' && v['value'].includes('COMNCRD') ) {
            //     return
            // }
            // if (['XZ_LOSS', 'XZ_CONSTRUCTION'].includes(v['projectProperty'])) {
            //     carryoverProjectList.push(v)
            // }
            carryoverProjectList.push(v)
        })

        const projectCard = carryoverProjectCardList.get(0) ? carryoverProjectCardList.get(0) : fromJS({})
        let showName = `${projectCard.get('code')} ${projectCard.get('name')}`
        if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(projectCard.get('code'))) {
            showName = projectCard.get('name')
        }

        return (
                <div className='lrls-card'>
                    <Row className='lrls-more-card'>
                        <span>直接成本结转</span>
                        <div className='noTextSwitch'>
                            <Switch
                                checked={beCarryover}
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beCarryover'], !beCarryover))
                                }}
                            />
                        </div>
                    </Row>

                    <div style={{display: beCarryover ? '' : 'none'}}>
                        <Row className='lrls-more-card lrls-margin-top'>
                            <label>处理类别: </label>
                            <div className='antd-single-picker'>
                                <ChosenPicker
                                    district={categoryListTree}
                                    parentDisabled={true}
                                    value={relationCategoryUuid}
                                    onChange={(item) => {
                                        let relationObj = {'relationCategoryType': item['categoryType']}
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryUuid'], item['uuid']))
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryName'], item['name']))
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCarryoverProject'], item['beProject']))
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'carryoverProjectCardList'], fromJS([{}])))

                                        if (item['beProject']) {
                                            dispatch(editRunningActions.getProjectCardList(item['projectRange'], 'carryoverProject'))
                                            let rangeIncludes = this.array_includes(item['projectRange'], projectRange.toJS())
                                            if (usedProject && rangeIncludes && projectCardList.size && projectCardList.getIn([0, 'cardUuid'])) {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'carryoverProjectCardList'], projectCardList))
                                            }
                                        }
                                        let propertyCost=''
                                        if (item['propertyCostList'] && item['propertyCostList'].length > 0) {
                                            propertyCost = item['propertyCostList'][0]
                                        }
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCost))

                                        relationObj['beProject'] = item['beProject']
                                        relationObj['propertyCostList'] = item['propertyCostList']
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationObj'], fromJS(relationObj)))

                                    }}
                                >
                                    <Row className='lrls-padding lrls-category'
                                        onClick={(e) => {
                                            if (categoryList.size==0) {
                                                e.stopPropagation()
                                                return thirdParty.toast.info('无匹配的处理类别', 2)
                                            }
                                        }}
                                    >
                                        <span className={relationCategoryUuid ? '' : 'lrls-placeholder'}>
                                            {relationCategoryName ? relationCategoryName : '请选择处理类别'}
                                        </span>
                                        <Icon type="triangle"/>
                                    </Row>
                                </ChosenPicker>
                            </div>
                        </Row>

                        <Row  className='lrls-more-card lrls-margin-top'
                            style={{display: propertyCostList && propertyCostList.length > 1 ? '' : 'none'}}
                        >
                            <label>费用性质: </label>
                            <Single
                                className='lrls-single'
                                district={propertyList}
                                value={propertyCost}
                                disabled={['XZ_SCCB', 'XZ_FZSCCB', 'XZ_ZZFY', 'XZ_HTCB', 'XZ_JJFY', 'XZ_JXZY'].includes(propertyCost)}
                                onOk={value => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], value.value))
                                }}
                            >
                                <Row className='lrls-padding lrls-category'>
                                    <span className={propertyCostName !='请选择费用性质' ? '' : 'lrls-placeholder'}>
                                        { propertyCostName }
                                    </span>
                                    <Icon type="triangle" />
                                </Row>
                            </Single>
                        </Row>

                        <div className='lrls-more-card lrls-margin-top' style={{display: beProject ? '' : 'none'}}>
                            <label>项目:</label>
                            {
                                usedCarryoverProject ?
                                <Single
                                    className='lrls-single'
                                    district={carryoverProjectList}
                                    value={projectCard.get('cardUuid') ? `${projectCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
                                    onOk={value => {
                                        dispatch(editRunningActions.changeProjectCard('carryoverProjectCardList', value.value, 0))
                                        if (value['projectProperty']=='XZ_CONSTRUCTION') {
                                            let propertyCost = 'XZ_HTCB'

                                            if (value['code']=='INDIRECT') {
                                                propertyCost = 'XZ_JJFY'
                                            }
                                            if (value['code']=='MECHANICAL') {
                                                propertyCost = 'XZ_JXZY'
                                            }
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCost))
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

                            <div className='noTextSwitch' style={{marginLeft: '6px'}}>
                                <Switch
                                    checked={usedCarryoverProject}
                                    onClick={() => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCarryoverProject'], !usedCarryoverProject))
                                        if (usedCarryoverProject) {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'carryoverProjectCardList'], fromJS([])))
                                        } else {
                                            let item = fromJS([])
                                            if (usedProject && projectCardList.size && projectCardList.getIn([0, 'cardUuid'])) {
                                                item = projectCardList
                                            }
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'carryoverProjectCardList'], item))
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

}

import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Icon, Single, Switch, ChosenPicker } from 'app/components'

import * as Limit from 'app/constants/Limit.js'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
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
export default class ProjectCom extends Component  {
    state = {
        isAll: true,
        categoryValue: 'ALL',
    }

    componentDidMount() {
        this.props.dispatch(editRunningActions.changeLrlsData('commonProjectList', fromJS([]), true))
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.categoryType != nextProps.categoryType) {
            this.setState({categoryValue: 'ALL', isAll: true,})
        }
    }

    render () {
        const {
            dispatch,
            isModify,
            categoryType,
            oriState,
            usedProject,
            projectCardList,
            projectList,
            propertyPay,
            history,
            projectRange,
            projectCategoryList,
            commonProjectList,
            propertyCarryover,
            propertyCostList,
            handleType,
            showXmjz,
            relationCategoryType,
        } = this.props
        const { isAll, categoryValue } = this.state
        // showCommon 是否显示项目公共费用 true 显示
        let showCommon = false//是否显示项目公共费用 true 显示
        let showAssist = false//是否显示生产项目下的辅助生产成本或制造费用 true 显示
        let showSgxm = false//是否显示施工项目下的间接费用或机械作业 true 显示
        let showSwitch = true// 是否显示开关按钮 true 显示
        let disabled = false//项目是够允许修改
        let canInsert = true//是否允许新增

        switch (categoryType) {
            case 'LB_YYSR': {
                showCommon = ['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState)
                break
            }
            case 'LB_YYZC': {
                showAssist = propertyCarryover == 'SX_FW' ? true : false
                showSgxm = propertyCarryover == 'SX_FW' ? true : false
                showCommon = propertyCarryover == 'SX_FW' && ['STATE_YYZC_GJ','STATE_YYZC_TG'].includes(oriState)
                break
            }
            case 'LB_FYZC': {
                showCommon = oriState == 'STATE_FY_DJ' ? false : true
                showAssist = true
                showSgxm = true
                break
            }
            case 'LB_XCZC': {
                showAssist = true
                showSgxm = true
                showCommon = true
                break
            }
            case 'LB_JK': {
                showCommon = true
                showAssist = handleType == 'JR_HANDLE_CHLX' ? true : false
                showSgxm = handleType == 'JR_HANDLE_CHLX' ? true : false
                break
            }
            case 'LB_ZJTX': {
                showCommon = true
                canInsert = false
                showAssist = true
                showSgxm = true
                break
            }
            case 'LB_JZSY': {
                canInsert = false
                break
            }
            case 'LB_JZCB': {
                canInsert = false
                showCommon = true
                showSgxm = relationCategoryType == 'LB_FYZC' ? true : false
                showAssist = relationCategoryType == 'LB_FYZC' ? true : false
                break
            }
            case 'LB_JXSEZC': {
                canInsert = false
                break
            }
            case 'LB_CHTRXM': {
                canInsert = false
                showSwitch = false
                showAssist = true
                showSgxm = true
                break
            }
            case 'LB_XMJZ': {
                canInsert = false
                showSwitch = false
                showAssist = false
                disabled = isModify ? true : false
                if (!showXmjz) {
                    return null
                }
                break
            }

            default: null
        }

        let categoryList = [{uuid: 'ALL', name: '全部', childList: []}]
        projectCategoryList && projectCategoryList.map(v => {
            if (projectRange.includes(v.get('uuid'))) {
                if (['LB_CQZC', 'LB_JZSY'].includes(categoryType) && ['生产项目', '施工项目'].includes(v.get('name'))) {
                    return
                }
                // if (['LB_JZCB'].includes(categoryType) && ['生产项目'].includes(v.get('name'))) {
                //     return
                // }
                categoryList.push(v.toJS())
            }
            if (['LB_CHTRXM', 'LB_XMJZ'].includes(categoryType)) {
                categoryList.push(v.toJS())
            }
        })
        loop(categoryList)

        let cardArr = isAll ? projectList.toJS() : commonProjectList.toJS()
        cardArr.map(v => {
            v['name'] = v['key']
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
            // if (['LB_JZCB'].includes(categoryType) && ['XZ_PRODUCE'].includes(v['projectProperty'])) {
            //     shouldReturn = false
            // }
            return shouldReturn
        })

        const cardUuid = projectCardList.getIn([0, 'cardUuid'])
        const code = projectCardList.getIn([0, 'code'])
        const name = projectCardList.getIn([0, 'name'])
        const projectProperty = projectCardList.getIn([0, 'projectProperty'])

        let showName = `${code} ${name}`
        if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(code)) {
            showName = name
        }

        return (
            <Row className={showXmjz ? 'lrls-more-card lrls-margin-top' : 'lrls-card lrls-more-card'}
                style={{height: showXmjz ? '' : '.45rem'}}
            >
                <label>{usedProject ? '项目:' : '项目'}</label>
                {
                    usedProject ? <ChosenPicker
                        className='lrls-single'
                        type='card'
                        disabled={disabled}
                        title='请选择项目'
                        icon={canInsert ? {
                                type: 'project-add',
                                onClick: () => {
                                    dispatch(editRunningConfigActions.beforeAddProjectCardFromEditRunning(history))
                                }
                            } : null}
                        district={categoryList}
                        cardList={cardArr}
                        value={categoryValue}
                        cardValue={[cardUuid]}
                        onChange={(value) => {
                            this.setState({ categoryValue: value.key })
                            if (value.key=='ALL') {
                                this.setState({isAll: true})
                                //dispatch(editRunningActions.getProjectCardList(projectRange))
                                return
                            }
                            this.setState({isAll: false})
                            dispatch(editRunningActions.getProjectListByCategory(value))
                        }}
                        onOk={value => {
                            if (value.length==0) { return }
                            dispatch(editRunningActions.changeProjectCard('card', value[0], 0))
                            // 关联修改费用性质
                            if (value[0]['projectProperty']=='XZ_PRODUCE') {
                                let propertyCost = 'XZ_SCCB'

                                if (value[0]['code']=='ASSIST') {
                                    propertyCost = 'XZ_FZSCCB'
                                }
                                if (value[0]['code']=='MAKE') {
                                    propertyCost = 'XZ_ZZFY'
                                }
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCost))
                            } else if (value[0]['projectProperty']=='XZ_CONSTRUCTION') {
                                let propertyCost = 'XZ_HTCB'

                                if (value[0]['code']=='INDIRECT') {
                                    propertyCost = 'XZ_JJFY'
                                }
                                if (value[0]['code']=='MECHANICAL') {
                                    propertyCost = 'XZ_JXZY'
                                }
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCost))
                            } else {
                                if (usedProject && propertyCostList && propertyCostList.size) {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCostList.get(0)))
                                }
                            }
                            if (categoryType=='LB_XMJZ') {
                                if (value[0]['projectProperty']=='XZ_CONSTRUCTION' && oriState=='STATE_XMJZ_JZRK') {
                                    dispatch(editRunningActions.changeLrlsOriState('STATE_XMJZ_QRSRCB'))
                                }
                                if (value[0]['projectProperty']=='XZ_PRODUCE' && oriState=='STATE_XMJZ_QRSRCB') {
                                    dispatch(editRunningActions.changeLrlsOriState('STATE_XMJZ_JZRK'))
                                }
                                dispatch(editRunningActions.getXmjzList())
                            }
                        }}
                    >
                       <Row className='lrls-category lrls-padding'>
                           {
                               cardUuid ? <span className={disabled ? 'lrls-placeholder' : ''}> {showName} </span>
                               : <span className='lrls-placeholder'>点击选择项目卡片</span>
                           }
                           <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
                       </Row>
                   </ChosenPicker> : null
                }
                <div className='noTextSwitch' style={{marginLeft: '6px', display: showSwitch ? '' : 'none'}}>
                    <Switch
                        checked={usedProject}
                        onClick={() => {
                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], !usedProject))
                            if (usedProject && propertyCostList && propertyCostList.size) {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCostList.get(0)))
                            }
                            if (!usedProject && projectProperty=='XZ_PRODUCE') {
                                let propertyCost = 'XZ_SCCB'

                                if (code=='ASSIST') {
                                    propertyCost = 'XZ_FZSCCB'
                                }
                                if (code=='MAKE') {
                                    propertyCost = 'XZ_ZZFY'
                                }
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCost))
                            }
                        }}
                    />
                </div>
            </Row>
        )
    }
}

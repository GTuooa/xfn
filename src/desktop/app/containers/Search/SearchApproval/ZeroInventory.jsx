import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Select, Switch, Checkbox } from 'antd'
import XfnSelect from 'app/components/XfnSelect'
import { CommonProjectTest } from 'app/containers/Edit/EditRunning/common/common.js'
import { systemProJectCodeCommon, propertyCostNameJson } from 'app/containers/Config/Approval/components/common.js'
import * as Limit from 'app/constants/Limit.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
	class ZeroInventory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            oriTemp: fromJS({}),
        }
    }

	render() {

		const {
            oriDate,
			beCarryoverOut,
			dispatch,
            carryoverCategory,
            carryoverCategoryItem,
            usedCarryoverProject,
            carryoverProjectCardList,
            carryoverProjectList,
            propertyCost,
            propertyCostList,
        } = this.props
        const { oriTemp } = this.state

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
			<div>
                <div className="approval-running-card-input-wrap">
                    <span>
                        <Checkbox
                            checked={beCarryoverOut}
                            onChange={(e) => {
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', !beCarryoverOut))
                                dispatch(searchApprovalActions.getSearchApprovalCarryoverCategory(oriDate))

                                if (beCarryoverOut) {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
                                }
                            }}
                        > 直接成本结转
                        </Checkbox>
                    </span>
                </div>
                {
                    beCarryoverOut?
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">处理类别：</span>
                        <span className="approval-running-card-input">
                            <Select
                                // disabled={insertOrModify === 'modify'}
                                value={carryoverCategoryItem && carryoverCategoryItem.size ? carryoverCategoryItem.getIn([0, 'relationCategoryName']) : ''}
                                onChange={(value,options)=> {
                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                    const beProjectBollen = valueList[2] === 'true' ? true : false
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', fromJS([{
                                        relationCategoryUuid: valueList[0],
                                        relationCategoryName: valueList[1],
                                        relationBeProject: beProjectBollen
                                    }])))
                                    const projectRange = options.props.projectRange
                                    const propertyCostList = options.props.propertyCostList
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS(propertyCostList)))

                                    if (propertyCostList.length === 1) {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', propertyCostList[0]))
                                    }
                                    if (beProjectBollen) {
                                        dispatch(searchApprovalActions.getSearchApprovalCarrayProjectCardList(projectRange))
                                    } else {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
                                        // 没有项目时需要判断费用性质要不要改
                                    }
                                    
                                    this.setState({oriTemp: fromJS({
                                        categoryType: options.props.categoryType,
                                        // handleType: '',
                                        // // oriState: options.props.categoryType==='LB_FYZC' ? 'STATE_FY' : '',
                                        // oriState: '',
                                        // propertyCarryover: options.props.propertyCarryover
                                    })})
                                }}
                            >
                                {
                                    carryoverCategory.map((v, i) => {
                                        return <Select.Option
                                            key={i}
                                            value={`${v.uuid}${Limit.TREE_JOIN_STR}${v.name}${Limit.TREE_JOIN_STR}${v.beProject}`}
                                            projectRange={v.projectRange}
                                            propertyCostList={v.propertyCostList}
                                            categoryType={v.categoryType}
                                            propertyCarryover={v.propertyCarryover}
                                            >
                                            {v.name}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </span>
                    </div>
                    :
                    null
                }
                {
                    beCarryoverOut && propertyCostList.size > 1 ?
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">费用性质：</span>
                        <span className="approval-running-card-input">
                            <Select
                                value={propertyCostNameJson[propertyCost]}
                                disabled={propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE' && propertyCost !== 'XZ_FINANCE' && propertyCost !== ''}
                                onChange={(value)=> {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', value))
                                }}
                            >
                                {
                                    propertyCostList.map((v, i) => {
                                        return <Select.Option
                                            key={i}
                                            value={v}
                                            >
                                            {propertyCostNameJson[v]}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </span>
                    </div>
                    : null
                }
                {
					carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationBeProject']) ?
					<div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">项目：</span>
                        <span className="approval-running-card-input">
                            <XfnSelect
                                combobox
                                showSearch
                                disabled={!usedCarryoverProject}
                                value={carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0,'code']) ? `${systemProJectCodeCommon.indexOf(carryoverProjectCardList.getIn([0,'code'])) === -1 ? carryoverProjectCardList.getIn([0,'code']) + ' ' + carryoverProjectCardList.getIn([0,'name']) : carryoverProjectCardList.getIn([0,'name'])}` : ''}
                                onChange={(value, options) => {
                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                    const cardUuid = valueList[0]
                                    const code = valueList[1]
                                    const name = valueList[2]
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([{
                                        cardUuid,
                                        name,
                                        code,
                                    }]) ))

                                    const projectProperty = options.props.projectProperty
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
                                {carryoverProjectList && CommonProjectTest(oriTemp, carryoverProjectList).map((v, i) =>
                                    <XfnSelect.Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`} projectProperty={v.get('projectProperty')}>
                                        {systemProJectCodeCommon.indexOf(v.get('code')) === -1 ? `${v.get('code')} ${v.get('name')}` : `${v.get('name')}`}
                                    </XfnSelect.Option>
                                )}
                            </XfnSelect>
                            <Switch
                                className="use-unuse-style lrls-jzsy-box"
                                style={{ margin: '.1rem 0 0 .2rem' }}
                                checked={usedCarryoverProject}
                                checkedChildren={'项目'}
                                unCheckedChildren={'项目'}
                                onChange={() => {
                                    if (!usedCarryoverProject) {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([]) ))
                                    } else {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([{}]) ))

                                        initPropertyCost()
                                    }
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', !usedCarryoverProject ))
                                }}
                            />
                        </span>
                    </div>: null
				}
            </div>
		)
	}
}
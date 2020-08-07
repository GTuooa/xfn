import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Tooltip } from 'antd'
const CheckboxGroup = Checkbox.Group

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@immutableRenderDecorator
export default class Management extends React.Component {

    static displayName = 'RunningConifManagement'

    render() {

        const {
			flags,
            dispatch,
            showModal,
            insertOrModify,
			runningTemp,
			runningCategory,
            showManagemented,
            propertyShow,
            beManagemented,
            categoryTypeObj,
            newJr,
            showSf
		} = this.props

        const categoryType = runningTemp.get('categoryType')
        const uncollectedProfitAc = runningTemp.getIn([categoryTypeObj, 'uncollectedProfitAc'])
        const propertyInvest = runningTemp.get('propertyInvest')
        const level = runningTemp.get('level')
        const beSpecial = runningTemp.get('beSpecial')
        const beDeposited = runningTemp.getIn([categoryTypeObj, 'beDeposited'])
        const propertyCarryover = runningTemp.get('propertyCarryover')
        const beCarryover = runningTemp.getIn([categoryTypeObj,'beCarryover'])
        const allContactsRange = runningTemp.getIn([categoryTypeObj,'allContactsRange'])
        const contactsRange = runningTemp.getIn([categoryTypeObj,'contactsRange'])
        const currentContactsRange = runningTemp.getIn([categoryTypeObj,'currentContactsRange'])
        const canManagement = runningTemp.getIn([categoryTypeObj,'canManagement'])
        const canDeposited = runningTemp.getIn([categoryTypeObj,'canDeposited'])
        const currentDeposited = runningTemp.getIn([categoryTypeObj, 'currentDeposited'])
        const currentManagement = runningTemp.getIn([categoryTypeObj, 'currentManagement'])
        const currentContactsManagement = runningTemp.getIn([categoryTypeObj, 'currentContactsManagement'])
        const canContactsManagement = runningTemp.getIn([categoryTypeObj, 'canContactsManagement'])
        const contactsManagement = runningTemp.getIn([categoryTypeObj, 'contactsManagement'])

        return(
            showManagemented ?
            newJr?
            <div>
            <div
                className="accountConf-modal-list-blockitem accountConf-modal-flex"
                style={{display:showSf?'':'none'}}
            >
                <div>
                    <span onClick={() => {
                        // if ((insertOrModify == 'insert' && currentManagement || insertOrModify == 'modify' && canManagement) || level === 1 && !beSpecial ) {
                            dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beManagemented'], !beManagemented))
                        // }
                    }}>
                        <Checkbox
                            checked={beManagemented}
                            // disabled={(insertOrModify == 'insert' && !currentManagement|| insertOrModify == 'modify' && !canManagement) && (level !== 1 || beSpecial) }
                       />
                       收付管理
                       {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentManagement || insertOrModify == 'modify' && !canManagement) && (level !== 1 || beSpecial)?'上级未启用':''}`}>收付管理</Tooltip> */}
                    </span>
                </div>
                {/* 定金管理 */}
                <div style={{display: (categoryTypeObj==='acBusinessIncome'|| categoryTypeObj==='acBusinessExpense' || categoryType === 'LB_FYZC')
                                    && beManagemented? '' : 'none'}}
                    className=" child-chosen"
                >
                    <div>
                        <span onClick={() => {
                            // if ((insertOrModify == 'insert' && currentDeposited || insertOrModify == 'modify' && canDeposited) || level === 1 ) {
                                dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beDeposited'], !beDeposited))
                            // }
                        }}>
                            <Checkbox
                                checked={beDeposited}
                                // disabled={(insertOrModify == 'insert' && !currentDeposited|| insertOrModify == 'modify' && !canDeposited) && level !== 1 }
                           />
                           {`启用预${categoryType === 'LB_YYSR'?'收':'付'}`}
                           {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentDeposited || insertOrModify == 'modify' && !canDeposited) && level !== 1?'上级未启用':''}`}>{`启用预${categoryType === 'LB_YYSR'?'收':'付'}`}</Tooltip> */}
                        </span>
                    </div>
                </div>



            </div>
            <div className='accountConf-modal-list-blockitem accountConf-modal-flex' >
                <div>
                    <span onClick={() => {
                        // if ((insertOrModify == 'insert' && currentContactsManagement || insertOrModify == 'modify' && canContactsManagement) || level === 1 ) {
                            dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'contactsManagement'], !contactsManagement))
                            if (!contactsManagement) {
                                const uuid = allContactsRange.find(v => v.get('canUse')) ? allContactsRange.find(v => v.get('canUse')).get('uuid') : ''
                                dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'contactsRange',0], uuid))
                            }
                        // }
                    }}>
                        <Checkbox
                            checked={contactsManagement}
                            // disabled={(insertOrModify == 'insert' && !currentContactsManagement || insertOrModify == 'modify' && !canContactsManagement) && level !== 1 }
                       />
                       往来管理
                       {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentContactsManagement || insertOrModify == 'modify' && !canContactsManagement) && level !== 1?'上级未启用':''}`}>{'往来管理'}</Tooltip> */}
                    </span>
                </div>
                {
                    contactsManagement?
                    <div className='child-chosen'>
                        <span>范围：</span>
                        {
                            allContactsRange.map(v =>
                                <span>
                                    <Checkbox
                                        checked={contactsRange.find(w => w === v.get('uuid'))}
                                        // disabled={(insertOrModify == 'insert' && !currentContactsRange.find(w => w === v.get('uuid')) || insertOrModify == 'modify' && !v.get('canUse')) && (level !== 1 || beSpecial)}
                                        onChange={(e) => {
                                            dispatch(runningConfActions.changeCardCheckboxArr(categoryTypeObj, 'contactsRange', v.get('uuid'),e.target.checked))
                                        }}
                                   />
                                   {v.get('name')}
                                   {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentContactsRange.find(w => w === v.get('uuid'))|| insertOrModify == 'modify' && !v.get('canUse')) && (level !== 1 || beSpecial)?'上级未启用':''}`}>{v.get('name')}</Tooltip> */}
                                </span>
                            )
                        }
                    </div>:''
                }
            </div>
            </div>
            :
            <div>
                <div
                    className="accountConf-modal-list-blockitem accountConf-modal-flex"
                    style={{display:showSf?'':'none'}}
                >
                    <div>
                        <span onClick={() => {
                            // if ((insertOrModify == 'insert' && currentManagement || insertOrModify == 'modify' && canManagement) || level === 1 && !beSpecial ) {
                                dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beManagemented'], !beManagemented))
                            // }
                        }}>
                            <Checkbox
                                checked={beManagemented}
                                // disabled={(insertOrModify == 'insert' && !currentManagement|| insertOrModify == 'modify' && !canManagement) && (level !== 1 || beSpecial) }
                           />
                           收付管理
                           {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentManagement || insertOrModify == 'modify' && !canManagement) && (level !== 1 || beSpecial)?'上级未启用':''}`}>收付管理</Tooltip> */}
                        </span>
                    </div>
                    {/* 定金管理 */}
                    <div style={{display: (categoryTypeObj==='acBusinessIncome'|| categoryTypeObj==='acBusinessExpense' || categoryType === 'LB_FYZC')
                                        && beManagemented? '' : 'none'}}
                        className=" child-chosen"
                    >
                        <div>
                            <span onClick={() => {
                                // if ((insertOrModify == 'insert' && currentDeposited || insertOrModify == 'modify' && canDeposited) || level === 1 ) {
                                    dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beDeposited'], !beDeposited))
                                // }
                            }}>
                                <Checkbox
                                    checked={beDeposited}
                                    // disabled={(insertOrModify == 'insert' && !currentDeposited|| insertOrModify == 'modify' && !canDeposited) && level !== 1 }
                               />
                               {`启用预${categoryType === 'LB_YYSR'?'收':'付'}`}
                               {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentDeposited || insertOrModify == 'modify' && !canDeposited) && level !== 1?'上级未启用':''}`}>{`启用预${categoryType === 'LB_YYSR'?'收':'付'}`}</Tooltip> */}
                            </span>
                        </div>
                    </div>
                    {
                        beManagemented?
                        <div className='accountConf-modal-block child-chosen'>
                            <span>往来单位范围：</span>
                            {
                                allContactsRange.map(v =>
                                    <span>
                                        <Checkbox
                                            checked={contactsRange.find(w => w === v.get('uuid'))}
                                            // disabled={(insertOrModify == 'insert' && !currentContactsRange.find(w => w === v.get('uuid')) || insertOrModify == 'modify' && !v.get('canUse')) && (level !== 1 || beSpecial)}
                                            onChange={(e) => {
                                                dispatch(runningConfActions.changeCardCheckboxArr(categoryTypeObj, 'contactsRange', v.get('uuid'),e.target.checked))
                                            }}
                                       />
                                       {v.get('name')}
                                       {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentContactsRange.find(w => w === v.get('uuid'))|| insertOrModify == 'modify' && !v.get('canUse')) && (level !== 1 || beSpecial)?'上级未启用':''}`}>{v.get('name')}</Tooltip> */}
                                    </span>
                                )
                            }
                        </div>:''
                    }
                </div>
            </div>

            : null
        )
    }
}

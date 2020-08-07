import React from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { DateLib, formatMoney } from 'app/utils'
import { Switch, Tooltip } from 'antd'
import { fromJS, toJS }	from 'immutable'

import { DatePicker, Input, Select, message } from 'antd'
import NumberInput from 'app/components/Input'
const MonthPicker = DatePicker.MonthPicker
const Option = Select.Option

import ZjtxCategorySelect from './ZjtxCategorySelect'
import StockSingleModal from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import { numberTest } from '../common/common'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class CqzcZjtx extends React.Component {

    static displayName = 'CqzcDepreciation'
    constructor() {
        super()
        this.state = {
            showSingleModal: false,
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
        }
    }
    componentDidMount() {

        // if(this.props.insertOrModify === 'modify'){
        //     const cViews = this.props.calculateViews
        //     const projectRange = cViews.get('projectRange')
        //     this.props.dispatch(editCalculateActions.getProjectCardList(projectRange))
        // }
        // else{
        //     this.props.dispatch(editCalculateActions.getAssetsList('LB_ZJTX','DepreciationTemp'))
        // }

    }
    render() {

        const {
          dispatch,
          flags,
          disabledDate,
          insertOrModify,
          hideCategoryList,
          configPermission,
          DepreciationTemp,
          defaultFlowNumber,
          calculateViews,
          accountList,
          commonCardObj,

          // memberList,
          // thingsList,
        } = this.props
        const { showSingleModal, selectTreeUuid, selectTreeLevel } = this.state
        // const oriDate = insertOrModify === 'insert'?this.props.oriDate:DepreciationTemp.get('oriDate')
        const oriDate = this.props.oriDate
        const oriState = DepreciationTemp.get('oriState')
        const oriAbstract = DepreciationTemp.get('oriAbstract')
        const amount = DepreciationTemp.get('amount')
        const jrIndex = DepreciationTemp.get('jrIndex')
        const fromAccount = DepreciationTemp.get('fromAccountName')
        const toAccount = DepreciationTemp.get('toAccountName')
        const usedProject = DepreciationTemp.get('usedProject')
        const dealTypeList = DepreciationTemp.get('dealTypeList')
        const projectCard = DepreciationTemp.get('projectCard')
        const propertyCost = DepreciationTemp.get('propertyCost')

        const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const selectThingsList = commonCardObj.get('selectThingsList') || fromJS([])
        const selectedKeys = commonCardObj.get('selectedKeys')

        const dealType = calculateViews.get('dealType')
        const dealCategory = calculateViews.get('dealCategory')
        const projectList = calculateViews.get('projectList')?calculateViews.get('projectList'):fromJS([])
        const projectRange = calculateViews.get('projectRange')
        const beProject = calculateViews.get('beProject')
        const propertyCostList = calculateViews.get('propertyCostList')

        // const showSingleModal = flags.get('showSingleModal')
        // const selectThingsList = flags.get('selectThingsList') || fromJS([])
        // const currentCardType = flags.get('currentCardType')
        // const selectedKeys = flags.get('selectedKeys')

        const propertyCostName = {
            'XZ_SALE':'销售费用',
            'XZ_MANAGE':'管理费用',
            'XZ_SCCB':'生产成本',
            'XZ_FZSCCB':'辅助生产成本',
            'XZ_ZZFY':'制造费用',
            'XZ_HTCB':'合同成本',
            'XZ_JJFY':'间接费用',
            'XZ_JXZY':'机械作业',
            '':''
        }[propertyCost]


        const paymentTypeStr = calculateViews.get('paymentTypeStr')
        const position = "DepreciationTemp"

        return (
            <div className="accountConf-modal-list">
                {
                    insertOrModify === 'modify'?
                    <div className="edit-running-modal-list-item">
                        <label>流水号：</label>
                        <div>
                            <NumberInput
                                style={{width:'70px',marginRight:'5px'}}
                                value={jrIndex}
                                onChange={(e) => {
                                    if (/^\d{0,6}$/.test(e.target.value)) {
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position,'jrIndex', e.target.value))
                                    } else {
                                        message.info('流水号不能超过6位')
                                    }
                                }}
                                PointDisabled={true}
                            />
                            号
                        </div>
                    </div> : null
                }
                <div className="edit-running-modal-list-item">
                    <label>日期：</label>
                    <div>
                        <DatePicker allowClear={false} disabledDate={disabledDate} value={oriDate?moment(oriDate):''} onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                            // if (insertOrModify === 'insert') {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                            // } else {
                            //     dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriDate', date))
                            // }
                          }}/>
                    </div>
                </div>
                <CategorySelect
                    dispatch={dispatch}
                    insertOrModify={insertOrModify}
                    paymentTypeStr={paymentTypeStr}
                    hideCategoryList={hideCategoryList}
                />
                <div className="edit-running-modal-list-item" >
                    <label>处理类别：</label>
                    <div className="list-item-box">
                        <ZjtxCategorySelect
                            disabled={insertOrModify === 'modify'}
                            treeData={dealTypeList}
                            value={dealType}
                            placeholder=""
                            parentDisabled={true}
                            onChange={(value,label,extra) => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const projectRange = valueList[2].split('+')
                                const propertyCostList = valueList[1].split('+')
                                const beProject = valueList[4] === 'true' ? true : false
                                dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'dealType', valueList[0]))
                                dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'projectRange', projectRange))
                                dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'propertyCostList', fromJS(propertyCostList)))
                                dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'beProject',beProject))
                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard',fromJS({name:'',code:'',cardUuid:'',amount:''})))
                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost',''))
                                if(propertyCostList.length === 1){
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position,'propertyCost',propertyCostList[0]))
                                }
                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'categoryUuid', valueList[3]))
                                beProject && dispatch(editCalculateActions.getProjectCardList(projectRange,beProject))
                            }}
                        />
                        {
                            dealType && beProject ?
                            <Switch
                                className="use-unuse-style"
                                style={{marginLeft:'.2rem'}}
                                checked={usedProject}
                                checkedChildren={'项目'}
                                unCheckedChildren={'项目'}
                                onChange={() => {
                                    if (!usedProject) {
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position,'projectCard',fromJS([{name:'',code:'',cardUuid:''}])))
                                    } else {
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position,'propertyCost',propertyCostList.get(0)))
                                    }
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position,'usedProject',!usedProject))
                                }}
                            /> : ''
                        }

                    </div>
                </div>
                {
                    propertyCostList && propertyCostList.size > 1 ?
                    <div className="edit-running-modal-list-item">
                        <label>费用性质：</label>
                        <div>
                            <Tooltip title={
                                {
                                    XZ_SCCB:`已选择生产项目`,
                                    XZ_FZSCCB:`已选择"辅助生产成本"项目`,
                                    XZ_ZZFY:`已选择"制造费用"项目`,
                                    XZ_JJFY:`已选择"间接费用"项目`,
                                    XZ_JXZY:`已选择"机械作业"项目`,
                                    XZ_HTCB:`已选择施工项目`
                                }[propertyCost] || ''}
                                placement='topLeft'
                                >
                            <Select
                                disabled={
                                    propertyCost === 'XZ_SCCB' ||
                                    propertyCost === 'XZ_FZSCCB' ||
                                    propertyCost === 'XZ_ZZFY' ||
                                    propertyCost === 'XZ_JJFY' ||
                                    propertyCost === 'XZ_JXZY' ||
                                    propertyCost === 'XZ_HTCB'
                                }
                                value={propertyCostName}
                                onChange={value => {
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position,'propertyCost',value))
                                }}
                                >
                                    {
                                        propertyCostList && propertyCostList.size?
                                        propertyCostList.map((v, i) =>{
                                            const name ={
                                                XZ_SALE:'销售费用',
                                                XZ_MANAGE:'管理费用',
                                            }[v]
                                            return <Option key={i} value={v}>
                                                {name}
                                            </Option>
                                        })
                                        :
                                        null
                                }

                            </Select>
                        </Tooltip>
                        </div>
                    </div> : ''
                }

                <div className='calculate-separator'></div>
                <div className="edit-running-modal-list-item">
                    <label>摘要：</label>
                    <div>
                        <Input  className="focus-input"
                            onFocus={(e) => {
                                document.getElementsByClassName('focus-input')[0].select();
                            }}
                            value={oriAbstract} onChange={(e) => {
                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', e.target.value))
                          }}/>
                    </div>
                </div>
                {
                    usedProject && beProject?
                    <div className="edit-running-modal-list-item" >
                        <label>项目：</label>
                        <div className='chosen-right'>
                            {
                                <Select
                                    combobox
                                    showSearch
                                    value={`${projectCard && projectCard.get('code') !== 'COMNCRD'  && projectCard.get('code') !== 'ASSIST' && projectCard.get('code') !== 'MAKE' && projectCard.get('code') !== 'INDIRECT' && projectCard.get('code') !== 'MECHANICAL'&& projectCard.get('code')?projectCard.get('code'):''} ${projectCard && projectCard.get('name')?projectCard.get('name'):''}`}
                                    onChange={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const cardUuid = options.props.uuid
                                        const code = valueList[0]
                                        const name = valueList[1]
                                        const amount = projectCard.get('amount')
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS({cardUuid,name,code,amount})))
                                        switch(code) {
                                            case 'ASSIST':
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_FZSCCB'))
                                                break
                                            case 'MAKE':
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_ZZFY'))
                                                break
                                            case 'INDIRECT':
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JJFY'))
                                                break
                                            case 'MECHANICAL':
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JXZY'))
                                                break
                                            default:
                                                if (options.props.projectProperty === 'XZ_PRODUCE') {
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_SCCB'))
                                                }else if (options.props.projectProperty === 'XZ_CONSTRUCTION') {
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_HTCB'))
                                                } else if (propertyCost !== 'XZ_FINANCE' && propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE') {
                                                    propertyCost && dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', propertyCostList.get(0)))
                                                }
                                        }
                                    }}
                                >
                                    {projectList.map((v, i) =>
                                        <Option
                                            key={v.get('uuid')}
                                            value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                            uuid={v.get('uuid')}
                                            projectProperty={v.get('projectProperty')}
                                            >
                                            {`${v.get('code') !== 'COMNCRD' && v.get('code') !== 'ASSIST' && v.get('code') !== 'MAKE' && v.get('code') !== 'INDIRECT' && v.get('code') !== 'MECHANICAL' ?v.get('code'):''} ${v.get('name')}`}
                                        </Option>
                                    )}
                                </Select>

                            }
                            <div className='chosen-word'
                                onClick={() => {
                                    dispatch(editCalculateActions.getProjectAllCardList(projectRange,'showSingleModal',false,true,'',true,true,true,true,1))
                                    this.setState({
                                        showSingleModal:true
                                    })
                            }}>选择</div>
                        </div>

                    </div> : ''
                }
                <div className="edit-running-modal-list-item">
                    <label>金额：</label>
                    <div>
                        <NumberInput value={amount}
                            onChange={(e) =>{
                                numberTest(e,(value) => {
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'amount', value))
                                })
                            }}
                         />
                    </div>
                </div>


                <div className='accountConf-separator'></div>

                {
                    // <SingleModal
                    //     dispatch={dispatch}
                    //     showSingleModal={showSingleModal}
                    //     MemberList={memberList}
                    //     selectThingsList={selectThingsList}
                    //     thingsList={thingsList}
                    //     selectedKeys={selectedKeys}
                    //     title={'选择项目'}
                    //     selectFunc={(code,name,cardUuid,projectProperty) => {
                    //         dispatch(editCalculateActions.changeEditCalculateCommonState('DepreciationTemp', 'projectCard', fromJS({cardUuid,name,code,amount})))
                    //         dispatch(editRunningActions.changeLrAccountCommonString('',['flags','showSingleModal'], false))
                    //         switch(code) {
                    //             case 'ASSIST':
                    //                 dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_FZSCCB'))
                    //                 break
                    //             case 'MAKE':
                    //                 dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_ZZFY'))
                    //                 break
                    //             case 'INDIRECT':
                    //                 dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JJFY'))
                    //                 break
                    //             case 'MECHANICAL':
                    //                 dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JXZY'))
                    //                 break
                    //             default:
                    //                 if (projectProperty === 'XZ_PRODUCE') {
                    //                     dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_SCCB'))
                    //                 }else if (projectProperty === 'XZ_CONSTRUCTION') {
                    //                     dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_HTCB'))
                    //                 } else if (propertyCost !== 'XZ_FINANCE' && propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE') {
                    //                     propertyCost && dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', propertyCostList.get(0)))
                    //                 }
                    //         }
                    //     }}
                    //     selectListFunc={(uuid,level) => {
                    //         if(uuid === 'all'){
                    //             dispatch(editRunningActions.getProjectAllCardList(projectRange,'showSingleModal',false,true))
                    //         } else {
                    //             dispatch(editRunningActions.getProjectSomeCardList(uuid,level))
                    //         }
                    //     }}
                    // />
                }


                <StockSingleModal
                    dispatch={dispatch}
                    showSingleModal={showSingleModal}
                    MemberList={memberList}
                    selectThingsList={selectThingsList}
                    thingsList={thingsList}
                    selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
                    stockCardList={fromJS([projectCard.toJS()])}
                    title={'选择项目'}
                    selectFunc={(item, cardUuid) => {
                        const code = item.code
                        const name = item.name
                        const projectProperty = item.projectProperty
                        dispatch(editCalculateActions.changeEditCalculateCommonState('DepreciationTemp', 'projectCard', fromJS({cardUuid,name,code,amount})))
                        this.setState({
                            showSingleModal: false,
                        })
                        switch(code) {
                            case 'ASSIST':
                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_FZSCCB'))
                                break
                            case 'MAKE':
                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_ZZFY'))
                                break
                            case 'INDIRECT':
                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JJFY'))
                                break
                            case 'MECHANICAL':
                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JXZY'))
                                break
                            default:
                                if (projectProperty === 'XZ_PRODUCE') {
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_SCCB'))
                                }else if (projectProperty === 'XZ_CONSTRUCTION') {
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_HTCB'))
                                } else if (propertyCost !== 'XZ_FINANCE' && propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE') {
                                    propertyCost && dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', propertyCostList.get(0)))
                                }
                        }
                    }}

                    selectListFunc={(uuid, level) => {
                        if(uuid === 'all'){
                            dispatch(editCalculateActions.getProjectAllCardList(projectRange,'showSingleModal',false,true,'',true,true,true,true,1))
                        } else {
                            dispatch(editCalculateActions.getProjectSomeCardList(uuid,level,'',1))
                        }
                        this.setState({
                            selectTreeUuid: uuid,
                            selectTreeLevel: level
                        })

                    }}
                    cancel={() => {
                        this.setState({
                            showSingleModal: false
                        })
                    }}
                    cardPageObj={cardPageObj}
                    paginationCallBack={(value)=>{
                        if(selectTreeUuid === 'all'){
                            dispatch(editCalculateActions.getProjectAllCardList(projectRange,'showSingleModal',false,true,'',true,true,true,true,value))
                        } else {
                            dispatch(editCalculateActions.getProjectSomeCardList(selectTreeUuid,selectTreeLevel,'',value))
                        }
                    }}
                />
            </div>)
    }
}

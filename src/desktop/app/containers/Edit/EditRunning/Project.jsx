import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import Input from 'app/components/Input'
import { Select, message, Divider } from 'antd'
import { Icon } from 'app/components'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg, CommonProjectTest, ProductProjectTest, projectCodeTest } from './common/common'
import SingleModal  from './SingleModal'
import AddCardModal from 'app/containers/Config/Project/AddCardModal.jsx'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

@immutableRenderDecorator
export default
class Project extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
		}
	}
    componentWillReceiveProps(nextprops) {
        const newProjectCardList = nextprops.projectCardList
        const oriTemp = nextprops.oriTemp
        const { projectCardList, dispatch } = this.props
        const propertyCost = oriTemp.get('propertyCost')
        const propertyCostList = oriTemp.get('propertyCostList')
        if (projectCardList !== newProjectCardList) {
            const code = newProjectCardList.getIn([0,'code'])
            const projectProperty = newProjectCardList.getIn([0,'projectProperty'])
            switch(code) {
                case 'ASSIST':
                    dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_FZSCCB'))
                    break
                case 'MAKE':
                    dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_ZZFY'))
                    break
                case 'INDIRECT':
                    dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_JJFY'))
                    break
                case 'MECHANICAL':
                    dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_JXZY'))
                    break
                default:
                    if (projectProperty === 'XZ_PRODUCE') {
                        dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_SCCB'))
                    } else if (projectProperty === 'XZ_CONSTRUCTION') {
                        dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_HTCB'))
                    } else if (propertyCost !== 'XZ_FINANCE' && propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE' && projectProperty) {
                        propertyCost && dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', propertyCostList.get(0)))
                    }
            }
        }
    }
    render() {
        const {
            projectCardList,
            usedProject,
            projectList,
            dispatch,
            beProject,
            amount,
            taxRate,
            beAccrued,
            oriState,
            showSingleModal,
            MemberList,
            selectThingsList,
            thingsList,
            oriTemp,
            flags,
            moduleInfo,
            projectRange=oriTemp.get('projectRange'),
            insertOrModify
        } = this.props
        const { showCardModal } = this.state
        const selectedKeys = flags.get('selectedKeys')
        const currentCardType = flags.get('currentCardType')
        const pageCount = flags.get('pageCount')
        const categoryType = oriTemp.get('categoryType')
        const propertyCarryover = oriTemp.get('propertyCarryover')
        const stockStrongList = oriTemp.get('stockStrongList')
        const carryoverStrongList = oriTemp.get('carryoverStrongList')
        const strongList = oriTemp.get('strongList')
        const propertyCostList = oriTemp.get('propertyCostList')
        const propertyCost = oriTemp.get('propertyCost')
        const newProjectRange = oriTemp.get('newProjectRange') || fromJS([])
        return(
            <div>
                {
                    usedProject && ProductProjectTest(categoryType,newProjectRange)?
                     projectCardList.map((v,i) =>
                     <div key={i} className='project-content-area' style={projectCardList.size>1?{}:{border:'none',marginBottom:'0'}}>
                     <div className="edit-running-modal-list-item" >
                         <label>项目：</label>
                         <div className='chosen-right'>
                                 <XfnSelect
                                     combobox
                                     showSearch
                                     disabled={stockStrongList.size && insertOrModify !== 'insert'}
                                     value={`${projectCodeTest(v.get('code'))} ${v.get('name')?v.get('name'):''}`}
                                     dropdownRender={menu => (
                                         <div>
                                             {menu}
                                             <Divider style={{ margin: '4px 0',display:projectRange.size?'':'none' }} />
                                             {
                                                 projectRange.size?
                                                 <div
                                                     style={{ padding: '8px', cursor: 'pointer' }}
                                                     onMouseDown={() => {
                                                         const showModal = () => {
                                                             this.setState({showCardModal: true})
                                                         }
                                                         dispatch(configCallbackActions.beforeRunningAddProjectCard(showModal, projectRange,'lrls'))
                                                     }}
                                                 >
                                                     <Icon type="plus" /> 新增项目
                                                 </div>:''
                                             }

                                         </div>
                                    )}
                                    onChange={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const uuid = valueList[0]
                                        const code = valueList[1]
                                        const name = valueList[2]
                                        const amount = v.get('amount')
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['projectCardList',i], fromJS({cardUuid:uuid,name,code,amount,projectProperty:options.props.projectProperty})))

                                    }}
                                    >
                                     {
                                         CommonProjectTest(oriTemp,projectList).map((v, i) =>
                                             <Option
                                                 key={i}
                                                 value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                                 projectProperty={v.get('projectProperty')}
                                                 >
                                                 {`${projectCodeTest(v.get('code'))} ${v.get('name')}`}
                                             </Option>
                                     )}
                                 </XfnSelect>
                                 <div className='chosen-word'
                                     onClick={() => {
                                         if (stockStrongList.size) {
                                             return
                                         }
                                         dispatch(editRunningActions.getProjectAllCardList(projectRange,'showSingleModal'))
                                         dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'project'))
                                         this.setState({
                                             index:i,
                                             curAmount:v.get('amount')
                                         })

                                 }}>选择
                             </div>
                         </div>
                         {/* {
                            propertyCarryover !== 'SX_HW'
                         && categoryType !== 'LB_CQZC'
                         && categoryType !== 'LB_ZSKX'
                         && categoryType !== 'LB_ZFKX'?
                                <span className='icon-content'>
                                    <span>
                                        <XfIcon
                                            type="simple-plus"
                                            theme="outlined"
                                            onClick={() => {
                                                dispatch(editRunningActions.addProject(projectCardList,i))
                                                if (beProject && usedProject && projectCardList.size === 1) {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList',0,'amount'],amount))
                                                }
                                            }}
                                        />
                                    </span>
                                    {
                                        projectCardList.size >1 ?
                                            <span>
                                                <XfIcon
                                                    type="sob-delete"
                                                    theme="outlined"
                                                    onClick={() => {
                                                        dispatch(editRunningActions.deleteProject(projectCardList,i,taxRate))
                                                    }}
                                                />
                                            </span> : ''
                                    }

                                </span>:''
                        } */}
                     </div>
                     {
                         projectCardList.size >1 ?
                         <div className="edit-running-modal-list-item" >
                             <label>金额：</label>
                             <Input
                                 value={v.get('amount')}
                                 onChange={(e) => {
                                     numberTest(e,value => {
                                         dispatch(editRunningActions.changeLrAccountCommonString('ori', ['projectCardList',i,'amount'], value))
                                         dispatch(editRunningActions.autoCalculateProjectAmount())
                                         taxRate && dispatch(editRunningActions.changeAccountTaxRate())
                                     },categoryType === 'LB_FYZC')
                                 }}
                             />

                         </div>:''
                     }
                     </div>
                 ):null
                }
                <AddCardModal
                    showModal={showCardModal}
                    closeModal={() => this.setState({showCardModal: false})}
                    dispatch={dispatch}
                    moduleInfo={moduleInfo}
                    fromPage='editRunning'
                />
                {
                    showSingleModal && currentCardType === 'project'?
                    <SingleModal
                        pageCount={pageCount}
                        dispatch={dispatch}
                        showSingleModal={showSingleModal && currentCardType === 'project'}
                        MemberList={MemberList}
                        selectThingsList={selectThingsList}
                        thingsList={CommonProjectTest(oriTemp,thingsList)}
                        selectedKeys={selectedKeys}
                        title={'选择项目'}
                        selectFunc={(code,name,cardUuid,projectProperty) => {
                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList',this.state.index],fromJS({ code, name, cardUuid, amount:this.state.curAmount, projectProperty })))
                            dispatch(editRunningActions.changeLrAccountCommonString('',['flags','showSingleModal'], false))
                        }}
                        selectListFunc={(uuid,level,currentPage,condition) => {
                            if (uuid === 'all') {
                                dispatch(editRunningActions.getProjectAllCardList(projectRange,'showSingleModal',true,currentPage,condition))
                            } else {
                                dispatch(editRunningActions.getProjectSomeCardList(uuid,level,currentPage,condition))
                            }
                        }}
                    />:''
                }

            </div>

        )
    }
}

import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Icon, Single, Switch, ChosenPicker, XfInput } from 'app/components'

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
        visible: false,
        idx: -1,
        categoryValue: 'ALL',
    }
    render () {
        const {
            dispatch,
            oriState,
            projectCategoryList,
            projectList,
            commonProjectList,
            projectCardList,
            hasSelect
        } = this.props
        const { isAll, visible, idx, categoryValue } = this.state


        let categoryList = []
        projectCategoryList && projectCategoryList.map(v => {
            categoryList.push(v.toJS())
        })
        loop(categoryList)
        categoryList.unshift({key: 'ALL', label: '全部', childList: []})

        let cardArr = isAll ? projectList.toJS() : commonProjectList.toJS()
        const projectCardUuidList = projectCardList.map(v => v.get('cardUuid'))
        cardArr.map(v => {
            v['name'] = v['key']
            if (projectCardUuidList.includes(v['uuid']) && v['code'] != 'COMNCRD') {
                v['disabled'] = true
            }
        })

        const isOne = projectCardList.size == 1 ? true : false
        const onOk = (dataType, value, idx) => dispatch(editRunningActions.changeGgfyftProjectCard(dataType, value, idx))

        // STATE_FZSCCB STATE_ZZFY STATE_JJFY STATE_JXZY

        return (
            <div className='lrls-card'>
                <ChosenPicker
                    className='lrls-single'
                    type='card'
                    visible={visible}
                    multiSelect={true}
                    title='请选择项目'
                    district={categoryList}
                    cardList={cardArr}
                    value={categoryValue}
                    onChange={(value) => {
                        this.setState({categoryValue: value.key})
                        if (value.key=='ALL') {
                            this.setState({isAll: true})
                            return
                        }
                        this.setState({isAll: false})
                        dispatch(editRunningActions.getProjectListByCategory(value))
                    }}
                    onOk={value => {
                        if (value.length==0) { return }
                        onOk('card', value, idx)
                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                  <span></span>
               </ChosenPicker>

               {
                   projectCardList.map((v, i) => {
                       const code = v.get('code')
                       const name = v.get('name')
                       const propertyCost = v.get('propertyCost')

                       let showName = `${code} ${name}`
                       if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(code)) {
                           showName = {'COMNCRD': '损益公共项目', 'ASSIST': '辅助生产成本', 'MAKE': '制造费用', 'INDIRECT': '间接费用', 'MECHANICAL': '机械作业'}[code]
                       }

                       let propertyCostName = '请选择费用性质'
                       if (propertyCost) {
                           propertyCostName = {'XZ_SALE': '销售费用', 'XZ_MANAGE': '管理费用', 'XZ_FINANCE': '财务费用'}[propertyCost]
                       }

                       return (
                           <div key={i}  style={{paddingBottom: isOne ? '0' : '10px'}}>
                               <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                                   <span>项目({i+1})</span>
                                   <span
                                       className='lrls-blue'
                                       style={{display: isOne ? 'none' : ''}}
                                       onClick={() => {
                                           onOk('delete', '', i)
                                       }}
                                   >
                                       删除
                                   </span>
                               </div>

                               <div className='lrls-more-card lrls-bottom'>
                                   <label>项目:</label>
                                   <div className='lrls-single'
                                       onClick={()=>{
                                           this.setState({
                                               visible: true,
                                               idx: i,
                                               isAll: true
                                           })
                                       }}
                                   >
                                       <Row className='lrls-category lrls-padding'>
                                           {
                                               v.get('cardUuid') ? <span>{showName}</span>
                                               : <span className='lrls-placeholder'>点击选择项目</span>
                                           }
                                           <Icon type="triangle" />
                                       </Row>
                                   </div>
                               </div>

                               <Row className='lrls-more-card lrls-bottom' style={{display: code=='COMNCRD' ? '' : 'none'}}>
                                   <label>费用性质: </label>
                                   <Single
                                       className='lrls-single'
                                       district={[{key: '销售费用', value: 'XZ_SALE'}, {key: '管理费用', value: 'XZ_MANAGE'}, {key: '财务费用', value: 'XZ_FINANCE'}]}
                                       value={propertyCost}
                                       onOk={value => {
                                            onOk('propertyCost', value.value, i)
                                       }}
                                   >
                                       <Row className='lrls-padding lrls-category'>
                                           <span className={['请选择费用性质'].includes(propertyCostName) ? 'lrls-placeholder' : ''}>
                                               { propertyCostName }
                                           </span>
                                           <Icon type="triangle" />
                                       </Row>
                                   </Single>
                               </Row>

                               <Row className='lrls-more-card lrls-bottom'>
                                   <label>分摊金额：</label>
                                   <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
                                        disabled={!hasSelect}
                                        placeholder='填写分摊金额'
                                        value={v.get('amount')}
                                        onChange={(value) => {
                                            onOk('amount', value, i)
                                        }}
                                   />
                               </Row>

                               <Row className='lrls-more-card lrls-bottom'>
                                   <label>分摊占比：</label>
                                   <XfInput.BorderInputItem
                                        mode='amount'
                                        disabled={!hasSelect}
                                        placeholder='填写占比率'
                                        value={v.get('percent')}
                                        onChange={(value) => {
                                            onOk('percent', value, i)
                                       }}
                                   />
                                   <span className='lrls-margin-left'>%</span>
                               </Row>
                           </div>
                       )
                   })
               }
               <div className='lrls-more-card' style={{fontWeight: 'bold'}}>
                   <div></div>
                   <div className='lrls-blue'
                       onClick={() => {
                           this.setState({ visible: true, idx: projectCardList.size, isAll: true })
                       }}
                   >
                       +添加项目
                   </div>
               </div>

            </div>

        )
    }
}

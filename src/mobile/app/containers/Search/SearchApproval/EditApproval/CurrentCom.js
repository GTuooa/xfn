import React, { Component }  from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { Row, ChosenPicker, Icon, Switch } from 'app/components'
import thirdParty from 'app/thirdParty'

import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'
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
//往来单位组件
export default class CurrentCom extends Component {
    // static contextTypes = { router: PropTypes.object }
    state = {
        isAll: true,
        categoryValue: 'ALL'
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.categoryType != nextProps.categoryType) {
            this.setState({categoryValue: 'ALL', isAll: true,})
        }
    }

    render () {
        const {
            dispatch,
            beContact,
            contactsRange,
            currentCardList,
            strongListSize,
            contactSourceCategoryList,
            contactSourceCardList,
        } = this.props
        const { isAll, categoryValue } = this.state
        // const { router } = this.context
        //noInsert 不需要新增卡片  true-不需要（收付管理）

        const cardObj = currentCardList.get(0)
        let noInsert = false, payOrReceive = 'payAndReceive', disabled = strongListSize
        let showSwitch = true

        let categoryList = [{uuid: 'ALL', name: '全部', childList: []}]
        contactSourceCategoryList && contactSourceCategoryList.map(v => {
            categoryList.push(v.toJS())
        })
        loop(categoryList)
        
        let cardArr = contactSourceCardList ? contactSourceCardList.toJS() : []
        cardArr.map(v => {
            v['cardName'] = v.name
            v['key'] = `${v.code} ${v.name}`
            v['name'] = v.key
        }) 

        return (
            <div className='lrls-card lrls-more-card' style={{height: '.45rem'}}>
                <label>{showSwitch && !beContact ? '往来单位' : '往来单位:'}</label>
                {
                    showSwitch && !beContact ? null :
                    <ChosenPicker
                        className='lrls-single'
                        type='card'
                        title='请选择往来单位'
                        icon={{
                            type: 'current-add',
                            onClick: () => {
                                if (contactsRange.size) {
                                    dispatch(editRunningConfigActions.beforeAddManageTypeCardFromEditRunning(contactsRange, '', 'searchApproval'))
                                } else {
                                    thirdParty.toast.info('请选择往来范围')
                                }
                            }
                        }}
                        district={categoryList}
                        cardList={cardArr}
                        value={categoryValue}
                        cardValue={[cardObj ? cardObj.get('cardUuid') : '']}
                        onChange={(value) => {
                            
                            this.setState({categoryValue: value.key})
                            if (value.key=='ALL') {
                                dispatch(searchApprovalActions.getRelativeAllCardList(contactsRange, 'contact', true))
                                this.setState({isAll: true})
                                return
                            }
                            this.setState({isAll: false})
                            dispatch(searchApprovalActions.getRelativeSomeCardList(value.key, value.top === true ? 1 : ''))
                        }}
                        onOk={value => {
                            if (value.length==0) { return }

                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('contactList', fromJS([{
								uuid: value[0].uuid,
								code: value[0].code,
								type: "WLDW",
								name: value[0].cardName,
							}])))
                        }}
                    >
                        <Row className='lrls-category lrls-padding'>
                            {
                                cardObj ? <span> {`${cardObj.get('code')} ${cardObj.get('name')}`} </span>
                                : <span className='lrls-placeholder'>点击选择往来单位</span>
                            }
                            <Icon type="triangle" style={{color: disabled ? '#ccc' : '#666'}}/>
                        </Row>
                    </ChosenPicker>
                }
                <div className='noTextSwitch' style={{marginLeft: '.06rem'}}>
                    <Switch
                        checked={beContact}
                        onClick={() => {
                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('beContact', !beContact))
                        }}
                    />
                </div>
            </div>
        )
    }

}

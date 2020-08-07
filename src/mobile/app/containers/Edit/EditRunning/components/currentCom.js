import React, { Component }  from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { Row, ChosenPicker, Icon, Switch } from 'app/components'
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
//往来单位组件
export default class CurrentCom extends Component {
    state = {
        isAll: true,
        categoryValue: 'ALL'
    }

    componentDidMount() {
        this.props.dispatch(editRunningActions.changeLrlsData('commonCurrentList', fromJS([]), true))
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.categoryType != nextProps.categoryType) {
            this.setState({categoryValue: 'ALL', isAll: true,})
        }
    }

    render () {
        const {
            history,
            dispatch,
            oriState,
            isModify,
            categoryType,
            usedCurrent,
            currentList,
            contactsRange,
            currentCardList,
            strongListSize,
            stockStrongListSize,
            oriUsedCurrent,
            allContactsRange,
            commonCurrentList,
            isCopy,
            beAccrued } = this.props
        const { isAll, categoryValue } = this.state

        //noInsert 不需要新增卡片  true-不需要（收付管理）

        const cardObj = currentCardList.get(0)
        let noInsert = false, payOrReceive = 'payAndReceive', disabled = strongListSize
        let onChange = (value) => dispatch(editRunningActions.changeCurrentCardList(value))
        let showSwitch = true, showCurrent = true
        let switchClick = () => null
        if (isCopy) {
            disabled = false
        }

        switch (categoryType) {
            case 'LB_YYSR': {
                payOrReceive = 'receive'
                disabled = strongListSize || stockStrongListSize
                if (isCopy) {
                    disabled = false
                }
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                    if (isModify) return
                    dispatch(editRunningActions.getYysrYyzcAmount())
                }
                if (!isModify) {
                    switchClick = () => dispatch(editRunningActions.getYysrYyzcAmount())
                }
                break
            }
            case 'LB_YYZC': {
                payOrReceive = 'pay'
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                    if (isModify) return
                    dispatch(editRunningActions.getYysrYyzcAmount())
                }
                if (!isModify) {
                    switchClick = () => dispatch(editRunningActions.getYysrYyzcAmount())
                }
                break
            }
            case 'LB_FYZC': {
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                    if (isModify) return
                    dispatch(editRunningActions.getYysrYyzcAmount())
                }
                if (!isModify) {
                    switchClick = () => dispatch(editRunningActions.getYysrYyzcAmount())
                }
                break
            }
            case 'LB_ZSKX': {
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                }
                if (oriState === 'STATE_ZS_TH') {
                    showCurrent = false
                }
                break
            }
            case 'LB_ZFKX': {
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                }
                if (oriState === 'STATE_ZF_SH') {
                    showCurrent = false
                }
                break
            }
            case 'LB_JK': {
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                    if (oriState === 'STATE_JK_ZFLX') {
                        dispatch(editRunningActions.getJkPendingStrongList())
                    }
                }
                if (oriState=='STATE_JK_ZFLX') {
                    if (beAccrued) {
                        showCurrent = false
                    }
                    if (isModify && oriUsedCurrent) {
                        showCurrent = true
                    }
                    switchClick = () => dispatch(editRunningActions.getJkPendingStrongList())
                }
                break
            }
            case 'LB_TZ': {
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                    if (['STATE_TZ_SRGL', 'STATE_TZ_SRLX'].includes(oriState)) {
                        dispatch(editRunningActions.getTzPendingStrongList())
                    }
                }
                if (['STATE_TZ_SRGL', 'STATE_TZ_SRLX'].includes(oriState)) {
                    if (beAccrued) {
                        showCurrent = false
                    }
                    if (isModify && oriUsedCurrent) {
                        showCurrent = true
                    }
                    switchClick = () => dispatch(editRunningActions.getTzPendingStrongList())
                }
                break
            }
            case 'LB_ZB': {
                onChange = (value) => {
                    dispatch(editRunningActions.changeCurrentCardList(value))
                    if (oriState === 'STATE_ZB_ZFLR') {
                        dispatch(editRunningActions.getZbPendingStrongList())
                    }
                }
                if (oriState=='STATE_ZB_ZFLR') {
                    if (beAccrued) {
                        showCurrent = false
                    }
                    if (isModify && oriUsedCurrent) {
                        showCurrent = true
                    }
                    switchClick = () => dispatch(editRunningActions.getZbPendingStrongList())
                }
                break
            }
            case 'LB_SFGL': {
                showCurrent = false
                break
            }
            default: null
        }

        let categoryList = [{uuid: 'ALL', name: '全部', childList: []}]
        allContactsRange && allContactsRange.map(v => {
            categoryList.push(v.toJS())
        })
        loop(categoryList)

        let cardArr = isAll ? currentList.toJS() : commonCurrentList
        cardArr.map(v => {
            v['name'] = v['key']
        })

        return (
            <div className='lrls-card lrls-more-card' style={{height: '.45rem', display: showCurrent ? '' : 'none'}}>
                <label>{showSwitch && !usedCurrent ? '往来单位' : '往来单位:'}</label>
                {
                    showSwitch && !usedCurrent ? null :
                    <ChosenPicker
                        className='lrls-single'
                        type='card'
                        title='请选择往来单位'
                        icon={{
                                type: 'current-add',
                                onClick: () => {
                                    dispatch(editRunningConfigActions.beforeAddManageTypeCardFromEditRunning(contactsRange, history))
                                }
                            }}
                        disabled={disabled}
                        district={categoryList}
                        cardList={cardArr}
                        value={categoryValue}
                        cardValue={[cardObj ? cardObj.get('cardUuid') : '']}
                        onChange={(value) => {
                            this.setState({categoryValue: value.key})
                            if (value.key=='ALL') {
                                this.setState({isAll: true})
                                return
                            }
                            this.setState({isAll: false})
                            dispatch(editRunningActions.getCurrentListByCategory(value))
                        }}
                        onOk={value => {
                            if (value.length==0) { return }
                            onChange(value[0]['value'])
                        }}
                    >
                        <Row className='lrls-category lrls-padding'>
                            {
                                cardObj ? <span> {`${cardObj.get('code')} ${cardObj.get('name')}`} </span>
                                : <span className='lrls-placeholder'>点击选择往来单位</span>
                            }
                            <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
                        </Row>
                    </ChosenPicker>
                }
                <div className='noTextSwitch' style={{marginLeft: '6px', display: showSwitch ? '' : 'none'}}>
                    <Switch
                        checked={usedCurrent}
                        disabled={disabled}
                        onClick={() => {
                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], !usedCurrent))
                            switchClick()
                        }}
                    />
                </div>
            </div>
        )
    }

}

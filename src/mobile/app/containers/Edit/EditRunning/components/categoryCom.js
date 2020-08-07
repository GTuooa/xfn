import React, { Component }  from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { Row, Icon, ChosenPicker } from 'app/components'
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

//流水类别组件
export default class CategoryCom extends Component {
    state = {
        visible: false,
    }
    componentDidMount () {
        const prevPage = sessionStorage.getItem('prevPage')
		if (['home', 'searchrunning', 'runningpreview'].includes(prevPage)) {//从主页 查询流水 预览流水新增流水
            this.setState({visible: true})
        }
    }

    render() {

        const {
            disabled,
            isModify,
            lastCategory,
            categoryUuid,
            categoryName,
            dispatch,
            scale,
            categoryType,
            isOpenedWarehouse,
            openQuantity
        } = this.props
        const { visible } = this.state

        //屏蔽转出未交增值税
        let categoryList = lastCategory.toJS()
        /*categoryList.map(v => {
            if (v['uuid']=='内部核算') {
                v['childList'] = v['childList'].filter(w => {
                    let shouldReturn = true
                    if (w['categoryType'] == 'LB_ZCWJZZS') {
                        shouldReturn = false
                    }
                    if (scale == 'small' && w['categoryType'] == 'LB_FPRZ') {
                        shouldReturn = false
                    }
                    if (scale == 'isEnable' && ['LB_FPRZ', 'LB_KJFP'].includes(w['categoryType'])) {
                        shouldReturn = false
                    }
                    // if (w['categoryType'] == 'LB_CHZZ') {
                    //     shouldReturn = false
                    // }
                    if (w['categoryType'] == 'LB_CHDB') {
                        shouldReturn = isOpenedWarehouse
                    }
                    if (w['categoryType'] == 'LB_CHYE') {
                        shouldReturn = openQuantity || isOpenedWarehouse
                    }
                    if (w['categoryType'] == 'LB_SFGL') {
                        shouldReturn = false
                    }
                    if (['small', 'isEnable'].includes(scale) && w['categoryType'] == 'LB_JXSEZC') {
                        shouldReturn = false
                    }
                    return shouldReturn
                })
            }
        })*/

        //费用支出允许修改类别
        if (isModify && !disabled) {
            categoryList = categoryList.filter(v => ['LB_YYSR', 'LB_YYZC', 'LB_FYZC', 'LB_YYWSR', 'LB_YYWZC', 'LB_ZSKX', 'LB_ZFKX'].includes(v['categoryType']))
        }

        loop(categoryList)

        return (
            <Row className='lrls-type'>
                <label>流水类别:</label>
                <ChosenPicker
                    visible={visible}
                    disabled={disabled}
					district={categoryList}
                    value={categoryUuid}
					onChange={(item) => {
                        if (!isModify) {//新增
                            dispatch(editRunningActions.changeLrlsEnclosureList())
                        }
						if (item['canShow']) {
							const value = item['uuid']
							dispatch(editRunningActions.getCardDetail(value, isModify))
						} else {//核算管理
							dispatch(editRunningActions.toManageType(item))
						}
                        this.setState({visible: false})
					}}
                    onCancel={()=> { this.setState({visible: false}) }}
				>
                    <Row>
                        <span style={{color: categoryName == '请选择类别' ? '#ccc' : ''}}>{categoryName}</span>
                        <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
                    </Row>
                </ChosenPicker>
            </Row>
        )
    }
}

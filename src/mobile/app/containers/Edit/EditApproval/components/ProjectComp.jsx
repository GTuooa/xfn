import React,{ Fragment } from 'react'
import { Row, Icon, ChosenPicker, Single, DatePicker } from 'app/components'
import CommonRow from './CommonRow'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import { commonCode } from '../common'
import PropTypes from 'prop-types'
import * as projectConfActions from 'app/redux/Config/Project/projectConf.action.js'

export default
class ProjectComp extends React.Component {
    state = {
        visible: false,
        categoryValue:'ALL'
    }
    loop = (data) => {
        data.forEach(v => {
            v['key'] = v['uuid']
            v['label'] = v['name']
            if (v['childList'].length) {
                this.loop(v['childList'])
            }
        })
    }
    componentDidMount() {
        const selectValueScope = this.props.item.get('selectValueScope')
        const { idx, isMx } = this.props
        const needDispatch  = idx === 0 || !isMx
        needDispatch && this.props.dispatch(editApprovalActions.getApprovalProjectList(selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
        needDispatch && this.props.dispatch(editApprovalActions.getApprovalProjectCard('ALL',true,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
    }
    render() {
        const {
            disabled,
            district,
            dispatch,
            item,
            cardList,
            index,
            onChange,
            history,
            isMx,
            placeArr,
            itemList,
            size,
            innerIndex
        } = this.props
        const {
            categoryValue,
            visible
        } = this.state
        const selectValueScope = item.get('selectValueScope')
        let districtJ = district.toJS()
        let cardListJ = cardList.toJS().map(v => commonCode(v)?{...v,label:v.name}:({...v,name:`${v.code} ${v.name}`,label:v.name}))
        const value = item.get('value') || ''
        districtJ.unshift({name:'全部',key:'ALL',uuid:'ALL',childList:[]})
        this.loop(districtJ)
        return (
            <ChosenPicker
                type={'card'}
                visible={visible}
                disabled={disabled}
                district={districtJ}
                cardList={cardListJ}
                value={categoryValue}
                onChange={value => {
                    this.setState({categoryValue:value.key})
                    dispatch(editApprovalActions.getApprovalProjectCard(value.key,value.top,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))

                }}
                icon={{
                        type: 'project-add',
                        onClick: () => {
                            dispatch(editApprovalActions.beforeInsertProjectCard())
                            dispatch(editApprovalActions.changeModelString(['modelInfo','callback'],(item) => {
                                if (isMx && value) {
                                    const curItem = itemList.get(0).map(v => v.set('value','').set('name','').set('code',''))
                                    const newList = curItem.setIn([innerIndex,'value'],`${item.code}-${item.name}`)
                                                            .setIn([innerIndex,'code'],item.code)
                                                            .setIn([innerIndex,'name'],item.name)
                                    dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList',size],newList))
                                } else {
                                    onChange(`${item.code}-${item.name}`)
                                    dispatch(editApprovalActions.changeModelString([...placeArr,'code'],item.code))
                                    dispatch(editApprovalActions.changeModelString([...placeArr,'name'],item.name))
                                }

                            }))
                            history.push('/config/project/projectCard')
                        }
                    }}
                onOk={value => {
                    onChange(commonCode(value[0])? value[0].label : `${value[0].code}-${value[0].label}`)
                    dispatch(editApprovalActions.changeModelString([...placeArr,'code'],value[0].code))
                    dispatch(editApprovalActions.changeModelString([...placeArr,'name'],value[0].label))
                }}
                onCancel={()=> { this.setState({visible: false}) }}
            >
                <CommonRow
                    StarDisabled={!item.get('required')}
                    value={value.replace('-',' ')}
                    label={item.get('label')}
                    placeHolder={item.get('placeHolder')}
                    onDelete={() => {
                        onChange(``)
                    }}
                />
            </ChosenPicker>
        )
    }
}

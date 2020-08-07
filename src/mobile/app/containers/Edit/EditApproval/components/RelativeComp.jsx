import React,{ Fragment } from 'react'
import { Row, Icon, ChosenPicker, Single, DatePicker } from 'app/components'
import CommonRow from './CommonRow'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import * as relativeConfAction from 'app/redux/Config/Relative/relativeConf.action.js'

export default
class RelativeComp extends React.Component {
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
    lastArr = () => {
        const lastPlaceArr = [...this.props.placeArr]
        lastPlaceArr.length = lastPlaceArr.length -1
        lastPlaceArr.push(this.props.size)
        return lastPlaceArr
    }
    componentDidMount() {
        const selectValueScope = this.props.item.get('selectValueScope')
        const { idx, isMx } = this.props
        const needDispatch  = idx === 0 || !isMx
        needDispatch && this.props.dispatch(editApprovalActions.getApprovalCurrentList(selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
        needDispatch && this.props.dispatch(editApprovalActions.getApprovalCurrentCard('ALL',true,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
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
            modelInfo,
            history,
            isMx,
            placeArr,
            size,
            innerIndex,
            itemList
        } = this.props
        const {
            categoryValue,
            visible
        } = this.state

        const selectValueScope = item.get('selectValueScope')
        const modelCode = modelInfo.get('modelCode')
        let districtJ = district.toJS()
        let cardListJ = cardList.toJS().map(v => ({...v,name:`${v.code} ${v.name}`,label:v.name}))
        const value = item.get('value') || ''
        districtJ.unshift({name:'全部',key:'ALL',uuid:'ALL',childList:[]})
        this.loop(districtJ)
        return (
                <ChosenPicker
                    type={'card'}
                    title='请选择往来单位'
                    visible={visible}
                    disabled={disabled}
                    district={districtJ}
                    cardList={cardListJ}
                    value={categoryValue}
                    icon={{
                            type: 'current-add',
                            onClick: () => {
                                const showCardModal = () => {
                                    history.push('/config/relative/relativeCardInsert')
                                }
                                dispatch(editApprovalActions.changeModelString(['modelInfo','callback'],(item) => {
                                    if (isMx && value) {
                                        const curItem = itemList.get(0).map(v => v.set('value','').set('name','').set('code',''))
                                        const newList = curItem.setIn([innerIndex,'value'],`${item.code}-${item.name}`)
                                                                .setIn([innerIndex,'code'],item.code)
                                                                .setIn([innerIndex,'name'],item.name)
                                        dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList',size],newList))
                                    }   else {
                                        onChange(`${item.code}-${item.name}`)
                                        dispatch(editApprovalActions.changeModelString([...placeArr,'code'],item.code))
                                        dispatch(editApprovalActions.changeModelString([...placeArr,'name'],item.name))
                                    }
                                }))
                                dispatch(editApprovalActions.beforeAddManageTypeCard(showCardModal,'insert'))
                            }
                        }}
                    onChange={value => {
                        this.setState({categoryValue:value.key})
                        dispatch(editApprovalActions.getApprovalCurrentCard(value.key,value.top,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))

                    }}
                    onOk={value => {
                        onChange(`${value[0].code}-${value[0].label}`)
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

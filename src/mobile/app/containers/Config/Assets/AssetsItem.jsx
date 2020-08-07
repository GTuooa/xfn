import React, { PropTypes } from 'react'
import { List, fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Checkbox } from 'app/components'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

@immutableRenderDecorator
export default
class AssetsItem extends React.Component {

    render() {
        const {
            assetsitem,
            allModifyButtonDisplay,
            isExpanded,
            dispatch,
            style,
            assetslist,
            assetsCheckboxDisplay,
            isEnd,
            history
        } = this.props

        const serialNumber = assetsitem.get('serialNumber')
        const serialName = assetsitem.get('serialName')
        const cardNumber = serialNumber.substr(3, 4)
        const classificationNumber = serialNumber.substr(0, 3)
        const hasSub = assetsitem.get('hasSub')
        const cardLabels = assetsitem.get('labels')

        const assetsitems = serialNumber.length === 1 ? assetslist.filter(v => v.get('serialNumber').indexOf(serialNumber) === 0 && v.get('serialNumber').length === 3) : fromJS([])
        // 获取新增辅助分类的编码
        const newSerialNumber = assetsitems.size === 0 ? `${serialNumber}01` : Number(assetsitems.getIn([-1, 'serialNumber'])) + 1

        return (
            <div className="assets-item-wrap" style={style}>
                <div
                    className="assets-item"
                    // style={style}
                    style={{borderBottom: isEnd ? '0' : ''}}
                    onClick={(e) => {
                        if (allModifyButtonDisplay) {
                            return
                        } else {
                            dispatch(assetsActions.toggleLowerAssets(serialNumber))
                        }
                    }}
                >
                    <div className="assets-item-plus">
                        <Icon
                            type="add-plus-fill"
                            size="18"
                            style={{display : allModifyButtonDisplay ? '' : 'none', color: !assetsitem.get('addclassification') ? '#bbb' : '', visibility: serialNumber.length >= 3 ? 'hidden' : 'visible', paddingRight: '10px', paddingTop: '2px'}}
                            onClick={() => {
                                if (assetsitem.get('addclassification')) {
                                    dispatch(assetsActions.beforeInsertClassification(serialNumber, newSerialNumber, serialName))
                                    history.push('/assets/assetsoption/category')
                                }
                            }}
                        />
                    </div>
                    <div className="assets-item-main">
                        {
                            assetsCheckboxDisplay ?
                                <Checkbox
                                    className="checkbox"
                                    style={{display: serialNumber.length === 1 ? 'none' : ''}}
                                    checked={assetsitem.get('checked')}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        dispatch(assetsActions.selectAssetsItem(assetsitem.get('idx')))
                                    }}
                                ></Checkbox> : ''
                        }
                        <span onClick={(e) => {
                            e.stopPropagation()
                            if (allModifyButtonDisplay) {
                                return
                            } else if (assetsCheckboxDisplay) {
                                dispatch(assetsActions.selectAssetsItem(assetsitem.get('idx')))
                            } else {
                                if (serialNumber.length === 7) {
                                    dispatch(assetsActions.getAssetsCardFetch(cardNumber, classificationNumber, history))
                                } else {
                                    dispatch(assetsActions.getclassificationFetch(classificationNumber))
                                    history.push('/assets/assetsoption/category')
                                }
                            }
                        }}>
                            <span className="assets-item-flag" style={{display: serialNumber.length !== 1 ? '' : 'none', width: serialNumber.length > 3 ? '0.2rem': '0.1rem', 'backgroundColor': serialNumber.length > 3 ? '#7E6B5C' : '#CFC0A6'}}></span>
                            {`${serialNumber.length === 7 ? serialNumber.substr(3) : serialNumber}_${serialName}`}
                        </span>
                    </div>
                    <span style={{display: serialNumber.length === 7 ? '' : 'none'}} className="assets-item-labels"><Icon type="label" style={{display: cardLabels ? '' : 'none'}}/>&nbsp;<span>{cardLabels ? cardLabels.split(',').join('；') : ''}</span></span>
                    <div className="assets-item-other" >
                        <Icon type="arrow-down" style={{color: '#666', display : hasSub && !allModifyButtonDisplay ? '' : 'none', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}}/>
                    </div>
                </div>
            </div>
        )
    }
}

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { List, toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './Assets.less'
import { TextInput, Icon } from 'app/components'
import { browserNavigator } from 'app/utils'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

@immutableRenderDecorator
export default
class LabelInput extends React.Component {

    render() {
        const { dispatch, showSelectlabel, label, selectLabeList, selectLabeListAllDisplay, scrollViewRef } = this.props
        // Bool标志：是否显示全部的标签列表
        const someSelectLabelList = selectLabeList.size<8 ? selectLabeList : selectLabeList.slice(0, 8)
        // console.log('selectLabeList-----:', selectLabeList.toJS())
        return (
            <div className="labelinput">
                <div className="labelinput-input">
                    <span className="input-label">标签</span>
                    {/* 数字 */}
                    <TextInput
                        type="text"
                        className="labelinput-input-box"
                        ref="labelinputInputbox"
                        placeholder="!输入多个标签用空格分开"
                        value={label.join(' ')}
                        onClick={(e) => {
                            // 禁止事件冒泡
                            e.stopPropagation()
                            // 使页面向上移动以致标签栏不会被输入法遮挡住
                            // 然而iOS对输入事件做了优化会自动将输入框滑动至视口中部，
                            // 所以针对于android客户端进行了输入框的滑动设置。又然而这样做导致iOS的滑动优化出现问题，
                            // 所以单独对android客户端进行体验优化
                            if (browserNavigator.versions.android) {
                                const el = ReactDOM.findDOMNode(scrollViewRef)
                                el.scrollTop = e.target.offsetTop - 40
                            }
                            dispatch(assetsActions.changeSelectLabelStatus(true))
                            // 只有当标签列表处于显示状态，点击input输入框时会让标签列表全部展开
                            if (showSelectlabel && selectLabeListAllDisplay) {
                                dispatch(assetsActions.changeSelectLabeListAllDisplay())
                            }
                            // 设置光标的位置
                            e.target.setSelectionRange(e.target.value.length, e.target.value.length)
                        }}
                        onChange={value => dispatch(assetsActions.changeLabelInput(value, label))}
                    />
                </div>
                <div
                    className="tab-title-list"
                    // className="labelinput-select"
                    style={{display: showSelectlabel && selectLabeList.size > 0 ? '' : 'none'}}
                    onClick={() => {
                        dispatch(assetsActions.changeSelectLabelStatus(true))
                    }}
                >
                    {/* ['红街店', '总经办', '明月刀明月刀', '张无忌', '圣后', '梦想小镇互联网村', '丁桥店', '总部'] */}
                    <div className="tab-title">
                        {
                            (selectLabeListAllDisplay ? selectLabeList : someSelectLabelList).map((v, i) => {
                                return (
                                    <span
                                        className={
                                            //标签选择栏中标签被选中的样式的改变
                                            `tab-title-item${label.indexOf(v) === -1 ? '' : ' selected'}`
                                        }
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            dispatch(assetsActions.changeLabelFromSelect(v, label))
                                            // let labelinput = ReactDOM.findDOMNode(this.refs['labelinputInputbox'])
                                            // labelinput.scrollLeft = labelinput.offsetLeft
                                        }}
                                    >{v}</span>
                                )
                            })}
                        <span
                            className="tab-title-item tab-title-item-morebtn"
                            style={{display: selectLabeList.size < 8 ? 'none' : ''}}
                            onClick={(e) => {
                                e.stopPropagation()
                                dispatch(assetsActions.changeSelectLabeListAllDisplay())
                            }}
                        >{selectLabeListAllDisplay ? '收拢' : '展开'}&nbsp;<Icon style={{transform: selectLabeListAllDisplay ? 'rotate(180deg)' : 'rotate(0)'}} type="unfold" size="10"/></span>
                    </div>
                </div>
            </div>
        )
    }
}

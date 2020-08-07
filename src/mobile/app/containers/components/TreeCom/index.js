import React from 'react'
import { toJS, fromJS } from 'immutable'
import { Icon, Checkbox } from 'app/components'
import SwapPosition from './SwapPosition'
import { Popover } from 'antd-mobile'
const Item = Popover.Item
import './style.less'

export default
class TreeCom extends React.Component {
    state = {
        showList: [],
        sortModal: false//上下移蒙层的显示
    }

    showListLoop (data, callBack) {
        data.map((item, index) => {
            if (item.get('childList').size > 0) {
                callBack(item.get('uuid'))
                this.showListLoop(item.get('childList'), callBack)
            }
        })
    }

    componentDidMount() {
        let showListOrigin = []
        this.showListLoop(this.props.treeList, (uuid) => showListOrigin.push(uuid))

        this.setState({'showList': showListOrigin})
    }

    componentWillReceiveProps(nextProps) {
        let showListOrigin = []
        this.showListLoop(nextProps.treeList, (uuid) => showListOrigin.push(uuid))

        this.setState({'showList': showListOrigin})
    }

    render() {
        const {
            dispatch,
            treeList,
            itemClick,
            isSort,//调整顺序
            isAdd,//新增
            addClick,//新增的回调
            isDelete,//删除
            deleteClick,//删除的回调
            sortClick,//上下移的回调
            mastLast//只可选中末级
        } = this.props

        const { showList, sortModal } = this.state

        const loop = (data, paddingLeft) => data.map((item, i) => {
            const name = item.get('name')
            const uuid = item.get('uuid')
            const checked = item.get('checked') ? true : false

            let overlay = []//调整顺序
            if (!(i == 0 || name == '未分类')) {
                overlay.push(<Item key="3" value="up" >上移</Item>)
            }
            if (!(i == data.size - 1 || data.getIn([i+1,'name'])=='未分类')) {
                overlay.push(<Item key="4" value="down" >下移</Item>)
            }

            const hasChild = item.get('childList') && item.get('childList').size ? true : false
            const showChild = hasChild ? showList.some(v => v === item.get('uuid')) : false
            let leveHolder = ''
            if (paddingLeft==2) { leveHolder = <span className='ac-flag' style={{width:'.1rem',backgroundColor:'#D1C0A5'}}></span> }
            if (paddingLeft==3) { leveHolder = <span className='ac-flag' style={{width:'.2rem',backgroundColor:'#7E6B5A'}}></span> }
            if (paddingLeft==4) { leveHolder = <span className='ac-flag' style={{width:'.3rem',backgroundColor:'#59493f'}}></span> }

				return (
					<div key={item.get('uuid')}>
						<div className='tree-com-type-list'>
							<div
                                className='tree-com-touch-range-name'
                                onClick={() => {
                                    if (isAdd) {//新增
                                        if (paddingLeft < 4) {
                                            addClick(uuid, name)
                                        }
                                    } else if (isDelete) {//删除
                                        deleteClick(uuid, name, !checked)
                                    } else if (isSort) {//调整顺序
                                        return
                                    } else {
                                        if (hasChild && mastLast) {
                                            return
                                        }
                                        let arr = showList
                                        if (showChild) {
                                            let idx = arr.findIndex(v => v === item.get('uuid'))
                                            arr.splice(idx, 1)
                                        } else {
                                            arr.push(item.get('uuid'))
                                        }
                                        this.setState({showList: arr})
                                    }
                                }}
                            >
                                <Checkbox
                                    checked={checked}
                                    disabled={name == '全部'}
                                    style={{'paddingRight': '4px', display: isDelete ? 'inline-block' : 'none'}}
                                />
                                <Icon
                                    type="add-small"
                                    className='add-type-icon'
                                    style={{display: isAdd ? 'block' : 'none', opacity: paddingLeft < 4 ? '1' : '0'}}
                                />
                                {
                                    name === '全部' ? ''
                                    : overlay.length === 0 ?
                                        <div className="swap-position-block" style={{display: isSort ? 'block' : 'none'}}></div>
                                    :
                                        <SwapPosition
                                            dispatch={dispatch}
                                            overlay={overlay}
                                            item={item}
                                            data={data}
                                            swapPosition={isSort}
                                            i={i}
                                            sortClick={sortClick}
                                            iconClick={(value) => this.setState({ sortModal: value })}
                                        />
                                }
                                {leveHolder}
                                <span
                                    className="tree-com-high-type-name"
                                    style={{ color: hasChild && mastLast ? '#999' : '' }}
                                    onClick={e => {
                                        e.stopPropagation()
                                        itemClick(uuid, name, item)
                                    }}
                                >
                                    {name}
                                </span>
                            </div>

                            {/* 下级三角 */}
                            <div className="tree-com-touch-range-icon" style={{display: hasChild ? '' : 'none'}}>
                                <Icon
                                    type="arrow-down"
                                    style={showChild ? {transform: 'rotate(180deg)'} : ''}
                                    onClick={() => {
                                        let arr = showList
                                        if (showChild) {
                                            let idx = arr.findIndex(v => v === item.get('uuid'))
                                            arr.splice(idx, 1)
                                        } else {
                                            arr.push(item.get('uuid'))
                                        }
                                        this.setState({showList: arr})
                                    }}
                                />
                            </div>
						</div>
						{hasChild && showChild ? loop(item.get('childList'), paddingLeft + 1) : ''}
					</div>
				)
		})


        return(
            <div className="config-tree-com">
                {loop(treeList, 1)}
                {/* 上下移动的蒙层 */}
                <div
                    className="choose-type"
                    style={{display: sortModal ? '' : 'none'}}
                    onClick={(e) => {
                        e.stopPropagation()
                        this.setState({ sortModal: false })
                    }}
                ></div>
            </div>
        )
    }
}

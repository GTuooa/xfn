import React, { Component } from 'react'
import { fromJS, toJS } from 'immutable'
import { Checkbox, Icon, TextListInput } from 'app/components'

import './style.less'

export default class Multiple extends Component {
    scrollView = ''
    listHeight = 0//一条卡片的高度
    pageSize = 50//滑动一次加载50个
    state = {
        show: false,
        checkedValueList: [],
        checkedKeyList: [],
        isSearch: false,
        searchValue: '',
        currentPage: 1,//卡片当前的页数
        isPreview: false,//预览全部选中的
        sortType: true//正序
    }
    componentDidMount () {
        this.scrollView = document.getElementsByClassName('scroll-view')//[0]
    }
    initState () {
        this.setState({
            show: false,
            checkedValueList: [],
            checkedKeyList: [],
            isSearch: false,
            searchValue: '',
            currentPage: 1,//卡片当前的页数
            isPreview: false,
            sortType: true//正序
        })
    }

    setDefault (value, district) {
        let checkedkeyListOrigin = []
        let checkedValueListOrigin = []
        if (value && value.length) {
            value.forEach(v => {
                checkedValueListOrigin.push(v)
                district.forEach(w => {
                    if (w['value']==v) {
                        checkedkeyListOrigin.push(w['key'])
                    }
                })
            })
        }

        this.setState({
            'checkedValueList': checkedValueListOrigin,
            'checkedKeyList': checkedkeyListOrigin,
        })

        if (this.scrollView) {
            for (let variable of this.scrollView) {
                variable.style['overflow-y']='hidden'
            }
        }
    }

    closeModal () {
        if (this.scrollView) {
            for (let variable of this.scrollView) {
                variable.style['overflow-y']='auto'
            }
        }
        this.initState()
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.visible != nextProps.visible && nextProps.visible) {
            this.setState({show: true})
            this.setDefault(nextProps.value, nextProps.district)
        } else if (this.props.visible != nextProps.visible) {
            this.initState()
        }
    }



    render() {
        const { district, value, title, onOk, disabled, className, visible, onCancel, showPreview, previewTitle } = this.props
        const { show, checkedValueList, checkedKeyList, isSearch, searchValue, currentPage, isPreview, sortType } = this.state

        //district [{key: '', value: '', disabled: ''}] //value； string
        //value [district['value'], district['value']]
        //visible 当公用一个组件时 使用此控制是够显示
        //onCancel 使用visible时 点击蒙层的回调
        //showPreview 是否展示预览

        let data = district
        if (isSearch && searchValue) {
            data = data.filter(v => v['key'].includes(searchValue))
        }
        const pageCount = Math.ceil(data.length/this.pageSize)

        if (isPreview) {
            data = data.filter(v => checkedValueList.includes(v['value'])).sort((a,b) => {
                if (a['serialNumber'] > b['serialNumber']) {
                    return sortType ? 1 : -1
                } else {
                    return sortType ? -1 : 1
                }
            })
        }

        return (
            <div className={className}
                onClick={() => {
                    if (disabled) { return }
                    this.setState({show: true})
                    this.setDefault(value, district)
                }}
            >
                { this.props.children ? this.props.children : <div className='xfn-multiple-caption'>请选择</div> }
                <div
                    className={`xfn-multiple ${show ? 'xfn-multiple-animate' : 'xfn-multiple-none-animate'}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        this.closeModal()
                        if (onCancel) { onCancel() }
                    }}
                >
                    <div className={`xfn-multiple-popup ${show ? 'xfn-multiple-popup-animate' : 'xfn-multiple-popup-none-animate'}`}
                        style={{minHeight: isSearch ? '75%' : ''}}
                    >
                        <div className='xfn-multiple-title' onClick={(e) => e.stopPropagation()}>
                            <div style={{display: !isPreview && !isSearch ? '' : 'none'}}>
                                <span>{title ? title : '请选择'}</span>
                                <Icon type='search' className='no-search' onClick={() => this.setState({isSearch: true})}/>
                            </div>
                            <div className='xfn-multiple-search' style={{display: !isPreview && isSearch ? '' : 'none'}}>
                                <Icon type='search'/>
                                <TextListInput
                                    className='xfn-multiple-input'
                                    placeholder='请输入搜索的内容'
                                    value={searchValue}
                                    onChange={(value) => this.setState({searchValue: value})}
                                />
                                <span className='xfn-multiple-cancel' onClick={() => this.setState({searchValue: '', isSearch: false})}>
                                    取消
                                </span>
                            </div>
                            <div className='checked-title' style={{display: isPreview ? '' : 'none'}}>
                                {previewTitle ? previewTitle : '已选择'}
                                <Icon type="clear" onClick={() => {
                                    data.forEach(v => {
                                        if (v.disabled) { return }
                                        let idx = checkedValueList.findIndex(item => item == v['value'])
                                        checkedValueList.splice(idx, 1)
                                        checkedKeyList.splice(idx, 1)
                                    })
                                    this.setState({checkedValueList: checkedValueList, checkedKeyList: checkedKeyList})
                                }}/>
                                <span className='checked-title-right' onClick={() => { this.setState({sortType: !sortType}) }}>
                                    {sortType ? '升序' : '倒序'} <Icon type='sort'/>
                                </span>
                            </div>
                        </div>
                        <ul ref={(scrollerCard)=>{
                            if (scrollerCard) {
                                this.scrollerHeight = Number(window.getComputedStyle(scrollerCard).height.replace('px',''))
                            }
                        }}
                        onScroll={(e)=>{
                            const scrollY = e.target.scrollTop
                            if (scrollY + 100 + this.scrollerHeight >= currentPage*this.pageSize*this.listHeight && currentPage < pageCount) {
                                this.setState({currentPage:currentPage+1})
                            }
                        }}>
                            {!isPreview && data.slice(0,currentPage*this.pageSize).map((v, i) => {
                                let checked = false
                                if (checkedValueList.includes(v['value'])) {
                                    checked = true
                                }
                                return (
                                    <li key={i}
                                        ref={i==0 ? (scrollerCardItem) => {
                                            if (!this.listHeight && scrollerCardItem) {
                                                this.listHeight = Number(window.getComputedStyle(scrollerCardItem).height.replace('px',''))
                                            }
                                        } : null}
                                        className={v.disabled ? 'xfn-multiple-disabled' : ''}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (v.disabled) {
                                                return
                                            }

                                            if (checked) {//从选中到未选中
                                                let idx = checkedValueList.findIndex(item => item == v['value'])
                                                checkedValueList.splice(idx, 1)
                                                checkedKeyList.splice(idx, 1)
                                            } else {
                                                checkedValueList.push(v['value'])
                                                checkedKeyList.push(v['key'])
                                            }
                                            this.setState({checkedValueList: checkedValueList, checkedKeyList: checkedKeyList})
                                    }}>
                                        <span className='overElli'>{v.key}</span>
                                        <Checkbox checked={checked}/>
                                    </li>
                                )
                            })}

                            {/* 预览选中的 */}
                            {isPreview && data.map((v, i) => {
                                let checked = false
                                if (checkedValueList.includes(v['value'])) {
                                    checked = true
                                }

                                return (
                                    <li key={i}
                                        className={v.disabled ? 'checked-item xfn-multiple-disabled' : 'checked-item'}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (v.disabled) { return }

                                            if (checked) {//从选中到未选中
                                                let idx = checkedValueList.findIndex(item => item == v['value'])
                                                checkedValueList.splice(idx, 1)
                                                checkedKeyList.splice(idx, 1)
                                            }
                                            this.setState({checkedValueList: checkedValueList, checkedKeyList: checkedKeyList})
                                    }}>
                                        <span className='checked-delete'><Icon type="delete-plus"/></span>
                                        <span className='overElli'>{v.key}</span>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className='xfn-multiple-select' onClick={(e) => e.stopPropagation()}>
                            <span className='overElli'
                                onClick={() => {
                                    if (showPreview) {
                                        this.setState({isPreview: !isPreview})
                                    }
                                }}
                                >
                                已选择：{showPreview ? `${checkedKeyList.length}个 ` : checkedKeyList.join('、')}
                                {showPreview ? <Icon style={isPreview ? {transform: 'rotate(180deg)'} : ''} type="arrow-down"/> : null}
                            </span>
                            <span className='xfn-multiple-button'
                                onClick={()=>{
                                    let arr = []
                                    checkedValueList.forEach(v => {
                                        district.forEach(w => {
                                            if (w['value']==v) {
                                                arr.push(w)
                                            }
                                        })
                                    })
                                    onOk(arr)
                                    this.closeModal()
                                    if (onCancel) { onCancel() }
                                }}
                            >
                                确定
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

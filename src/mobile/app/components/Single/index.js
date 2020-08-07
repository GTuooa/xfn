import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { fromJS, toJS } from 'immutable'
import { Icon, TextListInput } from 'app/components'

import './style.less'

export default class SinglePicker extends Component {
    scrollView = ''
    btnGroup = ''
    state = {
        show: false,
        isSearch: false,
        searchValue: '',
    }

    componentDidMount () {
        this.scrollView = document.getElementsByClassName('scroll-view')[0]
        this.btnGroup = document.getElementsByClassName('btn-group')[0]
    }

    render() {
        const { district, value, title, onOk, disabled, key, className, canSearch, icon, iconTwo, maxHeight } = this.props
        const { show, isSearch, searchValue } = this.state

        // let data = district.map(v => {return {label: v.key, value: v.value}})
        // maxHeight 显示最高高度
        const showSearch = canSearch===false ? false : true
        let data = district.map(v => {
            v['label'] = v['key']
            v['value'] = v['value']
            return v
        })
        if (isSearch && searchValue) {
            data = data.filter(v => v['label'].includes(searchValue))
        }

        return (
            <div className={className}
                key={key}
                onClick={() => {
                    if (disabled) { return }
                    this.setState({show: true, isSearch: false, searchValue: ''})
                    this.scrollView ? this.scrollView.style['overflow-y']='hidden' : null
                    this.btnGroup ? this.btnGroup.style['display']='none' : null
                }}
            >
                { this.props.children ? this.props.children : <div className='xfn-single-caption'>请选择</div> }
                <div
                    className={`xfn-single ${show ? 'xfn-single-animate' : 'xfn-single-none-animate'}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        this.setState({ show: false })
                        this.scrollView ? this.scrollView.style['overflow-y']='auto' : null
                        this.btnGroup ? this.btnGroup.style['display']='flex' : null
                    }}
                >
                    <div className={`xfn-single-popup ${show ? 'xfn-single-popup-animate' : 'xfn-single-popup-none-animate'}`}
                        style={{minHeight: isSearch || maxHeight ? (maxHeight ? maxHeight : '75%') : ''}}
                    >
                        <div className='xfn-single-title' onClick={(e) => e.stopPropagation()}>
                            {!isSearch && icon ? <span className='title-left-icon' onClick={()=> { icon.onClick() }}>
                                <Icon type={icon['type']}/>
                            </span> : null }
                            {!isSearch && iconTwo ? <span className='title-left-icon icon-two' onClick={()=> { iconTwo.onClick() }}>
                                <Icon type={iconTwo['type']}/>
                            </span> : null }
                            <div style={{display: isSearch ? 'none' : ''}}>
                                <span>{title ? title : '请选择'}</span>
                                {showSearch ? <Icon type='search' className='no-search' onClick={() => this.setState({isSearch: true})}/> : null}
                            </div>
                            <div className='xfn-single-search' style={{display: isSearch ? '' : 'none'}}>
                                <Icon type='search'/>
                                <TextListInput
                                    className='xfn-single-input'
                                    placeholder='请输入搜索的内容'
                                    value={searchValue}
                                    onChange={(value) => this.setState({searchValue: value})}
                                />
                                <span className='xfn-single-select' onClick={() => this.setState({searchValue: '', isSearch: false})}>
                                    取消
                                </span>
                            </div>
                        </div>
                        <div className='xfn-single-content'>
                            {data.map((v, i) => {
                                return (
                                    <div key={i}
                                        className={value == v.value ? 'xfn-single-item xfn-single-select' : 'xfn-single-item'}
                                        onClick={() => {
                                            onOk(v)
                                    }}>
                                        <span className='overElli muti-line-ellipsis'>{v.label}</span>
                                        {value == v.value ? <Icon type='tick'/> : null}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



/**
 * 写法一 ReactDOM.render 弹窗放到root节点
**/
class Mask extends Component {
    state = {
        isSearch: false,
        searchValue: '',
    }

    render() {
        const { district, value, title, onOk, canSearch, icon, iconTwo, maxHeight, show, onCancel } = this.props
        const { isSearch, searchValue } = this.state

        // let data = district.map(v => {return {label: v.key, value: v.value}})
        // maxHeight 显示最高高度
        const showSearch = canSearch===false ? false : true
        let data = district.map(v => {
            v['label'] = v['key']
            v['value'] = v['value']
            return v
        })
        if (isSearch && searchValue) {
            data = data.filter(v => v['label'].includes(searchValue))
        }

        return (
            <div
                className={`xfn-single ${show ? 'xfn-single-animate' : 'xfn-single-none-animate'}`}
                onClick={(e) => { onCancel(e) }}
            >
                <div className={`xfn-single-popup ${show ? 'xfn-single-popup-animate' : 'xfn-single-popup-none-animate'}`}
                    style={{minHeight: isSearch || maxHeight ? (maxHeight ? maxHeight : '75%') : ''}}
                >
                    <div className='xfn-single-title' onClick={(e) => e.stopPropagation()}>
                        {!isSearch && icon ? <span className='title-left-icon' onClick={()=> { icon.onClick() }}>
                            <Icon type={icon['type']}/>
                        </span> : null }
                        {!isSearch && iconTwo ? <span className='title-left-icon icon-two' onClick={()=> { iconTwo.onClick() }}>
                            <Icon type={iconTwo['type']}/>
                        </span> : null }
                        <div style={{display: isSearch ? 'none' : ''}}>
                            <span>{title ? title : '请选择'}</span>
                            {showSearch ? <Icon type='search' className='no-search' onClick={() => this.setState({isSearch: true})}/> : null}
                        </div>
                        <div className='xfn-single-search' style={{display: isSearch ? '' : 'none'}}>
                            <Icon type='search'/>
                            <TextListInput
                                className='xfn-single-input'
                                placeholder='请输入搜索的内容'
                                value={searchValue}
                                onChange={(value) => this.setState({searchValue: value})}
                            />
                            <span className='xfn-single-select' onClick={() => this.setState({searchValue: '', isSearch: false})}>
                                取消
                            </span>
                        </div>
                    </div>
                    <div className='xfn-single-content'>
                        {data.map((v, i) => {
                            return (
                                <div key={i}
                                    className={value == v.value ? 'xfn-single-item xfn-single-select' : 'xfn-single-item'}
                                    onClick={() => {
                                        onOk(v)
                                }}>
                                    <span className='overElli muti-line-ellipsis'>{v.label}</span>
                                    {value == v.value ? <Icon type='tick'/> : null}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>            
        )
    }
}

export class SingleModal extends Component {
    modal = document.createElement('div')
    state = {
        show: false,
    }

    componentDidMount () {
        this.root = document.querySelector('#root')
        this.root.appendChild(this.modal)
        this._renderMask()
    }

    componentDidUpdate () {
        this._renderMask()
    }

    componentWillUnmount () {//在组件卸载的时候，保证弹层也被卸载掉
        // ReactDOM.unmountComponentAtNode(this.modal);
        this.root.removeChild(this.modal);
    }

    _renderMask () {
        ReactDOM.render(
        <Mask 
            {...this.props}
            show={this.state.show}
            onCancel={(e) => {
                e.stopPropagation()
                this.setState({ show: false })
            }} 
        />, this.modal);
    }

    render() {
        const { disabled, key, className } = this.props

        return (
            <div className={className}
                key={key}
                onClick={() => {
                    if (disabled) { return }
                    this.setState({show: true})
                }}
            >
                { this.props.children ? this.props.children : <div className='xfn-single-caption'>请选择</div> }              
            </div>
        )
    }
}

/**
 * 写法二 ReactDOM.createPortal 弹窗放到root节点(推荐使用)
**/
export class SinglePortal extends Component {
    modal = document.createElement('div')
    state = {
        show: false,
        isSearch: false,
        searchValue: '',
    }

    componentDidMount () {
        this.root = document.querySelector('#root')
        this.root.appendChild(this.modal)
    }
    componentWillUnmount () {//在组件卸载的时候，保证弹层也被卸载掉
        // ReactDOM.unmountComponentAtNode(this.modal);
        this.root.removeChild(this.modal);
    }

    render() {
        const { district, value, title, onOk, disabled, key, className, canSearch, icon, iconTwo, maxHeight } = this.props
        const { show, isSearch, searchValue } = this.state

        // let data = district.map(v => {return {label: v.key, value: v.value}})
        // maxHeight 显示最高高度
        const showSearch = canSearch===false ? false : true
        let data = district.map(v => {
            v['label'] = v['key']
            v['value'] = v['value']
            return v
        })
        if (isSearch && searchValue) {
            data = data.filter(v => v['label'].includes(searchValue))
        }

        return (
            <div className={className}
                key={key}
                onClick={() => {
                    if (disabled) { return }
                    this.setState({show: true, isSearch: false, searchValue: ''})
                }}
            >
                { this.props.children ? this.props.children : <div className='xfn-single-caption'>请选择</div> }
                
                { ReactDOM.createPortal(
                    <div
                        className={`xfn-single ${show ? 'xfn-single-animate' : 'xfn-single-none-animate'}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            this.setState({ show: false })
                        }}
                    >
                        <div className={`xfn-single-popup ${show ? 'xfn-single-popup-animate' : 'xfn-single-popup-none-animate'}`}
                            style={{minHeight: isSearch || maxHeight ? (maxHeight ? maxHeight : '75%') : ''}}
                        >
                            <div className='xfn-single-title' onClick={(e) => e.stopPropagation()}>
                                {!isSearch && icon ? <span className='title-left-icon' onClick={()=> { icon.onClick() }}>
                                    <Icon type={icon['type']}/>
                                </span> : null }
                                {!isSearch && iconTwo ? <span className='title-left-icon icon-two' onClick={()=> { iconTwo.onClick() }}>
                                    <Icon type={iconTwo['type']}/>
                                </span> : null }
                                <div style={{display: isSearch ? 'none' : ''}}>
                                    <span>{title ? title : '请选择'}</span>
                                    {showSearch ? <Icon type='search' className='no-search' onClick={() => this.setState({isSearch: true})}/> : null}
                                </div>
                                <div className='xfn-single-search' style={{display: isSearch ? '' : 'none'}}>
                                    <Icon type='search'/>
                                    <TextListInput
                                        className='xfn-single-input'
                                        placeholder='请输入搜索的内容'
                                        value={searchValue}
                                        onChange={(value) => this.setState({searchValue: value})}
                                    />
                                    <span className='xfn-single-select' onClick={() => this.setState({searchValue: '', isSearch: false})}>
                                        取消
                                    </span>
                                </div>
                            </div>
                            <div className='xfn-single-content'>
                                {data.map((v, i) => {
                                    return (
                                        <div key={i}
                                            className={value == v.value ? 'xfn-single-item xfn-single-select' : 'xfn-single-item'}
                                            onClick={() => {
                                                onOk(v)
                                        }}>
                                            <span className='overElli muti-line-ellipsis'>{v.label}</span>
                                            {value == v.value ? <Icon type='tick'/> : null}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>, 
                    this.modal) 
                }  
            </div>
        )
    }
}





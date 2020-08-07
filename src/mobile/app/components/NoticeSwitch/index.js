import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Icon } from 'app/components'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './noticeSwitch.less'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class NoticeSwitch extends Component {

    constructor() {
        super()
        this.state = {
            currentId: 0,
            first: true,
            opacity: 0,
            'zIndex': -1
        }
    }
    componentDidMount() {
        if (this.props.itemlist.size <= 1) {
            return
        }
        else {
            this.interval = setInterval(this.next.bind(this), this.props.time)
        }
    }
    componentWillReceiveProps(nextprops) {
        clearInterval(this.interval)
        clearInterval(this.opacityinterval)
		if (nextprops.itemlist !== this.props.itemlist) {
            if (nextprops.itemlist.size <= 1) {
                return
            } else {
                this.interval = setInterval(this.next.bind(this), this.props.time)
            }
		}
	}
    componentWillUnmount() {
        clearInterval(this.interval)
        clearInterval(this.opacityinterval)
    }
    next() {
        const currentIdMax = this.props.itemlist.size - 1
        if (currentIdMax <= 0)
            return
        this.setState({
            currentId: (this.state.currentId === currentIdMax) ? 0 : (this.state.currentId + 1),
            first: !this.state.first
        })
        if (this.state.first === false) {
            clearInterval(this.opacityinterval)
            this.opacityinterval = setInterval(this.changeOpacityToMax.bind(this), 100)
        } else if (this.state.first === true) {
            clearInterval(this.opacityinterval)
            this.opacityinterval = setInterval(this.changeOpacityToMin.bind(this), 100)
        }
    }
    changeOpacityToMax() {
        this.setState({
            opacity: (this.state.opacity === 100) ? 100 : (this.state.opacity + 20),
            'zIndex': 10
        })
        if (this.state.opacity === 100) {
            clearInterval(this.opacityinterval)
        }
    }
    changeOpacityToMin() {
        this.setState({
            opacity: (this.state.opacity === 0) ? 100 : (this.state.opacity - 20),
            'zIndex': -1
        })
        if (this.state.opacity === 0) {
            clearInterval(this.opacityinterval)
        }
    }

    render() {
        const { itemlist, history, time } = this.props
        const { currentId, first, opacity, zIndex } = this.state

        const itemlistLength = itemlist ? itemlist.size : 0
        const nextcurrentId = (currentId === (itemlistLength - 1)) ? 0 : currentId + 1

        // const Style = {opacity: opacity/100, 'zIndex': zIndex}
        const Style = {opacity: 100, 'zIndex': 1}
        // let urlOnly = itemlist.getIn([0, 'url'])
        // let urlFirst = itemlist.getIn([first ? nextcurrentId : currentId, 'url'])
        // let urlSecond = itemlist.getIn([first ? currentId : nextcurrentId, 'url'])
        const itemFirst = itemlist.getIn([first ? nextcurrentId : currentId])
        const itemSecond = itemlist.getIn([first ? currentId : nextcurrentId])

        return (
            <div className="notices-wrap" style={{display: itemlistLength === 0 ? 'none' : 'block'}}>
                {
                    itemlistLength === 0 ? '' : ((itemlistLength === 1) ?
                        <ul className="notices-list">
                            <NoticeItem
                                item={itemlist.get(0)}
                            />
                            {/* <li className="notices-tip">
                                <Icon type="tongzhi" className="notices-tip-icon" size="14" style={{margin: '0 .05rem 0 0'}}/>
                                <a className={urlOnly ? "text-underline" : ''} href={`${urlOnly ? urlOnly : '#'}`}>
                                    {itemlist.getIn([0, 'content']).length > Limit.NOTICE_TEXT_LENGTH ? itemlist.getIn([0, 'content']).substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : itemlist.getIn([0, 'content'])}
                                </a>
                            </li> */}
                        </ul>  :
                        <ul className="notices-list">
                            {/* <li className="notices-tip">
                                <Icon type="tongzhi" className="notices-tip-icon" size="14" style={{margin: '0 .05rem 0 0'}}/>
                                <a className={urlFirst ? "text-underline" : ''} href={`${urlFirst ? urlFirst : '#'}`}>
                                    {contentFirst.length > Limit.NOTICE_TEXT_LENGTH ? contentFirst.substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : contentFirst}
                                </a>
                            </li> */}
                            <NoticeItem
                                key={'itemFirst'}
                                item={itemFirst}
                            />
                            {/* <li className="notices-tip" style={Style}>
                                <Icon type="tongzhi" className="notices-tip-icon" size="14" style={{margin: '0 .05rem 0 0'}}/>
                                <a className={urlSecond ? "text-underline" : ''} href={`${urlSecond ? urlSecond : '#'}`}>
                                    {contentSecond > Limit.NOTICE_TEXT_LENGTH ? contentSecond.substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : contentSecond}
                                </a>
                            </li> */}
                            <NoticeItem
                                key={'itemSecond'}
                                item={itemSecond}
                                Style={Style}
                            />
                        </ul>
                    )
                }
            </div>
        )
    }
}

class NoticeItem extends Component {

    render() {

        const { item, Style } = this.props

        return (
            <li className="notices-tip" style={Style}>
                <Icon type="tongzhi" className="notices-tip-icon" size="14" style={{margin: '0 .05rem 0 0'}}/>
                {
                    item.get('type') === 'local' ?
                        <a className="text-underline" href='#' onClick={() => history.push('/payguide')}>
                            {item.get('content').length > Limit.NOTICE_TEXT_LENGTH ? item.get('content').substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : item.get('content')}
                        </a> :
                        <a className={item.get('url') ? "text-underline" : ''} href={`${item.get('url') ? item.get('url') : '#'}`}>
                            {item.get('content').length > Limit.NOTICE_TEXT_LENGTH ? item.get('content').substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : item.get('content')}
                        </a>
                }
                <Icon type="arrow-right" className="notices-tip-icon" size="10" style={{fontWeight:400}}/>
            </li>
        )
    }
}

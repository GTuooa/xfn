import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { XfnIcon } from 'app/components'
import { toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './noticeSwitch.less'

@immutableRenderDecorator
export default
class NoticeSwitch extends Component {
    // static propTypes = {
    //     // 传入切换的时间
	// 	time: PropTypes.number.isRequired
    //     // itemlist: PropTypes.array
	// }
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
        const { itemlist } = this.props
        const { currentId, first, opacity, zIndex } = this.state
        const itemlistLength = itemlist ? itemlist.size : 0
        const nextcurrentId = (currentId === (itemlistLength - 1)) ? 0 : currentId + 1
        const Style = {opacity: opacity/100, 'zIndex': zIndex}
        let urlOnly = itemlist.getIn([0, 'url'])
        let urlFirst = itemlist.getIn([first ? nextcurrentId : currentId, 'url'])
        let urlSecond = itemlist.getIn([first ? currentId : nextcurrentId, 'url'])
        const contentFirst = itemlist.getIn([first ? nextcurrentId : currentId, 'content'])
        const contentSecond = itemlist.getIn([first ? currentId : nextcurrentId, 'content'])

        return (
            <div className="notices-wrap" style={{display: itemlistLength === 0 ? 'none' : 'block'}}>
                {
                    itemlistLength === 0 ? '' : ((itemlistLength === 1) ?
                        <ul className="notices-list">
                            <li className="notices-tip">
                                <XfnIcon type="notification" className="notices-tip-icon"/>
                                <a className={urlOnly ? "text-underline" : ''} href='javascript:void(0);' onClick={() => {
                                    if (urlOnly) {
                                        thirdParty.openLink({
                                            url: urlOnly
                                        })
                                    }
                                }}>
                                    {itemlist.getIn([0, 'content']).length > 13 ? itemlist.getIn([0, 'content']).substr(0, 12) + '···' : itemlist.getIn([0, 'content'])}
                                </a>
                            </li>
                        </ul>  :
                        <ul className="notices-list">
                            <li className="notices-tip">
                                <XfnIcon type="notification" className="notices-tip-icon"/>
                                <a className={urlFirst ? "text-underline" : ''} href='javascript:void(0);' onClick={() => {
                                    if (urlFirst) {
                                        thirdParty.openLink({
                                            url: urlFirst
                                        })
                                    }
                                }}>
                                    {contentFirst.length > 13 ? contentFirst.substr(0, 12) + '···' : contentFirst}
                                </a>
                            </li>
                            <li className="notices-tip" style={Style}>
                                <XfnIcon type="notification" className="notices-tip-icon"/>
                                <a className={urlSecond ? "text-underline" : ''} href='javascript:void(0);' onClick={() => {
                                    if (urlSecond) {
                                        thirdParty.openLink({
                                            url: urlSecond
                                        })
                                    }
                                }}>
                                    {contentSecond > 13 ? contentSecond.substr(0, 12) + '···' : contentSecond}
                                </a>
                            </li>
                        </ul>
                    )
                }
            </div>
        )
    }
}

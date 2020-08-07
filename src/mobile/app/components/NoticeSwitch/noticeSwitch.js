import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Icon } from 'app/components'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './noticeSwitch.less'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class NoticeSwitchBar extends Component {

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
        var area = this.refs.area;
        var con1 = document.getElementById('content-first');
        var mytimer1 = null;
        var mytimer = null;
        var time = 1000 / 20;
        function scrollUp () {
          if (area.scrollTop >= con1.offsetHeight) {
            area.scrollTop = 0;
          } else {
            if (area.scrollTop % 18 == 0) {
              clearInterval(mytimer);
              clearInterval(mytimer1);
              mytimer1 = setTimeout(function () {
                mytimer = setInterval(scrollUp, time);
            }, 3000);
            }
            area.scrollTop++;
          }
        }
        mytimer = setInterval(scrollUp, time);
    }

    render() {
        const { itemlist, history } = this.props
        const { currentId, first, opacity, zIndex } = this.state

        const itemlistLength = itemlist ? itemlist.size : 0
        const nextcurrentId = (currentId === (itemlistLength - 1)) ? 0 : currentId + 1

        // const Style = {opacity: opacity/100, 'zIndex': zIndex}
        // let urlOnly = itemlist.getIn([0, 'url'])
        // let urlFirst = itemlist.getIn([first ? nextcurrentId : currentId, 'url'])
        // let urlSecond = itemlist.getIn([first ? currentId : nextcurrentId, 'url'])
        const itemFirst = itemlist.getIn([first ? nextcurrentId : currentId])
        const itemSecond = itemlist.getIn([first ? currentId : nextcurrentId])

        return (
            <div className="notices-wrap" style={{display: itemlistLength === 0 ? 'none' : 'block'}} ref="aaa">
                <ul className="notices-list">
                    <li className="notices-tip">
                        <Icon type="tongzhi" className="notices-tip-icon" size="14" style={{margin: '0 .05rem 0 0'}}/>
                        <div className="notices-content" id="area" ref="area">
                            <div id="content-first" className="content-first">
                                {
                                    itemlist.map((item,index) => {
                                        if(item.get('type') === 'local'){
                                            return( <a key={index} className="text-underline" href='javascript:void(0);' onClick={() => history.push('/payguide')}>
                                                {item.get('content').length > Limit.NOTICE_TEXT_LENGTH ? item.get('content').substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : item.get('content')}
                                            </a>)
                                        }else{
                                            return (
                                                <a key={index} className={item.get('url') ? "text-underline" : ''} href={`${item.get('url') ? item.get('url') : 'javascript:void(0);'}`}>
                                                    {item.get('content').length > Limit.NOTICE_TEXT_LENGTH ? item.get('content').substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : item.get('content')}
                                                </a>
                                            )
                                        }
                                    })
                                }
                            </div>
                            <div className="content-sec">
                                {
                                    itemlist.map((item,index) => {
                                        if(item.get('type') === 'local'){
                                            return( <a key={index} className="text-underline" href='javascript:void(0);' onClick={() => history.push('/payguide')}>
                                                {item.get('content').length > Limit.NOTICE_TEXT_LENGTH ? item.get('content').substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : item.get('content')}
                                            </a>)
                                        }else{
                                            return (
                                                <a key={index} className={item.get('url') ? "text-underline" : ''} href={`${item.get('url') ? item.get('url') : 'javascript:void(0);'}`}>
                                                    {item.get('content').length > Limit.NOTICE_TEXT_LENGTH ? item.get('content').substr(0, Limit.NOTICE_TEXT_LENGTH) + '...' : item.get('content')}
                                                </a>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

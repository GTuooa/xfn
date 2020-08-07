import React, { PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import { Icon } from 'app/components';
import thirdParty from 'app/thirdParty';

import ItemChild from './ItemChild';

@immutableRenderDecorator
export default
    class ApprovalAllItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    };

    render() {
        const { item, dispatch, editLrAccountPermission, history, jrUuidList, showChildList, deleteCheckDetailItem, addCheckDetailItem, accountSelectList } = this.props;

        const containType = {
            'AMOUNT': '金额',
            'DATE': '日期',
            'ABSTRACT': '摘要',
            'CONTECT': '往来单位',
            'STROCK': '存货',
            'DRPOT': '仓库',
            'CATEGORY': '流水类别',
            'DETAIL-TYPE': '明细类型',
            'ACCOUNT': '账户'
        };

        const displayMap = item.get('displayMap');

        let keyList = [];
        displayMap.forEach((v, i) => {
            keyList.push(i)
        });

        const showChild = showChildList.indexOf(item.get('id')) > -1;

        return (
            <div className="approval-all-item-wrap">
                <div className="approval-all-item-container">
                    <div className="approval-all-item-main" onClick={() => {
                        // 跳赚到钉钉审批实例页面
                        thirdParty.openLink({
                            url: `https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&dd_progress=false&back=native&corpid=${sessionStorage.getItem('corpId')}&swfrom=${'XFN'}#/approval?procInstId=${item.get('processInstanceId')}`
                        });
                    }}>
                        <div className="approval-all-item-main-avatar">
                            {
                                item.get('originateAvatar') ?
                                    <img className="approval-all-item-main-avatar-img" src={item.get('originateAvatar')} />
                                    : <span className="approval-all-item-main-avatar-skeleton"></span>
                            }
                        </div>
                        <div className="approval-all-item-main-list">
                            <div className="approval-all-item-main-title-wrap">
                                <span className="approval-all-item-main-title">{item.get('processTitle')}</span>
                                <span className="approval-all-item-main-createtime">{item.get('createTime').substr(0, 10)}</span>
                            </div>
                            <ul className="approval-all-item-main-example-list">
                                {
                                    keyList.map(v => {
                                        return (
                                            <li className="approval-all-item-main-example-item" key={v}>{`${containType[v]}: ${displayMap.get(v)}`} </li>
                                        )
                                    })
                                }
                            </ul>
                            <div
                                className="approval-all-item-main-showchild-wrap"
                                onClick={e => {
                                    e.stopPropagation();
                                    if (showChild) {
                                        deleteCheckDetailItem(item.get('id'));
                                    } else {
                                        addCheckDetailItem(item.get('id'));
                                    };
                                }}
                            >
                                <span className="approval-all-item-main-showchild-finishtime">
                                    审批通过时间：{item.get('finishTime').substr(0, 10)}
                                </span>
                                <span className="approval-all-item-main-showchild-icon">
                                    {showChild ? '收起' : '展开'} <Icon style={showChild ? { transform: 'rotate(180deg)', marginBottom: '.1rem' } : ''} type="arrow-down" />
                                </span>
                            </div>
                        </div>
                    </div>
                    {
                        showChild ?
                            <ItemChild
                                detailList={item.get('detailList')}
                                dispatch={dispatch}
                                editLrAccountPermission={editLrAccountPermission}
                                history={history}
                                jrUuidList={jrUuidList}
                                accountSelectList={accountSelectList}
                            />
                            : null
                    }
                </div>
            </div>
        )
    }
}
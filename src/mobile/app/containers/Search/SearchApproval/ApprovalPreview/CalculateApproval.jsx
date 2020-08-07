
import React from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js';

import { Icon, Button } from 'app/components';
import { runningPreviewActions } from 'app/redux/Edit/RunningPreview';

@immutableRenderDecorator
export default
    class CalculateApproval extends React.Component {

    render() {

        const { dispatch, item, history, uuidList, editLrAccountPermission } = this.props;

        const jrIndex = item.get('jrIndex');
        const jrState = item.get('jrState');
        const jrCategoryType = item.get('jrCategoryType');

        let typeJson = {
            'JR_HANDLE_NO': '1',
            'JR_HANDLE_HALF': '2',
            'JR_HANDLE_ALL': '3',
        };
        let jrStateStr = {
            'JR_HANDLE_NO': '未核销',
            'JR_HANDLE_HALF': '部分核销',
            'JR_HANDLE_ALL': '全部核销',
        };

        const oriUuid = item.get('jrOriUuid');
        const jrJvUuid = item.get('jrJvUuid');
        const notHandleAmount = item.get('jrAmount');

        let elementList = [];
        let receive = '0';
        let pay = '0';
        let shouldReturn = '0';
        let makeOut = '0';
        let auth = '0';
        let carryover = '0';
        let grant = '0';
        let defray = '0';
        let takeBack = '0';
        let back = '0';
        // 判断各个类别该是什么状态
        if (jrCategoryType === 'LB_YYSR' || jrCategoryType === 'LB_YYWSR') {
            if (item.get('detailType') === '预收账款') {
                shouldReturn = typeJson[jrState]
            } else {
                if (item.get('jrAmount') > 0) {
                    receive = typeJson[jrState];
                } else if (item.get('jrAmount') < 0) {
                    shouldReturn = typeJson[jrState];
                };
            }
        };
        if (jrCategoryType === 'LB_YYZC' || jrCategoryType === 'LB_YYWZC' || jrCategoryType === 'LB_FYZC') {
            if (item.get('detailType') === '预付账款') {
                shouldReturn = typeJson[jrState]
            } else {
                if (item.get('jrAmount') > 0) {
                    pay = typeJson[jrState];
                } else if (item.get('jrAmount') < 0) {
                    shouldReturn = typeJson[jrState];
                }
            }
        };
        if (jrCategoryType === 'LB_XCZC') {
            grant = typeJson[jrState]
        };
        if (jrCategoryType === 'LB_ZSKX') {
            takeBack = typeJson[jrState]
        };
        if (jrCategoryType === 'LB_ZFKX') {
            back = typeJson[jrState]
        };

        let statusArr = [
            { key: 'receive', value: receive, toRouter: 'SFGL', direction: 'debit' },
            { key: 'pay', value: pay, toRouter: 'SFGL', direction: 'credit' },
            { key: 'shouldReturn', value: shouldReturn, toRouter: 'SFGL', direction: 'credit' },
            { key: 'makeOut', value: makeOut, toRouter: 'KJFP' },
            { key: 'auth', value: auth, toRouter: 'FPRZ' },
            { key: 'carryover', value: carryover, toRouter: 'JZSY' },
            { key: 'grant', value: grant, toRouter: 'XCZC' },
            { key: 'defray', value: defray, toRouter: 'DEFRAY' },
            { key: 'takeBack', value: takeBack, toRouter: 'ZSFKX' },
            { key: 'back', value: back, toRouter: 'ZSFKX' }
        ];

        const btnName = {
            'shouldReturn': '退款',
            'pay': '付款',
            'receive': '收款',
            'makeOut': '开票',
            'auth': '认证',
            'carryover': '结转',
            'grant': `${notHandleAmount > 0 ? '发放' : '收款'}`,
            'defray': `${notHandleAmount > 0 ? '缴纳' : '收款'}`,
            'takeBack': '收回',
            'back': '退还',
        };

        statusArr.forEach(v => {
            if (v.value == '1' || v.value == '2') {
                elementList.push(
                    <Button
                        className="search-approval-calculate-state-btn"
                        key={v.key}
                        disabled={!editLrAccountPermission} 
                        onClick={() => {
                            sessionStorage.setItem('toCalculate', 'TRUE')
                            dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, v['toRouter'], v['direction'], 'searchApproval', v.key))
                        }}
                    >
                        {btnName[v.key]}
                    </Button>
                )
            }
        });

        if (jrIndex) {
            return (
                <div className="search-approval-calculate-wrap">
                    <div className="search-approval-calculate-jr">
                        <div
                            className="search-approval-calculate-jr-index"
                            onClick={() => {
                                dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(item.get('jrOriUuid'), item, uuidList, 'searchApproval', history))
                            }}
                        >
                            <Icon type="liushui" style={{ fontSize: '.13rem' }} />&nbsp;<span>{jrIndex}号</span>
                        </div>
                        <div className="search-approval-calculate-jr-oriDate"><span>{item.get('oriDate')}</span><i className="approval-all-item-child-separate" style={{ display: item.get('jrIndex') ? '' : 'none' }}>|</i><span>记账员：{item.get('operateUserName')}</span></div>
                    </div>
                    <div className="search-approval-calculate-state">
                        <span className="search-approval-calculate-state-jrState">{jrStateStr[jrState]}</span>
                        {elementList}
                    </div>
                </div>
            );
        } else {
            return null;
        };
    };
};

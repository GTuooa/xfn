import React, { PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import ApprovalDetaliItem from '../common/ApprovalDetaliItem';

@immutableRenderDecorator
export default
    class ApprovalAllItemChild extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { detailList, dispatch, editLrAccountPermission, history, jrUuidList, accountSelectList } = this.props

        return (
            <div className="approval-all-item-child-list">
                {detailList.map((v, i) => {
                    return (
                        <ApprovalDetaliItem
                            key={i}
                            item={v}
                            dispatch={dispatch}
                            editLrAccountPermission={editLrAccountPermission}
                            history={history}
                            jrUuidList={jrUuidList}
                            accountSelectList={accountSelectList}
                        />
                    )
                })}
            </div>
        )
    }
};
import React from 'react';
import Bundle from 'app/containers/Bundle';
import load from 'bundle-loader?lazy&name=RunningConf!./lazy';

const RunningConf = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>;

export default RunningConf

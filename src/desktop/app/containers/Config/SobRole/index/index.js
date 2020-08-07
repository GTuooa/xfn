import React from 'react';
import Bundle from 'app/containers/Bundle';
import load from 'bundle-loader?lazy&name=SobRole!./lazy';

const SobRole = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>;

export default SobRole

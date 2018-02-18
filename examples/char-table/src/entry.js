const React = require('react');
const ReactDOM = require('react-dom');
const CharTable = require('b:CharTable');

ReactDOM.render(React.createElement(CharTable, { char: '>' }), document.getElementById('root'));

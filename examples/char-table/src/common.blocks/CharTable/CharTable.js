const React = require('react');

const { decl } = require('bem-react-core');

const CharRow = require('b:CharRow');

module.exports = decl({
    block: 'CharTable',

    willInit() {
        this.state = { height: 0 };
    },

    content({ char }) {
        const lines = [];

        for (let row = 0; row < this.state.height; row++) {
            lines.push(React.createElement(CharRow, { key: row, char }));
        }

        return lines;
    },

    addLine() {
        this.setState({ height: this.state.height + 1 });
    },

    removeLine() {
        const targetHeight = this.state.height - 1;

        targetHeight >= 0 && this.setState({ height: targetHeight });
    }
});

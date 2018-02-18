const { decl } = require('bem-react-core');

module.exports = decl({
    block: 'CharRow',

    willInit() {
        // row should has at least one char
        this.state = { width: 1 };
    },

    content({ char }) {
        return char.repeat(this.state.width);
    },

    addChar() {
        this.setState({ width: this.state.width + 1 });
    },

    removeChar() {
        const targetWidth = this.state.width - 1;

        targetWidth > 0 && this.setState({ width: targetWidth });
    }
});

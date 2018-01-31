const { decl } = require('bem-react-core');

const KEY_UP = 38;
const KEY_DOWN = 40;

module.exports = decl({
    block: 'CharTable',

    willInit() {
        this.__base(...arguments);

        this._processKey = this._processKey.bind(this);
    },

    didMount() {
        document.addEventListener('keydown', this._processKey);
    },

    didUnmount() {
        document.removeEventListener('keydown', this._processKey);
    },

    _processKey(event) {
        switch (event.keyCode) {
            case KEY_UP:
                this.removeLine();
                break;

            case KEY_DOWN:
                this.addLine();
                break;

            default:
                break;
        }
    }
});

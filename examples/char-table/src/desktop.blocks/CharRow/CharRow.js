const { decl } = require('bem-react-core');

const KEY_LEFT = 37;
const KEY_RIGHT = 39;

module.exports = decl({
    block: 'CharRow',

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
            case KEY_LEFT:
                this.removeChar();
                break;

            case KEY_RIGHT:
                this.addChar();
                break;

            default:
                break;
        }
    }
});

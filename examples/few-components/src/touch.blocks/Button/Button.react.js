import { decl } from 'bem-react-core';

export default decl({
    block: 'Button',

    willInit() {
        this.__base(...arguments);

        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
    },

    mods() {
        return { pointed: this.state.pointed };
    },

    attrs() {
        return {
            onTouchMove: this._onTouchMove,
            onTouchEnd: this._onTouchEnd
        };
    },

    _onTouchMove() {
        this.setState({ pointed: true });
    },

    _onTouchEnd() {
        this.setState({ pointed: false });
    }
});

import { decl } from 'bem-react-core';

export default decl({
    block: 'Button',

    willInit() {
        this.__base(...arguments);

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
    },

    mods() {
        return { pointed: this.state.pointed };
    },

    attrs() {
        return {
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave
        };
    },

    _onMouseEnter() {
        this.setState({ pointed: true });
    },

    _onMouseLeave() {
        this.setState({ pointed: false });
    }
});

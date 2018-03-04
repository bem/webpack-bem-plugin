import { decl } from 'bem-react-core';

export default decl({
    block: 'Button',

    attrs({ onClick }) {
        return { ...this.__base(...arguments), onClick };
    }
});

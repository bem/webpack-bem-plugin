import { decl } from 'bem-react-core';

export default decl({
    block: 'Image',

    mods({ effect }) {
        return { ...this.__base(...arguments), effect };
    }
});

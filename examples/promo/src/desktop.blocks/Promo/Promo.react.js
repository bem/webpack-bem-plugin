import React from 'react';

import { Bem, decl } from 'bem-react-core';

/* eslint-disable-next-line no-unused-vars */
import PromoAtom from 'e:Atom';

export default decl({
    block: 'Promo',

    getSizes() {
        return {
            webpack: { width: '200px' },
            bem: { width: '100px' }
        };
    },

    content() {
        return [
            <Bem key="a1" elem="Atom" mods={{ n: 1 }} />,
            <Bem key="a2" elem="Atom" mods={{ n: 2 }} />,
            <Bem key="a3" elem="Atom" mods={{ n: 3 }} />,
            ...this.__base(...arguments)
        ];
    }
});

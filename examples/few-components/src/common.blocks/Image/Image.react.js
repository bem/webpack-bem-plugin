import React from 'react';

import { decl } from 'bem-react-core';

export default decl({
    block: 'Image',

    content({ url, size }) {
        return <img src={url} {...size} />;
    }
});

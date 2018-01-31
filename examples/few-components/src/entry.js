import React from 'react';
import ReactDOM from 'react-dom';

import Image from 'b:Image';
import Button from 'b:Button';

const jsx = (
    <figure style={{ display: 'inline-block' }}>
        <Image url="./bem-logo.svg" size={{ width: '200px' }} />
        <figcaption>
            <p><b>BEM</b> logo</p>
            <Button text="Like it" />
        </figcaption>
    </figure>
);

ReactDOM.render(jsx, document.getElementById('root'));

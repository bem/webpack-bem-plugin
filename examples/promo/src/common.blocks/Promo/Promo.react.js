import React from 'react';

import { Bem, decl } from 'bem-react-core';

import Image from 'b:Image m:effect=beat|spark';
import Button from 'b:Button';

export default decl({
    block: 'Promo',

    willInit() {
        this.state = { shine: false };

        this.doShine = this.doShine.bind(this);
    },

    content() {
        const sizes = this.getSizes();

        return [
            <Bem key="logo" elem="Logo">
                <Image
                    url="./webpack-logo.svg"
                    size={sizes.webpack}
                    effect={this.state.shine ? 'spark' : ''}
                />
                <Image
                    url="./bem-logo.jpeg"
                    size={sizes.bem}
                    effect={this.state.shine ? 'beat' : ''}
                />
                <Bem elem="LogoSuffix">plugin</Bem>
            </Bem>,
            <Button key="button" text="Start" mix={{ block: 'Promo', elem: 'Button' }} onClick={this.doShine} />
        ];
    },

    doShine() {
        this.setState({ shine: true });
    }
});

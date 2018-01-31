import { decl } from 'bem-react-core';

export default decl({
    block: 'Promo',

    getSizes() {
        return {
            webpack: { width: '100px' },
            bem: { width: '50px' }
        };
    }
});

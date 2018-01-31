import { decl } from 'bem-react-core';

export default decl({
    block: 'Button',

    willInit() {
        this.state = { pointed: false };
    },

    content({ text }) {
        return text;
    }
});

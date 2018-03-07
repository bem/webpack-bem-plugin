'use strict';

const build = require('./helpers/build');
const runner = require('./helpers/runner');
const resolver = require('./helpers/resolver');
const temp = require('./helpers/temp');

describe('e2e', () => {
    describe('empty sets', () => {
        afterEach(() => {
            build.clear('main');
        });

        it('should build main', () => {
            const self = {
                levels: [
                    { layer: 'common' },
                    { layer: 'desktop' }
                ]
            };

            return runner.run({ self }).then(() =>
                build.test({
                    main: [
                        'common.foo',
                        'desktop.foo',
                        'desktop.foo__bar'
                    ]
                })
            );
        });

        it('should handle react naming', () => {
            const self = {
                levels: [
                    { layer: 'common' },
                    { layer: 'react', naming: 'react' }
                ]
            };

            return runner.run({ self }).then(() => {
                build.test({
                    main: [
                        'common.foo',
                        'react.foo',
                        'react.foo-bar'
                    ]
                });
            });
        });

        describe('watch', () => {
            let instance;

            afterEach(() => {
                temp.removeIfExists();

                instance && instance.close();
            });

            it('should handle only adding', () => {
                const self = {
                    levels: [
                        { layer: 'common' },
                        { layer: 'temp' }
                    ]
                };

                instance = runner.watch({ self });

                return instance.build()
                    .then(() =>
                        build.test({
                            main: [
                                'common.foo',
                                '!' + temp.mark
                            ]
                        })
                    )
                    .then(() => instance.watchNext(temp.add))
                    .then(() =>
                        build.test({
                            main: [
                                'common.foo',
                                temp.mark
                            ]
                        })
                    );
            });

            it('should handle removing', () => {
                const self = {
                    levels: [
                        { layer: 'common' },
                        { layer: 'temp' }
                    ]
                };

                temp.add();

                instance = runner.watch({ self });

                return instance.build()
                    .then(() =>
                        build.test({
                            main: [
                                'common.foo',
                                temp.mark
                            ]
                        })
                    )
                    .then(() => instance.watchNext(temp.remove))
                    .then(() =>
                        build.wait(1000) // removing is worse detected
                    )
                    .then(() =>
                        build.test({
                            main: [
                                'common.foo',
                                '!' + temp.mark
                            ]
                        })
                    );
            });
        });
    });

    describe('some sets', () => {
        afterEach(() => {
            build.clear('desktop', 'touch');
        });

        it('should build with no libs', () => {
            const self = {
                levels: [
                    { layer: 'common' },
                    { layer: 'desktop' },
                    { layer: 'touch' }
                ],
                sets: {
                    desktop: 'common desktop',
                    touch: 'common touch'
                }
            };

            return runner.run({ self }).then(() =>
                build.test({
                    desktop: [
                        'common.foo',
                        'desktop.foo',
                        'desktop.foo__bar'
                    ],
                    touch: [
                        'common.foo',
                        'touch.foo'
                    ]
                })
            );
        });

        it('should build with lib having rc', () => {
            const self = {
                levels: [
                    { layer: 'common' },
                    { layer: 'desktop' },
                    { layer: 'touch' }
                ],
                libs: {
                    'lib-with-rc': {
                        path: resolver('src/lib-with-rc')
                    }
                },
                sets: {
                    desktop: 'common desktop@lib-with-rc desktop',
                    touch: 'common touch'
                }
            };

            return runner.run({ self }).then(() =>
                build.test({
                    desktop: [
                        'common.foo',
                        'lib-with-rc.desktop.foo',
                        'desktop.foo',
                        'desktop.foo__bar'
                    ],
                    touch: [
                        'common.foo',
                        'touch.foo'
                    ]
                })
            );
        });

        it('should build with lib having no rc', () => {
            const self = {
                levels: [
                    { layer: 'common' },
                    { layer: 'desktop' },
                    { layer: 'touch' }
                ],
                libs: {
                    'lib-without-rc': {
                        path: resolver('src/lib-without-rc')
                    }
                },
                sets: {
                    desktop: 'common desktop@lib-without-rc desktop',
                    touch: 'common touch'
                }
            };
            const libs = {
                'lib-without-rc': {
                    levels: [{ layer: 'desktop' }],
                    sets: {
                        desktop: 'desktop'
                    }
                }
            };

            return runner.run({ self, libs }).then(() =>
                build.test({
                    desktop: [
                        'common.foo',
                        'lib-without-rc.desktop.foo',
                        'desktop.foo',
                        'desktop.foo__bar'
                    ],
                    touch: [
                        'common.foo',
                        'touch.foo'
                    ]
                })
            );
        });
    });
});

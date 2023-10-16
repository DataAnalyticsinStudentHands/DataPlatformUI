// responsive.js
export default {
    computed: {
        screenSizeMixin() {
            if (this.$vuetify.display.xs) {
                console.log('xs');
                return 'xs'
            };
            if (this.$vuetify.display.sm) {
                console.log('sm');
                return 'sm'
            };
            if (this.$vuetify.display.md) {
                console.log('md');
                return 'md'
            };
            if (this.$vuetify.display.lg) {
                console.log('lg');
                return 'lg'
            };
            if (this.$vuetify.display.xl) {
                console.log('xl');
                return 'xl'
            };
            console.log('default md');
            return 'md';
        },
        responsiveClasses() {
            return {
                textNormal1: this.screenSize + '-text-normal-1'
            }
        },
    },
}
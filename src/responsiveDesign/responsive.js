// responsive.js
export default {
    computed: {
        screenSizeMixin() {
            if (this.$vuetify.display.xs) {
                return 'xs'
            };
            if (this.$vuetify.display.sm) {
                return 'sm'
            };
            if (this.$vuetify.display.md) {
                return 'md'
            };
            if (this.$vuetify.display.lg) {
                return 'lg'
            };
            if (this.$vuetify.display.xl) {
                return 'xl'
            };
            return 'md';
        },
        responsiveClasses() {
            return {
                textNormal1: this.screenSize + '-text-normal-1'
            }
        },
    },
}
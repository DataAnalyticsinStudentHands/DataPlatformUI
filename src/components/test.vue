<template> <!-- Start of the Student Entry Form template -->

    <v-container style="width: 90%; margin: 0 auto;"> <!-- Container for the form title and description -->
      <div style="display: flex; align-items: center;">
        <p class="font-weight-black text-h5 text--primary">
          {{ $t('Student Entry Form') }}
        </p>
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <v-btn
                size="x-small"
                class="pb-2"
                variant="text"
                icon="mdi-help-circle-outline"
                flat
                v-bind="props"
              >
              </v-btn>
            </template>
    
            <template v-slot:default="{ isActive }">
              <v-card :title="$t('Student Entry Form')">
                <v-card-text>
                  {{$t('This entry form collects basic information about you, so that we can know you better! Some of this information will be shared with your instructor or experience leader. You can update this information at any time in your “profile”.')}}
                </v-card-text>
    
                <v-card-actions>
                  <v-spacer></v-spacer>
    
                  <v-btn
                    text="Close"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
      </div>
      <p class="text-subtitle-1">
        {{ $t("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again later.") }}
      </p>
    </v-container>

    <v-container>
        <v-row>
            <v-col>
                <v-stepper
                    :alt-labels="showAltLabels"
                    v-model="currentStep"
                >
                    <v-stepper-header>
                        <v-stepper-item
                            title="Demographics"
                            icon="mdi-account"
                            value="0"
                            :error="demoError"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            title="Degree Program"
                            icon="mdi-school"
                            value="1"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            title="Graduate/Professional"
                            icon="mdi-account-school"
                            value="2"
                        ></v-stepper-item>

                        <v-divider></v-divider>

                        <v-stepper-item
                            title="Review"
                            icon="mdi-check-bold"
                            value="3"
                        ></v-stepper-item>
                    </v-stepper-header>

                    <v-stepper-window>
                        <v-stepper-window-item value="0">
                            <test-entry-demo 
                                ref="testEntryDemoRef"
                                @form-valid="handleFormValid"
                                @form-invalid="handleFormInvalid('demo')"
                            ></test-entry-demo>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="1"></v-stepper-window-item>
                        <v-stepper-window-item value="2"></v-stepper-window-item>
                        <v-stepper-window-item value="3"></v-stepper-window-item>
                    </v-stepper-window>
                    <v-row justify="space-between" class="ma-1">
                        <v-col cols="auto">
                            <v-btn 
                            type="button" 
                            @click="currentStep = Math.max(currentStep - 1, 0)" 
                            class="btn"
                            :disabled="currentStep === 0"
                            >
                            {{$t('Previous')}}
                            </v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn type="submit" @click="triggerDemoValidation" class="btn">{{$t('Next')}}</v-btn>
                        </v-col>
                    </v-row>
                </v-stepper>
                currentStep {{ currentStep  }}
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import TestEntryDemo from './testEntryDemo.vue';

export default {
    name: "test",
    components: {
        TestEntryDemo,
    },

    data() {
        return {
            currentStep: 0,
            demoError: false
        }
    },
    computed: {
        showAltLabels() {
            if (this.$vuetify.display.mdAndUp) {
                console.log('mdAndUp')
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        triggerDemoValidation() {
            if (this.$refs.testEntryDemoRef) {
                this.$refs.testEntryDemoRef.handleValidations();
            }
        },
        handleFormValid() {
            this.currentStep++;
        },
        handleFormInvalid(section) {
            if (section === 'demo') {
                this.demoError = true;
            }
        },
    }

}
</script>
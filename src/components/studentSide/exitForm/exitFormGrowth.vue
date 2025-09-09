<!--
  File: src/components/studentSide/exitForm/exitFormGrowth.vue
  
  This component handles the growth assessment and reflection section of the exit form. It evaluates
  how the course experience contributed to the student's professional goals and personal growth
  across various competencies. For Data & Society courses, it includes additional questions about
  future academic and career intentions. For CHW certification courses, it includes specialized
  growth metrics. For HICH experiences, it includes Net Promoter Score questions. The component 
  also collects reflections on key lessons learned and plans for applying that knowledge.
-->

<template>
<v-container>
<v-form
    ref="form"
    @submit.prevent="handleValidations"
>
    <!-- Experience Contribution Section -->
    <v-row class="mt-5">
        <v-col cols="12">
            <p ref="experienceContributionGradProfField" class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red' : isExperienceContributionGradProfInvalid && formSubmitted}">
            {{$t('How did this experience contribute to your graduate/professional goals?')}}
            </p>
        </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12">
                <v-textarea
                    v-model="exitForm.experienceContributions"
                    outlined
                    dense
                    :label="$t('Contribution Description')"
                    rows="4"
                    class="mt-0"
                    :rules="[requiredRule]"
                ></v-textarea>
            </v-col>
    </v-row>

    <!-- Data & Society Specific Questions -->
    <div v-if="dataAndSociety">

    <!-- Mobile Likelihood View -->
    <div class="d-sm-none">
    <v-row>
        <v-col cols="12">
        <p ref="likelihoodFieldMobile" class="font-weight-black text-h8" :class="{ 'text-custom-red': isLikelihoodInvalid && formSubmitted}"> {{$t('Use the scale provided to rate your likelihood of taking the actions listed:')}}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
        <div>
            <div class="font-weight-black">{{$t('Enroll in another Data & Society Course')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.enrollAnotherCourseSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.enrollAnotherCourse"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>
        <div>
            <div class="font-weight-black">{{$t('Complete the Data & Society minor')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.completeMinorSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.completeMinor"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>
        <div>
            <div class="font-weight-black">{{$t('Recommend this course to a friend')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.recommendCourseSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.recommendCourse"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>
        <div>
            <div class="font-weight-black">{{$t('Pursue a career in Data Science')}}</div>
            <v-radio-group v-model="exitForm.likelihoodOf.pursueCareerSelected" :rules="[requiredRule]">
            <v-radio
                v-for="option in exitForm.likelihoodOf.pursueCareer"
                :label="$t(option.label)"
                :key="option.id"
                :value="option.label"
            ></v-radio>
            </v-radio-group>
        </div>

        </v-col>
    </v-row>
    </div>

    <!-- Desktop Likelihood View -->
    <div class="d-none d-sm-block">
        <v-row>
        <v-col cols="12">
            <p ref="likelihoodFieldDesktop" class="font-weight-black text-h8" :class="{ 'text-custom-red': isLikelihoodInvalid && formSubmitted}"> {{$t('Use the scale provided to rate your likelihood of taking the actions listed:')}}</p>
        </v-col>
        </v-row>
        <v-row>
        <v-col cols="12">
        <v-card>
        <v-table>
            <thead>
            <tr>
                <th></th>
                <th v-for="option in exitForm.likelihoodOf.enrollAnotherCourse" :key="option.id">{{ $t(option.label) }}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{{$t('Enroll in another Data & Society Course')}}</td>
                <td v-for="option in exitForm.likelihoodOf.enrollAnotherCourse" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.enrollAnotherCourseSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.enrollAnotherCourseSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            <tr>
                <td>{{$t('Complete the Data & Society minor')}}</td>
                <td v-for="option in exitForm.likelihoodOf.completeMinor" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.completeMinorSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.completeMinorSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            <tr>
                <td>{{$t('Recommend this course to a friend')}}</td>
                <td v-for="option in exitForm.likelihoodOf.recommendCourse" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.recommendCourseSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.recommendCourseSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            <tr>
                <td>{{$t('Pursue a career in Data Science')}}</td>
                <td v-for="option in exitForm.likelihoodOf.pursueCareer" :key="option.id">
                <v-radio-group v-model="exitForm.likelihoodOf.pursueCareerSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.pursueCareerSelected && formSubmitted) ? $t('Please select one.') : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
                </td>
            </tr>
            </tbody>
        </v-table>
        </v-card>
        </v-col>
        </v-row>
    </div>
    </div>

    <!-- HICH Net Promoter Questions - Table Format like Data & Society -->
    <div v-if="isHICHExperience">
        <!-- Mobile HICH View -->
        <div class="d-sm-none">
            <v-row>
                <v-col cols="12">
                    <p ref="hichRecommendFieldMobile" class="font-weight-black text-h8" :class="{ 'text-custom-red': isHICHInvalid && formSubmitted}"> 
                        {{$t('How likely are you to recommend the following to a friend?')}}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div>
                        <div class="font-weight-black">{{$t('HICH')}}</div>
                        <v-radio-group v-model="exitForm.hichNetPromoter.recommendHICH" :rules="[hichRequiredRule]">
                            <v-radio
                                v-for="option in hichLikelihoodOptions"
                                :label="$t(option.label)"
                                :key="option.id"
                                :value="option.label"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <div>
                        <div class="font-weight-black">{{$t("HICH's socials and workshops")}}</div>
                        <v-radio-group v-model="exitForm.hichNetPromoter.recommendSocialsWorkshops" :rules="[hichRequiredRule]">
                            <v-radio
                                v-for="option in hichLikelihoodOptions"
                                :label="$t(option.label)"
                                :key="option.id"
                                :value="option.label"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <div>
                        <div class="font-weight-black">{{$t("HICH's volunteer projects")}}</div>
                        <v-radio-group v-model="exitForm.hichNetPromoter.recommendVolunteerProjects" :rules="[hichRequiredRule]">
                            <v-radio
                                v-for="option in hichLikelihoodOptions"
                                :label="$t(option.label)"
                                :key="option.id"
                                :value="option.label"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <div>
                        <div class="font-weight-black">{{$t("HICH's mentorship program")}}</div>
                        <v-radio-group v-model="exitForm.hichNetPromoter.recommendMentorshipProgram" :rules="[hichRequiredRule]">
                            <v-radio
                                v-for="option in hichLikelihoodOptions"
                                :label="$t(option.label)"
                                :key="option.id"
                                :value="option.label"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                </v-col>
            </v-row>
        </div>

        <!-- Desktop HICH View -->
        <div class="d-none d-sm-block">
            <v-row>
                <v-col cols="12">
                    <p ref="hichRecommendFieldDesktop" class="font-weight-black text-h8" :class="{ 'text-custom-red': isHICHInvalid && formSubmitted}"> 
                        {{$t('How likely are you to recommend the following to a friend?')}}
                    </p>
                </v-col>
            </v-row>
            <v-row>
            <v-col cols="12">
                <v-card>
                    <v-table>
                        <thead>
                            <tr>
                                <th></th>
                                <th v-for="option in hichLikelihoodOptions" :key="option.id">{{ $t(option.label) }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{$t('HICH')}}</td>
                                <td v-for="option in hichLikelihoodOptions" :key="option.id">
                                    <v-radio-group v-model="exitForm.hichNetPromoter.recommendHICH" :rules="[hichRequiredRule]" :error-messages="(!exitForm.hichNetPromoter.recommendHICH && formSubmitted) ? $t('Please select one.') : ''">
                                        <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                    </v-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <td>{{$t("HICH's socials and workshops")}}</td>
                                <td v-for="option in hichLikelihoodOptions" :key="option.id">
                                    <v-radio-group v-model="exitForm.hichNetPromoter.recommendSocialsWorkshops" :rules="[hichRequiredRule]" :error-messages="(!exitForm.hichNetPromoter.recommendSocialsWorkshops && formSubmitted) ? $t('Please select one.') : ''">
                                        <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                    </v-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <td>{{$t("HICH's volunteer projects")}}</td>
                                <td v-for="option in hichLikelihoodOptions" :key="option.id">
                                    <v-radio-group v-model="exitForm.hichNetPromoter.recommendVolunteerProjects" :rules="[hichRequiredRule]" :error-messages="(!exitForm.hichNetPromoter.recommendVolunteerProjects && formSubmitted) ? $t('Please select one.') : ''">
                                        <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                    </v-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <td>{{$t("HICH's mentorship program")}}</td>
                                <td v-for="option in hichLikelihoodOptions" :key="option.id">
                                    <v-radio-group v-model="exitForm.hichNetPromoter.recommendMentorshipProgram" :rules="[hichRequiredRule]" :error-messages="(!exitForm.hichNetPromoter.recommendMentorshipProgram && formSubmitted) ? $t('Please select one.') : ''">
                                        <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                                    </v-radio-group>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
            </v-row>
        </div>
    </div>

    <!-- Growth Assessment Section -->
    <v-row>
        <v-col cols="12">
            <p ref="growthProblemSolvingField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProblemSolvingInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('problem solving')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.problemSolving" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthEffCommField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEffCommInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('effective communication')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.effectiveCommunication" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthTeamworkField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthTeamworkInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teamwork')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.teamwork" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthCulHumField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthCulHumInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('cultural humility')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.culturalHumility" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthEthicsField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEthicsInvalid && formSubmitted }">{{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('ethical decision making')}}</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.ethicalDecisionMaking" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p ref="growthProfResField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProfResInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>professional responsibility</u>.</p>
            <v-radio-group v-model="exitForm.generalGrowth.professionalResponsibility" :rules="[requiredRule]">
                <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>

    <!-- CHW Growth Assessment Section -->
    <div v-if="isCHWExperience">
        
        <v-row>
            <v-col cols="12">
                <p ref="chwInterpersonalField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isCHWInterpersonalInvalid && formSubmitted }">
                    {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('interpersonal and relationship building')}}</u>.
                </p>
                <v-radio-group v-model="exitForm.chwGrowth.interpersonalRelationshipBuilding" :rules="[chwRequiredRule]">
                    <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                    <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                    <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                    <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12">
                <p ref="chwServiceCoordField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isCHWServiceCoordInvalid && formSubmitted }">
                    {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('service coordination and navigation')}}</u>.
                </p>
                <v-radio-group v-model="exitForm.chwGrowth.serviceCoordinationNavigation" :rules="[chwRequiredRule]">
                    <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                    <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                    <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                    <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12">
                <p ref="chwEvaluationField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isCHWEvaluationInvalid && formSubmitted }">
                    {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('evaluation and research')}}</u>.
                </p>
                <v-radio-group v-model="exitForm.chwGrowth.evaluationResearch" :rules="[chwRequiredRule]">
                    <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                    <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                    <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                    <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12">
                <p ref="chwKnowledgeField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isCHWKnowledgeInvalid && formSubmitted }">
                    {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('knowledge base on specific health issues')}}</u>.
                </p>
                <v-radio-group v-model="exitForm.chwGrowth.knowledgeBaseHealthIssues" :rules="[chwRequiredRule]">
                    <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                    <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                    <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                    <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12">
                <p ref="chwTeachingField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isCHWTeachingInvalid && formSubmitted }">
                    {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('teaching and education')}}</u>.
                </p>
                <v-radio-group v-model="exitForm.chwGrowth.teachingEducation" :rules="[chwRequiredRule]">
                    <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                    <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                    <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                    <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12">
                <p ref="chwAdvocacyField" class="font-weight-black text-h8" :class="{ 'text-custom-red': isCHWAdvocacyInvalid && formSubmitted }">
                    {{$t('Please indicate how much growth you experienced during your program in the area of')}} <u>{{$t('advocacy')}}</u>.
                </p>
                <v-radio-group v-model="exitForm.chwGrowth.advocacy" :rules="[chwRequiredRule]">
                    <v-radio :label="$t('No growth')" value="No growth"></v-radio>
                    <v-radio :label="$t('A little growth')" value="A little growth"></v-radio>
                    <v-radio :label="$t('A moderate amount of growth')" value="A moderate amount of growth"></v-radio>
                    <v-radio :label="$t('A lot of growth')" value="A lot of growth"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
    </div>

    <!-- Key Lessons Reflection -->
    <v-row>
        <v-col cols="12">
            <p ref="biggestLessonsField" class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isBiggestLessonsInvalid && formSubmitted }">
            {{$t('What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.biggestLessons"
                class="mt-0"
                outlined
                dense
                :label="$t('Lessons/Takeaways')"
                rows="4"
                :rules="[requiredRule]"
            ></v-textarea>
        </v-col>
    </v-row>

    <!-- Pay It Forward Section -->
    <v-row>
        <v-col cols="12">
            <p ref="supportOthersField" class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isSupportOthersInvalid && formSubmitted }">
            {{$t('Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.supportOthers"
                class="mt-0"
                outlined
                dense
                :label="$t('Engage/Support')"
                rows="4"
                :rules="[requiredRule]"
            ></v-textarea>
        </v-col>
    </v-row>

    <!-- Optional Comments Section -->
    <v-row>
        <v-col cols="12">
            <p class="font-weight-black text-h8 mb-2">
            {{$t('Use this space to provide any other comments or recommendations you would like to share.')}}
            </p>
        </v-col>
    </v-row>
    <v-row dense class="mt-0 pt-0">
        <v-col cols="12">
            <v-textarea
                v-model="exitForm.openEnded.comments"
                class="mt-0"
                outlined
                dense
                :label="$t('Comments/Recommendations')"
                rows="4"
            ></v-textarea>
        </v-col>
    </v-row>

</v-form>

<!-- Floating error navigation button -->
<v-btn
      v-if="hasValidationErrors"
      @click="scrollToErrorField"
      color="error"
      icon
      class="pa-1 fixed-button"
      elevation="4"
      size="small"
    >
      <v-icon>mdi-alert-circle</v-icon>
      <v-tooltip activator="parent" location="start" v-model="jumpToErrorTooltip">Jump to Error</v-tooltip>
    </v-btn>

</v-container>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
    name: "ExitFormGrowth",
    props: {
        exitForm: Object,
        dataAndSociety: Boolean,
        selectedExperience: Object
    },
    emits: ["form-valid", "form-invalid", "scroll-to-error", "validation-change"],
    data() {
        return {
            formSubmitted: false,
            jumpToErrorTooltip: false,
            // HICH likelihood options matching Data & Society format
            hichLikelihoodOptions: [
                { id: 1, label: "Extremely likely" },
                { id: 2, label: "Somewhat likely" },
                { id: 3, label: "Neutral likely/unlikely" },
                { id: 4, label: "Somewhat unlikely" },
                { id: 5, label: "Extremely unlikely" }
            ],
            // Validation rule that only applies after form submission
            requiredRule: value => {
                if (!this.formSubmitted) {
                    return true;
                }
                return !!value || this.$t('Information is required.');
            },
            hichRequiredRule: value => {
                if (!this.formSubmitted || !this.isHICHExperience) {
                    return true;
                }
                return !!value || this.$t('Please select one.');
            },
            chwRequiredRule: value => {
                if (!this.formSubmitted || !this.isCHWExperience) {
                    return true;
                }
                return !!value || this.$t('Information is required.');
            },
        }
    },

    mounted() {
        // Scroll to top on component mount
        this.$nextTick(() => {
            window.scrollTo(0, 0);
        });
        
    },

    watch: {
      // Emit validation state changes and control tooltip
      hasValidationErrors(newValue, oldValue) {
          if (newValue !== oldValue) {
              this.$emit('validation-change', { isValid: !newValue });
          }
          if (newValue) {
              this.jumpToErrorTooltip = true;
          } else {
              this.jumpToErrorTooltip = false;
          }
      },
    },

    computed: {
        // Validate experience contribution field
        isExperienceContributionGradProfInvalid() {
            return !this.exitForm.experienceContributions || this.exitForm.experienceContributions.trim() === '';
        },
        
        // Validate growth assessment fields
        isGrowthProblemSolvingInvalid() {
            return !this.exitForm.generalGrowth.problemSolving;
        },
        isGrowthEffCommInvalid() {
            return !this.exitForm.generalGrowth.effectiveCommunication;
        },
        isGrowthTeamworkInvalid() {
            return !this.exitForm.generalGrowth.teamwork;
        },
        isGrowthCulHumInvalid() {
            return !this.exitForm.generalGrowth.culturalHumility;
        },
        isGrowthEthicsInvalid() {
            return !this.exitForm.generalGrowth.ethicalDecisionMaking;
        },
        isGrowthProfResInvalid() {
            return !this.exitForm.generalGrowth.professionalResponsibility;
        },
        
        // Validate open-ended reflection fields
        isBiggestLessonsInvalid() {
            return !this.exitForm.openEnded.biggestLessons;
        },
        isSupportOthersInvalid() {
            return !this.exitForm.openEnded.supportOthers;
        },
        
        // Validate Data & Society likelihood fields
        isLikelihoodInvalid() {
            return !this.exitForm.likelihoodOf.enrollAnotherCourseSelected || !this.exitForm.likelihoodOf.completeMinorSelected || !this.exitForm.likelihoodOf.recommendCourseSelected || !this.exitForm.likelihoodOf.pursueCareerSelected;
        },
        
        // Check if this is a CHW experience
        isCHWExperience() {
            return this.selectedExperience?.text?.includes('CHW') || 
                   this.selectedExperience?.experienceName?.includes('CHW') || 
                   false;
        },
        
        // Check if this is a HICH experience
        isHICHExperience() {
            return this.selectedExperience?.text?.includes('HICH') || false;
        },
        
        // Validate CHW growth fields
        isCHWInterpersonalInvalid() {
            if (!this.isCHWExperience) return false;
            return !this.exitForm.chwGrowth.interpersonalRelationshipBuilding;
        },
        isCHWServiceCoordInvalid() {
            if (!this.isCHWExperience) return false;
            return !this.exitForm.chwGrowth.serviceCoordinationNavigation;
        },
        isCHWEvaluationInvalid() {
            if (!this.isCHWExperience) return false;
            return !this.exitForm.chwGrowth.evaluationResearch;
        },
        isCHWKnowledgeInvalid() {
            if (!this.isCHWExperience) return false;
            return !this.exitForm.chwGrowth.knowledgeBaseHealthIssues;
        },
        isCHWTeachingInvalid() {
            if (!this.isCHWExperience) return false;
            return !this.exitForm.chwGrowth.teachingEducation;
        },
        isCHWAdvocacyInvalid() {
            if (!this.isCHWExperience) return false;
            return !this.exitForm.chwGrowth.advocacy;
        },
        
        // Validate HICH Net Promoter fields
        isHICHRecommendInvalid() {
            if (!this.isHICHExperience) return false;
            return !this.exitForm.hichNetPromoter.recommendHICH;
        },
        isHICHSocialsInvalid() {
            if (!this.isHICHExperience) return false;
            return !this.exitForm.hichNetPromoter.recommendSocialsWorkshops;
        },
        isHICHVolunteerInvalid() {
            if (!this.isHICHExperience) return false;
            return !this.exitForm.hichNetPromoter.recommendVolunteerProjects;
        },
        isHICHMentorshipInvalid() {
            if (!this.isHICHExperience) return false;
            return !this.exitForm.hichNetPromoter.recommendMentorshipProgram;
        },
        
        // Combined HICH validation
        isHICHInvalid() {
            if (!this.isHICHExperience) return false;
            return this.isHICHRecommendInvalid || this.isHICHSocialsInvalid || 
                   this.isHICHVolunteerInvalid || this.isHICHMentorshipInvalid;
        },
        
        // Overall validation state with conditional checks
        hasValidationErrors() {
            if (!this.formSubmitted) return false;
            
            const commonValidations = this.isExperienceContributionGradProfInvalid || 
                                    this.isGrowthProblemSolvingInvalid || 
                                    this.isGrowthEffCommInvalid || 
                                    this.isGrowthTeamworkInvalid || 
                                    this.isGrowthCulHumInvalid || 
                                    this.isGrowthEthicsInvalid || 
                                    this.isGrowthProfResInvalid || 
                                    this.isBiggestLessonsInvalid || 
                                    this.isSupportOthersInvalid;

            let chwValidations = false;
            if (this.isCHWExperience) {
                chwValidations = this.isCHWInterpersonalInvalid || 
                               this.isCHWServiceCoordInvalid || 
                               this.isCHWEvaluationInvalid || 
                               this.isCHWKnowledgeInvalid || 
                               this.isCHWTeachingInvalid || 
                               this.isCHWAdvocacyInvalid;
            }

            let hichValidations = false;
            if (this.isHICHExperience) {
                hichValidations = this.isHICHInvalid;
            }

            // Include likelihood validation only for Data & Society courses
            if (this.dataAndSociety) {
                return commonValidations || this.isLikelihoodInvalid || chwValidations || hichValidations;
            } else {
                return commonValidations || chwValidations || hichValidations;
            }
        },
    },

    methods: {
        // Validate form and emit result
        async handleValidations() {
            this.formSubmitted = true;
            const { valid } = await this.$refs.form.validate();

            if (valid) {
                this.$emit('form-valid');
            } else {
                this.$emit('form-invalid');
                toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: false
                });
            }
        },

        // Navigate to first error field - FIXED VERSION
        scrollToErrorField() {
            const errorFields = [
                { ref: 'experienceContributionGradProfField', validator: 'isExperienceContributionGradProfInvalid' },
                { ref: 'likelihoodFieldMobile', validator: 'isLikelihoodInvalid', condition: () => this.dataAndSociety && this.isMobile() },
                { ref: 'likelihoodFieldDesktop', validator: 'isLikelihoodInvalid', condition: () => this.dataAndSociety && !this.isMobile() },
                { ref: 'hichRecommendFieldMobile', validator: 'isHICHInvalid', condition: () => this.isHICHExperience && this.isMobile() },
                { ref: 'hichRecommendFieldDesktop', validator: 'isHICHInvalid', condition: () => this.isHICHExperience && !this.isMobile() },
                { ref: 'growthProblemSolvingField', validator: 'isGrowthProblemSolvingInvalid' },
                { ref: 'growthEffCommField', validator: 'isGrowthEffCommInvalid' },
                { ref: 'growthTeamworkField', validator: 'isGrowthTeamworkInvalid' },
                { ref: 'growthCulHumField', validator: 'isGrowthCulHumInvalid' },
                { ref: 'growthEthicsField', validator: 'isGrowthEthicsInvalid' },
                { ref: 'growthProfResField', validator: 'isGrowthProfResInvalid' },
                { ref: 'chwInterpersonalField', validator: 'isCHWInterpersonalInvalid', condition: () => this.isCHWExperience },
                { ref: 'chwServiceCoordField', validator: 'isCHWServiceCoordInvalid', condition: () => this.isCHWExperience },
                { ref: 'chwEvaluationField', validator: 'isCHWEvaluationInvalid', condition: () => this.isCHWExperience },
                { ref: 'chwKnowledgeField', validator: 'isCHWKnowledgeInvalid', condition: () => this.isCHWExperience },
                { ref: 'chwTeachingField', validator: 'isCHWTeachingInvalid', condition: () => this.isCHWExperience },
                { ref: 'chwAdvocacyField', validator: 'isCHWAdvocacyInvalid', condition: () => this.isCHWExperience },
                { ref: 'biggestLessonsField', validator: 'isBiggestLessonsInvalid' },
                { ref: 'supportOthersField', validator: 'isSupportOthersInvalid' }
            ];

            for (const field of errorFields) {
                // Skip if condition exists and is false
                if (field.condition && !field.condition()) {
                    continue;
                }
                
                // Check if field is invalid
                if (this[field.validator]) {
                    const element = this.$refs[field.ref];
                    if (element) {
                        // Element is a native DOM element, not a Vue component
                        this.$emit('scroll-to-error', element);
                        break;
                    }
                }
            }
        },

        // Helper method to detect mobile viewport
        isMobile() {
            // Using Vuetify's breakpoint system
            return this.$vuetify.display.smAndDown;
        },
    },

}
</script>

<style scoped>
/* Floating error button positioning */
.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>
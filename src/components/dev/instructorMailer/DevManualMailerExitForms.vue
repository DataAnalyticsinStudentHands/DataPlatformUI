<!--
DevManualMailerExitForms.vue
Manual mailer form for students without exit forms. Features experience selection,
dual-table student selection, email composition with CKEditor, and bilingual support.
Redesigned UI matching the instructor pages aesthetic.
-->
<template>
<div class="form-content">
  <!-- Experience Selection Section -->
  <div class="form-section">
    <div class="section-header">
      <div class="section-number">1</div>
      <div>
        <h2 class="section-title">Select Experience</h2>
        <p class="section-subtitle">Choose an experience to find students without exit forms</p>
      </div>
    </div>

    <div class="section-content">
      <v-row>
        <v-col cols="12" sm="8" md="8">
          <v-autocomplete
            v-model="selectedExperience"
            :items="formattedExperiences"
            label="Experience"
            item-title="text"
            item-value="value"
            variant="outlined"
            clearable
            active
          ></v-autocomplete>
        </v-col>
      </v-row>
    </div>
  </div>

  <template v-if="studentsWithoutExitForms && studentsWithoutExitForms.length">
    <v-divider></v-divider>

    <!-- Student Selection Section -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">2</div>
        <div>
          <h2 class="section-title">Select Recipients</h2>
          <p class="section-subtitle">{{ totalStudentsCount }} students found without exit forms</p>
        </div>
      </div>

      <div class="section-content">
        <v-row>
          <!-- Left Table: Students Without Exit Form -->
          <v-col cols="12" md="5">
            <v-card variant="outlined" class="table-card">
              <v-card-title class="table-card-title">
                <v-icon start size="20" color="#c8102e">mdi-account-group-outline</v-icon>
                Students Without Exit Forms
              </v-card-title>
              <template v-slot:text>
                <v-text-field
                  v-model="studentSearch"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  single-line
                  variant="outlined"
                  hide-details
                  density="compact"
                ></v-text-field>
              </template>
              <v-data-table
                :headers="studentHeaders"
                :items="filteredStudentsWithoutExitForm"
                item-value="_id"
                items-per-page="-1"
                class="scrollable-table"
                hover
              >
                <template v-slot:body="{ items }">
                  <template v-for="item in items" :key="item._id">
                    <tr
                      @click="toggleSelection(item._id)"
                      :class="['pointer-cursor', selectedStudents.includes(item._id) ? 'selected-row' : '']"
                    >
                      <td>{{ item.firstName }} {{ item.lastName }}</td>
                      <td>{{ item.email }}</td>
                    </tr>
                  </template>
                </template>
                <template v-slot:bottom></template>
              </v-data-table>
            </v-card>
            <div class="mt-3">
              <v-btn
                variant="outlined"
                size="small"
                @click="selectAllStudents"
              >
                Select All
              </v-btn>
            </div>
          </v-col>

          <!-- Transfer Buttons -->
          <v-col cols="12" md="1" class="d-flex align-center justify-center px-0">
            <div class="transfer-buttons">
              <v-btn
                color="#c8102e"
                variant="tonal"
                icon
                size="small"
                class="mb-2"
                @click="addSelectedToEmailRecipients"
              >
                <v-icon>mdi-chevron-double-right</v-icon>
              </v-btn>
              <v-btn
                variant="tonal"
                icon
                size="small"
                @click="removeSelectedFromEmailRecipients"
              >
                <v-icon>mdi-chevron-double-left</v-icon>
              </v-btn>
            </div>
          </v-col>

          <!-- Right Table: Email Recipients -->
          <v-col cols="12" md="5">
            <v-card variant="outlined" class="table-card">
              <v-card-title class="table-card-title">
                <v-icon start size="20" color="#c8102e">mdi-email-check-outline</v-icon>
                Email Recipients
              </v-card-title>
              <template v-slot:text>
                <v-text-field
                  v-model="emailRecipientSearch"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  single-line
                  variant="outlined"
                  hide-details
                  density="compact"
                ></v-text-field>
              </template>
              <v-data-table
                :headers="studentHeaders"
                :items="filteredEmailRecipients"
                item-value="_id"
                items-per-page="-1"
                class="scrollable-table"
                hover
              >
                <template v-slot:body="{ items }">
                  <template v-for="item in items" :key="item._id">
                    <tr
                      @click="toggleEmailSelection(item._id)"
                      :class="['pointer-cursor', selectedEmailRecipients.includes(item._id) ? 'selected-row' : '']"
                    >
                      <td>{{ item.firstName }} {{ item.lastName }}</td>
                      <td>{{ item.email }}</td>
                    </tr>
                  </template>
                </template>
                <template v-slot:bottom></template>
              </v-data-table>
            </v-card>
            <div class="mt-3">
              <v-btn
                variant="outlined"
                size="small"
                @click="selectAllEmailRecipients"
              >
                Select All
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Email Composition Section -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">3</div>
        <div>
          <h2 class="section-title">Compose Email</h2>
          <p class="section-subtitle">Write your email content for the selected recipients</p>
        </div>
      </div>

      <div class="section-content">
        <div class="translation-toggle">
          <div class="translation-toggle-left">
            <v-icon size="20" color="#c8102e" class="mr-3">mdi-translate</v-icon>
            <div>
              <span class="translation-toggle-label">Include Translation</span>
              <p class="translation-toggle-hint">
                Write a message in English and Spanish. Students will receive one based on their "Language Preference"
              </p>
            </div>
          </div>
          <v-switch
            v-model="includeSpanish"
            color="#c8102e"
            hide-details
            inset
            density="compact"
          ></v-switch>
        </div>

        <!-- Single Language Email -->
        <div v-if="!includeSpanish" class="email-editor-card">
          <v-text-field
            ref="subjectField"
            v-model="emailHeader"
            label="Subject"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-email-outline"
          ></v-text-field>
          <div class="subject-placeholders">
            <v-btn variant="text" size="x-small" @click="addSubjectPlaceholder('subjectField', 'emailHeader', '{{FIRST_NAME}}')">
              <v-icon start size="16">mdi-account-outline</v-icon>
              First Name
            </v-btn>
            <v-btn variant="text" size="x-small" @click="addSubjectPlaceholder('subjectField', 'emailHeader', '{{LAST_NAME}}')">
              <v-icon start size="16">mdi-account-outline</v-icon>
              Last Name
            </v-btn>
          </div>
          <label class="editor-label">Message Body</label>
          <div class="editor-wrapper">
            <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor>
          </div>
          <v-btn
            variant="text"
            size="small"
            class="mt-2 mr-2"
            @click="addFirstName"
          >
            <v-icon start size="18">mdi-account-outline</v-icon>
            Add First Name
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            class="mt-2"
            @click="addLastName"
          >
            <v-icon start size="18">mdi-account-outline</v-icon>
            Add Last Name
          </v-btn>
        </div>

        <!-- Bilingual Email -->
        <v-row v-else>
          <v-col cols="12" md="6">
            <div class="email-editor-card">
              <div class="language-badge">
                  English
              </div>
              <v-text-field
                ref="subjectFieldEnglish"
                v-model="emailHeaderEnglish"
                label="Subject"
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
              <div class="subject-placeholders">
                <v-btn variant="text" size="x-small" @click="addSubjectPlaceholder('subjectFieldEnglish', 'emailHeaderEnglish', '{{FIRST_NAME}}')">
                  <v-icon start size="16">mdi-account-outline</v-icon>
                  First Name
                </v-btn>
                <v-btn variant="text" size="x-small" @click="addSubjectPlaceholder('subjectFieldEnglish', 'emailHeaderEnglish', '{{LAST_NAME}}')">
                  <v-icon start size="16">mdi-account-outline</v-icon>
                  Last Name
                </v-btn>
              </div>
              <label class="editor-label">Message Body</label>
              <div class="editor-wrapper">
                <ckeditor :editor="editor" v-model="editorDataEnglish" :config="editorConfig" @ready="onEditorEnglishReady"></ckeditor>
              </div>
              <v-btn
                variant="text"
                size="small"
                class="mt-2 mr-2"
                @click="addFirstNameEnglish"
              >
                <v-icon start size="18">mdi-account-outline</v-icon>
                Add First Name
              </v-btn>
              <v-btn
                variant="text"
                size="small"
                class="mt-2"
                @click="addLastNameEnglish"
              >
                <v-icon start size="18">mdi-account-outline</v-icon>
                Add Last Name
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="email-editor-card">
              <div class="language-badge">
                  Spanish
              </div>
              <v-text-field
                ref="subjectFieldSpanish"
                v-model="emailHeaderSpanish"
                label="Subject"
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
              <div class="subject-placeholders">
                <v-btn variant="text" size="x-small" @click="addSubjectPlaceholder('subjectFieldSpanish', 'emailHeaderSpanish', '{{FIRST_NAME}}')">
                  <v-icon start size="16">mdi-account-outline</v-icon>
                  First Name
                </v-btn>
                <v-btn variant="text" size="x-small" @click="addSubjectPlaceholder('subjectFieldSpanish', 'emailHeaderSpanish', '{{LAST_NAME}}')">
                  <v-icon start size="16">mdi-account-outline</v-icon>
                  Last Name
                </v-btn>
              </div>
              <label class="editor-label">Message Body</label>
              <div class="editor-wrapper">
                <ckeditor :editor="editor" v-model="editorDataSpanish" :config="editorConfig" @ready="onEditorSpanishReady"></ckeditor>
              </div>
              <v-btn
                variant="text"
                size="small"
                class="mt-2 mr-2"
                @click="addFirstNameSpanish"
              >
                <v-icon start size="18">mdi-account-outline</v-icon>
                Add First Name
              </v-btn>
              <v-btn
                variant="text"
                size="small"
                class="mt-2"
                @click="addLastNameSpanish"
              >
                <v-icon start size="18">mdi-account-outline</v-icon>
                Add Last Name
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Email Preview Section -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">4</div>
        <div>
          <h2 class="section-title">Email Preview</h2>
          <p class="section-subtitle">Preview how the email will appear to recipients</p>
        </div>
      </div>

      <div class="section-content">
        <div v-if="!previewRecipient" class="preview-empty">
          <v-icon size="48" color="#ccc">mdi-email-outline</v-icon>
          <p>Add at least one recipient to the <strong>Email Recipients</strong> list to see a live preview</p>
        </div>

        <template v-else>
          <!-- Single Language Preview -->
          <div v-if="!includeSpanish" class="email-preview">
            <div class="email-preview-header">
              <div class="email-preview-row">
                <span class="email-preview-label">From:</span>
                <span class="email-preview-value">Data Platform &lt;data.platform123@gmail.com&gt;</span>
              </div>
              <div class="email-preview-row">
                <span class="email-preview-label">To:</span>
                <span class="email-preview-value">{{ previewRecipient.firstName }} {{ previewRecipient.lastName }} &lt;{{ previewRecipient.email }}&gt;</span>
              </div>
              <div class="email-preview-row">
                <span class="email-preview-label">Subject:</span>
                <span class="email-preview-value email-preview-subject">{{ previewSubject }}</span>
              </div>
            </div>
            <div class="email-preview-body" v-html="previewBody"></div>
          </div>

          <!-- Bilingual Preview -->
          <v-row v-else>
            <v-col cols="12" md="6">
              <div class="email-preview">
                <div class="language-badge mb-3" style="margin: 16px 20px 0;">English</div>
                <div class="email-preview-header">
                  <div class="email-preview-row">
                    <span class="email-preview-label">From:</span>
                    <span class="email-preview-value">Data Platform &lt;data.platform123@gmail.com&gt;</span>
                  </div>
                  <div class="email-preview-row">
                    <span class="email-preview-label">To:</span>
                    <span class="email-preview-value">{{ previewRecipient.firstName }} {{ previewRecipient.lastName }} &lt;{{ previewRecipient.email }}&gt;</span>
                  </div>
                  <div class="email-preview-row">
                    <span class="email-preview-label">Subject:</span>
                    <span class="email-preview-value email-preview-subject">{{ previewSubjectEnglish }}</span>
                  </div>
                </div>
                <div class="email-preview-body" v-html="previewBodyEnglish"></div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="email-preview">
                <div class="language-badge mb-3" style="margin: 16px 20px 0;">Spanish</div>
                <div class="email-preview-header">
                  <div class="email-preview-row">
                    <span class="email-preview-label">From:</span>
                    <span class="email-preview-value">Data Platform &lt;data.platform123@gmail.com&gt;</span>
                  </div>
                  <div class="email-preview-row">
                    <span class="email-preview-label">To:</span>
                    <span class="email-preview-value">{{ previewRecipient.firstName }} {{ previewRecipient.lastName }} &lt;{{ previewRecipient.email }}&gt;</span>
                  </div>
                  <div class="email-preview-row">
                    <span class="email-preview-label">Subject:</span>
                    <span class="email-preview-value email-preview-subject">{{ previewSubjectSpanish }}</span>
                  </div>
                </div>
                <div class="email-preview-body" v-html="previewBodySpanish"></div>
              </div>
            </v-col>
          </v-row>
        </template>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <v-spacer></v-spacer>
      <v-btn
        size="large"
        color="#c8102e"
        class="action-btn submit-btn"
        :disabled="emailDisabled"
        @click="sendEmailDialog = true"
      >
        <v-icon start size="18">mdi-send</v-icon>
        Send
      </v-btn>
    </div>
  </template>
</div>

<!-- Send Confirmation Dialog -->
<v-dialog v-model="sendEmailDialog" persistent max-width="500px">
  <v-card class="dialog-card">
    <v-card-title class="text-h5 pa-6 pb-2">
      Confirm Email
    </v-card-title>
    <v-card-text class="pa-6 pt-2">
      <p>Are you sure you want to send emails to <strong>{{ this.emailRecipients.length }}</strong> students?</p>
    </v-card-text>
    <v-card-actions class="pa-6 pt-0">
      <v-spacer></v-spacer>
      <v-btn variant="outlined" @click="cancelEmail" class="action-btn">
        Cancel
      </v-btn>
      <v-btn color="#c8102e" variant="flat" @click="sendEmail" class="action-btn submit-btn">
        Yes, Send
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export default {
    name: 'DevManualMailerExitForms',
    components: {
        ckeditor: Ckeditor
    },
    inject: ['setTab', 'emailProgress'],
    data() {
        return {
            selectedExperience: null,
            expInstances: [],
            studentsWithoutExitForms: [],
            studentSearch: null,
            studentHeaders: [
                {
                    title: "Student Name",
                    value: "fullName",
                    key: "firstName",
                    align: "start",
                    sortable: true
                },
                {
                    title: "Email",
                    value: "email",
                    key: "email",
                    align: "start",
                    sortable: true
                },
            ],
            hoveredItem: null,
            selectedStudents: [],
            emailRecipients: [],
            selectedEmailRecipients: [],
            emailRecipientSearch: null,
            editorInstance: null,
            editor: ClassicEditor,
            editorData: '',
            editorDataEnglish: '',
            editorDataSpanish: '',
            editorConfig: {},
            includeSpanish: false,
            editorEnglishInstance: null,
            editorSpanishInstance: null,
            emailHeader: '',
            emailHeaderEnglish: '',
            emailHeaderSpanish: '',
            sendEmailDialog: false,
        }
    },
    created() {
        this.fetchExperienceInstances();
    },
    watch: {
        selectedExperience(newVal) {
            if (newVal) {
                this.fetchStudents();
            } else {
                this.studentsWithoutExitForms = [];
                this.emailRecipients = [];
                this.selectedStudents = [];
                this.selectedEmailRecipients = [];
            }
        }
    },
    computed: {
        formattedExperiences() {
            return this.expInstances.map(instance => ({
                text: `(${instance.sessionName}) ${instance.experienceCategory}: ${instance.experienceName}`,
                value: instance.expInstanceID
            }));
        },
        totalStudentsCount() {
            return this.studentsWithoutExitForms.length;
        },
        filteredStudentsWithoutExitForm() {
            if (!this.studentSearch) {
                return this.studentsWithoutExitForms.filter(student =>
                    !this.emailRecipients.some(recipient => recipient._id === student._id));
            }

            const searchLower = this.studentSearch.toLowerCase();

            return this.studentsWithoutExitForms.filter(student => {
                const notInEmailRecipients = !this.emailRecipients.some(recipient => recipient._id === student._id);
                const matchesSearch = student.firstName.toLowerCase().includes(searchLower) ||
                                    student.lastName.toLowerCase().includes(searchLower) ||
                                    student.email.toLowerCase().includes(searchLower);

                return notInEmailRecipients && matchesSearch;
            });
        },

        filteredEmailRecipients() {
            if (!this.emailRecipientSearch) {
                return this.emailRecipients;
            }

            const searchLower = this.emailRecipientSearch.toLowerCase();

            return this.emailRecipients.filter(recipient => {
                return recipient.firstName.toLowerCase().includes(searchLower) ||
                    recipient.lastName.toLowerCase().includes(searchLower) ||
                    recipient.email.toLowerCase().includes(searchLower);
            });
        },

        previewRecipient() {
            return this.emailRecipients.length > 0 ? this.emailRecipients[0] : null;
        },

        previewSubject() {
            if (!this.previewRecipient) return '';
            return this.replacePlaceholders(this.emailHeader);
        },

        previewBody() {
            if (!this.previewRecipient) return '';
            return this.replacePlaceholders(this.editorData);
        },

        previewSubjectEnglish() {
            if (!this.previewRecipient) return '';
            return this.replacePlaceholders(this.emailHeaderEnglish);
        },

        previewBodyEnglish() {
            if (!this.previewRecipient) return '';
            return this.replacePlaceholders(this.editorDataEnglish);
        },

        previewSubjectSpanish() {
            if (!this.previewRecipient) return '';
            return this.replacePlaceholders(this.emailHeaderSpanish);
        },

        previewBodySpanish() {
            if (!this.previewRecipient) return '';
            return this.replacePlaceholders(this.editorDataSpanish);
        },

        emailDisabled() {
            if (!this.emailRecipients || this.emailRecipients.length === 0) {
                return true;
            }

            if (!this.includeSpanish) {
                return !this.editorData || !this.emailHeader || this.editorData.length === 0 || this.emailHeader.length === 0;
            } else {
                return !this.editorDataEnglish || !this.editorDataSpanish ||
                    !this.emailHeaderEnglish || !this.emailHeaderSpanish ||
                    this.editorDataEnglish.length === 0 || this.editorDataSpanish.length === 0 ||
                    this.emailHeaderEnglish.length === 0 || this.emailHeaderSpanish.length === 0;
            }
        },
    },
    methods: {

        async fetchExperienceInstances() {
            const url = import.meta.env.VITE_ROOT_API + '/instructorSideData/experience-instances/active/';

            try {
                const response = await axios.get(url);
                this.expInstances = response.data.map(instance => ({
                    expInstanceID: instance._id,
                    sessionName: instance.session.name,
                    experienceCategory: instance.experience.category,
                    experienceName: instance.experience.name
                }));
            } catch (error) {
                toast.error('Failed to fetch experiences.', {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
        },

        async fetchStudents() {
            this.selectedStudents = [];
            this.selectedEmailRecipients = [];

            const url = import.meta.env.VITE_ROOT_API + `/instructorSideData/students-without-exit-form/${this.selectedExperience}`;

            try {
                const response = await axios.get(url);
                this.studentsWithoutExitForms = response.data;
            } catch (error) {
                toast.error('Failed to fetch students.', {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
        },

        toggleSelection(studentID) {
            const index = this.selectedStudents.indexOf(studentID);
            if (index === -1) {
                this.selectedStudents.push(studentID);
            } else {
                this.selectedStudents.splice(index, 1);
            }
        },

        selectAllStudents() {
            const anyUnselected = this.filteredStudentsWithoutExitForm.some(student => !this.selectedStudents.includes(student._id));

            if (anyUnselected) {
                this.selectedStudents = this.filteredStudentsWithoutExitForm.map(student => student._id);
            } else {
                this.selectedStudents = this.selectedStudents.filter(id => !this.filteredStudentsWithoutExitForm.some(student => student._id === id));
            }
        },

        addSelectedToEmailRecipients() {
            const selectedStudentsInfo = this.studentsWithoutExitForms.filter(student =>
                this.selectedStudents.includes(student._id));

            selectedStudentsInfo.forEach(student => {
                if (!this.emailRecipients.some(recipient => recipient._id === student._id)) {
                    this.emailRecipients.push(student);
                }
            });
            this.selectedEmailRecipients = [];
            this.selectedStudents = [];
        },

        toggleEmailSelection(studentID) {
            const index = this.selectedEmailRecipients.indexOf(studentID);
            if (index === -1) {
                this.selectedEmailRecipients.push(studentID);
            } else {
                this.selectedEmailRecipients.splice(index, 1);
            }
        },

        selectAllEmailRecipients() {
            const anyUnselected = this.filteredEmailRecipients.some(student => !this.selectedEmailRecipients.includes(student._id));

            if (anyUnselected) {
                this.selectedEmailRecipients = this.filteredEmailRecipients.map(student => student._id);
            } else {
                this.selectedEmailRecipients = this.selectedEmailRecipients.filter(id => !this.filteredEmailRecipients.some(student => student._id === id));
            }
        },

        removeSelectedFromEmailRecipients() {
            this.emailRecipients = this.emailRecipients.filter(recipient =>
                !this.selectedEmailRecipients.includes(recipient._id));

            this.selectedEmailRecipients = [];
            this.selectedStudents = [];
        },

        onEditorReady(editorInstance) {
            this.editorInstance = editorInstance;
        },

        onEditorEnglishReady(editorInstance) {
            this.editorEnglishInstance = editorInstance;
        },

        onEditorSpanishReady(editorInstance) {
            this.editorSpanishInstance = editorInstance;
        },

        addSubjectPlaceholder(refName, modelKey, placeholder) {
            const field = this.$refs[refName];
            const input = field?.$el?.querySelector('input');
            if (input) {
                const start = input.selectionStart ?? this[modelKey].length;
                const end = input.selectionEnd ?? start;
                const current = this[modelKey];
                this[modelKey] = current.slice(0, start) + placeholder + current.slice(end);
                this.$nextTick(() => {
                    const newPos = start + placeholder.length;
                    input.focus();
                    input.setSelectionRange(newPos, newPos);
                });
            } else {
                this[modelKey] += placeholder;
            }
        },

        insertPlaceholder(editorInstance, placeholder) {
            if (editorInstance) {
                editorInstance.model.change(writer => {
                    const placeholderText = writer.createText(placeholder);
                    const insertPosition = editorInstance.model.document.selection.getFirstPosition();
                    editorInstance.model.insertContent(placeholderText, insertPosition);
                });
            }
        },

        addFirstName() {
            this.insertPlaceholder(this.editorInstance, '{{FIRST_NAME}}');
        },

        addLastName() {
            this.insertPlaceholder(this.editorInstance, '{{LAST_NAME}}');
        },

        addFirstNameEnglish() {
            this.insertPlaceholder(this.editorEnglishInstance, '{{FIRST_NAME}}');
        },

        addLastNameEnglish() {
            this.insertPlaceholder(this.editorEnglishInstance, '{{LAST_NAME}}');
        },

        addFirstNameSpanish() {
            this.insertPlaceholder(this.editorSpanishInstance, '{{FIRST_NAME}}');
        },

        addLastNameSpanish() {
            this.insertPlaceholder(this.editorSpanishInstance, '{{LAST_NAME}}');
        },

        sendEmail() {
            let apiURL;
            let emailData;

            if (!this.includeSpanish) {
                apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/manual-mailer`;
                emailData = {
                    recipients: this.emailRecipients.map(recipient => ({
                        email: recipient.email,
                        fullName: `${recipient.firstName} ${recipient.lastName}`,
                        firstName: recipient.firstName,
                        lastName: recipient.lastName
                    })),
                    subject: this.emailHeader,
                    htmlContent: this.editorData
                };
            } else {
                apiURL = `${import.meta.env.VITE_ROOT_API}/instructorSideData/manual-mailer/multi-language`;
                emailData = {
                    recipients: this.emailRecipients.map(recipient => ({
                        email: recipient.email,
                        fullName: `${recipient.firstName} ${recipient.lastName}`,
                        firstName: recipient.firstName,
                        lastName: recipient.lastName,
                        languagePreference: recipient.languagePreference
                    })),
                    subjectEnglish: this.emailHeaderEnglish,
                    htmlContentEnglish: this.editorDataEnglish,
                    subjectSpanish: this.emailHeaderSpanish,
                    htmlContentSpanish: this.editorDataSpanish
                };
            }

            // Close dialog and switch to overview immediately
            this.sendEmailDialog = false;
            toast.success('Emails are being sent!', {
                position: "top-right",
                toastClassName: "Toastify__toast--create",
                multiple: true,
            });
            this.setTab('overview');

            // Fire the POST in the background — don't block the UI
            axios.post(apiURL, emailData)
                .catch((error) => {
                    console.error('Send email error:', error);
                    toast.error('Failed to send emails.', {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete'
                    });
                });
        },

        replacePlaceholders(text) {
            if (!text || !this.previewRecipient) return text;
            return text
                .replace(/\{\{FIRST_NAME\}\}/g, this.previewRecipient.firstName)
                .replace(/\{\{LAST_NAME\}\}/g, this.previewRecipient.lastName);
        },

        cancelEmail() {
            this.sendEmailDialog = false;
        }
    }
}
</script>

<style scoped>
/* Form Content */
.form-content {
  background-color: #fff;
}

/* Form Sections */
.form-section {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0;
}

.section-content {
  padding-left: 48px;
}

/* Table Cards */
.table-card {
  border-radius: 8px;
}

.table-card-title {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

/* Transfer Buttons */
.transfer-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Form Actions */
.form-actions {
  display: flex;
  align-items: center;
  padding: 20px 32px;
  background-color: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.action-btn {
  min-width: 120px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.submit-btn {
  color: white !important;
}

/* Table Styles */
.pointer-cursor {
  cursor: pointer;
}

.scrollable-table {
  height: 400px;
  overflow-y: auto;
}

.scrollable-table::-webkit-scrollbar {
  width: 8px;
}

.scrollable-table::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.scrollable-table::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.scrollable-table::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.selected-row {
  background-color: #fce4ec;
}

/* Translation Toggle */
.translation-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 24px;
}

.translation-toggle-left {
  display: flex;
  align-items: center;
}

.translation-toggle-label {
  font-weight: 600;
  font-size: 0.925rem;
  color: #1a1a1a;
}

.translation-toggle-hint {
  font-size: 0.8rem;
  color: #888;
  margin: 2px 0 0 0;
}

/* Email Editor Card */
.email-editor-card {
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 20px;
}

.language-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #c8102e;
  background-color: #fce4ec;
  border-radius: 6px;
  padding: 4px 10px;
  margin-bottom: 16px;
}

.subject-placeholders {
  margin-bottom: 12px;
}

.editor-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
}

.editor-wrapper {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.editor-wrapper :deep(.ck-editor__editable) {
  min-height: 280px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.editor-wrapper :deep(.ck-editor__editable h1) {
  font-size: 2rem;
  font-weight: bold;
}

.editor-wrapper :deep(.ck-editor__editable h2) {
  font-size: 1.5rem;
  font-weight: bold;
}

.editor-wrapper :deep(.ck-editor__editable h3) {
  font-size: 1.17rem;
  font-weight: bold;
}

.editor-wrapper :deep(.ck-editor__editable h4) {
  font-size: 1rem;
  font-weight: bold;
}

.editor-wrapper :deep(.ck-editor__editable ol) {
  list-style-type: decimal;
  padding-left: 2em;
}

.editor-wrapper :deep(.ck-editor__editable ul) {
  list-style-type: disc;
  padding-left: 2em;
}

.editor-wrapper :deep(.ck-editor__editable blockquote) {
  border-left: 4px solid #ccc;
  padding-left: 16px;
  margin-left: 0;
  margin-bottom: 12px;
  color: #666;
  font-style: italic;
}

.editor-wrapper :deep(.ck-editor__editable table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 12px;
}

.editor-wrapper :deep(.ck-editor__editable th),
.editor-wrapper :deep(.ck-editor__editable td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.editor-wrapper :deep(.ck-editor__editable th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

.editor-wrapper :deep(.ck-editor__editable a) {
  color: #1a73e8;
  text-decoration: underline;
}

.editor-wrapper :deep(.ck-editor__editable p) {
  margin-bottom: 0.6em;
}

.editor-wrapper :deep(.ck.ck-editor__top) {
  border-bottom: 1px solid #e0e0e0;
}

.editor-wrapper :deep(.ck.ck-toolbar) {
  background-color: #fafafa;
  border: none;
}

/* Email Preview */
.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #999;
  text-align: center;
}

.preview-empty p {
  margin-top: 12px;
  font-size: 0.9rem;
}

.email-preview {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.email-preview-header {
  background-color: #f8f8f8;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.email-preview-row {
  display: flex;
  align-items: baseline;
  padding: 3px 0;
  font-size: 0.875rem;
}

.email-preview-label {
  color: #888;
  font-weight: 500;
  min-width: 65px;
  flex-shrink: 0;
}

.email-preview-value {
  color: #333;
}

.email-preview-subject {
  font-weight: 600;
  color: #1a1a1a;
}

.email-preview-body {
  padding: 24px 20px;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #222;
  min-height: 120px;
}

.email-preview-body :deep(p) {
  margin-bottom: 12px;
}

.email-preview-body :deep(h1) {
  font-size: 2rem;
  font-weight: bold;
}

.email-preview-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: bold;
}

.email-preview-body :deep(h3) {
  font-size: 1.17rem;
  font-weight: bold;
}

.email-preview-body :deep(h4) {
  font-size: 1rem;
  font-weight: bold;
}

.email-preview-body :deep(ol) {
  list-style-type: decimal;
  padding-left: 2em;
}

.email-preview-body :deep(ul) {
  list-style-type: disc;
  padding-left: 2em;
}

.email-preview-body :deep(blockquote) {
  border-left: 4px solid #ccc;
  padding-left: 16px;
  margin-left: 0;
  margin-bottom: 12px;
  color: #666;
  font-style: italic;
}

.email-preview-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 12px;
}

.email-preview-body :deep(th),
.email-preview-body :deep(td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.email-preview-body :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

.email-preview-body :deep(a) {
  color: #1a73e8;
  text-decoration: underline;
}

/* Dialog */
.dialog-card {
  border-radius: 12px;
}

/* Responsive */
@media (max-width: 960px) {
  .form-section {
    padding: 24px 20px;
  }

  .section-content {
    padding-left: 0;
    margin-top: 16px;
  }

  .form-actions {
    padding: 16px 20px;
  }
}
</style>

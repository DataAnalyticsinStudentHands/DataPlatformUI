<template>
  <main>
    <!-- Form for updating a project -->
    <v-form @submit.prevent="handleUpdateForm">
      <v-container>
        <!-- Page title -->
        <p class="font-weight-black text-h6">Update Project</p>

        <!-- Input for the project name -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="project.projectName"
              label="Project Name"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Input for the project description -->
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="project.projectDescription"
              label="Project Description"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- Checkboxes for selecting tags (split into columns of 7) -->
        <p class="font-weight-bold text-subtitle-1">Select Tags</p>
        <v-row justify="start">
          <v-col
            v-for="(column, colIndex) in tagColumns"
            :key="colIndex"
            cols="auto"
          >
            <div v-for="tag in column" :key="tag">
              <v-checkbox
                density="compact"
                class="ma-0 pa-0"
                hide-details="true"
                v-model="project.selectedTags"
                :label="tag"
                :value="tag"
              ></v-checkbox>
            </div>
          </v-col>
        </v-row>

        <!-- SHARE PROJECT EXPANSION PANEL -->
        <v-expansion-panels 
          class="mt-4"
          elevation="0"
        >
          <v-expansion-panel>
            <v-expansion-panel-title>
              Share Project
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p>
                Select how you would like to share
                <strong>{{ project.projectName }}</strong>:
              </p>
              
              <!-- Radio Group for Code or Link -->
              <v-radio-group v-model="shareOption" :mandatory="true" row>
                <v-radio label="Share via Code" value="code"></v-radio>
                <v-radio label="Share via Link" value="link"></v-radio>
              </v-radio-group>
              
              <!-- SHARE VIA CODE -->
              <div v-if="shareOption === 'code'" class="mt-3">
                <v-btn color="primary" @click="generateShareCode">
                  Generate Code
                </v-btn>
                <div v-if="shareCode" class="mt-3">
                  <p><strong>Project Code:</strong></p>
                  <v-chip color="primary" class="ma-0 pa-2 text-h6 white--text">
                    {{ shareCode }}
                  </v-chip>
                </div>
              </div>
              
              <!-- SHARE VIA LINK -->
              <div v-else-if="shareOption === 'link'" class="mt-3">
                <p>Enter recipient email addresses to share with:</p>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="emailInput"
                      label="Email address"
                      @keyup.enter="addEmail"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" class="d-flex align-center">
                    <v-btn color="primary" @click="addEmail">
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
                <!-- Display emails as chips -->
                <div v-if="recipients.length" class="mt-3">
                  <p>Recipients:</p>
                  <v-chip-group
                    v-model="recipients"
                    multiple
                    column
                    active-class="white--text"
                  >
                    <v-chip
                      v-for="(chip, index) in recipients"
                      :key="index"
                      color="secondary"
                      close
                      @click:close="removeEmail(index)"
                    >
                      {{ chip }}
                    </v-chip>
                  </v-chip-group>
                </div>
                <!-- Confirm button -->
                <div class="text-right mt-4">
                  <v-btn color="success" @click="confirmShareLink">
                    Confirm
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

<!-- TRANSFER OWNERSHIP EXPANSION PANEL -->
<v-expansion-panels class="mt-4" elevation="0">
  <v-expansion-panel>
    <v-expansion-panel-title>
      Transfer Ownership
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <p>
        Select how you would like to transfer ownership of
        <strong>{{ project.projectName }}</strong>:
      </p>
      <!-- Radio Group for Code or Link -->
      <v-radio-group v-model="transferOption" :mandatory="true" row>
        <v-radio label="Transfer via Code" value="code"></v-radio>
        <v-radio label="Transfer via Link" value="link"></v-radio>
      </v-radio-group>
      <!-- TRANSFER VIA CODE -->
      <div v-if="transferOption === 'code'" class="mt-3">
        <v-btn color="warning" dark @click="generateTransferCode">
          Generate Transfer Code
        </v-btn>
        <div v-if="transferCode" class="mt-3">
          <p><strong>Ownership Transfer Code:</strong></p>
          <v-chip color="warning" dark class="ma-0 pa-2 text-h6">
            {{ transferCode }}
          </v-chip>
          <p class="mt-2 text-caption">
            Provide this code to the new owner, who can use it to claim ownership.
          </p>
        </div>
      </div>
      <!-- TRANSFER VIA LINK -->
      <div v-else-if="transferOption === 'link'" class="mt-3">
        <p>Enter the new owner's email address to transfer ownership:</p>
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="transferEmailInput"
              label="Email address"
              @keyup.enter="addTransferEmail"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-center">
            <v-btn v-if="!transferRecipients.length" color="warning" dark @click="addTransferEmail">
              Add
            </v-btn>
          </v-col>
        </v-row>
        <!-- Display emails as chips -->
        <div v-if="transferRecipients.length" class="mt-3">
          <p>Recipients:</p>
          <v-chip-group
            v-model="transferRecipients"
            multiple
            column
            active-class="white--text"
          >
            <v-chip
              v-for="(chip, index) in transferRecipients"
              :key="index"
              color="warning"
              close
              dark
              @click:close="removeTransferEmail(index)"
            >
              {{ chip }}
            </v-chip>
          </v-chip-group>
        </div>
        <!-- Confirm button -->
        <div class="mt-4">
          <v-btn color="success" @click="confirmTransferOwnership">
            Confirm Transfer
          </v-btn>
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>

        <!-- Action buttons -->
        <v-row class="mt-4">
          <v-col cols="12" class="d-flex align-center">
            <!-- Cancel -->
            <v-btn @click="$router.back()" style="margin-right: 10px;">
              Cancel
            </v-btn>

            <!-- Update -->
            <v-btn @click="handleUpdateForm" style="margin-right: 10px;">
              Update
            </v-btn>

            <v-spacer></v-spacer>
          </v-col>
        </v-row>

      </v-container>
    </v-form>
  </main>
</template>


<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "UpdateProject",
  data() {
    return {
      // Pre-fill with some example data
      project: {
        _id: "12345", // for demo, assume we have an ID
        projectName: "Demo Project",
        projectDescription: "This is a pre-populated description.",
        selectedTags: ["coding", "innovation"], // pre-selected
      },
      availableTags: [
        "community",
        "coding",
        "outreach",
        "education",
        "innovation",
        "campus",
        "technology",
        "empowerment",
        "collaboration",
        "digital",
        "learning",
        "network",
        "nonprofit",
        "humanity",
        "social impact",
      ],

      // "Share Project" dialog states
      shareDialog: false,
      shareOption: "code", // default selection
      shareCode: null,     // store generated code

      // For "Share via Link"
      emailInput: "",
      recipients: [],

      // For Ownership Transfer
      transferDialog: false,
      transferOption: "code", // default selection for ownership
      transferCode: null,     // generated code for transferring
      transferEmailInput: "",
      transferRecipients: [],
    };
  },
  computed: {
    // Splits the availableTags array into columns of 7 items each.
    tagColumns() {
      const cols = [];
      for (let i = 0; i < this.availableTags.length; i += 7) {
        cols.push(this.availableTags.slice(i, i + 7));
      }
      return cols;
    },
  },
  methods: {
    // Mock: Just show a toast notification for the update
    handleUpdateForm() {
      toast.info("Demo Project Updated!", {
        position: "top-right",
        toastClassName: "Toastify__toast--update",
        multiple: true,
      });
    },

    // SHARE PROJECT DIALOG
    openShareDialog() {
      this.shareDialog = true;
    },
    closeShareDialog() {
      this.shareDialog = false;
      // Optionally reset share state
      // this.shareCode = null;
      // this.shareOption = "code";
      // this.recipients = [];
      // this.emailInput = "";
    },
    generateShareCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.shareCode = code;
    },
    addEmail() {
      const email = this.emailInput.trim();
      if (email) {
        if (!email.includes("@")) {
          toast.error("Please enter a valid email address.", {
            position: "top-right",
            toastClassName: "Toastify__toast--error",
            multiple: true,
          });
          return;
        }
        this.recipients.push(email);
        this.emailInput = "";
      }
    },
    removeEmail(index) {
      this.recipients.splice(index, 1);
    },
    confirmShareLink() {
      if (!this.recipients.length) {
        toast.error("Please add at least one recipient.", {
          position: "top-right",
          toastClassName: "Toastify__toast--error",
          multiple: true,
        });
        return;
      }
      toast.success(`Sharing link with ${this.recipients.length} recipient(s)!`, {
        position: "top-right",
        toastClassName: "Toastify__toast--create",
        multiple: true,
      });
    },

    // TRANSFER OWNERSHIP DIALOG
    openTransferDialog() {
      this.transferDialog = true;
    },
    closeTransferDialog() {
      this.transferDialog = false;
      // Optionally reset transfer state
      // this.transferCode = null;
      // this.transferOption = "code";
      // this.transferRecipients = [];
      // this.transferEmailInput = "";
    },
    generateTransferCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.transferCode = code;
    },
    addTransferEmail() {
      const email = this.transferEmailInput.trim();
      if (email) {
        if (!email.includes("@")) {
          toast.error("Please enter a valid email address.", {
            position: "top-right",
            toastClassName: "Toastify__toast--error",
            multiple: true,
          });
          return;
        }
        this.transferRecipients.push(email);
        this.transferEmailInput = "";
      }
    },
    removeTransferEmail(index) {
      this.transferRecipients.splice(index, 1);
    },
    confirmTransferOwnership() {
      if (!this.transferRecipients.length) {
        toast.error("Please add at least one recipient.", {
          position: "top-right",
          toastClassName: "Toastify__toast--error",
          multiple: true,
        });
        return;
      }
      toast.success(
        `Ownership transferred to ${this.transferRecipients.length} recipient(s)!`,
        {
          position: "top-right",
          toastClassName: "Toastify__toast--create",
          multiple: true,
        }
      );
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

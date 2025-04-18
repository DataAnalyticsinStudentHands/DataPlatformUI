<!-- src/components/reusable/JoinProjectDialog.vue -->
<template>
  <v-dialog 
    v-model="localDialog" 
    max-width="420" 
    persistent
    @update:model-value="handleDialogUpdate"
  >
    <v-card>
      <!-- header -->
      <v-toolbar flat color="#c8102e" dark>
        <v-toolbar-title>{{ showProjectDetails ? $t('You are Joining...') : $t('Join a Project') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
        <p class="mt-4 text-grey-darken-1">{{ $t('Loading project details...') }}</p>
      </div>

      <!-- Project details view -->
      <div v-else-if="showProjectDetails">
        <v-card-text class="py-4 px-6">
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Name') }}</p>
          <p class="text-body-1 mb-3">{{ projectData.name }}</p>
          
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Experience') }}</p>
          <v-card variant="flat" class="bg-grey-lighten-5 pa-3 mb-3">
            <div class="text-body-1">{{ projectData.experience }}</div>
            <div class="text-caption text-grey-darken-1">{{ projectData.session }}</div>
          </v-card>
          
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ $t('Project Description') }}</p>
          <p class="text-body-1 mb-4">{{ projectData.description }}</p>
          
          <!-- Project Members -->
          <p class="text-subtitle-2 font-weight-bold mb-2">{{ $t('Project Members') }}</p>
          <v-list density="compact" class="bg-grey-lighten-5 mb-4 rounded">
            <v-list-item
              v-for="member in projectData.members"
              :key="member.id"
              :title="member.name"
              :subtitle="member.email"
              lines="two"
              class="mb-1"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-2" size="36">
                  {{ member.name.charAt(0).toUpperCase() + (member.name.indexOf(' ') > -1 ? member.name.charAt(member.name.indexOf(' ') + 1).toUpperCase() : '') }}
                </v-avatar>
              </template>
              
              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <v-chip
                    size="small"
                    :color="member.isOwner ? '#c8102e' : 'success'"
                    class="mb-1"
                  >
                    {{ member.isOwner ? 'Owner' : 'Member' }}
                  </v-chip>
                  <span class="text-caption text-grey">
                    {{ $t('Joined') }} {{ new Date(member.joinDate).toLocaleDateString() }}
                  </span>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-end pa-4">
          <v-btn variant="text" color="grey-darken-1" @click="backToCode">
            {{ $t('Back') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            variant="elevated"
            @click="confirmJoin"
            :loading="isJoining"
            :disabled="isJoining"
            >
             {{ $t('Join Project') }}
            </v-btn>
        </v-card-actions>
      </div>

      <!-- Invitation code input view -->
      <div v-else>
        <v-card-text class="py-4 px-6">
          <p class="text-subtitle-1 mb-4">
            {{ $t('Enter your invitation code to join a project') }}
          </p>
          <v-text-field
            v-model="invitationCode"
            :label="$t('Invitation Code')"
            placeholder="PRJ-XXXXXX"
            variant="outlined"
            clearable
            prepend-inner-icon="mdi-email-outline"
            density="comfortable"
            :rules="[code => !!code || $t('Code is required')]"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-end pa-4">
          <v-btn variant="text" color="grey-darken-1" @click="close">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            variant="elevated"
            @click="submit"
            :disabled="!invitationCode"
          >
            {{ $t('Join') }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  name: 'JoinProjectDialog',

  /* --- two‑way binding for v-model --- */
  props: {
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'join'],

  data() {
    return {
      invitationCode: '',
      isLoading: false,
      isJoining: false,
      showProjectDetails: false,
      projectData: {
        name: 'Student Innovation Project',
        description: 'A collaborative project focused on developing innovative solutions for campus sustainability. Team members will work together to identify environmental challenges and create technology-driven approaches to address them.',
        experience: 'Innovation Studio',
        session: 'Summer 2025',
        members: [
          {
            id: 'usr001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            isOwner: true,
            joinDate: new Date('2023-01-15')
          },
          {
            id: 'usr002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            isOwner: false,
            joinDate: new Date('2023-02-20')
          },
          {
            id: 'usr003',
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            isOwner: false,
            joinDate: new Date('2023-03-05')
          }
        ],
        isJoining: false,
      }
    };
  },

  computed: {
    localDialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  },

  methods: {
    close() {
      this.localDialog = false;
    },
    
    handleDialogUpdate(val) {
      // If dialog is closing, reset state after animation completes
      if (!val) {
        setTimeout(() => {
          this.invitationCode = '';
          this.showProjectDetails = false;
          this.isLoading = false;
        }, 300); // Wait for dialog close animation to finish
      }
    },
    
    submit() {
      if (!this.invitationCode.trim()) return;
      
      // Show loading state
      this.isLoading = true;
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        this.isLoading = false;
        this.showProjectDetails = true;
      }, 1500); // Show loading for 1.5 seconds
    },
    
    backToCode() {
      this.showProjectDetails = false;
    },
    
    confirmJoin() {
        // Show loading state
        this.isJoining = true;
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Emit the join event with the code
            this.$emit('join', this.invitationCode.trim());
            
            // Close the dialog
            this.close();
            
            // Show success toast notification
            toast.success(`Successfully joined ${this.projectData.name}!`, {
            position: "top-right",
            toastClassName: "Toastify__toast--create",
            multiple: true,
            });
            
            // Reset loading state
            this.isJoining = false;
        }, 1000); // Simulate API call delay
    },
  }
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
<template>
  <v-card :class="{ 'mb-6': !embedded, 'embedded-card': embedded }">
    <!-- Header - hidden when embedded -->
    <v-card-title v-if="!embedded" class="bg-grey-lighten-4 py-3 px-4">
      <v-icon start icon="mdi-file-document-multiple" class="mr-2"></v-icon>
      {{ $t('Project Documents') }}
      <v-spacer></v-spacer>
      <v-btn
        size="small"
        color="#c8102e"
        variant="flat"
        @click="openUploadDialog"
        prepend-icon="mdi-upload"
      >
        {{ $t('Upload') }}
      </v-btn>
    </v-card-title>
    
    <div v-if="loading" class="text-center my-6 pa-6">
      <v-progress-circular indeterminate color="#c8102e"></v-progress-circular>
      <p class="text-grey mt-3">{{ $t('Loading documents...') }}</p>
    </div>
    
    <div v-else-if="projectDocuments.length === 0" class="text-center my-6 pa-6">
      <v-icon icon="mdi-file-document-outline" size="x-large" color="grey" class="mb-2"></v-icon>
      <p class="text-grey">{{ $t('No documents have been uploaded to this project yet.') }}</p>
      <v-btn
        v-if="canUpload"
        variant="tonal"
        color="#c8102e"
        class="mt-3"
        @click="openUploadDialog"
        prepend-icon="mdi-upload"
      >
        {{ $t('Upload a document') }}
      </v-btn>
    </div>
    
    <v-list v-else lines="two">
      <v-list-item
        v-for="document in projectDocuments"
        :key="document.id"
        :title="document.name"
        :subtitle="`${$t('Uploaded')} ${formatDate(document.uploadDate)} ${$t('by')} ${document.uploadedBy}`"
        rounded
        class="mb-1 document-list-item"
        link
        @click="canEdit(document) ? openEditDialog(document) : downloadDocument(document)"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-2" class="mr-3">
            <v-icon :icon="getFileIcon(getDocumentExtension(document))" :color="getFileIconColor(getDocumentExtension(document))"></v-icon>
          </v-avatar>
        </template>
        
        <template v-slot:append>
          <div class="d-flex align-center">
            <v-chip
              size="small"
              color="grey-lighten-1"
              class="text-uppercase mr-2"
            >
              {{ getDocumentExtension(document) }}
            </v-chip>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  color="grey-darken-1"
                ></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-download"
                  title="Download"
                  @click.stop="downloadDocument(document)"
                ></v-list-item>
                <v-list-item
                  v-if="canEdit(document)"
                  prepend-icon="mdi-pencil"
                  title="Edit"
                  @click.stop="openEditDialog(document)"
                ></v-list-item>
                <v-list-item
                  v-if="canDelete(document)"
                  prepend-icon="mdi-delete"
                  title="Delete"
                  @click.stop="confirmDeleteDocument(document)"
                  class="text-error"
                ></v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-list-item>
    </v-list>
    
    <!-- File Upload Dialog -->
    <v-dialog v-model="uploadDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-grey-lighten-4 py-4">
          <v-icon start icon="mdi-upload" class="mr-2"></v-icon>
          {{ $t('Upload Document') }}
        </v-card-title>
        
        <v-card-text class="pa-4">
          <!-- Custom file upload interface -->
          <div class="file-upload-container mb-4">
            <div 
              class="file-upload-zone d-flex flex-column align-center justify-center pa-6"
              :class="{'file-selected': selectedFileName, 'file-drag-over': isDragOver}"
              @click="triggerFileInput"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onFileDrop"
            >
              <div v-if="!selectedFileName" class="text-center">
                <v-icon icon="mdi-cloud-upload-outline" size="56" color="grey-darken-1" class="mb-3"></v-icon>
                <p class="mb-1">{{ $t('Drag and drop a file here or') }}</p>
                <v-btn
                  color="#c8102e"
                  variant="tonal"
                  size="small"
                  class="mt-2"
                >
                  {{ $t('Browse Files') }}
                </v-btn>
              </div>
              
              <div v-else class="text-center w-100">
                <v-icon :icon="getFileIcon(selectedFileExt)" size="48" color="#c8102e" class="mb-3"></v-icon>
                <p class="text-truncate file-name">{{ selectedFileName }}</p>
                <div class="d-flex align-center justify-center mt-2">
                  <v-chip size="small" color="grey-lighten-1" class="text-uppercase mr-2">
                    {{ selectedFileExt }}
                  </v-chip>
                  <span v-if="selectedFileSize" class="text-caption text-grey-darken-1">
                    {{ selectedFileSize }}
                  </span>
                </div>
                <v-btn
                  color="grey"
                  variant="text"
                  size="small"
                  prepend-icon="mdi-close"
                  class="mt-3"
                  @click.stop="clearSelectedFile"
                >
                  {{ $t('Remove') }}
                </v-btn>
              </div>
            </div>
            
            <!-- Hidden file input -->
            <input 
              ref="fileInput"
              type="file"
              class="d-none"
              @change="onFileSelected"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.tsv,.jpg,.jpeg,.png"
            >
          </div>
          
          <p v-if="fileError" class="text-error text-caption mb-3">
            {{ fileError }}
          </p>
          
          <v-text-field
            v-model="documentName"
            :label="$t('Document Name (Optional)')"
            :hint="$t('Leave blank to use filename')"
            persistent-hint
            class="mt-3"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
          
          <v-textarea
            v-model="documentDescription"
            :label="$t('Description (Optional)')"
            class="mt-4"
            variant="outlined"
            density="comfortable"
            rows="3"
          ></v-textarea>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <!-- progress with status text -->
          <div v-if="uploading" class="flex-grow-1 mr-4">
            <v-progress-linear
              :model-value="uploadProgress"
              color="#c8102e"
              height="6"
              rounded
              class="mb-1"
            ></v-progress-linear>
            <p class="text-caption text-grey-darken-1 mb-0">
              {{ uploadStatusText }}
            </p>
          </div>
          <v-spacer v-else></v-spacer>
          <v-btn
            variant="text"
            @click="cancelUpload"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            variant="flat"
            @click="uploadDocument()"
            :loading="uploading"
            :disabled="!selectedFileName"
          >
            {{ $t('Upload') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Document Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-grey-lighten-4 py-4">
          <v-icon start icon="mdi-pencil" class="mr-2"></v-icon>
          {{ $t('Edit Document') }}
        </v-card-title>
        
        <v-card-text class="pa-4">
          <!-- Document info display -->
          <div class="mb-4 pa-3 bg-grey-lighten-5 rounded">
            <div class="d-flex align-center">
              <v-icon :icon="getFileIcon(getDocumentExtension(documentToEdit))" size="40" :color="getFileIconColor(getDocumentExtension(documentToEdit))" class="mr-3"></v-icon>
              <div>
                <p class="text-subtitle-2 mb-0">{{ $t('Current file') }}</p>
                <p class="text-caption text-grey-darken-1">
                  {{ documentToEdit?.name }}
                  <v-chip size="x-small" color="grey-lighten-1" class="text-uppercase ml-2">
                    {{ getDocumentExtension(documentToEdit) }}
                  </v-chip>
                </p>
              </div>
            </div>
          </div>
          
          <v-text-field
            v-model="editDocumentName"
            :label="$t('Document Name')"
            :hint="$t('File extension will be added automatically')"
            persistent-hint
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || $t('Document name is required')]"
          ></v-text-field>
          
          <v-textarea
            v-model="editDocumentDescription"
            :label="$t('Description (Optional)')"
            class="mt-4"
            variant="outlined"
            density="comfortable"
            rows="3"
          ></v-textarea>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <!-- Add Download button on the left -->
          <v-btn
            color="grey-darken-1"
            variant="text"
            prepend-icon="mdi-download"
            @click="downloadDocument(documentToEdit)"
          >
            {{ $t('Download') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="editDialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            variant="flat"
            @click="updateDocument"
            :loading="updating"
            :disabled="!editDocumentName"
          >
            {{ $t('Save Changes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-error-lighten-5 py-4">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          {{ $t('Delete Document?') }}
        </v-card-title>
        <v-card-text class="pt-4">
          <p>{{ $t('Are you sure you want to delete this document?') }}</p>
          <p class="font-weight-bold">{{ documentToDelete?.name }}</p>
          <p>{{ $t('This action cannot be undone.') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteDocument"
            :loading="deleting"
          >
            {{ $t('Delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import { toast } from 'vue3-toastify';
import axios from 'axios';
import { useLoggedInUserStore } from '@/stored/loggedInUser';
import {
  UPLOAD_CONSTRAINTS,
  validateImageSignature,
  parseUploadError,
} from '@/utils/fileValidation';
const API = import.meta.env.VITE_ROOT_API;

export default {
  name: 'ProjectDocuments',
  props: {
    projectId: {
      type: String,
      required: true
    },
    isProjectOwner: {
      type: Boolean,
      default: false
    },
    embedded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectDocuments: [],
      uploadDialog: false,
      deleteDialog: false,
      fileError: '',
      uploading: false,
      uploadProgress: 0,
      uploadStatusText: '',
      deleting: false,
      loading: true,
      documentToDelete: null,
      documentName: '',
      documentDescription: '',
      selectedFile: null,
      selectedFileName: '',
      selectedFileExt: '',
      selectedFileSize: '',
      isDragOver: false,
      canUpload: false,
      currentUser: null,
      editDialog: false,
      documentToEdit: null,
      editDocumentName: '',
      editDocumentDescription: '',
      updating: false,
    };
  },
  created() {
    // pull state directly from the logged-in-user store
    const userStore = useLoggedInUserStore();
    this.currentUser = userStore;    
    
    // Decode JWT to get permissions (one time only)
    if (userStore.token) {
      try {
        const payload = JSON.parse(atob(userStore.token.split('.')[1]));
        this.currentUser = { ...userStore, permissions: payload.permissions };
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
    
    // Determine if user can upload based on permissions
    this.canUpload = this.isProjectOwner || 
                    (this.currentUser?.permissions?.projects &&
                    ['own', 'member', 'all']
                    .includes(this.currentUser.permissions.projects.uploadDocs));
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
    getDocumentExtension(document) {
      if (document?.extension) return document.extension;
      if (document?.name) {
        const parts = document.name.split('.');
        if (parts.length > 1) return parts.pop();
      }
      return '';
    },
    getFileIcon(extension) {
      switch(extension?.toLowerCase()) {
        case 'pdf':
          return 'mdi-file-pdf-box';
        case 'doc':
        case 'docx':
          return 'mdi-file-word-box';
        case 'xls':
        case 'xlsx':
          return 'mdi-file-excel-box';
        case 'ppt':
        case 'pptx':
          return 'mdi-file-powerpoint-box';
        case 'txt':
        case 'csv':
        case 'tsv':
          return 'mdi-file-document';
        case 'jpg':
        case 'jpeg':
        case 'png':
          return 'mdi-file-image';
        default:
          return 'mdi-file-document';
      }
    },
    getFileIconColor(extension) {
      switch(extension?.toLowerCase()) {
        case 'pdf':
          return 'red-darken-1';
        case 'doc':
        case 'docx':
          return 'blue-darken-2';
        case 'xls':
        case 'xlsx':
          return 'green-darken-2';
        case 'ppt':
        case 'pptx':
          return 'deep-orange-darken-1';
        case 'jpg':
        case 'jpeg':
        case 'png':
          return 'purple-darken-1';
        default:
          return 'grey-darken-2';
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    openUploadDialog() {
      this.uploadDialog = true;
      this.selectedFile = null;
      this.selectedFileName = '';
      this.selectedFileExt = '';
      this.selectedFileSize = '';
      this.documentName = '';
      this.documentDescription = '';
      this.fileError = '';
      this.uploadStatusText = '';
    },
    
    cancelUpload() {
      this.uploadDialog = false;
      this.uploadProgress = 0;
      this.uploadStatusText = '';
    },
    
    async fetchDocuments() {
      this.loading = true;
      try {
        const response = await axios.get(`${API}/clowder/projects/${this.projectId}/documents`);
        
        if (response.data.success) {
          this.projectDocuments = response.data.documents;
          console.log('[ProjectDocuments] Raw documents from API:', JSON.stringify(response.data.documents, null, 2));
          this.projectDocuments.forEach((doc, i) => {
            console.log(`[ProjectDocuments] doc[${i}]:`, {
              name: doc.name,
              extension: doc.extension,
              resolvedExt: this.getDocumentExtension(doc),
              icon: this.getFileIcon(this.getDocumentExtension(doc)),
              allKeys: Object.keys(doc)
            });
          });
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error(this.$t('Failed to load documents'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
      } finally {
        this.loading = false;
      }
    },
    
    triggerFileInput() {
      // Programmatically click the hidden file input
      this.$refs.fileInput.click();
    },
    
    onFileSelected(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.processSelectedFile(files[0]);
      }
    },
    
    onDragOver(event) {
      this.isDragOver = true;
    },
    
    onDragLeave(event) {
      this.isDragOver = false;
    },
    
    onFileDrop(event) {
      this.isDragOver = false;
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        this.processSelectedFile(files[0]);
      }
    },
    
    async processSelectedFile(file) {
      const { extensions, maxSizeMb } = UPLOAD_CONSTRAINTS.clowder;

      const fileExt = '.' + file.name.split('.').pop().toLowerCase();

      if (!extensions.includes(fileExt)) {
        this.fileError = this.$t('File type not allowed. Allowed types: Word, Excel, PowerPoint, PDF, Images (JPG, PNG), and Text files (TXT, CSV, TSV)');
        return;
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        this.fileError = this.$t(`File size cannot exceed ${maxSizeMb}MB`);
        return;
      }

      // Magic-number validation for image files
      const imageExts = ['.jpg', '.jpeg', '.png'];
      if (imageExts.includes(fileExt)) {
        const detected = await validateImageSignature(file);
        if (detected === null) {
          this.fileError = this.$t('File content does not match the expected image type. The file may be corrupted or renamed.');
          return;
        }
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.selectedFileExt = file.name.split('.').pop();
      this.selectedFileSize = this.formatFileSize(file.size);
      this.fileError = '';

      // Set document name from filename (without extension)
      if (!this.documentName) {
        this.documentName = file.name.split('.').slice(0, -1).join('.');
      }
    },
    
    clearSelectedFile(event) {
      event.stopPropagation();
      this.selectedFile = null;
      this.selectedFileName = '';
      this.selectedFileExt = '';
      this.selectedFileSize = '';
      this.fileError = '';
      // Reset the file input value
      this.$refs.fileInput.value = '';
    },

    async downloadDocument(doc) {
      try {
        const response = await axios.get(
          `${API}/clowder/projects/${this.projectId}/documents/${doc.id}/download`,
          {
            responseType: 'blob'
          }
        );
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        a.click();
        window.URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error('Error downloading document:', error);
        toast.error(this.$t('Failed to download document'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
      }
    },
    
    canDelete(document) {
      if (this.isProjectOwner) return true;
      
      
      // Check if user has permission to delete based on ownership
      const isDocumentOwner = document.uploaderId === this.currentUser?.userId;
      
      if (this.currentUser?.permissions?.projects?.deleteDocs === 'own') {
        return isDocumentOwner;
      }
      
      const hasGroupOrAll = ['group', 'all'].includes(
        this.currentUser?.permissions?.projects?.deleteDocs || ''
      );
      
      return hasGroupOrAll;
    },
        
    confirmDeleteDocument(document) {
      this.documentToDelete = document;
      this.deleteDialog = true;
    },
    
    async deleteDocument() {
      if (!this.documentToDelete) return;
      
      this.deleting = true;
      
      try {
        const response = await axios.delete(
          `${API}/clowder/projects/${this.projectId}/documents/${this.documentToDelete.id}`
        );
        
        if (response.data.success) {
          // Remove the document from the list
          this.projectDocuments = this.projectDocuments.filter(
            doc => doc.id !== this.documentToDelete.id
          );
          
          toast.success(this.$t('Document deleted successfully'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create',
            multiple: true
          });
        } else {
          toast.error(response.data.message || this.$t('Failed to delete document'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error(this.$t('Failed to delete document'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
      } finally {
        this.deleting = false;
        this.deleteDialog = false;
      }
    },
            
    async uploadDocument() {
      if (!this.selectedFile) {
        this.fileError = this.$t('Please select a file');
        return;
      }
      
      this.uploading = true;
      this.uploadProgress = 0;
      this.uploadStatusText = '';
      
      try {
        // Create form data
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        
        if (this.documentName) {
          formData.append('documentName', this.documentName);
        }
        
        if (this.documentDescription) {
          formData.append('description', this.documentDescription);
        }
        
        // Upload configuration with progress tracking for ALL files
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            this.uploadProgress = percentCompleted;
            
            // Convert to MB for display
            const mbLoaded = (progressEvent.loaded / (1024 * 1024)).toFixed(1);
            const mbTotal = (progressEvent.total / (1024 * 1024)).toFixed(1);
            
            // Update status text based on progress
            if (percentCompleted < 100) {
              // Still uploading to server
              this.uploadStatusText = `${this.$t('Uploading')} ${mbLoaded}MB / ${mbTotal}MB`;
            } else {
              // Upload complete, now processing on server
              this.uploadStatusText = this.$t('Processing...');
            }
          }
        };
        
        // Upload the file
        const response = await axios.post(
          `${API}/clowder/projects/${this.projectId}/upload`,
          formData,
          config
        );
        
        if (response.data.success) {
          // Add the new document to the list
          this.projectDocuments.unshift(response.data.document);
          
          toast.success(this.$t('Document uploaded successfully'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create',
            multiple: true
          });
          
          this.uploadDialog = false;
        } else {
          this.fileError = response.data.message || this.$t('Failed to upload document');
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        this.fileError = parseUploadError(error, this.$t('Failed to upload document'));
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
        this.uploadStatusText = '';
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    },

    canEdit(document) {
      // Same logic as canDelete - owner or uploader can edit
      if (this.isProjectOwner) return true;
      
      const isDocumentOwner = document.uploaderId === this.currentUser?.userId;
      
      if (this.currentUser?.permissions?.projects?.update === 'own') {
        return isDocumentOwner;
      }
      
      const hasGroupOrAll = ['group', 'all'].includes(
        this.currentUser?.permissions?.projects?.update || ''
      );
      
      return hasGroupOrAll || isDocumentOwner;
    },

    openEditDialog(document) {
      this.documentToEdit = document;
      // Pre-populate with current values, removing the extension from the name
      const nameWithoutExt = document.name.substring(0, document.name.lastIndexOf('.')) || document.name;
      this.editDocumentName = nameWithoutExt;
      this.editDocumentDescription = document.description || '';
      this.editDialog = true;
    },
    
    async updateDocument() {
      if (!this.editDocumentName) {
        toast.error(this.$t('Document name is required'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
        return;
      }
      
      this.updating = true;
      
      try {
        const response = await axios.put(
          `${API}/clowder/projects/${this.projectId}/documents/${this.documentToEdit.id}`,
          {
            name: this.editDocumentName,
            description: this.editDocumentDescription
          }
        );
        
        if (response.data.success) {
          // Update the document in the list
          const index = this.projectDocuments.findIndex(doc => doc.id === this.documentToEdit.id);
          if (index !== -1) {
            this.projectDocuments[index] = response.data.document;
          }
          
          toast.success(this.$t('Document updated successfully'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create',
            multiple: true
          });
          
          this.editDialog = false;
        } else {
          toast.error(response.data.message || this.$t('Failed to update document'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        }
      } catch (error) {
        console.error('Error updating document:', error);
        toast.error(error.response?.data?.message || this.$t('Failed to update document'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
      } finally {
        this.updating = false;
      }
    },
  }
};
</script>

<style scoped>
/* Custom styling for file extension chips */
.text-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Hover effect for document list items */
.document-list-item {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.document-list-item:hover {
  background-color: rgba(200, 16, 46, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

/* Subtle indication that the entire row is clickable */
.document-list-item:hover::before {
  opacity: 0.08;
  background-color: var(--v-theme-primary, #c8102e);
}

/* Custom file upload styling */
.file-upload-container {
  width: 100%;
}

.file-upload-zone {
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 200px;
}

.file-upload-zone:hover {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.02);
}

.file-drag-over {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.05);
  transform: scale(1.01);
}

.file-selected {
  border-style: solid;
  border-color: rgba(200, 16, 46, 0.3);
  background-color: rgba(200, 16, 46, 0.03);
}

.file-name {
  max-width: 90%;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

/* Embedded mode styling */
.embedded-card {
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
}
</style>
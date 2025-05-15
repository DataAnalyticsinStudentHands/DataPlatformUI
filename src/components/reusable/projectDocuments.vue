<template>
  <v-card class="mb-6">
    <v-card-title class="bg-grey-lighten-4 py-3 px-4">
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
        @click="viewDocument(document)"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-2" class="mr-3">
            <v-icon :icon="getFileIcon(document.extension)" color="grey-darken-2"></v-icon>
          </v-avatar>
        </template>
        
        <template v-slot:append>
          <div class="d-flex align-center">
            <v-chip
              size="small"
              color="grey-lighten-1"
              class="text-uppercase mr-2"
            >
              {{ document.extension }}
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
                  v-if="canDelete(document)"
                  prepend-icon="mdi-delete"
                  title="Delete"
                  @click.stop="confirmDeleteDocument(document)"
                  class="text-error"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-history"
                  title="Version history"
                  @click.stop="viewVersionHistory(document.id)"
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
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.zip"
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
          <!-- progress (stretches to fill the row) -->
          <v-progress-linear
            v-if="uploading && uploadProgress > 0"
            :model-value="uploadProgress"
            color="#c8102e"
            height="6"
            class="flex-grow-1 mr-4"
            rounded
          ></v-progress-linear>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="uploadDialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            variant="flat"
            @click="uploadDocumentWithRetry()"  
            :loading="uploading"
            :disabled="!selectedFileName"
          >
            {{ $t('Upload') }}
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

    <v-dialog v-model="versionHistoryDialog" max-width="600px">
      <v-card>
        <v-card-title class="bg-grey-lighten-4 py-4">
          <v-icon start icon="mdi-history" class="mr-2" />{{ $t('Version History') }}
        </v-card-title>

        <v-card-text>
          <v-list lines="two" density="compact">
            <v-list-item
              v-for="v in versionHistory"
              :key="v.id"
              :title="`v${v.versionLabel}`"
              :subtitle="formatDate(v.createdDateTime)"
              rounded
            >
              <template #append>
                <v-btn
                  icon="mdi-download"
                  variant="text"
                  size="small"
                  @click.stop="downloadVersion(v)"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="versionHistoryDialog = false">
            {{ $t('Close') }}
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
      versionHistoryDialog: false,
      versionHistory: [],
    };
  },
  created() {
    // pull state directly from the logged-in-user store
    const userStore = useLoggedInUserStore();
    this.currentUser = userStore;    
    
    // Determine if user can upload based on permissions
    this.canUpload = this.isProjectOwner || 
                    (userStore?.permissions?.projects &&
                    ['own', 'member', 'all']
                    .includes(userStore.permissions.projects.uploadDocs));
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
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
        case 'zip':
        case 'rar':
          return 'mdi-zip-box';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'mdi-file-image-box';
        default:
          return 'mdi-file-document-outline';
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
    },
    
    async fetchDocuments() {
      this.loading = true;
      try {
        const response = await axios.get(`${API}/clowder/projects/${this.projectId}/documents`);
        
        if (response.data.success) {
          this.projectDocuments = response.data.documents;
        } else {
          console.error('Error fetching documents:', response.data);
          toast.error(this.$t('Failed to load documents'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
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
    
    processSelectedFile(file) {
      // Check allowed file types
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', 
        '.ppt', '.pptx', '.txt', '.csv', '.jpg', 
        '.jpeg', '.png', '.gif', '.zip'];
        
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExt)) {
        this.fileError = this.$t('File type not allowed');
        return;
      }
      
      // Check file size - backend allows up to 100MB
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        this.fileError = this.$t('File size cannot exceed 100MB');
        return;
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
    
    viewDocument(document) {
      // Use anonymous link if available, otherwise fallback to original behavior
      if (document.anonymousLink) {
        window.open(document.anonymousLink, '_blank');
      } else if (document.sharePointUrl) {
        window.open(document.sharePointUrl, '_blank');
      } else {
        this.downloadDocument(document);
      }
    },
    
    async downloadDocument(document) {
      try {
        const response = await axios.get(`${API}/clowder/projects/${this.projectId}/documents/${document.id}/download`);
        
        if (response.data.success && response.data.downloadUrl) {
          // Open the download URL in a new tab
          window.open(response.data.downloadUrl, '_blank');
        } else {
          toast.error(this.$t('Failed to download document'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        }
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
      const isDocumentOwner = document.uploaderId === this.currentUser?.id;
      
      if (this.currentUser?.permissions?.projects?.deleteDocs === 'own') {
        return isDocumentOwner;
      }
      
      return ['group', 'all'].includes(
        this.currentUser?.permissions?.projects?.deleteDocs || ''
      );
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
        
        // Upload the file with progress tracking
        const response = await axios.post(
          `${API}/clowder/projects/${this.projectId}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              this.uploadProgress = percentCompleted;
            }
          }
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
        this.fileError = error.response?.data?.message || this.$t('Failed to upload document');
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    },

    async viewVersionHistory(documentId) {
      try {
        const response = await axios.get(`${API}/clowder/projects/${this.projectId}/documents/${documentId}/versions`);
        
        if (response.data.success) {
          this.versionHistory = response.data.versions;
          this.versionHistoryDialog = true;
        } else {
          toast.error(this.$t('Failed to fetch version history'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            multiple: true
          });
        }
      } catch (error) {
        console.error('Error fetching version history:', error);
        toast.error(this.$t('Failed to fetch version history'), {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
      }
    },

    async uploadDocumentWithRetry(maxRetries = 3) {
      let retries = 0;
      
      while (retries < maxRetries) {
        try {
          await this.uploadDocument();
          return; // Success, exit the function
        } catch (error) {
          retries++;
          
          if (retries >= maxRetries) {
            // If we've exhausted all retries, show error
            this.fileError = this.$t('Failed to upload after multiple attempts');
            this.uploading = false;
            return;
          }
          
          // Wait before retrying (exponential backoff)
          const waitTime = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          
          // Inform the user we're retrying
          toast.info(this.$t('Retrying upload...'), {
            position: 'top-right',
            multiple: true
          });
        }
      }
    },

    async downloadVersion(version) {
      try {
        const { data } = await axios.get(
          `${API}/clowder/projects/${this.projectId}/documents/${version.documentId}/versions/${version.id}/download`
        );
        if (data?.downloadUrl) window.open(data.downloadUrl, '_blank');
      } catch (err) {
        toast.error(this.$t('Failed to download version'), { 
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          multiple: true
        });
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
</style>
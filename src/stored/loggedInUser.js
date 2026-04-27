/**
 * src/stored/loggedInUser.js
 * 
 * Pinia store managing authenticated user state and session management. Handles user login/logout,
 * JWT token verification, role-based access control, form completion tracking for students, and
 * automatic session expiration. Persists user data across page refreshes using localStorage while
 * maintaining security through token validation.
 */

import { defineStore } from 'pinia'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { i18n } from '@/plugins/i18n';
export const useLoggedInUserStore = defineStore({
  id: 'loggedInUser',
  state: () => {
    return {
      userId: "",
      role: "",
      firstName: "",
      lastName: "",
      isLoggedIn: false,
      unverified: null,
      languagePreference: "",
      hasCompletedEntryForm: false,
      hasRegisteredExperiences: false,
      goalSettingFormCompletion: {},
      loading: false,
      semesterName: "",
      hasGoalFormsToComplete: false,
      hasExitFormsToComplete: false,
      exitFormCompletion: {},
      registeredExperiences: [],
      orgName: "",
      experienceInstanceCreationDetails: [],
      instructorDataManagementActiveTab: 0,
      group: null,
      navigationData: null,
      logoutTimer: null,
      tokenExp: null,
      // New invitation tracking
      projectInvitationCount: 0,
      lastInvitationCheck: null,
    }
  },
  getters: {
    // Get the current user's role
    getRole() {
      return this.role
    },
    // Check if user has pending project invitations
    hasPendingInvitations() {
      return this.projectInvitationCount > 0
    }
  },
  actions: {
    // Authenticate user with email and password
    async login(email, password) {
      try {
        const response = await axios.post(`${apiURL}/userdata/login`, { email, password });
        if (response) {
          const data = response.data;

          // Update store with user information from response
          this.$patch({
            role: data.userRole,
            userId: data.userID,
            languagePreference: data.languagePreference,
            group: data.group || null,
            tokenExp: data.expiresAt,
          });

          // Handle pending user verification
          if (data.userStatus === 'Pending') {
            this.$patch({
              isLoggedIn: false,
              unverified: true,
            });
            return;
          }

          await this.getFullName();

          // Load student-specific data
          if (data.userRole === 'Student') {
            await this.checkFormCompletion();
            await this.fetchRegisteredExperiences();
            await this.fetchProjectInvitationCount();
          }

          // Complete login for non-temporary users
          if (data.userRole !== 'Temporary') {
            this.$patch({
              isLoggedIn: true,
            });
          }

          this.setAutoLogout(data.expiresAt);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return {
            toast: true,
            message: 'Invalid email or password.',
            type: 'error',
          };
        } else {
          this.handleError(error);
        }
      }
    },
    // Clear user session and redirect to login
    async logout(reset = false) {
      // Clear server-side cookie
      try {
        await axios.post(`${apiURL}/userData/logout`);
      } catch (e) {
        // Best-effort; continue with local cleanup
      }

      // Preserve organization name across logout
      const orgName = this.orgName;

      // Clear session timer
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
        this.logoutTimer = null;
      }

      // Reset store state
      this.$reset();

      // Restore organization name
      this.orgName = orgName;

      // Clean up persisted state
      localStorage.removeItem('pinia-loggedInUser');

      this.$router.push('/login');
    },    

    // Initialize store from saved session on app load
    async initializeStore() {
      try {
        // Validate session by calling the server (cookie sent automatically)
        const res = await axios.get(`${apiURL}/userdata/user`, { _skipRefreshCheck: true });

        // Cookie is valid — restore session from response
        this.$patch({
          userId: res.data.user.userID,
          role: res.data.user.userRole || this.role,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
        });

        // Complete login for non-temporary users
        if (this.role !== 'Temporary') {
          this.isLoggedIn = true;
        }

        // Restore auto-logout timer from persisted tokenExp
        if (this.tokenExp && this.tokenExp > Math.floor(Date.now() / 1000)) {
          this.setAutoLogout(this.tokenExp);
        }

        // Fetch invitation count for students
        if (this.role === 'Student') {
          await this.fetchProjectInvitationCount();
        }

      } catch (error) {
        // 401 or network error — not authenticated
        this.$reset();
        localStorage.removeItem('pinia-loggedInUser');
      }
    },    
    
    // Schedule automatic logout when token expires
    setAutoLogout(expirationTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiration = (expirationTime - currentTime) * 1000;

      if (timeUntilExpiration > 0) {
        // Cancel existing timer
        if (this.logoutTimer) {
          clearTimeout(this.logoutTimer);
        }

        // Schedule logout at token expiration
        this.logoutTimer = setTimeout(() => {
          this.logout();
          this.$router.push('/login');
          toast.info('Session expired. Please log in again.', {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            limit: 1,
          });
        }, timeUntilExpiration);
      } else {
        // Token already expired
        this.logout();
        this.$router.push('/login');
      }
    },

    // Fetch user's full name from API
    async getFullName() {
      let url = import.meta.env.VITE_ROOT_API + `/userdata/user`;

      try {
        let fullName = await axios.get(url);
        if (fullName) {
          this.$patch({
            firstName: fullName.data.user.firstName,
            lastName: fullName.data.user.lastName
          })
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    // Complete account verification process
    async verifyExistingAcc(responseData) {
      const { userID, userRole, languagePreference, expiresAt } = responseData;

      // Update store with verified user data
      this.$patch({
        role: userRole,
        userId: userID,
        languagePreference: languagePreference,
        tokenExp: expiresAt,
      });

      // Complete login for non-temporary users
      if (userRole !== 'Temporary') {
        this.$patch({
          isLoggedIn: true,
        });
      }

      if (expiresAt) {
        this.setAutoLogout(expiresAt);
      }

      // Fetch invitation count for students
      if (userRole === 'Student') {
        await this.fetchProjectInvitationCount();
      }
    },
    // Update user's language preference
    setLanguagePreference(langPref) {
      this.languagePreference = langPref;
    },
    // Check student's form completion status
    async checkFormCompletion() {
      try {
        const response = await axios.get(`${apiURL}/studentSideData/student-checklist`);
    
        if (response && response.data) {
          // Update all form completion states
          this.hasCompletedEntryForm = response.data.entryFormCompleted;
          this.hasRegisteredExperiences = response.data.hasRegisteredExperiences;
          this.goalSettingFormCompletion = { ...response.data.goalSettingFormCompletion };
          this.exitFormCompletion = { ...response.data.exitFormCompletion };
    
          // Determine if forms need completion
          const exitIds = Object.keys(this.exitFormCompletion);
          this.hasGoalFormsToComplete = Object.keys(this.goalSettingFormCompletion).some(key => !exitIds.includes(key));
          this.hasExitFormsToComplete = exitIds.length > 0;
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    // Fetch project invitation count
    async fetchProjectInvitationCount() {
      try {
        const response = await axios.get(`${apiURL}/studentSideData/user/notification-count`);
        
        if (response && response.data) {
          this.projectInvitationCount = response.data.counts.projectInvitations || 0;
          this.lastInvitationCheck = new Date();
        }
      } catch (error) {
        console.error('Error fetching invitation count:', error);
        // Don't show error toast for this background operation
        this.projectInvitationCount = 0;
      }
    },
    // Decrement invitation count when invitation is responded to
    decrementInvitationCount() {
      if (this.projectInvitationCount > 0) {
        this.projectInvitationCount--;
      }
      
      // If no more invitations, clear the last check timestamp
      if (this.projectInvitationCount === 0) {
        this.lastInvitationCheck = null;
      }
    },
    // Set loading state to true
    startLoading() {
      this.loading = true;
    },
    // Set loading state to false
    stopLoading() {
      this.loading = false;
    },
    // Fetch student's registered experiences
    async fetchRegisteredExperiences() {
      const url = `${apiURL}/studentSideData/registered-experiences`;

      try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
          this.registeredExperiences = response.data;
          this.hasRegisteredExperiences = true;
        } else {
          this.hasRegisteredExperiences = false;
          this.registeredExperiences = [];
        }
      } catch (error) {
        this.handleError(error);
      }
    },     
    // Update student's experience registrations
    async updateRegisteredExperiences(selectedExperiences) {
      const registerUrl = `${apiURL}/studentSideData/experience-instances/register`;
      const deregisterUrl = `${apiURL}/studentSideData/registered-experiences`;

      try {
        // Calculate registration changes
        const experiencesToRegister = selectedExperiences.filter(se => 
          !this.registeredExperiences.some(re => re.experienceInstance.id === se._id));
        const experiencesToDeregister = this.registeredExperiences.filter(re => 
          !selectedExperiences.some(se => se._id === re.experienceInstance.id));
        const originalRegisteredExperiences = JSON.parse(JSON.stringify(this.registeredExperiences));

        let hasErrors = false;

        // Process new registrations
        if (experiencesToRegister.length > 0) {
          await axios.post(registerUrl, {
            expInstanceIDs: experiencesToRegister.map(e => e._id)
          });
        }

        // Process deregistrations with constraint handling
        if (experiencesToDeregister.length > 0) {
          try {
            const response = await axios.delete(deregisterUrl, {
              data: { expRegistrationIDs: experiencesToDeregister.map(e => e._id) }
            });

            if (response.status === 207) {
              hasErrors = true;
              const { cannotDeleteRegistrations, projectConstraints } = response.data;
              
              // Notify about project dependencies
              if (projectConstraints && projectConstraints.length > 0) {
                for (const constraint of projectConstraints) {
                  const experience = originalRegisteredExperiences.find(re => re._id === constraint.registrationId);
                  
                  let experienceName = 'this experience';
                  if (experience && experience.experienceInstance && experience.experienceInstance.name) {
                    experienceName = experience.experienceInstance.name;
                  }
                  
                  toast.error(`Cannot deregister from "${experienceName}": You must leave all associated projects first.`, {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    multiple: true
                  });
                }
              }
              
              // Notify about form completion constraints
              const remainingIds = cannotDeleteRegistrations.filter(id => 
                !projectConstraints || !projectConstraints.some(pc => pc.registrationId === id)
              );
              
              if (remainingIds.length > 0) {
                for (const id of remainingIds) {
                  const experience = originalRegisteredExperiences.find(re => re._id === id);
                  
                  let name = 'this experience';
                  if (experience && experience.experienceInstance && experience.experienceInstance.name) {
                    name = experience.experienceInstance.name;
                  }
                  
                  toast.info(`Cannot deregister: "${name}" (you have completed forms for this experience)`, {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--update',
                    multiple: true
                  });
                }
              }
            }
          } catch (deregisterError) {
            hasErrors = true;
            console.error("Error during deregistration:", deregisterError);
            
            if (deregisterError.response && deregisterError.response.data && deregisterError.response.data.message) {
              toast.error(deregisterError.response.data.message, {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: true
              });
            } else {
              toast.error("Could not complete all deregistrations. Some experiences have dependencies.", {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                multiple: true
              });
            }
          }
        }

        // Refresh data and show success if applicable
        await this.fetchRegisteredExperiences();
        
        if (!hasErrors && (experiencesToRegister.length > 0 || experiencesToDeregister.length > 0)) {
          toast.success(i18n.global.t('Experiences Updated') + '!', {
            position: 'top-right',
            toastClassName: 'Toastify__toast--create',
            multiple: true
          });
        }

        await this.checkFormCompletion();

      } catch (error) {
        this.handleError(error);
      }
    },

    // Register a single experience for the student
    async registerSingleExperience(experienceInstanceId) {
      const registerUrl = `${apiURL}/studentSideData/experience-instances/register`;

      try {
        await axios.post(registerUrl, {
          expInstanceIDs: [experienceInstanceId]
        });

        await this.fetchRegisteredExperiences();
        await this.checkFormCompletion();

        return true;
      } catch (error) {
        this.handleError(error);
        return false;
      }
    },

    // Display generic error message to user
    async handleError(error) {
      toast.error("An unexpected error has occurred and has been logged for future improvement. Please try again later.", {
          position: 'top-right',
          toastClassName: 'Toastify__toast--delete',
          limit: 1,
      });
    },
    // Update organization name
    setOrgName(name) {
      this.orgName = name;
    },
    // Update experience instance creation details
    updateexperienceInstanceCreationDetails(sessions) {
      this.experienceInstanceCreationDetails = sessions;
    },
    // Clear all pending invitations (more semantic than setting count to 0)
    clearAllInvitations() {
      this.projectInvitationCount = 0;
    },
    
    // Set invitation count to a specific value
    setInvitationCount(count) {
      this.projectInvitationCount = Math.max(0, count); // Ensure non-negative
    },
  },
  persist: {
    enabled: true,
    storage: window.localStorage,
    // Specify state properties to persist across sessions
    paths: [
      'userId',
      'role',
      'firstName',
      'lastName',
      'isLoggedIn',
      'unverified',
      'languagePreference',
      'hasCompletedEntryForm',
      'hasRegisteredExperiences',
      'goalSettingFormCompletion',
      'loading',
      'semesterName',
      'hasGoalFormsToComplete',
      'hasExitFormsToComplete',
      'exitFormCompletion',
      'registeredExperiences',
      'orgName',
      'experienceInstanceCreationDetails',
      'instructorDataManagementActiveTab',
      'group',
      'projectInvitationCount',
      'lastInvitationCheck'
    ],
  },
});
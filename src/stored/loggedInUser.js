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
import { verifyJWT } from '@/auth/jwtVerifier';

export const useLoggedInUserStore = defineStore({
  id: 'loggedInUser',
  state: () => {
    return {
      userId: "",
      role: "",
      token: "",
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
          const token = response.data.token;

          // Verify token validity on frontend
          const payload = await verifyJWT(token);
          if (!payload) {
            this.handleError(new Error('Invalid token received from backend.'));
            return;
          }

          // Update store with user information from JWT payload
          this.$patch({
            role: payload.userRole,
            userId: payload.userID,
            token: token,
            languagePreference: payload.languagePreference || response.data.languagePreference,
            group: payload.group || response.data.group || null,
          });

          // Persist token and set axios headers
          localStorage.setItem('token', token);
          this.token = token;
          this.setTokenHeader(token);

          // Handle pending user verification
          if (payload.userStatus === 'Pending') {
            this.$patch({
              isLoggedIn: false,
              unverified: true,
              token: token,
            });
            return;
          }

          await this.getFullName();

          // Load student-specific data
          if (payload.userRole === 'Student') {
            await this.checkFormCompletion();
            await this.fetchRegisteredExperiences();
            await this.fetchProjectInvitationCount(); // Fetch invitation count on login
          }

          // Complete login for non-temporary users
          if (payload.userRole !== 'Temporary') {
            this.$patch({
              isLoggedIn: true,
            });
          }

          this.setAutoLogout(payload.exp);
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
    logout(reset = false) {
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
    
      // Clean up authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('pinia-loggedInUser');
      this.removeTokenHeader();
    
      this.$router.push('/login');
    },    

    // Initialize store from saved session on app load
    async initializeStore() {
      const token = localStorage.getItem('token');

      if (!token) {
        // Clear any remaining session data
        this.$reset();
      
        localStorage.removeItem('token');
        localStorage.removeItem('pinia-loggedInUser');
        this.removeTokenHeader();
        return;
      }
      
      try {
        // Validate existing token
        const payload = await verifyJWT(token);
    
        if (!payload) {
          // Invalid token requires re-authentication
          this.logout();
          this.$router.push('/login');
          return;
        }
    
        // Check token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          this.logout();
          this.$router.push('/login');
          return;
        }
    
        // Restore user session from token
        this.$patch({
          userId: payload.userID,
          role: payload.userRole,
          token: token
        });
    
        // Complete login for non-temporary users
        if (payload.userRole !== 'Temporary') {
          this.$patch({ isLoggedIn: true });
        }
    
        this.setTokenHeader(token);
        this.setAutoLogout(payload.exp);
        
        // Fetch invitation count for students
        if (payload.userRole === 'Student') {
          await this.fetchProjectInvitationCount();
        }
    
      } catch (error) {
        console.error('Token verification failed:', error);
        this.logout();
        this.$router.push('/login');
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
      let token = localStorage.getItem("token");
      let url = import.meta.env.VITE_ROOT_API + `/userdata/user`;

      try {
        let fullName = await axios.get(url, { headers: { token } });
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
      const { token, userID, userRole, languagePreference } = responseData;

      // Update store with verified user data
      this.$patch({
        role: userRole,
        userId: userID,
        token: token,
        languagePreference: languagePreference
      });

      localStorage.setItem("token", token);
      this.setTokenHeader(token);

      // Complete login for non-temporary users
      if (userRole !== 'Temporary') {
        this.$patch({
          isLoggedIn: true,
        });
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
        const response = await axios.get(`${apiURL}/studentSideData/student-checklist`, {
          headers: { token: this.token }
        });
    
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
        const response = await axios.get(`${apiURL}/studentSideData/user/notification-count`, {
          headers: { token: this.token }
        });
        
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
    // Set authorization header for all axios requests
    setTokenHeader(token) {
      if (token) {
        axios.defaults.headers['token'] = token;
        this.token = token;
      }
    },
    // Remove authorization header from axios
    removeTokenHeader() {
      delete axios.defaults.headers['token'];
      this.token = "";
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
      const token = localStorage.getItem("token");
      const url = `${apiURL}/studentSideData/registered-experiences`;
    
      try {
        const response = await axios.get(url, { headers: { token } });
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
      const token = this.token;
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
          }, { headers: { token } });
        }

        // Process deregistrations with constraint handling
        if (experiencesToDeregister.length > 0) {
          try {
            const response = await axios.delete(deregisterUrl, {
              headers: { token },
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
      const token = this.token;
      const registerUrl = `${apiURL}/studentSideData/experience-instances/register`;

      try {
        await axios.post(registerUrl, {
          expInstanceIDs: [experienceInstanceId]
        }, { headers: { token } });

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
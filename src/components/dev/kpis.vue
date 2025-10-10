<template>
  <div class="kpi-dashboard">
    <div class="dashboard-header">
      <h1>Experience Analytics Dashboard</h1>
      <p class="subtitle">Comprehensive KPI Report</p>
    </div>

    <!-- Overview Section -->
    <div class="section">
      <h2>Overview</h2>
      <div class="kpi-grid">
        <div class="kpi-card highlight">
          <div class="kpi-value">{{ data.participants }}</div>
          <div class="kpi-label">Total Participants</div>
          <div class="kpi-sublabel">Lifetime</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{ data.participantsThisYear }}</div>
          <div class="kpi-label">Participants 2025</div>
          <div class="kpi-sublabel">This Year</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{ data.experiences }}</div>
          <div class="kpi-label">Active Experiences</div>
          <div class="kpi-sublabel">Lifetime</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{ data.experienceInstances }}</div>
          <div class="kpi-label">Experience Instances</div>
          <div class="kpi-sublabel">Avg {{ avgParticipantsPerInstance }} participants</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{ data.sessions }}</div>
          <div class="kpi-label">Total Sessions</div>
          <div class="kpi-sublabel">{{ sessionsThisYear }} this year</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{ data.activeProjects }}</div>
          <div class="kpi-label">Active Projects</div>
          <div class="kpi-sublabel">{{ activeProjectsThisYear }} this year</div>
        </div>
      </div>
    </div>

    <!-- Engagement Metrics -->
    <div class="section">
      <h2>Engagement Metrics</h2>
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-title">Average Participants per Instance</div>
          <div class="stat-value">{{ avgParticipantsPerInstance }}</div>
          <div class="stat-subtitle">Across {{ totalInstances }} instances</div>
        </div>
        <div class="stat-box">
          <div class="stat-title">User Retention Rate</div>
          <div class="stat-value">{{ retentionRate }}%</div>
          <div class="stat-subtitle">{{ returningUsers }} of {{ totalUsers }} users returned</div>
        </div>
        <div class="stat-box">
          <div class="stat-title">Avg Days Between Participations</div>
          <div class="stat-value">{{ avgDaysBetween }}</div>
          <div class="stat-subtitle">For returning participants</div>
        </div>
      </div>
    </div>

    <!-- User Roles & Form Completion -->
    <div class="section">
      <h2>User Statistics</h2>
      <div class="two-column-grid">
        <div>
          <h3 class="subsection-title">User Roles Distribution</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th class="text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in userRoles" :key="role._id">
                  <td>{{ role._id }}</td>
                  <td class="text-right">{{ role.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 class="subsection-title">Form Completion Rates</h3>
          <div class="form-stats">
            <div class="form-stat-item">
              <div class="form-stat-label">Goal Setting Forms</div>
              <div class="form-stat-bar-container">
                <div class="form-stat-bar" :style="{ width: goalFormRate + '%' }"></div>
              </div>
              <div class="form-stat-text">{{ completedGoalForms }} / {{ totalRegistrations }} ({{ goalFormRate }}%)</div>
            </div>
            <div class="form-stat-item">
              <div class="form-stat-label">Exit Forms</div>
              <div class="form-stat-bar-container">
                <div class="form-stat-bar exit" :style="{ width: exitFormRate + '%' }"></div>
              </div>
              <div class="form-stat-text">{{ completedExitForms }} / {{ totalRegistrations }} ({{ exitFormRate }}%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Metrics -->
    <div class="section">
      <h2>Project Metrics</h2>
      <div class="stats-grid">
        <div class="stat-box project">
          <div class="stat-title">Avg Projects per Instance</div>
          <div class="stat-value">{{ avgProjectsPerInstance }}</div>
          <div class="stat-subtitle">Range: {{ minProjects }} - {{ maxProjects }}</div>
        </div>
        <div class="stat-box project">
          <div class="stat-title">Avg Members per Project</div>
          <div class="stat-value">{{ avgMembersPerProject }}</div>
          <div class="stat-subtitle">{{ projectsWithDocs }} projects have documents</div>
        </div>
        <div class="stat-box project">
          <div class="stat-title">Project Status</div>
          <div class="stat-value">{{ activeProjectCount }}</div>
          <div class="stat-subtitle">Active ({{ archivedProjectCount }} archived)</div>
        </div>
      </div>
    </div>

    <!-- Project Status & Category Breakdown -->
    <div class="section">
      <h2>Projects by Category</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th class="text-right">Total Projects</th>
              <th class="text-right">Active Projects</th>
              <th class="text-right">% Active</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in projectsByCategory" :key="item._id">
              <td><span class="category-badge">{{ item._id }}</span></td>
              <td class="text-right">{{ item.totalProjects }}</td>
              <td class="text-right">{{ item.activeProjects }}</td>
              <td class="text-right">{{ ((item.activeProjects / item.totalProjects) * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Repeat Participants -->
    <div class="section">
      <h2>Repeat Participation Distribution</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Number of Experiences</th>
              <th class="text-right">Participants</th>
              <th class="text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in repeatParticipants" :key="item.experiences">
              <td>{{ item.experiences }}</td>
              <td class="text-right">{{ item.count }}</td>
              <td class="text-right">{{ item.percentage }}%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td class="text-right"><strong>{{ totalUniqueParticipants }}</strong></td>
              <td class="text-right"><strong>100%</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Top 10 Most Popular Experience Instances -->
    <div class="section">
      <h2>Top 10 Most Popular Experience Instances</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Experience Name</th>
              <th>Category</th>
              <th class="text-right">Participants</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in topExperienceInstances" :key="item._id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>{{ item.experienceName }}</td>
              <td><span class="category-badge">{{ item.category }}</span></td>
              <td class="text-right"><strong>{{ item.participantCount }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Participation Rate by Category -->
    <div class="section">
      <h2>Participation Rate by Category</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th class="text-right">Total Participants</th>
              <th class="text-right">Instances</th>
              <th class="text-right">Avg per Instance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in participationByCategory" :key="item._id">
              <td><span class="category-badge">{{ item._id }}</span></td>
              <td class="text-right">{{ item.totalParticipants }}</td>
              <td class="text-right">{{ item.instanceCount }}</td>
              <td class="text-right">{{ item.avgParticipantsPerInstance }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Category Performance Summary -->
    <div class="section">
      <h2>Category Performance Summary</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th class="text-right">Experiences</th>
              <th class="text-right">Instances</th>
              <th class="text-right">Participants</th>
              <th class="text-right">Avg Participants/Instance</th>
              <th class="text-right">Avg Instances/Experience</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categoryPerformance" :key="item._id">
              <td><span class="category-badge">{{ item._id }}</span></td>
              <td class="text-right">{{ item.experienceCount }}</td>
              <td class="text-right">{{ item.instanceCount }}</td>
              <td class="text-right">{{ item.totalParticipants }}</td>
              <td class="text-right">{{ item.avgParticipantsPerInstance.toFixed(2) }}</td>
              <td class="text-right">{{ item.avgInstancesPerExperience.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Experience Utilization Rate -->
    <div class="section">
      <h2>Experience Utilization Rate (Instances per Experience)</h2>
      <div class="chart-wrapper">
        <svg :width="barChartWidth" :height="barChartHeight" class="bar-chart">
          <!-- Y-axis labels (experience names) -->
          <g class="bar-labels">
            <text v-for="(item, index) in experienceUtilization" :key="'label-' + index"
                  :x="barPadding.left - 10"
                  :y="barPadding.top + (index * barHeight) + (barHeight / 2) + 4"
                  text-anchor="end"
                  font-size="11"
                  fill="#2d3748">
              {{ truncateName(item.experienceName) }}
            </text>
          </g>
          
          <!-- Bars -->
          <g class="bars">
            <rect v-for="(item, index) in experienceUtilization" :key="'bar-' + index"
                  :x="barPadding.left"
                  :y="barPadding.top + (index * barHeight) + (barHeight * 0.2)"
                  :width="getBarWidth(item.instanceCount)"
                  :height="barHeight * 0.6"
                  :fill="getBarColor(item.instanceCount)"
                  rx="3">
              <title>{{ item.experienceName }}: {{ item.instanceCount }} instances</title>
            </rect>
            
            <!-- Value labels -->
            <text v-for="(item, index) in experienceUtilization" :key="'value-' + index"
                  :x="barPadding.left + getBarWidth(item.instanceCount) + 5"
                  :y="barPadding.top + (index * barHeight) + (barHeight / 2) + 4"
                  font-size="12"
                  font-weight="600"
                  fill="#4a5568">
              {{ item.instanceCount }}
            </text>
          </g>
          
          <!-- X-axis grid lines -->
          <g class="grid">
            <line v-for="i in 9" :key="'grid-' + i"
                  :x1="barPadding.left + (barChartWidth - barPadding.left - barPadding.right) * i / 8"
                  :y1="barPadding.top"
                  :x2="barPadding.left + (barChartWidth - barPadding.left - barPadding.right) * i / 8"
                  :y2="barChartHeight - barPadding.bottom"
                  stroke="#e2e8f0"
                  stroke-dasharray="2,2"
                  opacity="0.5" />
          </g>
        </svg>
      </div>
      
      <h3 class="subsection-title" style="margin-top: 2rem;">Detailed Experience Data</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Experience Name</th>
              <th>Category</th>
              <th class="text-right">Instance Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in experienceUtilization" :key="item._id">
              <td>{{ item.experienceName }}</td>
              <td><span class="category-badge">{{ item.experienceCategory }}</span></td>
              <td class="text-right">{{ item.instanceCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Underutilized Experiences -->
    <div class="section">
      <h2>Underutilized Experiences (Less than 2 Instances)</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Experience Name</th>
              <th>Category</th>
              <th class="text-right">Instance Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in underutilizedExperiences" :key="item._id">
              <td>{{ item.experienceName }}</td>
              <td><span class="category-badge">{{ item.experienceCategory }}</span></td>
              <td class="text-right">{{ item.instanceCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quarterly Growth 2025 -->
    <div class="section">
      <h2>Quarterly Participant Growth (2025)</h2>
      <div class="quarter-grid">
        <div v-for="quarter in quarterlyGrowth" :key="quarter.quarter" class="quarter-card">
          <div class="quarter-label">{{ quarter.quarter }}</div>
          <div class="quarter-value">{{ quarter.participants }}</div>
          <div class="quarter-subtitle">New Participants</div>
        </div>
      </div>
    </div>

    <!-- Monthly Registration Growth -->
    <div class="section">
      <h2>Monthly Participant Registration Growth Trend</h2>
      <div class="chart-wrapper">
        <svg :width="chartWidth" :height="chartHeight" class="line-chart">
          <!-- Grid lines -->
          <g class="grid">
            <line v-for="i in 6" :key="'grid-' + i" 
                  :x1="chartPadding.left" 
                  :y1="chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * i / 5"
                  :x2="chartWidth - chartPadding.right"
                  :y2="chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * i / 5"
                  stroke="#e2e8f0" stroke-dasharray="3,3" />
          </g>
          
          <!-- Y-axis labels -->
          <g class="y-labels">
            <text v-for="i in 6" :key="'y-' + i"
                  :x="chartPadding.left - 10"
                  :y="chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * i / 5 + 4"
                  text-anchor="end"
                  font-size="12"
                  fill="#718096">
              {{ Math.round(maxCount - (maxCount * i / 5)) }}
            </text>
          </g>
          
          <!-- Line path -->
          <polyline 
            :points="linePoints"
            fill="none"
            stroke="#667eea"
            stroke-width="3"
            stroke-linejoin="round"
            stroke-linecap="round" />
          
          <!-- Data points -->
          <g class="data-points">
            <circle v-for="(point, index) in chartPoints" :key="'point-' + index"
                    :cx="point.x"
                    :cy="point.y"
                    r="4"
                    fill="#667eea"
                    class="chart-dot"
                    @mouseenter="showTooltip(index, $event)"
                    @mouseleave="hideTooltip">
              <title>{{ formatMonth(monthlyGrowth[index].month, monthlyGrowth[index].year) }}: {{ monthlyGrowth[index].count }}</title>
            </circle>
          </g>
          
          <!-- X-axis labels (every 3rd month) -->
          <g class="x-labels">
            <text v-for="(item, index) in monthlyGrowth" :key="'x-' + index"
                  v-show="index % 3 === 0"
                  :x="chartPadding.left + (chartWidth - chartPadding.left - chartPadding.right) * index / (monthlyGrowth.length - 1)"
                  :y="chartHeight - chartPadding.bottom + 20"
                  text-anchor="middle"
                  font-size="11"
                  fill="#718096">
              {{ formatMonth(item.month, item.year) }}
            </text>
          </g>
        </svg>
      </div>
      
      <h3 class="subsection-title" style="margin-top: 2rem;">Detailed Monthly Data</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th class="text-right">Registrations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in monthlyGrowth" :key="`${item.year}-${item.month}`">
              <td>{{ formatMonth(item.month, item.year) }}</td>
              <td class="text-right">{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

<!-- Sessions by Month 2025 -->
    <div class="section">
      <h2>Sessions by Month (2025)</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th class="text-right">Sessions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sessionsByMonth" :key="`${item.year}-${item.month}`">
              <td>{{ formatMonth(item.month, item.year) }}</td>
              <td class="text-right">{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Experiences by Category -->
    <div class="section">
      <h2>Experiences by Category</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th class="text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in experiencesByCategory" :key="item._id">
              <td>{{ item._id }}</td>
              <td class="text-right">{{ item.count }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td class="text-right"><strong>{{ data.experiences }}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Experience Instances by Category -->
    <div class="section">
      <h2>Experience Instances by Category</h2>
      <div class="chart-wrapper">
        <svg :width="categoryChartWidth" :height="instancesCategoryHeight" class="bar-chart">
          <!-- Y-axis labels (category names) -->
          <g class="bar-labels">
            <text v-for="(item, index) in experienceInstancesByCategory" :key="'inst-label-' + index"
                  :x="categoryPadding.left - 10"
                  :y="categoryPadding.top + (index * categoryBarHeight) + (categoryBarHeight / 2) + 4"
                  text-anchor="end"
                  font-size="12"
                  fill="#2d3748">
              {{ item._id }}
            </text>
          </g>
          
          <!-- Bars -->
          <g class="bars">
            <rect v-for="(item, index) in experienceInstancesByCategory" :key="'inst-bar-' + index"
                  :x="categoryPadding.left"
                  :y="categoryPadding.top + (index * categoryBarHeight) + (categoryBarHeight * 0.2)"
                  :width="getInstCategoryBarWidth(item.count)"
                  :height="categoryBarHeight * 0.6"
                  fill="#8b5cf6"
                  rx="3">
              <title>{{ item._id }}: {{ item.count }} instances</title>
            </rect>
            
            <!-- Value labels -->
            <text v-for="(item, index) in experienceInstancesByCategory" :key="'inst-value-' + index"
                  :x="categoryPadding.left + getInstCategoryBarWidth(item.count) + 5"
                  :y="categoryPadding.top + (index * categoryBarHeight) + (categoryBarHeight / 2) + 4"
                  font-size="13"
                  font-weight="600"
                  fill="#4a5568">
              {{ item.count }}
            </text>
          </g>
          
          <!-- X-axis grid lines -->
          <g class="grid">
            <line v-for="i in 10" :key="'inst-grid-' + i"
                  :x1="categoryPadding.left + (categoryChartWidth - categoryPadding.left - categoryPadding.right) * i / 9"
                  :y1="categoryPadding.top"
                  :x2="categoryPadding.left + (categoryChartWidth - categoryPadding.left - categoryPadding.right) * i / 9"
                  :y2="instancesCategoryHeight - categoryPadding.bottom"
                  stroke="#e2e8f0"
                  stroke-dasharray="2,2"
                  opacity="0.5" />
          </g>
        </svg>
      </div>
      
      <div class="table-container" style="margin-top: 2rem;">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th class="text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in experienceInstancesByCategory" :key="item._id">
              <td>{{ item._id }}</td>
              <td class="text-right">{{ item.count }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td class="text-right"><strong>{{ data.experienceInstances }}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Top Experience Categories -->
    <div class="section">
      <h2>Top Experience Categories</h2>
      <div class="category-list">
        <div v-for="(category, index) in topCategories" :key="category.name" class="category-item">
          <div class="category-rank">{{ index + 1 }}</div>
          <div class="category-info">
            <div class="category-name">{{ category.name }}</div>
            <div class="category-bar-container">
              <div class="category-bar" :style="{ width: getCategoryWidth(category.count) + '%' }"></div>
            </div>
          </div>
          <div class="category-count">{{ category.count }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const data = ref({
  participants: 795,
  participantsThisYear: 358,
  experiences: 18,
  experienceInstances: 44,
  sessions: 13,
  activeProjects: 18
});

const sessionsThisYear = ref(6);
const activeProjectsThisYear = ref(18);
const avgParticipantsPerInstance = ref(25.09);
const totalInstances = ref(44);

// Engagement metrics
const totalUsers = ref(795);
const returningUsers = ref(174);
const retentionRate = ref(21.89);
const avgDaysBetween = ref(41.28);

// User roles
const userRoles = ref([
  { _id: 'Student', count: 997 },
  { _id: 'Org Admin', count: 5 }
]);

// Form completion
const totalRegistrations = ref(1106);
const completedGoalForms = ref(826);
const completedExitForms = ref(449);
const goalFormRate = ref(74.68);
const exitFormRate = ref(40.60);

// Project metrics
const avgProjectsPerInstance = ref(9.5);
const maxProjects = ref(17);
const minProjects = ref(2);
const avgMembersPerProject = ref(1);
const projectsWithDocs = ref(14);
const activeProjectCount = ref(18);
const archivedProjectCount = ref(1);

// Projects by category
const projectsByCategory = ref([
  { _id: 'EDS', totalProjects: 17, activeProjects: 16 },
  { _id: 'Honors OCE', totalProjects: 2, activeProjects: 2 }
]);

// Repeat participants data
const repeatParticipants = ref([
  { experiences: '1 experience', count: 621, percentage: 78.11 },
  { experiences: '2 experiences', count: 104, percentage: 13.08 },
  { experiences: '3 experiences', count: 56, percentage: 7.04 },
  { experiences: '5 experiences', count: 13, percentage: 1.64 },
  { experiences: '10 experiences', count: 1, percentage: 0.13 }
]);

const totalUniqueParticipants = computed(() => {
  return repeatParticipants.value.reduce((sum, item) => sum + item.count, 0);
});

// Top 10 experience instances
const topExperienceInstances = ref([
  { _id: '091706543718988', experienceName: 'CHW Certification', category: 'Honors OCE', participantCount: 92 },
  { _id: '781723659481783', experienceName: 'Community Advocacy & Responsive Engagement (CARE)', category: 'Honors OCE', participantCount: 73 },
  { _id: '561755877555759', experienceName: 'Community Advocacy & Responsive Engagement (CARE)', category: 'Honors OCE', participantCount: 72 },
  { _id: '031757080564716', experienceName: 'CHW Certification', category: 'Honors OCE', participantCount: 72 },
  { _id: '171725654303489', experienceName: 'CHW Certification', category: 'Honors OCE', participantCount: 71 },
  { _id: '831727219866870', experienceName: 'Honors in Community Health - Project Volunteer', category: 'Honors OCE', participantCount: 67 },
  { _id: '481737646618356', experienceName: 'CHW Certification', category: 'Honors OCE', participantCount: 66 },
  { _id: '151756836442991', experienceName: 'Honors in Community Health - Project Volunteer', category: 'Honors OCE', participantCount: 63 },
  { _id: '641705696600984', experienceName: 'Honors in Community Health - Project Volunteer', category: 'Honors OCE', participantCount: 53 },
  { _id: '861705696600925', experienceName: 'CHW Certification', category: 'CHWI', participantCount: 39 }
]);

// Participation by category
const participationByCategory = ref([
  { _id: 'Honors OCE', totalParticipants: 754, instanceCount: 15, avgParticipantsPerInstance: 50.27 },
  { _id: 'Minor Data & Society', totalParticipants: 230, instanceCount: 19, avgParticipantsPerInstance: 12.11 },
  { _id: 'CHWI', totalParticipants: 39, instanceCount: 2, avgParticipantsPerInstance: 19.5 },
  { _id: 'EDS', totalParticipants: 33, instanceCount: 2, avgParticipantsPerInstance: 16.5 },
  { _id: 'Digital Humanities Core (DHC)', totalParticipants: 22, instanceCount: 1, avgParticipantsPerInstance: 22 },
  { _id: 'Honors Courses', totalParticipants: 16, instanceCount: 1, avgParticipantsPerInstance: 16 },
  { _id: 'HICH', totalParticipants: 10, instanceCount: 4, avgParticipantsPerInstance: 2.5 }
]);

// Category performance summary
const categoryPerformance = ref([
  { _id: 'Honors OCE', instanceCount: 21, totalParticipants: 803, experienceCount: 7, avgParticipantsPerInstance: 38.23809523809524, avgInstancesPerExperience: 3 },
  { _id: 'Minor Data & Society', instanceCount: 18, totalParticipants: 229, experienceCount: 7, avgParticipantsPerInstance: 12.722222222222221, avgInstancesPerExperience: 2.5714285714285716 },
  { _id: 'EDS', instanceCount: 5, totalParticipants: 36, experienceCount: 2, avgParticipantsPerInstance: 7.2, avgInstancesPerExperience: 2.5 },
  { _id: 'Digital Humanities Core (DHC)', instanceCount: 1, totalParticipants: 22, experienceCount: 1, avgParticipantsPerInstance: 22, avgInstancesPerExperience: 1 },
  { _id: 'Honors Courses', instanceCount: 1, totalParticipants: 16, experienceCount: 1, avgParticipantsPerInstance: 16, avgInstancesPerExperience: 1 }
]);

// Experience utilization
const experienceUtilization = ref([
  { _id: '1c2ac6b0-6911-11ee-acdd-43267c0573ee', experienceCategory: 'Honors OCE', experienceName: 'CHW Certification', instanceCount: 8 },
  { _id: '1a4f69e0-4b6b-11ee-be70-57bb79342314', experienceCategory: 'Minor Data & Society', experienceName: 'HON 4350', instanceCount: 5 },
  { _id: '2cb863a0-405a-11ee-936c-3f576b97db99', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3350', instanceCount: 5 },
  { _id: 'd86ea4d0-693f-11ee-acdd-43267c0573ee', experienceCategory: 'Honors OCE', experienceName: 'Honors in Community Health - Project Volunteer', instanceCount: 4 },
  { _id: '111715184731875', experienceCategory: 'EDS', experienceName: 'The Pharis Fellowship', instanceCount: 4 },
  { _id: '371700585066467', experienceCategory: 'Honors OCE', experienceName: 'HICH - Project Head', instanceCount: 3 },
  { _id: '254ad870-4b6b-11ee-be70-57bb79342314', experienceCategory: 'Minor Data & Society', experienceName: 'HON 4355', instanceCount: 3 },
  { _id: 'e63fedf0-4b6a-11ee-be70-57bb79342314', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3397 - HJD', instanceCount: 2 },
  { _id: '411700584985239', experienceCategory: 'Honors OCE', experienceName: 'HICH - R&D / Leadership Team', instanceCount: 2 },
  { _id: '011723574498875', experienceCategory: 'Honors OCE', experienceName: 'Community Advocacy & Responsive Engagement (CARE)', instanceCount: 2 },
  { _id: '931715184757723', experienceCategory: 'Digital Humanities Core (DHC)', experienceName: 'Summer Internship in Public History and Digital Humanities (SIPHDH)', instanceCount: 1 },
  { _id: '431724900634325', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3397 - AI', instanceCount: 1 },
  { _id: '441737646723289', experienceCategory: 'Honors OCE', experienceName: 'Albert Schweitzer Fellowship', instanceCount: 1 },
  { _id: '781737651184396', experienceCategory: 'Honors Courses', experienceName: 'HON 4397 - Social Advocacy in Action', instanceCount: 1 },
  { _id: '041755549569978', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3397 - Death Penalty', instanceCount: 1 },
  { _id: '811755549589642', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3397 - Media', instanceCount: 1 },
  { _id: '781756836395961', experienceCategory: 'Honors OCE', experienceName: 'Honors in Community Health - Leadership (Director, R&D, Project Head, etc)', instanceCount: 1 },
  { _id: '091737646872132', experienceCategory: 'EDS', experienceName: 'PURS', instanceCount: 0 }
]);

// Underutilized experiences
const underutilizedExperiences = ref([
  { _id: '091737646872132', experienceCategory: 'EDS', experienceName: 'PURS', instanceCount: 0 },
  { _id: '931715184757723', experienceCategory: 'Digital Humanities Core (DHC)', experienceName: 'Summer Internship in Public History and Digital Humanities (SIPHDH)', instanceCount: 1 },
  { _id: '431724900634325', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3397 - AI', instanceCount: 1 },
  { _id: '441737646723289', experienceCategory: 'Honors OCE', experienceName: 'Albert Schweitzer Fellowship', instanceCount: 1 },
  { _id: '781737651184396', experienceCategory: 'Honors Courses', experienceName: 'HON 4397 - Social Advocacy in Action', instanceCount: 1 },
  { _id: '041755549569978', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3397 - Death Penalty', instanceCount: 1 },
  { _id: '811755549589642', experienceCategory: 'Minor Data & Society', experienceName: 'HON 3397 - Media', instanceCount: 1 },
  { _id: '781756836395961', experienceCategory: 'Honors OCE', experienceName: 'Honors in Community Health - Leadership (Director, R&D, Project Head, etc)', instanceCount: 1 }
]);

// Quarterly growth 2025
const quarterlyGrowth = ref([
  { quarter: 'Q1 2025', participants: 90 },
  { quarter: 'Q2 2025', participants: 77 },
  { quarter: 'Q3 2025', participants: 277 },
  { quarter: 'Q4 2025', participants: 9 }
]);

// Monthly growth
const monthlyGrowth = ref([
  { count: 53, year: 2023, month: 11 },
  { count: 79, year: 2023, month: 12 },
  { count: 24, year: 2024, month: 1 },
  { count: 87, year: 2024, month: 2 },
  { count: 24, year: 2024, month: 3 },
  { count: 7, year: 2024, month: 4 },
  { count: 45, year: 2024, month: 5 },
  { count: 30, year: 2024, month: 6 },
  { count: 2, year: 2024, month: 7 },
  { count: 32, year: 2024, month: 8 },
  { count: 190, year: 2024, month: 9 },
  { count: 41, year: 2024, month: 10 },
  { count: 32, year: 2024, month: 11 },
  { count: 7, year: 2024, month: 12 },
  { count: 38, year: 2025, month: 1 },
  { count: 50, year: 2025, month: 2 },
  { count: 2, year: 2025, month: 3 },
  { count: 8, year: 2025, month: 4 },
  { count: 60, year: 2025, month: 5 },
  { count: 9, year: 2025, month: 6 },
  { count: 13, year: 2025, month: 7 },
  { count: 264, year: 2025, month: 9 },
  { count: 9, year: 2025, month: 10 }
]);

// Sessions by month 2025
const sessionsByMonth = ref([
  { year: 2025, month: 1, count: 1 },
  { year: 2025, month: 4, count: 1 },
  { year: 2025, month: 5, count: 1 },
  { year: 2025, month: 8, count: 3 }
]);

const experiencesByCategory = ref([
  { _id: 'Minor Data & Society', count: 7 },
  { _id: 'Honors OCE', count: 7 },
  { _id: 'EDS', count: 2 },
  { _id: 'Honors Courses', count: 1 }
]);

const experienceInstancesByCategory = ref([
  { _id: 'Minor Data & Society', count: 19 },
  { _id: 'Honors OCE', count: 15 },
  { _id: 'HICH', count: 4 },
  { _id: 'CHWI', count: 2 },
  { _id: 'EDS', count: 2 },
  { _id: 'Honors Courses', count: 1 }
]);

const topCategories = ref([
  { count: 19, name: 'Minor Data & Society' },
  { count: 15, name: 'Honors OCE' },
  { count: 4, name: 'HICH' },
  { count: 2, name: 'CHWI' },
  { count: 2, name: 'EDS' }
]);

const getCategoryWidth = (count) => {
  const maxCount = Math.max(...topCategories.value.map(c => c.count));
  return (count / maxCount) * 100;
};

const formatMonth = (month, year) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${year}`;
};

// Chart configuration
const chartWidth = ref(1100);
const chartHeight = ref(400);
const chartPadding = ref({ top: 20, right: 20, bottom: 50, left: 60 });

// Calculate max value for Y-axis
const maxCount = computed(() => {
  const max = Math.max(...monthlyGrowth.value.map(item => item.count));
  return Math.ceil(max / 50) * 50; // Round up to nearest 50
});

// Calculate chart points
const chartPoints = computed(() => {
  const points = [];
  const chartAreaWidth = chartWidth.value - chartPadding.value.left - chartPadding.value.right;
  const chartAreaHeight = chartHeight.value - chartPadding.value.top - chartPadding.value.bottom;
  
  monthlyGrowth.value.forEach((item, index) => {
    const x = chartPadding.value.left + (chartAreaWidth * index / (monthlyGrowth.value.length - 1));
    const y = chartPadding.value.top + chartAreaHeight - (chartAreaHeight * item.count / maxCount.value);
    points.push({ x, y });
  });
  
  return points;
});

// Create polyline points string
const linePoints = computed(() => {
  return chartPoints.value.map(p => `${p.x},${p.y}`).join(' ');
});

const showTooltip = (index, event) => {
  // Optional: implement custom tooltip logic
};

const hideTooltip = () => {
  // Optional: implement custom tooltip logic
};

// Bar chart configuration
const barHeight = 35;
const barChartWidth = ref(1100);
const barChartHeight = computed(() => {
  return experienceUtilization.value.length * barHeight + 40;
});
const barPadding = ref({ top: 20, right: 80, bottom: 20, left: 320 });

const maxInstanceCount = computed(() => {
  return Math.max(...experienceUtilization.value.map(item => item.instanceCount));
});

const getBarWidth = (count) => {
  const maxWidth = barChartWidth.value - barPadding.value.left - barPadding.value.right;
  return (count / maxInstanceCount.value) * maxWidth;
};

const getBarColor = (count) => {
  if (count === 0) return '#cbd5e0';
  if (count === 1) return '#fbbf24';
  if (count <= 3) return '#60a5fa';
  if (count <= 5) return '#667eea';
  return '#8b5cf6';
};

const truncateName = (name) => {
  return name.length > 45 ? name.substring(0, 42) + '...' : name;
};

// Category bar chart configuration
const categoryBarHeight = 50;
const categoryChartWidth = ref(1100);
const categoryPadding = ref({ top: 20, right: 80, bottom: 20, left: 250 });

const experiencesCategoryHeight = computed(() => {
  return experiencesByCategory.value.length * categoryBarHeight + 40;
});

const instancesCategoryHeight = computed(() => {
  return experienceInstancesByCategory.value.length * categoryBarHeight + 40;
});

const maxExpCategoryCount = computed(() => {
  return Math.max(...experiencesByCategory.value.map(item => item.count));
});

const maxInstCategoryCount = computed(() => {
  return Math.max(...experienceInstancesByCategory.value.map(item => item.count));
});

const getExpCategoryBarWidth = (count) => {
  const maxWidth = categoryChartWidth.value - categoryPadding.value.left - categoryPadding.value.right;
  return (count / maxExpCategoryCount.value) * maxWidth;
};

const getInstCategoryBarWidth = (count) => {
  const maxWidth = categoryChartWidth.value - categoryPadding.value.left - categoryPadding.value.right;
  return (count / maxInstCategoryCount.value) * maxWidth;
};
</script>

<style scoped>
.kpi-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h2 {
  font-size: 1.25rem;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.subsection-title {
  font-size: 1rem;
  color: #4a5568;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.kpi-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: white;
  transition: transform 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
}

.kpi-card.highlight {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.kpi-label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  opacity: 0.95;
}

.kpi-sublabel {
  font-size: 0.8rem;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-box {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: white;
}

.stat-box.project {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  opacity: 0.95;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-subtitle {
  font-size: 0.8rem;
  opacity: 0.85;
}

.two-column-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.form-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-stat-label {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.875rem;
}

.form-stat-bar-container {
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.form-stat-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.form-stat-bar.exit {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

.form-stat-text {
  font-size: 0.875rem;
  color: #4a5568;
}

.quarter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.quarter-card {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: white;
}

.quarter-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.quarter-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.quarter-subtitle {
  font-size: 0.75rem;
  opacity: 0.85;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  color: #2d3748;
}

.text-right {
  text-align: right;
}

tbody tr:hover {
  background: #f7fafc;
}

tfoot {
  background: #f7fafc;
  font-weight: 600;
}

tfoot td {
  border-bottom: none;
  border-top: 2px solid #cbd5e0;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: #f7fafc;
  transition: background 0.2s;
}

.category-item:hover {
  background: #edf2f7;
}

.category-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-name {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.category-bar-container {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.category-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.category-count {
  font-weight: 600;
  color: #4a5568;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  overflow-x: auto;
  padding: 1rem 0;
}

.line-chart {
  background: #fafafa;
  border-radius: 8px;
}

.bar-chart {
  background: #fafafa;
  border-radius: 8px;
}

.bars rect {
  transition: opacity 0.2s;
  cursor: pointer;
}

.bars rect:hover {
  opacity: 0.8;
}

.chart-dot {
  cursor: pointer;
  transition: r 0.2s;
}

.chart-dot:hover {
  r: 6;
}

@media (max-width: 768px) {
  .kpi-dashboard {
    padding: 1rem;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  
  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .two-column-grid {
    grid-template-columns: 1fr;
  }
}
</style>
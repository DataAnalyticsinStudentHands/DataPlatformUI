<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Timeline - Who Did What When?</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        #app {
            max-width: 1400px;
            margin: 0 auto;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            position: relative;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }
        .student-info {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-top: 20px;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .controls {
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .control-group label {
            font-size: 0.9em;
            color: #6c757d;
            font-weight: 600;
        }
        .toggle-btn {
            padding: 10px 20px;
            background: white;
            border: 2px solid #667eea;
            border-radius: 8px;
            color: #667eea;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .toggle-btn:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .toggle-btn.active {
            background: #667eea;
            color: white;
        }
        .select-dropdown {
            padding: 10px 15px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            background: white;
            font-size: 1em;
            cursor: pointer;
            transition: border-color 0.3s ease;
        }
        .select-dropdown:focus {
            outline: none;
            border-color: #667eea;
        }
        .chart-container {
            padding: 30px;
            height: 600px;
            position: relative;
        }
        .legend {
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9em;
        }
        .legend-icon {
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #6c757d;
            margin-top: 5px;
            font-size: 0.9em;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            backdrop-filter: blur(5px);
        }
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .modal-header h3 {
            color: #333;
            font-size: 1.5em;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: #6c757d;
            transition: color 0.3s ease;
        }
        .close-btn:hover {
            color: #333;
        }
        .form-details {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .form-field {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .form-field label {
            font-weight: 600;
            color: #495057;
            display: block;
            margin-bottom: 5px;
        }
        .form-field .value {
            color: #6c757d;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
            margin-right: 5px;
        }
        .badge.completed {
            background: #28a745;
            color: white;
        }
        .badge.pending {
            background: #ffc107;
            color: #333;
        }
    </style>
</head>
<body>
    <div id="app">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>Student Journey Timeline</h1>
                <p>Interactive visualization of experiences, activities, and forms</p>
                <div class="student-info">
                    <div class="avatar">{{ selectedStudent.initials }}</div>
                    <div>
                        <div style="font-size: 1.2em; font-weight: 600;">{{ selectedStudent.name }}</div>
                        <div style="opacity: 0.9;">{{ selectedStudent.email }}</div>
                        <div style="opacity: 0.9; font-size: 0.9em;">ID: {{ selectedStudent.id }}</div>
                    </div>
                </div>
            </div>

            <!-- Controls -->
            <div class="controls">
                <div class="control-group">
                    <label>Time Range</label>
                    <button @click="toggleTimeRange" class="toggle-btn" :class="{ active: showLastThreeSemesters }">
                        {{ showLastThreeSemesters ? 'Last 3 Semesters' : 'All Time' }}
                    </button>
                </div>
                <div class="control-group">
                    <label>Student</label>
                    <select v-model="selectedStudentId" @change="updateChart" class="select-dropdown">
                        <option v-for="student in students" :key="student.id" :value="student.id">
                            {{ student.name }}
                        </option>
                    </select>
                </div>
                <div class="control-group">
                    <label>View Mode</label>
                    <select v-model="viewMode" @change="updateChart" class="select-dropdown">
                        <option value="timeline">Timeline View</option>
                        <option value="compact">Compact View</option>
                        <option value="detailed">Detailed View</option>
                    </select>
                </div>
            </div>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">{{ stats.totalExperiences }}</div>
                    <div class="stat-label">Total Experiences</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ stats.completedForms }}</div>
                    <div class="stat-label">Completed Forms</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ stats.totalActivities }}</div>
                    <div class="stat-label">Activities Participated</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ stats.averageProgress }}%</div>
                    <div class="stat-label">Average Progress</div>
                </div>
            </div>

            <!-- Chart -->
            <div class="chart-container">
                <div ref="chart" style="width: 100%; height: 100%;"></div>
            </div>

            <!-- Legend -->
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-icon" style="background: #667eea;"></div>
                    <span>Research Experience</span>
                </div>
                <div class="legend-item">
                    <div class="legend-icon" style="background: #28a745;"></div>
                    <span>Community Engagement</span>
                </div>
                <div class="legend-item">
                    <div class="legend-icon" style="background: #ffc107;"></div>
                    <span>Clinical Practice</span>
                </div>
                <div class="legend-item">
                    <div class="legend-icon" style="background: #17a2b8;"></div>
                    <span>Leadership Development</span>
                </div>
                <div class="legend-item">
                    <span style="font-size: 1.2em;">📝</span>
                    <span>Goal Form</span>
                </div>
                <div class="legend-item">
                    <span style="font-size: 1.2em;">✅</span>
                    <span>Exit Form</span>
                </div>
                <div class="legend-item">
                    <span style="font-size: 1.2em;">•</span>
                    <span>Activity</span>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal" :class="{ active: showModal }">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>{{ modalTitle }}</h3>
                        <button @click="closeModal" class="close-btn">×</button>
                    </div>
                    <div class="form-details">
                        <div class="form-field">
                            <label>Form Type</label>
                            <div class="value">
                                <span class="badge" :class="modalData.completed ? 'completed' : 'pending'">
                                    {{ modalData.completed ? 'Completed' : 'Pending' }}
                                </span>
                                {{ modalData.type }}
                            </div>
                        </div>
                        <div class="form-field">
                            <label>Experience</label>
                            <div class="value">{{ modalData.experience }}</div>
                        </div>
                        <div class="form-field">
                            <label>Session</label>
                            <div class="value">{{ modalData.session }}</div>
                        </div>
                        <div class="form-field">
                            <label>Date</label>
                            <div class="value">{{ modalData.date }}</div>
                        </div>
                        <div class="form-field" v-if="modalData.goals">
                            <label>Goals Set</label>
                            <div class="value">{{ modalData.goals }}</div>
                        </div>
                        <div class="form-field" v-if="modalData.progress">
                            <label>Progress</label>
                            <div class="value">{{ modalData.progress }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    // Fake student data
                    students: [
                        { id: 'usr_001', name: 'Sarah Johnson', email: 'sjohnson@uh.edu', initials: 'SJ' },
                        { id: 'usr_002', name: 'Michael Chen', email: 'mchen@uh.edu', initials: 'MC' },
                        { id: 'usr_003', name: 'Emily Rodriguez', email: 'erodriguez@uh.edu', initials: 'ER' }
                    ],
                    selectedStudentId: 'usr_001',
                    showLastThreeSemesters: false,
                    viewMode: 'timeline',
                    chart: null,
                    showModal: false,
                    modalTitle: '',
                    modalData: {},
                    
                    // Fake timeline data
                    timelineData: {
                        'usr_001': [
                            {
                                experienceId: 'exp_001',
                                experienceName: 'HICH 3350: Community Health Research',
                                category: 'Research Experience',
                                sessionId: 'ses_001',
                                sessionName: 'Fall 2023',
                                startDate: '2023-08-21',
                                endDate: '2023-12-15',
                                activities: [
                                    { id: 'act_001', name: 'Literature Review Workshop', date: '2023-09-15' },
                                    { id: 'act_002', name: 'Data Collection Training', date: '2023-10-01' },
                                    { id: 'act_003', name: 'Community Survey Project', date: '2023-10-20' }
                                ],
                                goalForm: { completed: true, date: '2023-08-25' },
                                exitForm: { completed: true, date: '2023-12-10' }
                            },
                            {
                                experienceId: 'exp_002',
                                experienceName: 'PHARIS Clinical Rotation',
                                category: 'Clinical Practice',
                                sessionId: 'ses_002',
                                sessionName: 'Spring 2024',
                                startDate: '2024-01-16',
                                endDate: '2024-05-10',
                                activities: [
                                    { id: 'act_004', name: 'Patient Assessment Training', date: '2024-02-01' },
                                    { id: 'act_005', name: 'Health Screening Event', date: '2024-03-15' }
                                ],
                                goalForm: { completed: true, date: '2024-01-20' },
                                exitForm: { completed: true, date: '2024-05-05' }
                            },
                            {
                                experienceId: 'exp_003',
                                experienceName: 'HICH 4350: Advanced Community Engagement',
                                category: 'Community Engagement',
                                sessionId: 'ses_003',
                                sessionName: 'Fall 2024',
                                startDate: '2024-08-19',
                                endDate: '2024-12-13',
                                activities: [
                                    { id: 'act_006', name: 'Community Partnership Meeting', date: '2024-09-10' },
                                    { id: 'act_007', name: 'Health Fair Organization', date: '2024-10-15' },
                                    { id: 'act_008', name: 'Policy Advocacy Workshop', date: '2024-11-01' }
                                ],
                                goalForm: { completed: true, date: '2024-08-23' },
                                exitForm: { completed: false, date: '2024-12-10' }
                            },
                            {
                                experienceId: 'exp_004',
                                experienceName: 'Leadership Mentorship Program',
                                category: 'Leadership Development',
                                sessionId: 'ses_004',
                                sessionName: 'Spring 2025',
                                startDate: '2025-01-13',
                                endDate: '2025-05-09',
                                activities: [
                                    { id: 'act_009', name: 'Leadership Assessment', date: '2025-01-20' },
                                    { id: 'act_010', name: 'Mentor Matching Session', date: '2025-02-01' }
                                ],
                                goalForm: { completed: true, date: '2025-01-15' },
                                exitForm: { completed: false, date: '2025-05-05' }
                            }
                        ],
                        'usr_002': [
                            // Similar data structure for other students
                            {
                                experienceId: 'exp_001',
                                experienceName: 'HICH 3350: Community Health Research',
                                category: 'Research Experience',
                                sessionId: 'ses_002',
                                sessionName: 'Spring 2024',
                                startDate: '2024-01-16',
                                endDate: '2024-05-10',
                                activities: [
                                    { id: 'act_001', name: 'Literature Review Workshop', date: '2024-02-15' },
                                    { id: 'act_002', name: 'Data Collection Training', date: '2024-03-01' }
                                ],
                                goalForm: { completed: true, date: '2024-01-20' },
                                exitForm: { completed: true, date: '2024-05-08' }
                            }
                        ],
                        'usr_003': [
                            {
                                experienceId: 'exp_002',
                                experienceName: 'PHARIS Clinical Rotation',
                                category: 'Clinical Practice',
                                sessionId: 'ses_003',
                                sessionName: 'Fall 2024',
                                startDate: '2024-08-19',
                                endDate: '2024-12-13',
                                activities: [
                                    { id: 'act_004', name: 'Patient Assessment Training', date: '2024-09-01' }
                                ],
                                goalForm: { completed: true, date: '2024-08-22' },
                                exitForm: { completed: false, date: '2024-12-11' }
                            }
                        ]
                    }
                };
            },
            computed: {
                selectedStudent() {
                    return this.students.find(s => s.id === this.selectedStudentId);
                },
                currentTimelineData() {
                    let data = this.timelineData[this.selectedStudentId] || [];
                    
                    if (this.showLastThreeSemesters) {
                        // Filter to last 3 semesters
                        const cutoffDate = new Date();
                        cutoffDate.setMonth(cutoffDate.getMonth() - 18); // Approximately 3 semesters
                        data = data.filter(exp => new Date(exp.startDate) >= cutoffDate);
                    }
                    
                    return data;
                },
                stats() {
                    const data = this.currentTimelineData;
                    const totalExperiences = data.length;
                    const completedForms = data.reduce((acc, exp) => {
                        return acc + (exp.goalForm.completed ? 1 : 0) + (exp.exitForm.completed ? 1 : 0);
                    }, 0);
                    const totalActivities = data.reduce((acc, exp) => acc + exp.activities.length, 0);
                    const averageProgress = Math.round((completedForms / (totalExperiences * 2)) * 100);
                    
                    return {
                        totalExperiences,
                        completedForms,
                        totalActivities,
                        averageProgress
                    };
                }
            },
            mounted() {
                this.initChart();
                window.addEventListener('resize', () => {
                    if (this.chart) {
                        this.chart.resize();
                    }
                });
            },
            methods: {
                initChart() {
                    this.chart = echarts.init(this.$refs.chart);
                    this.updateChart();
                },
                toggleTimeRange() {
                    this.showLastThreeSemesters = !this.showLastThreeSemesters;
                    this.updateChart();
                },
                getCategoryColor(category) {
                    const colors = {
                        'Research Experience': '#667eea',
                        'Community Engagement': '#28a745',
                        'Clinical Practice': '#ffc107',
                        'Leadership Development': '#17a2b8'
                    };
                    return colors[category] || '#6c757d';
                },
                updateChart() {
                    const data = this.currentTimelineData;
                    
                    // Prepare data for ECharts
                    const experiences = [];
                    const activities = [];
                    const forms = [];
                    
                    data.forEach((exp, idx) => {
                        // Experience bars
                        experiences.push({
                            name: exp.experienceName,
                            value: [
                                idx,
                                new Date(exp.startDate).getTime(),
                                new Date(exp.endDate).getTime(),
                                exp.experienceName
                            ],
                            itemStyle: {
                                color: this.getCategoryColor(exp.category),
                                borderRadius: 4
                            },
                            category: exp.category,
                            sessionName: exp.sessionName
                        });
                        
                        // Activity markers
                        exp.activities.forEach(activity => {
                            activities.push({
                                name: activity.name,
                                value: [idx, new Date(activity.date).getTime()],
                                symbolSize: 8,
                                itemStyle: {
                                    color: '#333'
                                },
                                experienceName: exp.experienceName
                            });
                        });
                        
                        // Form markers
                        if (exp.goalForm.completed) {
                            forms.push({
                                name: 'Goal Form',
                                value: [idx, new Date(exp.goalForm.date).getTime()],
                                symbol: 'path://M9 11H7v2h2v-2zm0-4H7v2h2V7zm0-4H7v2h2V3zm8 8h-2v2h2v-2zm0-4h-2v2h2V7zm0-4h-2v2h2V3z',
                                symbolSize: 20,
                                itemStyle: {
                                    color: '#667eea'
                                },
                                formType: 'goal',
                                experienceName: exp.experienceName,
                                sessionName: exp.sessionName,
                                completed: true,
                                date: exp.goalForm.date
                            });
                        }
                        
                        if (exp.exitForm.completed) {
                            forms.push({
                                name: 'Exit Form',
                                value: [idx, new Date(exp.exitForm.date).getTime()],
                                symbol: 'path://M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
                                symbolSize: 20,
                                itemStyle: {
                                    color: '#28a745'
                                },
                                formType: 'exit',
                                experienceName: exp.experienceName,
                                sessionName: exp.sessionName,
                                completed: true,
                                date: exp.exitForm.date
                            });
                        }
                    });
                    
                    const option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: (params) => {
                                if (params.seriesName === 'Experiences') {
                                    const start = new Date(params.value[1]).toLocaleDateString();
                                    const end = new Date(params.value[2]).toLocaleDateString();
                                    return `
                                        <strong>${params.name}</strong><br/>
                                        Category: ${params.data.category}<br/>
                                        Session: ${params.data.sessionName}<br/>
                                        Duration: ${start} - ${end}
                                    `;
                                } else if (params.seriesName === 'Activities') {
                                    const date = new Date(params.value[1]).toLocaleDateString();
                                    return `
                                        <strong>${params.name}</strong><br/>
                                        Experience: ${params.data.experienceName}<br/>
                                        Date: ${date}
                                    `;
                                } else if (params.seriesName === 'Forms') {
                                    const date = new Date(params.value[1]).toLocaleDateString();
                                    return `
                                        <strong>${params.name}</strong><br/>
                                        Experience: ${params.data.experienceName}<br/>
                                        Session: ${params.data.sessionName}<br/>
                                        Date: ${date}<br/>
                                        Status: ${params.data.completed ? 'Completed' : 'Pending'}
                                    `;
                                }
                                return params.name;
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '3%',
                            bottom: '10%',
                            top: '5%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'time',
                            axisLabel: {
                                formatter: (value) => {
                                    const date = new Date(value);
                                    return `${date.getMonth() + 1}/${date.getFullYear()}`;
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#e9ecef',
                                    type: 'dashed'
                                }
                            }
                        },
                        yAxis: {
                            type: 'category',
                            data: data.map(exp => exp.sessionName),
                            axisLabel: {
                                interval: 0,
                                fontSize: 11
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#e9ecef'
                                }
                            }
                        },
                        series: [
                            {
                                name: 'Experiences',
                                type: 'custom',
                                renderItem: (params, api) => {
                                    const categoryIndex = api.value(0);
                                    const start = api.coord([api.value(1), categoryIndex]);
                                    const end = api.coord([api.value(2), categoryIndex]);
                                    const height = api.size([0, 1])[1] * 0.6;
                                    
                                    return {
                                        type: 'rect',
                                        shape: {
                                            x: start[0],
                                            y: start[1] - height / 2,
                                            width: end[0] - start[0],
                                            height: height,
                                            r: 4
                                        },
                                        style: api.style()
                                    };
                                },
                                encode: {
                                    x: [1, 2],
                                    y: 0
                                },
                                data: experiences,
                                z: 1
                            },
                            {
                                name: 'Activities',
                                type: 'scatter',
                                data: activities,
                                z: 3
                            },
                            {
                                name: 'Forms',
                                type: 'scatter',
                                data: forms,
                                z: 4
                            }
                        ]
                    };
                    
                    this.chart.setOption(option);
                    
                    // Add click handler for forms
                    this.chart.on('click', (params) => {
                        if (params.seriesName === 'Forms') {
                            this.showFormDetails(params.data);
                        }
                    });
                },
                showFormDetails(formData) {
                    this.modalTitle = `${formData.formType === 'goal' ? 'Goal Setting' : 'Exit'} Form Details`;
                    this.modalData = {
                        type: formData.formType === 'goal' ? 'Goal Setting Form' : 'Exit Form',
                        completed: formData.completed,
                        experience: formData.experienceName,
                        session: formData.sessionName,
                        date: new Date(formData.date).toLocaleDateString(),
                        goals: formData.formType === 'goal' ? '5 learning goals set for this experience' : undefined,
                        progress: formData.formType === 'exit' ? '4 out of 5 goals achieved' : undefined
                    };
                    this.showModal = true;
                },
                closeModal() {
                    this.showModal = false;
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
<template>
    <v-btn @click="exportToCSV">
      Export to CSV
    </v-btn>
  </template>
  
  <script>
  export default {
    name: "ProgressMonitorCSVDownloader",
    props: {
      data: Array,
      fileName: {
        type: String,
        default: 'export.csv'
      }
    },
    methods: {
      exportToCSV() {
        if (!this.data || !this.data.length) {
          return;
        }
  
        // Convert the data to CSV format
        const csvData = this.convertDataToCSV(this.data);
  
        // Create a Blob from the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  
        // Create a link and trigger the download
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', this.fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      convertDataToCSV(data) {
        const csvRows = [];
  
        // Add header
        csvRows.push('Full Name,Email');
  
        // Add rows
        data.forEach(student => {
          csvRows.push(`"${student.firstName} ${student.lastName}",${student.email}`);
        });
  
        // Combine rows and return
        return csvRows.join('\n');
      },
    }
  };
  </script>
  
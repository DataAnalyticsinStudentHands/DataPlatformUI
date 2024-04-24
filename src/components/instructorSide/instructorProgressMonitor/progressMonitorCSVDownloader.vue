<!-- progressMonitorCSVDownloader - this component is a button that allows an export of data to a CSV file for the Progress Monitor -->
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

      // Exports the current data to a CSV file. If there is no data, the function returns without performing any action. The data is converted to CSV format, then a Blob is created from the CSV data. Finally, a link is created and clicked programmatically to trigger the download of the CSV file.
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

      // Converts the provided data array into CSV format. It adds a header row with "Full Name" and "Email" columns, then iterates over each student in the data array, extracting their first name, last name, and email address, and formats them into CSV rows. Finally, it combines all rows into a single CSV string and returns it.
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
  
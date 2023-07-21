<!-- '/instructorReports' -->
<template>
  <div>
    <br>
    <v-btn @click="downloadEntryDataAsCSV">Download Student Entry Forms as CSV</v-btn>
    <br>
    <br>
    <v-btn @click="downloadAllExitDataAsCSV">Download Student Exit Forms as CSV for <b>All</b> Semesters</v-btn>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  methods: {
    async downloadEntryDataAsCSV() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        // Fetch JSON data from the API endpoint
        const response = await axios.get(import.meta.env.VITE_ROOT_API +'/studentSideData/studentInformation/all', { headers: { token } });
        const jsonData = response.data.data;

        // Convert JSON to CSV format
        const csvData = this.convertToCSV(jsonData);

        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading data:', error);
      }
    },

    async downloadAllExitDataAsCSV() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        // Fetch JSON data from the API endpoint
        const response = await axios.get(import.meta.env.VITE_ROOT_API +'/studentSideData/exitForms/all', { headers: { token } });
        const jsonData = response.data;

        // Convert JSON to CSV format
        const csvData = this.convertToCSV(jsonData);

        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading data:', error);
      }
    },

    convertToCSV(jsonData) {
      // Create the CSV header row
      const header = this.getCSVHeader(jsonData[0]);
      const headerRow = header.join(',');

      // Create the CSV data rows
      const dataRows = jsonData.map((item) => {
        const values = this.getCSVRowValues(item, header);
        return values.join(',');
      });

      return [headerRow, ...dataRows].join('\n');
    },

    getCSVHeader(obj, path = '') {
      const header = [];
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const nestedHeader = this.getCSVHeader(obj[key], `${path}${key}.`);
          header.push(...nestedHeader);
        } else {
          header.push(`${path}${key}`);
        }
      });
      return header;
    },

    getCSVRowValues(obj, header) {
      const values = [];
      header.forEach((field) => {
        const pathKeys = field.split('.');
        let value = obj;
        pathKeys.forEach((key) => {
          if (value && value.hasOwnProperty(key)) {
            value = value[key];
          } else {
            value = '';
          }
        });

        // Check if the value is an array and process it accordingly
        if (Array.isArray(value)) {
          value = value.map((item) => (item === null ? '' : item)).join(', ');
        } else {
          // If the value contains commas, enclose it in double quotes
          if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
        }

        values.push(value);
      });
      return values;
    },
  },
};
</script>

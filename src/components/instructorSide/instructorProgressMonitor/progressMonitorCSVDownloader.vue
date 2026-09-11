<!-- progressMonitorCSVDownloader - this component is a button that allows an export of data to a CSV file for the Progress Monitor -->
<template>
  <!-- Export Button -->
    <v-btn @click="exportToCSV">
      Export to CSV
    </v-btn>
  </template>
  
  <script>
  // Default columns - the original "Full Name,Email" export used by every tab that does not pass its own `columns`.
  const DEFAULT_COLUMNS = [
    { header: 'Full Name', value: student => `${student.firstName} ${student.lastName}` },
    { header: 'Email', value: student => student.email },
  ];

  export default {
    name: "ProgressMonitorCSVDownloader",
    props: {
      data: Array,
      fileName: {
        type: String,
        default: 'export.csv'
      },
      // Optional column definitions: [{ header: 'Column Label', value: student => cellValue }, ...].
      // Tabs that omit this get the default Full Name / Email export.
      columns: {
        type: Array,
        default: () => DEFAULT_COLUMNS
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

      // Converts the provided data array into CSV format using the `columns` prop. It adds a header row built from each column's `header`, then iterates over each student in the data array, building one row from each column's `value` accessor. Finally, it combines all rows into a single CSV string and returns it.
      convertDataToCSV(data) {
        const csvRows = [];
  
        // Add header
        csvRows.push(this.columns.map(column => this.formatCsvCell(column.header)).join(','));
  
        // Add rows
        data.forEach(student => {
          csvRows.push(this.columns.map(column => this.formatCsvCell(column.value(student))).join(','));
        });
  
        // Combine rows and return
        return csvRows.join('\n');
      },

      // Formats a single cell value for CSV. Values containing a comma, double quote or line break are wrapped in double quotes with any embedded double quotes doubled (RFC 4180), so a name like "Doe, Jane" cannot split a row.
      formatCsvCell(value) {
        const text = value === null || value === undefined ? '' : String(value);
        if (/[",\r\n]/.test(text)) {
          return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
      },

    }
  };
  </script>

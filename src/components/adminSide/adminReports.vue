<!--'/adminReports'-->
<template>
  <main class="">
    Select a Semester: (drop down menu)
    Graduation Year
    On/off campus
    Honors College Memebership
    Honors College Affiliation
    Majors
    Minors
    HICH Affiliation
    Community Service Experience
    
  </main>
</template>
<style>
    #contentNavbar .nav-link.router-link-exact-active{
        background-color: #eee;
    }
    /* Medium Devices, Desktops */
    @media only screen and (min-width : 992px) {
        main {
            text-align: center;
        }
        #contentNavbar .nav-item {
            border: 3px solid black;
            border-right: none;
        }
        #contentNavbar .nav-item:last-child {
            border: 1px solid black;
        }
    }
</style>

<script>
    export default {
    }
</script>
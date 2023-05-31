<!--'/adminStudentsList'-->
<template>
  <main class="">
      <center>
        <br>
        <p class="font-weight-black text-h6">Students</p>
      <table>
        <tr>
          <th style="padding: 30px; text-align: left;">
             Name
          </th>
          <th style="padding: 30px; text-align: left;">
            Pronouns
          </th>
          <th style="padding: 30px; text-align: left;">
            Triggers
          </th>
        </tr>
        <tr>
          <td style="padding: 30px;">
            Abby Garcia
          </td>
          <td style="padding: 30px;">
            She/her/hers
          </td>
          <td style="padding: 30px;">
            Oranges
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            Lori Vo
          </td>
          <td style="padding: 30px;">
            She/her/hers
          </td>
          <td style="padding: 30px;">
            Thunder
          </td>
        </tr>
      </table>
    </center>
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
<template>
<v-container>

    <v-row>
        <v-col>
            <div class="d-flex justify-center font-weight-black text-h6">
                Sessions
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <v-card>
                
                <v-card-title>
                    <v-row class="d-flex justify-start">
                        <v-col md="6">
                            v-card-title
                        </v-col>
                    </v-row>
                </v-card-title>

                <v-data-table></v-data-table>

            </v-card>
        </v-col>
    </v-row>

</v-container>
</template>

<script>
export default {
    name: 'instructorSessions'
}
</script>

<style scoped>


:deep(.v-text-field input[type="text"]:focus) {
outline: none !important;
box-shadow: none !important;
border: 1px solid transparent !important; /* Update this line if you have a different border style */
background-color: transparent !important;
}


.pointer-cursor {
  cursor: pointer;
}

</style>
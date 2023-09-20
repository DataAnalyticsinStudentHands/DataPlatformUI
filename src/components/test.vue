<template>
    <main>
        <v-container style="width: 90%; margin: 0 auto;">
            <div>
                <h1
                    class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
                >
                    Welcome Philip Eriksson
                </h1>
                <br>
                <div class="mt-10">
                    <v-table
                        fixed-header
                        height="400px"
                    >
                        <thead>
                            <tr>
                                <th class="text-left">Student Name</th>
                                <th class="text-left">Student ID</th>
                                <th class="text-left">Email</th>
                                <th class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="student in students"
                                :key="student.id"
                            >
                                <td>{{ student.name }}</td>
                                <td>{{ student.id }}</td>
                                <td>{{ student.email }}</td>
                                <td>
                                    <v-icon small class="mr-2" @click="sendReminder(student)">
                                        mdi-email
                                    </v-icon>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </div>
        </v-container>
    </main>
</template>

<script>
export default {
    data() {
        return {
            students: [
                { name: 'John Doe', id: 'S12345', email: 'john.doe@example.com' },
                { name: 'Jane Smith', id: 'S12346', email: 'jane.smith@example.com' },
                // ... other mock students ...
                { name: 'Mia Turner', id: 'S12359', email: 'mia.turner@example.com' }
            ]
        };
    },
    methods: {
        sendReminder(student) {
            // Mock function to send a reminder
            console.log(`Send reminder to ${student.name}`);
        }
    }
};
</script>

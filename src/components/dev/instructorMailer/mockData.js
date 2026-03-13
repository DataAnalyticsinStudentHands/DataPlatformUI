export const mockStudentsWithoutEntryForm = [
  { _id: 'stu001', firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', languagePreference: 'English' },
  { _id: 'stu002', firstName: 'Carlos', lastName: 'Martinez', email: 'carlos.martinez@example.com', languagePreference: 'Spanish' },
  { _id: 'stu003', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com', languagePreference: 'English' },
  { _id: 'stu004', firstName: 'James', lastName: 'Williams', email: 'james.williams@example.com', languagePreference: 'English' },
  { _id: 'stu005', firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@example.com', languagePreference: 'Spanish' },
  { _id: 'stu006', firstName: 'David', lastName: 'Kim', email: 'david.kim@example.com', languagePreference: 'English' },
  { _id: 'stu007', firstName: 'Sofia', lastName: 'Rodriguez', email: 'sofia.rodriguez@example.com', languagePreference: 'Spanish' },
  { _id: 'stu008', firstName: 'Ethan', lastName: 'Brown', email: 'ethan.brown@example.com', languagePreference: 'English' },
];

export const mockStudentsWithoutGoalForm = [
  { _id: 'stu101', firstName: 'Olivia', lastName: 'Davis', email: 'olivia.davis@example.com', languagePreference: 'English' },
  { _id: 'stu102', firstName: 'Lucas', lastName: 'Hernandez', email: 'lucas.hernandez@example.com', languagePreference: 'Spanish' },
  { _id: 'stu103', firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@example.com', languagePreference: 'English' },
  { _id: 'stu104', firstName: 'Noah', lastName: 'Lopez', email: 'noah.lopez@example.com', languagePreference: 'Spanish' },
  { _id: 'stu105', firstName: 'Ava', lastName: 'Taylor', email: 'ava.taylor@example.com', languagePreference: 'English' },
  { _id: 'stu106', firstName: 'Liam', lastName: 'Anderson', email: 'liam.anderson@example.com', languagePreference: 'English' },
];

export const mockStudentsWithoutExitForm = [
  { _id: 'stu201', firstName: 'Sophia', lastName: 'Clark', email: 'sophia.clark@example.com', languagePreference: 'English' },
  { _id: 'stu202', firstName: 'Daniel', lastName: 'Rivera', email: 'daniel.rivera@example.com', languagePreference: 'Spanish' },
  { _id: 'stu203', firstName: 'Mia', lastName: 'Thomas', email: 'mia.thomas@example.com', languagePreference: 'English' },
  { _id: 'stu204', firstName: 'Alexander', lastName: 'Morales', email: 'alexander.morales@example.com', languagePreference: 'Spanish' },
  { _id: 'stu205', firstName: 'Charlotte', lastName: 'Lee', email: 'charlotte.lee@example.com', languagePreference: 'English' },
  { _id: 'stu206', firstName: 'Benjamin', lastName: 'Walker', email: 'benjamin.walker@example.com', languagePreference: 'English' },
  { _id: 'stu207', firstName: 'Isabella', lastName: 'Nguyen', email: 'isabella.nguyen@example.com', languagePreference: 'English' },
];

export const mockExperienceInstances = [
  { expInstanceID: 'exp001', sessionName: 'Spring 2026', experienceCategory: 'Service Learning', experienceName: 'Community Health Outreach' },
  { expInstanceID: 'exp002', sessionName: 'Spring 2026', experienceCategory: 'Internship', experienceName: 'Software Engineering Practicum' },
  { expInstanceID: 'exp003', sessionName: 'Fall 2025', experienceCategory: 'Research', experienceName: 'Undergraduate Research Initiative' },
  { expInstanceID: 'exp004', sessionName: 'Spring 2026', experienceCategory: 'Study Abroad', experienceName: 'Global Business Program' },
];

export const mockAutoMailerConfig = {
  entryForm: {
    type: 'entryForm',
    enabled: false,
    firstEmailDays: 7,
    secondEmailDays: 14,
    multilingual: false,
    emailSubject: 'Reminder to Complete Your Entry Form',
    emailSubjectEnglish: 'Reminder to Complete Your Entry Form',
    emailSubjectSpanish: 'Recordatorio para completar su formulario de entrada',
    emailContent: '<p>Dear {{STUDENT_NAME}},</p><p>This is a friendly reminder to complete your Entry Form.</p>',
    emailContentEnglish: '<p>Dear {{STUDENT_NAME}},</p><p>This is a friendly reminder to complete your Entry Form.</p>',
    emailContentSpanish: '<p>Estimado/a {{STUDENT_NAME}},</p><p>Este es un recordatorio para completar su formulario de entrada.</p>',
  },
  goalSettingForm: {
    type: 'goalSettingForm',
    enabled: false,
    firstEmailDays: 7,
    secondEmailDays: 14,
    multilingual: false,
    emailSubject: 'Reminder to Complete Your Goal Setting Form',
    emailSubjectEnglish: 'Reminder to Complete Your Goal Setting Form',
    emailSubjectSpanish: 'Recordatorio para completar su formulario de metas',
    emailContent: '<p>Dear {{STUDENT_NAME}},</p><p>Please complete your Goal Setting Form for {{EXPERIENCE_NAME}}.</p>',
    emailContentEnglish: '<p>Dear {{STUDENT_NAME}},</p><p>Please complete your Goal Setting Form for {{EXPERIENCE_NAME}}.</p>',
    emailContentSpanish: '<p>Estimado/a {{STUDENT_NAME}},</p><p>Por favor complete su formulario de metas para {{EXPERIENCE_NAME}}.</p>',
  },
};

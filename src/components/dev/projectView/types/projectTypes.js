/**
 * src/components/dev/projectView/types/projectTypes.js
 *
 * Data model definitions for dynamic project view templates.
 * Defines structures, defaults, validators, and sample data for both
 * Research (single-author) and Development (multi-author) templates.
 */

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

/**
 * Available template types
 */
export const TEMPLATE_TYPES = {
  RESEARCH: 'research',
  DEVELOPMENT: 'development',
};

/**
 * Finding/Achievement card variants (determines color scheme)
 */
export const FINDING_VARIANTS = {
  CRITICAL: 'critical',   // Red - for alarming/important stats
  DATA: 'data',           // Blue - for data-focused stats
  WARNING: 'warning',     // Yellow/Orange - for cautionary stats
  SUCCESS: 'success',     // Green - for positive achievements
  PURPLE: 'purple',       // Purple - for technical achievements
};

/**
 * Variant color mappings for findings/achievements
 */
export const FINDING_VARIANT_STYLES = {
  [FINDING_VARIANTS.CRITICAL]: {
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    border: '#fecaca',
    statColor: '#b91c1c',
  },
  [FINDING_VARIANTS.DATA]: {
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#bfdbfe',
    statColor: '#1d4ed8',
  },
  [FINDING_VARIANTS.WARNING]: {
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#fde68a',
    statColor: '#b45309',
  },
  [FINDING_VARIANTS.SUCCESS]: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#bbf7d0',
    statColor: '#16a34a',
  },
  [FINDING_VARIANTS.PURPLE]: {
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    border: '#e9d5ff',
    statColor: '#7c3aed',
  },
};

/**
 * Preset colors for partners (user can also pick custom)
 */
export const PARTNER_COLOR_PRESETS = [
  { name: 'Green', value: '#059669' },
  { name: 'Red', value: '#c8102e' },
  { name: 'Teal', value: '#00b5ad' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Amber', value: '#d97706' },
];

/**
 * Preset milestone colors for timeline
 */
export const MILESTONE_COLOR_PRESETS = [
  { name: 'Emerald', value: '#059669' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Amber', value: '#d97706' },
];

/**
 * Common impact icons (emojis)
 */
export const IMPACT_ICON_PRESETS = [
  '👨‍🎓', '👩‍🏫', '🔬', '🎯', '📊', '💡', '🚀', '🌍',
  '🏆', '📈', '🤝', '💻', '📚', '⚡', '🔧', '🎨',
];

// =============================================================================
// TYPE DEFINITIONS (JSDoc for IDE support)
// =============================================================================

/**
 * @typedef {Object} ProjectLabel
 * @property {string} icon - SVG path or icon identifier
 * @property {string} text - Label text (e.g., "Pharis Fellowship")
 */

/**
 * @typedef {Object} Author
 * @property {string} id - Unique identifier
 * @property {string} name - Author's display name
 * @property {string} role - Role/title (e.g., "2023 Pharis Fellow", "Lead Developer")
 * @property {string} quote - Testimonial quote
 * @property {string} avatarUrl - URL to avatar image
 * @property {File|null} avatarFile - Local file for upload (not persisted)
 */

/**
 * @typedef {Object} Finding
 * @property {string} id - Unique identifier
 * @property {string} stat - The statistic/number to display (e.g., "350%", "7+")
 * @property {string} description - Description of the finding
 * @property {string} variant - One of FINDING_VARIANTS
 */

/**
 * @typedef {Object} Partner
 * @property {string} id - Unique identifier
 * @property {string} acronym - Short name (e.g., "EPA", "UH Honors")
 * @property {string} name - Full organization name
 * @property {string} color - Hex color for the icon background
 */

/**
 * @typedef {Object} Milestone
 * @property {string} id - Unique identifier
 * @property {string} title - Milestone title
 * @property {string} description - Brief description
 * @property {string} color - Hex color for the timeline marker
 */

/**
 * @typedef {Object} ImpactItem
 * @property {string} id - Unique identifier
 * @property {string} icon - Emoji or icon character
 * @property {string} label - Short label (e.g., "For Students")
 * @property {string} text - Description text
 */

/**
 * @typedef {Object} Conclusion
 * @property {string} text - The conclusion paragraph
 * @property {string} attribution - Who said it (e.g., "— Carlos Mendieta")
 */

/**
 * @typedef {Object} PosterConfig
 * @property {string} type - 'pdf' or 'image'
 * @property {string} url - URL to the poster file
 * @property {string} title - Title shown above poster (e.g., "Research Poster")
 * @property {File|null} file - Local file for upload (not persisted)
 */

/**
 * @typedef {Object} FooterConfig
 * @property {string} icon - Emoji or icon
 * @property {string} message - Footer message text
 * @property {string} variant - 'info' (yellow), 'notice' (blue), 'success' (green)
 */

// =============================================================================
// BASE PROJECT STRUCTURE (shared fields)
// =============================================================================

/**
 * @typedef {Object} BaseProject
 * @property {string} id - Unique project identifier
 * @property {string} templateType - One of TEMPLATE_TYPES
 * @property {ProjectLabel} label - Hero section label
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {string[]} tags - Array of tag strings
 * @property {Finding[]} findings - Key findings/achievements (max 3)
 * @property {Conclusion} conclusion - Conclusion text and attribution
 * @property {Partner[]} partners - Partner organizations
 * @property {PosterConfig} poster - Poster configuration
 * @property {FooterConfig} footer - Footer banner configuration
 * @property {Object} metadata - Additional metadata
 * @property {string} metadata.createdAt - ISO date string
 * @property {string} metadata.updatedAt - ISO date string
 * @property {string} metadata.createdBy - User ID
 * @property {string} metadata.status - 'draft', 'published', 'archived'
 */

/**
 * @typedef {BaseProject & { author: Author }} ResearchProject
 * Research template with single author
 */

/**
 * @typedef {BaseProject & { authors: Author[], milestones: Milestone[], impactItems: ImpactItem[] }} DevelopmentProject
 * Development template with multiple authors, timeline, and impact section
 */

// =============================================================================
// FACTORY FUNCTIONS - Create Empty/Default Objects
// =============================================================================

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create an empty author object
 * @param {Partial<Author>} overrides - Optional field overrides
 * @returns {Author}
 */
export function createEmptyAuthor(overrides = {}) {
  return {
    id: generateId(),
    name: '',
    role: '',
    quote: '',
    avatarUrl: '',
    avatarFile: null,
    ...overrides,
  };
}

/**
 * Create an empty finding object
 * @param {Partial<Finding>} overrides - Optional field overrides
 * @returns {Finding}
 */
export function createEmptyFinding(overrides = {}) {
  return {
    id: generateId(),
    stat: '',
    description: '',
    variant: FINDING_VARIANTS.DATA,
    ...overrides,
  };
}

/**
 * Create an empty partner object
 * @param {Partial<Partner>} overrides - Optional field overrides
 * @returns {Partner}
 */
export function createEmptyPartner(overrides = {}) {
  return {
    id: generateId(),
    acronym: '',
    name: '',
    color: PARTNER_COLOR_PRESETS[0].value,
    ...overrides,
  };
}

/**
 * Create an empty milestone object
 * @param {Partial<Milestone>} overrides - Optional field overrides
 * @returns {Milestone}
 */
export function createEmptyMilestone(overrides = {}) {
  return {
    id: generateId(),
    title: '',
    description: '',
    color: MILESTONE_COLOR_PRESETS[0].value,
    ...overrides,
  };
}

/**
 * Create an empty impact item object
 * @param {Partial<ImpactItem>} overrides - Optional field overrides
 * @returns {ImpactItem}
 */
export function createEmptyImpactItem(overrides = {}) {
  return {
    id: generateId(),
    icon: '🎯',
    label: '',
    text: '',
    ...overrides,
  };
}

/**
 * Create an empty conclusion object
 * @param {Partial<Conclusion>} overrides - Optional field overrides
 * @returns {Conclusion}
 */
export function createEmptyConclusion(overrides = {}) {
  return {
    text: '',
    attribution: '',
    ...overrides,
  };
}

/**
 * Create an empty poster config
 * @param {'pdf'|'image'} type - Poster type
 * @param {Partial<PosterConfig>} overrides - Optional field overrides
 * @returns {PosterConfig}
 */
export function createEmptyPoster(type = 'pdf', overrides = {}) {
  return {
    type,
    url: '',
    title: type === 'pdf' ? 'Research Poster' : 'System Architecture',
    file: null,
    ...overrides,
  };
}

/**
 * Create an empty footer config
 * @param {Partial<FooterConfig>} overrides - Optional field overrides
 * @returns {FooterConfig}
 */
export function createEmptyFooter(overrides = {}) {
  return {
    icon: 'ℹ️',
    message: 'This project page is publicly viewable via a secure link. The student may revoke access at any time.',
    variant: 'info',
    ...overrides,
  };
}

/**
 * Create an empty label object
 * @param {Partial<ProjectLabel>} overrides - Optional field overrides
 * @returns {ProjectLabel}
 */
export function createEmptyLabel(overrides = {}) {
  return {
    icon: 'layers', // Icon identifier
    text: '',
    ...overrides,
  };
}

/**
 * Create metadata object
 * @param {string} userId - User ID of creator
 * @returns {Object}
 */
export function createMetadata(userId = '') {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    status: 'draft',
  };
}

// =============================================================================
// TEMPLATE FACTORIES - Create Empty Projects
// =============================================================================

/**
 * Create an empty Research project (Template 1 - Single Author)
 * @param {string} userId - User ID of creator
 * @returns {ResearchProject}
 */
export function createEmptyResearchProject(userId = '') {
  return {
    id: generateId(),
    templateType: TEMPLATE_TYPES.RESEARCH,
    label: createEmptyLabel({ text: 'Research Fellowship' }),
    title: '',
    description: '',
    author: createEmptyAuthor(),
    tags: [],
    findings: [
      createEmptyFinding({ variant: FINDING_VARIANTS.CRITICAL }),
      createEmptyFinding({ variant: FINDING_VARIANTS.DATA }),
      createEmptyFinding({ variant: FINDING_VARIANTS.WARNING }),
    ],
    conclusion: createEmptyConclusion(),
    partners: [],
    poster: createEmptyPoster('pdf', { title: 'Research Poster' }),
    footer: createEmptyFooter(),
    metadata: createMetadata(userId),
  };
}

/**
 * Create an empty Development project (Template 2 - Multi Author)
 * @param {string} userId - User ID of creator
 * @returns {DevelopmentProject}
 */
export function createEmptyDevelopmentProject(userId = '') {
  return {
    id: generateId(),
    templateType: TEMPLATE_TYPES.DEVELOPMENT,
    label: createEmptyLabel({ text: 'Project Development' }),
    title: '',
    description: '',
    authors: [createEmptyAuthor()],
    tags: [],
    findings: [
      createEmptyFinding({ variant: FINDING_VARIANTS.SUCCESS }),
      createEmptyFinding({ variant: FINDING_VARIANTS.DATA }),
      createEmptyFinding({ variant: FINDING_VARIANTS.PURPLE }),
    ],
    conclusion: createEmptyConclusion(),
    milestones: [],
    impactItems: [
      createEmptyImpactItem({ icon: '👨‍🎓', label: 'For Students' }),
      createEmptyImpactItem({ icon: '👩‍🏫', label: 'For Instructors' }),
      createEmptyImpactItem({ icon: '🔬', label: 'For Researchers' }),
      createEmptyImpactItem({ icon: '🎯', label: 'For Programs' }),
    ],
    partners: [],
    poster: createEmptyPoster('image', { title: 'System Architecture' }),
    footer: createEmptyFooter({ variant: 'notice' }),
    metadata: createMetadata(userId),
  };
}

/**
 * Create an empty project based on template type
 * @param {string} templateType - One of TEMPLATE_TYPES
 * @param {string} userId - User ID of creator
 * @returns {ResearchProject|DevelopmentProject}
 */
export function createEmptyProject(templateType, userId = '') {
  if (templateType === TEMPLATE_TYPES.DEVELOPMENT) {
    return createEmptyDevelopmentProject(userId);
  }
  return createEmptyResearchProject(userId);
}

// =============================================================================
// SAMPLE DATA - Based on hardcoded templates
// =============================================================================

/**
 * Sample Research Project (Template 1)
 * Based on Carlos Mendieta's Environmental Racism research
 */
export const SAMPLE_RESEARCH_PROJECT = {
  id: 'sample-research-001',
  templateType: TEMPLATE_TYPES.RESEARCH,
  label: {
    icon: 'layers',
    text: 'Pharis Fellowship',
  },
  title: "Tracing the Roots of Environmental Racism in Houston's Fifth Ward",
  description: 'Investigating how industrial sites have been disproportionately placed in less affluent areas, pushing low-income minorities closer to environmentally toxic areas and increasing cancer risk exposure.',
  author: {
    id: 'author-carlos-001',
    name: 'Carlos Mendieta',
    role: '2023 Pharis Fellow',
    quote: '"This project pushed me to think more deeply about how data can drive meaningful decisions."',
    avatarUrl: '@/assets/carlos_headshot.jpg',
    avatarFile: null,
  },
  tags: ['Environmental Justice', 'Cancer Cluster', 'Housing Equity'],
  findings: [
    {
      id: 'finding-001',
      stat: '350%',
      description: 'Higher childhood leukemia cases in Fifth Ward',
      variant: FINDING_VARIANTS.CRITICAL,
    },
    {
      id: 'finding-002',
      stat: '2005–2022',
      description: 'Years of housing data analyzed',
      variant: FINDING_VARIANTS.DATA,
    },
    {
      id: 'finding-003',
      stat: 'Multiple',
      description: 'Industrial sites near residential areas',
      variant: FINDING_VARIANTS.WARNING,
    },
  ],
  conclusion: {
    text: 'The data visualized does provide support to my hypothesis that individuals in Houston that could only afford the cheapest housing accommodations were potentially moved into generally more environmentally toxic areas, posing as cancer and other fatal health risks.',
    attribution: '— Carlos Mendieta',
  },
  partners: [
    { id: 'partner-001', acronym: 'EPA', name: 'Environmental Protection Agency', color: '#059669' },
    { id: 'partner-002', acronym: 'UH Honors', name: 'The Honors College, University of Houston', color: '#c8102e' },
    { id: 'partner-003', acronym: 'Humana', name: 'Humana Institute', color: '#00b5ad' },
    { id: 'partner-004', acronym: 'CHWI', name: 'Community Health Workers Initiative', color: '#2563eb' },
    { id: 'partner-005', acronym: 'HPE DSI', name: 'Hewlett Packard Enterprise Data Science Institute', color: '#7c3aed' },
    { id: 'partner-006', acronym: 'ERC', name: 'Education Research Center, UH College of Education', color: '#ea580c' },
  ],
  poster: {
    type: 'pdf',
    url: '@/assets/carlos_URD_poster.pdf',
    title: 'Research Poster',
    file: null,
  },
  footer: {
    icon: 'ℹ️',
    message: 'This project page is publicly viewable via a secure link. The student may revoke access at any time.',
    variant: 'info',
  },
  metadata: {
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'user-carlos-001',
    status: 'published',
  },
};

/**
 * Sample Development Project (Template 2)
 * Based on Engaged Data Science platform project
 */
export const SAMPLE_DEVELOPMENT_PROJECT = {
  id: 'sample-dev-001',
  templateType: TEMPLATE_TYPES.DEVELOPMENT,
  label: {
    icon: 'layers',
    text: 'Engaged Data Science',
  },
  title: 'Building a Data Platform for Goal-Driven Experiences',
  description: 'Developing a comprehensive web application that captures and connects student goals to their experiential learning journeys, enabling progress tracking, reflections, and actionable insights for instructors and program leaders.',
  authors: [
    {
      id: 'author-philip-001',
      name: 'Philip',
      role: 'Lead Developer',
      quote: '"Building this platform taught me that great software comes from asking better questions—understanding what users actually need."',
      avatarUrl: '@/assets/philip_headshot.jpg',
      avatarFile: null,
    },
    {
      id: 'author-navya-001',
      name: 'Navya',
      role: 'Application Developer',
      quote: '"This was my first exposure to professional software development, learning to build with scalability and maintainability in mind."',
      avatarUrl: '@/assets/navya_headshot.jpg',
      avatarFile: null,
    },
  ],
  tags: ['Educational Technology', 'Experiential Learning', 'Full-Stack Development', 'FERPA-Compliant'],
  findings: [
    {
      id: 'achievement-001',
      stat: '7+',
      description: 'Major releases delivered across the platform',
      variant: FINDING_VARIANTS.SUCCESS,
    },
    {
      id: 'achievement-002',
      stat: 'RBAC',
      description: 'Role-based access control with FERPA compliance',
      variant: FINDING_VARIANTS.DATA,
    },
    {
      id: 'achievement-003',
      stat: 'Cloud',
      description: 'Migrated to scalable Reclaim Cloud infrastructure',
      variant: FINDING_VARIANTS.PURPLE,
    },
  ],
  conclusion: {
    text: 'The platform connects goals to experiences to outcomes through a carefully designed data model. What used to require manual tracking across spreadsheets now flows automatically, giving instructors and program leaders a foundation for improving their experiences.',
    attribution: '— Philip, Lead Developer',
  },
  milestones: [
    {
      id: 'milestone-001',
      title: 'JWT Authentication',
      description: 'Protected all endpoints with token-based auth',
      color: '#059669',
    },
    {
      id: 'milestone-002',
      title: 'Student Forms UI Overhaul',
      description: 'Stepped workflows with auto-save and validation',
      color: '#2563eb',
    },
    {
      id: 'milestone-003',
      title: 'Instructor Tools Suite',
      description: 'Filtering, progress monitor, and export tools',
      color: '#7c3aed',
    },
    {
      id: 'milestone-004',
      title: 'Cloud Migration',
      description: 'Moved to Reclaim Cloud for scalability',
      color: '#ea580c',
    },
    {
      id: 'milestone-005',
      title: 'Security 2.0 & RBAC',
      description: 'FERPA-aligned role-based access control',
      color: '#dc2626',
    },
    {
      id: 'milestone-006',
      title: 'Projects Module',
      description: 'Document management with Clowder integration',
      color: '#0891b2',
    },
  ],
  impactItems: [
    {
      id: 'impact-001',
      icon: '👨‍🎓',
      label: 'For Students',
      text: 'Guided, auto-saving forms that reduce frustration',
    },
    {
      id: 'impact-002',
      icon: '👩‍🏫',
      label: 'For Instructors',
      text: 'Real-time progress monitoring & flexible exports',
    },
    {
      id: 'impact-003',
      icon: '🔬',
      label: 'For Researchers',
      text: 'Clean, structured data with full provenance',
    },
    {
      id: 'impact-004',
      icon: '🎯',
      label: 'For Programs',
      text: 'Foundation for understanding effective learning',
    },
  ],
  partners: [
    { id: 'partner-001', acronym: 'UH Honors', name: 'The Honors College, University of Houston', color: '#2196F3' },
    { id: 'partner-002', acronym: 'HPE DSI', name: 'Hewlett Packard Enterprise Data Science Institute', color: '#9C27B0' },
    { id: 'partner-003', acronym: 'Data & Society', name: 'Data & Society Research Program, UH', color: '#009688' },
    { id: 'partner-004', acronym: 'ERC', name: 'Education Research Center, UH College of Education', color: '#FF9800' },
  ],
  poster: {
    type: 'image',
    url: '@/assets/sample_architecture.png',
    title: 'System Architecture',
    file: null,
  },
  footer: {
    icon: 'ℹ️',
    message: 'This project page is publicly viewable via a secure link. Team members may revoke access at any time.',
    variant: 'notice',
  },
  metadata: {
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-15T16:45:00Z',
    createdBy: 'user-philip-001',
    status: 'published',
  },
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validation error object
 * @typedef {Object} ValidationError
 * @property {string} field - Field path (e.g., 'author.name', 'findings[0].stat')
 * @property {string} message - Error message
 */

/**
 * Validate a string field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Human-readable field name
 * @param {Object} options - Validation options
 * @param {boolean} options.required - Is field required
 * @param {number} options.minLength - Minimum length
 * @param {number} options.maxLength - Maximum length
 * @returns {string|null} Error message or null if valid
 */
export function validateString(value, fieldName, options = {}) {
  const { required = false, minLength = 0, maxLength = Infinity } = options;

  if (required && (!value || value.trim() === '')) {
    return `${fieldName} is required`;
  }

  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  if (value && value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }

  return null;
}

/**
 * Validate an array field
 * @param {Array} value - Array to validate
 * @param {string} fieldName - Human-readable field name
 * @param {Object} options - Validation options
 * @param {number} options.minItems - Minimum items
 * @param {number} options.maxItems - Maximum items
 * @returns {string|null} Error message or null if valid
 */
export function validateArray(value, fieldName, options = {}) {
  const { minItems = 0, maxItems = Infinity } = options;

  if (!Array.isArray(value)) {
    return `${fieldName} must be an array`;
  }

  if (value.length < minItems) {
    return `${fieldName} must have at least ${minItems} item(s)`;
  }

  if (value.length > maxItems) {
    return `${fieldName} must have no more than ${maxItems} item(s)`;
  }

  return null;
}

/**
 * Validate an author object
 * @param {Author} author - Author to validate
 * @param {string} prefix - Field path prefix
 * @returns {ValidationError[]} Array of errors
 */
export function validateAuthor(author, prefix = 'author') {
  const errors = [];

  const nameError = validateString(author.name, 'Name', { required: true, maxLength: 100 });
  if (nameError) errors.push({ field: `${prefix}.name`, message: nameError });

  const roleError = validateString(author.role, 'Role', { required: true, maxLength: 100 });
  if (roleError) errors.push({ field: `${prefix}.role`, message: roleError });

  const quoteError = validateString(author.quote, 'Quote', { maxLength: 500 });
  if (quoteError) errors.push({ field: `${prefix}.quote`, message: quoteError });

  return errors;
}

/**
 * Validate a finding object
 * @param {Finding} finding - Finding to validate
 * @param {string} prefix - Field path prefix
 * @returns {ValidationError[]} Array of errors
 */
export function validateFinding(finding, prefix = 'finding') {
  const errors = [];

  const statError = validateString(finding.stat, 'Statistic', { required: true, maxLength: 50 });
  if (statError) errors.push({ field: `${prefix}.stat`, message: statError });

  const descError = validateString(finding.description, 'Description', { required: true, maxLength: 200 });
  if (descError) errors.push({ field: `${prefix}.description`, message: descError });

  if (!Object.values(FINDING_VARIANTS).includes(finding.variant)) {
    errors.push({ field: `${prefix}.variant`, message: 'Invalid variant' });
  }

  return errors;
}

/**
 * Validate a partner object
 * @param {Partner} partner - Partner to validate
 * @param {string} prefix - Field path prefix
 * @returns {ValidationError[]} Array of errors
 */
export function validatePartner(partner, prefix = 'partner') {
  const errors = [];

  const acronymError = validateString(partner.acronym, 'Acronym', { required: true, maxLength: 20 });
  if (acronymError) errors.push({ field: `${prefix}.acronym`, message: acronymError });

  const nameError = validateString(partner.name, 'Organization Name', { required: true, maxLength: 150 });
  if (nameError) errors.push({ field: `${prefix}.name`, message: nameError });

  // Validate hex color
  if (!/^#[0-9A-Fa-f]{6}$/.test(partner.color)) {
    errors.push({ field: `${prefix}.color`, message: 'Invalid color format' });
  }

  return errors;
}

/**
 * Validate a milestone object
 * @param {Milestone} milestone - Milestone to validate
 * @param {string} prefix - Field path prefix
 * @returns {ValidationError[]} Array of errors
 */
export function validateMilestone(milestone, prefix = 'milestone') {
  const errors = [];

  const titleError = validateString(milestone.title, 'Title', { required: true, maxLength: 100 });
  if (titleError) errors.push({ field: `${prefix}.title`, message: titleError });

  const descError = validateString(milestone.description, 'Description', { required: true, maxLength: 200 });
  if (descError) errors.push({ field: `${prefix}.description`, message: descError });

  if (!/^#[0-9A-Fa-f]{6}$/.test(milestone.color)) {
    errors.push({ field: `${prefix}.color`, message: 'Invalid color format' });
  }

  return errors;
}

/**
 * Validate an impact item object
 * @param {ImpactItem} item - Impact item to validate
 * @param {string} prefix - Field path prefix
 * @returns {ValidationError[]} Array of errors
 */
export function validateImpactItem(item, prefix = 'impactItem') {
  const errors = [];

  const iconError = validateString(item.icon, 'Icon', { required: true, maxLength: 10 });
  if (iconError) errors.push({ field: `${prefix}.icon`, message: iconError });

  const labelError = validateString(item.label, 'Label', { required: true, maxLength: 50 });
  if (labelError) errors.push({ field: `${prefix}.label`, message: labelError });

  const textError = validateString(item.text, 'Description', { required: true, maxLength: 200 });
  if (textError) errors.push({ field: `${prefix}.text`, message: textError });

  return errors;
}

/**
 * Validate a complete Research project
 * @param {ResearchProject} project - Project to validate
 * @returns {ValidationError[]} Array of errors
 */
export function validateResearchProject(project) {
  const errors = [];

  // Basic fields
  const titleError = validateString(project.title, 'Project Title', { required: true, maxLength: 200 });
  if (titleError) errors.push({ field: 'title', message: titleError });

  const descError = validateString(project.description, 'Description', { required: true, maxLength: 1000 });
  if (descError) errors.push({ field: 'description', message: descError });

  const labelError = validateString(project.label?.text, 'Label', { required: true, maxLength: 50 });
  if (labelError) errors.push({ field: 'label.text', message: labelError });

  // Author
  errors.push(...validateAuthor(project.author, 'author'));

  // Tags
  const tagsError = validateArray(project.tags, 'Tags', { minItems: 1, maxItems: 10 });
  if (tagsError) errors.push({ field: 'tags', message: tagsError });

  // Findings
  const findingsError = validateArray(project.findings, 'Key Findings', { minItems: 1, maxItems: 3 });
  if (findingsError) {
    errors.push({ field: 'findings', message: findingsError });
  } else {
    project.findings.forEach((finding, index) => {
      errors.push(...validateFinding(finding, `findings[${index}]`));
    });
  }

  // Conclusion
  const conclusionError = validateString(project.conclusion?.text, 'Conclusion', { required: true, maxLength: 1000 });
  if (conclusionError) errors.push({ field: 'conclusion.text', message: conclusionError });

  // Partners (optional but validate if present)
  if (project.partners?.length > 0) {
    project.partners.forEach((partner, index) => {
      errors.push(...validatePartner(partner, `partners[${index}]`));
    });
  }

  return errors;
}

/**
 * Validate a complete Development project
 * @param {DevelopmentProject} project - Project to validate
 * @returns {ValidationError[]} Array of errors
 */
export function validateDevelopmentProject(project) {
  const errors = [];

  // Basic fields
  const titleError = validateString(project.title, 'Project Title', { required: true, maxLength: 200 });
  if (titleError) errors.push({ field: 'title', message: titleError });

  const descError = validateString(project.description, 'Description', { required: true, maxLength: 1000 });
  if (descError) errors.push({ field: 'description', message: descError });

  const labelError = validateString(project.label?.text, 'Label', { required: true, maxLength: 50 });
  if (labelError) errors.push({ field: 'label.text', message: labelError });

  // Authors
  const authorsError = validateArray(project.authors, 'Team Members', { minItems: 1, maxItems: 6 });
  if (authorsError) {
    errors.push({ field: 'authors', message: authorsError });
  } else {
    project.authors.forEach((author, index) => {
      errors.push(...validateAuthor(author, `authors[${index}]`));
    });
  }

  // Tags
  const tagsError = validateArray(project.tags, 'Tags', { minItems: 1, maxItems: 10 });
  if (tagsError) errors.push({ field: 'tags', message: tagsError });

  // Findings/Achievements
  const findingsError = validateArray(project.findings, 'Key Achievements', { minItems: 1, maxItems: 3 });
  if (findingsError) {
    errors.push({ field: 'findings', message: findingsError });
  } else {
    project.findings.forEach((finding, index) => {
      errors.push(...validateFinding(finding, `findings[${index}]`));
    });
  }

  // Conclusion
  const conclusionError = validateString(project.conclusion?.text, 'Conclusion', { required: true, maxLength: 1000 });
  if (conclusionError) errors.push({ field: 'conclusion.text', message: conclusionError });

  // Milestones (optional but validate if present)
  if (project.milestones?.length > 0) {
    project.milestones.forEach((milestone, index) => {
      errors.push(...validateMilestone(milestone, `milestones[${index}]`));
    });
  }

  // Impact Items
  const impactError = validateArray(project.impactItems, 'Impact Items', { minItems: 1, maxItems: 6 });
  if (impactError) {
    errors.push({ field: 'impactItems', message: impactError });
  } else {
    project.impactItems.forEach((item, index) => {
      errors.push(...validateImpactItem(item, `impactItems[${index}]`));
    });
  }

  // Partners (optional but validate if present)
  if (project.partners?.length > 0) {
    project.partners.forEach((partner, index) => {
      errors.push(...validatePartner(partner, `partners[${index}]`));
    });
  }

  return errors;
}

/**
 * Validate any project based on its template type
 * @param {ResearchProject|DevelopmentProject} project - Project to validate
 * @returns {ValidationError[]} Array of errors
 */
export function validateProject(project) {
  if (project.templateType === TEMPLATE_TYPES.DEVELOPMENT) {
    return validateDevelopmentProject(project);
  }
  return validateResearchProject(project);
}

/**
 * Check if a project is valid (has no validation errors)
 * @param {ResearchProject|DevelopmentProject} project - Project to validate
 * @returns {boolean}
 */
export function isProjectValid(project) {
  return validateProject(project).length === 0;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Deep clone a project object
 * @param {ResearchProject|DevelopmentProject} project - Project to clone
 * @returns {ResearchProject|DevelopmentProject}
 */
export function cloneProject(project) {
  return JSON.parse(JSON.stringify(project));
}

/**
 * Get template display info
 * @param {string} templateType - One of TEMPLATE_TYPES
 * @returns {Object} Template metadata
 */
export function getTemplateInfo(templateType) {
  const templates = {
    [TEMPLATE_TYPES.RESEARCH]: {
      id: TEMPLATE_TYPES.RESEARCH,
      name: 'Research Fellowship',
      description: 'Single author layout with PDF poster. Ideal for research projects, fellowships, and individual academic work.',
      features: ['Single author with testimonial', 'PDF poster with zoom', 'Key findings display', 'Partner organizations'],
      thumbnail: '/thumbnails/research-template.png',
    },
    [TEMPLATE_TYPES.DEVELOPMENT]: {
      id: TEMPLATE_TYPES.DEVELOPMENT,
      name: 'Team Development',
      description: 'Multi-author layout with timeline and impact sections. Ideal for software projects, team collaborations, and development work.',
      features: ['Multiple team members', 'Development timeline', 'Impact summary grid', 'Image/diagram poster'],
      thumbnail: '/thumbnails/development-template.png',
    },
  };

  return templates[templateType] || templates[TEMPLATE_TYPES.RESEARCH];
}

/**
 * Get all available templates
 * @returns {Object[]} Array of template info objects
 */
export function getAllTemplates() {
  return Object.values(TEMPLATE_TYPES).map(getTemplateInfo);
}

/**
 * Convert project to API-safe format (remove File objects)
 * @param {ResearchProject|DevelopmentProject} project - Project to convert
 * @returns {Object} API-safe project object
 */
export function projectToApiFormat(project) {
  const clone = cloneProject(project);

  // Remove File objects from author(s)
  if (clone.author) {
    delete clone.author.avatarFile;
  }
  if (clone.authors) {
    clone.authors.forEach(author => {
      delete author.avatarFile;
    });
  }

  // Remove File object from poster
  if (clone.poster) {
    delete clone.poster.file;
  }

  return clone;
}

/**
 * Merge partial project data with defaults
 * @param {Partial<ResearchProject|DevelopmentProject>} partial - Partial project data
 * @param {string} templateType - Template type for defaults
 * @returns {ResearchProject|DevelopmentProject}
 */
export function mergeWithDefaults(partial, templateType) {
  const defaults = createEmptyProject(templateType);
  return {
    ...defaults,
    ...partial,
    label: { ...defaults.label, ...partial.label },
    conclusion: { ...defaults.conclusion, ...partial.conclusion },
    poster: { ...defaults.poster, ...partial.poster },
    footer: { ...defaults.footer, ...partial.footer },
    metadata: { ...defaults.metadata, ...partial.metadata },
  };
}

// =============================================================================
// FORM FIELD CONFIGURATIONS
// =============================================================================

/**
 * Field configuration for form generation
 */
export const FORM_FIELD_CONFIG = {
  title: {
    label: 'Project Title',
    placeholder: 'Enter your project title',
    maxLength: 200,
    required: true,
    helpText: 'A clear, descriptive title for your project',
  },
  description: {
    label: 'Project Description',
    placeholder: 'Describe your project, its goals, and significance',
    maxLength: 1000,
    required: true,
    rows: 4,
    helpText: 'Provide context about your project for viewers',
  },
  labelText: {
    label: 'Category Label',
    placeholder: 'e.g., Pharis Fellowship, Engaged Data Science',
    maxLength: 50,
    required: true,
    helpText: 'A short label that appears above the title',
  },
  authorName: {
    label: 'Name',
    placeholder: 'Your full name',
    maxLength: 100,
    required: true,
  },
  authorRole: {
    label: 'Role/Title',
    placeholder: 'e.g., 2023 Pharis Fellow, Lead Developer',
    maxLength: 100,
    required: true,
  },
  authorQuote: {
    label: 'Testimonial Quote',
    placeholder: '"Share what you learned or how this project impacted you..."',
    maxLength: 500,
    required: false,
    rows: 3,
  },
  findingStat: {
    label: 'Statistic',
    placeholder: 'e.g., 350%, 7+, RBAC',
    maxLength: 50,
    required: true,
  },
  findingDescription: {
    label: 'Description',
    placeholder: 'Brief explanation of this finding',
    maxLength: 200,
    required: true,
  },
  conclusionText: {
    label: 'Conclusion',
    placeholder: 'Summarize the key takeaways and impact of your project',
    maxLength: 1000,
    required: true,
    rows: 4,
  },
  conclusionAttribution: {
    label: 'Attribution',
    placeholder: '— Your Name',
    maxLength: 100,
    required: false,
  },
  partnerAcronym: {
    label: 'Acronym',
    placeholder: 'e.g., EPA, UH',
    maxLength: 20,
    required: true,
  },
  partnerName: {
    label: 'Full Name',
    placeholder: 'Full organization name',
    maxLength: 150,
    required: true,
  },
  milestoneTitle: {
    label: 'Milestone Title',
    placeholder: 'e.g., JWT Authentication',
    maxLength: 100,
    required: true,
  },
  milestoneDescription: {
    label: 'Description',
    placeholder: 'Brief description of this milestone',
    maxLength: 200,
    required: true,
  },
  impactLabel: {
    label: 'Label',
    placeholder: 'e.g., For Students',
    maxLength: 50,
    required: true,
  },
  impactText: {
    label: 'Description',
    placeholder: 'Describe the impact',
    maxLength: 200,
    required: true,
  },
  tag: {
    label: 'Add Tag',
    placeholder: 'Enter a tag and press Enter',
    maxLength: 50,
  },
};

export default {
  // Constants
  TEMPLATE_TYPES,
  FINDING_VARIANTS,
  FINDING_VARIANT_STYLES,
  PARTNER_COLOR_PRESETS,
  MILESTONE_COLOR_PRESETS,
  IMPACT_ICON_PRESETS,
  FORM_FIELD_CONFIG,

  // Factory functions
  generateId,
  createEmptyAuthor,
  createEmptyFinding,
  createEmptyPartner,
  createEmptyMilestone,
  createEmptyImpactItem,
  createEmptyConclusion,
  createEmptyPoster,
  createEmptyFooter,
  createEmptyLabel,
  createMetadata,
  createEmptyResearchProject,
  createEmptyDevelopmentProject,
  createEmptyProject,

  // Sample data
  SAMPLE_RESEARCH_PROJECT,
  SAMPLE_DEVELOPMENT_PROJECT,

  // Validation
  validateString,
  validateArray,
  validateAuthor,
  validateFinding,
  validatePartner,
  validateMilestone,
  validateImpactItem,
  validateResearchProject,
  validateDevelopmentProject,
  validateProject,
  isProjectValid,

  // Utilities
  cloneProject,
  getTemplateInfo,
  getAllTemplates,
  projectToApiFormat,
  mergeWithDefaults,
};
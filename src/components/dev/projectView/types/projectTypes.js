/**
 * src/components/dev/projectView/types/projectTypes.js
 *
 * Unified data model for modular project view.
 * Supports configurable sections with consistent data structure.
 */

import {
  DEFAULT_ENABLED_SECTIONS,
  getOptionalSections,
  isSectionEnabled
} from './sectionTypes.js';

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

/**
 * Project template types
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
 * Preset colors for partners
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
 * Preset colors for tags
 */
export const TAG_COLOR_PRESETS = [
  { name: 'Indigo', value: '#4338ca' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Green', value: '#059669' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Slate', value: '#475569' },
];

/**
 * Preset colors for findings/achievements
 */
export const FINDING_COLOR_PRESETS = [
  { name: 'Red', value: '#b91c1c' },
  { name: 'Blue', value: '#1d4ed8' },
  { name: 'Amber', value: '#b45309' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Slate', value: '#475569' },
];

/**
 * Common impact icons (emojis)
 */
export const IMPACT_ICON_PRESETS = [
  '👨‍🎓', '👩‍🏫', '🔬', '🎯', '📊', '💡', '🚀', '🌍',
  '🏆', '📈', '🤝', '💻', '📚', '⚡', '🔧', '🎨',
];

/**
 * Footer banner variants
 */
export const FOOTER_VARIANTS = {
  INFO: 'info',       // Yellow
  NOTICE: 'notice',   // Blue
  SUCCESS: 'success', // Green
};

// =============================================================================
// TYPE DEFINITIONS (JSDoc for IDE support)
// =============================================================================

/**
 * @typedef {Object} ProjectLabel
 * @property {string} icon - Icon identifier (e.g., 'layers')
 * @property {string} text - Label text (e.g., "Pharis Fellowship")
 */

/**
 * @typedef {Object} Author
 * @property {string} id - Unique identifier
 * @property {string} name - Author's display name
 * @property {string} role - Role/title
 * @property {string} quote - Testimonial quote
 * @property {string} avatarUrl - URL to avatar image
 * @property {File|null} avatarFile - Local file for upload (not persisted)
 */

/**
 * @typedef {Object} Finding
 * @property {string} id - Unique identifier
 * @property {string} stat - The statistic/number to display
 * @property {string} description - Description of the finding
 * @property {string} color - Hex color for the finding card
 */

/**
 * @typedef {Object} Conclusion
 * @property {string} text - The conclusion paragraph
 * @property {string} attribution - Who said it
 */

/**
 * @typedef {Object} Partner
 * @property {string} id - Unique identifier
 * @property {string} acronym - Short name
 * @property {string} name - Full organization name
 * @property {string} color - Hex color for the badge
 */

/**
 * @typedef {Object} Milestone
 * @property {string} id - Unique identifier
 * @property {string} title - Milestone title
 * @property {string} description - Brief description
 * @property {string} color - Hex color for the marker
 */

/**
 * @typedef {Object} Tag
 * @property {string} id - Unique identifier
 * @property {string} text - Tag text
 * @property {string} color - Hex color for the tag
 */

/**
 * @typedef {Object} ImpactItem
 * @property {string} id - Unique identifier
 * @property {string} icon - Emoji or icon character
 * @property {string} label - Short label
 * @property {string} text - Description text
 */

/**
 * @typedef {Object} PosterConfig
 * @property {string} type - 'pdf' or 'image'
 * @property {string} url - URL to the poster file
 * @property {string} title - Title shown above poster
 * @property {File|null} file - Local file for upload (not persisted)
 */

/**
 * @typedef {Object} FooterConfig
 * @property {string} icon - Emoji or icon
 * @property {string} message - Footer message text
 * @property {string} variant - 'info', 'notice', or 'success'
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique project identifier
 * @property {ProjectLabel} label - Hero section label
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {Author[]} authors - Array of authors (min 1)
 * @property {string[]} tags - Array of tag strings
 * @property {Finding[]} findings - Key findings (1-3)
 * @property {Conclusion} conclusion - Conclusion text
 * @property {Partner[]} partners - Partner organizations
 * @property {Milestone[]} milestones - Timeline milestones
 * @property {ImpactItem[]} impactItems - Impact summary items
 * @property {PosterConfig|null} poster - Poster configuration
 * @property {FooterConfig} footer - Footer banner
 * @property {string[]} enabledSections - IDs of enabled optional sections
 * @property {Object} metadata - Project metadata
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
 * @param {Partial<Author>} overrides
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
 * @param {Partial<Finding>} overrides
 * @returns {Finding}
 */
export function createEmptyFinding(overrides = {}) {
  return {
    id: generateId(),
    stat: '',
    description: '',
    color: FINDING_COLOR_PRESETS[0].value,
    ...overrides,
  };
}

/**
 * Create an empty partner object
 * @param {Partial<Partner>} overrides
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
 * @param {Partial<Milestone>} overrides
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
 * Create an empty tag object
 * @param {Partial<Tag>} overrides
 * @returns {Tag}
 */
export function createEmptyTag(overrides = {}) {
  return {
    id: generateId(),
    text: '',
    color: TAG_COLOR_PRESETS[0].value,
    ...overrides,
  };
}

/**
 * Create an empty impact item object
 * @param {Partial<ImpactItem>} overrides
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
 * @param {Partial<Conclusion>} overrides
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
 * @param {'pdf'|'image'} type
 * @param {Partial<PosterConfig>} overrides
 * @returns {PosterConfig}
 */
export function createEmptyPoster(type = 'pdf', overrides = {}) {
  return {
    type,
    url: '',
    title: type === 'pdf' ? 'Research Poster' : 'Project Diagram',
    file: null,
    ...overrides,
  };
}

/**
 * Create a default footer config
 * @param {Partial<FooterConfig>} overrides
 * @returns {FooterConfig}
 */
export function createDefaultFooter(overrides = {}) {
  return {
    icon: 'ℹ️',
    message: 'This project page is publicly viewable via a secure link. The author(s) may revoke access at any time.',
    variant: FOOTER_VARIANTS.INFO,
    ...overrides,
  };
}

/**
 * Create an empty label object
 * @param {Partial<ProjectLabel>} overrides
 * @returns {ProjectLabel}
 */
export function createEmptyLabel(overrides = {}) {
  return {
    icon: 'layers',
    text: '',
    ...overrides,
  };
}

/**
 * Create metadata object
 * @param {string} userId
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
// PROJECT FACTORY - Unified Project Creation
// =============================================================================

/**
 * Create an empty project with the unified structure
 * @param {string} userId - User ID of creator
 * @param {string[]} enabledSections - Initial enabled optional sections
 * @returns {Project}
 */
export function createEmptyProject(userId = '', enabledSections = DEFAULT_ENABLED_SECTIONS) {
  return {
    id: generateId(),

    // === MANDATORY SECTION DATA ===
    label: createEmptyLabel({ text: 'Project' }),
    title: '',
    description: '',
    authors: [createEmptyAuthor()],
    tags: [],
    findings: [
      createEmptyFinding({ color: FINDING_COLOR_PRESETS[1].value }),
    ],
    conclusion: createEmptyConclusion(),
    footer: createDefaultFooter(),

    // === OPTIONAL SECTION DATA ===
    partners: [],
    milestones: [],
    impactItems: [],
    poster: null, // null when poster section is disabled

    // === SECTION CONFIGURATION ===
    enabledSections: [...enabledSections],

    // === METADATA ===
    metadata: createMetadata(userId),
  };
}

/**
 * Initialize data for a newly enabled section
 * @param {Project} project - Current project
 * @param {string} sectionId - Section being enabled
 * @returns {Project} Updated project with initialized section data
 */
export function initializeSectionData(project, sectionId) {
  const updated = cloneProject(project);

  switch (sectionId) {
    case 'partners':
      if (updated.partners.length === 0) {
        updated.partners = [createEmptyPartner()];
      }
      break;
    case 'timeline':
      if (updated.milestones.length === 0) {
        updated.milestones = [
          createEmptyMilestone(),
          createEmptyMilestone(),
        ];
      }
      break;
    case 'impact':
      if (updated.impactItems.length === 0) {
        updated.impactItems = [
          createEmptyImpactItem({ icon: '👨‍🎓', label: 'For Students' }),
          createEmptyImpactItem({ icon: '👩‍🏫', label: 'For Instructors' }),
        ];
      }
      break;
    case 'poster':
      if (!updated.poster) {
        updated.poster = createEmptyPoster('pdf');
      }
      break;
  }

  return updated;
}

/**
 * Clear data for a disabled section (optional - keeps data by default)
 * @param {Project} project - Current project
 * @param {string} sectionId - Section being disabled
 * @param {boolean} clearData - Whether to clear the data
 * @returns {Project} Updated project
 */
export function clearSectionData(project, sectionId, clearData = false) {
  if (!clearData) return project;

  const updated = cloneProject(project);

  switch (sectionId) {
    case 'partners':
      updated.partners = [];
      break;
    case 'timeline':
      updated.milestones = [];
      break;
    case 'impact':
      updated.impactItems = [];
      break;
    case 'poster':
      updated.poster = null;
      break;
  }

  return updated;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

/**
 * Sample project with all sections populated
 * Useful for preview and testing
 */
export const SAMPLE_PROJECT = {
  id: 'sample-project-001',
  label: {
    icon: 'layers',
    text: 'Research Fellowship',
  },
  title: "Tracing the Roots of Environmental Racism in Houston's Fifth Ward",
  description: 'Investigating how industrial sites have been disproportionately placed in less affluent areas, pushing low-income minorities closer to environmentally toxic areas and increasing cancer risk exposure.',
  authors: [
    {
      id: 'author-001',
      name: 'Carlos Mendieta',
      role: '2023 Pharis Fellow',
      quote: '"This project pushed me to think more deeply about how data can drive meaningful decisions."',
      avatarUrl: '',
      avatarFile: null,
    },
  ],
  tags: [
    { id: 'tag-001', text: 'Environmental Justice', color: '#4338ca' },
    { id: 'tag-002', text: 'Cancer Cluster', color: '#dc2626' },
    { id: 'tag-003', text: 'Housing Equity', color: '#059669' },
  ],
  findings: [
    {
      id: 'finding-001',
      stat: '350%',
      description: 'Higher childhood leukemia cases in Fifth Ward',
      color: '#b91c1c',
    },
    {
      id: 'finding-002',
      stat: '2005–2022',
      description: 'Years of housing data analyzed',
      color: '#1d4ed8',
    },
    {
      id: 'finding-003',
      stat: 'Multiple',
      description: 'Industrial sites near residential areas',
      color: '#b45309',
    },
  ],
  conclusion: {
    text: 'The data visualized does provide support to my hypothesis that individuals in Houston that could only afford the cheapest housing accommodations were potentially moved into generally more environmentally toxic areas.',
    attribution: '— Carlos Mendieta',
  },
  partners: [
    { id: 'partner-001', acronym: 'EPA', name: 'Environmental Protection Agency', color: '#059669' },
    { id: 'partner-002', acronym: 'UH Honors', name: 'The Honors College, University of Houston', color: '#c8102e' },
    { id: 'partner-003', acronym: 'HPE DSI', name: 'Hewlett Packard Enterprise Data Science Institute', color: '#7c3aed' },
  ],
  milestones: [
    { id: 'milestone-001', title: 'Data Collection', description: 'Gathered housing and health data', color: '#059669' },
    { id: 'milestone-002', title: 'Analysis Phase', description: 'Statistical analysis of correlations', color: '#2563eb' },
    { id: 'milestone-003', title: 'Visualization', description: 'Created interactive maps', color: '#7c3aed' },
    { id: 'milestone-004', title: 'Publication', description: 'Presented findings at URD', color: '#ea580c' },
  ],
  impactItems: [
    { id: 'impact-001', icon: '👨‍🎓', label: 'For Students', text: 'Hands-on research experience with real-world data' },
    { id: 'impact-002', icon: '🏘️', label: 'For Communities', text: 'Evidence for environmental justice advocacy' },
    { id: 'impact-003', icon: '📊', label: 'For Researchers', text: 'Methodology for analyzing environmental inequity' },
    { id: 'impact-004', icon: '🏛️', label: 'For Policymakers', text: 'Data-driven insights for zoning decisions' },
  ],
  poster: {
    type: 'pdf',
    url: '',
    title: 'Research Poster',
    file: null,
  },
  footer: {
    icon: 'ℹ️',
    message: 'This project page is publicly viewable via a secure link. The author(s) may revoke access at any time.',
    variant: 'info',
  },
  enabledSections: ['partners', 'timeline', 'impact', 'poster'],
  metadata: {
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'user-001',
    status: 'published',
  },
};

/**
 * Alias for research-type sample project
 */
export const SAMPLE_RESEARCH_PROJECT = SAMPLE_PROJECT;

/**
 * Alias for development-type sample project (same structure)
 */
export const SAMPLE_DEVELOPMENT_PROJECT = {
  ...SAMPLE_PROJECT,
  id: 'sample-development-001',
  label: {
    icon: 'code',
    text: 'Development Project',
  },
  title: 'Building a Scalable Data Pipeline for Real-Time Analytics',
  description: 'Designed and implemented a high-throughput data processing system capable of ingesting, transforming, and serving analytics data in real-time.',
  authors: [
    {
      id: 'author-dev-001',
      name: 'Jordan Chen',
      role: 'Lead Developer',
      quote: '"Building systems that scale taught me the importance of architecture decisions early in the process."',
      avatarUrl: '',
      avatarFile: null,
    },
  ],
  tags: [
    { id: 'tag-dev-001', text: 'Data Engineering', color: '#2563eb' },
    { id: 'tag-dev-002', text: 'Real-Time Processing', color: '#7c3aed' },
    { id: 'tag-dev-003', text: 'Cloud Infrastructure', color: '#0d9488' },
  ],
  findings: [
    {
      id: 'finding-dev-001',
      stat: '10K+',
      description: 'Events processed per second',
      color: '#16a34a',
    },
    {
      id: 'finding-dev-002',
      stat: '<100ms',
      description: 'End-to-end latency achieved',
      color: '#1d4ed8',
    },
    {
      id: 'finding-dev-003',
      stat: '99.9%',
      description: 'System uptime maintained',
      color: '#7c3aed',
    },
  ],
  conclusion: {
    text: 'The implementation demonstrates that with careful architecture and modern tooling, it is possible to build cost-effective real-time data pipelines that meet enterprise-grade reliability requirements.',
    attribution: '— Jordan Chen',
  },
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * @typedef {Object} ValidationError
 * @property {string} field - Field path
 * @property {string} message - Error message
 */

/**
 * Validate a string field
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
 */
export function validateFinding(finding, prefix = 'finding') {
  const errors = [];

  const statError = validateString(finding.stat, 'Statistic', { required: true, maxLength: 50 });
  if (statError) errors.push({ field: `${prefix}.stat`, message: statError });

  const descError = validateString(finding.description, 'Description', { required: true, maxLength: 200 });
  if (descError) errors.push({ field: `${prefix}.description`, message: descError });

  if (!/^#[0-9A-Fa-f]{6}$/.test(finding.color)) {
    errors.push({ field: `${prefix}.color`, message: 'Invalid color format' });
  }

  return errors;
}

/**
 * Validate a partner object
 */
export function validatePartner(partner, prefix = 'partner') {
  const errors = [];

  const acronymError = validateString(partner.acronym, 'Acronym', { required: true, maxLength: 20 });
  if (acronymError) errors.push({ field: `${prefix}.acronym`, message: acronymError });

  const nameError = validateString(partner.name, 'Organization Name', { required: true, maxLength: 150 });
  if (nameError) errors.push({ field: `${prefix}.name`, message: nameError });

  if (!/^#[0-9A-Fa-f]{6}$/.test(partner.color)) {
    errors.push({ field: `${prefix}.color`, message: 'Invalid color format' });
  }

  return errors;
}

/**
 * Validate a milestone object
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
 * Validate a tag object
 */
export function validateTag(tag, prefix = 'tag') {
  const errors = [];

  const textError = validateString(tag.text, 'Tag text', { required: true, maxLength: 50 });
  if (textError) errors.push({ field: `${prefix}.text`, message: textError });

  if (!/^#[0-9A-Fa-f]{6}$/.test(tag.color)) {
    errors.push({ field: `${prefix}.color`, message: 'Invalid color format' });
  }

  return errors;
}

/**
 * Validate an impact item object
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
 * Validate a complete project
 * @param {Project} project - Project to validate
 * @returns {ValidationError[]} Array of errors
 */
export function validateProject(project) {
  const errors = [];
  const enabledSections = project.enabledSections || [];

  // === MANDATORY FIELDS ===

  // Title
  const titleError = validateString(project.title, 'Project Title', { required: true, maxLength: 200 });
  if (titleError) errors.push({ field: 'title', message: titleError });

  // Description
  const descError = validateString(project.description, 'Description', { required: true, maxLength: 1000 });
  if (descError) errors.push({ field: 'description', message: descError });

  // Label
  const labelError = validateString(project.label?.text, 'Label', { required: true, maxLength: 50 });
  if (labelError) errors.push({ field: 'label.text', message: labelError });

  // Authors (min 1)
  const authorsError = validateArray(project.authors, 'Authors', { minItems: 1, maxItems: 6 });
  if (authorsError) {
    errors.push({ field: 'authors', message: authorsError });
  } else {
    project.authors.forEach((author, index) => {
      errors.push(...validateAuthor(author, `authors[${index}]`));
    });
  }

  // Tags
  const tagsError = validateArray(project.tags, 'Tags', { minItems: 1, maxItems: 10 });
  if (tagsError) {
    errors.push({ field: 'tags', message: tagsError });
  } else {
    project.tags.forEach((tag, index) => {
      errors.push(...validateTag(tag, `tags[${index}]`));
    });
  }

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

  // === OPTIONAL SECTIONS (only validate if enabled) ===

  // Partners
  if (isSectionEnabled('partners', enabledSections) && project.partners?.length > 0) {
    project.partners.forEach((partner, index) => {
      errors.push(...validatePartner(partner, `partners[${index}]`));
    });
  }

  // Timeline
  if (isSectionEnabled('timeline', enabledSections)) {
    const milestonesError = validateArray(project.milestones, 'Timeline Milestones', { minItems: 2, maxItems: 10 });
    if (milestonesError) {
      errors.push({ field: 'milestones', message: milestonesError });
    } else {
      project.milestones.forEach((milestone, index) => {
        errors.push(...validateMilestone(milestone, `milestones[${index}]`));
      });
    }
  }

  // Impact
  if (isSectionEnabled('impact', enabledSections)) {
    const impactError = validateArray(project.impactItems, 'Impact Items', { minItems: 2, maxItems: 6 });
    if (impactError) {
      errors.push({ field: 'impactItems', message: impactError });
    } else {
      project.impactItems.forEach((item, index) => {
        errors.push(...validateImpactItem(item, `impactItems[${index}]`));
      });
    }
  }

  // Poster (if enabled, must have title and a file)
  if (isSectionEnabled('poster', enabledSections) && project.poster) {
    const posterTitleError = validateString(project.poster.title, 'Poster Title', { required: true, maxLength: 100 });
    if (posterTitleError) errors.push({ field: 'poster.title', message: posterTitleError });

    // Must have either an uploaded file or an existing URL
    if (!project.poster.file && !project.poster.url) {
      errors.push({ field: 'poster.file', message: 'A poster or diagram file is required' });
    }
  }

  return errors;
}

/**
 * Check if a project is valid
 * @param {Project} project
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
 * @param {Project} project
 * @returns {Project}
 */
export function cloneProject(project) {
  return JSON.parse(JSON.stringify(project));
}

/**
 * Convert project to API-safe format (remove File objects)
 * @param {Project} project
 * @returns {Object}
 */
export function projectToApiFormat(project) {
  const clone = cloneProject(project);

  // Remove File objects from authors
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
 * @param {Partial<Project>} partial
 * @returns {Project}
 */
export function mergeWithDefaults(partial) {
  const defaults = createEmptyProject();
  return {
    ...defaults,
    ...partial,
    label: { ...defaults.label, ...partial.label },
    conclusion: { ...defaults.conclusion, ...partial.conclusion },
    footer: { ...defaults.footer, ...partial.footer },
    metadata: { ...defaults.metadata, ...partial.metadata },
    enabledSections: partial.enabledSections || defaults.enabledSections,
  };
}

// =============================================================================
// MIGRATION - Convert old format to new
// =============================================================================

/**
 * Migrate old template-based project to new unified format
 * @param {Object} oldProject - Project in old format
 * @returns {Project} Project in new format
 */
export function migrateProject(oldProject) {
  // Already in new format
  if (Array.isArray(oldProject.enabledSections)) {
    return oldProject;
  }

  // Detect old format by templateType
  if (oldProject.templateType) {
    const wasResearch = oldProject.templateType === 'research';

    // Determine which sections have data
    const enabledSections = [];
    if (oldProject.partners?.length > 0) enabledSections.push('partners');
    if (oldProject.milestones?.length > 0) enabledSections.push('timeline');
    if (oldProject.impactItems?.length > 0) enabledSections.push('impact');
    if (oldProject.poster?.url) enabledSections.push('poster');

    return {
      ...oldProject,
      // Convert single author to array
      authors: wasResearch && oldProject.author
        ? [oldProject.author]
        : (oldProject.authors || [createEmptyAuthor()]),
      enabledSections,
      // Remove old fields
      templateType: undefined,
      author: undefined,
    };
  }

  // Unknown format, return as-is with defaults
  return mergeWithDefaults(oldProject);
}

// =============================================================================
// FORM FIELD CONFIGURATIONS
// =============================================================================

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
    placeholder: 'e.g., Pharis Fellowship, Research Project',
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
    placeholder: 'e.g., Data Collection Phase',
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

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  TEMPLATE_TYPES,
  FINDING_VARIANTS,
  FINDING_VARIANT_STYLES,
  FINDING_COLOR_PRESETS,
  PARTNER_COLOR_PRESETS,
  MILESTONE_COLOR_PRESETS,
  TAG_COLOR_PRESETS,
  IMPACT_ICON_PRESETS,
  FOOTER_VARIANTS,
  FORM_FIELD_CONFIG,

  // Factory functions
  generateId,
  createEmptyAuthor,
  createEmptyFinding,
  createEmptyPartner,
  createEmptyMilestone,
  createEmptyTag,
  createEmptyImpactItem,
  createEmptyConclusion,
  createEmptyPoster,
  createDefaultFooter,
  createEmptyLabel,
  createMetadata,
  createEmptyProject,
  initializeSectionData,
  clearSectionData,

  // Sample data
  SAMPLE_PROJECT,
  SAMPLE_RESEARCH_PROJECT,
  SAMPLE_DEVELOPMENT_PROJECT,

  // Validation
  validateString,
  validateArray,
  validateAuthor,
  validateFinding,
  validatePartner,
  validateMilestone,
  validateTag,
  validateImpactItem,
  validateProject,
  isProjectValid,

  // Utilities
  cloneProject,
  projectToApiFormat,
  mergeWithDefaults,
  migrateProject,
};

/**
 * 集中導出所有常量
 */

// 篩選常量
export {
    ALL_CATEGORIES,
    PRICING_OPTIONS,
    RATING_MAP,
    SORT_OPTIONS,
    DEFAULT_SORT,
    DEFAULT_CATEGORY,
    DEFAULT_PRICING,
    DEFAULT_RATING
} from "./filters"

// 導航常量
export {
    NAV_LINKS,
    SEARCH_ITEMS
} from "./navigation"

// UI 常量
export {
    ANIMATION_DURATION,
    BREAKPOINTS,
    Z_INDEX,
    MAX_DISPLAY,
    RATING_RANGE,
    INPUT_LIMITS
} from "./ui"

// 網站配置
export {
    SITE_CONFIG,
    SITE_STATS,
    SOCIAL_LINKS,
    EXTERNAL_LINKS
} from "./site"

// 標籤常量
export {
    CATEGORY_LABELS,
    getCategoryLabel,
    SUBMIT_CATEGORIES,
    SUBMIT_PRICING_OPTIONS,
    SUBMISSION_STATUS_LABELS,
    getSubmissionStatusLabel
} from "./labels"

// 用戶個人資料常量
export {
    JOB_ROLES,
    USAGE_PURPOSES,
    INDUSTRIES,
    COMPANY_SIZES,
    TECH_LEVELS,
    BUDGET_PREFERENCES,
    INTEREST_CATEGORIES,
    getJobRoleLabel,
    getUsagePurposeLabel,
    getIndustryLabel,
    getCompanySizeLabel,
    getTechLevelLabel,
    getBudgetPreferenceLabel,
    getInterestCategoryLabel,
} from "./user-profile"

export type {
    JobRole,
    UsagePurpose,
    Industry,
    CompanySize,
    TechLevel,
    BudgetPreference,
    InterestCategory,
    UserProfile,
} from "./user-profile"

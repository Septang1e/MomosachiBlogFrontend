const SYSTEM_NAME = "MOMOSACHI_BLOG"
export class cacheKey{
    static readonly TOKEN = `${SYSTEM_NAME}-token-key`
    static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name`
    static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status`
    static readonly USER_LIKE_STATUS = `${SYSTEM_NAME}-user-like-status`
    static readonly USER_VIEW_STATUS = `${SYSTEM_NAME}-user-view-status`
    static readonly IS_REMEMBERED_STATUS = `${SYSTEM_NAME}-is-remembered-status`
}
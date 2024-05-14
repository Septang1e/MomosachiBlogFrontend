import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import ArticlePage from "@/views/ArticlePage.vue";
import PaginationCard from "@/components/PaginationCard.vue";
import CategoryPage from "@/components/CategoryPage.vue";
import TagsCard from "@/components/TagsCard.vue";
import TagsPage from "@/components/TagsPage.vue";
import BackendPage from "@/views/backend/BackendPage.vue";
import LoginPage from "@/components/backend/LoginPage.vue";
import BackendDashboard from "@/components/backend/BackendDashboard.vue";
import AdminIndex from "@/components/backend/format/FormatPage.vue";
import ArticleUploader from "@/components/backend/UploadPage/ArticleUploader.vue";
import ToolsPage from "@/views/ToolsPage.vue";
import ToolsNavCard from "@/components/tools/tools-nav-card.vue";
import TrafficMonitoringCard from "@/components/tools/traffic-monitoring-card.vue";
import TagUploader from "@/components/backend/UploadPage/TagUploader.vue";
import CategoryUploader from "@/components/backend/UploadPage/CategoryUploader.vue";
import ArticleBin from "@/components/backend/recycle_bin/ArticleBin.vue";
import CategoryBin from "@/components/backend/recycle_bin/CategoryBin.vue";
import TagBin from "@/components/backend/recycle_bin/TagBin.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
          path: "/",
          name: "HomeView",
          component: Home,
          children: [
              {
                  path:"/tag/:id",
                  name:"tagPagination",
                  component : PaginationCard
              },
              {
                  path: "/category/:id",
                  name: "categoryPagination",
                  component : PaginationCard
              },
              {
                  path: '/',
                  name: 'homePagination',
                  component : PaginationCard
              },
              {
                  path: "/categories",
                  name: "Category",
                  component: CategoryPage
              },
              {
                  path: '/tags',
                  name: 'Tag',
                  component: TagsPage
              },
              {
                  path: '/search',
                  name: 'search',
                  component: PaginationCard
              }
          ],

      },
      {
          path: "/article/:id",
          name: "ArticlePage",
          component: ArticlePage
      },
      {
          path: "/tool",
          name: "toolsPage",
          component: ToolsPage,
          children: [
              {
                  path: '/tool',
                  name: 'navi',
                  component: ToolsNavCard,
              },
              {
                  path: '/tool/traffic_monitoring',
                  name: "TrafficMonitoring",
                  component: TrafficMonitoringCard
              }
          ]
      },
      {
          path: "/admin-backend",
          name: "Backend",
          component: BackendPage,
          children: [
              {
                  path: "/admin-backend/login",
                  name: 'backendPanelLoginPage',
                  component: LoginPage,
              },
              {
                  path: "/admin-backend/dashboard",
                  name: 'dashboard',
                  component: BackendDashboard,
                  children: [
                      {
                         path: '/admin-backend/index',
                         name: '文章',
                          component: ArticleUploader
                      },
                      {
                          path: '/admin-backend/tag',
                          name: '标签',
                          component: TagUploader
                      },
                      {
                          path: '/admin-backend/category',
                          name: '分类',
                          component: CategoryUploader
                      },
                      {
                          path: '/admin-backend/bin/article',
                          name: 'bin_article',
                          component: ArticleBin
                      },
                      {
                          path: '/admin-backend/bin/category',
                          name: 'bin_category',
                          component: CategoryBin
                      },
                      {
                          path: '/admin-backend/bin/tag',
                          name: 'bin_tag',
                          component: TagBin
                      }
                  ]
              }
          ]
      }
  ]
})

export default router

import React, { useState, useEffect } from "react";

import InteractionCallView from "views/calls/InteractionCallView.js";
import InteractionCallList from "views/calls/InteractionCallList.js";
import KpiReferencesList from "views/references/KpiReferencesList.js";
import KpiLegalViolationList from "views/references/KpiLegalViolationList.js";
// import TeamTaskList from "views/teamtasks/TeamTaskList.js";
import EnhancedTeamTasksList from "views/teamtasks/EnhancedTeamTasksList.js";

import EthicalRecruitmentMeetingsListView from "views/EthicalRecruitment/EthicalRecruitmentMeetingsListView";
import EthicalRecruitmentMeetingForm from "views/EthicalRecruitment/NewEthicalRecruitmentMeetingWizardView";
import RecruiterForm from "views/recruiters/RecruiterForm";
import SupplierCRCResponseForm from "views/suppliers/SupplierCRCResponseForm.js";
import RecruiterCRCResponseForm from "views/recruiters/RecruiterCRCResponseForm.js";
import PartnerUserLoginsList from "views/strategicpartners/PartnerUserLoginsList.js";
import SupplierKPIsList from "views/suppliers/SupplierKPIsList.js";
import SupplierKpiBulkUpdate from "views/suppliers/SupplierKpiBulkUpdate.js";
import BusinessResponseForm from "views/suppliers/BusinessResponseForm.js";
import BusinessResponsesList from "views/suppliers/BusinessResponsesList.js";
import SupplierList from "views/suppliers/SupplierList.js";
import SupplierForm from "views/suppliers/SupplierForm.js";
import SupplierCRCList from "views/suppliers/SupplierCRCList.js";
import RecruiterCRCList from "views/recruiters/RecruiterCRCList.js";
import PasswordResetPage from "views/Pages/PasswordResetPage";
import ChangePasswordForm from "views/users/ChangePasswordForm.js";

import RecruiterList from "views/recruiters/RecruiterList.js";

import FieldworkActivityForm from "views/TeamActivity/FieldworkActivityForm.js";
import MonthlyWorkerVoiceForm from "views/TeamActivity/MonthlyWorkerVoiceForm.js";

import StrategicPartnerList from "views/strategicpartners/StrategicPartnerList.js";
import StrategicPartnerResponseList from "views/strategicpartners/StrategicPartnerResponseList.js";
import StrategicPartnerForm from "views/strategicpartners/StrategicPartnerForm.js";
import SupplyChainForm from "views/strategicpartners/SupplyChainForm.js";
import StrategicPartnerResponseForm from "views/strategicpartners/StrategicPartnerResponseForm.js";
import SupplyChainList from "views/strategicpartners/SupplyChainList.js";

import KpiReferencesListDash from "views/Dashboard/KpiReferencesList";

import IssaraActivityDashboard from "views/Dashboard/IssaraActivityDashboard.js";
import SupplierMouThaiDashboard from "views/Dashboard/SupplierMouThaiDashboard.js";
import SupplierMouThaiDashboardOriginal from "views/Dashboard/SupplierMouThaiDashboardOriginal.js";
import SupplyChainDashboardWorker from "views/Dashboard/SupplyChainDashboardWorker.js";
import SupplyChainDashboardKpi from "views/Dashboard/SupplyChainDashboardKpi.js";
import SupplierKpiDashboard from "views/Dashboard/SupplierKpiDashboard.js";
//import RecruiterDashboard from "views/Dashboard/RecruiterDashboard.js";
import RecruiterKpiDashboard from "views/Dashboard/RecruiterKpiDashboard.js";
import ErrorPage from "views/Pages/ErrorPage.js";
import CmsAdminPanel from "views/CmsAdmin/CmsAdminPanel.js";

import LockScreenPage from "views/Pages/LockScreenPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import EnterCodePage from "views/Pages/EnterCodePage.js";

// @material-ui/icons
import RecruitmentIcon from '@material-ui/icons/ContactMail';
import BusinessIcon from '@material-ui/icons/BusinessCenter';
import CallIcon from '@material-ui/icons/Phone';
import DashboardIcon from "@material-ui/icons/Dashboard";
import DjangoIcon from '@material-ui/icons/AccountTree';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import ScoreIcon from '@material-ui/icons/Assessment';
import UpdateIcon from '@material-ui/icons/Update';
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import GamepadIcon from '@material-ui/icons/SportsEsports';
import FactCheckIcon from "@material-ui/icons/CheckBoxOutlined"
import PersonIcon from "@material-ui/icons/Person";
import ContactSupport from "@material-ui/icons/ContactPhone"
import SuppliersApartmentIcon from '@material-ui/icons/Apartment';
import IssaraIcon from '@material-ui/icons/AssistantPhoto';
import SupplierIcon from '@material-ui/icons/Apartment';
import RecruitmentDashboardIcon from '@material-ui/icons/Contacts';
import BarChartOutlined from '@material-ui/icons/BarChartOutlined';
import TeamIcon from '@material-ui/icons/AccessibilityNew';
import BookIcon from '@material-ui/icons/Book';
import TeamTasksIcon from '@material-ui/icons/Assignment';
import TransportationIcon from '@material-ui/icons/EmojiTransportation';
import loginStore from "redux/stores/LoginStore";
import PartnerLandingPage from "views/strategicpartners/PartnerLandingPage";
import SupplierKpisTimelineView from "views/Playground/SupplierKpisTimelineView"
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';
import TeamActivityDashboardIcon from '@material-ui/icons/NaturePeople';


var dashRoutes = {
  issaraGroupRoutes: [
    {
      collapse: true,
      name: "Playground",
      icon: GamepadIcon,
      state: "PlaygroundCollapse",
      views: [
        {
          path: "/playground-supplier-kpis-timeline-chart",
          name: "Supplier KPIs timeline",
          component: SupplierKpisTimelineView,
          layout: "/admin"
        },
      ],
      hidden: !loginStore.isDeveloper()
    },
    {
      collapse: true,
      name: "Worker Voice",
      rtlName: "صفحات",
      icon: ContactSupport,
      state: "workerVoiceCollapse",
      views: [
        {
          path: "/new-call",
          name: "Add Call",
          icon: AddIcon,
          component: InteractionCallView,
          layout: "/admin"
        },
        {
          path: "/calls",
          name: "View Calls",
          icon: ListIcon,
          component: InteractionCallList,
          layout: "/admin"
        }
      ]
    },
    {
      collapse: true,
      name: "Business Response",
      rtlName: "صفحات",
      icon: BusinessIcon,
      state: "businessCollapse",
      views: [
        {
          path: "/edit-business-response",
          name: "New Business Response",
          icon: AddIcon,
          component: BusinessResponseForm,
          layout: "/admin"
        },
        {
          path: "/business-responses",
          name: "View Business Responses",
          icon: ListIcon,
          component: BusinessResponsesList,
          layout: "/admin"
        }
      ]
    },
    {
      collapse: true,
      name: "Team Forms",
      icon: TeamIcon,
      state: "TeamFormsCollapse",
      views: [
        {
          path: "/fieldwork-activity",
          name: "Add activity",
          icon: AddIcon,
          component: FieldworkActivityForm,
          layout: "/admin"
        },
        {
          path: "/monthly-worker-voice",
          name: "Add monthly WV metrics",
          icon: AddIcon,
          component: MonthlyWorkerVoiceForm,
          layout: "/admin"
        }
      ]
    },
    {
      collapse: true,
      name: "Internal Dashboards",
      icon: TimelineRoundedIcon,
      state: "InternalDashboardsCollapse",
      views: [
        {
          path: "/recruiter-dashboard",
          name: "Recruiter Dashboard",
          icon: RecruitmentDashboardIcon,
          component: RecruiterKpiDashboard,
          layout: "/admin"
        },
        {
          path: "/global-suppliers-dashboard",
          name: "Suppliers dashboard",
          icon: SuppliersApartmentIcon,
          component: SupplierKpiDashboard,
          layout: "/admin"
        },
        {
          path: "/supplier-demand-dashboard-original",
          name: "MOU Data Dashboard",
          icon: TransportationIcon,
          component: SupplierMouThaiDashboardOriginal,
          layout: "/admin"
        },
        {
          path: "/issara-dashboard",
          name: "Team Activity Dashboard",
          icon: TeamActivityDashboardIcon,
          component: IssaraActivityDashboard,
          layout: "/admin"
        },
        {
          path: "/partner-login-activity",
          name: "Tracking Partner Logins",
          icon: EmojiPeopleIcon,
          component: PartnerUserLoginsList,
          layout: "/admin"
        },
        {
          name: "Tasks",
          path: "/team-tasks",
          name: "Team Tasks",
          icon: TeamTasksIcon,
          component: EnhancedTeamTasksList,
          layout: "/admin"
        }
      ]
    },
    {
      collapse: true,
      name: "Business Look-ups",
      rtlName: "صفحات",
      icon: BusinessIcon,
      state: "businessLookupsCollapse",
      views: [
        {
          path: "/suppliers-list",
          name: "View Suppliers",
          icon: ListIcon,
          component: SupplierList,
          layout: "/admin"
        },
        {
          path: "/recruiters",
          name: "View Recruiters",
          icon: ListIcon,
          component: RecruiterList,
          layout: "/admin"
        },
        {
          path: "/strategicpartners-list",
          name: "View Partners",
          icon: ListIcon,
          component: StrategicPartnerList,
          layout: "/admin"
        },
        {
          path: "/supplychains",
          name: "View Supply Chains",
          icon: ListIcon,
          component: SupplyChainList,
          layout: "/admin"
        },
        {
          path: "/edit-supplier",
          name: "Add Supplier",
          icon: AddIcon,
          component: SupplierForm,
          layout: "/admin",
          hidden: !loginStore.isIssaraManagement()
        },
        {
          path: "/edit-recruiter",
          name: "Add Recruiter",
          icon: AddIcon,
          component: RecruiterForm,
          layout: "/admin"
        },
        {
          path: "/edit-strategic-partner",
          name: "Add Strategic Partner",
          icon: AddIcon,
          component: StrategicPartnerForm,
          layout: "/admin"

        },
        {
          path: "/edit-supply-chain",
          name: "Add Supply Chain",
          icon: AddIcon,
          component: SupplyChainForm,
          layout: "/admin"
        }
      ]

    },
    {
      collapse: true,
      name: "ILM management",
      rtlName: "صفحات",
      icon: BusinessIcon,
      state: "managementCollapse",
      views: [
        {
          path: "/businesskpiupdates",
          name: "Kpi Updates",
          icon: UpdateIcon,
          component: SupplierKPIsList,
          layout: "/admin"
        },
        {
          path: "/supplier-kpi-bulk-update",
          name: "View Supplier KPIs bulk update",
          icon: UpdateIcon,
          component: SupplierKpiBulkUpdate,
          layout: "/admin",
          hidden: true
        },
        {
          path: "/businesscrcscoring",
          name: "Add Supplier CRC",
          icon: ScoreIcon,
          component: SupplierCRCResponseForm,
          layout: "/admin"
        },
        {
          path: "/suppliercrclist",
          name: "View Supplier CRCs",
          icon: ListIcon,
          component: SupplierCRCList,
          layout: "/admin"
        },
        {
          path: "/recruitercrcscoring",
          name: "Add Recruiter CRC",
          icon: ScoreIcon,
          component: RecruiterCRCResponseForm,
          layout: "/admin"
        },
        {
          path: "/recruitercrclist",
          name: "View Recruiter CRCs",
          icon: ListIcon,
          component: RecruiterCRCList,
          layout: "/admin"
        }

      ]
    }
    /*
    ,{
      collapse: true,
      name: "Ethical Recruitment",
      state: 'ethicalRecruitment',
      icon: RecruitmentIcon,
      views: [
        {
          path: "/new-ethical-recruitment-meeting",
          name: "Add Meeting",
          icon: AddIcon,
          component: EthicalRecruitmentMeetingForm,
          layout: "/admin"
        },
        {
          path: "/ethical-recruitment-meetings",
          name: "View Meetings",
          icon: ListIcon,
          component: EthicalRecruitmentMeetingsListView,
          layout: "/admin"
        }
      ]
    }*/
    , {
      collapse: true,
      name: "References",
      rtlName: "صفحات",
      icon: BookIcon,
      state: "referencesCollapse",
      views: [
        {
          path: "/kpi_list",
          name: "Kpi References",
          icon: ListIcon,
          component: KpiReferencesList,
          layout: "/admin"
        }, {
          path: "/kpi_legal_violation_list",
          name: "Legal Violations",
          icon: ListIcon,
          component: KpiLegalViolationList,
          layout: "/admin"
        }
      ]
    },
    {
      collapse: true,
      name: "SP",
      rtlName: "صفحاتصفحات",
      icon: DashboardIcon,
      state: "spScreensDashboardCollapse",
      views: [
        {
          path: "/global-buyer-landing",
          name: "Partner Overview",
          icon: HomeIcon,
          component: PartnerLandingPage,
          layout: "/admin"
        },
        {
          path: "/global-buyer-dashboard-workers",
          name: "Worker Demographics",
          icon: EmojiPeopleIcon,
          component: SupplyChainDashboardWorker,
          layout: "/admin"
        },
        {
          path: "/global-buyer-dashboard-kpi",
          name: "Worker-Reported Issues",
          icon: NotificationImportantIcon,
          component: SupplyChainDashboardKpi,
          layout: "/admin"

        },
        {
          path: "/partner-supplier-dashboard",
          name: "Suppliers",
          icon: BarChartOutlined,
          component: SupplierKpiDashboard,
          layout: "/admin"
        },
        {
          path: "/supplier-recruitment-dashboard",
          name: "Recruitment",
          icon: TransportationIcon,
          component: SupplierMouThaiDashboard,
          layout: "/admin"
        },
        {
          path: "/kpi-references-dashboard",
          name: " KPI References",
          icon: FactCheckIcon,
          component: KpiReferencesListDash,
          layout: "/admin"

        }
      ]
    },
    {
      collapse: true,
      name: "Admin",
      rtlName: "صفحاتصفحات",
      icon: DashboardIcon,
      state: "partnerLoginScreensDashboardCollapse",
      views: [{
        name: "DJANGO CMS",
        icon: DjangoIcon,
        path: "/cmsadmin",
        name: "Database Admin",
        mini: "DA",
        component: CmsAdminPanel,
        layout: "/admin"
      },
      {
        path: "/change-password",
        icon: PersonIcon,
        name: "Change Password",
        mini: "CP",
        component: ChangePasswordForm,
        layout: "/admin"
      }]

    },
    {
      path: "/reset-password",
      name: "Password Reset",
      component: PasswordResetPage,
      layout: "/auth",
      hidden: true
    }, {
      path: "/login-page",
      name: "Login Page",
      component: LoginPage,
      layout: "/auth",
      hidden: true
    }, {
      path: "/lock-screen-page",
      name: "Lock Screen Page",
      component: LockScreenPage,
      layout: "/auth",
      hidden: true
    }, {
      path: "/error-page",
      name: "Error Page",
      component: ErrorPage,
      layout: "/auth",
      hidden: true
    }
  ],

  partnerRoutes: [
    {
      path: "/global-buyer-landing",
      name: "Partner Overview",
      icon: HomeIcon,
      component: PartnerLandingPage,
      layout: "/admin"
    },
    {
      path: "/global-buyer-dashboard-workers",
      name: "Worker Demographics",
      icon: EmojiPeopleIcon,
      component: SupplyChainDashboardWorker,
      layout: "/admin"
    },
    {
      path: "/global-buyer-dashboard-kpi",
      name: "Worker-Reported Issues",
      icon: NotificationImportantIcon,
      component: SupplyChainDashboardKpi,
      layout: "/admin"

    },
    {
      path: "/partner-supplier-dashboard",
      name: "Suppliers",
      icon: BarChartOutlined,
      component: SupplierKpiDashboard,
      layout: "/admin"
    },
    {
      path: "/supplier-recruitment-dashboard",
      name: "Recruitment",
      icon: TransportationIcon,
      component: SupplierMouThaiDashboard,
      layout: "/admin"
    },
    {
      path: "/kpi-references-dashboard",
      name: " KPI References",
      icon: FactCheckIcon,
      component: KpiReferencesListDash,
      layout: "/admin"

    },
    {
      path: "/change-password",
      icon: PersonIcon,
      name: "Change Password",
      mini: "CP",
      component: ChangePasswordForm,
      layout: "/admin"
    }, {
      path: "/reset-password",
      name: "Password Reset",
      component: PasswordResetPage,
      layout: "/auth",
      hidden: true
    }, {
      path: "/login-page",
      name: "Login Page",
      component: LoginPage,
      layout: "/auth",
      hidden: true
    }, {
      path: "/enter_code",
      name: "Enter 2 Factor Code",
      component: EnterCodePage,
      layout: "/auth",
      hidden: true
    }, {
      path: "/lock-screen-page",
      name: "Lock Screen Page",
      component: LockScreenPage,
      layout: "/auth",
      hidden: true
    }, {
      path: "/error-page",
      name: "Error Page",
      component: ErrorPage,
      layout: "/auth",
      hidden: true
    }
  ],

  getDefaultRedirect: function () {
    return (loginStore.isGlobalPartner() === true) ? "/admin/global-buyer-landing" : "/admin/team-tasks";
  },

  getDefaultRoutes: function () {
    return (loginStore.isGlobalPartner() === true) ? this.partnerRoutes : this.issaraGroupRoutes;
  }


};

export default dashRoutes;

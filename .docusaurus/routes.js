
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/zodiac/',
    component: ComponentCreator('/zodiac/','755'),
    exact: true
  },
  {
    path: '/zodiac/__docusaurus/debug',
    component: ComponentCreator('/zodiac/__docusaurus/debug','9e7'),
    exact: true
  },
  {
    path: '/zodiac/__docusaurus/debug/config',
    component: ComponentCreator('/zodiac/__docusaurus/debug/config','521'),
    exact: true
  },
  {
    path: '/zodiac/__docusaurus/debug/content',
    component: ComponentCreator('/zodiac/__docusaurus/debug/content','b96'),
    exact: true
  },
  {
    path: '/zodiac/__docusaurus/debug/globalData',
    component: ComponentCreator('/zodiac/__docusaurus/debug/globalData','4e2'),
    exact: true
  },
  {
    path: '/zodiac/__docusaurus/debug/metadata',
    component: ComponentCreator('/zodiac/__docusaurus/debug/metadata','894'),
    exact: true
  },
  {
    path: '/zodiac/__docusaurus/debug/registry',
    component: ComponentCreator('/zodiac/__docusaurus/debug/registry','1d2'),
    exact: true
  },
  {
    path: '/zodiac/__docusaurus/debug/routes',
    component: ComponentCreator('/zodiac/__docusaurus/debug/routes','77c'),
    exact: true
  },
  {
    path: '/zodiac/markdown-page',
    component: ComponentCreator('/zodiac/markdown-page','0f0'),
    exact: true
  },
  {
    path: '/zodiac/docs',
    component: ComponentCreator('/zodiac/docs','8bd'),
    routes: [
      {
        path: '/zodiac/docs/intro',
        component: ComponentCreator('/zodiac/docs/intro','ea2'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-modifier-delay/add-modifier',
        component: ComponentCreator('/zodiac/docs/tutorial-modifier-delay/add-modifier','7a0'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-modifier-delay/get-started',
        component: ComponentCreator('/zodiac/docs/tutorial-modifier-delay/get-started','262'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-modifier-delay/review-modifier',
        component: ComponentCreator('/zodiac/docs/tutorial-modifier-delay/review-modifier','151'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-modifier-delay/tech-guide',
        component: ComponentCreator('/zodiac/docs/tutorial-modifier-delay/tech-guide','f12'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-bridge/finalize-parameters',
        component: ComponentCreator('/zodiac/docs/tutorial-module-bridge/finalize-parameters','40d'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-bridge/get-started',
        component: ComponentCreator('/zodiac/docs/tutorial-module-bridge/get-started','825'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-bridge/review-module',
        component: ComponentCreator('/zodiac/docs/tutorial-module-bridge/review-module','876'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-bridge/tech-guide',
        component: ComponentCreator('/zodiac/docs/tutorial-module-bridge/tech-guide','872'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-exit/add-module',
        component: ComponentCreator('/zodiac/docs/tutorial-module-exit/add-module','4c5'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-exit/designate-token',
        component: ComponentCreator('/zodiac/docs/tutorial-module-exit/designate-token','e8b'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-exit/get-started',
        component: ComponentCreator('/zodiac/docs/tutorial-module-exit/get-started','b3b'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-exit/review-module',
        component: ComponentCreator('/zodiac/docs/tutorial-module-exit/review-module','8b0'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-exit/tech-guide',
        component: ComponentCreator('/zodiac/docs/tutorial-module-exit/tech-guide','070'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-reality/add-template',
        component: ComponentCreator('/zodiac/docs/tutorial-module-reality/add-template','7d9'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-reality/finalize-parameters',
        component: ComponentCreator('/zodiac/docs/tutorial-module-reality/finalize-parameters','bf2'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-reality/get-started',
        component: ComponentCreator('/zodiac/docs/tutorial-module-reality/get-started','ae3'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-reality/integrate-snapshot',
        component: ComponentCreator('/zodiac/docs/tutorial-module-reality/integrate-snapshot','81d'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-reality/monitor-module',
        component: ComponentCreator('/zodiac/docs/tutorial-module-reality/monitor-module','1da'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-reality/review-module',
        component: ComponentCreator('/zodiac/docs/tutorial-module-reality/review-module','bc6'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/zodiac/docs/tutorial-module-reality/tech-guide',
        component: ComponentCreator('/zodiac/docs/tutorial-module-reality/tech-guide','da6'),
        exact: true,
        'sidebar': "tutorialSidebar"
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*')
  }
];

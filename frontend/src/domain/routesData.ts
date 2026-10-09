import { Route } from './types';

export const SAMPLE_ROUTES: Route[] = [
  {
    id: 'bmtc-500d',
    routeNumber: '500-D',
    routeName: 'Silk Board ⇄ Hebbal (Outer Ring Road)',
    agency: 'BMTC',
    baseFare: 5,
    farePerStage: 5,
    stops: [
      { id: 'sb-01', name: 'Silk Board', code: 'SLK', stageNumber: 1, isPopular: true },
      { id: 'sb-02', name: 'HSR Layout BDA Complex', code: 'HSR', stageNumber: 2, isPopular: true },
      { id: 'sb-03', name: 'Agara Junction', code: 'AGR', stageNumber: 3 },
      { id: 'sb-04', name: 'Iblur Junction', code: 'IBL', stageNumber: 4 },
      { id: 'sb-05', name: 'Bellandur EcoSpace', code: 'ESP', stageNumber: 5, isPopular: true },
      { id: 'sb-06', name: 'Kadubeesanahalli', code: 'KDH', stageNumber: 6 },
      { id: 'sb-07', name: 'Marathahalli Bridge', code: 'MAR', stageNumber: 7, isPopular: true },
      { id: 'sb-08', name: 'Kalamandir', code: 'KLM', stageNumber: 8 },
      { id: 'sb-09', name: 'Mahadevapura', code: 'MDP', stageNumber: 9 },
      { id: 'sb-10', name: 'KR Puram Railway Station', code: 'KRP', stageNumber: 10, isPopular: true },
      { id: 'sb-11', name: 'Banaswadi Ring Road', code: 'BSW', stageNumber: 11 },
      { id: 'sb-12', name: 'Nagawara Junction (Manyata)', code: 'NGW', stageNumber: 12, isPopular: true },
      { id: 'sb-13', name: 'Hebbal Bus Station', code: 'HBL', stageNumber: 13, isPopular: true }
    ]
  },
  {
    id: 'bmtc-335e',
    routeNumber: '335-E',
    routeName: 'Kempegowda Bus Station (Majestic) ⇄ ITPL',
    agency: 'BMTC',
    baseFare: 10,
    farePerStage: 5,
    stops: [
      { id: 'maj-01', name: 'Majestic KBS', code: 'KBS', stageNumber: 1, isPopular: true },
      { id: 'maj-02', name: 'Corporation', code: 'CRP', stageNumber: 2 },
      { id: 'maj-03', name: 'Richmond Circle', code: 'RMC', stageNumber: 3 },
      { id: 'maj-04', name: 'Domlur Flyover', code: 'DML', stageNumber: 4, isPopular: true },
      { id: 'maj-05', name: 'HAL Main Gate', code: 'HAL', stageNumber: 5 },
      { id: 'maj-06', name: 'Marathahalli Colony', code: 'MHC', stageNumber: 6, isPopular: true },
      { id: 'maj-07', name: 'Kundalahalli Gate', code: 'KHG', stageNumber: 7, isPopular: true },
      { id: 'maj-08', name: 'AECS Layout', code: 'AEC', stageNumber: 8 },
      { id: 'maj-09', name: 'CMRIT College', code: 'CMR', stageNumber: 9 },
      { id: 'maj-10', name: 'ITPL Main Gate', code: 'ITP', stageNumber: 10, isPopular: true }
    ]
  },
  {
    id: 'best-332',
    routeNumber: 'BEST 332',
    routeName: 'Kurla Station West ⇄ Andheri Bus Station East',
    agency: 'BEST',
    baseFare: 6,
    farePerStage: 4,
    stops: [
      { id: 'best-01', name: 'Kurla Station West', code: 'KLW', stageNumber: 1, isPopular: true },
      { id: 'best-02', name: 'Bail Bazar', code: 'BLB', stageNumber: 2 },
      { id: 'best-03', name: 'Kamani Junction', code: 'KMN', stageNumber: 3 },
      { id: 'best-04', name: 'Saki Naka Metro', code: 'SNK', stageNumber: 4, isPopular: true },
      { id: 'best-05', name: 'Marol Naka', code: 'MRN', stageNumber: 5, isPopular: true },
      { id: 'best-06', name: 'Airport Road Metro', code: 'ARM', stageNumber: 6 },
      { id: 'best-07', name: 'Andheri Bus Station East', code: 'ADE', stageNumber: 7, isPopular: true }
    ]
  }
];

export const getRouteById = (id: string): Route => {
  return SAMPLE_ROUTES.find((r) => r.id === id) || SAMPLE_ROUTES[0];
};

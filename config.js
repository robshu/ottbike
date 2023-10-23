'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/robshu/cl4hp53wp002f16s2hnd4coqu',
  accessToken:
    'pk.eyJ1Ijoicm9ic2h1IiwiYSI6ImNsNDhvcjQ5azB1OWIzZG5zazB1OG42bHMifQ.3zcPiI2Yp0B1Sdk27XH5mg',
  CSV: 'https://docs.google.com/spreadsheets/d/13l93xO1tm6AcuorVuIsAIt4dLTQ-oFFG05CscA9uxOw/gviz/tq?tqx=out:csv&sheet=Intersections',
  center: [-75.697932, 45.423492],
  zoom: 10,
  title: 'Protected Intersections',
  description:
    'A visualization of Ottawas growing cycle infrastructure',
  sideBarInfo: ['Name', 'Status'],
  popupInfo: ['Name', 'Status', 'Link', 'Year', 'Viewer'],
  statusTally: ['BuiltCounter', 'PlannedCounter'],
  filters: [
    {
      type: 'checkbox',
      title: 'Status',
      columnHeader: 'Status', // Case sensitive - must match spreadsheet entry
      listItems: ['Built', 'In Progress', 'Planned'], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },
  ],
};
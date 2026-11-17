'use strict';

const hotelRoles = {
  Reception: {
    title: 'Front Desk Associate',
    intro: 'Show how you handle arrivals, bookings and guest requests.',
    specialty: 'Front desk, reservations, guest relations',
    summary: 'Summarise your front desk background and the kind of guests or properties you have supported.',
    experienceLabel: 'Front desk experience',
    experience: 'Hotel · role · dates. Describe check-ins, reservations, billing and guest requests you handled.',
    educationLabel: 'Hospitality training & qualifications',
    education: 'Hospitality course, front desk training or relevant qualifications.',
    skillsLabel: 'Front desk skills',
    skills: 'Guest communication, cash handling, reservation management',
    fields: {
      hotelFocus: ['Booking & property systems', 'Property management systems, booking platforms or billing tools you have used.'],
      hotelOperations: ['Front desk responsibilities', 'Check-in and checkout, room assignments, payments or shift handovers.'],
      hotelStandards: ['Guest service & languages', 'Languages you speak and how you handled special requests or complaints.']
    },
    categories: ['Front desk', 'Reservations', 'Guest service', 'Training']
  },
  Chef: {
    title: 'Hotel Chef',
    intro: 'Show the cuisines, stations and kitchen services you can handle.',
    specialty: 'Cuisines, kitchen stations, banquet or à la carte service',
    summary: 'Summarise your kitchen background, cuisines and the services you have worked on.',
    experienceLabel: 'Kitchen experience',
    experience: 'Property · kitchen role · dates. Describe your station, service volume, dishes or events.',
    educationLabel: 'Culinary training & certificates',
    education: 'Culinary qualification, apprenticeship and food safety training you have completed.',
    skillsLabel: 'Kitchen skills',
    skills: 'Mise en place, batch prep, plating, inventory, team coordination',
    fields: {
      hotelFocus: ['Cuisines & kitchen stations', 'List the cuisines you can cook and a dish you can prepare from each. Include any kitchen stations you’ve worked on, such as hot kitchen, garde manger or pastry.'],
      hotelOperations: ['Menu & kitchen operations', 'Menu development, banquet service, ordering, stock rotation or team supervision.'],
      hotelStandards: ['Food safety & allergens', 'Hygiene routines, allergen checks or temperature controls you followed.']
    },
    categories: ['Plated dishes', 'Menu development', 'Kitchen operations', 'Training']
  },
  Staff: {
    title: 'Hotel Service Associate',
    intro: 'Show your department, shift duties and the service you deliver.',
    specialty: 'Housekeeping, food & beverage service, banquets or guest support',
    summary: 'Summarise your hotel department, service experience and daily responsibilities.',
    experienceLabel: 'Hotel service experience',
    experience: 'Property · department · dates. Describe your regular duties, shift handovers and guest support.',
    educationLabel: 'Service training & qualifications',
    education: 'Department training, housekeeping or food service courses, and relevant safety training.',
    skillsLabel: 'Hotel service skills',
    skills: 'Room preparation, table setup, guest support, shift handovers',
    fields: {
      hotelFocus: ['Department & shift duties', 'Housekeeping, food and beverage, banquets, guest services or another department.'],
      hotelOperations: ['Tools & equipment', 'Service equipment, housekeeping tools or work systems you have used.'],
      hotelStandards: ['Service & safety procedures', 'Cleaning checks, guest requests, safety procedures or escalation routines.']
    },
    categories: ['Service setup', 'Housekeeping', 'Guest support', 'Training']
  }
};

if (typeof module !== 'undefined') module.exports = hotelRoles;

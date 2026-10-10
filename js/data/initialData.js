/**
 * Initial Mock Data for Praesentia Prototype
 * Sourced directly from official CBIT department templates
 */

export const INITIAL_STUDENT = {
  rollNo: '160125737071',
  name: 'Aarav Sharma',
  dept: 'Information Technology',
  sec: 'IT-1',
  sem: 'II',
  academicYear: '2025-26',
}

export const INITIAL_FACULTY = {
  id: 'FAC-IT-101',
  name: 'Dr. Sagar Gujjunoori',
  designation: 'Associate Professor',
  dept: 'Department of Information Technology',
  academicYear: '2025-26',
}

export const INITIAL_ROSTER = [
  { sNo: 1, rollNo: '160125737071', name: 'Aarav Sharma', ct1: 9.0, ct2: 3.0, ass1: 10.0, ass2: 10.0, st1: null, st2: 5.0, st3: 4.5, att: 1.0 },
  { sNo: 2, rollNo: '160125737072', name: 'Bhavya Patel', ct1: 18.5, ct2: 19.0, ass1: 10.0, ass2: 10.0, st1: 4.5, st2: 5.0, st3: 4.5, att: 5.0 },
  { sNo: 3, rollNo: '160125737073', name: 'Chirag Reddy', ct1: 5.5, ct2: null, ass1: 10.0, ass2: 10.0, st1: 4.5, st2: 5.0, st3: 4.5, att: 3.0 },
  { sNo: 4, rollNo: '160125737074', name: 'Divya Rao', ct1: 10.0, ct2: 16.0, ass1: 10.0, ass2: 10.0, st1: 4.5, st2: 5.0, st3: 4.5, att: 5.0 },
  { sNo: 5, rollNo: '160125737075', name: 'Eshwar Verma', ct1: 13.5, ct2: 13.5, ass1: 10.0, ass2: 10.0, st1: 4.5, st2: 5.0, st3: 4.5, att: 5.0 },
  { sNo: 6, rollNo: '160125737076', name: 'Fathima Begum', ct1: 8.0, ct2: 7.0, ass1: 10.0, ass2: 10.0, st1: 4.5, st2: 5.0, st3: 4.5, att: 3.0 },
  { sNo: 7, rollNo: '160125737077', name: 'Gautam Krishna', ct1: 15.0, ct2: 16.5, ass1: 10.0, ass2: 10.0, st1: 4.5, st2: 5.0, st3: 4.5, att: 5.0 },
]

export const INITIAL_LAB_WEEKS = [
  {
    weekNumber: 1,
    date: '30-07-2026',
    entries: [
      { rollNo: '160125737071', pep: 4, exp: 8, pea: 3, rec: 5, cond: 5 },
      { rollNo: '160125737072', pep: 4, exp: 8, pea: 4, rec: 5, cond: 5 },
      { rollNo: '160125737073', pep: 3, exp: 7, pea: 3, rec: 5, cond: 4 },
      { rollNo: '160125737074', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737075', pep: 4, exp: 9, pea: 5, rec: 3, cond: 5 },
      { rollNo: '160125737076', pep: 4, exp: 8, pea: 4, rec: 4, cond: 5 },
      { rollNo: '160125737077', pep: 4, exp: 9, pea: 4, rec: 5, cond: 5 },
    ],
  },
  {
    weekNumber: 2,
    date: '06-08-2026',
    entries: [
      { rollNo: '160125737071', pep: 4, exp: 8, pea: 3, rec: 4, cond: 5 },
      { rollNo: '160125737072', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737073', pep: 4, exp: 7, pea: 4, rec: 5, cond: 4 },
      { rollNo: '160125737074', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737075', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737076', pep: 4, exp: 9, pea: 5, rec: 3, cond: 5 },
      { rollNo: '160125737077', pep: 4, exp: 9, pea: 4, rec: 5, cond: 5 },
    ],
  },
  {
    weekNumber: 3,
    date: '13-08-2026',
    entries: [
      { rollNo: '160125737071', pep: 4, exp: 8, pea: 3, rec: 4, cond: 5 },
      { rollNo: '160125737072', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737073', pep: 4, exp: 8, pea: 5, rec: 5, cond: 4 },
      { rollNo: '160125737074', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737075', pep: 5, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737076', pep: 4, exp: 9, pea: 5, rec: 5, cond: 4 },
      { rollNo: '160125737077', pep: 4, exp: 9, pea: 5, rec: 5, cond: 5 },
    ],
  },
  {
    weekNumber: 4,
    date: '20-08-2026',
    entries: [
      { rollNo: '160125737071', pep: 4, exp: 8, pea: 3, rec: 4, cond: 5 },
      { rollNo: '160125737072', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737073', pep: 4, exp: 8, pea: 5, rec: 5, cond: 4 },
      { rollNo: '160125737074', pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737075', pep: 5, exp: 8, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737076', pep: 4, exp: 9, pea: 5, rec: 5, cond: 5 },
      { rollNo: '160125737077', pep: 4, exp: 9, pea: 5, rec: 5, cond: 5 },
    ],
  },
]

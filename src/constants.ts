import Fuse from "fuse.js";
import { difference } from "lodash";

export const API = {
  LOGIN: '/signin',
  SIGNUP: '/signup',
  ME: "/me",

  ALL_USERS: "/users",
  UPDATE_USER: "/user/update",
  VERIFY_USER: "/verify",

  ENROLL_EVENTS: "/event/create",
  ENROLL_EVENT_ADMIN: "/event/admin/add",
  GET_ENROLLMENTS: "/event/fetchAll",
  MARK_ATTENDANCE: "/event/attendance",
  MARK_SINGLE_ATTENDANCE: "/event/markSingleAttendance",
  MARK_UNMARKED_ABSENT: "/event/attendance/kill",
  MARK_RESULT: "/event/result",
  DELETE_EVENT: "/event/delete",
  ADD_TEAM: "/event/team",
  PROMOTE_EVENTS: "/event/promote",

  GET_SPORTS: "/sport/fetchAll",
  TOGGLE_SPORT: "/sport/toggle",

  GET_ANNOUNCEMENTS: "/announcement/fetchAll",
  UPDATE_ANNOUNCEMENTS: "/announcement/update",
  CREATE_ANNOUNCEMENTS: "/announcement/create",
  DELETE_ANNOUNCEMENTS: "/announcement/hide",
}


export interface ConstantData {
  title: string;
  value: string;
}

export interface ConstantDataNumber {
  title: string;
  value: number;
}

export const GENDER: ConstantData[] = [
  { title: 'Female', value: 'Female' },
  { title: 'Male', value: 'Male' },
];

export const ATTENDANCE: ConstantData[] = [
  { title: 'Not Marked', value: 'not_marked' },
  { title: 'Present', value: 'present' },
  { title: 'Absent', value: 'absent' }
];

export const RESULT: ConstantDataNumber[] = [
  { title: 'None', value: 0 },
  { title: '1st', value: 1 },
  { title: '2nd', value: 2 },
  { title: '3rd', value: 3 },
]

export const USER_RESULT: ConstantDataNumber[] = [
  { title: 'Participant', value: 0 },
  { title: '1st', value: 1 },
  { title: '2nd', value: 2 },
  { title: '3rd', value: 3 },
]

export const ATTENDANCE_COLOR: any = {
  not_marked: "warning",
  present: "success",
  absent: "danger"
}

export const COURSE: ConstantData[] = [
  { title: 'B.Tech', value: 'b_tech' },
  { title: 'M.Tech', value: 'm_tech' },
  { title: 'B.Arch', value: 'b_arch' },
  { title: 'BCA', value: 'bca' },
  { title: 'MCA', value: 'mca' },
  { title: 'BBA', value: 'bba' },
  { title: 'MBA', value: 'mba' },
];

export const BRANCH: ConstantData[] = [
  { title: 'Computer Science', value: 'cse' },
  { title: 'Information Technology', value: 'it' },
  { title: 'Electrical Engineering', value: 'ee' },
  { title: 'Electronics Engineering', value: 'ece' },
  { title: 'Mechanical Engineering', value: 'me' },
  { title: 'Civil Engineering', value: 'ce' },
  { title: 'Production Engineering', value: 'pe' },
];

export const ARCHITECTURE: ConstantData[] = [
  { title: 'Bachelor of Architecture', value: 'b_arch' },
]

export const B_COMPUTER_APPLICATION: ConstantData[] = [
  { title: 'Bachelor of Computer Application', value: 'bca' },
];

export const M_COMPUTER_APPLICATION: ConstantData[] = [
  { title: 'Master of Computer Application', value: 'mca' },
];

export const B_BUSINESS_ADMINISTRATION: ConstantData[] = [
  { title: 'Bachelor of Business Administration', value: 'bba' },
];

export const M_BUSINESS_ADMINISTRATION: ConstantData[] = [
  { title: 'Master of Business Administration', value: 'mba' },
];

export const SPORT_TYPE = [
  { title: 'Field', value: 'field' },
  { title: 'Track', value: 'track' },
  { title: 'Tug of war', value: 'tugofwar' },
  { title: 'Relay', value: 'relay' }
];

export const TWO_YEARS: ConstantData[] = [
  { title: 'First', value: 'first' },
  { title: 'Second', value: 'second' },
];

export const THREE_YEARS: ConstantData[] = [
  { title: 'First', value: 'first' },
  { title: 'Second', value: 'second' },
  { title: 'Third', value: 'third' },
];

export const FOUR_YEARS: ConstantData[] = [
  { title: 'First', value: 'first' },
  { title: 'Second', value: 'second' },
  { title: 'Third', value: 'third' },
  { title: 'Fourth', value: 'fourth' },
];

export const FIVE_YEARS: ConstantData[] = [
  { title: 'First', value: 'first' },
  { title: 'Second', value: 'second' },
  { title: 'Third', value: 'third' },
  { title: 'Fourth', value: 'fourth' },
  { title: 'Fifth', value: 'fifth' },
];

export const mapValue = (key: string, selectedValue: string) => {
  let data: (ConstantData | ConstantDataNumber)[];
  switch (key) {
    case 'GENDER':
      data = GENDER;
      break;
    case 'ATTENDANCE':
      data = ATTENDANCE;
      break;
    case 'COURSE':
      data = COURSE;
      break;
    case 'BRANCH':
      data = [
        ...BRANCH,
        ...ARCHITECTURE,
        ...B_COMPUTER_APPLICATION,
        ...M_COMPUTER_APPLICATION,
        ...B_BUSINESS_ADMINISTRATION,
        ...M_BUSINESS_ADMINISTRATION
      ];
      break;
    case 'SPORT_TYPE':
      data = SPORT_TYPE;
      break;
    case 'RESULT':
      data = RESULT;
      break;
    case 'USER_RESULT':
      data = USER_RESULT;
      break;
    case 'YEARS':
      data = FIVE_YEARS;
      break;
    default:
      data = [];
  }
  if (data.length) {
    const found: ConstantData | ConstantDataNumber | undefined = data
      .find((node: ConstantData | ConstantDataNumber) => node.value.toString() === selectedValue?.toString());
    return found ? found.title : '';
  }
  return '';
}

export const REGEX = {
  PHONE_NUMBER: /^[0-9]{10}$/,
  UNIVERSITY_NO: /^[0-9]{7}$/,
  PASSWORD: /^[\s\S]{8,25}$/,
  EMAIL: /^[a-zA-Z0-9]+@gndec.ac.in$/i
}

export const mergeSearch = ({ search, data, options: newOptions, sort = () => { } }: { search: string; data: any, options: any, sort?: any }) => {
  const options = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    threshold: 0.3,
    ...newOptions
  };
  const fuse = new Fuse(data, options);
  const searchedItems = fuse.search(search).map((node) => node.item);
  if (searchedItems.length) {
    const allOtherObjects = (difference(data, searchedItems));
    return [...searchedItems.map((node: any) => ({ ...node, isSearched: true })), ...(allOtherObjects.sort(sort))]
  }
  return data.sort(sort);
}

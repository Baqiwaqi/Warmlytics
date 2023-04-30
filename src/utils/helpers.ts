// GEG	Enkel glas	 0,20 
// GDO	Glas dubbel standaard	 0,33 
// GHR+	Glas HR+	 0,60 
// GH++	Glas HR++	 1,00 

import moment from "moment";

type DataPoint = {
   date: Date;
   yield: number;
   percentage: number;
};

const data: DataPoint[] = [
   { date: new Date("2023-01-01"), yield: 3, percentage: 100 },
   { date: new Date("2023-02-01"), yield: 5, percentage: 97 },
   { date: new Date("2023-03-01"), yield: 8, percentage: 92 },
   { date: new Date("2023-04-01"), yield: 12, percentage: 84 },
   { date: new Date("2023-05-01"), yield: 13, percentage: 72 },
   { date: new Date("2023-06-01"), yield: 13, percentage: 59 },
   { date: new Date("2023-07-01"), yield: 13, percentage: 46 },
   { date: new Date("2023-08-01"), yield: 11, percentage: 33 },
   { date: new Date("2023-09-01"), yield: 10, percentage: 22 },
   { date: new Date("2023-10-01"), yield: 7, percentage: 12 },
   { date: new Date("2023-11-01"), yield: 3, percentage: 5 },
   { date: new Date("2023-12-01"), yield: 2, percentage: 2 },
];

export function getPercentage(date: Date) {
   const percentageOfMonth = calculateMonthProgress(date);

   const indexOf = data.findIndex((dp) => {
      return moment(dp.date).isSame(date, "month");
   });
   const dataPointB = data[indexOf]?.percentage as number;
   const dataPointA = data[indexOf + 1]?.percentage as number || 0;

   const steps = dataPointB - dataPointA;
   const stepPercantage = steps * (percentageOfMonth / 100);
   const c = dataPointB - stepPercantage;

   return c
}

function calculateMonthProgress(date: Date): number {
   const currentYear = date.getFullYear();
   const currentMonth = date.getMonth();
   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
   const dayOfMonth = date.getDate();

   const monthProgress = (dayOfMonth / daysInMonth) * 100;
   return monthProgress;
}

// SMO	Spouwmuur ongeisoleerd 	 0,40 
export function calculateYearPercentage(selectedDate: Date) {
   const lastDayOfYear = new Date(selectedDate.getFullYear(), 11, 31);
   const daysInYear = 365;
   const daysPast = moment(selectedDate).diff(moment(lastDayOfYear), "days") * -1;
   const percentage = (daysPast / daysInYear) * 100;

   return percentage;
}

export type CurrentInsulation = {
   id: number;
   code: string;
   name: string;
   rc: number;
}

export const CurrentInsulationArray: CurrentInsulation[] = [
   {
      id: 1,
      code: "GEG",
      name: "Enkel glas",
      rc: 0.2
   },
   {
      id: 2,
      code: "GDO",
      name: "Glas dubbel standaard",
      rc: 0.33
   },
   {
      id: 3,
      code: "GHR+",
      name: "Glas HR+",
      rc: 0.6
   },
   {
      id: 4,
      code: "GH++",
      name: "Glas HR++",
      rc: 1
   },
   {
      id: 5,
      code: "SMO",
      name: "Spouwmuur ongeisoleerd",
      rc: 0.4
   }
];

// V++	Vervanging Glas HR++	 1,00 	 -   	250
// VVG	Vervanging door vacuum glas	 2,00 	 -   	500
// mis	Muurisolatie schuim	 1,20 	 1,00 	28
// MI6	Muurisolatie 6cm	 1,40 	 1,00 	30

export type NewInsulation = {
   id: number;
   code: string;
   name: string;
   rc: number;
   ipv: number;
   cost: number;
}

export const NewInsulationArray: NewInsulation[] = [
   {
      id: 1,
      code: "V++",
      name: "Glas HR++ ",
      rc: 1,
      ipv: 0,
      cost: 250
   },
   {
      id: 2,
      code: "VVG",
      name: "Glas Vacuum",
      rc: 2,
      ipv: 0,
      cost: 500
   },
   {
      id: 3,
      code: "mis",
      name: "Muurisolatie Schuim",
      rc: 1.2,
      ipv: 1,
      cost: 28
   },
   {
      id: 4,
      code: "MI6",
      name: "Muurisolatie 6cm",
      rc: 1.4,
      ipv: 1,
      cost: 30
   }
];
